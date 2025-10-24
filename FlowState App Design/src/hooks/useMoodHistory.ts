//  src/hooks/useMoodHistory.ts

import { useLiveQuery } from "dexie-react-hooks";
import { db, MoodHistory } from "@/lib/db";

export function useMoodHistory(): MoodHistory[] {
  const rows = useLiveQuery(() => db.moodHistory.orderBy("dateISO").toArray(), []);
  return rows ?? [];
}
