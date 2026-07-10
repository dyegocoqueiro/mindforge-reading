import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteDB } from "idb";
import { enqueueOperation, listOperations, syncOutbox } from "../../src/lib/offline/outbox";

afterEach(async () => deleteDB("mindforge-offline"));

describe("offline outbox", () => {
  it("deduplicates operations by idempotency id", async () => {
    const operation = { id: "c8d0fce6-14d0-4a82-9c5a-7908b8202e61", type: "exercise_attempt" as const, payload: { score: 0.8 }, createdAt: "2026-07-10T12:00:00.000Z", attempts: 0 };
    await enqueueOperation(operation); await enqueueOperation(operation);
    expect(await listOperations()).toHaveLength(1);
  });
  it("removes only confirmed operations", async () => {
    await enqueueOperation({ id: "c8d0fce6-14d0-4a82-9c5a-7908b8202e61", type: "review_attempt", payload: {}, createdAt: "2026-07-10T12:00:00.000Z", attempts: 0 });
    const sender = vi.fn().mockResolvedValue({ applied: true });
    expect(await syncOutbox(sender)).toEqual({ applied: 1, pending: 0 });
    expect(sender).toHaveBeenCalledTimes(1);
  });
});
