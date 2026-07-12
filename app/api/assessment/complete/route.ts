import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateWpm, calibrationScore, diagnosticConfidence, educationalProfiles, effectiveReadingIndex, weightedScore } from "../../../../src/domain/assessment";
import { RuleBasedContentAnalysisProvider } from "../../../../src/domain/content-analysis";
import { allocateMinutes, priorityWeights } from "../../../../src/domain/training";
import { createSupabaseServerClient } from "../../../../src/lib/supabase/server";

const answerSchema = z.object({
  questionId: z.string().uuid(),
  optionId: z.string().uuid(),
  confidence: z.number().min(0).max(100),
});

const payloadSchema = z.object({
  runId: z.string().uuid(),
  passageVersionId: z.string().uuid(),
  activeSeconds: z.number().int().min(10).max(7200),
  pauseSeconds: z.number().int().min(0).max(7200),
  visibilityChanges: z.number().int().min(0).max(100),
  answers: z.array(answerSchema).min(1).max(30),
  immediateRecall: z.string().min(10).max(4000),
  delayedRecall: z.string().min(10).max(4000),
  focusSelfReport: z.number().min(0).max(100),
});

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados da avaliação inválidos." }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco indisponível." }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });

  const input = parsed.data;
  const { data: existing } = await supabase.from("assessment_metrics")
    .select("wpm,comprehension_score,immediate_retention_score,delayed_retention_score,focus_stability_score,vocabulary_score,metacognitive_calibration_score,effective_reading_index,confidence")
    .eq("assessment_run_id", input.runId).eq("user_id", user.id).maybeSingle();
  if (existing) return NextResponse.json({ result: formatResult(existing), idempotent: true });

  const [{ data: passage }, { data: questions }, { data: rubrics }, { data: preferences }] = await Promise.all([
    supabase.from("passage_versions").select("id,title,word_count,difficulty_level").eq("id", input.passageVersionId).single(),
    supabase.from("questions").select("id,kind,weight,correct_explanation,question_options(id,is_correct)").eq("passage_version_id", input.passageVersionId),
    supabase.from("concept_rubrics").select("concept_id,label,required_keywords,accepted_synonyms,forbidden_contradictions,weight,required").eq("passage_version_id", input.passageVersionId),
    supabase.from("user_preferences").select("available_minutes,weekly_frequency,goals,interests,preferred_time").eq("user_id", user.id).maybeSingle(),
  ]);
  if (!passage || !questions?.length) return NextResponse.json({ error: "Conteúdo da avaliação não encontrado." }, { status: 404 });

  const answerMap = new Map(input.answers.map((answer) => [answer.questionId, answer]));
  const scored = questions.map((question) => {
    const answer = answerMap.get(question.id);
    const options = question.question_options as Array<{ id: string; is_correct: boolean }>;
    return { question, answer, correct: Boolean(answer && options.some((option) => option.id === answer.optionId && option.is_correct)) };
  });
  const comprehensionScore = weightedScore(scored.map(({ question, correct }) => ({ correct, weight: Number(question.weight) })));
  const vocabularyItems = scored.filter(({ question }) => question.kind === "vocabulary");
  const vocabularyScore = vocabularyItems.length ? weightedScore(vocabularyItems.map(({ question, correct }) => ({ correct, weight: Number(question.weight) }))) : comprehensionScore;
  const analyzer = new RuleBasedContentAnalysisProvider();
  const ruleInput = (rubrics ?? []).map((rubric) => ({ conceptId: rubric.concept_id, label: rubric.label, requiredKeywords: rubric.required_keywords, acceptedSynonyms: rubric.accepted_synonyms, forbiddenContradictions: rubric.forbidden_contradictions ?? [], weight: Number(rubric.weight), required: rubric.required }));
  const [immediate, delayed] = await Promise.all([
    analyzer.scoreSummary({ text: input.immediateRecall, rubrics: ruleInput }),
    analyzer.scoreSummary({ text: input.delayedRecall, rubrics: ruleInput }),
  ]);
  const immediateRetentionScore = clamp((immediate.score * 0.65) + (comprehensionScore * 0.35));
  const delayedRetentionScore = clamp(delayed.score);
  const wpm = calculateWpm(passage.word_count, input.activeSeconds);
  const difficultyAdjustment = 1 + ((passage.difficulty_level - 1) * 0.08);
  const speedScore = clamp((wpm / 220) * difficultyAdjustment);
  const interruptionPenalty = Math.min(0.45, input.visibilityChanges * 0.06 + Math.max(0, input.pauseSeconds - 120) / 1800);
  const focusStabilityScore = clamp((1 - interruptionPenalty) * 0.7 + (input.focusSelfReport / 100) * 0.3);
  const averageConfidence = input.answers.reduce((sum, answer) => sum + answer.confidence, 0) / input.answers.length;
  const metacognitiveCalibrationScore = calibrationScore(averageConfidence, comprehensionScore);
  const scores = { speedScore, comprehensionScore, immediateRetentionScore, delayedRetentionScore, focusStabilityScore, vocabularyScore, metacognitiveCalibrationScore };
  const effective = effectiveReadingIndex(scores);
  const confidence = diagnosticConfidence({ answeredRatio: input.answers.length / questions.length, consistency: 1 - Math.abs(immediateRetentionScore - delayedRetentionScore), interruptionPenalty, plausibleTiming: wpm >= 40 && wpm <= 600, delayedRetentionCompleted: true });
  const profiles = educationalProfiles(scores);
  const weights = priorityWeights({ ...scores, calibrationScore: metacognitiveCalibrationScore });
  const preferredMinutes = preferences?.available_minutes ?? 20;
  const requestedMinutes = [10, 15, 20, 30].includes(preferredMinutes) ? preferredMinutes : 20;
  const minutes = allocateMinutes(weights, requestedMinutes);

  const { error: runError } = await supabase.from("assessment_runs").insert({ id: input.runId, user_id: user.id, passage_version_id: input.passageVersionId, status: "completed", current_block: "result", active_seconds: input.activeSeconds, pause_seconds: input.pauseSeconds, completed_at: new Date().toISOString(), version: "2.0" });
  if (runError) return NextResponse.json({ error: runError.message }, { status: 409 });

  const responseRows = scored.filter(({ answer }) => answer).map(({ question, answer, correct }) => ({ assessment_run_id: input.runId, user_id: user.id, question_id: question.id, response: { option_id: answer!.optionId }, score: correct ? 1 : 0, confidence: Math.round(answer!.confidence) }));
  if (responseRows.length) await supabase.from("assessment_responses").insert(responseRows);
  await supabase.from("assessment_events").insert([
    { assessment_run_id: input.runId, user_id: user.id, event_type: "completed", payload: { visibility_changes: input.visibilityChanges } },
    { assessment_run_id: input.runId, user_id: user.id, event_type: "free_recall_scored", payload: { identified_count: immediate.identified.length, missing_count: immediate.missing.length } },
  ]);

  const { data: metric, error: metricError } = await supabase.from("assessment_metrics").insert({ assessment_run_id: input.runId, user_id: user.id, wpm, speed_score: speedScore, comprehension_score: comprehensionScore, immediate_retention_score: immediateRetentionScore, delayed_retention_score: delayedRetentionScore, focus_stability_score: focusStabilityScore, vocabulary_score: vocabularyScore, metacognitive_calibration_score: metacognitiveCalibrationScore, effective_reading_index: effective, confidence }).select().single();
  if (metricError) return NextResponse.json({ error: metricError.message }, { status: 500 });

  const strengths = Object.entries(scores).filter(([, value]) => value >= 0.7).map(([key]) => key);
  const priorities = Object.entries(weights).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key]) => key);
  const { data: diagnosis } = await supabase.from("diagnostic_results").insert({ assessment_run_id: input.runId, user_id: user.id, profile_tags: profiles, strengths, priorities, safety_notes: speedScore >= 0.7 && comprehensionScore < 0.6 ? ["O ritmo não será aumentado enquanto a compreensão estiver abaixo de 60%."] : [], engine_version: "rules-2.0" }).select("id").single();
  const { data: plan } = await supabase.from("training_plans").insert({ user_id: user.id, diagnostic_result_id: diagnosis?.id ?? null, status: "active", priority_weights: weights, weekly_goal: { sessions: preferences?.weekly_frequency ?? 5, minutes: requestedMinutes, goals: preferences?.goals ?? [], interests: preferences?.interests ?? [], preferred_time: preferences?.preferred_time ?? null }, progression_criteria: { essential_completion: 0.8, comprehension: 0.75, delayed_retention: 0.65 }, engine_version: "rules-3.0" }).select("id").single();
  if (plan) {
    const blocks = Object.entries(minutes).map(([skill, duration]) => ({ skill, minutes: duration, objective: blockObjective(skill) }));
    await supabase.from("training_plan_days").insert(Array.from({ length: 8 }, (_, index) => ({ training_plan_id: plan.id, day_number: index + 1, total_minutes: requestedMinutes, blocks, status: "planned", scheduled_for: new Date(Date.now() + index * 86400000).toISOString().slice(0, 10) })));
  }
  await supabase.from("review_items").insert({ user_id: user.id, source_type: "assessment_concept", source_id: input.passageVersionId, prompt: `Sem consultar, explique a ideia central de “${passage.title}”.`, answer: { concepts: ruleInput.map((rubric) => rubric.label) }, interval_days: 1, due_at: new Date(Date.now() + 86400000).toISOString() });
  const initialLevel = effective >= 78 && comprehensionScore >= 0.75 && delayedRetentionScore >= 0.65 ? 2 : 1;
  await supabase.from("profiles").update({ current_level: initialLevel, updated_at: new Date().toISOString() }).eq("id", user.id);

  return NextResponse.json({ result: { ...formatResult(metric), profiles, priorities, identified: immediate.identified, missing: immediate.missing, speedFeedbackAllowed: comprehensionScore >= 0.6 && delayedRetentionScore >= 0.5 } });
}

function formatResult(metric: Record<string, unknown>) {
  return {
    wpm: Number(metric.wpm),
    comprehension: Number(metric.comprehension_score),
    immediateRetention: Number(metric.immediate_retention_score),
    delayedRetention: Number(metric.delayed_retention_score),
    focus: Number(metric.focus_stability_score),
    vocabulary: Number(metric.vocabulary_score),
    calibration: Number(metric.metacognitive_calibration_score),
    effectiveIndex: Number(metric.effective_reading_index),
    confidence: metric.confidence,
  };
}

function blockObjective(skill: string) {
  return ({ preparation: "Definir intenção e preparar o ambiente", fluency: "Praticar ritmo com compreensão", comprehension: "Identificar ideia central e evidências", retention: "Recuperar sem consulta", focus: "Manter blocos curtos e retomadas claras", vocabulary: "Inferir e aplicar palavras no contexto", metacognition: "Comparar confiança e resultado", feedback: "Registrar avanço e próximo passo" } as Record<string, string>)[skill];
}
