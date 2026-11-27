import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "./config";

let cachedClient: SupabaseClient | null = null;

// Các route server chỉ dùng PostgREST/Auth/Storage, không đăng ký Realtime.
// Truyền transport rỗng giúp Node 20 không khởi tạo native WebSocket ngoài ý muốn.
class ServerOnlyWebSocketTransport {}

export function getAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  if (!url || !serviceRoleKey) return null;

  if (!cachedClient) {
    cachedClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: {
        transport: ServerOnlyWebSocketTransport as never,
      },
    });
  }
  return cachedClient;
}

export function createAdminClient(): SupabaseClient {
  const client = getAdminClient();
  if (!client) {
    throw new Error(
      "Supabase chưa được cấu hình. Cần NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong .env.local.",
    );
  }
  return client;
}
