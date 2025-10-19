//import React, { useState, useEffect } from 'react';
import { HealthWidget } from './HealthWidget';
import { WeeklySummaryCard } from './WeeklySummaryCard';
//import { LifeAreaCard } from './LifeAreaCard';
//import { LifeAreaDialog } from './LifeAreaDialog';
//import { FocusAreaSelector } from './FocusAreaSelector';
import { EncouragementMessage } from './EncouragementMessage';
//import { AIInsightsEngine } from './AIInsightsEngine';
import { AdaptiveRecommendationsWidget } from './AdaptiveRecommendationsWidget';
//import { CoachingNudgeCard } from './CoachingNudgeCard';
import { WeatherMoonWidget } from './WeatherMoonWidget';
import { DailyMomentumRing } from './DailyMomentumRing';
//import { LifeAreaFilterChips, LIFE_AREAS } from './LifeAreaFilterChips';
//import { TodoCard } from './TodoCard';
import { useTheme } from './ThemeContext';
import { AdaptiveGreeting } from './AdaptiveGreeting';
//import { MoodCheckInWidget } from './MoodCheckInWidget';
import { QuickReflectionCard } from './QuickReflectionCard';
import { TimeOfDayIndicator } from './TimeOfDayIndicator';
//import { AmbientParticles } from './AmbientParticles';
//import { getLocalStorageItem } from '../hooks/useLocalStorage';
import { getAdaptiveBackground } from './adaptiveBackgrounds';
import { useUserConfig } from '../config/UserConfigContext';
import { Moon, Footprints, Heart, Activity, Smile, Zap, MessageCircleHeart, Flower2, TrendingUp, CheckCircle2 } from 'lucide-react';

// interface LifeArea {
//   id: string;
//   icon: string;
//   title: string;
//   progress: number;
//   currentHabits: string[];
//   suggestion: string;
//   color: string;
// }

interface Habit {
  id: string;
  name: string;
  purpose: string;
  frequency: string;
  timeSlots?: any[];
  trigger: string;
  motivation: string;
  lifeArea: string;
  streak: number;
  completedSlots: { date: string; slotId?: string }[];
  isActive: boolean;
}

// const LIFE_AREA_CONFIG = [
//   {
//     id: 'Health',
//     icon: '❤️',
//     title: 'Health',
//     suggestion: 'Your body deserves gentle care',
//     color: '#DCBBA3',
//   },
//   {
//     id: 'Work',
//     icon: '💼',
//     title: 'Work',
//     suggestion: 'Progress over perfection',
//     color: '#A3C9DC',
//   },
//   {
//     id: 'Self-Care',
//     icon: '🧘',
//     title: 'Self-Care',
//     suggestion: 'You deserve this time',
//     color: '#E9D5FF',
//   },
//   {
//     id: 'Relationships',
//     icon: '💕',
//     title: 'Relationships',
//     suggestion: 'Connection nurtures the soul',
//     color: '#DCADC9',
//   },
//   {
//     id: 'Personal Growth',
//     icon: '🌱',
//     title: 'Personal Growth',
//     suggestion: 'Small steps lead to big growth',
//     color: '#A3DCC9',
//   },
//   {
//     id: 'Home',
//     icon: '🏡',
//     title: 'Environment',
//     suggestion: 'A calm space supports you',
//     color: '#C9DCA3',
//   },
//   {
//     id: 'Creativity',
//     icon: '🎨',
//     title: 'Creativity',
//     suggestion: 'Express yourself freely',
//     color: '#DCA3BB',
//   },
//   {
//     id: 'Finances',
//     icon: '💰',
//     title: 'Finances',
//     suggestion: 'Financial peace brings freedom',
//     color: '#D4AF37',
//   },
// ];

