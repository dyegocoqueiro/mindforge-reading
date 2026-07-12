"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

type Block = { skill: string; minutes: number; objective?: string };
const labels: Record<string, string> = { preparation: "Preparação", fluency: "Fluência", comprehension: "Compreensão", retention: "Memória", focus: "Estabilidade", vocabulary: "Vocabulário", metacognition: "Metacognição", feedback: "Feedback" };

export function TrainingSession({ day }: { day: { id: string; day_number: number; total_minutes: number; blocks: Block[] } | null }) {
  const [completed, setCompleted] = useState<string[]>([]), [message, setMessage] = useState(""), [saving, setSaving] = useState(false);
  if (!day) return <section className="empty-inline"><h2>Nenhuma sessão planejada</h2><p>Conclua a avaliação para o motor gratuito gerar seu plano persistente.</p><Link className="button button-accent" href="/avaliacao">Fazer avaliação</Link></section>;
  const currentDay = day;
  const blocks = currentDay.blocks.filter((block) => block.minutes > 0);
  const allDone = completed.length === blocks.length;
  async function finish() { const client = createSupabaseBrowserClient(); if (!client) return; setSaving(true); const { error } = await client.from("training_plan_days").update({ status: "completed" }).eq("id", currentDay.id); setSaving(false); setMessage(error ? error.message : "Sessão concluída. O próximo treino já pode ser aberto no painel."); }
  return <section className="training-session"><div className="training-summary"><div><p className="eyebrow">Sessão {currentDay.day_number}</p><h2>{currentDay.total_minutes} minutos com propósito</h2></div><span><Clock3 size={18} /> {completed.length}/{blocks.length} blocos</span></div><ol>{blocks.map((block) => { const done = completed.includes(block.skill); return <li className={done ? "done" : ""} key={block.skill}><button onClick={() => setCompleted((items) => done ? items.filter((item) => item !== block.skill) : [...items, block.skill])}>{done ? <CheckCircle2 /> : <Circle />}<span><strong>{labels[block.skill] ?? block.skill}</strong><small>{block.objective ?? "Concluir a atividade com atenção ao próprio desempenho."}</small></span><b>{block.minutes} min</b></button></li>; })}</ol><button className="button button-accent" disabled={!allDone || saving} onClick={finish}>{saving ? "Salvando…" : "Concluir sessão"}</button>{message && <p className="form-status success" role="status">{message}</p>}</section>;
}
