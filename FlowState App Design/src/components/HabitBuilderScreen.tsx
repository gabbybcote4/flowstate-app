import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Plus, Sparkles, Calendar, Target, Bell, Heart, CheckCircle2, X, Edit2, Check, TrendingUp, Award, Lightbulb, Eye, EyeOff, Settings, Trash2, Star, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { HabitCompletionStats } from './HabitCompletionStats';
import { AISuggestionsWidget } from './AISuggestionsWidget';
import { GoalToHabitWizard } from './GoalToHabitWizard';
import { HabitStackingScreen } from './HabitStackingScreen';

interface TimeSlot {
  id: string;
  time: 'morning' | 'afternoon' | 'evening' | 'night';
  label: string;
}

interface Habit {
  id: string;
  name: string;
  purpose: string;
  frequency: 'daily' | 'multiple-daily' | 'weekdays' | '3x-week' | 'weekly' | 'as-needed';
  timeSlots?: TimeSlot[]; // For multiple-daily habits
  trigger: string;
  motivation: string;
  lifeArea: string;
  streak: number;
  completedSlots: { date: string; slotId?: string }[]; // Track which slots were completed
  isActive: boolean;
}

interface HabitTemplate {
  name: string;
  purpose: string;
  frequency: 'daily' | 'multiple-daily' | 'weekdays' | '3x-week' | 'weekly' | 'as-needed';
  timeSlots?: TimeSlot[];
  trigger: string;
  motivation: string;
  lifeArea: string;
  energyLevel?: 'low' | 'medium' | 'high';
  id: string;
}

const LIFE_AREAS = ['All', 'Health', 'Work', 'Relationships', 'Personal Growth', 'Creativity', 'Home'];

const TIME_SLOT_OPTIONS: TimeSlot[] = [
  { id: '1', time: 'morning', label: 'Morning' },
  { id: '2', time: 'afternoon', label: 'Afternoon' },
  { id: '3', time: 'evening', label: 'Evening' },
  { id: '4', time: 'night', label: 'Night' },
];