function CoachingCheckInStatus() {
  // const [hasCheckedIn, setHasCheckedIn] = useState(false);
  // const [lastCheckIn, setLastCheckIn] = useState<{
  //   mood: number;
  //   energy: number;
  //   focus: number;
  // } | null>(null);

  // useEffect(() => {
  //   const savedDate = localStorage.getItem('flowstate-coaching-date');
  //   const today = new Date().toDateString();
    
  //   if (savedDate === today) {
  //     setHasCheckedIn(true);
  //     const savedData = localStorage.getItem('flowstate-coaching-data');
  //     if (savedData) {
  //       const data = JSON.parse(savedData);
  //       setLastCheckIn({
  //         mood: data.mood,
  //         energy: data.energy,
  //         focus: data.focus,
  //       });
  //     }
  //   }
  // }, []);

  // const getQuickInsight = () => {
  //   if (!lastCheckIn) return null;
    
  //   const { mood, energy, focus } = lastCheckIn;
  //   const moodEmoji = ['😔', '😕', '😐', '🙂', '😊'][mood - 1];
  //   const energyLabel = energy <= 2 ? 'low energy' : energy >= 4 ? 'energized' : 'moderate';
  //   const focusLabel = focus <= 2 ? 'scattered' : focus >= 4 ? 'focused' : 'okay';
    
  //   return { moodEmoji, energyLabel, focusLabel };
  // };

  //const insight = getQuickInsight();

  return (
    <div className="bg-gradient-to-br from-lavender-100 to-blue-50 rounded-3xl shadow-sm p-5 border border-lavender-200">
      <div className="flex items-center gap-3 mb-3">
        <MessageCircleHeart size={20} className="text-lavender-600" />
        <h3 className="text-gray-700">Daily Coaching</h3>
      </div>
      
      <div className="text-sm">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="opacity-80">
              </span>
            </div>
            <div className="text-xs opacity-60">
              ✓ Checked in today — visit Coach tab for full guidance
            </div>
          </div>
          <div>
            <div className="mb-2 opacity-80">Haven't checked in yet today</div>
            <div className="text-xs opacity-60">
              Visit the Coach tab for personalized guidance
            </div>
          </div>
        
      </div>
    </div>
  );
}

interface DashboardScreenProps {
  onNavigateToHabits?: (lifeArea: string) => void;
  onNavigate?: (screen: string) => void;
}

