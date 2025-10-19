# Config-Driven Onboarding System - FlowState

## Overview

A comprehensive 12-step onboarding wizard that builds a user configuration instead of just collecting data. Every choice the user makes directly updates their `UserConfig`, which then drives the entire app experience.

## Architecture

### Core Files

1. **Config System**
   - `/config/userConfig.types.ts` - TypeScript types and default config
   - `/config/UserConfigContext.tsx` - React context with localStorage persistence
   - `/config/featureRegistry.ts` - Feature definitions and metadata

2. **Onboarding Components**
   - `/components/onboarding/ConfigOnboardingWizard.tsx` - Main wizard orchestrator
   - `/components/onboarding/LivePreviewPanel.tsx` - Real-time phone mockup preview
   - `/components/onboarding/steps/` - Individual step components:
     - `WelcomeStep.tsx` - Introduction
     - `ToneStep.tsx` - Coaching tone selection
     - `ThemeStep.tsx` - Visual theme and color
     - `LifeAreasStep.tsx` - Life areas to track
     - `FeaturesStep.tsx` - Feature toggles
     - `NavigationStep.tsx` - Drag-to-reorder navigation
     - `DashboardLayoutStep.tsx` - Dashboard templates
     - `WidgetsStep.tsx` - Widget selection
     - `JournalingStep.tsx` - Journaling preferences
     - `NotificationsStep.tsx` - Notification settings
     - `IntegrationsStep.tsx` - Third-party integrations
     - `ReviewStep.tsx` - Final review with phone mockup

3. **Integration**
   - `/context/AppProviders.tsx` - UserConfigProvider added to app-level providers
   - `/components/OnboardingScreen.tsx` - Updated to include config wizard in flow

## User Flow

```
1. Initial Onboarding (5 steps) ✓
   ↓
2. Auth (Sign Up / Log In) ✓
   ↓
3. Welcome Screen ✓
   ↓
4. Config Wizard (12 steps) ← NEW
   ↓
5. Main App (configured)
```

## The 12 Config Steps

### Step 1: Welcome
- Introduction to config-driven onboarding
- What will be customized
- Privacy note

### Step 2: Tone Selection
Updates: `config.tone`
- Gentle & Compassionate
- Motivating & Energetic
- Practical & Direct
- Playful & Fun

Each includes description and example message.

### Step 3: Theme & Colors
Updates: `config.theme.mode`, `config.theme.primaryColor`
- Light / Dark / Minimal / Auto mode
- 6 accent colors (Lavender, Purple, Pink, Peach, Mint, Sky)
- Live preview updates in real-time

### Step 4: Life Areas
Updates: `config.lifeAreas[]`
- 8 predefined areas (Health, Work, Relationships, etc.)
- Toggle enabled/disabled
- Visual selection with icons and colors

### Step 5: Features
Updates: `config.enabledFeatures{}`
- Categorized by: Core, Productivity, Wellness, Growth, Advanced
- Feature cards with descriptions
- Toggle switches
- Core features always enabled

### Step 6: Navigation
Updates: `config.navOrder[]`
- Drag-and-drop to reorder
- First 5 items become bottom navigation
- Visual indicators for bottom nav

### Step 7: Dashboard Layout
Updates: `config.dashboardLayout[]`, `config.dashboardTemplate`
- 4 templates:
  - Wellness Focus
  - Planner Mode
  - Balanced Hybrid
  - Custom Layout
- Each shows widget preview

### Step 8: Widgets
Updates: `config.widgets{}`
- 9 widget types (Weather, Moon, Health, etc.)
- Toggle on/off
- Counter shows enabled count

### Step 9: Journaling
Updates: `config.journaling{}`
- Master toggle
- Guided prompts, Daily reflection, Gratitude, Morning pages
- Dependent toggles (require journaling enabled)

### Step 10: Notifications
Updates: `config.notifications{}`
- Master enable/disable
- Types: Check-ins, Habits, Encouragement, Insights
- Frequency: Minimal / Moderate / Frequent

### Step 11: Integrations
Updates: `config.integrations[]`
- 7 integrations: Apple Health, Google Fit, Calendars, Spotify, Notion, OpenWeather
- Shows "Read-only" badges
- Privacy copy
- OAuth deferred to post-onboarding

### Step 12: Review & Apply
- Phone mockup preview
- Summary cards: Features, Widgets, Theme, Notifications
- "Edit Choices" back button
- "Build My Flow" completion button

## Live Preview Panel

Displays on the right side (desktop) for steps 2-8, showing:
- Phone frame mockup
- Real-time theme updates
- Navigation items (up to 5)
- Dashboard widget layout
- Current mode and tone

## Config Persistence

- All config stored in localStorage as `flowstate-user-config`
- Automatically saves on every update
- Includes version number for future migrations
- Loads on app start

## How Config Drives the App

### Navigation
```tsx
const { config } = useUserConfig();
const navItems = config.navOrder
  .filter(key => config.enabledFeatures[key])
  .map(key => FEATURE_REGISTRY[key]);
```

### Dashboard
```tsx
const widgets = config.dashboardLayout
  .sort((a, b) => a.position - b.position)
  .filter(w => config.widgets[w.type]);
```

### Feature Gating
```tsx
if (!config.enabledFeatures.coaching) {
  return null; // Don't render AI Coach
}
```

### Theme Application
```tsx
<ThemeProvider mode={config.theme.mode}>
  <div style={{ color: config.theme.primaryColor }}>
    ...
  </div>
</ThemeProvider>
```

## Design Details

- **Colors**: Pastel lavender (#A78BFA), peach (#FED7AA), mint (#A7F3D0)
- **Rounded**: 24px border radius (rounded-3xl)
- **Low Motion**: Smooth, gentle animations
- **Large Tap Targets**: 56px minimum height
- **Progress Dots**: 12 dots showing current step

## Next Steps

To fully wire the config system:

1. ✅ Create UserConfig types and context
2. ✅ Build 12-step wizard with live preview
3. ✅ Integrate into onboarding flow
4. ⏳ Update AnimatedBottomNav to read from config.navOrder
5. ⏳ Update DashboardScreen to render config.dashboardLayout
6. ⏳ Gate features using config.enabledFeatures
7. ⏳ Apply theme from config.theme
8. ⏳ Respect notification settings
9. ⏳ Add drag-and-drop dashboard builder (post-onboarding)
10. ⏳ Wire integrations OAuth flows

## Benefits

1. **User Empowerment**: Users build their own experience
2. **Reduced Clutter**: Only enabled features appear
3. **Personalization**: Every app instance is unique
4. **Performance**: Don't load disabled features
5. **Accessibility**: Users can simplify for migraine-friendly mode
6. **Future-Proof**: New features can be gated and optional

## Testing the Flow

1. Clear localStorage: `localStorage.clear()`
2. Refresh the app
3. Complete initial onboarding (5 steps)
4. Complete auth (sign up/log in)
5. See welcome screen
6. Enter 12-step config wizard
7. Make choices and watch live preview update
8. Review and complete
9. Enter main app with personalized config

The entire config is stored and will persist across sessions!
