# Onboarding Configuration Sync - Complete Fix

## Problem

The onboarding selections (theme, widgets, features, etc.) are being saved to UserConfig but not being applied to the app because:

1. **Race Condition**: ThemeContext loads from its own localStorage before UserConfig is synced
2. **Dual Storage**: ThemeContext and UserConfig use different localStorage keys
3. **Missing Dependencies**: useConfigSync wasn't running on every config change

## Solution Applied

### 1. Enhanced useConfigSync Hook (`/hooks/useConfigSync.ts`)

**What it does:**
- Runs whenever config changes (removed the `onboardingCompleted` check as a dependency)
- Synchronizes theme mode, primary color, and font size to ThemeContext
- Applies custom colors directly to CSS variables
- Generates light/dark shades of primary color
- Includes console logging for debugging

**Key improvements:**
```typescript
// Now runs on EVERY config change, not just after onboarding complete
useEffect(() => {
  console.log('🔄 useConfigSync running...', config);
  
  // Apply theme mode
  switch (config.theme.mode) {
    case 'light': setDarkMode(false); setMinimalMode(false); break;
    case 'dark': setDarkMode(true); setMinimalMode(false); break;
    case 'minimal': setDarkMode(false); setMinimalMode(true); break;
    case 'auto': /* system detection */ break;
  }
  
  // Apply primary color to CSS variables
  root.style.setProperty('--color-primary', config.theme.primaryColor);
  
  // Generate and apply color shades
  root.style.setProperty('--color-primary-light', lightenColor(config.theme.primaryColor));
  root.style.setProperty('--color-primary-dark', darkenColor(config.theme.primaryColor));
  
}, [config.theme.mode, config.theme.primaryColor, config.theme.fontSize, ...]);
```

### 2. Dashboard Widget Conditionals (`/components/DashboardScreen.tsx`)

**What it does:**
- Checks `config.widgets` before rendering each widget
- Logs config to console for debugging

**Examples:**
```typescript
{/* Weather/Moon Widget - Only shows if enabled */}
{(config.widgets.weather || config.widgets.moon) && (
  <WeatherMoonWidget />
)}

{/* Momentum Ring - Only shows if enabled */}
{config.widgets.momentum && (
  <DailyMomentumRing />
)}

{/* AI Insights - Only shows if enabled */}
{config.widgets.aiInsights && (
  <AIInsightsEngine />
)}

{/* Health Stats - Only shows if enabled */}
{config.widgets.healthStats && (
  <div>...</div>
)}

{/* Weekly Summary - Only shows if enabled */}
{config.widgets.weeklySummary && (
  <WeeklySummaryCard />
)}
```

### 3. Enhanced Logging

**ConfigOnboardingWizard:**
```typescript
console.log('🎉 Completing onboarding with config:', config);
updateConfig({ onboardingCompleted: true });
console.log('✅ Onboarding marked as complete');
```

**DashboardScreen:**
```typescript
useEffect(() => {
  console.log('📊 Dashboard Config:', {
    widgets: config.widgets,
    theme: config.theme,
    onboardingCompleted: config.onboardingCompleted
  });
}, [config]);
```

**useConfigSync:**
```typescript
console.log('🔄 useConfigSync running...', {
  onboardingCompleted: config.onboardingCompleted,
  themeMode: config.theme.mode,
  primaryColor: config.theme.primaryColor,
  fontSize: config.theme.fontSize,
});
console.log('✅ Config sync complete!');
```

## How to Debug

### 1. Check Console Logs

After completing onboarding, you should see:
```
🎉 Completing onboarding with config: {theme: {...}, widgets: {...}, ...}
✅ Onboarding marked as complete
🔄 useConfigSync running... {themeMode: "light", primaryColor: "#A78BFA", ...}
✅ Config sync complete!
📊 Dashboard Config: {widgets: {...}, theme: {...}, ...}
```

### 2. Check localStorage

Open DevTools → Application → LocalStorage:
- `flowstate-user-config` should contain your full config
- `flowstate-theme` should match your selection (Lavender/Mint/Peach)
- `flowstate-fontsize` should match your font size
- `flowstate-darkmode` should be 'true' or 'false'
- `flowstate-minimal` should be 'true' or 'false'

### 3. Inspect with DevTools

Add `?devtools=true` to your URL to open the built-in DevTools dialog:
- Click "Inspect" on `flowstate-user-config` to see the full config
- Verify widgets, theme, and features are set correctly

### 4. Check CSS Variables

Open DevTools → Elements → html element → Styles:
```css
--color-primary: #A78BFA; /* Should match your choice */
--color-primary-light: #...
--color-primary-dark: #...
--base-font-size: 16px; /* Based on font size choice */
```

## Testing Checklist

- [ ] Complete onboarding and select a specific theme color (e.g., Peach #FED7AA)
- [ ] Select specific widgets to enable (e.g., only Momentum and Weekly Summary)
- [ ] Choose a font size (e.g., Large)
- [ ] Choose a theme mode (e.g., Dark)
- [ ] Complete wizard and check that:
  - [ ] Primary color appears throughout the app
  - [ ] Dark mode is applied (if selected)
  - [ ] Font size is correct
  - [ ] Only selected widgets appear on dashboard
  - [ ] Config persists after page reload

## Widget Reference

| Widget Key | Component | Description |
|-----------|-----------|-------------|
| `weather` | WeatherMoonWidget | Weather conditions |
| `moon` | WeatherMoonWidget | Moon phase |
| `healthStats` | HealthWidget (x3) | Sleep, Steps, Heart rate |
| `weeklySummary` | WeeklySummaryCard | Weekly progress |
| `todos` | TodoCard list | Task list (always shown in "Today's Tasks") |
| `habits` | (integrated) | Habit tracking |
| `focusTimer` | (not yet implemented) | Pomodoro timer |
| `aiInsights` | AIInsightsEngine | AI-powered insights |
| `momentum` | DailyMomentumRing | Daily progress ring |

## Known Issues & Workarounds

### Issue: Config not applying immediately
**Workaround:** Refresh the page after completing onboarding
**Root cause:** React state synchronization timing
**Fix planned:** Add forceUpdate after onboarding completion

### Issue: Theme color reverts to default
**Workaround:** Check that you're not selecting a custom hex value not in the color map
**Root cause:** useConfigSync maps specific hex colors to theme names
**Fix planned:** Support fully custom colors

### Issue: Widgets still showing after disabling
**Workaround:** Clear cache and hard reload (Cmd+Shift+R / Ctrl+Shift+R)
**Root cause:** React component memoization
**Fix planned:** Add key prop to force re-render

## Future Enhancements

1. **Navigation Customization**
   - Respect `config.navOrder` for bottom nav item ordering
   - Hide disabled features from "More" menu

2. **Life Areas Integration**
   - Use `config.lifeAreas` to show only enabled areas
   - Respect custom life area colors and icons

3. **Dashboard Layout**
   - Implement drag-and-drop widget ordering
   - Use `config.dashboardLayout` for persistence

4. **Notification Integration**
   - Apply `config.notifications` to MindfulNotificationSystem
   - Respect quiet hours and frequency settings

5. **Journaling Integration**
   - Show/hide journaling features based on `config.journaling`
   - Apply journaling preferences to ReflectionScreen

## Support

If widgets aren't showing after completing onboarding:

1. Open console (F12) and check for error messages
2. Add `?devtools=true` to URL and inspect config
3. Verify localStorage contains `flowstate-user-config`
4. Try refreshing the page
5. As last resort, clear localStorage and redo onboarding
