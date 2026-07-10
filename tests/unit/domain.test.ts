import { describe, expect, it } from "vitest";
import { calculateWpm, calibrationScore, diagnosticConfidence, effectiveReadingIndex, educationalProfiles, speedFeedbackAllowed, weightedScore } from "../../src/domain/assessment";
import { allocateMinutes, canProgress, priorityWeights } from "../../src/domain/training";
import { scheduleReview } from "../../src/domain/spaced-repetition";
import { normalizePortuguese, RuleBasedContentAnalysisProvider } from "../../src/domain/content-analysis";

describe("assessment engine", () => {
  it("calculates active WPM", () => expect(calculateWpm(300, 120)).toBe(150));
  it("rejects invalid WPM inputs", () => expect(calculateWpm(300, 0)).toBe(0));
  it("scores weighted answers", () => expect(weightedScore([{ correct: true, weight: 1.5 }, { correct: false, weight: 1 }])).toBe(0.6));
  it("calculates a bounded effective index", () => expect(effectiveReadingIndex({ speedScore: 0.8, comprehensionScore: 0.8, delayedRetentionScore: 0.7, focusStabilityScore: 0.9, vocabularyScore: 0.7 })).toBeGreaterThan(70));
  it("calculates metacognitive calibration", () => expect(calibrationScore(80, 0.7)).toBeCloseTo(0.9));
  it("classifies confidence", () => expect(diagnosticConfidence({ answeredRatio: 1, consistency: 1, interruptionPenalty: 0, plausibleTiming: true, delayedRetentionCompleted: true })).toBe("alta"));
  it("prioritizes low comprehension", () => expect(educationalProfiles({ speedScore: 0.8, comprehensionScore: 0.4, immediateRetentionScore: 0.7, delayedRetentionScore: 0.7, focusStabilityScore: 0.8, vocabularyScore: 0.8, metacognitiveCalibrationScore: 0.8 })).toContain("Compreensão prioritária"));
  it("blocks speed praise when comprehension is low", () => expect(speedFeedbackAllowed({ comprehensionScore: 0.59, delayedRetentionScore: 0.9 })).toBe(false));
});

describe("adaptive engine", () => {
  const weights = priorityWeights({ speedScore: 0.6, comprehensionScore: 0.4, immediateRetentionScore: 0.7, delayedRetentionScore: 0.5, focusStabilityScore: 0.7, vocabularyScore: 0.6, calibrationScore: 0.8 });
  it.each([10, 15, 20, 30])("allocates exactly %i minutes", (total) => expect(Object.values(allocateMinutes(weights, total)).reduce((sum, value) => sum + value, 0)).toBe(total));
  it("requires every progression guard", () => expect(canProgress({ essentialCompletion: 0.8, comprehensionMedian: 0.75, delayedRetentionMedian: 0.65, consistentSessions: 3, masteryCompleted: true })).toBe(true));
});

describe("review and rule-based content", () => {
  it("does not accept easy when the answer is wrong", () => {
    const result = scheduleReview({ easeFactor: 2.5, intervalDays: 14, repetitions: 3 }, "easy", false, new Date("2026-01-01T00:00:00Z"));
    expect(result.appliedRating).toBe("forgot");
    expect(result.intervalDays).toBe(1);
  });
  it("normalizes Portuguese accents", () => expect(normalizePortuguese("Compreensão, AÇÃO!")) .toBe("compreensao acao"));
  it("scores declared concepts without claiming semantic understanding", async () => {
    const provider = new RuleBasedContentAnalysisProvider();
    const score = await provider.scoreSummary({ text: "A pausa ajuda a consolidar a memória.", rubrics: [{ conceptId: "1", label: "consolidação", requiredKeywords: ["consolidar"], acceptedSynonyms: [], weight: 1, required: true }] });
    expect(score.identified).toEqual(["consolidação"]);
    expect(score.score).toBe(1);
  });
});
