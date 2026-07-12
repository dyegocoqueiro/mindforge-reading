"use client";

import { useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "../lib/supabase/client";
import type { ReadingPreferences } from "./preference-sync";

const schema = z.object({
  minutes: z.coerce.number().refine((value) => [10, 15, 20, 30].includes(value)),
  fontSize: z.coerce.number().int().min(16).max(28),
  lineHeight: z.coerce.number().min(1.45).max(1.9),
  theme: z.enum(["light", "dark", "system"]),
});

type Defaults = ReadingPreferences & { minutes: number; reminders: boolean };

export function PreferencesForm({ defaults }: { defaults: Defaults }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function save(data: FormData) {
    const parsed = schema.safeParse(Object.fromEntries(data));
    if (!parsed.success) return setMessage("Revise os valores informados.");
    const client = createSupabaseBrowserClient();
    if (!client) return setMessage("Banco indisponível.");
    const { data: { user } } = await client.auth.getUser();
    if (!user) return setMessage("Entre para alterar suas preferências.");
    setSaving(true);
    const preferences = { theme: parsed.data.theme, fontSize: parsed.data.fontSize, lineHeight: parsed.data.lineHeight } satisfies ReadingPreferences;
    const { error } = await client.from("user_preferences").upsert({
      user_id: user.id,
      available_minutes: parsed.data.minutes,
      font_size: parsed.data.fontSize,
      line_height: parsed.data.lineHeight,
      theme: parsed.data.theme,
      reminders_enabled: data.get("reminders") === "on",
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) return setMessage(error.message);
    window.dispatchEvent(new CustomEvent("mindforge:preferences", { detail: preferences }));
    setMessage("Preferências salvas e aplicadas.");
  }
  return <form className="settings-form" action={save}>
    <label>Duração padrão<select name="minutes" defaultValue={defaults.minutes}><option value="10">10 minutos</option><option value="15">15 minutos</option><option value="20">20 minutos</option><option value="30">30 minutos</option></select></label>
    <label>Tamanho do texto das atividades <span className="field-hint">A interface permanece estável; somente leituras, lições e exercícios mudam.</span><input name="fontSize" type="range" min="16" max="28" defaultValue={defaults.fontSize} /></label>
    <label>Espaçamento das linhas<select name="lineHeight" defaultValue={defaults.lineHeight}><option value="1.45">Compacto</option><option value="1.6">Confortável</option><option value="1.75">Amplo</option><option value="1.9">Muito amplo</option></select></label>
    <label>Tema<select name="theme" defaultValue={defaults.theme}><option value="system">Do sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>
    <label className="check-row"><input name="reminders" type="checkbox" defaultChecked={defaults.reminders} /> Ativar lembretes internos</label>
    {message && <p role="status">{message}</p>}
    <button className="button" type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar e aplicar"}</button>
  </form>;
}
