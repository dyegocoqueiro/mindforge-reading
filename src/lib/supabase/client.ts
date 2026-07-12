import { createBrowserClient } from "@supabase/ssr";

type PublicSupabaseConfig = { url: string; publishableKey: string };
let configPromise: Promise<PublicSupabaseConfig | null> | null = null;

async function loadPublicConfig(): Promise<PublicSupabaseConfig | null> {
  const inlineUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const inlineKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (inlineUrl && inlineKey && !inlineUrl.includes("your-project")) return { url: inlineUrl, publishableKey: inlineKey };
  try {
    const response = await fetch("/api/supabase/config", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) return null;
    const data = await response.json() as Partial<PublicSupabaseConfig>;
    return typeof data.url === "string" && typeof data.publishableKey === "string" ? { url: data.url, publishableKey: data.publishableKey } : null;
  } catch { return null; }
}

export async function createSupabaseBrowserClient() {
  configPromise ??= loadPublicConfig();
  const config = await configPromise;
  if (!config) return null;
  return createBrowserClient(config.url, config.publishableKey);
}
