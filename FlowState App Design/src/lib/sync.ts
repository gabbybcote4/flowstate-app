//  src/lib/sync.ts

import { db } from "@/lib/db";

export async function syncMoodHistoryToCloud() {
  const unsynced = await db.moodHistory.where("syncStatus").equals("pending").toArray();
  if (unsynced.length === 0) return;

  // TODO: push to your API (Supabase/Firebase/custom)
  // await fetch('/api/sync/mood', { method: 'POST', body: JSON.stringify(unsynced) });

  // mark as synced (demo)
  const ids = unsynced.map(r => r.id!).filter(Boolean);
  await Promise.all(ids.map(id => db.moodHistory.update(id, { syncStatus: "synced" })));
}
