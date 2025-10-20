import { useEffect, useState } from 'react';
import { MessageCircleHeart, ArrowRight } from 'lucide-react';

interface CoachingInsightWidgetProps {
  onNavigateToCoaching: () => void;
}

export function CoachingInsightWidget({ onNavigateToCoaching }: CoachingInsightWidgetProps) {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<{
    mood: number;
    energy: number;
    focus: number;
  } | null>(null);

  useEffect(() => {
    const savedDate = localStorage.getItem('flowstate-coaching-date');
    const today = new Date().toDateString();
    
    if (savedDate === today) {
      setHasCheckedIn(true);
      const savedData = localStorage.getItem('flowstate-coaching-data');
      if (savedData) {
        const data = JSON.parse(savedData);
        setLastCheckIn({
          mood: data.mood,
          energy: data.energy,
          focus: data.focus,
        });
      }
    }
  }, []);

  const getQuickInsight = () => {
    if (!lastCheckIn) return "Check in with your coach today";
    
    const { mood, energy, focus } = lastCheckIn;
    const moodEmoji = ['😔', '😕', '😐', '🙂', '😊'][mood - 1];
    const energyLabel = energy <= 2 ? 'low energy' : energy >= 4 ? 'high energy' : 'moderate energy';
    const focusLabel = focus <= 2 ? 'scattered' : focus >= 4 ? 'clear focus' : 'okay focus';
    
    return `${moodEmoji} ${energyLabel}, ${focusLabel}`;
  };

  return (
    <div
      onClick={onNavigateToCoaching}
      className="bg-gradient-to-br from-lavender-100 to-blue-50 rounded-3xl shadow-sm p-5 border border-lavender-200 cursor-pointer hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <MessageCircleHeart size={20} className="text-lavender-600" />
          <h3 className="text-gray-700">Daily Coach</h3>
        </div>
        <ArrowRight size={18} className="opacity-40" />
      </div>
      
      <div className="text-sm opacity-80">
        {hasCheckedIn ? (
          <div>
            <div className="mb-2">{getQuickInsight()}</div>
            <div className="text-xs opacity-60">Tap to see your full coaching</div>
          </div>
        ) : (
          <div>
            <div className="mb-2">You haven't checked in today</div>
            <div className="text-xs opacity-60">Tap to get personalized guidance</div>
          </div>
        )}
      </div>
    </div>
  );
}
