// WeeklyInsightsDashboard.tsx

import { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import {TrendingUp, Sparkles, Moon, Heart, Briefcase, Users, Palette, Home as HomeIcon, Calendar, RefreshCw, ArrowLeft, Info } from 'lucide-react';
import {LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodSleepData {
  day: string;
  mood: number;
  sleep: number;
  date: string;
}

interface LifeAreaData {
  area: string;
  hours: number;
  color: string;
  percentage: number;
}

interface WeeklyInsight {
  title: string;
  message: string;
  type: 'positive' | 'growth' | 'gentle';
  icon: any;
}

const LIFE_AREAS = [
  { name: 'Health', color: '#D8B4FE', icon: Heart },
  { name: 'Work', color: '#FBBF24', icon: Briefcase },
  { name: 'Relationships', color: '#FCA5A5', icon: Users },
  { name: 'Personal Growth', color: '#A5B4FC', icon: TrendingUp },
  { name: 'Creativity', color: '#FCD34D', icon: Palette },
  { name: 'Home', color: '#A7F3D0', icon: HomeIcon },
];

interface WeeklyInsightsDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function WeeklyInsightsDashboard({ onNavigate }: WeeklyInsightsDashboardProps) {
  const { themeColors } = useTheme();
  const [moodSleepData, setMoodSleepData] = useState<MoodSleepData[]>([]);
  const [lifeAreaData, setLifeAreaData] = useState<LifeAreaData[]>([]);
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // load mood vs sleep data
      const moodSleep = generateMoodSleepData();
      setMoodSleepData(moodSleep);

      // load life area distribution
      const lifeAreas = generateLifeAreaData();
      setLifeAreaData(lifeAreas);

      // generate insight of week
      const weeklyInsight = generateWeeklyInsight(moodSleep, lifeAreas);
      setInsight(weeklyInsight);

      setIsLoading(false);
    }, 500);
  };

  const generateMoodSleepData = (): MoodSleepData[] => {
    const data: MoodSleepData[] = [];
    const today = new Date();
    
    // load check-in data
    const checkInData = JSON.parse(localStorage.getItem('flowstate-coaching-data') || '{}');
    const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');

    // last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      // get mood from check-in (1-5 scale)
      let mood = 3; // default
      if (checkInData && checkInData.mood !== undefined) {
        mood = checkInData.mood;
      } else {
        // andom for demo
        mood = 2 + Math.random() * 2;
      }

      // get sleep from reflections
      let sleep = 0;
      if (reflections[dateStr]?.sleepQuality) {
        // convert sleep quality (1-5) to approximate hours (4-9)
        const quality = reflections[dateStr].sleepQuality;
        sleep = 4 + (quality * 1.0);
      } else {
        // random for demo
        sleep = 5 + Math.random() * 3;
      }

      data.push({
        day: dayName,
        mood: Math.round(mood * 10) / 10,
        sleep: Math.round(sleep * 10) / 10,
        date: dateStr,
      });
    }

    return data;
  };

  const generateLifeAreaData = (): LifeAreaData[] => {
    // load time blocks from calendar/timeflow
    const timeBlocks = JSON.parse(localStorage.getItem('flowstate-timeblocks') || '[]');
    const calendarEvents = JSON.parse(localStorage.getItem('flowstate-calendar-events') || '[]');
    
    const areaHours = new Map<string, number>();
    let totalHours = 0;

    // count from time blocks
    timeBlocks.forEach((block: any) => {
      if (block.lifeArea) {
        const current = areaHours.get(block.lifeArea) || 0;
        areaHours.set(block.lifeArea, current + 1); // assume 1 hour blocks
        totalHours += 1;
      }
    });

    // count from calendar events
    calendarEvents.forEach((event: any) => {
      if (event.lifeArea && event.duration) {
        const current = areaHours.get(event.lifeArea) || 0;
        const hours = event.duration / 60;
        areaHours.set(event.lifeArea, current + hours);
        totalHours += hours;
      }
    });

    // if no data, generate demo data
    if (totalHours === 0) {
      const demoData = [
        { area: 'Work', hours: 35 },
        { area: 'Health', hours: 8 },
        { area: 'Relationships', hours: 12 },
        { area: 'Personal Growth', hours: 5 },
        { area: 'Home', hours: 10 },
        { area: 'Creativity', hours: 3 },
      ];
      totalHours = demoData.reduce((sum, d) => sum + d.hours, 0);
      demoData.forEach(d => areaHours.set(d.area, d.hours));
    }

    // convert to array with percentages
    const data: LifeAreaData[] = LIFE_AREAS.map(area => {
      const hours = areaHours.get(area.name) || 0;
      const percentage = totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0;
      
      return {
        area: area.name,
        hours: Math.round(hours * 10) / 10,
        color: area.color,
        percentage,
      };
    }).filter(d => d.hours > 0);

    return data;
  };

  const generateWeeklyInsight = (moodData: MoodSleepData[], lifeData: LifeAreaData[]): WeeklyInsight => {
    // calculate trends
    const avgMood = moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length;
    const avgSleep = moodData.reduce((sum, d) => sum + d.sleep, 0) / moodData.length;
    
    const moodTrend = moodData.length >= 2 
      ? (moodData[moodData.length - 1].mood - moodData[0].mood)
      : 0;
    
    const sleepTrend = moodData.length >= 2
      ? (moodData[moodData.length - 1].sleep - moodData[0].sleep)
      : 0;

    // find dominant life area
    const topArea = lifeData.sort((a, b) => b.hours - a.hours)[0];

    // generate contextual insight
    const insights: WeeklyInsight[] = [];

    // sleep-based insights
    if (avgSleep >= 7.5) {
      insights.push({
        title: 'Beautiful Sleep Rhythm',
        message: `You averaged ${avgSleep.toFixed(1)} hours of sleep this week. Your body is getting the rest it needs, and it shows in your gentle progress. Keep honoring your sleep. 💜`,
        type: 'positive',
        icon: Moon,
      });
    } else if (avgSleep < 6.5) {
      insights.push({
        title: 'Your Body Needs You',
        message: `Sleep has been light this week (${avgSleep.toFixed(1)}h average). This is okay — you're doing your best. Even 15 minutes earlier to bed can make a difference. Be gentle with yourself. 🌙`,
        type: 'gentle',
        icon: Moon,
      });
    }

    // mood-based insights
    if (moodTrend > 0.5) {
      insights.push({
        title: 'Upward Momentum',
        message: 'Your mood has been trending up this week. Something is working! Notice what\'s different — small shifts create big changes over time. 🌸',
        type: 'positive',
        icon: TrendingUp,
      });
    } else if (avgMood >= 3.5) {
      insights.push({
        title: 'Staying Strong',
        message: `You've maintained good energy this week. That consistency is powerful — it means you're building sustainable habits, not just chasing highs. ✨`,
        type: 'positive',
        icon: Sparkles,
      });
    } else if (avgMood < 2.5) {
      insights.push({
        title: 'Honoring Hard Seasons',
        message: 'This week has been heavy. That\'s real, and it matters. You\'re still showing up, still trying. That takes courage. Rest when you need to — this isn\'t forever. 💙',
        type: 'gentle',
        icon: Heart,
      });
    }

    // balance-based insights
    if (topArea && topArea.percentage > 60) {
      insights.push({
        title: 'Time for Balance',
        message: `${topArea.area} took up ${topArea.percentage}% of your tracked time this week. You're dedicated! Just remember: rest isn't unproductive. Other life areas miss you. 🌿`,
        type: 'growth',
        icon: topArea ? LIFE_AREAS.find(a => a.name === topArea.area)?.icon || Calendar : Calendar,
      });
    } else if (lifeData.length >= 4) {
      insights.push({
        title: 'Beautiful Balance',
        message: `You touched ${lifeData.length} different life areas this week. That wholeness matters — you're not just productive, you're living fully. This is the way. 🌈`,
        type: 'positive',
        icon: Sparkles,
      });
    }

    // sleep-mood correlation
    const sleepMoodCorrelation = calculateCorrelation(
      moodData.map(d => d.sleep),
      moodData.map(d => d.mood)
    );

    if (sleepMoodCorrelation > 0.6) {
      insights.push({
        title: 'Sleep Fuels Your Mood',
        message: 'We noticed your mood rises with better sleep. Your body is telling you something important — listen to it. Prioritize rest, and watch yourself bloom. 🌺',
        type: 'growth',
        icon: Moon,
      });
    }

    // return random insight or default
    if (insights.length > 0) {
      return insights[Math.floor(Math.random() * insights.length)];
    }

    // default gentle insight
    return {
      title: 'You Showed Up',
      message: 'Another week of trying, learning, and being human. That\'s enough. You don\'t have to be perfect — you just have to be present. And you were. 💜',
      type: 'positive',
      icon: Heart,
    };
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-card)] px-4 py-3 rounded-xl shadow-lg border border-[var(--color-ring-offset-background)]">
          <p className="text-sm mb-2 opacity-70">{payload[0].payload.day}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a78bfa' }} />
              Mood: {payload[0].value}/5
            </p>
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#60a5fa' }} />
              Sleep: {payload[1].value}h
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-card)] px-4 py-3 rounded-xl shadow-lg border border-[var(--color-ring-offset-background)]">
          <p className="text-sm mb-1">{payload[0].name}</p>
          <p className="text-sm opacity-70">{payload[0].value}h ({payload[0].payload.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        < div
        >
          <RefreshCw size={32} style={{ color: themeColors.primary }} />
        </ div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* header */}
      < div
        className="bg-[var(--color-card)] border-b border-[var(--color-ring-offset-background)] px-6 py-4 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-gray-900 flex items-center gap-2">
                <Sparkles size={24} style={{ color: themeColors.primary }} />
                Weekly Insights
              </h1>
              <p className="text-sm opacity-60">Your journey this week</p>
            </div>
          </div>
          <button
            onClick={loadWeeklyData}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </button>
        </div>
      </ div>

      <div className="px-6 py-6 space-y-6 max-w-6xl mx-auto">

        {/* insight of week */}
        {insight && (
          < div
            className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-3xl p-6 border-2"
            style={{ borderColor: themeColors.primary }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: themeColors.primaryLight }}
              >
                <insight.icon size={28} style={{ color: themeColors.primary }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} style={{ color: themeColors.primary }} />
                  <span className="text-xs uppercase tracking-wide opacity-70">Insight of the Week</span>
                </div>
                <h2 className="mb-2">{insight.title}</h2>
                <p className="text-[var(--color-card-foreground)] leading-relaxed">{insight.message}</p>
              </div>
            </div>
          </ div>
        )}

        {/* mood vs sleep chart */}
        < div
          className="bg-[var(--color-card)] rounded-3xl p-6 shadow-sm border border-[var(--color-ring-offset-background)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Mood & Sleep Patterns</h3>
              <p className="text-sm opacity-60">How they move together</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="opacity-70">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="opacity-70">Sleep</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodSleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                domain={[0, 10]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#a78bfa" 
                strokeWidth={3}
                dot={{ fill: '#a78bfa', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                stroke="#60a5fa" 
                strokeWidth={3}
                dot={{ fill: '#60a5fa', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Notice the patterns: when sleep improves, mood often follows. Your body and mind are connected — rest is productive.
              </p>
            </div>
          </div>
        </ div>

        {/* life area distribution */}
        < div
          className="bg-[var(--color-card)] rounded-3xl p-6 shadow-sm border border-[var(--color-ring-offset-background)]"
        >
          <div className="mb-6">
            <h3 className="mb-1">Life Area Balance</h3>
            <p className="text-sm opacity-60">Where your time & energy went</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* pie chart */}
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={lifeAreaData}
                    dataKey="hours"
                    nameKey="area"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ area, percentage }) => `${area} ${percentage}%`}
                    labelLine={false}
                  >
                    {lifeAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* legend */}
            <div className="space-y-3">
              {lifeAreaData.map((area, index) => {
                const AreaIcon = LIFE_AREAS.find(a => a.name === area.area)?.icon || Calendar;
                return (
                  < div
                    key={area.area}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${area.color}20` }}
                      >
                        <AreaIcon size={18} style={{ color: area.color }} />
                      </div>
                      <div>
                        <p className="text-sm">{area.area}</p>
                        <p className="text-xs opacity-60">{area.hours}h this week</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-70">{area.percentage}%</p>
                    </div>
                  </ div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Heart size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-purple-900">
                Balance isn't equal parts — it's honoring what each season needs. Some weeks, work fills the space. Other weeks, rest does. Both are okay.
              </p>
            </div>
          </div>
        </ div>
      </div>
    </div>
  );
}
