// WeeklySummaryCard.tsx

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface WeeklySummary {
  averageMood: number;
  averageSleep: number;
  todosCompleted: number;
  moodTrend: 'up' | 'down' | 'same';
  sleepTrend: 'up' | 'down' | 'same';
  todosTrend: 'up' | 'down' | 'same';
  weekInsight: string;
}

interface WeeklySummaryCardProps {
  onViewDetails?: () => void;
}

export function WeeklySummaryCard({ onViewDetails }: WeeklySummaryCardProps) {
  const [summary, setSummary] = useState<WeeklySummary>({
    averageMood: 0,
    averageSleep: 0,
    todosCompleted: 0,
    moodTrend: 'same',
    sleepTrend: 'same',
    todosTrend: 'same',
    weekInsight: '',
  });

  useEffect(() => {
    calculateWeeklySummary();
  }, []);

  const calculateWeeklySummary = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // load data
    const checkInData = JSON.parse(localStorage.getItem('flowstate-coaching-data') || '{}');
    const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
    const habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');

    // calculate current week mood from check-in
    let avgMoodCurrent = 3;
    let avgMoodPrevious = 3;
    
    if (checkInData && checkInData.mood !== undefined) {
      avgMoodCurrent = checkInData.mood;
      avgMoodPrevious = checkInData.mood; 
    }

    // get sleep data from reflections
    const currentWeekSleep: number[] = [];
    const previousWeekSleep: number[] = [];
    
    Object.entries(reflections).forEach(([date, data]: [string, any]) => {
      const entryDate = new Date(date);
      const sleepQuality = data.sleepQuality || 0;
      // convert quality (1-5) to hours (4-9)
      const sleepHours = sleepQuality > 0 ? 4 + (sleepQuality * 1.0) : 0;
      
      if (entryDate >= oneWeekAgo && entryDate <= now) {
        currentWeekSleep.push(sleepHours);
      } else if (entryDate >= twoWeeksAgo && entryDate < oneWeekAgo) {
        previousWeekSleep.push(sleepHours);
      }
    });

    const avgSleepCurrent = currentWeekSleep.length > 0
      ? currentWeekSleep.reduce((a, b) => a + b, 0) / currentWeekSleep.length
      : 0;
    
    const avgSleepPrevious = previousWeekSleep.length > 0
      ? previousWeekSleep.reduce((a, b) => a + b, 0) / previousWeekSleep.length
      : 0;

    // count completed habits this week
    let completedThisWeek = 0;
    let completedLastWeek = 0;

    habits.forEach((habit: any) => {
      if (habit.completedSlots) {
        habit.completedSlots.forEach((slot: any) => {
          if (slot.date) {
            const slotDate = new Date(slot.date);
            if (slotDate >= oneWeekAgo && slotDate <= now) {
              completedThisWeek++;
            } else if (slotDate >= twoWeeksAgo && slotDate < oneWeekAgo) {
              completedLastWeek++;
            }
          }
        });
      }
    });

    // calculate trends
    const moodTrend = avgMoodCurrent > avgMoodPrevious ? 'up' : avgMoodCurrent < avgMoodPrevious ? 'down' : 'same';
    const sleepTrend = avgSleepCurrent > avgSleepPrevious ? 'up' : avgSleepCurrent < avgSleepPrevious ? 'down' : 'same';
    const todosTrend = completedThisWeek > completedLastWeek ? 'up' : completedThisWeek < completedLastWeek ? 'down' : 'same';

    // generate gentle insight
    const insight = generateWeekInsight(avgMoodCurrent, avgSleepCurrent, completedThisWeek, moodTrend, sleepTrend);

    setSummary({
      averageMood: avgMoodCurrent,
      averageSleep: avgSleepCurrent,
      todosCompleted: completedThisWeek,
      moodTrend,
      sleepTrend,
      todosTrend,
      weekInsight: insight,
    });
  };

  const generateWeekInsight = (
    mood: number, 
    sleep: number, 
    completed: number,
    moodTrend: string,
    sleepTrend: string
  ): string => {
    const insights: string[] = [];

    // positive insights
    if (moodTrend === 'up') {
      insights.push("Your energy is rising — something's working! 🌸");
    }
    if (sleep >= 7) {
      insights.push("You're sleeping well. Your body thanks you. 💤");
    }
    if (completed > 10) {
      insights.push(`${completed} habits this week — you're showing up! ✨`);
    }
    
    // gentle insights
    if (sleep < 6 && sleep > 0) {
      insights.push("Rest has been light. Be extra gentle with yourself. 💜");
    }
    if (mood < 2.5) {
      insights.push("This week was heavy. You're still here. That counts. 💙");
    }
    
    // growth insights
    if (sleepTrend === 'up' && moodTrend === 'up') {
      insights.push("Better sleep, better mood — the connection is real. 🌙");
    }

    // default
    if (insights.length === 0) {
      insights.push("You showed up this week. That's what matters. 💜");
    }

    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getMoodLabel = (mood: number) => {
    if (mood < 2) return 'Low';
    if (mood < 3) return 'Fair';
    if (mood < 4) return 'Good';
    return 'Great';
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'same' }) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-orange-400" />;
    return <Minus size={12} className="text-gray-400" />;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div 
        className="flow-card"
      >

        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[var(--color-card-foreground)] flex items-center gap-2">
            <span>📊</span>
            <span>This Week</span>
          </h3>
          <div className="text-xs opacity-50">Last 7 days</div>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          {/* Mood */}
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
            <div className="text-2xl mb-1.5">🌤️</div>
            <div className="text-xs opacity-60 mb-1.5">Mood</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{getMoodLabel(summary.averageMood)}</span>
              <TrendIcon trend={summary.moodTrend} />
            </div>
          </div>

          {/* sleep */}
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
            <div className="text-2xl mb-1.5">💤</div>
            <div className="text-xs opacity-60 mb-1.5">Sleep</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">
                {summary.averageSleep > 0 ? `${summary.averageSleep.toFixed(1)}h` : '—'}
              </span>
              <TrendIcon trend={summary.sleepTrend} />
            </div>
          </div>

          {/* habits */}
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
            <div className="text-2xl mb-1.5">✅</div>
            <div className="text-xs opacity-60 mb-1.5">Habits</div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{summary.todosCompleted}</span>
              <TrendIcon trend={summary.todosTrend} />
            </div>
          </div>
        </div>

        {/* insight */}
        {summary.weekInsight && (
          <div className="p-3 bg-gradient-to-br from-lavender-50 to-purple-50 rounded-2xl mb-3 border border-lavender-200">
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-lavender-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[var(--color-card-foreground)] leading-relaxed">{summary.weekInsight}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
