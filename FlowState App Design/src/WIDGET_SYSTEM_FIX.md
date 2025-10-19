# Widget System Fix - Dashboard Customization

## Problem

The dashboard was showing ALL widgets regardless of user's widget preferences from onboarding. Even though the user selected only:
- ✅ momentum: true
- ✅ weeklySummary: true

The dashboard was displaying everything (todos, health stats, AI insights, life areas, coaching, etc.)

## Root Cause

The DashboardScreen component had many hardcoded components that were ALWAYS rendered, without checking the `config.widgets` settings. Only a few widgets (momentum, weeklySummary, aiInsights, healthStats, weather/moon) were conditionally rendered.

## Solution

### Updated Widget Conditional Rendering

Now **ALL widgets** properly check `config.widgets` before rendering:

```typescript
// ✅ Always show (core UI)
<AdaptiveGreeting />
<TimeOfDayIndicator />

// ✅ Conditionally rendered based on config.widgets
{config.widgets.weather || config.widgets.moon && <WeatherMoonWidget />}
{config.widgets.momentum && <DailyMomentumRing />}
{config.widgets.weeklySummary && <WeeklySummaryCard />}
{config.widgets.aiInsights && <AIInsightsEngine />}
{config.widgets.healthStats && <HealthWidget />}

// ✅ Grouped under 'todos' widget
{config.widgets.todos && (
  <>
    <MoodCheckInWidget />
    <StatusCards /> {/* Mood, Energy, Activity */}
    <QuickReflectionCard />
    <FilteredTodos />
  </>
)}

// ✅ Grouped under 'habits' widget  
{config.widgets.habits && (
  <>
    <CoachingNudgeCard />
    <AdaptiveRecommendationsWidget />
    <GrowthMapQuickLink />
    <CoachingCheckInStatus />
    <FocusAreaSelector />
    <EncouragementMessage />
    <LifeAreasGrid />
  </>
)}

// ✅ Empty state if no widgets selected
{!anyWidgetsEnabled && <EmptyDashboardState />}
```

## Widget Configuration Mapping

### Available Widgets in Onboarding

| Widget Key | Dashboard Component(s) | Description |
|-----------|------------------------|-------------|
| `momentum` | DailyMomentumRing | Circular progress ring showing daily completion |
| `weeklySummary` | WeeklySummaryCard | Weekly stats and trends |
| `todos` | MoodCheckInWidget, StatusCards, QuickReflectionCard, FilteredTodos | Today's tasks and mood tracking |
| `habits` | CoachingNudgeCard, AdaptiveRecommendations, LifeAreasGrid, etc. | Habit management and life areas |
| `aiInsights` | AIInsightsEngine | AI-powered insights and patterns |
| `healthStats` | HealthWidget (Sleep, Steps, Heart) | Health data integration |
| `weather` | WeatherMoonWidget (weather section) | Weather information |
| `moon` | WeatherMoonWidget (moon section) | Moon phase tracking |
| `focusTimer` | FocusTimer | Pomodoro/focus timer (not on dashboard) |

### Core UI (Always Visible)

These are shown regardless of widget settings:
- **AdaptiveGreeting** - "Good morning, Gabrielle" with time-based message
- **TimeOfDayIndicator** - Visual indicator of current time period
- **AmbientParticles** - Background particle effects
- **Adaptive Background** - Time-based gradient backgrounds

## User's Current Configuration

Based on your onboarding selections:

```json
{
  "widgets": {
    "momentum": true,        // ✅ ENABLED
    "weeklySummary": true,   // ✅ ENABLED
    "todos": false,          // ❌ DISABLED
    "habits": false,         // ❌ DISABLED
    "aiInsights": false,     // ❌ DISABLED
    "healthStats": false,    // ❌ DISABLED
    "weather": false,        // ❌ DISABLED
    "moon": false,           // ❌ DISABLED
    "focusTimer": false      // ❌ DISABLED
  }
}
```

### What You Should See on Dashboard

1. **Core UI (Always visible)**
   - Good morning/afternoon/evening greeting
   - Time of day indicator
   - Ambient particle effects
   - Adaptive background gradient

2. **Daily Momentum Ring**
   - Circular progress visualization
   - Shows completion percentage
   - Animated and interactive

3. **Weekly Summary Card**
   - Weekly mood trends
   - Habit completion stats  
   - Sleep/energy patterns
   - "View Details" button → Weekly Insights

4. **Navigation**
   - Bottom navigation bar (Home, To-Dos, Habits, Coach, More)
   - Always accessible regardless of widgets

### What You Should NOT See

