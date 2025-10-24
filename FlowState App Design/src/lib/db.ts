//  src/lib/db.ts

import Dexie, { Table } from "dexie";

export interface MoodEntry {
  id?: number;
  dateISO: string;
  mood: "low" | "moderate" | "good";
}
export interface Todo {
  id?: string;
  title: string;
  notes?: string;
  block: "morning" | "afternoon" | "evening";
  done: boolean;
  moodTag?: "low" | "moderate" | "good";
  updatedAt: number;
  syncStatus?: "pending" | "synced";
}
export interface HealthSnapshot {
  id?: number;
  dateISO: string;
  steps?: number;
  sleepHours?: number;
  restingHR?: number;
  updatedAt: number;
}

// NEW
export type EmotionalState = "calm" | "energized" | "overwhelmed" | "tired" | "anxious" | "joyful";
export interface EmotionalPrefs {
  id: string;                 // always "prefs"
  state: EmotionalState;
  isGentle: boolean;
  brightness: number;
  updatedAt: number;
}
export interface MoodHistory {
  id?: number;
  dateISO: string;            // YYYY-MM-DD
  state: EmotionalState;
  updatedAt: number;
  syncStatus?: "pending" | "synced";
}

export class FlowstateDB extends Dexie {
  todos!: Table<Todo, string>;
  moods!: Table<MoodEntry, number>;
  health!: Table<HealthSnapshot, number>;
  // NEW
  emotionalPrefs!: Table<EmotionalPrefs, string>;
  moodHistory!: Table<MoodHistory, number>;

  constructor() {
    super("FlowstateDB");
    // bump to v2 (safe migration)
    this.version(2).stores({
      todos: "id, updatedAt, syncStatus",
      moods: "++id, dateISO",
      health: "++id, dateISO",
      emotionalPrefs: "id",
      moodHistory: "++id, dateISO",
    });
  }
}

export const db = new FlowstateDB();
