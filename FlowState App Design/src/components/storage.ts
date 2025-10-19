/**
 * FlowState Storage Layer
 * 
 * IndexedDB-based cache and persistence for todos, moods, reflections,
 * events, and snapshots using idb library for simplified API
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  energy: 'low' | 'medium' | 'high';
  timeEstimate?: number; // minutes
  lifeArea?: string;
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  focus: number; // 1-5
  physicalHealth: number; // 1-5
  stress: number; // 1-5
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface Reflection {
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  prompt?: string;
  content: string;
  gratitude?: string[];
  wins?: string[];
  challenges?: string[];
  learnings?: string[];
  mood?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEventLocal {
  id: string;
  title: string;
  start: string;
  end: string;
  duration: number;
  type: 'meeting' | 'focus' | 'break' | 'personal' | 'other';
  description?: string;
  location?: string;
  isRecurring: boolean;
  source: 'user' | 'google' | 'outlook';
  todoId?: string; // Link to todo if created from todo
  createdAt: string;
  updatedAt: string;
}

export interface Snapshot {
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  data: {
    completedTodos: number;
    totalTodos: number;
    avgMood: number;
    avgEnergy: number;
    avgFocus: number;
    habits: { [key: string]: { completed: number; total: number } };
    reflectionCount: number;
    topTags: string[];
  };
  createdAt: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  type: 'migraine' | 'fatigue' | 'pain' | 'anxiety' | 'sleep_issue' | 'other';
  severity: number; // 1-10
  triggers?: string[];
  location?: string; // for pain/migraine
  duration?: number; // minutes
  medications?: string[];
  notes?: string;
  relievers?: string[]; // what helped
  correlations?: { type: string; value: any }[]; // tracked correlations
  createdAt: string;
}

export interface HabitStack {
  id: string;
  title: string;
  description?: string;
  steps: Array<{
    id: string;
    habitId: string;
    habitName: string;
    order: number;
    completed: boolean;
  }>;
  trigger?: string; // "After I [trigger], I will [first step]"
  active: boolean;
  completionCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DATABASE SCHEMA
// ============================================================================

interface FlowStateDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
    indexes: {
      'by-date': string;
      'by-completed': number;
      'by-priority': string;
      'by-lifeArea': string;
    };
  };
  moods: {
    key: string;
    value: MoodEntry;
    indexes: {
      'by-date': string;
    };
  };
  reflections: {
    key: string;
    value: Reflection;
    indexes: {
      'by-date': string;
      'by-type': string;
    };
  };
  events: {
    key: string;
    value: CalendarEventLocal;
    indexes: {
      'by-date': string;
      'by-type': string;
      'by-source': string;
    };
  };
  snapshots: {
    key: string;
    value: Snapshot;
    indexes: {
      'by-date': string;
      'by-type': string;
    };
  };
  symptoms: {
    key: string;
    value: SymptomLog;
    indexes: {
      'by-date': string;
      'by-type': string;
      'by-severity': number;
    };
  };
  habitStacks: {
    key: string;
    value: HabitStack;
    indexes: {
      'by-active': number;
    };
  };
}

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

let dbPromise: Promise<IDBPDatabase<FlowStateDB>> | null = null;

async function getDB(): Promise<IDBPDatabase<FlowStateDB>> {
  if (dbPromise) return dbPromise;

  dbPromise = openDB<FlowStateDB>('flowstate-db', 1, {
    upgrade(db) {
      // Todos store
      if (!db.objectStoreNames.contains('todos')) {
        const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
        todoStore.createIndex('by-date', 'createdAt');
        todoStore.createIndex('by-completed', 'completed');
        todoStore.createIndex('by-priority', 'priority');
        todoStore.createIndex('by-lifeArea', 'lifeArea');
      }

      // Moods store
      if (!db.objectStoreNames.contains('moods')) {
        const moodStore = db.createObjectStore('moods', { keyPath: 'id' });
        moodStore.createIndex('by-date', 'date');
      }

      // Reflections store
      if (!db.objectStoreNames.contains('reflections')) {
        const reflectionStore = db.createObjectStore('reflections', { keyPath: 'id' });
        reflectionStore.createIndex('by-date', 'date');
        reflectionStore.createIndex('by-type', 'type');
      }

      // Events store
      if (!db.objectStoreNames.contains('events')) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('by-date', 'start');
        eventStore.createIndex('by-type', 'type');
        eventStore.createIndex('by-source', 'source');
      }

      // Snapshots store
      if (!db.objectStoreNames.contains('snapshots')) {
        const snapshotStore = db.createObjectStore('snapshots', { keyPath: 'id' });
        snapshotStore.createIndex('by-date', 'date');
        snapshotStore.createIndex('by-type', 'type');
      }

      // Symptoms store
      if (!db.objectStoreNames.contains('symptoms')) {
        const symptomStore = db.createObjectStore('symptoms', { keyPath: 'id' });
        symptomStore.createIndex('by-date', 'date');
        symptomStore.createIndex('by-type', 'type');
        symptomStore.createIndex('by-severity', 'severity');
      }

      // Habit Stacks store
      if (!db.objectStoreNames.contains('habitStacks')) {
        const stackStore = db.createObjectStore('habitStacks', { keyPath: 'id' });
        stackStore.createIndex('by-active', 'active');
      }
    },
  });

  return dbPromise;
}

// ============================================================================
// STORAGE API - TODOS
// ============================================================================

export const todosDB = {
  async getAll(): Promise<Todo[]> {
    const db = await getDB();
    return db.getAll('todos');
  },

  async getById(id: string): Promise<Todo | undefined> {
    const db = await getDB();
    return db.get('todos', id);
  },

  async add(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const db = await getDB();
    const newTodo: Todo = {
      ...todo,
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.add('todos', newTodo);
    return newTodo;
  },

  async update(id: string, updates: Partial<Todo>): Promise<void> {
    const db = await getDB();
    const existing = await db.get('todos', id);
    if (existing) {
      await db.put('todos', {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('todos', id);
  },

  async getByDateRange(start: Date, end: Date): Promise<Todo[]> {
    const db = await getDB();
    const todos = await db.getAll('todos');
    return todos.filter((todo) => {
      const createdAt = new Date(todo.createdAt);
      return createdAt >= start && createdAt <= end;
    });
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('todos');
  },
};

// ============================================================================
// STORAGE API - MOODS
// ============================================================================

export const moodsDB = {
  async getAll(): Promise<MoodEntry[]> {
    const db = await getDB();
    return db.getAll('moods');
  },

  async getById(id: string): Promise<MoodEntry | undefined> {
    const db = await getDB();
    return db.get('moods', id);
  },

  async add(mood: Omit<MoodEntry, 'id' | 'createdAt'>): Promise<MoodEntry> {
    const db = await getDB();
    const newMood: MoodEntry = {
      ...mood,
      id: `mood-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await db.add('moods', newMood);
    return newMood;
  },

  async getByDateRange(start: Date, end: Date): Promise<MoodEntry[]> {
    const db = await getDB();
    const moods = await db.getAllFromIndex('moods', 'by-date');
    return moods.filter((mood) => {
      const date = new Date(mood.date);
      return date >= start && date <= end;
    });
  },

  async getLatest(count: number = 30): Promise<MoodEntry[]> {
    const db = await getDB();
    const moods = await db.getAll('moods');
    return moods.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, count);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('moods');
  },
};

// ============================================================================
// STORAGE API - REFLECTIONS
// ============================================================================

export const reflectionsDB = {
  async getAll(): Promise<Reflection[]> {
    const db = await getDB();
    return db.getAll('reflections');
  },

  async getById(id: string): Promise<Reflection | undefined> {
    const db = await getDB();
    return db.get('reflections', id);
  },

  async add(reflection: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reflection> {
    const db = await getDB();
    const newReflection: Reflection = {
      ...reflection,
      id: `reflection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.add('reflections', newReflection);
    return newReflection;
  },

  async update(id: string, updates: Partial<Reflection>): Promise<void> {
    const db = await getDB();
    const existing = await db.get('reflections', id);
    if (existing) {
      await db.put('reflections', {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  },

  async getByType(type: Reflection['type']): Promise<Reflection[]> {
    const db = await getDB();
    return db.getAllFromIndex('reflections', 'by-type', type);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('reflections');
  },
};

// ============================================================================
// STORAGE API - EVENTS
// ============================================================================

export const eventsDB = {
  async getAll(): Promise<CalendarEventLocal[]> {
    const db = await getDB();
    return db.getAll('events');
  },

  async getById(id: string): Promise<CalendarEventLocal | undefined> {
    const db = await getDB();
    return db.get('events', id);
  },

  async add(event: Omit<CalendarEventLocal, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEventLocal> {
    const db = await getDB();
    const newEvent: CalendarEventLocal = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.add('events', newEvent);
    return newEvent;
  },

  async update(id: string, updates: Partial<CalendarEventLocal>): Promise<void> {
    const db = await getDB();
    const existing = await db.get('events', id);
    if (existing) {
      await db.put('events', {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('events', id);
  },

  async getByDateRange(start: Date, end: Date): Promise<CalendarEventLocal[]> {
    const db = await getDB();
    const events = await db.getAll('events');
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      return eventStart >= start && eventStart <= end;
    });
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('events');
  },
};

// ============================================================================
// STORAGE API - SYMPTOMS
// ============================================================================

export const symptomsDB = {
  async getAll(): Promise<SymptomLog[]> {
    const db = await getDB();
    return db.getAll('symptoms');
  },

  async getById(id: string): Promise<SymptomLog | undefined> {
    const db = await getDB();
    return db.get('symptoms', id);
  },

  async add(symptom: Omit<SymptomLog, 'id' | 'createdAt'>): Promise<SymptomLog> {
    const db = await getDB();
    const newSymptom: SymptomLog = {
      ...symptom,
      id: `symptom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await db.add('symptoms', newSymptom);
    return newSymptom;
  },

  async getByType(type: SymptomLog['type']): Promise<SymptomLog[]> {
    const db = await getDB();
    return db.getAllFromIndex('symptoms', 'by-type', type);
  },

  async getByDateRange(start: Date, end: Date): Promise<SymptomLog[]> {
    const db = await getDB();
    const symptoms = await db.getAll('symptoms');
    return symptoms.filter((symptom) => {
      const date = new Date(symptom.date);
      return date >= start && date <= end;
    });
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('symptoms');
  },
};

// ============================================================================
// STORAGE API - HABIT STACKS
// ============================================================================

export const habitStacksDB = {
  async getAll(): Promise<HabitStack[]> {
    const db = await getDB();
    return db.getAll('habitStacks');
  },

  async getById(id: string): Promise<HabitStack | undefined> {
    const db = await getDB();
    return db.get('habitStacks', id);
  },

  async add(stack: Omit<HabitStack, 'id' | 'createdAt' | 'updatedAt'>): Promise<HabitStack> {
    const db = await getDB();
    const newStack: HabitStack = {
      ...stack,
      id: `stack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.add('habitStacks', newStack);
    return newStack;
  },

  async update(id: string, updates: Partial<HabitStack>): Promise<void> {
    const db = await getDB();
    const existing = await db.get('habitStacks', id);
    if (existing) {
      await db.put('habitStacks', {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('habitStacks', id);
  },

  async getActive(): Promise<HabitStack[]> {
    const db = await getDB();
    const stacks = await db.getAll('habitStacks');
    return stacks.filter(stack => stack.active);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('habitStacks');
  },
};

// ============================================================================
// STORAGE API - SNAPSHOTS
// ============================================================================

export const snapshotsDB = {
  async getAll(): Promise<Snapshot[]> {
    const db = await getDB();
    return db.getAll('snapshots');
  },

  async add(snapshot: Omit<Snapshot, 'id' | 'createdAt'>): Promise<Snapshot> {
    const db = await getDB();
    const newSnapshot: Snapshot = {
      ...snapshot,
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await db.add('snapshots', newSnapshot);
    return newSnapshot;
  },

  async getByType(type: Snapshot['type']): Promise<Snapshot[]> {
    const db = await getDB();
    return db.getAllFromIndex('snapshots', 'by-type', type);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('snapshots');
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear all data (for reset functionality)
 */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    todosDB.clear(),
    moodsDB.clear(),
    reflectionsDB.clear(),
    eventsDB.clear(),
    symptomsDB.clear(),
    habitStacksDB.clear(),
    snapshotsDB.clear(),
  ]);
}

