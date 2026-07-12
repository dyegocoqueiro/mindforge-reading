import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreTrainingBlock } from "../../../../../src/domain/training-exercises";
import { createSupabaseServerClient } from "../../../../../src/lib/supabase/server";

const schema = z.object({ dayId: z.string().uuid(), skill: z.enum(["preparation","fluency","comprehension","retention","focus","vocabulary","metacognition","feedback"]), response: z.object({ text: z.string().max(2000).optional(), choice: z.string().max(80).optional(), rating: z.number().min(0).max(100).optional(), activeSeconds: z.number().int().min(0).max(3600).optional() }) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Resposta de treino inválida." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco indisponível." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  const { data: day } = await supabase.from("training_plan_days").select("id,training_plans!inner(user_id)").eq("id", parsed.data.dayId).eq("training_plans.user_id", user.id).maybeSingle();
  if (!day) return NextResponse.json({ error: "Sessão não encontrada." }, { status: 404 });
  const score = scoreTrainingBlock(parsed.data.skill, parsed.data.response);
  const summary = { response_length: parsed.data.response.text?.trim().length ?? 0, choice: parsed.data.response.choice ?? null, rating: parsed.data.response.rating ?? null };
  const { error } = await supabase.from("training_block_attempts").upsert({ user_id: user.id, training_plan_day_id: parsed.data.dayId, block_key: parsed.data.skill, score, duration_seconds: parsed.data.response.activeSeconds ?? 0, result_summary: summary, completed_at: new Date().toISOString() }, { onConflict: "training_plan_day_id,block_key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ score, feedback: score >= 0.7 ? "Bloco concluído. A evidência foi incorporada ao seu perfil educacional." : "Bloco concluído e marcado para revisão próxima." });
}
