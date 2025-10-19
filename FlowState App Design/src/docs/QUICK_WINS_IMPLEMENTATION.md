# 🚀 Quick Wins Implementation Guide

## Overview

This document tracks the implementation of code-level TODOs for FlowState, focusing on real API integration, state management, storage, and performance improvements.

---

## ✅ **1. Real APIs & Real Data**

### API Integrations (`/components/api-integrations.ts`)

#### ✅ Completed:
- **Real API adapters** exported in `apiAdapters` object
- **Health data** (HealthKit/Google Fit) with Google Fit REST API integration
- **Calendar data** (Google Calendar/Outlook) with Google Calendar API v3
- **Weather data** (OpenWeather) with full API implementation
- **Moon phase utility** (`getMoonPhase()`) with astronomical calculations

#### Usage:
```typescript
import { apiAdapters, getMoonPhase } from './components/api-integrations';

// Health data (uses env var VITE_HEALTH_API_KEY)
const healthData = await apiAdapters.health.fetch();

// Calendar events
const events = await apiAdapters.calendar.fetch(apiKey, startDate, endDate);

// Weather
const weather = await apiAdapters.weather.fetch(apiKey, { lat, lon });

// Moon phase
const moonPhase = getMoonPhase(new Date());
console.log(moonPhase.name); // "Waxing Crescent"
console.log(moonPhase.emoji); // "🌒"
```

#### Environment Variables:
Add to your `.env` file:
```bash
VITE_HEALTH_API_KEY=your_google_fit_api_key
VITE_CALENDAR_API_KEY=your_google_calendar_api_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

#### API Key Setup:

**Google Fit:**
1. Go to Google Cloud Console
2. Enable Google Fit API
3. Create OAuth 2.0 credentials
4. Add scopes: `fitness.activity.read`, `fitness.sleep.read`, `fitness.heart_rate.read`

**Google Calendar:**
1. Enable Google Calendar API
2. Create OAuth 2.0 credentials
3. Add scope: `calendar.readonly`

**OpenWeather:**
1. Sign up at openweathermap.org
2. Get free API key (1000 calls/day)
3. No authentication beyond API key needed

---

## ✅ **2. State + Storage**

### IndexedDB Cache Layer (`/components/storage.ts`)

#### ✅ Completed:
- **Full IndexedDB implementation** using `idb` library
- **7 data stores**: todos, moods, reflections, events, snapshots, symptoms, habitStacks
- **Comprehensive API** for each store with add/update/delete/query operations
- **Export/Import** functionality for data backup
- **Clear all data** for reset functionality

#### Data Stores:

**Todos:**
```typescript
import { todosDB } from './components/storage';

// Add todo
const todo = await todosDB.add({
  text: 'Morning meditation',
  completed: false,
  priority: 'high',
  energy: 'low',
  lifeArea: 'health',
});

// Get all todos
const todos = await todosDB.getAll();

// Update todo
await todosDB.update(todo.id, { completed: true });

// Delete todo
await todosDB.delete(todo.id);
```

**Moods:**
```typescript
import { moodsDB } from './components/storage';

// Add mood entry
await moodsDB.add({
  date: new Date().toISOString(),
  mood: 4,
  energy: 3,
  focus: 4,
  physicalHealth: 4,
  stress: 2,
  notes: 'Feeling good today',
});

// Get mood history
const moods = await moodsDB.getLatest(30); // Last 30 entries
```

**Symptoms:**
```typescript
import { symptomsDB } from './components/storage';

// Log symptom
await symptomsDB.add({
  date: new Date().toISOString(),
  type: 'migraine',
  severity: 7,
  triggers: ['bright lights', 'stress'],
  location: 'left temple',
  duration: 180, // minutes
  notes: 'Started after meeting',
});

// Get symptom history
const symptoms = await symptomsDB.getByType('migraine');
```

**Habit Stacks:**
```typescript
import { habitStacksDB } from './components/storage';

