// /**
//  * Storage Service
//  * 
//  * Wrapper around storage.ts with additional utility methods
//  */

// import { openDB, DBSchema, IDBPDatabase } from 'idb';
// import type {
//   Todo,
//   MoodEntry,
//   Reflection,
//   CalendarEventLocal,
//   Snapshot,
//   SymptomLog,
//   HabitLog,
// } from '../components/storage/storage';

// // Re-export types for convenience
// export type {
//   Todo,
//   MoodEntry,
//   Reflection,
//   CalendarEventLocal,
//   Snapshot,
//   SymptomLog,
//   HabitLog,
// };

// /**
//  * Database schema definition
//  */
// interface FlowStateDB extends DBSchema {
//   todos: {
//     key: string;
//     value: Todo;
//     indexes: { 'by-date': string; 'by-life-area': string };
//   };
//   moods: {
//     key: string;
//     value: MoodEntry;
//     indexes: { 'by-date': string };
//   };
//   reflections: {
//     key: string;
//     value: Reflection;
//     indexes: { 'by-date': string; 'by-type': string };
//   };
//   events: {
//     key: string;
//     value: CalendarEventLocal;
//     indexes: { 'by-date': string; 'by-source': string };
//   };
//   snapshots: {
//     key: string;
//     value: Snapshot;
//     indexes: { 'by-date': string; 'by-type': string };
//   };
//   symptoms: {
//     key: string;
//     value: SymptomLog;
//     indexes: { 'by-date': string; 'by-type': string };
//   };
//   habits: {
//     key: string;
//     value: HabitLog;
//     indexes: { 'by-date': string; 'by-habit-id': string };
//   };
// }

// const DB_NAME = 'flowstate-db';
// const DB_VERSION = 1;

// let dbInstance: IDBPDatabase<FlowStateDB> | null = null;

// /**
//  * Initialize database
//  */
// export async function initDB(): Promise<IDBPDatabase<FlowStateDB>> {
//   if (dbInstance) return dbInstance;

//   dbInstance = await openDB<FlowStateDB>(DB_NAME, DB_VERSION, {
//     upgrade(db) {
//       // Todos store
//       if (!db.objectStoreNames.contains('todos')) {
//         const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
//         todoStore.createIndex('by-date', 'createdAt');
//         todoStore.createIndex('by-life-area', 'lifeArea');
//       }

//       // Moods store
//       if (!db.objectStoreNames.contains('moods')) {
//         const moodStore = db.createObjectStore('moods', { keyPath: 'id' });
//         moodStore.createIndex('by-date', 'date');
//       }

//       // Reflections store
//       if (!db.objectStoreNames.contains('reflections')) {
//         const reflectionStore = db.createObjectStore('reflections', { keyPath: 'id' });
//         reflectionStore.createIndex('by-date', 'date');
//         reflectionStore.createIndex('by-type', 'type');
//       }

//       // Events store
//       if (!db.objectStoreNames.contains('events')) {
//         const eventStore = db.createObjectStore('events', { keyPath: 'id' });
//         eventStore.createIndex('by-date', 'start');
//         eventStore.createIndex('by-source', 'source');
//       }

//       // Snapshots store
//       if (!db.objectStoreNames.contains('snapshots')) {
//         const snapshotStore = db.createObjectStore('snapshots', { keyPath: 'id' });
//         snapshotStore.createIndex('by-date', 'date');
//         snapshotStore.createIndex('by-type', 'type');
//       }

//       // Symptoms store
//       if (!db.objectStoreNames.contains('symptoms')) {
//         const symptomStore = db.createObjectStore('symptoms', { keyPath: 'id' });
//         symptomStore.createIndex('by-date', 'date');
//         symptomStore.createIndex('by-type', 'type');
//       }

//       // Habits store
//       if (!db.objectStoreNames.contains('habits')) {
//         const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
//         habitStore.createIndex('by-date', 'date');
//         habitStore.createIndex('by-habit-id', 'habitId');
//       }
//     },
//   });

//   return dbInstance;
// }

// /**
//  * Generic CRUD operations
//  */
// export class StorageService<T extends { id: string }> {
//   constructor(private storeName: keyof FlowStateDB) {}

//   async add(item: T): Promise<string> {
//     const db = await initDB();
//     return await db.add(this.storeName as any, item as any);
//   }

//   async get(id: string): Promise<T | undefined> {
//     const db = await initDB();
//     return await db.get(this.storeName as any, id);
//   }

//   async getAll(): Promise<T[]> {
//     const db = await initDB();
//     return await db.getAll(this.storeName as any);
//   }

//   async update(item: T): Promise<void> {
//     const db = await initDB();
//     await db.put(this.storeName as any, item as any);
//   }

//   async delete(id: string): Promise<void> {
//     const db = await initDB();
//     await db.delete(this.storeName as any, id);
//   }

//   async clear(): Promise<void> {
//     const db = await initDB();
//     await db.clear(this.storeName as any);
//   }

//   async getByIndex(indexName: string, value: any): Promise<T[]> {
//     const db = await initDB();
//     return await db.getAllFromIndex(this.storeName as any, indexName, value);
//   }
// }

// /**
//  * Specialized service instances
//  */
// export const todoService = new StorageService<Todo>('todos');
// export const moodService = new StorageService<MoodEntry>('moods');
// export const reflectionService = new StorageService<Reflection>('reflections');
// export const eventService = new StorageService<CalendarEventLocal>('events');
// export const snapshotService = new StorageService<Snapshot>('snapshots');
// export const symptomService = new StorageService<SymptomLog>('symptoms');
// export const habitService = new StorageService<HabitLog>('habits');

// /**
//  * Batch operations
//  */
// export async function batchAdd<T extends { id: string }>(
//   storeName: keyof FlowStateDB,
//   items: T[]
// ): Promise<void> {
//   const db = await initDB();
//   const tx = db.transaction(storeName as any, 'readwrite');
//   await Promise.all(items.map(item => tx.store.add(item as any)));
//   await tx.done;
// }

// /**
//  * Clear all data (for testing or reset)
//  */
// export async function clearAllData(): Promise<void> {
//   const db = await initDB();
//   const stores: (keyof FlowStateDB)[] = [
//     'todos',
//     'moods',
//     'reflections',
//     'events',
//     'snapshots',
//     'symptoms',
//     'habits',
//   ];
  
//   await Promise.all(stores.map(store => db.clear(store as any)));
// }

// /**
//  * Export data for backup
//  */
// export async function exportAllData(): Promise<Record<string, any[]>> {
//   const db = await initDB();
  
//   return {
//     todos: await db.getAll('todos'),
//     moods: await db.getAll('moods'),
//     reflections: await db.getAll('reflections'),
//     events: await db.getAll('events'),
//     snapshots: await db.getAll('snapshots'),
//     symptoms: await db.getAll('symptoms'),
//     habits: await db.getAll('habits'),
//   };
// }

// /**
//  * Import data from backup
//  */
// export async function importAllData(data: Record<string, any[]>): Promise<void> {
//   const db = await initDB();
  
//   for (const [storeName, items] of Object.entries(data)) {
//     if (items && Array.isArray(items)) {
//       const tx = db.transaction(storeName as any, 'readwrite');
//       await Promise.all(items.map(item => tx.store.put(item)));
//       await tx.done;
//     }
//   }
// }
