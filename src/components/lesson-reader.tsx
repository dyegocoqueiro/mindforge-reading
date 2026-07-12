"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ScanLine } from "lucide-react";
import type { Lesson } from "../content/lessons";
import { collectionMeta } from "../content/lessons";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

export function LessonReader({ lesson, signedIn, initialComplete }: { lesson: Lesson; signedIn: boolean; initialComplete: boolean }) {
  const meta = collectionMeta[lesson.collection];
  async function save(score: number) {
    const client = await createSupabaseBrowserClient(); if (!client) return;
    const { data: { user } } = await client.auth.getUser(); if (!user) return;
    await Promise.all([client.from("learning_progress").upsert({ user_id: user.id, lesson_slug: lesson.slug, status: "completed", score, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }), client.from("practice_attempts").insert({ user_id: user.id, lesson_slug: lesson.slug, exercise_kind: "lesson_review", score, metadata: { edition: meta.edition } })]);
  }
  return <article className="lesson-reader"><Link className="back-link" href="/fundamentos"><ArrowLeft size={17} /> Voltar ao catálogo</Link><header><div className="lesson-cover-mini"><Image src={meta.cover} alt="" fill sizes="180px" /></div><div><p className="eyebrow">Lição {lesson.order} · {meta.edition}</p><h1>{lesson.title}</h1><p>{lesson.objective}</p>{initialComplete && <span className="complete-badge"><CheckCircle2 size={16} /> Concluída</span>}</div></header><ReaderBody lesson={lesson} signedIn={signedIn} onSave={save} /></article>;
}

function ReaderBody({ lesson, signedIn, onSave }: { lesson: Lesson; signedIn: boolean; onSave: (score: number) => Promise<void> }) {
  const [ruler, setRuler] = useState(false), [revealed, setRevealed] = useState(false), [message, setMessage] = useState("");
  async function finish(score: number) { if (!signedIn) return setMessage("Entre na sua conta para salvar esta conclusão."); await onSave(score); setMessage(score === 1 ? "Lição concluída e registrada." : "Lição salva para revisão. Ela continuará disponível no catálogo."); }
  return <><div className="lesson-tools"><button className="icon-control" onClick={() => setRuler((value) => !value)} aria-pressed={ruler}><ScanLine size={18} /> {ruler ? "Desligar régua" : "Ativar régua de leitura"}</button><span>{lesson.minutes} minutos</span></div><div className={`lesson-prose ${ruler ? "with-ruler" : ""}`}>{lesson.explanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<section><h2>Exemplo</h2><p>{lesson.example}</p></section><section className="activity-box"><h2>Atividade prática</h2><p>{lesson.activity}</p><textarea aria-label="Suas anotações da atividade" rows={5} placeholder="Faça sua atividade aqui. Este rascunho não é enviado para analytics." /></section><section className="lesson-review"><p className="eyebrow">Revisão ativa</p><h2>{lesson.reviewQuestion}</h2>{revealed ? <p className="review-answer">{lesson.reviewAnswer}</p> : <button className="button button-ghost" onClick={() => setRevealed(true)}>Revelar depois de responder</button>}{revealed && <div><button className="button button-accent" onClick={() => finish(1)}>Acertei sem consultar</button><button className="button button-ghost" onClick={() => finish(0.5)}>Preciso revisar</button></div>}{message && <p className="form-status success" role="status">{message}</p>}</section><aside className="references"><h2>Referências desta edição</h2><ul>{lesson.references.map((reference) => <li key={reference}>{reference}</li>)}</ul></aside></div></>;
}