const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health - High Energy
  { id: '1', name: 'Morning Run', purpose: 'Build cardiovascular health and start the day energized', frequency: 'daily', trigger: 'As soon as I wake up', motivation: 'I want to feel strong and energetic all day', lifeArea: 'Health', energyLevel: 'high' },
  { id: '2', name: 'Gym Workout', purpose: 'Build strength and maintain physical fitness', frequency: '3x-week', trigger: 'After work on Mon/Wed/Fri', motivation: 'I want to feel confident in my body', lifeArea: 'Health', energyLevel: 'high' },
  { id: '3', name: 'Hydration Check', purpose: 'Stay properly hydrated throughout the day', frequency: 'multiple-daily', timeSlots: [{ id: '1', time: 'morning', label: 'Morning' }, { id: '2', time: 'afternoon', label: 'Afternoon' }, { id: '3', time: 'evening', label: 'Evening' }], trigger: 'Set phone reminders', motivation: 'I want clear skin and better energy', lifeArea: 'Health', energyLevel: 'low' },
  
  // Health - Medium Energy
  { id: '4', name: 'Take Vitamins', purpose: 'Support overall health with daily nutrients', frequency: 'daily', trigger: 'With breakfast every morning', motivation: 'I want to support my immune system', lifeArea: 'Health', energyLevel: 'medium' },
  { id: '5', name: 'Evening Walk', purpose: 'Light exercise and stress relief', frequency: 'daily', trigger: 'After dinner', motivation: 'I want to clear my mind and digest well', lifeArea: 'Health', energyLevel: 'medium' },
  { id: '6', name: 'Stretch Routine', purpose: 'Maintain flexibility and reduce tension', frequency: 'daily', trigger: 'Before bed', motivation: 'I want to sleep better and reduce back pain', lifeArea: 'Health', energyLevel: 'medium' },
  
  // Health - Low Energy
  { id: '7', name: 'Deep Breathing', purpose: 'Reduce stress and anxiety', frequency: 'multiple-daily', timeSlots: [{ id: '1', time: 'morning', label: 'Morning' }, { id: '3', time: 'evening', label: 'Evening' }], trigger: 'When feeling overwhelmed', motivation: 'I want to feel calm and centered', lifeArea: 'Health', energyLevel: 'low' },
  { id: '8', name: 'Mindful Tea Break', purpose: 'Take a mindful pause in the day', frequency: 'daily', trigger: 'At 3pm with herbal tea', motivation: 'I want to be more present and less reactive', lifeArea: 'Health', energyLevel: 'low' },
  
  // Work - High Energy
  { id: '9', name: 'Daily Planning', purpose: 'Set clear priorities and goals for the day', frequency: 'daily', trigger: 'First thing when I sit at my desk', motivation: 'I want to be productive and focused', lifeArea: 'Work', energyLevel: 'high' },
  { id: '10', name: 'Skill Building', purpose: 'Continuously improve professional abilities', frequency: '3x-week', trigger: 'During lunch break on Tue/Thu/Fri', motivation: 'I want to advance my career', lifeArea: 'Work', energyLevel: 'high' },
  
  // Work - Medium Energy
  { id: '11', name: 'Inbox Zero', purpose: 'Keep email organized and manageable', frequency: 'daily', trigger: 'End of workday', motivation: 'I want to feel in control and not overwhelmed', lifeArea: 'Work', energyLevel: 'medium' },
  { id: '12', name: 'Weekly Review', purpose: 'Reflect on accomplishments and plan ahead', frequency: 'weekly', trigger: 'Friday afternoon', motivation: 'I want to continuously improve and grow', lifeArea: 'Work', energyLevel: 'medium' },
  
  // Work - Low Energy
  { id: '13', name: 'Desk Tidy', purpose: 'Maintain an organized workspace', frequency: 'daily', trigger: 'Before leaving work', motivation: 'I want to start each day fresh and organized', lifeArea: 'Work', energyLevel: 'low' },
  
  // Relationships - Medium Energy
  { id: '14', name: 'Check in with Family', purpose: 'Maintain close family connections', frequency: 'daily', trigger: 'During evening call time', motivation: 'I want to be a caring family member', lifeArea: 'Relationships', energyLevel: 'medium' },
  { id: '15', name: 'Text a Friend', purpose: 'Nurture friendships with regular contact', frequency: '3x-week', trigger: 'During commute home', motivation: 'I want to be a good friend and feel connected', lifeArea: 'Relationships', energyLevel: 'medium' },
  
  // Relationships - Low Energy
  { id: '16', name: 'Gratitude for Partner', purpose: 'Express appreciation and love', frequency: 'daily', trigger: 'Before saying goodnight', motivation: 'I want a strong, loving relationship', lifeArea: 'Relationships', energyLevel: 'low' },
  
  // Personal Growth - High Energy
  { id: '17', name: 'Morning Reading', purpose: 'Learn something new every day', frequency: 'daily', trigger: 'With morning coffee', motivation: 'I want to keep growing and learning', lifeArea: 'Personal Growth', energyLevel: 'high' },
  { id: '18', name: 'Language Practice', purpose: 'Build fluency in a new language', frequency: 'daily', trigger: 'During lunch break', motivation: 'I want to connect with other cultures', lifeArea: 'Personal Growth', energyLevel: 'high' },
  
  // Personal Growth - Medium Energy
  { id: '19', name: 'Journal Writing', purpose: 'Process thoughts and emotions', frequency: 'daily', trigger: 'Right before bed', motivation: 'I want to understand myself better', lifeArea: 'Personal Growth', energyLevel: 'medium' },
  { id: '20', name: 'Meditation', purpose: 'Develop mindfulness and inner peace', frequency: 'daily', trigger: 'First thing in the morning', motivation: 'I want to be more calm and present', lifeArea: 'Personal Growth', energyLevel: 'medium' },
  
  // Personal Growth - Low Energy
  { id: '21', name: 'Positive Affirmation', purpose: 'Build self-confidence and positivity', frequency: 'daily', trigger: 'Looking in the mirror each morning', motivation: 'I want to love and believe in myself', lifeArea: 'Personal Growth', energyLevel: 'low' },
  
  // Creativity - High Energy
  { id: '22', name: 'Creative Writing', purpose: 'Express creativity and imagination', frequency: '3x-week', trigger: 'Saturday morning with coffee', motivation: 'I want to tell stories and express myself', lifeArea: 'Creativity', energyLevel: 'high' },
  { id: '23', name: 'Art Practice', purpose: 'Develop artistic skills and creativity', frequency: '3x-week', trigger: 'Sunday afternoon', motivation: 'I want to create beautiful things', lifeArea: 'Creativity', energyLevel: 'high' },
  
  // Creativity - Medium Energy
  { id: '24', name: 'Photography Walk', purpose: 'Practice photography and see beauty around me', frequency: 'weekly', trigger: 'Saturday morning', motivation: 'I want to capture and share beautiful moments', lifeArea: 'Creativity', energyLevel: 'medium' },
  
  // Creativity - Low Energy
  { id: '25', name: 'Inspiration Collection', purpose: 'Gather ideas and creative inspiration', frequency: 'daily', trigger: 'During evening wind-down', motivation: 'I want to stay inspired and creative', lifeArea: 'Creativity', energyLevel: 'low' },
  
  // Home - Medium Energy
  { id: '26', name: 'Kitchen Clean-up', purpose: 'Maintain a clean and functional kitchen', frequency: 'daily', trigger: 'After dinner', motivation: 'I want a peaceful and organized home', lifeArea: 'Home', energyLevel: 'medium' },
  { id: '27', name: 'Laundry Day', purpose: 'Keep clothes clean and organized', frequency: 'weekly', trigger: 'Sunday morning', motivation: 'I want to always have clean clothes ready', lifeArea: 'Home', energyLevel: 'medium' },
  
  // Home - Low Energy
  { id: '28', name: 'Make Bed', purpose: 'Start the day with accomplishment and order', frequency: 'daily', trigger: 'As soon as I get up', motivation: 'I want my bedroom to feel peaceful', lifeArea: 'Home', energyLevel: 'low' },
  { id: '29', name: '5-Minute Tidy', purpose: 'Maintain cleanliness without overwhelm', frequency: 'daily', trigger: 'Before sitting down to relax', motivation: 'I want to feel calm in my space', lifeArea: 'Home', energyLevel: 'low' },
];

