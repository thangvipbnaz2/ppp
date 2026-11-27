import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const index = line.indexOf("=");
  if (index < 1 || line.trimStart().startsWith("#")) continue;
  const key = line.slice(0, index).trim();
  const value = line.slice(index + 1).trim();
  if (!process.env[key]) process.env[key] = value;
}

function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || !process.stdin.setRawMode) {
      reject(new Error("Cần chạy script trong terminal tương tác."));
      return;
    }
    process.stdout.write(prompt);
    let value = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("data", onData);
      process.stdout.write("\n");
      resolve(value);
    };
    const onData = (char) => {
      if (char === "\u0003") {
        process.stdin.setRawMode(false);
        process.stdout.write("\n");
        process.exit(130);
      }
      if (char === "\r" || char === "\n") return finish();
      if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
      else value += char;
    };
    process.stdin.on("data", onData);
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
if (!url || !serviceKey || !configuredEmail) {
  throw new Error("Thiếu NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY hoặc ADMIN_EMAIL.");
}

const typedEmail = (await readHidden("Email admin (Enter để dùng ADMIN_EMAIL): ")).trim().toLowerCase();
const email = typedEmail || configuredEmail;
if (email !== configuredEmail) throw new Error("Email nhập vào phải trùng ADMIN_EMAIL trong .env.local.");
const password = await readHidden("Mật khẩu admin (không hiển thị): ");
if (password.length < 10) throw new Error("Mật khẩu phải có ít nhất 10 ký tự.");

const response = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password, email_confirm: true }),
});
const result = await response.json().catch(() => ({}));
if (!response.ok) {
  const message = result.message || result.msg || result.error_description || `HTTP ${response.status}`;
  if (/already|registered|exists/i.test(message)) {
    console.log(`Tài khoản admin đã tồn tại: ${email}`);
    process.exit(0);
  }
  throw new Error(`Không tạo được tài khoản admin: ${message}`);
}
console.log(`Đã tạo và xác nhận tài khoản admin: ${result.email || email}`);
