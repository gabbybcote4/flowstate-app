import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';
import { getLocalStorageItem } from '../hooks/useLocalStorage';
import { Flame, Target, Heart } from 'lucide-react';

interface MomentumData {
  completed: number;
  total: number;
  percentage: number;
  todayCheckIns: number; // Mood, energy, etc.
  motivationLevel: 'low' | 'building' | 'strong' | 'unstoppable';
}

export function DailyMomentumRing() {
  const { themeColors } = useTheme();
  const [momentum, setMomentum] = useState<MomentumData>({
    completed: 0,
    total: 0,
    percentage: 0,
    todayCheckIns: 0,
    motivationLevel: 'low'
  });

  useEffect(() => {
    calculateMomentum();
  }, []);

  const calculateMomentum = () => {
    const today = new Date().toDateString();
    
    // Count completed habits
    const savedHabits = localStorage.getItem('flowstate-habits');
    const habits = savedHabits ? JSON.parse(savedHabits) : [];
    const activeHabits = habits.filter((h: any) => h.isActive);
    
    let completed = 0;
    activeHabits.forEach((habit: any) => {
      if (habit.frequency === 'multiple-daily' && habit.timeSlots) {
        const allSlotsCompleted = habit.timeSlots.every((slot: any) =>
          (habit.completedSlots || []).some((c: any) => c.date === today && c.slotId === slot.id)
        );
        if (allSlotsCompleted) completed++;
      } else {
        const isCompleted = (habit.completedSlots || []).some((c: any) => c.date === today);
        if (isCompleted) completed++;
      }
    });

    // Count check-ins (mood, energy, coaching)
    let checkIns = 0;
    const moodDate = getLocalStorageItem('flowstate-mood-date', null);
    const energyLevel = getLocalStorageItem('flowstate-energy', null);
    const coachingDate = getLocalStorageItem('flowstate-coaching-date', null);
    
    if (moodDate === today) checkIns++;
    if (energyLevel) checkIns++;
    if (coachingDate === today) checkIns++;

    const total = activeHabits.length + 3; // habits + 3 check-ins
    const percentage = total > 0 ? Math.round((completed + checkIns) / total * 100) : 0;

    // Determine motivation level
    let motivationLevel: MomentumData['motivationLevel'] = 'low';
    if (percentage >= 80) motivationLevel = 'unstoppable';
    else if (percentage >= 50) motivationLevel = 'strong';
    else if (percentage >= 20) motivationLevel = 'building';

    setMomentum({
      completed: completed + checkIns,
      total,
      percentage,
      todayCheckIns: checkIns,
      motivationLevel
    });
  };

  const getMotivationMessage = () => {
    switch (momentum.motivationLevel) {
      case 'unstoppable': return 'Unstoppable! 🔥';
      case 'strong': return 'Strong momentum 💪';
      case 'building': return 'Building up ✨';
      default: return 'Just getting started 🌱';
    }
  };

  const getMotivationColor = () => {
    switch (momentum.motivationLevel) {
      case 'unstoppable': return '#F59E0B'; // Amber
      case 'strong': return themeColors.primary;
      case 'building': return '#8B5CF6'; // Purple
      default: return '#D1D5DB'; // Gray
    }
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (momentum.percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="opacity-60 text-sm mb-1">Today's Momentum</h3>
          <div className="opacity-80">{getMotivationMessage()}</div>
        </div>
        <Flame 
          size={24} 
          style={{ color: getMotivationColor() }}
          className="opacity-80"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Ring Visualization */}
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            
            {/* Progress ring */}
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={getMotivationColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ 
                duration: 1.5, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
              }}
            />

            {/* Glow effect for high momentum */}
            {momentum.percentage >= 50 && (
              <motion.circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke={getMotivationColor()}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                opacity="0.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-3xl"
              style={{ color: getMotivationColor() }}
            >
              {momentum.percentage}%
            </motion.div>
            <div className="text-xs opacity-60 mt-1">complete</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${themeColors.primary}20` }}
            >
              <Target size={16} style={{ color: themeColors.primary }} />
            </div>
            <div>
              <div className="text-xs opacity-60">Tasks</div>
              <div className="text-sm">
                {momentum.completed - momentum.todayCheckIns}/{momentum.total - 3}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${themeColors.primaryDark}20` }}
            >
              <Heart size={16} style={{ color: themeColors.primaryDark }} />
            </div>
            <div>
              <div className="text-xs opacity-60">Check-ins</div>
              <div className="text-sm">{momentum.todayCheckIns}/3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational nudge */}
      {momentum.percentage < 30 && momentum.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <p className="text-xs opacity-60 text-center">
            Small steps create big momentum ✨
          </p>
        </motion.div>
      )}
    </div>
  );
}