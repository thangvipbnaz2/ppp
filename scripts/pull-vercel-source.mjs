import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

const deploymentId = process.argv[2];
if (!/^dpl_[A-Za-z0-9]+$/.test(deploymentId || "")) throw new Error("Cần deployment ID hợp lệ.");
const root = path.resolve(import.meta.dirname, "..");
const target = path.resolve(root, "..", `vercel-production-source-${deploymentId}`);
const authPath = path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "com.vercel.cli", "Data", "auth.json");
const project = JSON.parse(fs.readFileSync(path.join(root, ".vercel", "project.json"), "utf8"));
const { token } = JSON.parse(fs.readFileSync(authPath, "utf8"));
if (!token) throw new Error("Vercel CLI chưa đăng nhập.");
if (fs.existsSync(target) && fs.readdirSync(target).length) throw new Error(`Thư mục đích đã tồn tại và không rỗng: ${target}`);
fs.mkdirSync(target, { recursive: true });

async function api(route, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const url = new URL(`https://api.vercel.com${route}`);
      url.searchParams.set("teamId", project.orgId);
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
      return response.json();
    } catch (error) { last = error; await new Promise(resolve => setTimeout(resolve, 750 * (i + 1))); }
  }
  throw last;
}

const tree = await api(`/v6/deployments/${deploymentId}/files`);
const sourceRoot = tree.find(entry => entry.name === "src" && entry.type === "directory");
if (!sourceRoot) throw new Error("Deployment không có cây source.");
const files = [];
function walk(node, prefix = "") {
  for (const child of node.children || []) {
    const relative = path.join(prefix, child.name);
    if (child.type === "directory") walk(child, relative);
    else if (child.type === "file") files.push({ ...child, relative });
  }
}
walk(sourceRoot);

let reused = 0, downloaded = 0;
async function materialize(file) {
  const destination = path.join(target, file.relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const local = path.join(root, file.relative);
  if (fs.existsSync(local) && fs.statSync(local).isFile()) {
    const digest = crypto.createHash("sha1").update(fs.readFileSync(local)).digest("hex");
    if (digest === file.uid) { fs.copyFileSync(local, destination); reused++; return; }
  }
  const payload = await api(`/v8/deployments/${deploymentId}/files/${file.uid}`);
  fs.writeFileSync(destination, Buffer.from(payload.data, "base64"));
  downloaded++;
}

const queue = [...files];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await materialize(queue.shift()); }));
console.log(JSON.stringify({ deploymentId, target, files: files.length, reused, downloaded }, null, 2));
