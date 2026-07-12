"use client";

import { useMemo, useState } from "react";
import { Check, Eye, Layers3, RotateCcw, ScanLine } from "lucide-react";
import { normalizePortuguese } from "../domain/content-analysis";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

type Mode = "reading_ruler" | "meaning_groups" | "active_recall";
const recallText = "A recuperação ativa fortalece o acesso à memória porque exige reconstruir uma ideia antes de conferir a resposta. O erro faz parte do ciclo quando é seguido por correção e nova tentativa.";

export function PracticeLab() {
  const [mode, setMode] = useState<Mode>("reading_ruler"), [message, setMessage] = useState("");
  return <div className="practice-lab"><nav aria-label="Modos de exercício"><button aria-pressed={mode === "reading_ruler"} onClick={() => { setMode("reading_ruler"); setMessage(""); }}><ScanLine /> Régua seletiva</button><button aria-pressed={mode === "meaning_groups"} onClick={() => { setMode("meaning_groups"); setMessage(""); }}><Layers3 /> Unidades de sentido</button><button aria-pressed={mode === "active_recall"} onClick={() => { setMode("active_recall"); setMessage(""); }}><RotateCcw /> Recuperação ativa</button></nav>{mode === "reading_ruler" && <RulerExercise onDone={(score) => save(mode, score, setMessage)} />}{mode === "meaning_groups" && <GroupsExercise onDone={(score) => save(mode, score, setMessage)} />}{mode === "active_recall" && <RecallExercise onDone={(score) => save(mode, score, setMessage)} />}{message && <p className="form-status success" role="status">{message}</p>}</div>;
}

async function save(kind: Mode, score: number, setMessage: (value: string) => void) {
  const client = createSupabaseBrowserClient(); if (!client) return setMessage("Banco indisponível.");
  const { data: { user } } = await client.auth.getUser(); if (!user) return setMessage("Sua sessão expirou. Entre novamente para salvar.");
  const { error } = await client.from("practice_attempts").insert({ user_id: user.id, exercise_kind: kind, score, duration_seconds: 0, metadata: { engine: "rules-2.0" } });
  setMessage(error ? error.message : `Tentativa salva: ${Math.round(score * 100)}%.`);
}

function RulerExercise({ onDone }: { onDone: (score: number) => void }) {
  const [line, setLine] = useState(0);
  const lines = ["Ler com intenção ajuda a escolher o ritmo adequado.", "A pontuação organiza grupos de sentido e pausas úteis.", "Depois da leitura, recuperar ideias revela o que permaneceu.", "A velocidade só conta quando compreensão e retenção permanecem estáveis."];
  return <section className="practice-card"><p className="eyebrow">Orientação visual</p><h2>Régua seletiva</h2><p>Use as setas para manter a linha atual em evidência. A régua é uma ferramenta de interface, não um treino ocular.</p><div className="ruler-lines">{lines.map((text, index) => <p className={index === line ? "active" : ""} key={text}>{text}</p>)}</div><div className="practice-actions"><button className="button button-ghost" disabled={line === 0} onClick={() => setLine((value) => value - 1)}>Linha anterior</button>{line < lines.length - 1 ? <button className="button button-accent" onClick={() => setLine((value) => value + 1)}>Próxima linha</button> : <button className="button button-accent" onClick={() => onDone(1)}><Check size={18} /> Concluir</button>}</div></section>;
}

function GroupsExercise({ onDone }: { onDone: (score: number) => void }) {
  const [choice, setChoice] = useState("");
  return <section className="practice-card"><p className="eyebrow">Fluência</p><h2>Unidades de sentido</h2><p>Qual divisão preserva melhor a relação da frase?</p><blockquote>Ao terminar a leitura, Marina fechou o livro e escreveu três ideias sem consultar.</blockquote><div className="choice-stack">{["Ao terminar / a leitura Marina / fechou o livro e / escreveu três ideias sem consultar.", "Ao terminar a leitura / Marina fechou o livro / e escreveu três ideias / sem consultar.", "Ao / terminar a leitura Marina fechou / o livro e escreveu / três ideias sem consultar."].map((option, index) => <label key={option}><input type="radio" name="groups" value={String(index)} checked={choice === String(index)} onChange={(event) => setChoice(event.target.value)} />{option}</label>)}</div><button className="button button-accent" disabled={!choice} onClick={() => onDone(choice === "1" ? 1 : 0)}>Verificar e salvar</button></section>;
}

function RecallExercise({ onDone }: { onDone: (score: number) => void }) {
  const [hidden, setHidden] = useState(false), [answer, setAnswer] = useState("");
  const score = useMemo(() => { const normalized = normalizePortuguese(answer); return ["recuperacao", "memoria", "reconstru", "correc", "tentativa"].filter((term) => normalized.includes(term)).length / 5; }, [answer]);
  return <section className="practice-card"><p className="eyebrow">Memória</p><h2>Recuperação ativa</h2>{hidden ? <><p>Sem olhar, explique a ideia central e o ciclo recomendado.</p><textarea rows={6} value={answer} onChange={(event) => setAnswer(event.target.value)} /><button className="button button-accent" disabled={answer.trim().length < 10} onClick={() => onDone(score)}>Analisar conceitos e salvar</button></> : <><div className="recall-source"><Eye size={20} /><p>{recallText}</p></div><button className="button button-accent" onClick={() => setHidden(true)}>Ocultar e recordar</button></>}</section>;
}