// Create habit stack
await habitStacksDB.add({
  title: 'Morning Momentum',
  description: 'Start day strong',
  steps: [
    { id: '1', habitId: 'wake', habitName: 'Wake up', order: 1, completed: false },
    { id: '2', habitId: 'water', habitName: 'Drink water', order: 2, completed: false },
    { id: '3', habitId: 'stretch', habitName: 'Stretch', order: 3, completed: false },
  ],
  trigger: 'After I wake up',
  active: true,
  completionCount: 0,
});

// Get active stacks
const stacks = await habitStacksDB.getActive();
```

#### Data Backup:
```typescript
import { exportAllData, importData, clearAllData } from './components/storage';

// Export all data
const jsonBackup = await exportAllData();
// Save to file or cloud

// Import data
await importData(jsonBackup);

// Clear all data (reset)
await clearAllData();
```

---

### Navigation Context (`/components/NavigationContext.tsx`)

#### ✅ Completed:
- **Centralized navigation state** with history stack
- **Persist last screen** to localStorage
- **Navigate, goBack, replace, reset** functions
- **Navigation hooks** for easy integration
- **Screen guard** and helper components

#### Usage:
```typescript
import { NavigationProvider, useNavigation } from './components/NavigationContext';

// Wrap app with provider
function App() {
  return (
    <NavigationProvider persist={true}>
      <YourApp />
    </NavigationProvider>
  );
}

// Use in components
function SomeScreen() {
  const { navigate, goBack, currentScreen, canGoBack } = useNavigation();

  return (
    <div>
      <button onClick={() => navigate('home')}>Home</button>
      {canGoBack && <button onClick={goBack}>Back</button>}
      <p>Current: {currentScreen}</p>
    </div>
  );
}
```

#### Hooks:
```typescript
// Check if on specific screen
const isHome = useIsScreen('home');

// Get navigation params
const params = useNavigationParams<{ id: string }>();

// Restore last screen on mount
useRestoreLastScreen();

// Analytics
const { totalScreens, mostVisited, path } = useNavigationAnalytics();
```

---

## ✅ **3. Performance & UX**

### Skeleton Loaders (`/components/ui/skeleton-loaders.tsx`)

#### ✅ Completed:
- **Dashboard skeleton** with momentum ring, quick actions, tasks
- **Coach chat skeleton** with message bubbles
- **Todos skeleton** with list items
- **Calendar skeleton** with month view
- **Reflection skeleton** with prompts
- **Settings skeleton** with groups
- **Habit builder skeleton** with steps
- **Generic skeletons** (Card, List, Text, Circle)

#### Usage:
```typescript
import { DashboardSkeleton, CoachChatSkeleton } from './components/ui/skeleton-loaders';

function Dashboard() {
  const [loading, setLoading] = useState(true);

  if (loading) return <DashboardSkeleton />;

  return <ActualDashboard />;
}
```

---

## 🔨 **Next Steps - Implementation Roadmap**

### **Immediate (High Priority)**

#### 1. Calendar & TimeFlow Drag-and-Drop
**Location:** `/components/TimeFlowScreen.tsx`, `/components/CalendarScreen.tsx`

**Task:**
- Wire drag-and-drop of `TodoCard` to create/update calendar events
- Show conflict stripes when events overlap
- Sync with `eventsDB`

**Implementation:**
```typescript
import { useDrag, useDrop } from 'react-dnd';
import { eventsDB } from './components/storage';

// In TodoCard
const [{ isDragging }, drag] = useDrag({
  type: 'TODO',
  item: { id: todo.id, todo },
});

