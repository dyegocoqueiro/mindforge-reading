export type DiagnosticConfidence = "baixa" | "moderada" | "alta";

export type AssessmentScores = {
  speedScore: number;
  comprehensionScore: number;
  immediateRetentionScore: number;
  delayedRetentionScore: number;
  focusStabilityScore: number;
  vocabularyScore: number;
  metacognitiveCalibrationScore: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function calculateWpm(wordCount: number, activeSeconds: number): number {
  if (!Number.isFinite(wordCount) || !Number.isFinite(activeSeconds) || wordCount <= 0 || activeSeconds <= 0) return 0;
  return Math.round((wordCount / (activeSeconds / 60)) * 10) / 10;
}

export function weightedScore(items: Array<{ correct: boolean; weight: number }>): number {
  const valid = items.filter((item) => Number.isFinite(item.weight) && item.weight > 0);
  const total = valid.reduce((sum, item) => sum + item.weight, 0);
  if (total === 0) return 0;
  return clamp(valid.reduce((sum, item) => sum + (item.correct ? item.weight : 0), 0) / total);
}

export function effectiveReadingIndex(scores: Pick<AssessmentScores, "speedScore" | "comprehensionScore" | "delayedRetentionScore" | "focusStabilityScore" | "vocabularyScore">): number {
  const floor = 0.001;
  const value = 100
    * Math.pow(Math.max(floor, clamp(scores.speedScore)), 0.2)
    * Math.pow(Math.max(floor, clamp(scores.comprehensionScore)), 0.35)
    * Math.pow(Math.max(floor, clamp(scores.delayedRetentionScore)), 0.25)
    * Math.pow(Math.max(floor, clamp(scores.focusStabilityScore)), 0.1)
    * Math.pow(Math.max(floor, clamp(scores.vocabularyScore)), 0.1);
  return Math.round(value * 10) / 10;
}

export function calibrationScore(confidencePercent: number, accuracy: number): number {
  return clamp(1 - Math.abs(clamp(confidencePercent / 100) - clamp(accuracy)));
}

export function diagnosticConfidence(input: {
  answeredRatio: number;
  consistency: number;
  interruptionPenalty: number;
  plausibleTiming: boolean;
  delayedRetentionCompleted: boolean;
}): DiagnosticConfidence {
  const score = clamp(input.answeredRatio) * 0.3
    + clamp(input.consistency) * 0.25
    + (1 - clamp(input.interruptionPenalty)) * 0.15
    + (input.plausibleTiming ? 0.15 : 0)
    + (input.delayedRetentionCompleted ? 0.15 : 0);
  if (score >= 0.8) return "alta";
  if (score >= 0.55) return "moderada";
  return "baixa";
}

export function educationalProfiles(scores: AssessmentScores): string[] {
  const profiles: string[] = [];
  if (scores.speedScore < 0.45 && scores.comprehensionScore >= 0.6) profiles.push("Base de fluência em desenvolvimento");
  if (scores.comprehensionScore < 0.6) profiles.push("Compreensão prioritária");
  if (scores.delayedRetentionScore < 0.5) profiles.push("Retenção prioritária");
  if (scores.focusStabilityScore < 0.55) profiles.push("Estabilidade na tarefa prioritária");
  if (scores.vocabularyScore < 0.55) profiles.push("Vocabulário prioritário");
  if (profiles.length === 0 && Object.values(scores).every((score) => score >= 0.7)) profiles.push("Leitura avançada orientada por objetivo");
  if (profiles.length === 0) profiles.push("Leitor equilibrado");
  return profiles;
}

export function speedFeedbackAllowed(scores: Pick<AssessmentScores, "comprehensionScore" | "delayedRetentionScore">): boolean {
  return scores.comprehensionScore >= 0.6 && scores.delayedRetentionScore >= 0.5;
}
