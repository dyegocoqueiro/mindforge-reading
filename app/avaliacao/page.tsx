import { AppShell } from "../../src/components/app-shell";
import { AssessmentFlow } from "../../src/components/assessment-flow";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function AssessmentPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user || !supabase) return <AppShell><section className="empty-inline"><h1>Sessão necessária</h1><p>Entre uma vez para realizar e salvar sua avaliação.</p><a className="button button-accent" href="/entrar?next=/avaliacao">Entrar</a></section></AppShell>;
  const { data: passage } = await supabase.from("passage_versions").select("id,title,body,word_count,estimated_minutes,difficulty_level,passages!inner(status),questions(id,kind,prompt,position,question_options(id,label,position))").eq("passages.status", "published").eq("difficulty_level", 1).order("created_at").limit(1).maybeSingle();
  if (!passage) return <AppShell userEmail={user.email}><section className="empty-inline"><h1>Conteúdo indisponível</h1><p>O banco ainda não possui um texto publicado para a avaliação.</p></section></AppShell>;
  const questions = (passage.questions ?? []).sort((a, b) => a.position - b.position).map((question) => ({ id: question.id, kind: question.kind, prompt: question.prompt, options: question.question_options.sort((a, b) => a.position - b.position).map((option) => ({ id: option.id, label: option.label })) }));
  return <AppShell userEmail={user.email}><header className="page-head"><p className="eyebrow">Ponto de partida</p><h1>Avaliação inicial</h1><p>Leitura, compreensão, recordação, estabilidade e vocabulário em um fluxo salvo na sua conta.</p></header><AssessmentFlow passage={{ id: passage.id, title: passage.title, body: passage.body, wordCount: passage.word_count, estimatedMinutes: passage.estimated_minutes, difficultyLevel: passage.difficulty_level }} questions={questions} /></AppShell>;
}
