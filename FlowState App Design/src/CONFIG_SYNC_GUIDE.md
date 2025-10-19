# Configuration Synchronization Guide

## Overview

The FlowState app now features a comprehensive configuration synchronization system that ensures all user selections made during the onboarding wizard are properly applied throughout the entire application.

## How It Works

### 1. UserConfig Context (`/config/UserConfigContext.tsx`)

The central store for all user configuration. This includes:
- **Theme settings** (mode, primary color, font size)
- **Life areas** (enabled areas and their settings)
- **Feature toggles** (which features are enabled)
- **Widget visibility** (which dashboard widgets to show)
- **Journaling preferences**
- **Notification settings**
- **Integration preferences**
- **Navigation order**
- **Dashboard layout**

All configuration is automatically persisted to localStorage under the key `flowstate-user-config`.

### 2. Configuration Sync Hook (`/hooks/useConfigSync.ts`)

This custom hook runs in the main `AppContent` component and performs the following:

#### Theme Synchronization
- Maps `config.theme.mode` to ThemeContext settings:
  - `'light'` → Sets dark mode off, minimal mode off
  - `'dark'` → Sets dark mode on, minimal mode off
  - `'minimal'` → Sets minimal mode on (migraine-friendly)
  - `'auto'` → Detects system preference

#### Color Synchronization
- Maps hex color codes to theme names (Lavender, Mint, Peach)
- Applies the primary color to CSS custom properties
- Updates the ThemeContext with the selected theme

#### Font Size Synchronization
- Maps config font size (`small`, `medium`, `large`) to ThemeContext values

### 3. Dashboard Widget Rendering (`/components/DashboardScreen.tsx`)

The Dashboard now conditionally renders widgets based on `config.widgets`:

```typescript
{/* Weather + Moon Widget - Only shows if enabled */}
{(config.widgets.weather || config.widgets.moon) && (
  <div className="mb-6">
    <WeatherMoonWidget />
  </div>
)}

{/* Daily Momentum Ring - Only shows if enabled */}
{config.widgets.momentum && (
  <div className="mb-6">
    <DailyMomentumRing />
  </div>
)}

{/* AI Insights - Only shows if enabled */}
{config.widgets.aiInsights && (
  <div className="mb-6">
    <AIInsightsEngine />
  </div>
)}

// ... and so on for all widgets
```

### 4. Configuration Flow

1. **User completes onboarding** → Wizard updates `UserConfig` via `updateConfig()`
2. **Config is saved to localStorage** → Happens automatically in UserConfigProvider
3. **On next app load** → Config is loaded from localStorage
4. **useConfigSync runs** → Synchronizes config with ThemeContext and CSS variables
5. **Components read config** → Dashboard and other components use `useUserConfig()` to read settings
6. **UI updates** → Only enabled widgets are rendered, theme is applied, etc.

## Widget Configuration

The following widgets can be toggled in the onboarding:

- `weather` - Weather conditions
- `moon` - Moon phase tracker
- `healthStats` - Activity and health data
- `weeklySummary` - Weekly progress summary
- `todos` - Task list widget
- `habits` - Habit tracker widget
- `focusTimer` - Pomodoro/focus timer
- `aiInsights` - AI-powered insights
- `momentum` - Daily momentum ring

## Feature Toggles

The following features can be enabled/disabled:

- `checkin` - Daily check-in screen
- `home` - Dashboard
- `todos` - To-do list
- `habits` - Habit builder
- `calendar` - Calendar view
- `reflection` - Daily reflection
- `coaching` - AI coaching
- `growth` - Growth map
- `focus` - Focus tools
- `timeflow` - Time flow scheduler
- `discipline` - Discipline builder
- `education` - Habit education
- `integrations` - External integrations
- `community` - Community features
- `symptomTracker` - Symptom tracking

## Theme Settings

### Theme Modes
- **Light**: Bright and airy, perfect for daytime
- **Dark**: Easy on the eyes in low light
- **Minimal**: Ultra-clean, migraine-friendly
- **Auto**: Follows system preference

### Color Options
- Lavender (`#A78BFA`)
- Purple (`#C084FC`)
- Pink (`#FBCFE8`)
- Peach (`#FED7AA`)
- Mint (`#A7F3D0`)
- Sky (`#93C5FD`)

### Font Sizes
- Small
- Medium (default)
- Large

## Using Configuration in Components

To access user configuration in any component:

```typescript
import { useUserConfig } from '../config/UserConfigContext';

function MyComponent() {
  const { config, updateConfig } = useUserConfig();
  
  // Read configuration
  const isFeatureEnabled = config.enabledFeatures.someFeature;
  const primaryColor = config.theme.primaryColor;
  
  // Update configuration
  const handleToggleFeature = () => {
    updateConfig({
      enabledFeatures: {
        ...config.enabledFeatures,
        someFeature: !config.enabledFeatures.someFeature
      }
    });
  };
  
  return (
    // ... component JSX
  );
}
```

## Testing Configuration Changes

1. Clear localStorage: `localStorage.clear()`
2. Reload the app
3. Go through onboarding and make selections
4. Verify that:
   - Theme is applied correctly
   - Only selected widgets appear on dashboard
   - Font size is correct
   - Minimal mode works if selected

## Future Enhancements

Potential additions to the config system:

1. **Navigation customization** - Allow users to reorder bottom nav items based on `config.navOrder`
2. **Life area customization** - Respect `config.lifeAreas` for which areas show in the app
3. **Dashboard layout** - Use `config.dashboardLayout` for custom widget positioning
4. **Journaling integration** - Apply `config.journaling` settings to reflection screens
5. **Notification customization** - Apply `config.notifications` to notification system
6. **Integration sync** - Auto-connect integrations based on `config.integrations`

## Troubleshooting

### Theme not applying
- Check that `useConfigSync` is being called in `AppContent`
- Verify that `config.onboardingCompleted` is `true`
- Check browser console for errors

### Widgets not showing/hiding
- Verify `config.widgets` values in localStorage
- Check that `useUserConfig` is imported correctly in `DashboardScreen`
- Ensure conditional rendering logic is correct

### Configuration not persisting
- Check that UserConfigProvider is wrapping the app
- Verify localStorage is not disabled
- Check for localStorage quota errors

## Implementation Checklist

✅ Created `useConfigSync` hook for theme/config synchronization
✅ Integrated config context into DashboardScreen
✅ Added conditional widget rendering based on config
✅ Applied theme settings on app load
✅ Persisted all onboarding selections to localStorage

## Next Steps

To fully complete the configuration integration:

1. Update bottom navigation to respect `config.navOrder`
2. Filter features based on `config.enabledFeatures`
3. Apply life areas from `config.lifeAreas` throughout the app
4. Implement notification config in MindfulNotificationSystem
5. Add dashboard layout customization based on `config.dashboardLayout`
