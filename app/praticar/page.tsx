import { AppShell } from "../../src/components/app-shell";
import { PracticeLab } from "../../src/components/practice-lab";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function PracticePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Laboratório de leitura</p><h1>Prática guiada</h1><p>Exercícios curtos de orientação de linha, unidades de sentido e recuperação ativa.</p></header>{user ? <PracticeLab /> : <section className="empty-inline"><h2>Entre para praticar</h2><p>As tentativas são registradas para ajustar seu plano sem armazenar o texto das suas anotações.</p><a className="button button-accent" href="/entrar?next=/praticar">Entrar</a></section>}</AppShell>;
}
