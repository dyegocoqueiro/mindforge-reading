import { AppShell } from "../../src/components/app-shell";
import { TrainingSession } from "../../src/components/training-session";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function TrainingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data: day } = user ? await supabase!.from("training_plan_days").select("id,day_number,total_minutes,blocks,training_plans!inner(user_id)").eq("training_plans.user_id", user.id).eq("status", "planned").order("day_number").limit(1).maybeSingle() : { data: null };
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Sessão adaptada</p><h1>Treino de hoje</h1><p>O motor usa sua última avaliação para distribuir o tempo sem premiar velocidade com baixa compreensão.</p></header>{user ? <TrainingSession day={day as { id: string; day_number: number; total_minutes: number; blocks: Array<{ skill: string; minutes: number; objective?: string }> } | null} /> : <section className="empty-inline"><h2>Entre para continuar</h2><a className="button button-accent" href="/entrar?next=/treino">Entrar</a></section>}</AppShell>;
}
