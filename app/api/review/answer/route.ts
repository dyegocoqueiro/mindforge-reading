import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizePortuguese } from "../../../../src/domain/content-analysis";
import { scheduleReview } from "../../../../src/domain/spaced-repetition";
import { createSupabaseServerClient } from "../../../../src/lib/supabase/server";

const schema = z.object({ itemId: z.string().uuid(), response: z.string().min(3).max(2000), rating: z.enum(["forgot","hard","effort","easy"]) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Resposta inválida." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco indisponível." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  const { data: item } = await supabase.from("review_items").select("id,answer,ease_factor,interval_days,repetitions").eq("id", parsed.data.itemId).eq("user_id", user.id).maybeSingle();
  if (!item) return NextResponse.json({ error: "Revisão não encontrada." }, { status: 404 });
  const response = normalizePortuguese(parsed.data.response);
  const concepts = ((item.answer as { concepts?: string[] }).concepts ?? []).map(normalizePortuguese);
  const hits = concepts.filter((concept) => concept.split(/\s+/).some((word) => word.length >= 4 && response.includes(word))).length;
  const score = concepts.length ? hits / concepts.length : Math.min(1, response.split(/\s+/).length / 20);
  const wasCorrect = score >= 0.5;
  const next = scheduleReview({ easeFactor: Number(item.ease_factor), intervalDays: item.interval_days, repetitions: item.repetitions }, parsed.data.rating, wasCorrect);
  const [{ error: attemptError }, { error: updateError }] = await Promise.all([
    supabase.from("review_attempts").insert({ review_item_id: item.id, user_id: user.id, rating: next.appliedRating, was_correct: wasCorrect, score }),
    supabase.from("review_items").update({ ease_factor: next.easeFactor, interval_days: next.intervalDays, repetitions: next.repetitions, due_at: next.dueAt.toISOString(), last_score: score, updated_at: new Date().toISOString() }).eq("id", item.id),
  ]);
  if (attemptError || updateError) return NextResponse.json({ error: attemptError?.message ?? updateError?.message }, { status: 500 });
  return NextResponse.json({ score, wasCorrect, dueAt: next.dueAt.toISOString(), intervalDays: next.intervalDays });
}