Since these widgets are disabled:
- ❌ Weather/Moon widget
- ❌ Mood Check-In widget
- ❌ Today's Mood/Energy/Activity cards
- ❌ Quick Reflection card
- ❌ Today's Tasks section
- ❌ Life Areas grid
- ❌ Coaching Nudge card
- ❌ Adaptive Recommendations widget
- ❌ Growth Map quick link
- ❌ Focus Area Selector
- ❌ Encouragement Message
- ❌ AI Insights Engine
- ❌ Health Stats (Sleep/Steps/Heart)

## Empty Dashboard State

If ALL widgets are disabled, you'll see:

```
🌱
Your Dashboard is Empty
Add widgets to personalize your dashboard experience
[Customize Dashboard Button]
```

This button navigates to Settings where you can re-enable widgets.

## How to Enable/Disable Widgets

### Option 1: Via Settings (Coming Soon)

Navigate to Settings → Dashboard Widgets → Toggle widgets on/off

### Option 2: Via localStorage

```javascript
// Get current config
const config = JSON.parse(localStorage.getItem('flowstate-user-config'));

// Enable a widget
config.widgets.todos = true;
config.widgets.habits = true;

// Save back
localStorage.setItem('flowstate-user-config', JSON.stringify(config));

// Reload to see changes
window.location.reload();
```

### Option 3: Re-run Onboarding

Clear onboarding completion to go through setup again:

```javascript
const config = JSON.parse(localStorage.getItem('flowstate-user-config'));
config.onboardingCompleted = false;
localStorage.setItem('flowstate-user-config', JSON.stringify(config));
window.location.reload();
```

## Widget Groups

Widgets are logically grouped:

### 📊 **Progress & Tracking**
- momentum - Daily progress ring
- weeklySummary - Weekly stats
- healthStats - Health metrics

### ✅ **Tasks & Habits**
- todos - Today's tasks
- habits - Life areas & habit management

### 🤖 **Intelligence & Guidance**
- aiInsights - AI pattern recognition
- Coaching nudges (part of habits)
- Adaptive recommendations (part of habits)

### 🌤️ **Context & Environment**
- weather - Weather info
- moon - Moon phase
- Time of day (always visible)

### ⏱️ **Tools** (Not on Dashboard)
- focusTimer - Pomodoro timer (in Focus Tools screen)

## Testing Your Configuration

1. **Check localStorage**:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('flowstate-user-config')));
   ```

2. **Check console logs**:
   - Dashboard logs config on mount
   - Look for: `📊 Dashboard Config: { widgets: {...} }`

3. **Visual verification**:
   - Only Momentum Ring and Weekly Summary should appear
   - No todos, no life areas, no health stats
   - Clean, minimal dashboard

## Benefits of Widget System

✅ **Personalization** - Show only what matters to you  
✅ **Reduced Cognitive Load** - Less clutter, more focus  
✅ **Faster Performance** - Fewer components to render  
✅ **Migraine-Friendly** - Simpler, calmer interface  
✅ **Adaptive UX** - Dashboard adapts to your needs  
✅ **Easy Updates** - Enable widgets as you need them  

## Future Enhancements

- [ ] Widget drag-and-drop reordering
- [ ] Custom widget sizes (small, medium, large)
- [ ] Widget color customization
- [ ] Per-widget settings (e.g., weekly summary date range)
- [ ] Widget presets (Minimal, Balanced, Power User)
- [ ] Widget analytics (which widgets you use most)
- [ ] Time-based widget display (show different widgets at different times)
- [ ] Context-aware widgets (show based on mood/energy)

## Troubleshooting

### Problem: All widgets still showing

**Solution**: Check that config is being read properly
```javascript
// In Dashboard console
console.log(config.widgets);
// Should show your enabled/disabled widgets
```

### Problem: Empty dashboard even with widgets enabled

**Solution**: Verify localStorage has correct structure
```javascript
const config = JSON.parse(localStorage.getItem('flowstate-user-config'));
console.log(config.widgets);
// Ensure enabled widgets are set to true
```

### Problem: Widget changes not taking effect

**Solution**: Hard refresh the page
- Mac: Cmd + Shift + R
- Windows/Linux: Ctrl + Shift + R
- Or: Clear localStorage and re-onboard

### Problem: Can't find widget settings

**Solution**: Widgets are configured during onboarding
- Re-run onboarding to change selections
- Or manually edit localStorage (see Option 2 above)

## Related Files

- `/components/DashboardScreen.tsx` - Main dashboard with widget rendering logic
- `/config/UserConfigContext.tsx` - User config provider
- `/hooks/useConfigSync.ts` - Config synchronization hook
- `/components/onboarding/steps/WidgetsStep.tsx` - Onboarding widget selection

## Notes

- Widget preferences persist across sessions via localStorage
- Config sync happens automatically via useConfigSync hook
- Dashboard logs config changes for debugging
- Default widgets (if none selected): momentum, weeklySummary, habits, todos
