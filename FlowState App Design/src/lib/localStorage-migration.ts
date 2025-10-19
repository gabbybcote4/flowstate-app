/**
 * localStorage Migration Utility
 * 
 * Handles migration of old localStorage data that was stored as plain strings
 * to the new JSON-stringified format
 */

const MIGRATION_KEY = 'flowstate-migration-v1';

/**
 * Migrates old plain-string localStorage values to JSON format
 */
export function migrateLocalStorage(): void {
  // Check if migration has already run
  if (typeof window === 'undefined') return;
  
  const hasRunMigration = localStorage.getItem(MIGRATION_KEY);
  if (hasRunMigration === 'completed') {
    return;
  }

  console.log('Running localStorage migration...');

  // List of keys that need migration
  const keysToMigrate = [
    'flowstate-mood',
    'flowstate-mood-date',
    'flowstate-mood-checkin-date',
    'flowstate-mood-checkin-value',
    'flowstate-energy',
    'flowstate-focus-area',
    'flowstate-coaching-date',
  ];

  keysToMigrate.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) {
        // Try to parse it - if it fails, it's a plain string
        try {
          JSON.parse(value);
          // Already valid JSON, no need to migrate
        } catch {
          // It's a plain string, re-save it as JSON
          localStorage.setItem(key, JSON.stringify(value));
          console.log(`Migrated ${key}`);
        }
      }
    } catch (error) {
      console.error(`Error migrating ${key}:`, error);
    }
  });

  // Mark migration as complete
  localStorage.setItem(MIGRATION_KEY, 'completed');
  console.log('localStorage migration completed');
}

/**
 * Force clear corrupted localStorage keys
 * Use this if migration fails
 */
export function clearCorruptedKeys(): void {
  if (typeof window === 'undefined') return;

  const keysToClear = [
    'flowstate-mood',
    'flowstate-mood-date',
    'flowstate-mood-checkin-date',
    'flowstate-mood-checkin-value',
    'flowstate-energy',
    'flowstate-focus-area',
    'flowstate-coaching-date',
  ];

  keysToClear.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          JSON.parse(value);
        } catch {
          // Corrupted, clear it
          localStorage.removeItem(key);
          console.log(`Cleared corrupted key: ${key}`);
        }
      }
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  });
}
