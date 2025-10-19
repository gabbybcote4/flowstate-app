import React, { useState, useEffect } from 'react';
//  from 'motion/react';
import { useTheme } from './ThemeContext';
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Brain,
  Heart,
  Zap,
  Moon,
  Sun,
  Activity,
  AlertCircle,
  Eye,
  Wind,
  Thermometer,
  Droplets,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Info,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Symptom categories organized by conditions
const SYMPTOM_CATEGORIES = [
  {
    id: 'migraine',
    name: 'Migraine & Headaches',
    icon: Brain,
    color: '#9333ea',
    symptoms: [
      { id: 'headache', name: 'Headache', emoji: '🤕', severity: [1, 2, 3, 4, 5] },
      { id: 'migraine', name: 'Migraine', emoji: '⚡', severity: [1, 2, 3, 4, 5] },
      { id: 'light-sensitivity', name: 'Light Sensitivity', emoji: '☀️', severity: [1, 2, 3, 4, 5] },
      { id: 'sound-sensitivity', name: 'Sound Sensitivity', emoji: '🔊', severity: [1, 2, 3, 4, 5] },
      { id: 'visual-aura', name: 'Visual Aura', emoji: '👁️', severity: [1, 2, 3, 4, 5] },
      { id: 'nausea', name: 'Nausea', emoji: '🤢', severity: [1, 2, 3, 4, 5] },
      { id: 'dizziness', name: 'Dizziness', emoji: '😵', severity: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Fatigue',
    icon: Zap,
    color: '#f97316',
    symptoms: [
      { id: 'fatigue', name: 'Physical Fatigue', emoji: '😴', severity: [1, 2, 3, 4, 5] },
      { id: 'mental-fatigue', name: 'Mental Fatigue', emoji: '🧠', severity: [1, 2, 3, 4, 5] },
      { id: 'brain-fog', name: 'Brain Fog', emoji: '🌫️', severity: [1, 2, 3, 4, 5] },
      { id: 'low-motivation', name: 'Low Motivation', emoji: '📉', severity: [1, 2, 3, 4, 5] },
      { id: 'energy-crash', name: 'Energy Crash', emoji: '⬇️', severity: [1, 2, 3, 4, 5] },
      { id: 'restlessness', name: 'Restlessness', emoji: '⚡', severity: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'adhd',
    name: 'ADHD & Focus',
    icon: Activity,
    color: '#06b6d4',
    symptoms: [
      { id: 'difficulty-focusing', name: 'Difficulty Focusing', emoji: '🎯', severity: [1, 2, 3, 4, 5] },
      { id: 'racing-thoughts', name: 'Racing Thoughts', emoji: '💭', severity: [1, 2, 3, 4, 5] },
      { id: 'impulsivity', name: 'Impulsivity', emoji: '🌪️', severity: [1, 2, 3, 4, 5] },
      { id: 'hyperactivity', name: 'Hyperactivity', emoji: '🏃', severity: [1, 2, 3, 4, 5] },
      { id: 'executive-dysfunction', name: 'Executive Dysfunction', emoji: '🧩', severity: [1, 2, 3, 4, 5] },
      { id: 'hyperfocus', name: 'Hyperfocus', emoji: '🔍', severity: [1, 2, 3, 4, 5] },
      { id: 'time-blindness', name: 'Time Blindness', emoji: '⏰', severity: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    icon: Heart,
    color: '#ec4899',
    symptoms: [
      { id: 'anxiety', name: 'Anxiety', emoji: '😰', severity: [1, 2, 3, 4, 5] },
      { id: 'stress', name: 'Stress', emoji: '😤', severity: [1, 2, 3, 4, 5] },
      { id: 'overwhelm', name: 'Overwhelm', emoji: '😫', severity: [1, 2, 3, 4, 5] },
      { id: 'low-mood', name: 'Low Mood', emoji: '😔', severity: [1, 2, 3, 4, 5] },
      { id: 'irritability', name: 'Irritability', emoji: '😠', severity: [1, 2, 3, 4, 5] },
      { id: 'emotional-dysregulation', name: 'Emotional Dysregulation', emoji: '🎭', severity: [1, 2, 3, 4, 5] },
      { id: 'panic', name: 'Panic', emoji: '😱', severity: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'sleep',
    name: 'Sleep & Rest',
    icon: Moon,
    color: '#8b5cf6',
    symptoms: [
      { id: 'insomnia', name: 'Insomnia', emoji: '😴', severity: [1, 2, 3, 4, 5] },
      { id: 'poor-sleep-quality', name: 'Poor Sleep Quality', emoji: '🌙', severity: [1, 2, 3, 4, 5] },
      { id: 'nightmares', name: 'Nightmares', emoji: '😨', severity: [1, 2, 3, 4, 5] },
      { id: 'sleep-disruption', name: 'Sleep Disruption', emoji: '🔔', severity: [1, 2, 3, 4, 5] },
      { id: 'oversleeping', name: 'Oversleeping', emoji: '💤', severity: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'physical',
    name: 'Physical Symptoms',
    icon: Activity,
    color: '#10b981',
    symptoms: [
      { id: 'muscle-tension', name: 'Muscle Tension', emoji: '💪', severity: [1, 2, 3, 4, 5] },
      { id: 'body-aches', name: 'Body Aches', emoji: '🤕', severity: [1, 2, 3, 4, 5] },
      { id: 'tremors', name: 'Tremors', emoji: '🤲', severity: [1, 2, 3, 4, 5] },
      { id: 'chest-tightness', name: 'Chest Tightness', emoji: '🫁', severity: [1, 2, 3, 4, 5] },
      { id: 'rapid-heartbeat', name: 'Rapid Heartbeat', emoji: '💓', severity: [1, 2, 3, 4, 5] },
      { id: 'shortness-of-breath', name: 'Shortness of Breath', emoji: '😮‍💨', severity: [1, 2, 3, 4, 5] },
      { id: 'digestive-issues', name: 'Digestive Issues', emoji: '🤢', severity: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'sensory',
    name: 'Sensory Sensitivities',
    icon: Eye,
    color: '#f59e0b',
    symptoms: [
      { id: 'sensory-overload', name: 'Sensory Overload', emoji: '🎆', severity: [1, 2, 3, 4, 5] },
      { id: 'touch-sensitivity', name: 'Touch Sensitivity', emoji: '🖐️', severity: [1, 2, 3, 4, 5] },
      { id: 'smell-sensitivity', name: 'Smell Sensitivity', emoji: '👃', severity: [1, 2, 3, 4, 5] },
      { id: 'texture-issues', name: 'Texture Issues', emoji: '🧶', severity: [1, 2, 3, 4, 5] },
      { id: 'temperature-sensitivity', name: 'Temperature Sensitivity', emoji: '🌡️', severity: [1, 2, 3, 4, 5] },
    ]
  },
];

interface SymptomEntry {
  date: string;
  symptomId: string;
  categoryId: string;
  severity: number;
  notes?: string;
  timestamp: number;
}

interface SymptomTrackerScreenProps {
  onNavigate?: (screen: string) => void;
}

export function SymptomTrackerScreen({ onNavigate }: SymptomTrackerScreenProps) {
  const { themeColors } = useTheme();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'track' | 'insights'>('track');
  const [selectedSymptomForChart, setSelectedSymptomForChart] = useState<string | null>(null);

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flowstate-symptom-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('flowstate-symptom-entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (categoryId: string, symptomId: string, severity: number, notes?: string) => {
    const newEntry: SymptomEntry = {
      date: new Date().toISOString().split('T')[0],
      symptomId,
      categoryId,
      severity,
      notes,
      timestamp: Date.now(),
    };
    setEntries([...entries, newEntry]);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Get last 7 days of data for a symptom
  const getWeeklyData = (symptomId: string) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayEntries = entries.filter(e => e.symptomId === symptomId && e.date === date);
      const avgSeverity = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.severity, 0) / dayEntries.length
        : 0;

      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: dayName,
        severity: Math.round(avgSeverity * 10) / 10,
      };
    });
  };

  // Get today's entries by category
  const getTodayEntriesByCategory = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(e => e.date === today);
    
    const byCategory: { [key: string]: SymptomEntry[] } = {};
    todayEntries.forEach(entry => {
      if (!byCategory[entry.categoryId]) {
        byCategory[entry.categoryId] = [];
      }
      byCategory[entry.categoryId].push(entry);
    });
    
    return byCategory;
  };

  // Generate correlation insights
  const getCorrelationInsights = () => {
    const insights = [];
    
    // Check for headache patterns
    const headacheEntries = entries.filter(e => e.symptomId === 'headache' || e.symptomId === 'migraine');
    const stressEntries = entries.filter(e => e.symptomId === 'stress');
    const sleepEntries = entries.filter(e => e.symptomId === 'poor-sleep-quality' || e.symptomId === 'insomnia');
    
    if (headacheEntries.length >= 3) {
      const highHeadacheDays = headacheEntries.filter(e => e.severity >= 4).map(e => e.date);
      const highStressOnSameDays = stressEntries.filter(e => 
        highHeadacheDays.includes(e.date) && e.severity >= 4
      );
      
      if (highStressOnSameDays.length >= 2) {
        insights.push({
          type: 'correlation',
          icon: '⚡',
          title: 'Headache-Stress Pattern',
          message: 'Severe headaches tend to occur on high-stress days',
          color: '#9333ea',
        });
      }
    }

    // Check for fatigue patterns
    const fatigueEntries = entries.filter(e => e.symptomId === 'fatigue' || e.symptomId === 'mental-fatigue');
    if (fatigueEntries.length >= 5) {
      const avgFatigue = fatigueEntries.reduce((sum, e) => sum + e.severity, 0) / fatigueEntries.length;
      if (avgFatigue >= 3.5) {
        insights.push({
          type: 'trend',
          icon: '😴',
          title: 'Persistent Fatigue',
          message: 'Your energy levels have been consistently low this week',
          color: '#f97316',
        });
      }
    }

    // Check for anxiety patterns
    const anxietyEntries = entries.filter(e => e.symptomId === 'anxiety' || e.symptomId === 'panic');
    if (anxietyEntries.length >= 3) {
      insights.push({
        type: 'awareness',
        icon: '💙',
        title: 'Anxiety Tracking',
        message: `You've logged anxiety ${anxietyEntries.length} times. Consider breathing exercises.`,
        color: '#ec4899',
      });
    }

    // Check for sleep impact
    const poorSleepDays = sleepEntries.filter(e => e.severity >= 4).map(e => e.date);
    const fatigueOnBadSleepDays = fatigueEntries.filter(e => 
      poorSleepDays.includes(e.date) && e.severity >= 4
    );
    
    if (fatigueOnBadSleepDays.length >= 2) {
      insights.push({
        type: 'correlation',
        icon: '🌙',
        title: 'Sleep-Energy Connection',
        message: 'Poor sleep nights are followed by high fatigue days',
        color: '#8b5cf6',
      });
    }

    // Check for sensory overload
    const sensoryEntries = entries.filter(e => 
      e.categoryId === 'sensory' && e.severity >= 4
    );
    if (sensoryEntries.length >= 3) {
      insights.push({
        type: 'awareness',
        icon: '🎆',
        title: 'Sensory Sensitivity Alert',
        message: 'You may benefit from reducing environmental stimuli',
        color: '#f59e0b',
      });
    }

    return insights;
  };

  const todayEntries = getTodayEntriesByCategory();
  const insights = getCorrelationInsights();

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeColors.background }}>
      {/* Header */}
      < div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.('home')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900">Symptom Tracker</h1>
                <p className="text-sm opacity-60">Track patterns, find correlations</p>
              </div>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'track' ? 'insights' : 'track')}
              className="px-4 py-2 rounded-2xl text-sm transition-all"
              style={{
                backgroundColor: viewMode === 'insights' ? themeColors.primary : '#f3f4f6',
                color: viewMode === 'insights' ? 'white' : '#374151',
              }}
            >
              {viewMode === 'insights' ? 'Insights' : 'Track'}
            </button>
          </div>
        </div>
      </ div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {viewMode === 'track' ? (
          <>
            {/* Today's Summary */}
            < div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-3xl p-6 mb-6 border border-lavender-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-gray-900 mb-1">Today's Status</h2>
                  <p className="text-sm opacity-60">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl">{entries.filter(e => e.date === new Date().toISOString().split('T')[0]).length}</div>
                  <div className="text-xs opacity-60">symptoms tracked</div>
                </div>
              </div>

              {Object.keys(todayEntries).length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {Object.entries(todayEntries).map(([catId, catEntries]) => {
                    const category = SYMPTOM_CATEGORIES.find(c => c.id === catId);
                    const avgSeverity = catEntries.reduce((sum, e) => sum + e.severity, 0) / catEntries.length;
                    return category ? (
                      <div key={catId} className="bg-white rounded-2xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <category.icon size={16} style={{ color: category.color }} />
                          <span className="text-xs opacity-70">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xl">{Math.round(avgSeverity)}/5</div>
                          <div className="text-xs opacity-50">{catEntries.length} logged</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </ div>

            {/* Symptom Categories */}
            <div className="space-y-4">
              {SYMPTOM_CATEGORIES.map((category, index) => {
                const isExpanded = expandedCategories.has(category.id);
                const CategoryIcon = category.icon;

                return (
                  < div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}15` }}
                        >
                          <CategoryIcon size={20} style={{ color: category.color }} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-gray-900">{category.name}</h3>
                          <p className="text-xs opacity-50">{category.symptoms.length} symptoms</p>
                        </div>
                      </div>
                      < div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} className="text-gray-400" />
                      </ div>
                    </button>

                    {/* Symptoms List */}
                    <AnimatePresence>
                      {isExpanded && (
                        < div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-5 space-y-4">
                            {category.symptoms.map(symptom => {
                              const weeklyData = getWeeklyData(symptom.id);
                              const todayEntry = entries.find(
                                e => e.symptomId === symptom.id && e.date === new Date().toISOString().split('T')[0]
                              );
                              const hasData = weeklyData.some(d => d.severity > 0);

                              return (
                                <div
                                  key={symptom.id}
                                  className="bg-gray-50 rounded-2xl p-4"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">{symptom.emoji}</span>
                                      <div>
                                        <div className="text-sm text-gray-900">{symptom.name}</div>
                                        {todayEntry && (
                                          <div className="text-xs opacity-60 mt-1">
                                            Today: {todayEntry.severity}/5
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Severity Buttons */}
                                  <div className="flex gap-2 mb-3">
                                    {symptom.severity.map(level => (
                                      < button
                                        key={level}
                                        onClick={() => addEntry(category.id, symptom.id, level)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 py-2 rounded-xl text-sm transition-all"
                                        style={{
                                          backgroundColor: todayEntry?.severity === level
                                            ? category.color
                                            : 'white',
                                          color: todayEntry?.severity === level ? 'white' : '#6b7280',
                                          border: `2px solid ${todayEntry?.severity === level ? category.color : '#e5e7eb'}`,
                                        }}
                                      >
                                        {level}
                                      </ button>
                                    ))}
                                  </div>

                                  {/* Mini Chart */}
                                  {hasData && (
                                    <div className="h-20 mt-3">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={weeklyData}>
                                          <Line
                                            type="monotone"
                                            dataKey="severity"
                                            stroke={category.color}
                                            strokeWidth={2}
                                            dot={{ fill: category.color, r: 3 }}
                                          />
                                          <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                                            axisLine={false}
                                            tickLine={false}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </ div>
                      )}
                    </AnimatePresence>
                  </ div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Insights View */}
            < div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Correlation Insights */}
              {insights.length > 0 ? (
                <>
                  <h2 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles size={24} style={{ color: themeColors.primary }} />
                    Your Patterns & Insights
                  </h2>

                  {insights.map((insight, index) => (
                    < div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: `${insight.color}15` }}
                        >
                          {insight.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1">{insight.title}</h3>
                          <p className="text-sm opacity-70">{insight.message}</p>
                        </div>
                      </div>
                    </ div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-gray-900 mb-2">Not Enough Data Yet</h3>
                  <p className="text-sm opacity-60 max-w-sm mx-auto">
                    Track your symptoms for a few days to see patterns and correlations
                  </p>
                </div>
              )}

              {/* Weekly Overview */}
              {entries.length > 0 && (
                < div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6"
                >
                  <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} style={{ color: themeColors.primary }} />
                    Weekly Summary
                  </h3>

                  <div className="space-y-4">
                    {SYMPTOM_CATEGORIES.map(category => {
                      const categoryEntries = entries.filter(e => e.categoryId === category.id);
                      if (categoryEntries.length === 0) return null;

                      const avgSeverity = categoryEntries.reduce((sum, e) => sum + e.severity, 0) / categoryEntries.length;
                      const CategoryIcon = category.icon;

                      return (
                        <div key={category.id} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CategoryIcon size={16} style={{ color: category.color }} />
                              <span className="text-sm text-gray-900">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm opacity-60">{categoryEntries.length} entries</span>
                              <span className="text-sm" style={{ color: category.color }}>
                                Avg: {avgSeverity.toFixed(1)}/5
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(avgSeverity / 5) * 100}%`,
                                backgroundColor: category.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ div>
              )}

              {/* Tips */}
              < div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-5 border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-gray-900 mb-2">💡 Tracking Tips</h4>
                    <ul className="text-sm opacity-70 space-y-1 list-disc list-inside">
                      <li>Track symptoms consistently for better insights</li>
                      <li>Note patterns between symptoms and activities</li>
                      <li>Share data with your healthcare provider</li>
                      <li>Use severity 1-5: 1=mild, 3=moderate, 5=severe</li>
                    </ul>
                  </div>
                </div>
              </ div>
            </ div>
          </>
        )}
      </div>
    </div>
  );
}