/**
 * Export all data as JSON (for backup)
 */
export async function exportAllData(): Promise<string> {
  const [todos, moods, reflections, events, symptoms, habitStacks, snapshots] = await Promise.all([
    todosDB.getAll(),
    moodsDB.getAll(),
    reflectionsDB.getAll(),
    eventsDB.getAll(),
    symptomsDB.getAll(),
    habitStacksDB.getAll(),
    snapshotsDB.getAll(),
  ]);

  return JSON.stringify({
    version: 1,
    exportDate: new Date().toISOString(),
    data: {
      todos,
      moods,
      reflections,
      events,
      symptoms,
      habitStacks,
      snapshots,
    },
  }, null, 2);
}

/**
 * Import data from JSON backup
 */
export async function importData(jsonData: string): Promise<void> {
  const parsed = JSON.parse(jsonData);
  const { todos, moods, reflections, events, symptoms, habitStacks, snapshots } = parsed.data;

  const db = await getDB();

  // Import each data type
  if (todos) {
    for (const todo of todos) {
      await db.put('todos', todo);
    }
  }
  if (moods) {
    for (const mood of moods) {
      await db.put('moods', mood);
    }
  }
  if (reflections) {
    for (const reflection of reflections) {
      await db.put('reflections', reflection);
    }
  }
  if (events) {
    for (const event of events) {
      await db.put('events', event);
    }
  }
  if (symptoms) {
    for (const symptom of symptoms) {
      await db.put('symptoms', symptom);
    }
  }
  if (habitStacks) {
    for (const stack of habitStacks) {
      await db.put('habitStacks', stack);
    }
  }
  if (snapshots) {
    for (const snapshot of snapshots) {
      await db.put('snapshots', snapshot);
    }
  }
}
