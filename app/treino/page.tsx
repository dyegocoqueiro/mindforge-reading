import { AppShell } from "../../src/components/app-shell";
import { TrainingSession } from "../../src/components/training-session";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function TrainingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: day } = user ? await supabase!.from("training_plan_days").select("id,day_number,total_minutes,blocks,training_plans!inner(user_id)").eq("training_plans.user_id", user.id).eq("status", "planned").order("day_number").limit(1).maybeSingle() : { data: null };
  const [{ data: attempts }, { data: passages }] = day ? await Promise.all([
    supabase!.from("training_block_attempts").select("block_key").eq("training_plan_day_id", day.id).eq("user_id", user!.id),
    supabase!.from("passage_versions").select("title,body,passages!inner(status)").eq("passages.status", "published").limit(12),
  ]) : [{ data: [] }, { data: [] }];
  const passage = passages?.length ? passages[(day!.day_number - 1) % passages.length] : null;
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Sessão adaptada</p><h1>Treino de hoje</h1><p>Cada bloco produz uma evidência real. A sessão só termina quando todas as atividades planejadas forem concluídas.</p></header>{user ? <TrainingSession day={day as Parameters<typeof TrainingSession>[0]["day"]} initialCompleted={attempts?.map((item) => item.block_key) ?? []} passage={passage} /> : <section className="empty-inline"><h2>Entre para continuar</h2><a className="button button-accent" href="/entrar?next=/treino">Entrar</a></section>}</AppShell>;
}
