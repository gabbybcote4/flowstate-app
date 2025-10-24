import { ChevronRight } from 'lucide-react';

interface LifeAreaCardProps {
  icon: string;
  title: string;
  progress: number;
  currentHabits: string[];
  suggestion: string;
  color: string;
  onClick?: () => void;
}

export function LifeAreaCard({
  icon,
  title,
  progress,
  currentHabits,
  suggestion,
  color,
  onClick,
}: LifeAreaCardProps) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">
        LIFE AREA CARD
      </div>
      <div
        className="flow-card"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <h3 className="text-[var(--color-card-foreground)]">{title}</h3>
              <div className="text-xs opacity-60 mt-0.5">{progress}% this week</div>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-30" />
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: `${color}20` }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
        </div>

        {/* Current Habits */}
        {currentHabits.length > 0 && (
          <div className="mb-3">
            <div className="text-xs opacity-50 mb-2">Active habits:</div>
            <div className="flex flex-wrap gap-2">
              {currentHabits.map((habit, index) => (
                <div
                  key={index}
                  className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ borderColor: `${color}40`, color: color }}
                >
                  {habit}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gentle Suggestion */}
        <div
          className="text-sm p-3 rounded-2xl mt-3"
          style={{ backgroundColor: `${color}15` }}
        >
          <div className="flex items-start gap-2">
            <span className="opacity-60">💡</span>
            <span className="flex-1 opacity-80">{suggestion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
