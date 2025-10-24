// ReflectionScreen.tsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Sparkles, TrendingUp, Heart, Target, CheckCircle } from 'lucide-react';

interface ReflectionData {
  date: string;
  whatFeltRight: string[];
  whatChallenged: string[];
  sleepHours: number;
  completedAt?: string;
}

export function ReflectionScreen() {
  const { themeColors } = useTheme();
  const today = new Date().toISOString().split('T')[0];
  const [whatFeltRight, setWhatFeltRight] = useState<string[]>([]);
  const [whatChallenged, setWhatChallenged] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);

  // load today's reflection if exists
  useEffect(() => {
    const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
    const todayReflection = reflections[today];
    
    if (todayReflection) {
      setWhatFeltRight(todayReflection.whatFeltRight || []);
      setWhatChallenged(todayReflection.whatChallenged || []);
      setSleepHours(todayReflection.sleepHours || 7);
      setHasCompletedToday(!!todayReflection.completedAt);
    }
  }, [today]);

  const feltRightOptions = [
    'Rested when I needed',
    'Completed a small task',
    'Was gentle with myself',
    'Asked for help',
    'Honored my energy',
    'Made progress',
    'Connected with someone',
    'Took a break'
  ];

  const challengedOptions = [
    'Low energy',
    'Pain or discomfort',
    'Overwhelming tasks',
    'Couldn\'t focus',
    'Too much stimulation',
    'Felt rushed',
    'Didn\'t rest enough',
    'Hard to say no'
  ];

  const toggleOption = (option: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(option)) {
      setter(list.filter(item => item !== option));
    } else {
      setter([...list, option]);
    }
  };

  const getAIInsights = () => {
    const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
    const recentReflections = Object.entries(reflections)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .slice(0, 7) as [string, ReflectionData][];

    // calculate patterns
    const allChallenges: string[] = [];
    const allWins: string[] = [];
    let totalSleep = 0;
    
    recentReflections.forEach(([_, reflection]) => {
      allChallenges.push(...(reflection.whatChallenged || []));
      allWins.push(...(reflection.whatFeltRight || []));
      totalSleep += reflection.sleepHours || 0;
    });

    const avgSleep = recentReflections.length > 0 ? (totalSleep / recentReflections.length).toFixed(1) : '0';

    // find most common challenge
    const challengeCounts: Record<string, number> = {};
    allChallenges.forEach(challenge => {
      challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1;
    });
    const topChallenge = Object.entries(challengeCounts).sort(([, a], [, b]) => b - a)[0];

    // find most common win
    const winCounts: Record<string, number> = {};
    allWins.forEach(win => {
      winCounts[win] = (winCounts[win] || 0) + 1;
    });
    const topWin = Object.entries(winCounts).sort(([, a], [, b]) => b - a)[0];

    return {
      patterns: topChallenge 
        ? `You've noticed "${topChallenge[0]}" ${topChallenge[1]} times this week`
        : 'Keep tracking to discover patterns',
      wins: topWin
        ? `Your strength: "${topWin[0]}" shows up ${topWin[1]} times`
        : 'Your wins are building up',
      avgSleep,
      suggestion: getFocusSuggestion(topChallenge?.[0], avgSleep)
    };
  };

  const getFocusSuggestion = (topChallenge: string | undefined, avgSleep: string) => {
    const sleepNum = parseFloat(avgSleep);
    
    if (sleepNum < 6) {
      return 'Tomorrow: Prioritize rest over tasks. Your body needs recovery.';
    }
    
    if (topChallenge?.toLowerCase().includes('energy')) {
      return 'Tomorrow: Start with one tiny win. Energy builds on momentum.';
    }
    
    if (topChallenge?.toLowerCase().includes('focus')) {
      return 'Tomorrow: Try shorter task blocks. Quality over quantity.';
    }
    
    if (topChallenge?.toLowerCase().includes('overwhelm')) {
      return 'Tomorrow: Pick just ONE thing. Everything else can wait.';
    }
    
    return 'Tomorrow: Trust your pace. You\'re doing better than you think.';
  };

  const handleCompleteReflection = () => {
    const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
    
    reflections[today] = {
      date: today,
      whatFeltRight,
      whatChallenged,
      sleepHours,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('flowstate-reflections', JSON.stringify(reflections));
    setHasCompletedToday(true);
    
    // check if this completes week
    const completedDays = Object.keys(reflections).length;
    const isWeekComplete = completedDays % 7 === 0 && completedDays > 0;
    
    if (isWeekComplete) {
      // week complete celebration
      setShowCelebration(true);
    } else {
      // regular reflection celebration
      setShowCelebration(true);
    }
    
    // hide celebration after 4 seconds
    setTimeout(() => setShowCelebration(false), 4000);
  };

  const insights = getAIInsights();

  return (
    <div 
      className="min-h-screen bg-gradient-to-b relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`
      }}
    >
      <div className="absolute top-0 left-0 bg-black/75 text-white px-2 py-1 text-sm rounded-br z-50">REFLECTION SCREEN</div>
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-md mx-auto">

          {/* header */}
          <div className="mb-8">
            <h1 className="mb-2">End of Day Reflection</h1>
            <p className="opacity-70">Take a breath. Notice without judgment.</p>
          </div>

          {/* what felt right today */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-lavender-400" />
              <h2>What felt right today?</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {feltRightOptions.map(option => (
                < button
                  key={option}
                  onClick={() => toggleOption(option, whatFeltRight, setWhatFeltRight)}
                  className={`
                    px-4 py-2 rounded-full transition-all duration-200
                    ${whatFeltRight.includes(option)
                      ? 'bg-lavender-200 text-lavender-900 shadow-md'
                      : 'flow-card'                    }
                  `}
                >
                  {option}
                </ button>
              ))}
            </div>
          </div>

          {/* what challenged you */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-peach-400" />
              <h2>What challenged you?</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {challengedOptions.map(option => (
                < button
                  key={option}
                  onClick={() => toggleOption(option, whatChallenged, setWhatChallenged)}
                  className={`
                    px-4 py-2 rounded-full transition-all duration-200
                    ${whatChallenged.includes(option)
                      ? 'bg-peach-200 text-peach-900 shadow-md'
                      : 'flow-card'                    }
                  `}
                >
                  {option}
                </ button>
              ))}
            </div>
          </div>

          {/* sleep hours */}
          <div className="mb-8">
            <h2 className="mb-4">How much sleep did you get?</h2>
            <div className="flow-card">
              <div className="flex items-center gap-4">
                <span className="text-2xl">💤</span>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${(sleepHours / 12) * 100}%, #e5e7eb ${(sleepHours / 12) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="min-w-[4rem] text-center opacity-90">
                  {sleepHours}h
                </div>
              </div>
              <div className="mt-3 text-center text-sm opacity-60">
                {sleepHours < 6 && 'Rest is productive too ✨'}
                {sleepHours >= 6 && sleepHours < 8 && 'Good baseline sleep'}
                {sleepHours >= 8 && 'Great rest! 🌟'}
              </div>
            </div>
          </div>

          {/* ai insights section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-lavender-400" />
              <h2>Your Patterns & Insights</h2>
            </div>
            
            <div className="space-y-3">

              {/* pattern card */}
              <div 
                className="bg-gradient-to-br from-lavender-50 to-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-lavender-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="opacity-60 text-sm mb-1">Pattern</div>
                    <div>{insights.patterns}</div>
                  </div>
                </div>
              </ div>

              {/* wins card */}
              <div 
                className="bg-gradient-to-br from-peach-50 to-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-peach-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="opacity-60 text-sm mb-1">Your Wins</div>
                    <div>{insights.wins}</div>
                  </div>
                </div>
              </ div>

              {/* tomorrow's focus */}
              <div 
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 shadow-sm border border-blue-100"
              >
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="opacity-60 text-sm mb-1">Gentle Focus for Tomorrow</div>
                    <div className="text-blue-900">{insights.suggestion}</div>
                  </div>
                </div>
              </ div>

              {/* average sleep */}
              <div 
                className="flow-card"
              >
                <div className="text-sm opacity-60 mb-1">7-Day Sleep Average</div>
                <div className="text-2xl">{insights.avgSleep} hours</div>
              </ div>
            </div>
          </div>

          {/* complete button */}
          < button 
            onClick={handleCompleteReflection}
            disabled={hasCompletedToday && !showCelebration}
            className="w-full py-4 rounded-3xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: hasCompletedToday && !showCelebration ? '#d1d5db' : themeColors.primary,
              color: 'white'
            }}
          >
            {hasCompletedToday ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Reflection Complete
              </>
            ) : (
              <>
                Complete Reflection
              </>
            )}
          </ button>
        </div>
      </div>
    </div>
  );
}
