# localStorage JSON Parsing Fix

## Problem
The app was experiencing JSON parsing errors when reading from localStorage:
```
Error reading localStorage key "flowstate-mood-date": SyntaxError: Unexpected token 'S', "Sat Oct 18 2025" is not valid JSON
Error reading localStorage key "flowstate-mood": SyntaxError: Unexpected token 'm', "moderate" is not valid JSON
```

## Root Cause
Some components were directly using `localStorage.setItem()` to store plain strings (e.g., `"moderate"`, `"Sat Oct 18 2025"`), but the centralized `useLocalStorage` hook and helper functions expected all values to be JSON-stringified. When `JSON.parse()` tried to parse these plain strings, it failed.

## Solution

### 1. **Consistent Storage Utilities**
Updated all components to use the centralized storage utilities from `/hooks/useLocalStorage.ts`:
- `getLocalStorageItem(key, defaultValue)` - Safely reads and parses JSON
- `setLocalStorageItem(key, value)` - Safely stringifies and stores JSON

### 2. **Files Updated**
- ✅ `/components/CheckInScreen.tsx` - Now uses `setLocalStorageItem` for mood data
- ✅ `/components/SettingsScreen.tsx` - Now uses `getLocalStorageItem` and `setLocalStorageItem`
- ✅ `/components/MoodCheckInWidget.tsx` - Now uses proper storage utilities
- ✅ `/components/DashboardScreen.tsx` - Now uses `getLocalStorageItem` for reading mood
- ✅ `/components/DailyMomentumRing.tsx` - Now uses `getLocalStorageItem` with default values

### 3. **Migration System**
Created `/lib/localStorage-migration.ts` with two utilities:

#### `migrateLocalStorage()`
- Runs once on app startup (via `App.tsx`)
- Automatically converts old plain-string values to JSON-stringified format
- Marks migration as complete to avoid re-running
- Logs migration progress to console

#### `clearCorruptedKeys()`
- Available in DevTools for manual cleanup
- Removes any keys that can't be parsed as JSON
- Safe fallback if migration fails

### 4. **Developer Tools**
Created `/components/DevTools.tsx`:
- Access via URL: `?devtools=true`
- View all FlowState localStorage keys
- Identify corrupted keys (red) vs valid keys (green)
- Inspect individual key values in console
- Clear corrupted keys or all data
- Refresh to see updated state

## Usage

### For Users
The fix is automatic. On the next app load:
1. Migration runs automatically
2. Old data is converted to proper JSON format
3. No further errors occur

### For Developers
If issues persist:
1. Add `?devtools=true` to URL
2. Open Developer Tools panel
3. Click "Clear Corrupted Keys" to clean up bad data
4. Or click "Clear All Data" for fresh start

## Prevention
Going forward, all localStorage operations must use:
- `useLocalStorage()` hook for reactive state
- `getLocalStorageItem()` / `setLocalStorageItem()` for one-off reads/writes
- **NEVER** use raw `localStorage.setItem()` with plain strings

## Keys Affected
- `flowstate-mood`
- `flowstate-mood-date`
- `flowstate-mood-checkin-date`
- `flowstate-mood-checkin-value`
- `flowstate-energy`
- `flowstate-focus-area`
- `flowstate-coaching-date`

## Testing
1. ✅ Migration runs on app startup
2. ✅ Old plain strings are wrapped in JSON
3. ✅ Reading values works without errors
4. ✅ Writing new values uses consistent format
5. ✅ DevTools can identify and clear corrupted keys
