import { NextResponse } from "next/server";

export function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !publishableKey || url.includes("your-project")) return NextResponse.json({ error: "Configuração indisponível." }, { status: 503 });
  return NextResponse.json({ url, publishableKey }, { headers: { "cache-control": "no-store, max-age=0" } });
}
