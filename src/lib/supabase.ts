import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"]?.trim();
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"]?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient<Database> | undefined;

export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
  client ??= createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export function getStoragePath(publicUrl: string, bucket: string): string | undefined {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  return index < 0 ? undefined : decodeURIComponent(publicUrl.slice(index + marker.length));
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const supabase = getSupabase();
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return false;
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}
