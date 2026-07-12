"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

type Mode = "login" | "signup" | "recover";
const emailSchema = z.string().email("Informe um e-mail válido.");
const passwordSchema = z.string().min(8, "Use pelo menos 8 caracteres.");

export function AuthForm({ mode, redirectTo = "/app" }: { mode: Mode; redirectTo?: string }) {
  const [status, setStatus] = useState<{ kind: "error" | "success"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setStatus(null);
    const email = emailSchema.safeParse(formData.get("email"));
    if (!email.success) return setStatus({ kind: "error", message: email.error.issues[0].message });
    const client = createSupabaseBrowserClient();
    if (!client) return setStatus({ kind: "error", message: "O Supabase ainda não está configurado neste ambiente. Consulte o README para conectar o banco real." });
    setLoading(true);
    try {
      if (mode === "recover") {
        const { error } = await client.auth.resetPasswordForEmail(email.data, { redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha` });
        if (error) throw error;
        return setStatus({ kind: "success", message: "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação." });
      }
      const password = passwordSchema.safeParse(formData.get("password"));
      if (!password.success) return setStatus({ kind: "error", message: password.error.issues[0].message });
      if (mode === "login") {
        const { error } = await client.auth.signInWithPassword({ email: email.data, password: password.data });
        if (error) throw error;
        const safeNext = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/app";
        window.location.assign(safeNext);
        return;
      }
      const name = z.string().min(2, "Informe seu nome.").safeParse(formData.get("name"));
      const ageRange = z.enum(["13-17", "18-24", "25-34", "35-44", "45-59", "60+"]).safeParse(formData.get("ageRange"));
      if (!name.success || !ageRange.success) return setStatus({ kind: "error", message: name.success ? "Selecione sua faixa etária." : name.error.issues[0].message });
      if (formData.get("passwordConfirmation") !== password.data) return setStatus({ kind: "error", message: "A confirmação de senha não corresponde." });
      if (formData.get("terms") !== "on" || formData.get("privacy") !== "on") return setStatus({ kind: "error", message: "Aceite os termos e a política de privacidade para continuar." });
      const { error } = await client.auth.signUp({ email: email.data, password: password.data, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/verificar-email`, data: { name: name.data, age_range: ageRange.data, marketing_consent: formData.get("marketing") === "on" } } });
      if (error) throw error;
      setStatus({ kind: "success", message: "Conta criada. Confira seu e-mail para confirmar o cadastro." });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Não foi possível concluir. Tente novamente." });
    } finally { setLoading(false); }
  }

  return <form className="auth-form" action={submit} noValidate>
    {mode === "signup" && <><label>Nome<input name="name" autoComplete="name" required /></label><label>Faixa etária<select name="ageRange" defaultValue=""><option value="" disabled>Selecione</option><option>13-17</option><option>18-24</option><option>25-34</option><option>35-44</option><option>45-59</option><option>60+</option></select></label></>}
    <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
    {mode !== "recover" && <label>Senha<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required /></label>}
    {mode === "signup" && <label>Confirme a senha<input name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} required /></label>}
    {mode === "login" && <Link className="form-link" href="/recuperar-senha">Esqueci minha senha</Link>}
    {mode === "signup" && <fieldset className="consents"><legend>Consentimentos</legend><label><input name="terms" type="checkbox" required /> Li e aceito os termos de uso.</label><label><input name="privacy" type="checkbox" required /> Li e aceito a política de privacidade.</label><label><input name="marketing" type="checkbox" /> Quero receber comunicações (opcional).</label></fieldset>}
    {status && <p className={`form-status ${status.kind}`} role="status">{status.message}</p>}
    <button className="button button-accent button-full" disabled={loading} type="submit">{loading ? "Processando…" : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar instruções"}</button>
  </form>;
}
