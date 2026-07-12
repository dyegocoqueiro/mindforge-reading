"use client";
import { useState } from "react";
import { ArrowRight, Brain, CheckCircle2 } from "lucide-react";
import type { ReviewRating } from "../domain/spaced-repetition";

type Item = { id: string; prompt: string; due_at: string; source_type: string };
export function ReviewSession({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems); const [answer, setAnswer] = useState(""); const [rating, setRating] = useState<ReviewRating>("effort"); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  const item = items[0];
  if (!item) return <section className="empty-inline review-complete"><CheckCircle2 size={34}/><h2>Revisões em dia</h2><p>Novos itens aparecem após avaliações e sessões, no intervalo calculado pelo seu desempenho.</p></section>;
  async function submit() { setSaving(true); setMessage(""); const response = await fetch("/api/review/answer", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({ itemId:item.id, response:answer, rating }) }); const payload=await response.json() as { error?:string; score?:number; intervalDays?:number }; setSaving(false); if(!response.ok) return setMessage(payload.error??"Não foi possível salvar."); setMessage(`Análise: ${Math.round((payload.score??0)*100)}%. Próxima revisão em ${payload.intervalDays??1} dia(s).`); setItems((current)=>current.slice(1)); setAnswer(""); }
  return <section className="review-session"><div className="review-counter"><Brain size={20}/><span>{items.length} {items.length===1?"item":"itens"} para revisar</span></div><article><p className="eyebrow">Recuperação sem consulta</p><h2>{item.prompt}</h2><p>Escreva primeiro o que consegue reconstruir. A resposta não é armazenada; somente o resultado conceitual entra no histórico.</p><textarea rows={7} value={answer} onChange={(event)=>setAnswer(event.target.value)} placeholder="Explique com suas palavras…" /><fieldset><legend>Como foi recuperar?</legend>{([['forgot','Esqueci'],['hard','Difícil'],['effort','Com esforço'],['easy','Fácil']] as Array<[ReviewRating,string]>).map(([value,label])=><label key={value}><input type="radio" name="rating" value={value} checked={rating===value} onChange={()=>setRating(value)} />{label}</label>)}</fieldset><button className="button button-accent" disabled={saving||answer.trim().length<3} onClick={submit}>{saving?"Analisando…":<>Analisar e agendar <ArrowRight size={17}/></>}</button></article>{message&&<p className="form-status success" role="status">{message}</p>}</section>;
}
