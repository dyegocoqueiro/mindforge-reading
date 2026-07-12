import { AppShell } from "../../src/components/app-shell";
import { PreferencesForm } from "../../src/components/preferences-form";
import { createSupabaseServerClient } from "../../src/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const { data } = user ? await supabase!.from("user_preferences").select("available_minutes,font_size,line_height,theme,reminders_enabled").eq("user_id", user.id).maybeSingle() : { data: null };
  return <AppShell userEmail={user?.email}><header className="page-head"><p className="eyebrow">Acessibilidade e rotina</p><h1>Configurações</h1><p>O tema vale para todo o site. Tipografia e espaçamento afetam apenas os conteúdos de leitura e as tarefas.</p></header>{user ? <PreferencesForm defaults={{ minutes: data?.available_minutes ?? 20, fontSize: data?.font_size ?? 18, lineHeight: Number(data?.line_height ?? 1.6), theme: data?.theme ?? "system", reminders: data?.reminders_enabled ?? false }} /> : <section className="empty-inline"><h2>Entre para configurar</h2><a className="button" href="/entrar?next=/configuracoes">Entrar</a></section>}</AppShell>;
}
