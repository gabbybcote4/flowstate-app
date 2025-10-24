// src/screens/WeeklyInsightsDashboard.tsx
// weekly insights dashboard showing mood, sleep, and life area balance

import React, { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  TrendingUp,
  Sparkles,
  Moon,
  Heart,
  Briefcase,
  Users,
  Palette,
  Home as HomeIcon,
  Calendar,
  RefreshCw,
  ArrowLeft,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  type: "positive" | "growth" | "gentle";
  icon: React.ElementType;
}

const LIFE_AREAS = [
  { name: "Health", color: "#D8B4FE", icon: Heart },
  { name: "Work", color: "#FBBF24", icon: Briefcase },
  { name: "Relationships", color: "#FCA5A5", icon: Users },
  { name: "Personal Growth", color: "#A5B4FC", icon: TrendingUp },
  { name: "Creativity", color: "#FCD34D", icon: Palette },
  { name: "Home", color: "#A7F3D0", icon: HomeIcon },
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
      const moodSleep = generateMoodSleepData();
      const lifeAreas = generateLifeAreaData();
      const weeklyInsight = generateWeeklyInsight(moodSleep, lifeAreas);
      setMoodSleepData(moodSleep);
      setLifeAreaData(lifeAreas);
      setInsight(weeklyInsight);
      setIsLoading(false);
    }, 400);
  };

  // generate demo or localstorage mood/sleep data
  const generateMoodSleepData = (): MoodSleepData[] => {
    const data: MoodSleepData[] = [];
    const today = new Date();
    const checkInData = JSON.parse(localStorage.getItem("flowstate-coaching-data") || "{}");
    const reflections = JSON.parse(localStorage.getItem("flowstate-reflections") || "{}");

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      let mood = 3;
      if (checkInData?.mood !== undefined) {
        mood = checkInData.mood;
      } else {
        mood = 2 + Math.random() * 2;
      }

      let sleep = 0;
      if (reflections[dateStr]?.sleepQuality) {
        const quality = reflections[dateStr].sleepQuality;
        sleep = 4 + quality * 1.0;
      } else {
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

  // generate demo or localstorage life area distribution
  const generateLifeAreaData = (): LifeAreaData[] => {
    const timeBlocks = JSON.parse(localStorage.getItem("flowstate-timeblocks") || "[]");
    const calendarEvents = JSON.parse(localStorage.getItem("flowstate-calendar-events") || "[]");
    const areaHours = new Map<string, number>();
    let totalHours = 0;

    timeBlocks.forEach((block: any) => {
      if (block.lifeArea) {
        const current = areaHours.get(block.lifeArea) || 0;
        areaHours.set(block.lifeArea, current + 1);
        totalHours += 1;
      }
    });

    calendarEvents.forEach((event: any) => {
      if (event.lifeArea && event.duration) {
        const current = areaHours.get(event.lifeArea) || 0;
        const hours = event.duration / 60;
        areaHours.set(event.lifeArea, current + hours);
        totalHours += hours;
      }
    });

    if (totalHours === 0) {
      const demo = [
        { area: "Work", hours: 35 },
        { area: "Health", hours: 8 },
        { area: "Relationships", hours: 12 },
        { area: "Personal Growth", hours: 5 },
        { area: "Home", hours: 10 },
        { area: "Creativity", hours: 3 },
      ];
      totalHours = demo.reduce((sum, d) => sum + d.hours, 0);
      demo.forEach((d) => areaHours.set(d.area, d.hours));
    }

    const data: LifeAreaData[] = LIFE_AREAS.map((a) => {
      const hours = areaHours.get(a.name) || 0;
      const percentage = totalHours ? Math.round((hours / totalHours) * 100) : 0;
      return { area: a.name, hours, color: a.color, percentage };
    }).filter((d) => d.hours > 0);

    return data;
  };

  // generate context-sensitive weekly insight
  const generateWeeklyInsight = (moodData: MoodSleepData[], lifeData: LifeAreaData[]): WeeklyInsight => {
    const avgMood = moodData.reduce((s, d) => s + d.mood, 0) / moodData.length;
    const avgSleep = moodData.reduce((s, d) => s + d.sleep, 0) / moodData.length;
    const moodTrend = moodData[moodData.length - 1].mood - moodData[0].mood;
    //const sleepTrend = moodData[moodData.length - 1].sleep - moodData[0].sleep;

    const topArea = [...lifeData].sort((a, b) => b.hours - a.hours)[0];
    const insights: WeeklyInsight[] = [];

    // sleep patterns
    if (avgSleep >= 7.5) {
      insights.push({
        title: "Beautiful sleep rhythm",
        message: `You averaged ${avgSleep.toFixed(1)} hours of sleep this week. Your body is getting the rest it needs — keep honoring that rhythm.`,
        type: "positive",
        icon: Moon,
      });
    } else if (avgSleep < 6.5) {
      insights.push({
        title: "Your body needs rest",
        message: `Sleep has been light this week (${avgSleep.toFixed(
          1
        )}h). Even 15 minutes earlier can help — rest is productive.`,
        type: "gentle",
        icon: Moon,
      });
    }

    // mood patterns
    if (moodTrend > 0.5) {
      insights.push({
        title: "Upward momentum",
        message:
          "Your mood has been trending up this week — something is working. Small shifts compound over time.",
        type: "positive",
        icon: TrendingUp,
      });
    } else if (avgMood >= 3.5) {
      insights.push({
        title: "Steady energy",
        message:
          "You’ve maintained stable energy this week. Consistency builds sustainable habits — keep showing up gently.",
        type: "positive",
        icon: Sparkles,
      });
    } else if (avgMood < 2.5) {
      insights.push({
        title: "Honoring hard days",
        message:
          "This week may have felt heavy, and that’s okay. Showing up still counts. Take rest where you can.",
        type: "gentle",
        icon: Heart,
      });
    }

    // balance
    if (topArea && topArea.percentage > 60) {
      insights.push({
        title: "Time for balance",
        message: `${topArea.area} filled ${topArea.percentage}% of your tracked time — impressive focus. Remember to recharge other areas, too.`,
        type: "growth",
        icon:
          LIFE_AREAS.find((a) => a.name === topArea.area)?.icon ||
          Calendar,
      });
    } else if (lifeData.length >= 4) {
      insights.push({
        title: "Beautiful balance",
        message: `You engaged with ${lifeData.length} life areas this week — that’s a healthy mix of doing and being.`,
        type: "positive",
        icon: Sparkles,
      });
    }

    // correlation
    const corr = calculateCorrelation(
      moodData.map((d) => d.sleep),
      moodData.map((d) => d.mood)
    );
    if (corr > 0.6) {
      insights.push({
        title: "Sleep fuels mood",
        message:
          "Your data suggests mood rises with better sleep — listen to your body and prioritize rest.",
        type: "growth",
        icon: Moon,
      });
    }

    if (insights.length === 0) {
      return {
        title: "You showed up",
        message:
          "Another week of learning and being human — that’s enough. Presence matters more than perfection.",
        type: "positive",
        icon: Heart,
      };
    }

    return insights[Math.floor(Math.random() * insights.length)];
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (!n) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
    return den === 0 ? 0 : num / den;
  };

  const CustomTooltip = ({ active, payload }: any) =>
    active && payload?.length ? (
      <div className="bg-[var(--color-card)] px-4 py-3 rounded-xl shadow-lg border border-[var(--color-ring-offset-background)]">
        <p className="text-sm mb-2 opacity-70">{payload[0].payload.day}</p>
        <p className="text-sm flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-400" />
          Mood: {payload[0].value}/5
        </p>
        <p className="text-sm flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-400" />
          Sleep: {payload[1].value}h
        </p>
      </div>
    ) : null;

  const PieTooltip = ({ active, payload }: any) =>
    active && payload?.length ? (
      <div className="bg-[var(--color-card)] px-4 py-3 rounded-xl shadow-lg border border-[var(--color-ring-offset-background)]">
        <p className="text-sm mb-1">{payload[0].name}</p>
        <p className="text-sm opacity-70">
          {payload[0].value}h ({payload[0].payload.percentage}%)
        </p>
      </div>
    ) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw size={32} style={{ color: themeColors.primary }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* header */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-ring-offset-background)] px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate("home")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="flex items-center gap-2 text-gray-900">
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
      </div>

      {/* body */}
      <div className="px-6 py-6 space-y-6 max-w-6xl mx-auto">
        {insight && (
          <div
            className="rounded-3xl p-6 border-2"
            style={{
              borderColor: themeColors.primary,
              background: `linear-gradient(to bottom right, ${themeColors.primaryLight}, #fff)`,
            }}
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
                  <span className="text-xs uppercase tracking-wide opacity-70">
                    Insight of the week
                  </span>
                </div>
                <h2 className="mb-2">{insight.title}</h2>
                <p className="text-[var(--color-card-foreground)] leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* mood vs sleep chart */}
        <div className="bg-[var(--color-card)] rounded-3xl p-6 shadow-sm border border-[var(--color-ring-offset-background)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Mood & sleep patterns</h3>
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
              <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="mood" stroke="#a78bfa" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="sleep" stroke="#60a5fa" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Notice the patterns — when sleep improves, mood often follows. Your body and mind are connected.
              </p>
            </div>
          </div>
        </div>

        {/* life area distribution */}
        <div className="bg-[var(--color-card)] rounded-3xl p-6 shadow-sm border border-[var(--color-ring-offset-background)]">
          <div className="mb-6">
            <h3 className="mb-1">Life area balance</h3>
            <p className="text-sm opacity-60">Where your time & energy went</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
                    {lifeAreaData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {lifeAreaData.map((area) => {
                const Icon = LIFE_AREAS.find((a) => a.name === area.area)?.icon || Calendar;
                return (
                  <div
                    key={area.area}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${area.color}20` }}
                      >
                        <Icon size={18} style={{ color: area.color }} />
                      </div>
                      <div>
                        <p className="text-sm">{area.area}</p>
                        <p className="text-xs opacity-60">{area.hours}h this week</p>
                      </div>
                    </div>
                    <p className="text-sm opacity-70">{area.percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-2xl">
            <div className="flex items-start gap-2">
              <Heart size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-purple-900">
                Balance isn’t equal parts — it’s honoring what each season needs. Some weeks, work leads. Other weeks, rest does. Both are okay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
