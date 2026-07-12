import { describe, expect, it } from "vitest";
import { collectionMeta, lessons } from "../../src/content/lessons";

describe("didactic catalog", () => {
  it("contains the 27 required original lessons", () => {
    expect(lessons).toHaveLength(27);
    expect(new Set(lessons.map((lesson) => lesson.slug)).size).toBe(27);
    expect(lessons.map((lesson) => lesson.order)).toEqual(Array.from({ length: 27 }, (_, index) => index + 1));
  });

  it("keeps every lesson actionable and referenced", () => {
    for (const lesson of lessons) {
      expect(lesson.explanation.length).toBeGreaterThanOrEqual(2);
      expect(lesson.activity.length).toBeGreaterThan(30);
      expect(lesson.reviewAnswer.length).toBeGreaterThan(20);
      expect(lesson.references.length).toBeGreaterThan(0);
      expect(collectionMeta[lesson.collection].cover).toMatch(/^\/covers\//);
    }
  });
});
