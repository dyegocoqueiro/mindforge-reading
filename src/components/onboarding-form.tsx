"use client";

import { useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

const onboardingSchema = z.object({
  goal: z.string().min(2), interest: z.string().min(2), minutes: z.coerce.number().refine((value) => [10, 15, 20, 30].includes(value)),
  frequency: z.coerce.number().int().min(1).max(7), device: z.enum(["celular", "computador", "tablet"]), preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
  fontSize: z.coerce.number().int().min(16).max(28), theme: z.enum(["light", "dark", "system"]), perceivedDifficulty: z.enum(["leve", "moderada", "desafiadora"]),
  readingHabit: z.string().min(2), distractions: z.string().min(2), textLength: z.enum(["curtos", "longos", "variados"]), reminders: z.boolean(),
});

export function OnboardingForm() {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function save(data: FormData) {
    const parsed = onboardingSchema.safeParse({ goal: data.get("goal"), interest: data.get("interest"), minutes: data.get("minutes"), frequency: data.get("frequency"), device: data.get("device"), preferredTime: data.get("preferredTime"), fontSize: data.get("fontSize"), theme: data.get("theme"), perceivedDifficulty: data.get("perceivedDifficulty"), readingHabit: data.get("readingHabit"), distractions: data.get("distractions"), textLength: data.get("textLength"), reminders: data.get("reminders") === "on" });
    if (!parsed.success) return setMessage("Revise os campos e tente novamente.");
    const client = await createSupabaseBrowserClient();
    if (!client) return setMessage("Configure o Supabase para salvar seu perfil.");
    setSaving(true);
    const { data: { user } } = await client.auth.getUser();
    if (!user) { setSaving(false); return setMessage("Entre para salvar seu perfil."); }
    const value = parsed.data;
    const { error } = await client.from("user_preferences").upsert({ user_id: user.id, goals: [value.goal, `dificuldade:${value.perceivedDifficulty}`, `hábito:${value.readingHabit}`, `distrações:${value.distractions}`, `textos:${value.textLength}`], interests: [value.interest], available_minutes: value.minutes, weekly_frequency: value.frequency, primary_device: value.device, preferred_time: value.preferredTime, font_size: value.fontSize, theme: value.theme, reminders_enabled: value.reminders });
    setSaving(false);
    if (error) return setMessage(error.message);
    window.location.assign("/avaliacao");
  }
  return <form className="onboarding-form" action={save}><fieldset><legend>Objetivo e rotina</legend><label>Objetivo principal<input name="goal" placeholder="Ex.: compreender melhor textos de estudo" required /></label><label>Leituras de interesse<input name="interest" placeholder="Ex.: ciência e tecnologia" required /></label><div className="form-grid"><label>Tempo disponível<select name="minutes" defaultValue="20"><option value="10">10 minutos</option><option value="15">15 minutos</option><option value="20">20 minutos</option><option value="30">30 minutos</option></select></label><label>Dias por semana<input name="frequency" type="number" min="1" max="7" defaultValue="5" required /></label><label>Dispositivo principal<select name="device"><option value="celular">Celular</option><option value="computador">Computador</option><option value="tablet">Tablet</option></select></label><label>Horário preferido<input name="preferredTime" type="time" defaultValue="19:00" required /></label></div></fieldset><fieldset><legend>Experiência de leitura</legend><div className="form-grid"><label>Tamanho da fonte<input name="fontSize" type="number" min="16" max="28" defaultValue="18" /></label><label>Aparência<select name="theme" defaultValue="system"><option value="system">Do sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label><label>Dificuldade percebida<select name="perceivedDifficulty"><option value="leve">Leve</option><option value="moderada">Moderada</option><option value="desafiadora">Desafiadora</option></select></label><label>Extensão preferida<select name="textLength"><option value="curtos">Textos curtos</option><option value="longos">Textos longos</option><option value="variados">Variados</option></select></label></div><label>Como é seu hábito atual?<input name="readingHabit" placeholder="Ex.: leio três vezes por semana" required /></label><label>Quais distrações aparecem com frequência?<input name="distractions" placeholder="Ex.: notificações e ruído" required /></label><label className="check-row"><input name="reminders" type="checkbox" /> Quero lembretes internos</label></fieldset>{message && <p className="form-status error" role="status">{message}</p>}<button className="button button-accent" disabled={saving} type="submit">{saving ? "Salvando…" : "Salvar e iniciar avaliação"}</button></form>;
}
