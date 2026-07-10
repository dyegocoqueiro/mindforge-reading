import Link from "next/link";
import { AppShell } from "../../src/components/app-shell";
import { OnboardingForm } from "../../src/components/onboarding-form";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Seu ponto de partida</p><h1>Prepare seu plano</h1><p>Preferências educacionais e de leitura, sem perguntas médicas.</p></header>{user ? <OnboardingForm /> : <section className="empty-inline"><h2>Entre para continuar</h2><p>Seu perfil precisa ficar protegido na sua conta.</p><Link className="button button-accent" href="/entrar">Entrar</Link></section>}</AppShell>;
}
