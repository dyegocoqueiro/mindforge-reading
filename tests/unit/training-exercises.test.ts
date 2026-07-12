import { describe, expect, it } from "vitest";
import { reviewPrompt, scoreTrainingBlock } from "../../src/domain/training-exercises";

describe("training exercise rules", () => {
  it("scores objective choices without trusting the interface", () => {
    expect(scoreTrainingBlock("comprehension", { choice: "evidence" })).toBe(1);
    expect(scoreTrainingBlock("comprehension", { choice: "speed" })).toBe(0);
  });
  it("requires active evidence in timed blocks", () => {
    expect(scoreTrainingBlock("focus", { activeSeconds: 4 })).toBe(0.4);
    expect(scoreTrainingBlock("focus", { activeSeconds: 10 })).toBe(1);
  });
  it("provides a review prompt for every planned skill", () => {
    for (const skill of ["preparation","fluency","comprehension","retention","focus","vocabulary","metacognition","feedback"]) {
      const [prompt, concepts] = reviewPrompt(skill);
      expect(prompt.length).toBeGreaterThan(10);
      expect(concepts.length).toBeGreaterThan(0);
    }
  });
});
