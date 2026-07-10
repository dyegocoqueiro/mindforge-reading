import { openDB, type DBSchema } from "idb";
import { z } from "zod";

const operationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["exercise_attempt", "reading_session", "review_attempt"]),
  payload: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  attempts: z.number().int().min(0).default(0),
});
export type OfflineOperation = z.infer<typeof operationSchema>;

interface MindForgeOfflineDb extends DBSchema {
  outbox: { key: string; value: OfflineOperation; indexes: { "by-created": string } };
  content: { key: string; value: { id: string; version: number; payload: unknown; downloadedAt: string } };
}

const database = () => openDB<MindForgeOfflineDb>("mindforge-offline", 1, {
  upgrade(db) {
    const outbox = db.createObjectStore("outbox", { keyPath: "id" });
    outbox.createIndex("by-created", "createdAt");
    db.createObjectStore("content", { keyPath: "id" });
  },
});

export async function enqueueOperation(input: OfflineOperation): Promise<void> {
  const operation = operationSchema.parse(input);
  const db = await database();
  try {
    if (!(await db.get("outbox", operation.id))) await db.put("outbox", operation);
  } finally {
    db.close();
  }
}

export async function listOperations(): Promise<OfflineOperation[]> {
  const db = await database();
  try {
    return await db.getAllFromIndex("outbox", "by-created");
  } finally {
    db.close();
  }
}

export async function syncOutbox(send: (operation: OfflineOperation) => Promise<{ applied: boolean }>): Promise<{ applied: number; pending: number }> {
  const db = await database();
  let applied = 0;
  try {
    for (const operation of await db.getAllFromIndex("outbox", "by-created")) {
      try {
        const result = await send(operation);
        if (result.applied) { await db.delete("outbox", operation.id); applied += 1; }
      } catch {
        await db.put("outbox", { ...operation, attempts: operation.attempts + 1 });
      }
    }
    return { applied, pending: await db.count("outbox") };
  } finally {
    db.close();
  }
}
