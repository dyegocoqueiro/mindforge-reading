import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewPrompt } from "../../../../../src/domain/training-exercises";
import { createSupabaseServerClient } from "../../../../../src/lib/supabase/server";

const schema = z.object({ dayId: z.string().uuid() });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Sessão inválida." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco indisponível." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  const [{ data: day }, { data: attempts }] = await Promise.all([
    supabase.from("training_plan_days").select("id,blocks,status,training_plans!inner(user_id)").eq("id", parsed.data.dayId).eq("training_plans.user_id", user.id).maybeSingle(),
    supabase.from("training_block_attempts").select("block_key,score").eq("training_plan_day_id", parsed.data.dayId).eq("user_id", user.id),
  ]);
  if (!day) return NextResponse.json({ error: "Sessão não encontrada." }, { status: 404 });
  if (day.status === "completed") {
    const { data: existing } = await supabase.from("training_session_summaries").select("average_score,review_items_created").eq("training_plan_day_id", parsed.data.dayId).eq("user_id", user.id).maybeSingle();
    return NextResponse.json({ average: Number(existing?.average_score ?? 0), reviewsCreated: existing?.review_items_created ?? 0, idempotent: true });
  }
  const required = (day.blocks as Array<{ skill: string; minutes: number }>).filter((block) => block.minutes > 0).map((block) => block.skill);
  const completed = new Set((attempts ?? []).map((attempt) => attempt.block_key));
  const missing = required.filter((skill) => !completed.has(skill));
  if (missing.length) return NextResponse.json({ error: "Conclua todos os blocos antes de encerrar.", missing }, { status: 409 });
  const scores: Record<string, number> = Object.fromEntries((attempts ?? []).map((attempt) => [attempt.block_key, Number(attempt.score)]));
  const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / Math.max(1, Object.keys(scores).length);
  const weakest = Object.entries(scores).sort((a,b) => a[1]-b[1]).slice(0, Math.min(3, required.length));
  const now = new Date();
  const reviews = weakest.map(([skill]) => { const [prompt, concepts] = reviewPrompt(skill); return { user_id: user.id, source_type: "training_session", source_id: parsed.data.dayId, prompt, answer: { concepts }, interval_days: 1, due_at: new Date(now.getTime() + 86400000).toISOString() }; });
  if (reviews.length) await supabase.from("review_items").insert(reviews);
  const { error: summaryError } = await supabase.from("training_session_summaries").upsert({ user_id: user.id, training_plan_day_id: parsed.data.dayId, average_score: average, skill_scores: scores, review_items_created: reviews.length, completed_at: now.toISOString() }, { onConflict: "training_plan_day_id" });
  if (summaryError) return NextResponse.json({ error: summaryError.message }, { status: 500 });
  await supabase.from("training_plan_days").update({ status: "completed" }).eq("id", parsed.data.dayId);
  return NextResponse.json({ average, reviewsCreated: reviews.length });
}