export function DashboardScreen({  onNavigate }: DashboardScreenProps = {}) {
  const { themeColors } = useTheme();
  const { config } = useUserConfig();
  // const [currentMood, setCurrentMood] = useState<string>('');
  // const [energyLevel, setEnergyLevel] = useState<number>(50);
  // const [focusArea, setFocusArea] = useState<string>('');
  // const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  // const [selectedLifeArea, setSelectedLifeArea] = useState<LifeArea | null>(null);
  // const [insightsKey, setInsightsKey] = useState<number>(0);
  // const [selectedFilter, setSelectedFilter] = useState<string>('all');
  // const [filteredTodos, setFilteredTodos] = useState<any[]>([]);
  // const [currentTime, setCurrentTime] = useState(new Date());

  // Debug: Log config on mount and when it changes
  // useEffect(() => {
  //   console.log('📊 Dashboard Config:', {
  //     widgets: config.widgets,
  //     theme: config.theme,
  //     onboardingCompleted: config.onboardingCompleted
  //   });
  // }, [config]);

  // Update time every minute for adaptive backgrounds
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 60000); // Update every minute

  //   return () => clearInterval(timer);
  // }, []);

  // Load data from localStorage and calculate from actual habits
  // useEffect(() => {
  //   const savedMood = getLocalStorageItem('flowstate-mood', '');
  //   if (savedMood) setCurrentMood(savedMood);

  //   const savedEnergy = getLocalStorageItem('flowstate-energy', '50');
  //   if (savedEnergy) setEnergyLevel(parseInt(savedEnergy));

  //   const savedFocusArea = getLocalStorageItem('flowstate-focus-area', '');
  //   if (savedFocusArea) setFocusArea(savedFocusArea);
  // }, []);

  // Calculate life areas from actual habits
  // useEffect(() => {
  //   const today = new Date().toDateString();
  //   const savedHabits = localStorage.getItem('flowstate-habits');
  //   const habits: Habit[] = savedHabits ? JSON.parse(savedHabits) : [];

  //   const calculatedLifeAreas = LIFE_AREA_CONFIG.map(config => {
  //     const areaHabits = habits.filter(h => h.lifeArea === config.id && h.isActive);
      
  //     // Calculate progress: percentage of habits completed today
  //     let completed = 0;
  //     let total = areaHabits.length;

  //     areaHabits.forEach(habit => {
  //       if (habit.frequency === 'multiple-daily' && habit.timeSlots) {
  //         // For multiple-daily, check if all slots are completed
  //         const allSlotsCompleted = habit.timeSlots.every(slot =>
  //           (habit.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
  //         );
  //         if (allSlotsCompleted) completed++;
  //       } else {
  //         // For other frequencies, check if completed today
  //         const isCompleted = (habit.completedSlots || []).some(c => c.date === today);
  //         if (isCompleted) completed++;
  //       }
  //     });

  //     const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  //     return {
  //       id: config.id,
  //       icon: config.icon,
  //       title: config.title,
  //       progress,
  //       currentHabits: areaHabits.slice(0, 3).map(h => h.name), // Show first 3 habits
  //       suggestion: config.suggestion,
  //       color: config.color,
  //     };
  //   });

  //   setLifeAreas(calculatedLifeAreas);
  //   updateFilteredTodos(selectedFilter, habits);
  // }, [selectedLifeArea, selectedFilter]);

  // const updateFilteredTodos = (filter: string, habits?: Habit[]) => {
  //   const today = new Date().toDateString();
  //   const savedHabits = localStorage.getItem('flowstate-habits');
  //   const allHabits: Habit[] = habits || (savedHabits ? JSON.parse(savedHabits) : []);
    
  //   let filtered = allHabits.filter(h => h.isActive);
    
  //   if (filter !== 'all') {
  //     filtered = filtered.filter(h => h.lifeArea === filter);
  //   }

  //   // Convert habits to todo format
  //   const todos = filtered.map(habit => {
  //     const isCompleted = habit.frequency === 'multiple-daily' && habit.timeSlots
  //       ? habit.timeSlots.every(slot =>
  //           (habit.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
  //         )
  //       : (habit.completedSlots || []).some(c => c.date === today);

  //     const areaConfig = LIFE_AREA_CONFIG.find(a => a.id === habit.lifeArea);

  //     return {
  //       id: habit.id,
  //       title: habit.name,
  //       completed: isCompleted,
  //       lifeArea: habit.lifeArea,
  //       lifeAreaEmoji: areaConfig?.icon || '✨'
  //     };
  //   });

  //   setFilteredTodos(todos);
  // };

  // const handleFilterChange = (areaId: string) => {
  //   setSelectedFilter(areaId);
  //   updateFilteredTodos(areaId);
  // };

  // const handleTodoToggle = (todoId: string) => {
  //   const today = new Date().toDateString();
  //   const savedHabits = localStorage.getItem('flowstate-habits');
  //   const habits: Habit[] = savedHabits ? JSON.parse(savedHabits) : [];
    
  //   const updatedHabits = habits.map(habit => {
  //     if (habit.id === todoId) {
  //       const completedSlots = habit.completedSlots || [];
  //       const isCompleted = completedSlots.some(c => c.date === today);
        
  //       if (isCompleted) {
  //         // Remove completion
  //         return {
  //           ...habit,
  //           completedSlots: completedSlots.filter(c => c.date !== today)
  //         };
  //       } else {
  //         // Add completion
  //         return {
  //           ...habit,
  //           completedSlots: [...completedSlots, { date: today }],
  //           streak: habit.streak + 1
  //         };
  //       }
  //     }
  //     return habit;
  //   });

  //   localStorage.setItem('flowstate-habits', JSON.stringify(updatedHabits));
  //   // updateFilteredTodos(selectedFilter, updatedHabits);
  //   // setInsightsKey(prev => prev + 1);
  // };

  // const handleFocusAreaSelect = (area: string) => {
  //   //setFocusArea(area);
  //   localStorage.setItem('flowstate-focus-area', area);
  // };

  // const handleEnergyChange = (value: number) => {
  //   //setEnergyLevel(value);
  //   localStorage.setItem('flowstate-energy', value.toString());
  // };

  // const getMoodEmoji = (mood: string) => {
  //   switch (mood) {
  //     case 'low':
  //       return '😌';
  //     case 'moderate':
  //       return '😊';
  //     case 'good':
  //       return '🌟';
  //     default:
  //       return '💭';
  //   }
  // };

  // const getMoodLabel = (mood: string) => {
  //   switch (mood) {
  //     case 'low':
  //       return 'Low Energy';
  //     case 'moderate':
  //       return 'Moderate';
  //     case 'good':
  //       return 'Good Energy';
  //     default:
  //       return 'Not set';
  //   }
  // };

  // Calculate total habits stats from actual habits
  const calculateHabitsStats = () => {
    const today = new Date().toDateString();
    const savedHabits = localStorage.getItem('flowstate-habits');
    const habits: Habit[] = savedHabits ? JSON.parse(savedHabits) : [];
    
    const activeHabits = habits.filter(h => h.isActive);
    const total = activeHabits.length;
    
    let completed = 0;
    activeHabits.forEach(habit => {
      if (habit.frequency === 'multiple-daily' && habit.timeSlots) {
        const allSlotsCompleted = habit.timeSlots.every(slot =>
          (habit.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
        );
        if (allSlotsCompleted) completed++;
      } else {
        const isCompleted = (habit.completedSlots || []).some(c => c.date === today);
        if (isCompleted) completed++;
      }
    });
    
    return { completed, total };
  };

  const habitsStats = calculateHabitsStats();

  // const handleLifeAreaClick = (area: LifeArea) => {
  //   if (onNavigateToHabits) {
  //     onNavigateToHabits(area.id);
  //   } else {
  //     //setSelectedLifeArea(area);
  //   }
  // };

  // const handleDialogClose = () => {
  // //  setSelectedLifeArea(null);
  //   // Refresh insights when dialog closes (user might have made changes)
  //  // setInsightsKey(prev => prev + 1);
  // };

  const adaptiveBackground = getAdaptiveBackground();

  return (
    <div
      className="min-h-screen bg-gradient-to-b pb-24 relative overflow-hidden transition-colors duration-1000"
      style={{
        background: `linear-gradient(to bottom, ${adaptiveBackground.gradientFrom}, ${adaptiveBackground.gradientTo})`,
      }}
    >
      {/* Ambient Particles */}

      <div className="p-4 md:p-6 pt-8 md:pt-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Adaptive Greeting */}
          <div className="mb-6">
            <AdaptiveGreeting />
          </div>

          {/* Time of Day Indicator */}
          <div className="mb-6">
            <TimeOfDayIndicator />
          </div>

          {/* Weather + Moon Widget - conditionally rendered */}
          {(config.widgets.weather || config.widgets.moon) && (
            <div className="mb-6">
              <WeatherMoonWidget />
            </div>
          )}

          {/* Daily Momentum Ring - conditionally rendered */}
          {config.widgets.momentum && (
            <div className="mb-6">
              <DailyMomentumRing />
            </div>
          )}

          {/* Mood Check-In Widget - Always show for daily check-in */}
          {config.widgets.todos && (
            <div className="mb-6">
            </div>
          )}

          {/* Top Status Cards - Only show if todos widget is enabled */}
          {config.widgets.todos && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Mood Card */}
              <div className="bg-white rounded-3xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Smile size={20} className="text-lavender-500" />
                  <h3 className="text-gray-700">Today's Mood</h3>
                </div>
                {/* <div className="flex items-center gap-3">
                  <div className="text-4xl">{getMoodEmoji(currentMood)}</div>
                  <div>
                    <div className="opacity-80">{getMoodLabel(currentMood)}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {currentMood ? 'Checked in today' : 'Check in to track'}
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Energy Card */}
              <div className="bg-white rounded-3xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Zap size={20} className="text-peach-500" />
                  <h3 className="text-gray-700">Energy Level</h3>
                </div>
                {/* <div className="flex items-center gap-4">
                  <div className="text-3xl">{energyLevel}%</div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyLevel}
                    onChange={(e) => handleEnergyChange(parseInt(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${energyLevel}%, #e5e7eb ${energyLevel}%, #e5e7eb 100%)`,
                    }}
                  />
                </div> */}
              </div>

              {/* Activity Card */}
              <div className="bg-white rounded-3xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Activity size={20} className="text-green-500" />
                  <h3 className="text-gray-700">Activity</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="opacity-60 text-xs mb-1">Habits</div>
                    <div className="opacity-90">
                      {habitsStats.total > 0 ? `${habitsStats.completed}/${habitsStats.total}` : 'None yet'}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-60 text-xs mb-1">Today</div>
                    <div className="opacity-90">
                      {habitsStats.completed > 0 ? `${habitsStats.completed} done ✨` : 'Start now'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Reflection Card - Only show if enabled via todos */}
          {config.widgets.todos && (
            <div className="mb-6">
              <QuickReflectionCard />
            </div>
          )}

          {/* Life Area Filters + Filtered Todos - Only show if todos widget is enabled */}
          {config.widgets.todos && (
            <div className="mb-6">
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                <h2 className="mb-4 flex items-center gap-2">
                  <CheckCircle2 size={24} className="text-lavender-600" />
                  Today's Tasks
                </h2>

                {/* <LifeAreaFilterChips 
                  selectedArea={selectedFilter}
                  onSelectArea={handleFilterChange}
                /> */}

                {/* Filtered Todos */}
                <div className="space-y-2">
                  {/* {filteredTodos.length > 0 ? (
                    filteredTodos.map(todo => (
                      <TodoCard
                        key={todo.id}
                        title={todo.title}
                        completed={todo.completed}
                        onToggle={() => handleTodoToggle(todo.id)}
                        lifeArea={todo.lifeArea}
                        lifeAreaEmoji={todo.lifeAreaEmoji}
                      />
                    ))
                  ) : ( */}
                    <div className="text-center py-8 opacity-60">
                      <p className="text-sm">
                        {/* {selectedFilter === 'all' 
                          ? 'No active habits yet. Visit the Habits tab to get started! 🌱'
                          : `No active habits in ${LIFE_AREAS.find(a => a.id === selectedFilter)?.label || 'this area'} yet.`
                        } */}
                      </p>
                    </div>
                  {/* )} */}
                </div>
              </div>
            </div>
          )}

          {/* Weekly Summary */}
          {config.widgets.weeklySummary && (
            <div className="mb-6">
              <WeeklySummaryCard 
                onViewDetails={() => onNavigate?.('weekly-insights')}
              />
            </div>
          )}

          {/* Coaching Nudge - Only show if user wants guidance */}
          {config.widgets.habits && (
            <div className="mb-6">
            </div>
          )}

          {/* AI Insights Engine */}
          {/* {config.widgets.aiInsights && (
            // <div className="mb-6">
            //   <AIInsightsEngine key={insightsKey} />
            // </div>
          )} */}

          {/* Adaptive Recommendations Widget - Only show if user wants suggestions */}
          {config.widgets.habits && (
            <div className="mb-6">
              <AdaptiveRecommendationsWidget />
            </div>
          )}

          {/* Growth Map Quick Link - Only show if habits or life areas enabled */}
          {onNavigate && config.widgets.habits && (
            <div className="mb-6">
              <button
                onClick={() => onNavigate('growth-map')}
                className="w-full bg-gradient-to-br from-lavender-50 to-peach-50 rounded-3xl p-6 shadow-sm border-2 border-lavender-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      <Flower2 size={28} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lavender-700 mb-1">Explore Your Growth Map</h3>
                      <p className="text-sm opacity-70">See your progress across all life areas</p>
                    </div>
                  </div>
                  <TrendingUp size={24} className="text-lavender-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </div>
          )}

          {/* Coaching Check-In Status - Only show if habits enabled */}
          {config.widgets.habits && (
            <div className="mb-6">
              <CoachingCheckInStatus />
            </div>
          )}

          {/* Focus Area Selector - Only show if habits enabled */}
          {/* {config.widgets.habits && (
            <div className="mb-6">
              <FocusAreaSelector selectedArea={focusArea} onSelect={handleFocusAreaSelect} />
            </div>
          )} */}

          {/* Encouragement Message - Only show if habits enabled */}
          {config.widgets.habits && (
            <div className="mb-6">
              <EncouragementMessage />
            </div>
          )}

          {/* Health Widgets */}
          {config.widgets.healthStats && (
            <div className="mb-6">
              <h2 className="mb-4 text-gray-700">Health Snapshot</h2>
              <div className="grid grid-cols-3 gap-4">
                <HealthWidget
                  icon={<Moon size={20} />}
                  label="Sleep"
                  value="7.5h"
                  color="bg-blue-50"
                />
                <HealthWidget
                  icon={<Footprints size={20} />}
                  label="Steps"
                  value="3,421"
                  color="bg-peach-50"
                />
                <HealthWidget
                  icon={<Heart size={20} />}
                  label="Heart"
                  value="68 bpm"
                  color="bg-pink-50"
                />
              </div>
            </div>
          )}

          {/* Life Areas Grid - Only show if habits enabled */}
          {config.widgets.habits && (
            <div className="mb-6">
              <h2 className="mb-4 text-gray-700">Life Areas</h2>
              <p className="text-sm opacity-60 mb-4">Click a life area to view and manage habits</p>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lifeAreas.map((area) => (
                  <LifeAreaCard
                    key={area.id}
                    icon={area.icon}
                    title={area.title}
                    progress={area.progress}
                    currentHabits={area.currentHabits}
                    suggestion={area.suggestion}
                    color={area.color}
                    onClick={() => handleLifeAreaClick(area)}
                  />
                ))}
              </div> */}
            </div>
          )}

          {/* Empty State - Show if no widgets are selected */}
          {!config.widgets.momentum && 
           !config.widgets.weeklySummary && 
           !config.widgets.habits && 
           !config.widgets.todos && 
           !config.widgets.aiInsights && 
           !config.widgets.healthStats && 
           !config.widgets.weather && 
           !config.widgets.moon && (
            <div className="mb-6">
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 text-center">
                <div className="mb-4 text-4xl">🌱</div>
                <h3 className="mb-2">Your Dashboard is Empty</h3>
                <p className="text-sm opacity-70 mb-6">
                  Add widgets to personalize your dashboard experience
                </p>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('settings')}
                    className="px-6 py-3 rounded-2xl text-white shadow-md hover:shadow-lg transition-all"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    Customize Dashboard
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Life Area Dialog */}
      {/* {selectedLifeArea && (
        <LifeAreaDialog
          isOpen={!!selectedLifeArea}
          onClose={handleDialogClose}
          lifeArea={selectedLifeArea}
        />
      )} */}
    </div>
  );
}