// In Calendar time slot
const [{ isOver }, drop] = useDrop({
  accept: 'TODO',
  drop: async (item: { todo: Todo }, monitor) => {
    const dropTime = calculateTimeFromPosition(monitor.getClientOffset());
    
    // Create calendar event from todo
    await eventsDB.add({
      title: item.todo.text,
      start: dropTime.toISOString(),
      end: new Date(dropTime.getTime() + (item.todo.timeEstimate || 30) * 60000).toISOString(),
      duration: item.todo.timeEstimate || 30,
      type: 'focus',
      source: 'user',
      todoId: item.todo.id,
      isRecurring: false,
    });
  },
});
```

#### 2. Integrate Storage with Existing Screens

**Tasks:**
- Replace localStorage in `TodosScreen` with `todosDB`
- Replace localStorage in `CheckInScreen` with `moodsDB`
- Replace localStorage in `ReflectionScreen` with `reflectionsDB`
- Replace localStorage in `CalendarScreen` with `eventsDB`

**Example (TodosScreen):**
```typescript
import { todosDB } from './components/storage';

// Replace:
// localStorage.setItem('todos', JSON.stringify(todos));
// With:
await todosDB.add({ text, completed: false, priority, energy });

// Replace:
// const saved = localStorage.getItem('todos');
// With:
const todos = await todosDB.getAll();
```

#### 3. Symptom Tracker Integration

**Location:** `/components/SymptomTrackerScreen.tsx`

**Tasks:**
- Use `symptomsDB` instead of localStorage
- Surface correlations in `AIInsightsEngine`
- Add symptom-mood correlation analysis

**Correlation Analysis:**
```typescript
import { symptomsDB, moodsDB } from './components/storage';

async function analyzeSymptomCorrelations() {
  const symptoms = await symptomsDB.getAll();
  const moods = await moodsDB.getAll();

  // Find correlations
  const correlations = symptoms.map(symptom => {
    const dayMoods = moods.filter(m => 
      new Date(m.date).toDateString() === new Date(symptom.date).toDateString()
    );

    return {
      symptom: symptom.type,
      avgMood: dayMoods.reduce((sum, m) => sum + m.mood, 0) / dayMoods.length,
      avgEnergy: dayMoods.reduce((sum, m) => sum + m.energy, 0) / dayMoods.length,
    };
  });

  return correlations;
}
```

#### 4. Habit Stacking Implementation

**Location:** `/components/HabitStackingScreen.tsx`

**Tasks:**
- Use `habitStacksDB` instead of localStorage
- Reuse `HabitBuilderScreen` atoms for rendering stack steps
- Add stack completion tracking

**Example:**
```typescript
import { habitStacksDB } from './components/storage';
import { HabitStackVisualizer } from './components/ui/stack-connector';

function HabitStackingScreen() {
  const [stacks, setStacks] = useState<HabitStack[]>([]);

  useEffect(() => {
    habitStacksDB.getActive().then(setStacks);
  }, []);

  const completeStep = async (stackId: string, stepId: string) => {
    const stack = await habitStacksDB.getById(stackId);
    if (stack) {
      const updatedSteps = stack.steps.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      );

      await habitStacksDB.update(stackId, { steps: updatedSteps });
    }
  };

  return (
    <div>
      {stacks.map(stack => (
        <HabitStackVisualizer
          key={stack.id}
          habits={stack.steps.map(step => ({
            id: step.id,
            name: step.habitName,
            completed: step.completed,
          }))}
        />
      ))}
    </div>
  );
}
```

---

### **Medium Priority**

#### 5. Privacy & Security

**Tasks:**
- Add scopes screen in `IntegrationsScreen`
- Add "Clear data / Reset" actions in `SettingsScreen`
- Environment variable guidance for `.env` usage

**Settings Reset Actions:**
```typescript
import { clearAllData, clearNavigationHistory } from './components/storage';

async function handleResetData() {
  if (confirm('Are you sure? This cannot be undone.')) {
    await clearAllData();
    clearNavigationHistory();
    localStorage.clear();
    window.location.reload();
  }
}
```

**Integrations Scopes Screen:**
```typescript
const integrationScopes = {
  googleFit: {
    required: ['fitness.activity.read', 'fitness.sleep.read'],
    optional: ['fitness.heart_rate.read'],
    description: 'Access your health and activity data',
  },
  googleCalendar: {
    required: ['calendar.readonly'],
    optional: [],
    description: 'Read your calendar events',
  },
  openWeather: {
    required: ['current weather'],
    optional: ['forecast'],
    description: 'Get weather data for your location',
  },
};
```

#### 6. Route-Based Lazy Loading

**Task:** Lazy load heavy screens to improve initial load time

**Implementation:**
```typescript
import { lazy, Suspense } from 'react';
import { DashboardSkeleton } from './components/ui/skeleton-loaders';

