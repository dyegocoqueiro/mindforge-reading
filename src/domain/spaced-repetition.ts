export type ReviewRating = "forgot" | "hard" | "effort" | "easy";

export type ReviewState = {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
};

export type ReviewResult = ReviewState & { dueAt: Date; appliedRating: ReviewRating };

export function scheduleReview(state: ReviewState, rating: ReviewRating, wasCorrect: boolean, now = new Date()): ReviewResult {
  const appliedRating: ReviewRating = wasCorrect ? rating : "forgot";
  const repetitions = wasCorrect ? state.repetitions + 1 : 0;
  const easeFactor = Math.min(3, Math.max(1.3, state.easeFactor + ({ forgot: -0.2, hard: -0.1, effort: 0, easy: 0.15 }[appliedRating])));
  let intervalDays: number;
  if (appliedRating === "forgot") intervalDays = 1;
  else if (appliedRating === "hard") intervalDays = 1;
  else if (appliedRating === "effort") intervalDays = repetitions <= 1 ? 3 : Math.max(3, Math.round(state.intervalDays * easeFactor));
  else intervalDays = repetitions <= 1 ? 7 : Math.min(60, Math.max(7, Math.round(state.intervalDays * easeFactor)));
  if (repetitions >= 4 && wasCorrect) intervalDays = Math.max(intervalDays, [14, 30, 60][Math.min(2, repetitions - 4)]);
  const dueAt = new Date(now);
  dueAt.setUTCDate(dueAt.getUTCDate() + intervalDays);
  return { easeFactor, intervalDays, repetitions, dueAt, appliedRating };
}
