import { AppShell } from "../../src/components/app-shell";
import { ReviewSession } from "../../src/components/review-session";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";
export default async function ReviewPage() {
  const supabase=await createSupabaseServerClient(); const { data: { user } }=supabase ? await supabase.auth.getUser() : { data:{ user:null } };
  const { data:items }=user ? await supabase!.from("review_items").select("id,prompt,due_at,source_type").eq("user_id",user.id).lte("due_at",new Date().toISOString()).order("due_at").limit(20) : {data:null};
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Memória adaptativa</p><h1>Revisões</h1><p>Responda sem consultar. Acertos avançam o intervalo; erros voltam cedo para uma nova tentativa.</p></header>{user ? <ReviewSession initialItems={items??[]} /> : <section className="empty-inline"><h2>Entre para revisar</h2><a className="button" href="/entrar?next=/revisao">Entrar</a></section>}</AppShell>;
}
