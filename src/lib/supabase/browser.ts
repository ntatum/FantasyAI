import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseBrowserConfig } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { url, key } = getSupabaseBrowserConfig();
  return createBrowserClient(url, key);
}
