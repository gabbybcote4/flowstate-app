//  from 'motion/react';
import { useEmotionalState } from '../manager/EmotionalStateManager';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sparkles, X, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Gentle Mode Overlay
 * 
 * Activates when user is overwhelmed/anxious:
 * - Dims screen brightness
 * - Simplifies UI
 * - Offers gentle activity suggestions
 * - Compassionate messaging
 */

export function GentleModeOverlay() {
  const { isGentleMode, toggleGentleMode, currentState, brightness } = useEmotionalState();
  const { themeColors } = useTheme();

  const gentleActivities = [
    { icon: '🫁', text: 'Take 3 deep breaths', action: 'breathing' },
    { icon: '💧', text: 'Drink some water', action: 'hydrate' },
    { icon: '🚶', text: 'Short 5-minute walk', action: 'walk' },
    { icon: '📝', text: 'Write one thought', action: 'journal' },
    { icon: '🎧', text: 'Listen to calm music', action: 'music' },
    { icon: '😌', text: 'Rest for 10 minutes', action: 'rest' },
  ];

  const getMessage = () => {
    switch (currentState) {
      case 'overwhelmed':
        return {
          title: "You're feeling a lot right now",
          subtitle: "Let's make things simpler and gentler",
          emoji: '💙',
        };
      case 'anxious':
        return {
          title: "Your mind is racing",
          subtitle: "Let's slow down together",
          emoji: '🌙',
        };
      case 'tired':
        return {
          title: "Your energy is low",
          subtitle: "Rest is productive too",
          emoji: '😴',
        };
      default:
        return {
          title: "Gentle mode is here for you",
          subtitle: "Taking it easy today",
          emoji: '🌸',
        };
    }
  };

  const message = getMessage();

  if (!isGentleMode) return null;

  return (
    <AnimatePresence>
      < div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 pointer-events-none"
      >
        {/* Dimming overlay */}
        < div
          initial={{ opacity: 0 }}
          animate={{ opacity: (100 - brightness) / 100 }}
          className="absolute inset-0 bg-black"
        />

        {/* Gentle mode card */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-auto">
          < div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl border-2 border-indigo-200 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  < div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center"
                  >
                    <Moon size={24} className="text-indigo-600" />
                  </ div>
                  <div>
                    <h3 className="text-indigo-900 mb-1">Gentle Mode Active</h3>
                    <p className="text-xs text-indigo-600">Dimmed brightness • Simplified view</p>
                  </div>
                </div>
                <button
                  onClick={toggleGentleMode}
                  className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-indigo-600" />
                </button>
              </div>

              {/* Emotional message */}
              <div className="bg-white/60 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{message.emoji}</span>
                  <div>
                    <p className="text-sm text-gray-800 mb-1">{message.title}</p>
                    <p className="text-xs text-gray-600">{message.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Gentle suggestions */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={14} className="text-indigo-600" />
                  <p className="text-xs text-indigo-700">Gentle suggestions for right now:</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {gentleActivities.slice(0, 4).map((activity, index) => (
                    < button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        // Could trigger specific actions here
                        if (activity.action === 'breathing') {
                          // Navigate to breathing exercise
                        }
                      }}
                      className="bg-white/80 hover:bg-white rounded-xl p-3 text-left transition-all hover:shadow-md group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{activity.icon}</span>
                        <span className="text-xs text-gray-700 group-hover:text-indigo-600 transition-colors">
                          {activity.text}
                        </span>
                      </div>
                    </ button>
                  ))}
                </div>
              </div>

              {/* Affirmation */}
              < div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200"
              >
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {getAffirmation(currentState)}
                  </p>
                </div>
              </ div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-indigo-100/50 border-t border-indigo-200 flex items-center justify-between">
              <p className="text-xs text-indigo-600">
                Taking it one moment at a time
              </p>
              <button
                onClick={toggleGentleMode}
                className="text-xs text-indigo-700 hover:text-indigo-900 underline"
              >
                Exit gentle mode
              </button>
            </div>
          </ div>
        </div>
      </ div>
    </AnimatePresence>
  );
}

function getAffirmation(state: string): string {
  const affirmations = {
    overwhelmed: [
      "You don't have to do everything right now. Just this one moment.",
      "It's okay to feel this way. You're doing your best.",
      "Small steps are still steps forward.",
    ],
    anxious: [
      "Your feelings are valid. Take a breath.",
      "This feeling will pass. You've gotten through this before.",
      "Focus on what you can control right now.",
    ],
    tired: [
      "Rest is not lazy. Rest is necessary.",
      "Your body is asking for what it needs. Listen.",
      "Tomorrow is a new day. For now, just rest.",
    ],
    calm: [
      "You're doing beautifully.",
      "Trust your gentle pace.",
      "Every small effort counts.",
    ],
  };

  const list = affirmations[state as keyof typeof affirmations] || affirmations.calm;
  return list[Math.floor(Math.random() * list.length)];
}

// Brightness slider component
export function BrightnessControl() {
  const { brightness, updateBrightness } = useEmotionalState();
  const { themeColors } = useTheme();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="flex items-center gap-3 mb-4">
        <Moon size={20} style={{ color: themeColors.primary }} />
        <div>
          <h3 className="text-sm">Screen Brightness</h3>
          <p className="text-xs text-gray-500">Adjust for comfort</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Moon size={16} className="text-gray-400" />
        <input
          type="range"
          min="50"
          max="100"
          value={brightness}
          onChange={(e) => updateBrightness(parseInt(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${brightness - 50}%, #e5e7eb ${brightness - 50}%, #e5e7eb 100%)`,
          }}
        />
        <span className="text-sm text-gray-600 w-12 text-right">{brightness}%</span>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Lower brightness can help with eye strain and migraines
      </p>
    </div>
  );
}