interface HabitBuilderScreenProps {
  initialSelectedArea?: string;
}

// Calculate consistency score (0-100) based on completion rate over last 30 days
function calculateConsistencyScore(habit: Habit): number {
  const daysToCheck = 30;
  const completedDates = new Set(
    (habit.completedSlots || []).map(slot => slot.date)
  );
  
  // For habits that require multiple completions per day
  if (habit.frequency === 'multiple-daily' && habit.timeSlots) {
    let totalRequired = 0;
    let totalCompleted = 0;
    
    for (let i = 0; i < daysToCheck; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      totalRequired += habit.timeSlots.length;
      const completedSlots = (habit.completedSlots || []).filter(
        slot => slot.date === dateStr
      ).length;
      totalCompleted += completedSlots;
    }
    
    return totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
  }
  
  // For daily habits
  if (habit.frequency === 'daily') {
    const last30Days = Array.from({ length: daysToCheck }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });
    
    const completedCount = last30Days.filter(date => completedDates.has(date)).length;
    return Math.round((completedCount / daysToCheck) * 100);
  }
  
  // For weekly and 3x-week habits
  if (habit.frequency === 'weekly') {
    const weeksToCheck = 4;
    const completedInPeriod = Array.from({ length: daysToCheck }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).filter(date => completedDates.has(date)).length;
    
    const expectedCompletions = weeksToCheck;
    return Math.round((completedInPeriod / expectedCompletions) * 100);
  }
  
  if (habit.frequency === '3x-week') {
    const weeksToCheck = 4;
    const completedInPeriod = Array.from({ length: daysToCheck }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).filter(date => completedDates.has(date)).length;
    
    const expectedCompletions = weeksToCheck * 3;
    return Math.round((completedInPeriod / expectedCompletions) * 100);
  }
  
  return 0;
}

// Get AI encouragement message based on consistency
function getEncouragementMessage(consistency: number, daysCompleted: number): string {
  if (consistency === 0 && daysCompleted === 0) {
    return "Ready to start? Every journey begins with a single step 🌱";
  }
  
  if (consistency < 20) {
    return `You showed up ${daysCompleted} ${daysCompleted === 1 ? 'day' : 'days'} — every attempt matters! 💜`;
  }
  
  if (consistency < 40) {
    return `${consistency}% consistency — you're building momentum! Keep going 🌟`;
  }
  
  if (consistency < 60) {
    return `${consistency}% consistency — you're creating real change! So proud 🌸`;
  }
  
  if (consistency < 80) {
    return `${consistency}% consistency — this is becoming part of you! 🌺`;
  }
  
  return `${consistency}% consistency — you're absolutely crushing it! 🎉`;
}

