//  src/components/context/DataStoreContext.tsx

"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db, Todo, MoodEntry, HealthSnapshot, EmotionalPrefs, MoodHistory } from "@/lib/db";

type DataStoreContextValue = {
  todos: Todo[];
  moods: MoodEntry[];
  health: HealthSnapshot[];
  emotionalPrefs?: EmotionalPrefs;
  moodHistory: MoodHistory[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const DataStoreContext = createContext<DataStoreContextValue>({
  todos: [],
  moods: [],
  health: [],
  moodHistory: [],
  loading: true,
  refresh: async () => {},
});

export const DataStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [health, setHealth] = useState<HealthSnapshot[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  const [emotionalPrefs, setEmotionalPrefs] = useState<EmotionalPrefs | undefined>(undefined);

  const refresh = async () => {
    setLoading(true);
    const [t, m, h, mh, ep] = await Promise.all([
      db.todos.toArray(),
      db.moods.toArray(),
      db.health.toArray(),
      db.moodHistory.orderBy("dateISO").toArray(),
      db.emotionalPrefs.get("prefs"),
    ]);
    setTodos(t);
    setMoods(m);
    setHealth(h);
    setMoodHistory(mh);
    setEmotionalPrefs(ep);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DataStoreContext.Provider
      value={{ todos, moods, health, moodHistory, emotionalPrefs, loading, refresh }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => useContext(DataStoreContext);