// Lazy load heavy screens
const CoachChatScreen = lazy(() => import('./components/CoachChatScreen'));
const GrowthMapScreen = lazy(() => import('./components/GrowthMapScreen'));
const AIInsightsEngine = lazy(() => import('./components/AIInsightsEngine'));

// Wrap with Suspense
function App() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <CoachChatScreen />
    </Suspense>
  );
}
```

---

### **Low Priority / Polish**

#### 7. Reduce Repaint in Animated Gradients

**Task:** Optimize gradient animations to use GPU acceleration

**Implementation:**
```typescript
// In animated background components
<div
  className="absolute inset-0"
  style={{
    background: 'linear-gradient(...)',
    willChange: 'opacity', // GPU acceleration hint
    transform: 'translateZ(0)', // Force GPU layer
  }}
/>

// Use CSS instead of inline styles where possible
// Add to globals.css
.optimized-gradient {
  background: linear-gradient(...);
  will-change: opacity;
  transform: translateZ(0);
}
```

---

## 📊 **Implementation Checklist**

### ✅ Completed (Phase 1)
- [x] Real API adapters (health, calendar, weather)
- [x] Moon phase utility function
- [x] IndexedDB storage layer with idb
- [x] 7 data stores (todos, moods, reflections, events, symptoms, stacks, snapshots)
- [x] Export/import/clear functionality
- [x] NavigationContext with persist
- [x] Navigation hooks and guards
- [x] Skeleton loaders for all major screens
- [x] Types for SymptomLog and HabitStack

### 🚧 In Progress (Phase 2)
- [ ] Wire drag-and-drop in TimeFlow/Calendar
- [ ] Replace localStorage with IndexedDB in all screens
- [ ] Symptom correlation analysis in AIInsightsEngine
- [ ] Habit stacking screen with habitStacksDB
- [ ] Privacy scopes screen
- [ ] Clear data / reset actions

### 📋 To Do (Phase 3)
- [ ] Lazy loading for heavy screens
- [ ] Optimize animated gradients
- [ ] API key management UI
- [ ] Offline mode indicators
- [ ] Data sync across devices
- [ ] Advanced correlation engine

---

## 🔧 **Developer Notes**

### Installing Dependencies

The following npm packages are used:
```bash
npm install idb  # IndexedDB wrapper
npm install react-dnd react-dnd-html5-backend  # Drag and drop (if not installed)
npm install motion/react  # Animations (already installed)
```

### Testing Storage

```typescript
// Test in browser console
import { todosDB } from './components/storage';

// Add test todo
await todosDB.add({
  text: 'Test todo',
  completed: false,
  priority: 'medium',
  energy: 'medium',
});

// View all todos
console.log(await todosDB.getAll());

// Export data
console.log(await exportAllData());
```

### Performance Monitoring

```typescript
// Add performance marks
performance.mark('db-query-start');
const todos = await todosDB.getAll();
performance.mark('db-query-end');
performance.measure('DB Query Time', 'db-query-start', 'db-query-end');

// View measurements
performance.getEntriesByType('measure').forEach(entry => {
  console.log(`${entry.name}: ${entry.duration}ms`);
});
```

---

## 📚 **Resources**

- **idb Library:** https://github.com/jakearchibald/idb
- **Google Fit API:** https://developers.google.com/fit
- **Google Calendar API:** https://developers.google.com/calendar
- **OpenWeather API:** https://openweathermap.org/api
- **IndexedDB Guide:** https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **React DnD:** https://react-dnd.github.io/react-dnd

---

**Last Updated:** October 18, 2025  
**Version:** 1.0.0  
**Status:** Phase 1 Complete ✅