// Constellation visualization component
function ConstellationVisualization({ consistency, size = 80 }: { consistency: number; size?: number }) {
  const stars = Math.min(Math.floor(consistency / 10), 10);
  
  return (
    <div 
      className="relative" 
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#f3e8ff"
          strokeWidth="2"
        />
        
        {/* Stars arranged in a circular pattern */}
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 - 90) * (Math.PI / 180); // Start from top
          const radius = 35;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const isFilled = i < stars;
          
          return (
            <motion.g
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <circle
                cx={x}
                cy={y}
                r={isFilled ? 5 : 3}
                fill={isFilled ? '#a78bfa' : '#e9d5ff'}
                className="transition-all duration-300"
              />
              {isFilled && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={5}
                  fill="#a78bfa"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  opacity={0.5}
                />
              )}
            </motion.g>
          );
        })}
        
        {/* Connecting lines between filled stars */}
        {stars > 1 && Array.from({ length: stars - 1 }).map((_, i) => {
          const angle1 = (i * 36 - 90) * (Math.PI / 180);
          const angle2 = ((i + 1) * 36 - 90) * (Math.PI / 180);
          const radius = 35;
          const x1 = 50 + radius * Math.cos(angle1);
          const y1 = 50 + radius * Math.sin(angle1);
          const x2 = 50 + radius * Math.cos(angle2);
          const y2 = 50 + radius * Math.sin(angle2);
          
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#c4b5fd"
              strokeWidth="1"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// Momentum ring component
function MomentumRing({ 
  percentage, 
  size = 60, 
  strokeWidth = 4,
  children 
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3e8ff"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#a78bfa"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function HabitBuilderScreen({ initialSelectedArea }: HabitBuilderScreenProps = {}) {
  const { themeColors } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>(initialSelectedArea || 'All');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedEnergyLevel, setSelectedEnergyLevel] = useState<string>('All');
  const [templateFilter, setTemplateFilter] = useState<string>('All');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showGoalWizard, setShowGoalWizard] = useState(false);
  const [currentTab, setCurrentTab] = useState<'habits' | 'stacking'>('habits');

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('flowstate-habits');
    if (savedHabits) {
      const habits = JSON.parse(savedHabits);
      // Migrate any "Self Care" habits to "Health" and ensure completedSlots exists
      const migratedHabits = habits.map((habit: Habit) => ({
        ...habit,
        lifeArea: habit.lifeArea === 'Self Care' ? 'Health' : habit.lifeArea,
        completedSlots: habit.completedSlots || [],
        completedDates: undefined, // Remove old completedDates property if it exists
      }));
      setHabits(migratedHabits);
      // Save migrated data back
      if (JSON.stringify(habits) !== JSON.stringify(migratedHabits)) {
        localStorage.setItem('flowstate-habits', JSON.stringify(migratedHabits));
      }
    }

    const savedHideCompleted = localStorage.getItem('flowstate-habits-hide-completed');
    if (savedHideCompleted) {
      setHideCompleted(JSON.parse(savedHideCompleted));
    }
  }, []);

  // Update selected area when initialSelectedArea changes
  useEffect(() => {
    if (initialSelectedArea) {
      setSelectedArea(initialSelectedArea);
    }
  }, [initialSelectedArea]);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('flowstate-habits', JSON.stringify(habits));
  }, [habits]);

  const filteredHabits = habits.filter(habit => 
    selectedArea === 'All' || habit.lifeArea === selectedArea
  );

  const availableTemplates = HABIT_TEMPLATES.filter(template => {
    const energyMatch = selectedEnergyLevel === 'All' || template.energyLevel === selectedEnergyLevel.toLowerCase();
    const areaMatch = templateFilter === 'All' || template.lifeArea === templateFilter;
    return energyMatch && areaMatch;
  });

  const filteredTemplates = availableTemplates.filter(template => 
    templateFilter === 'All' || template.lifeArea === templateFilter
  );

  const addHabit = (template: HabitTemplate) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: template.name,
      purpose: template.purpose,
      frequency: template.frequency,
      timeSlots: template.timeSlots,
      trigger: template.trigger,
      motivation: template.motivation,
      lifeArea: template.lifeArea,
      streak: 0,
      completedSlots: [],
      isActive: true,
    };

    setHabits(prev => [...prev, newHabit]);
    setShowTemplates(false);
    toast.success('Habit added! Start your journey 🌟');
  };

  const handleAISuggestion = (habitName: string, habitPurpose: string) => {
    // Create a simple habit from AI suggestion
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      purpose: habitPurpose,
      frequency: 'daily',
      trigger: 'When I feel like it',
      motivation: 'To improve my wellbeing',
      lifeArea: 'Health',
      streak: 0,
      completedSlots: [],
      isActive: true,
    };

    setHabits(prev => [...prev, newHabit]);
    toast.success('AI suggestion added to your habits! 🌟');
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prev => prev.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    toast.success('Habit updated successfully');
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    toast.success('Habit removed');
  };

  const handleWizardComplete = (newHabit: Habit) => {
    setHabits(prev => [...prev, newHabit]);
    setShowGoalWizard(false);
    // Switch to the habit's life area
    if (newHabit.lifeArea && newHabit.lifeArea !== 'All') {
      setSelectedArea(newHabit.lifeArea);
    }
  };

  const toggleHabitComplete = (habitId: string, slotId?: string) => {
    const today = new Date().toDateString();
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const updatedHabit = { ...habit };
      // Ensure completedSlots exists
      if (!updatedHabit.completedSlots) {
        updatedHabit.completedSlots = [];
      }
      
      const existingIndex = updatedHabit.completedSlots.findIndex(slot => 
        slot.date === today && (slotId ? slot.slotId === slotId : !slot.slotId)
      );
      
      if (existingIndex >= 0) {
        // Remove completion
        updatedHabit.completedSlots.splice(existingIndex, 1);
      } else {
        // Add completion
        updatedHabit.completedSlots.push({ 
          date: today, 
          ...(slotId && { slotId }) 
        });
      }
      
      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      const isCompletedToday = habit.frequency === 'multiple-daily' && habit.timeSlots
        ? habit.timeSlots.every(slot =>
            updatedHabit.completedSlots.some(c => c.date === today && c.slotId === slot.id)
          )
        : updatedHabit.completedSlots.some(c => c.date === today);
      
      const wasCompletedYesterday = habit.frequency === 'multiple-daily' && habit.timeSlots
        ? habit.timeSlots.every(slot =>
            updatedHabit.completedSlots.some(c => c.date === yesterdayStr && c.slotId === slot.id)
          )
        : updatedHabit.completedSlots.some(c => c.date === yesterdayStr);
      
      if (isCompletedToday) {
        updatedHabit.streak = wasCompletedYesterday ? habit.streak + 1 : 1;
      } else {
        updatedHabit.streak = 0;
      }
      
      return updatedHabit;
    }));
  };

  function getFrequencyLabel(frequency: string): string {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'multiple-daily': return 'Multiple/day';
      case 'weekly': return 'Weekly';
      default: return frequency;
    }
  }

  // If on stacking tab, render the HabitStackingScreen
  if (currentTab === 'stacking') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: `${themeColors.background}` }}>
        {/* Tab Navigation */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex gap-1 py-3">
              <button
                onClick={() => setCurrentTab('habits')}
                className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                }}
              >
                <Target size={18} />
                My Habits
              </button>
              <button
                onClick={() => setCurrentTab('stacking')}
                className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: themeColors.primary,
                  color: 'white',
                }}
              >
                <Link2 size={18} />
                Habit Stacking
              </button>
            </div>
          </div>
        </div>
        
        <HabitStackingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: `${themeColors.background}` }}>
      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 py-3">
            <button
              onClick={() => setCurrentTab('habits')}
              className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: themeColors.primary,
                color: 'white',
              }}
            >
              <Target size={18} />
              My Habits
            </button>
            <button
              onClick={() => setCurrentTab('stacking')}
              className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                color: '#6B7280',
              }}
            >
              <Link2 size={18} />
              Habit Stacking
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="mb-1">Habit Garden</h2>
                <p className="text-sm opacity-70">{habits.length} habits growing</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Goal Wizard Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGoalWizard(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm shadow-md transition-all"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: 'white',
                  }}
                >
                  <Target size={16} />
                  <span className="hidden sm:inline">Start from Goal</span>
                  <span className="sm:hidden">Goal</span>
                </motion.button>
                {/* Hide/Show Completed Toggle - Top Right */}
                {habits.length > 0 && (
                <button
                  onClick={() => {
                    const newValue = !hideCompleted;
                    setHideCompleted(newValue);
                    localStorage.setItem('flowstate-habits-hide-completed', JSON.stringify(newValue));
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:shadow-md"
                  style={{
                    backgroundColor: hideCompleted ? themeColors.primary : 'white',
                    color: hideCompleted ? 'white' : themeColors.primary,
                    border: `1px solid ${hideCompleted ? themeColors.primary : '#e5e7eb'}`,
                  }}
                >
                  {hideCompleted ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{hideCompleted ? 'Show' : 'Hide'} completed</span>
                </button>
              )}
              </div>
            </div>
          </div>

          {/* Completion Stats - Always Visible */}
          {habits.length > 0 && (
            <div className="mb-5">
              <HabitCompletionStats habits={habits} />
            </div>
          )}

          {/* Floating Add Button - Bottom Right */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTemplates(true)}
            className="fixed bottom-24 right-6 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center z-30"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Plus size={28} strokeWidth={2.5} />
          </motion.button>

          {/* Life Area Filter - Compact */}
          <div className="mb-4 -mx-4 md:-mx-6">
            <div className="overflow-x-auto px-4 md:px-6 pb-2 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {LIFE_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedArea === area
                        ? 'text-white shadow-md'
                        : 'bg-white/50 hover:bg-white'
                    }`}
                    style={
                      selectedArea === area
                        ? { backgroundColor: themeColors.primary }
                        : undefined
                    }
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {habits.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <Target size={48} className="mx-auto mb-3 text-gray-300" />
              <h3 className="mb-2">Plant Your First Habit</h3>
              <p className="text-sm mb-6 opacity-70">
                Turn your goals into achievable habits, or choose from 100+ templates
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowGoalWizard(true)}
                  className="px-6 py-3 rounded-xl text-white shadow-lg inline-flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <Target size={18} />
                  Start from Goal
                </button>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all inline-flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Browse Templates
                </button>
              </div>
            </motion.div>
          )}

          {/* Habit List - Redesigned with Momentum Rings */}
          <div className="space-y-4">
            {filteredHabits
              .filter((habit) => {
                if (!hideCompleted) return true;
                // Hide completed habits when hideCompleted is true
                const today = new Date().toDateString();
                const isCompleted = habit.frequency === 'multiple-daily' && habit.timeSlots
                  ? habit.timeSlots.every(slot =>
                      (habit.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
                    )
                  : (habit.completedSlots || []).some(c => c.date === today);
                return !isCompleted;
              })
              .sort((a, b) => {
                // Sort completed habits to bottom
                const today = new Date().toDateString();
                const aCompleted = a.frequency === 'multiple-daily' && a.timeSlots
                  ? a.timeSlots.every(slot =>
                      (a.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
                    )
                  : (a.completedSlots || []).some(c => c.date === today);
                
                const bCompleted = b.frequency === 'multiple-daily' && b.timeSlots
                  ? b.timeSlots.every(slot =>
                      (b.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
                    )
                  : (b.completedSlots || []).some(c => c.date === today);
                
                if (aCompleted === bCompleted) return 0;
                return aCompleted ? 1 : -1;
              })
              .map((habit) => {
              const today = new Date().toDateString();
              const consistency = calculateConsistencyScore(habit);
              const daysCompleted = new Set(
                (habit.completedSlots || []).map(slot => slot.date)
              ).size;
              const encouragement = getEncouragementMessage(consistency, daysCompleted);
              
              // For multiple-daily habits, check each slot
              const completionStatus = habit.frequency === 'multiple-daily' && habit.timeSlots
                ? habit.timeSlots.map(slot => ({
                    slot,
                    completed: (habit.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
                  }))
                : null;
              
              const isCompletedToday = completionStatus
                ? completionStatus.every(s => s.completed)
                : (habit.completedSlots || []).some(c => c.date === today);
              
              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-lg p-6 group hover:shadow-xl transition-all"
                >
                  <div className="flex gap-6">
                    {/* Left: Constellation Visualization */}
                    <div className="flex-shrink-0">
                      <ConstellationVisualization consistency={consistency} size={100} />
                    </div>

                    {/* Middle: Habit info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="mb-1">{habit.name}</h3>
                          <p className="text-sm mb-3" style={{ color: themeColors.primary }}>
                            {habit.purpose}
                          </p>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => {
                              setEditingHabit(habit);
                              setShowTemplates(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit habit"
                          >
                            <Settings size={16} className="opacity-50" />
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                            title="Delete habit"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Consistency Score */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="px-3 py-1.5 rounded-full text-sm"
                            style={{ 
                              backgroundColor: `${themeColors.primary}15`,
                              color: themeColors.primary 
                            }}
                          >
                            {consistency}% consistency
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-60">
                          <Calendar size={12} />
                          <span>{getFrequencyLabel(habit.frequency)}</span>
                        </div>
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${themeColors.primary}10`,
                            color: themeColors.primary 
                          }}
                        >
                          {habit.lifeArea}
                        </span>
                      </div>

                      {/* AI Encouragement */}
                      <div 
                        className="px-4 py-2.5 rounded-xl text-sm flex items-start gap-2"
                        style={{ backgroundColor: '#fef3f2' }}
                      >
                        <Sparkles size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#f97066' }} />
                        <span className="opacity-80">{encouragement}</span>
                      </div>
                    </div>

                    {/* Right: Completion button with Momentum Ring */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      {completionStatus ? (
                        // Multiple slots
                        <div className="flex flex-col gap-2">
                          {completionStatus.map(({ slot, completed }) => (
                            <button
                              key={slot.id}
                              onClick={() => toggleHabitComplete(habit.id, slot.id)}
                              className="relative"
                            >
                              <MomentumRing percentage={completed ? 100 : 0} size={56} strokeWidth={4}>
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs transition-all ${
                                    completed
                                      ? 'bg-green-500 text-white'
                                      : 'border-2'
                                  }`}
                                  style={
                                    !completed
                                      ? { borderColor: themeColors.primary, color: themeColors.primary }
                                      : undefined
                                  }
                                >
                                  {completed ? <Check size={16} /> : slot.label[0]}
                                </div>
                              </MomentumRing>
                            </button>
                          ))}
                        </div>
                      ) : (
                        // Single completion
                        <button
                          onClick={() => toggleHabitComplete(habit.id)}
                          className="relative"
                        >
                          <MomentumRing percentage={isCompletedToday ? 100 : 0} size={72} strokeWidth={5}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                isCompletedToday
                                  ? 'bg-green-500 text-white'
                                  : 'border-2'
                              }`}
                              style={
                                !isCompletedToday
                                  ? { borderColor: themeColors.primary, color: themeColors.primary }
                                  : undefined
                              }
                            >
                              {isCompletedToday ? (
                                <Check size={24} strokeWidth={3} />
                              ) : (
                                <CheckCircle2 size={28} />
                              )}
                            </motion.div>
                          </MomentumRing>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Template Library Modal */}
          {showTemplates && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2>{editingHabit ? 'Edit Habit' : 'Habit Templates'}</h2>
                    <p className="text-sm opacity-70 mt-1">
                      {editingHabit ? 'Customize your habit' : 'Choose a template or create your own'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTemplates(false);
                      setEditingHabit(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                  {editingHabit ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Habit Name</label>
                        <input
                          type="text"
                          value={editingHabit.name}
                          onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                          style={{ '--tw-ring-color': themeColors.primary } as any}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">Purpose / Why it matters</label>
                        <textarea
                          value={editingHabit.purpose}
                          onChange={(e) => setEditingHabit({ ...editingHabit, purpose: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 resize-none"
                          style={{ '--tw-ring-color': themeColors.primary } as any}
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Life Area</label>
                        <div className="grid grid-cols-2 gap-2">
                          {LIFE_AREAS.filter(a => a !== 'All').map((area) => (
                            <button
                              key={area}
                              onClick={() => setEditingHabit({ ...editingHabit, lifeArea: area })}
                              className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                                editingHabit.lifeArea === area
                                  ? 'text-white shadow-md'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              style={
                                editingHabit.lifeArea === area
                                  ? { backgroundColor: themeColors.primary }
                                  : undefined
                              }
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Frequency</label>
                        <div className="space-y-2">
                          {[
                            { value: 'daily' as const, label: 'Daily' },
                            { value: 'multiple-daily' as const, label: 'Multiple times per day' },
                            { value: 'weekly' as const, label: 'Weekly' },
                          ].map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => {
                                const updated = { ...editingHabit, frequency: value };
                                if (value === 'multiple-daily' && !updated.timeSlots) {
                                  updated.timeSlots = [
                                    { id: '1', label: 'Morning', time: 'morning' },
                                    { id: '2', label: 'Evening', time: 'evening' },
                                  ];
                                }
                                setEditingHabit(updated);
                              }}
                              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all text-left ${
                                editingHabit.frequency === value
                                  ? 'text-white shadow-md'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              style={
                                editingHabit.frequency === value
                                  ? { backgroundColor: themeColors.primary }
                                  : undefined
                              }
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {editingHabit.frequency === 'multiple-daily' && (
                        <div>
                          <label className="block text-sm mb-2">Time Slots</label>
                          <div className="space-y-2">
                            {editingHabit.timeSlots?.map((slot, index) => (
                              <div key={slot.id} className="flex gap-2">
                                <input
                                  type="text"
                                  value={slot.label}
                                  onChange={(e) => {
                                    const updated = { ...editingHabit };
                                    if (updated.timeSlots) {
                                      updated.timeSlots[index].label = e.target.value;
                                      setEditingHabit(updated);
                                    }
                                  }}
                                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
                                  style={{ '--tw-ring-color': themeColors.primary } as any}
                                  placeholder="Label (e.g., Morning)"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            updateHabit(editingHabit);
                            setShowTemplates(false);
                            setEditingHabit(null);
                          }}
                          className="flex-1 px-6 py-3 rounded-xl text-white shadow-lg"
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setShowTemplates(false);
                            setEditingHabit(null);
                          }}
                          className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Template Selection Mode
                    <div className="space-y-6">
                      {/* Energy Level Tabs */}
                      <div className="flex gap-2 border-b border-gray-200">
                        {['All', 'High', 'Medium', 'Low'].map((level) => (
                          <button
                            key={level}
                            onClick={() => setSelectedEnergyLevel(level)}
                            className={`px-4 py-2 transition-all ${
                              selectedEnergyLevel === level
                                ? 'border-b-2 -mb-px'
                                : 'opacity-50 hover:opacity-75'
                            }`}
                            style={
                              selectedEnergyLevel === level
                                ? { borderColor: themeColors.primary, color: themeColors.primary }
                                : undefined
                            }
                          >
                            {level} Energy
                          </button>
                        ))}
                      </div>

                      {/* Life Area Filter */}
                      <div className="-mx-6">
                        <div className="overflow-x-auto px-6 pb-2 scrollbar-hide">
                          <div className="flex gap-2 min-w-max">
                            {LIFE_AREAS.map((area) => (
                              <button
                                key={area}
                                onClick={() => setTemplateFilter(area)}
                                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                                  templateFilter === area
                                    ? 'text-white shadow-md'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                style={
                                  templateFilter === area
                                    ? { backgroundColor: themeColors.primary }
                                    : undefined
                                }
                              >
                                {area}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Templates Grid */}
                      <div className="grid gap-3">
                        {filteredTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => addHabit(template)}
                            className="text-left p-4 rounded-xl border-2 border-gray-200 hover:border-lavender-300 transition-all hover:shadow-md group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4>{template.name}</h4>
                              <div className="px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-700 text-xs">
                                {template.lifeArea}
                              </div>
                            </div>
                            <p className="text-xs opacity-60 mb-2">{template.purpose}</p>
                            <div className="flex items-center gap-2 text-xs opacity-50">
                              <Calendar size={12} />
                              <span>{getFrequencyLabel(template.frequency)}</span>
                              {template.energyLevel && (
                                <>
                                  <span>•</span>
                                  <span>{template.energyLevel} energy</span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions Widget - Bottom Left - Hidden when modal is open */}
      {!showTemplates && (
        <AISuggestionsWidget position="bottom-left" onAddHabit={handleAISuggestion} />
      )}

      {/* Goal to Habit Wizard */}
      {showGoalWizard && (
        <GoalToHabitWizard
          onComplete={handleWizardComplete}
          onClose={() => setShowGoalWizard(false)}
        />
      )}
    </div>
  );
}
