import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Brain,
  TrendingUp,
  Moon,
  Zap,
  CheckCircle2,
  //Calendar,
  ChevronRight,
  Sparkles,
  Sun,
  //Cloud,
  Star,
  RefreshCw,
} from 'lucide-react';
import {
  //RadialBarChart,
  //RadialBar,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';

interface Insight {
  id: string;
  type: 'pattern' | 'correlation' | 'achievement' | 'suggestion';
  title: string;
  description: string;
  confidence: number; // 0-100
  icon: 'brain' | 'moon' | 'zap' | 'check' | 'star';
  color: string;
}

interface ChartData {
  energyTrends: { day: string; energy: number; mood: number }[];
  sleepCorrelation: { sleep: string; productivity: number; focus: number }[];
  productivityPeaks: { timeOfDay: string; completions: number; energy: number }[];
  weeklyPattern: { day: string; habits: number; mood: number; energy: number }[];
}

export function AIInsightsEngine() {
  const { themeColors } = useTheme();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  //const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    analyzeData();
  }, []);

  const analyzeData = () => {
    //setIsRefreshing(true);
    
    // Add a small delay for the animation to be visible
    setTimeout(() => {
      try {
        // Load all data sources and ensure they're arrays
        let checkInData = JSON.parse(localStorage.getItem('flowstate-coaching-data') || '[]');
        let habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');
        //const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');

        // Ensure checkInData is an array
        if (!Array.isArray(checkInData)) {
          checkInData = [];
        }

        // Ensure habits is an array
        if (!Array.isArray(habits)) {
          habits = [];
        }

        // Generate insights
        const generatedInsights = generateInsights(checkInData, habits, );
        setInsights(generatedInsights);

        // Generate chart data
        const charts = generateChartData(checkInData, habits, );
        setChartData(charts);
      } catch (error) {
        console.error('Error analyzing data:', error);
        setInsights([]);
        setChartData(null);
      }
      
      //setIsRefreshing(false);
    }, 300);
  };

  const generateInsights = (checkIns: any[], habits: any[], ): Insight[] => {
    const insights: Insight[] = [];
    //const today = new Date();

    // Ensure we have valid arrays
    if (!Array.isArray(checkIns) || !Array.isArray(habits)) {
      return insights;
    }

    // Analyze last 14 days of check-in data
    const recentCheckIns = checkIns.slice(-14);

    // Pattern: Best day of week
    if (recentCheckIns.length >= 7) {
      const dayPerformance: { [key: string]: { energy: number; mood: number; count: number } } = {};
      
      recentCheckIns.forEach(checkIn => {
        if (checkIn?.timestamp) {
          const date = new Date(checkIn.timestamp);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          if (!dayPerformance[dayName]) {
            dayPerformance[dayName] = { energy: 0, mood: 0, count: 0 };
          }
          
          dayPerformance[dayName].energy += checkIn.energy || 0;
          dayPerformance[dayName].mood += getMoodScore(checkIn.mood);
          dayPerformance[dayName].count += 1;
        }
      });

      // Find best day
      let bestDay = '';
      let bestScore = 0;
      
      Object.entries(dayPerformance).forEach(([day, data]) => {
        if (data.count > 0) {
          const avgEnergy = data.energy / data.count;
          const avgMood = data.mood / data.count;
          const score = (avgEnergy + avgMood) / 2;
          
          if (score > bestScore) {
            bestScore = score;
            bestDay = day;
          }
        }
      });

      if (bestDay && bestScore > 6) {
        insights.push({
          id: 'best-day',
          type: 'pattern',
          title: `${bestDay}s are your power days`,
          description: `You tend to have ${bestScore > 8 ? 'excellent' : 'higher'} energy and mood on ${bestDay}s. Consider scheduling important tasks then.`,
          confidence: Math.min(95, 60 + (bestScore * 3)),
          icon: 'star',
          color: '#f59e0b',
        });
      }
    }

    // Correlation: Sleep and productivity
    const sleepProductivityData: { sleep: number; completed: number }[] = [];
    
    recentCheckIns.forEach(checkIn => {
      if (checkIn?.sleep && checkIn?.timestamp) {
        const date = new Date(checkIn.timestamp).toDateString();
        const completedHabits = habits.filter((h: any) =>
          (h?.completedSlots || []).some((slot: any) => slot?.date === date)
        ).length;
        
        sleepProductivityData.push({
          sleep: checkIn.sleep,
          completed: completedHabits,
        });
      }
    });

    if (sleepProductivityData.length >= 5) {
      // Calculate correlation
      const avgSleep = sleepProductivityData.reduce((sum, d) => sum + d.sleep, 0) / sleepProductivityData.length;
      const optimalSleep = sleepProductivityData
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 3)
        .reduce((sum, d) => sum + d.sleep, 0) / 3;

      if (optimalSleep >= 7 && optimalSleep <= 9) {
        insights.push({
          id: 'sleep-correlation',
          type: 'correlation',
          title: `${Math.round(optimalSleep)}h of sleep = peak performance`,
          description: `You complete ${Math.round((optimalSleep / avgSleep) * 100 - 100)}% more habits when you get around ${Math.round(optimalSleep)} hours of sleep.`,
          confidence: 85,
          icon: 'moon',
          color: '#8b5cf6',
        });
      }
    }

    // Achievement: Streak detection
    const activeHabits = habits.filter((h: any) => h?.isActive);
    let currentStreak = 0;
    let checkDate = new Date();
    
    while (currentStreak < 30) {
      const dateStr = checkDate.toDateString();
      const hasCompletion = activeHabits.some((h: any) =>
        (h?.completedSlots || []).some((slot: any) => slot?.date === dateStr)
      );
      
      if (!hasCompletion) break;
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    if (currentStreak >= 3) {
      insights.push({
        id: 'streak',
        type: 'achievement',
        title: `${currentStreak}-day momentum building!`,
        description: `You've maintained at least one habit for ${currentStreak} consecutive days. This consistency is creating lasting change.`,
        confidence: 100,
        icon: 'check',
        color: '#10b981',
      });
    }

    // Pattern: Energy trends
    if (recentCheckIns.length >= 7) {
      const morningEnergy = recentCheckIns
        .filter(c => {
          if (!c?.timestamp) return false;
          const hour = new Date(c.timestamp).getHours();
          return hour >= 6 && hour < 12;
        })
        .reduce((sum, c) => sum + (c.energy || 0), 0) / Math.max(1, recentCheckIns.filter(c => {
          if (!c?.timestamp) return false;
          const hour = new Date(c.timestamp).getHours();
          return hour >= 6 && hour < 12;
        }).length);

      const afternoonEnergy = recentCheckIns
        .filter(c => {
          if (!c?.timestamp) return false;
          const hour = new Date(c.timestamp).getHours();
          return hour >= 12 && hour < 18;
        })
        .reduce((sum, c) => sum + (c.energy || 0), 0) / Math.max(1, recentCheckIns.filter(c => {
          if (!c?.timestamp) return false;
          const hour = new Date(c.timestamp).getHours();
          return hour >= 12 && hour < 18;
        }).length);

      const eveningEnergy = recentCheckIns
        .filter(c => {
          if (!c?.timestamp) return false;
          const hour = new Date(c.timestamp).getHours();
          return hour >= 18;
        })
        .reduce((sum, c) => sum + (c.energy || 0), 0) / Math.max(1, recentCheckIns.filter(c => {
          if (!c?.timestamp) return false;
          const hour = new Date(c.timestamp).getHours();
          return hour >= 18;
        }).length);

      const peakTime = morningEnergy > afternoonEnergy && morningEnergy > eveningEnergy
        ? 'morning'
        : afternoonEnergy > eveningEnergy
        ? 'afternoon'
        : 'evening';

      const peakEnergy = Math.max(morningEnergy, afternoonEnergy, eveningEnergy);

      if (peakEnergy > 6) {
        insights.push({
          id: 'energy-peak',
          type: 'pattern',
          title: `Your ${peakTime} energy is strongest`,
          description: `Schedule your most important work in the ${peakTime} when your energy naturally peaks at ${peakEnergy.toFixed(1)}/10.`,
          confidence: 80,
          icon: 'zap',
          color: '#f59e0b',
        });
      }
    }

    // Suggestion: Based on mood patterns
    const recentMoods = recentCheckIns.map(c => getMoodScore(c.mood)).filter(m => m > 0);
    if (recentMoods.length > 0) {
      const avgMood = recentMoods.reduce((sum, m) => sum + m, 0) / recentMoods.length;

      if (avgMood >= 7 && activeHabits.length < 5) {
        insights.push({
          id: 'growth-suggestion',
          type: 'suggestion',
          title: `You're thriving - ready for more?`,
          description: `Your mood has been consistently positive. This might be a good time to add a new growth habit.`,
          confidence: 75,
          icon: 'brain',
          color: '#a78bfa',
        });
      } else if (avgMood < 5 && activeHabits.length > 5) {
        insights.push({
          id: 'rest-suggestion',
          type: 'suggestion',
          title: `Consider simplifying your routine`,
          description: `Your energy has been lower lately. It's okay to pause some habits and focus on rest.`,
          confidence: 70,
          icon: 'moon',
          color: '#8b5cf6',
        });
      }
    }

    // Celebration: First habit
    if (activeHabits.length === 1 && currentStreak >= 1) {
      insights.push({
        id: 'first-habit',
        type: 'achievement',
        title: `Your journey has begun! 🌱`,
        description: `You've started your first habit. Every expert was once a beginner. Keep going!`,
        confidence: 100,
        icon: 'star',
        color: '#10b981',
      });
    }

    // Return top 4 insights sorted by confidence
    return insights.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
  };

  const generateChartData = (checkIns: any[], habits: any[], ): ChartData => {
    // Ensure we have valid arrays
    const safeCheckIns = Array.isArray(checkIns) ? checkIns : [];
    const safeHabits = Array.isArray(habits) ? habits : [];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    // Energy Trends (7-day)
    const energyTrends = last7Days.map(date => {
      const dateStr = date.toDateString();
      const checkIn = safeCheckIns.find(c => c?.timestamp && new Date(c.timestamp).toDateString() === dateStr);
      
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        energy: checkIn?.energy || 0,
        mood: getMoodScore(checkIn?.mood) || 0,
      };
    });

    // Sleep Correlation
    const sleepGroups: { [key: string]: { productivity: number; focus: number; count: number } } = {
      '< 6h': { productivity: 0, focus: 0, count: 0 },
      '6-7h': { productivity: 0, focus: 0, count: 0 },
      '7-8h': { productivity: 0, focus: 0, count: 0 },
      '8-9h': { productivity: 0, focus: 0, count: 0 },
      '9h+': { productivity: 0, focus: 0, count: 0 },
    };

    safeCheckIns.slice(-14).forEach(checkIn => {
      if (checkIn?.sleep && checkIn?.timestamp) {
        const sleep = checkIn.sleep;
        const date = new Date(checkIn.timestamp).toDateString();
        const completed = safeHabits.filter((h: any) =>
          (h?.completedSlots || []).some((slot: any) => slot?.date === date)
        ).length;
        
        let group = '';
        if (sleep < 6) group = '< 6h';
        else if (sleep < 7) group = '6-7h';
        else if (sleep < 8) group = '7-8h';
        else if (sleep < 9) group = '8-9h';
        else group = '9h+';

        sleepGroups[group].productivity += completed;
        sleepGroups[group].focus += checkIn.energy || 0;
        sleepGroups[group].count += 1;
      }
    });

    const sleepCorrelation = Object.entries(sleepGroups)
      .map(([sleep, data]) => ({
        sleep,
        productivity: data.count > 0 ? Math.round((data.productivity / data.count) * 10) : 0,
        focus: data.count > 0 ? Math.round((data.focus / data.count) * 10) : 0,
      }))
      .filter(d => d.productivity > 0 || d.focus > 0);

    // Productivity Peaks (by time of day)
    const timeBlocks = {
      Morning: { completions: 0, energy: 0, count: 0 },
      Afternoon: { completions: 0, energy: 0, count: 0 },
      Evening: { completions: 0, energy: 0, count: 0 },
    };

    safeCheckIns.slice(-14).forEach(checkIn => {
      if (checkIn?.timestamp) {
        const hour = new Date(checkIn.timestamp).getHours();
        const date = new Date(checkIn.timestamp).toDateString();
        const completed = safeHabits.filter((h: any) =>
          (h?.completedSlots || []).some((slot: any) => slot?.date === date)
        ).length;

        let timeBlock: 'Morning' | 'Afternoon' | 'Evening' = 'Morning';
        if (hour >= 6 && hour < 12) timeBlock = 'Morning';
        else if (hour >= 12 && hour < 18) timeBlock = 'Afternoon';
        else timeBlock = 'Evening';

        timeBlocks[timeBlock].completions += completed;
        timeBlocks[timeBlock].energy += checkIn.energy || 0;
        timeBlocks[timeBlock].count += 1;
      }
    });

    const productivityPeaks = Object.entries(timeBlocks).map(([timeOfDay, data]) => ({
      timeOfDay,
      completions: data.count > 0 ? Math.round((data.completions / data.count) * 10) : 0,
      energy: data.count > 0 ? Math.round((data.energy / data.count) * 10) : 0,
    }));

    // Weekly Pattern
    const weeklyPattern = last7Days.map(date => {
      const dateStr = date.toDateString();
      const checkIn = safeCheckIns.find(c => c?.timestamp && new Date(c.timestamp).toDateString() === dateStr);
      const completed = safeHabits.filter((h: any) =>
        (h?.completedSlots || []).some((slot: any) => slot?.date === dateStr)
      ).length;

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        habits: completed,
        mood: getMoodScore(checkIn?.mood) || 0,
        energy: checkIn?.energy || 0,
      };
    });

    return {
      energyTrends,
      sleepCorrelation,
      productivityPeaks,
      weeklyPattern,
    };
  };

  const getMoodScore = (mood: string): number => {
    const moodScores: { [key: string]: number } = {
      'terrible': 2,
      'rough': 4,
      'okay': 5,
      'good': 7,
      'great': 9,
      'amazing': 10,
    };
    return moodScores[mood] || 5;
  };

  const getInsightIcon = (icon: string) => {
    switch (icon) {
      case 'brain': return Brain;
      case 'moon': return Moon;
      case 'zap': return Zap;
      case 'check': return CheckCircle2;
      case 'star': return Star;
      default: return Sparkles;
    }
  };

  // Show a gentle placeholder if not enough data yet
  if (!chartData || insights.length === 0) {
    return (
      <div
        className="bg-white rounded-3xl shadow-lg p-8 text-center"
      >
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <Brain size={32} style={{ color: themeColors.primary }} className="opacity-40" />
        </div>
        <h4 className="mb-2 opacity-60">Building Your Insights</h4>
        <p className="text-sm opacity-50 max-w-md mx-auto">
          Keep checking in and completing habits. We'll start discovering patterns in your data soon! 
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">
        AI INSIGHTS ENGINE
      </div>
      <div className="space-y-4">
        {/* Main Insights Card */}
        <div
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div 
            className="p-6 pb-4"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}15 0%, ${themeColors.primary}05 100%)`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <Brain size={24} style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <h3 className="mb-0">AI Insights</h3>
                  <p className="text-sm opacity-60">Patterns discovered from your data</p>
                </div>
              </div>
              <button
                //whileHover={{ scale: 1.05 }}
                //whileTap={{ scale: 0.95 }}
                onClick={analyzeData}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-white/50"
                title="Refresh insights"
              >
                <div>
                  <RefreshCw size={18} className="opacity-60" />
                </div>
              </button>
            </div>
          </div>

        {/* Key Insights */}
        <div className="p-6 pt-4 space-y-3">
          {insights.map((insight, ) => {
            const Icon = getInsightIcon(insight.icon);
            return (
              <div
                key={insight.id}
                onClick={() => setSelectedInsight(insight)}
                className="p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: `${insight.color}10`,
                  border: `2px solid ${selectedInsight?.id === insight.id ? insight.color : 'transparent'}`
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${insight.color}20` }}
                  >
                    <Icon size={20} style={{ color: insight.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm mb-0">{insight.title}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: i < Math.floor(insight.confidence / 33) ? insight.color : '#e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm opacity-70 mb-0">{insight.description}</p>
                  </div>
                  <ChevronRight size={18} className="opacity-40 flex-shrink-0" />
                </div>
              </ div>
            );
          })}
        </div>

        {/* Expand Charts Button */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="opacity-60" />
            <span className="text-sm">{isExpanded ? 'Hide' : 'View'} Detailed Analytics</span>
          </button>
        </div>
      </ div>

      {/* Expanded Charts */}
        {isExpanded && (
          <div
            className="space-y-4 overflow-hidden"
          >
            {/* Energy & Mood Trends */}
            <div
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} style={{ color: themeColors.primary }} />
                  <h4 className="mb-0">Energy & Mood Trends</h4>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColors.primary }} />
                    <span className="opacity-60">Energy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                    <span className="opacity-60">Mood</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData.energyTrends}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke={themeColors.primary} 
                    strokeWidth={3}
                    fill="url(#colorEnergy)"
                    name="Energy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    fill="url(#colorMood)"
                    name="Mood"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ div>

            {/* Sleep Correlation */}
            {chartData.sleepCorrelation.length > 0 && (
              <div
                className="bg-white rounded-3xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Moon size={20} style={{ color: '#8b5cf6' }} />
                  <h4 className="mb-0">Sleep Impact</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.sleepCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="sleep" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="productivity" 
                      fill="#8b5cf6" 
                      radius={[12, 12, 0, 0]}
                      name="Productivity"
                    />
                    <Bar 
                      dataKey="focus" 
                      fill="#a78bfa" 
                      radius={[12, 12, 0, 0]}
                      name="Focus"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ div>
            )}

            {/* Productivity Peaks - Radial Chart */}
            <div
              className="bg-white rounded-3xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sun size={20} style={{ color: '#f59e0b' }} />
                <h4 className="mb-0">Productivity by Time of Day</h4>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={chartData.productivityPeaks}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="timeOfDay" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar 
                    name="Completions" 
                    dataKey="completions" 
                    stroke={themeColors.primary} 
                    fill={themeColors.primary} 
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Energy" 
                    dataKey="energy" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
