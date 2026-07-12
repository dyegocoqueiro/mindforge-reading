"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock3, Play, Square } from "lucide-react";
import { trainingLabels, type TrainingResponse } from "../domain/training-exercises";

type Block = { skill: string; minutes: number; objective?: string };
type Day = { id: string; day_number: number; total_minutes: number; blocks: Block[] };

export function TrainingSession({ day, initialCompleted = [], passage }: { day: Day | null; initialCompleted?: string[]; passage?: { title: string; body: string } | null }) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [active, setActive] = useState<Block | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  if (!day) return <section className="empty-inline"><h2>Nenhuma sessão planejada</h2><p>Conclua a avaliação para o motor adaptativo gerar seu plano persistente.</p><Link className="button button-accent" href="/avaliacao">Fazer avaliação</Link></section>;
  const currentDay = day;
  const blocks = currentDay.blocks.filter((block) => block.minutes > 0);
  const allDone = blocks.every((block) => completed.includes(block.skill));
  async function completeBlock(skill: string, response: TrainingResponse) {
    setSaving(true); setMessage("");
    const result = await fetch("/api/training/block/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ dayId: currentDay.id, skill, response }) });
    const payload = await result.json() as { error?: string; feedback?: string }; setSaving(false);
    if (!result.ok) return setMessage(payload.error ?? "Não foi possível salvar o bloco.");
    setCompleted((items) => items.includes(skill) ? items : [...items, skill]); setMessage(payload.feedback ?? "Bloco concluído."); setActive(null);
  }
  async function finish() {
    setSaving(true); setMessage("");
    const result = await fetch("/api/training/session/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ dayId: currentDay.id }) });
    const payload = await result.json() as { error?: string; reviewsCreated?: number }; setSaving(false);
    setMessage(result.ok ? `Sessão concluída. ${payload.reviewsCreated ?? 0} revisões foram programadas para fortalecer os pontos mais frágeis.` : payload.error ?? "Não foi possível concluir.");
    if (result.ok) setTimeout(() => window.location.assign("/app"), 1400);
  }
  if (active) return <section className="training-drill"><button className="back-link" onClick={() => setActive(null)}><ArrowLeft size={17} /> Voltar à sessão</button><div className="drill-heading"><div><p className="eyebrow">Sessão {day.day_number} · {active.minutes} min sugeridos</p><h2>{trainingLabels[active.skill]}</h2><p>{active.objective}</p></div><span><Clock3 size={18} /> Evidência salva somente ao concluir</span></div><Drill skill={active.skill} passage={passage} saving={saving} onComplete={(response) => completeBlock(active.skill, response)} />{message && <p className="form-status error" role="status">{message}</p>}</section>;
  return <section className="training-session"><div className="training-summary"><div><p className="eyebrow">Sessão {day.day_number}</p><h2>{day.total_minutes} minutos com propósito</h2><p>Abra cada treino, realize a tarefa e conclua. O check não pode ser marcado manualmente.</p></div><span><Clock3 size={18} /> {completed.length}/{blocks.length} blocos</span></div><ol>{blocks.map((block) => { const done = completed.includes(block.skill); return <li className={done ? "done" : ""} key={block.skill}><button onClick={() => setActive(block)}><span className="block-status">{done ? <CheckCircle2 /> : <Circle />}</span><span><strong>{trainingLabels[block.skill] ?? block.skill}</strong><small>{block.objective ?? "Concluir a atividade com atenção ao desempenho."}</small></span><b>{done ? "Concluído" : `${block.minutes} min`}</b></button></li>; })}</ol><button className="button button-accent" disabled={!allDone || saving} onClick={finish}>{saving ? "Analisando…" : "Concluir sessão"}</button>{message && <p className="form-status success" role="status">{message}</p>}</section>;
}

function Drill({ skill, passage, saving, onComplete }: { skill: string; passage?: { title: string; body: string } | null; saving: boolean; onComplete: (response: TrainingResponse) => void }) {
  const [text, setText] = useState(""); const [choice, setChoice] = useState(""); const [rating, setRating] = useState(50); const [seconds, setSeconds] = useState(0); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer); }, [running]);
  if (skill === "fluency" || skill === "focus") return <div className="drill-card"><h3>{skill === "fluency" ? "Leitura com ritmo verificável" : "Bloco de estabilidade na tarefa"}</h3><p>{skill === "fluency" ? "Leia agrupando palavras pela pontuação. O cronômetro conta apenas o período ativo." : "Defina uma intenção, retire uma distração e leia até o fim do bloco. Se se perder, retome pela última ideia compreendida."}</p><article className="drill-reading"><h4>{passage?.title ?? "Leitura com intenção"}</h4><p>{passage?.body ?? "Uma leitura produtiva equilibra ritmo, compreensão e recuperação. A velocidade só é útil quando o sentido permanece acessível depois."}</p></article><div className="timer-control"><strong>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</strong><button className="button button-ghost" onClick={() => setRunning((value) => !value)}>{running ? <><Square size={17}/> Pausar</> : <><Play size={17}/> {seconds ? "Retomar" : "Iniciar"}</>}</button></div><label>Registre a ideia principal em uma frase<textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} /></label><button className="button button-accent" disabled={saving || seconds < 10 || text.trim().length < 12} onClick={() => onComplete({ text, activeSeconds: seconds })}>Concluir treino</button></div>;
  if (skill === "comprehension" || skill === "vocabulary") { const options = skill === "comprehension" ? [["detail","A ideia central é sempre a frase mais longa."],["evidence","A ideia central organiza os detalhes e pode ser sustentada por evidências."],["speed","A ideia central depende do tempo de leitura."]] : [["guess","Escolher o primeiro significado conhecido."],["context","Usar pistas da frase, do parágrafo e depois verificar a hipótese."],["skip","Ignorar sempre a palavra."]]; return <div className="drill-card"><h3>{skill === "comprehension" ? "Ideia central e evidência" : "Vocabulário em contexto"}</h3><p>{skill === "comprehension" ? "Qual afirmação descreve uma estratégia confiável de compreensão?" : "Qual processo é mais seguro para inferir uma palavra desconhecida?"}</p><div className="choice-stack">{options.map(([value,label]) => <label key={value}><input type="radio" name="drill-choice" value={value} checked={choice===value} onChange={(event)=>setChoice(event.target.value)} />{label}</label>)}</div><button className="button button-accent" disabled={!choice || saving} onClick={() => onComplete({ choice })}>Verificar e concluir</button></div>; }
  const copy = skill === "preparation" ? ["Prepare a tarefa", "Escreva seu objetivo e uma mudança concreta no ambiente.", "Ex.: compreender a tese; silenciar notificações."] : skill === "retention" ? ["Recuperação ativa", "Sem consultar, explique a ideia, uma evidência e a relação entre elas.", "Reconstrua com suas palavras."] : skill === "metacognition" ? ["Calibre sua confiança", "Explique o que você compreendeu e indique sua confiança antes de conferir.", "O motor compara autorrelato e evidência, sem diagnóstico."] : ["Feedback da sessão", "Registre o que funcionou e qual será seu próximo ajuste.", "Não inclua informações pessoais sensíveis."];
  return <div className="drill-card"><h3>{copy[0]}</h3><p>{copy[1]}</p><label>{copy[2]}<textarea value={text} onChange={(event)=>setText(event.target.value)} rows={6} /></label>{(skill === "metacognition" || skill === "feedback" || skill === "preparation") && <label>{skill === "feedback" ? "Dificuldade percebida" : "Confiança / prontidão"}<input type="range" min="0" max="100" value={rating} onChange={(event)=>setRating(Number(event.target.value))} /><span>{rating}%</span></label>}<button className="button button-accent" disabled={saving || text.trim().length < 12} onClick={() => onComplete({ text, rating })}>Concluir treino</button></div>;
}
