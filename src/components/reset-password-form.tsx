"use client";

import { useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

const schema = z.string().min(8, "Use pelo menos 8 caracteres.");

export function ResetPasswordForm() {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(data: FormData) {
    setMessage("");
    const password = schema.safeParse(data.get("password"));
    if (!password.success) return setMessage(password.error.issues[0].message);
    if (password.data !== data.get("confirmation")) return setMessage("A confirmação de senha não corresponde.");
    const client = await createSupabaseBrowserClient();
    if (!client) return setMessage("Configure o Supabase para redefinir a senha.");
    setSaving(true);
    const { error } = await client.auth.updateUser({ password: password.data });
    setSaving(false);
    if (error) return setMessage(error.message);
    window.location.assign("/app");
  }
  return <form className="auth-form" action={submit}><label>Nova senha<input name="password" type="password" minLength={8} autoComplete="new-password" required /></label><label>Confirme a nova senha<input name="confirmation" type="password" minLength={8} autoComplete="new-password" required /></label>{message && <p className="form-status error" role="status">{message}</p>}<button className="button button-accent button-full" disabled={saving} type="submit">{saving ? "Salvando…" : "Salvar nova senha"}</button></form>;
}
