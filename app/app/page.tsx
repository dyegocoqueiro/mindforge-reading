import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, RefreshCw } from "lucide-react";
import { AppShell } from "../../src/components/app-shell";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <AppShell><section className="empty-state"><span>Configuração necessária</span><h1>Conecte o Supabase para usar a área do aluno.</h1><p>Este painel não fabrica progresso local. Configure as variáveis de ambiente e aplique as migrations para ativar conta, avaliação e treino persistentes.</p><Link className="button" href="/">Voltar ao início</Link></section></AppShell>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <AppShell><section className="empty-state"><span>Sessão necessária</span><h1>Entre para continuar seu plano.</h1><p>Seus resultados ficam associados à sua conta e protegidos por políticas de acesso.</p><Link className="button button-accent" href="/entrar">Entrar</Link></section></AppShell>;
  const [{ data: profile }, { data: metric }, { count: reviewCount }, { data: planDay }] = await Promise.all([
    supabase.from("profiles").select("display_name,current_level").eq("id", user.id).maybeSingle(),
    supabase.from("assessment_metrics").select("comprehension_score,delayed_retention_score,effective_reading_index,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("review_items").select("id", { count: "exact", head: true }).eq("user_id", user.id).lte("due_at", new Date().toISOString()),
    supabase.from("training_plan_days").select("id,day_number,total_minutes,status,training_plans!inner(user_id)").eq("training_plans.user_id", user.id).eq("status", "planned").order("day_number").limit(1).maybeSingle(),
  ]);
  const name = profile?.display_name?.split(" ")[0] ?? "leitor";
  return <AppShell userEmail={user.email}><header className="dashboard-head"><div><p className="eyebrow">Seu espaço de treino</p><h1>Olá, {name}.</h1><p>{metric ? "Seu próximo passo usa os resultados mais recentes." : "Comece pela avaliação para construir seu ponto de partida."}</p></div><Link className="button button-accent" href={metric ? "/treino" : "/avaliacao"}>{metric ? "Iniciar treino" : "Fazer avaliação"}<ArrowRight size={18} aria-hidden="true" /></Link></header><section className="metric-grid" aria-label="Resumo do progresso"><article><BookOpen aria-hidden="true" /><span>Compreensão</span><strong>{metric ? `${Math.round(metric.comprehension_score * 100)}%` : "—"}</strong><small>{metric ? "última avaliação" : "aguardando avaliação"}</small></article><article><BrainIcon /><span>Retenção</span><strong>{metric ? `${Math.round(metric.delayed_retention_score * 100)}%` : "—"}</strong><small>recordação atrasada</small></article><article><RefreshCw aria-hidden="true" /><span>Revisões</span><strong>{reviewCount ?? 0}</strong><small>itens no prazo de hoje</small></article></section><section className="today-card"><div><p className="eyebrow">Treino de hoje</p><h2>{planDay ? `Sessão ${planDay.day_number}` : "Seu plano começa com uma avaliação"}</h2><p>{planDay ? "Preparação, leitura, compreensão, memória e feedback." : "A avaliação mede cada dimensão separadamente e leva cerca de 25 a 35 minutos."}</p><span><Clock3 size={17} aria-hidden="true" /> {planDay?.total_minutes ?? "25–35"} minutos</span></div><Link className="button" href={planDay ? "/treino" : "/avaliacao"}>{planDay ? "Abrir sessão" : "Abrir avaliação"}</Link></section></AppShell>;
}

function BrainIcon() { return <span className="brain-mark" aria-hidden="true">M</span>; }
