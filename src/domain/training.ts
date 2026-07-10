export type Skill = "fluency" | "comprehension" | "retention" | "focus" | "vocabulary" | "metacognition";
export type PriorityWeights = Record<Skill, number>;

export type LearnerState = {
  speedScore: number;
  comprehensionScore: number;
  immediateRetentionScore: number;
  delayedRetentionScore: number;
  focusStabilityScore: number;
  vocabularyScore: number;
  calibrationScore: number;
  fatigueSelfReport?: number;
};

export function priorityWeights(state: LearnerState): PriorityWeights {
  const needs: PriorityWeights = {
    fluency: Math.max(0.1, 1 - state.speedScore),
    comprehension: Math.max(0.1, 1 - state.comprehensionScore),
    retention: Math.max(0.1, 1 - state.delayedRetentionScore),
    focus: Math.max(0.1, 1 - state.focusStabilityScore),
    vocabulary: Math.max(0.1, 1 - state.vocabularyScore),
    metacognition: Math.max(0.1, 1 - state.calibrationScore),
  };
  if (state.comprehensionScore < 0.6) needs.comprehension *= 1.6;
  if (state.delayedRetentionScore < 0.5) needs.retention *= 1.5;
  if ((state.fatigueSelfReport ?? 0) >= 4) needs.focus *= 1.25;
  const total = Object.values(needs).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(needs).map(([key, value]) => [key, value / total])) as PriorityWeights;
}

export type MinuteAllocation = PriorityWeights & { preparation: number; feedback: number };

export function allocateMinutes(weights: PriorityWeights, total = 20): MinuteAllocation {
  if (![10, 15, 20, 30].includes(total)) throw new Error("Duração de sessão inválida");
  const preparation = 2;
  const feedback = 1;
  const flexible = total - preparation - feedback;
  const entries = Object.entries(weights) as Array<[Skill, number]>;
  const weightTotal = entries.reduce((sum, [, value]) => sum + Math.max(0, value), 0) || 1;
  const raw = entries.map(([skill, value]) => ({ skill, value: flexible * Math.max(0, value) / weightTotal }));
  const base = Object.fromEntries(raw.map(({ skill, value }) => [skill, Math.floor(value)])) as PriorityWeights;
  const remaining = flexible - Object.values(base).reduce((sum, value) => sum + value, 0);
  raw.sort((a, b) => (b.value - Math.floor(b.value)) - (a.value - Math.floor(a.value)) || a.skill.localeCompare(b.skill));
  for (let index = 0; index < remaining; index += 1) base[raw[index % raw.length].skill] += 1;
  return { preparation, ...base, feedback };
}

export function canProgress(input: { essentialCompletion: number; comprehensionMedian: number; delayedRetentionMedian: number; consistentSessions: number; masteryCompleted: boolean }): boolean {
  return input.essentialCompletion >= 0.8
    && input.comprehensionMedian >= 0.75
    && input.delayedRetentionMedian >= 0.65
    && input.consistentSessions >= 3
    && input.masteryCompleted;
}
