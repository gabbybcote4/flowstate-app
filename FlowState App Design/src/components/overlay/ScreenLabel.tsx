// No direct React imports needed (using automatic JSX runtime)
import { useNavigation } from '../context/NavigationContext';
import { useDevOverlay } from './DevOverlayContext';

/**
 * Small dev overlay that displays the current screen name in the top-left corner.
 * Render only in development builds.
 */
export function ScreenLabel() {
  // Guard: only render in dev
  // Vite exposes import.meta.env.DEV; Types are available in the project setup.
  if (!(import.meta as any)?.env?.DEV) return null;

  const { currentScreen } = useNavigation();
  const { enabled } = useDevOverlay();

  if (!enabled) return null;

  // Friendly mapping for display (fall back to raw name)
  const friendly: Record<string, string> = {
    home: 'Home',
    checkin: 'Check-In',
    todos: 'To-Dos',
    calendar: 'Calendar',
    coach: 'Coach',
    'coach-chat': 'Coach Chat',
    reflection: 'Reflection',
    settings: 'Settings',
    'habit-builder': 'Habits',
    'habit-stacking': 'Habit Stacking',
    'habit-education': 'Habit Education',
    'discipline-builder': 'Discipline Builder',
    'growth-map': 'Growth Map',
    'timeflow': 'Time Flow',
    'focus-tools': 'Focus Tools',
    'weekly-insights': 'Weekly Insights',
    'symptom-tracker': 'Symptom Tracker',
    community: 'Community',
    integrations: 'Integrations',
  };

  const label = friendly[currentScreen] ?? currentScreen;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-2 left-2 z-[9999]"
      style={{ mixBlendMode: 'difference' }}
    >
      <div className="bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded shadow-sm border border-slate-200">
        {label}
      </div>
    </div>
  );
}
