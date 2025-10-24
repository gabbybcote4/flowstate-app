import { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, TrendingUp, ClipboardList, Lightbulb, BookOpen, Compass, Bot } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'sonner';
// import { DisciplineBuilderScreen } from './screens/DisciplineBuilderScreen';
// import { HabitEducationScreen } from './screens/HabitEducationScreen';
// import { HabitLearningJourney } from '../components/journey/HabitLearningJourney';
// import { LifeAreaCoachingScreen } from './LifeAreaCoachingScreen';
// import { AIMentorMode } from '../components/mode/AIMentorMode';

interface CheckInData {
  mood: number;
  energy: number;
  focus: number;
  timestamp: string;
}

interface CoachingScreenProps {
  onNavigate: (screen: string) => void;
}

export function CoachingScreen({ onNavigate }: CoachingScreenProps) {
  const { themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState<'checkin' | 'mentor' | 'discipline' | 'learn' | 'journey' | 'lifeareas'>('checkin');
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{ type: string; duration: number } | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  // Check if already completed today
  useEffect(() => {
    const savedDate = localStorage.getItem('flowstate-coaching-date');
    const today = new Date().toDateString();
    
    if (savedDate === today) {
      setHasCompletedToday(true);
      const savedData = localStorage.getItem('flowstate-coaching-data');
      if (savedData) {
        const data: CheckInData = JSON.parse(savedData);
        setMood(data.mood);
        setEnergy(data.energy);
        setFocus(data.focus);
        setStep(4); // Show results
      }
      
      // Load completed actions
      const savedActions = localStorage.getItem('flowstate-coaching-completed');
      if (savedActions) {
        setCompletedActions(JSON.parse(savedActions));
      }
    }
  }, []);

  // Save completed actions
  useEffect(() => {
    if (completedActions.length > 0) {
      localStorage.setItem('flowstate-coaching-completed', JSON.stringify(completedActions));
    }
  }, [completedActions]);

  const saveCheckIn = () => {
    const checkInData: CheckInData = {
      mood,
      energy,
      focus,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('flowstate-coaching-data', JSON.stringify(checkInData));
    localStorage.setItem('flowstate-coaching-date', new Date().toDateString());
    setHasCompletedToday(true);
  };

  const getReflection = () => {
    const moodLevel = mood <= 2 ? 'low' : mood >= 4 ? 'high' : 'moderate';
    const energyLevel = energy <= 2 ? 'low' : energy >= 4 ? 'high' : 'moderate';
    const focusLevel = focus <= 2 ? 'scattered' : focus >= 4 ? 'clear' : 'okay';

    const reflections = {
      'low-low-scattered': "You're having a tough day, and that's completely okay. Let's focus on the smallest, gentlest steps forward.",
      'low-low-okay': "Energy is low, but you have some mental clarity. Use that clarity wisely — maybe just one small thing today.",
      'low-low-clear': "You're feeling low energy but clear-minded — let's keep it simple today. Your mind knows what matters.",
      'low-moderate-scattered': "You're feeling scattered, but you have enough energy to be gentle with yourself. One thing at a time.",
      'low-moderate-okay': "Moderate energy with mixed focus. That's actually a good place to start — just begin somewhere small.",
      'low-moderate-clear': "You have clarity even when mood is low. That's a strength — let's honor it with simple, meaningful action.",
      'low-high-scattered': "High energy but feeling scattered emotionally. Channel that energy into something soothing first.",
      'low-high-okay': "You have energy to work with, even if mood is low. Sometimes movement helps the heart catch up.",
      'low-high-clear': "Clear and energized, even if emotions are low. You're more capable than you feel right now.",
      'moderate-low-scattered': "Low energy and scattered focus. Rest isn't giving up — it's preparing for what's next.",
      'moderate-low-okay': "You're in a neutral space with low energy. That's fine. Pace yourself and trust the process.",
      'moderate-low-clear': "Clear-headed but low on fuel. Perfect day for planning, not pushing.",
      'moderate-moderate-scattered': "Everything feels middle-of-the-road. That's actually a gift — no pressure, just steady presence.",
      'moderate-moderate-okay': "You're in a balanced state. Not high, not low — just here. And that's enough.",
      'moderate-moderate-clear': "Steady and centered. This is a great foundation for intention without overwhelm.",
      'moderate-high-scattered': "Lots of energy but scattered focus. Let's channel that into one clear direction.",
      'moderate-high-okay': "Good energy with decent focus. You're ready for something meaningful today.",
      'moderate-high-clear': "Energized and focused. You're in a good space to make intentional progress.",
      'high-low-scattered': "Feeling positive but low on energy and focus. Celebrate the mood, honor the limits.",
      'high-low-okay': "Good mood, low energy. That's okay — enjoy the lightness without forcing productivity.",
      'high-low-clear': "You feel good and clear, even with low energy. Clarity is its own form of momentum.",
      'high-moderate-scattered': "Positive mood with some energy but scattered. Pick one joyful thing to focus on.",
      'high-moderate-okay': "You're feeling good with moderate energy. Use it wisely and don't overcommit.",
      'high-moderate-clear': "Great mood, decent energy, clear mind. You're set up well for a focused, joyful day.",
      'high-high-scattered': "High mood and energy but scattered focus. That's creative chaos — embrace it or narrow it down.",
      'high-high-okay': "Feeling good with strong energy. You can do a lot today, but remember: rest is also productive.",
      'high-high-clear': "You're feeling amazing — clear, energized, and positive. This is your day to shine, at your own pace.",
    };

    const key = `${moodLevel}-${energyLevel}-${focusLevel}`;
    return reflections[key as keyof typeof reflections] || "You're exactly where you need to be. Let's work with what you have today.";
  };

  const getSuggestions = () => {
    const moodLevel = mood <= 2 ? 'low' : mood >= 4 ? 'high' : 'moderate';
    const energyLevel = energy <= 2 ? 'low' : energy >= 4 ? 'high' : 'moderate';
    // const focusLevel = focus <= 2 ? 'low' : focus >= 4 ? 'high' : 'moderate';

    const mindsetSuggestions = {
      low: { text: "Remember: You don't have to feel good to do good things. Just be kind to yourself.", action: null },
      moderate: { text: "You're in a neutral space. Sometimes the best thing is to simply show up.", action: null },
      high: { text: "Your positive energy is a gift. Use it to create something that feels good.", action: null },
    };

    const smallWinSuggestions = {
      'low-low': { 
        text: "Drink a glass of water. That's it. That's the win.", 
        action: 'complete' as const,
        actionLabel: 'Mark as Done'
      },
      'low-moderate': { 
        text: "Step outside for 60 seconds. Fresh air counts.", 
        action: 'timer' as const,
        duration: 60,
        actionLabel: 'Start 1-min Timer'
      },
      'low-high': { 
        text: "Stretch for 2 minutes. Your body will thank you.", 
        action: 'timer' as const,
        duration: 120,
        actionLabel: 'Start 2-min Timer'
      },
      'moderate-low': { 
        text: "Write down one thing that went okay today.", 
        action: 'navigate' as const,
        screen: 'reflection',
        actionLabel: 'Open Reflection'
      },
      'moderate-moderate': { 
        text: "Complete one small task you've been avoiding.", 
        action: 'navigate' as const,
        screen: 'todos',
        actionLabel: 'View To-Dos'
      },
      'moderate-high': { 
        text: "Tidy one surface in your space. Just one.", 
        action: 'complete' as const,
        actionLabel: 'Mark as Done'
      },
      'high-low': { 
        text: "Listen to a song that makes you feel alive.", 
        action: 'complete' as const,
        actionLabel: 'Mark as Done'
      },
      'high-moderate': { 
        text: "Do something creative for 5 minutes, no pressure.", 
        action: 'timer' as const,
        duration: 300,
        actionLabel: 'Start 5-min Timer'
      },
      'high-high': { 
        text: "Start that thing you've been excited about.", 
        action: 'navigate' as const,
        screen: 'todos',
        actionLabel: 'View To-Dos'
      },
    };

    const taskFocusSuggestions = {
      'low-low': { 
        text: "Focus area: Self-care only. Everything else can wait.", 
        action: 'navigate' as const,
        screen: 'home',
        actionLabel: 'Go to Dashboard'
      },
      'low-moderate': { 
        text: "Focus area: One gentle priority. Nothing more.", 
        action: 'navigate' as const,
        screen: 'todos',
        actionLabel: 'Pick a Task'
      },
      'low-high': { 
        text: "Focus area: Something you can finish in under an hour.", 
        action: 'navigate' as const,
        screen: 'todos',
        actionLabel: 'View To-Dos'
      },
      'moderate-low': { 
        text: "Focus area: Planning or organizing, not doing.", 
        action: 'navigate' as const,
        screen: 'calendar',
        actionLabel: 'Open Calendar'
      },
      'moderate-moderate': { 
        text: "Focus area: Pick your top 3 tasks, then do just 1.", 
        action: 'navigate' as const,
        screen: 'todos',
        actionLabel: 'View To-Dos'
      },
      'moderate-high': { 
        text: "Focus area: Something that requires focus but feels doable.", 
        action: 'navigate' as const,
        screen: 'focus',
        actionLabel: 'Open Focus Tools'
      },
      'high-low': { 
        text: "Focus area: Something joyful or creative that feeds your soul.", 
        action: 'navigate' as const,
        screen: 'home',
        actionLabel: 'Go to Dashboard'
      },
      'high-moderate': { 
        text: "Focus area: A meaningful task that aligns with your values.", 
        action: 'navigate' as const,
        screen: 'home',
        actionLabel: 'Go to Dashboard'
      },
      'high-high': { 
        text: "Focus area: Your most important goal today, with breaks built in.", 
        action: 'navigate' as const,
        screen: 'focus',
        actionLabel: 'Open Focus Tools'
      },
    };

    const smallWinKey = `${moodLevel}-${energyLevel}`;
    const taskFocusKey = `${moodLevel}-${energyLevel}`;

    return {
      mindset: mindsetSuggestions[moodLevel],
      smallWin: smallWinSuggestions[smallWinKey as keyof typeof smallWinSuggestions],
      taskFocus: taskFocusSuggestions[taskFocusKey as keyof typeof taskFocusSuggestions],
    };
  };

  const handleNext = () => {
    if (step === 3) {
      saveCheckIn();
    }
    setStep(step + 1);
  };

  const handleRetake = () => {
    localStorage.removeItem('flowstate-coaching-date');
    localStorage.removeItem('flowstate-coaching-data');
    localStorage.removeItem('flowstate-coaching-completed');
    setHasCompletedToday(false);
    setStep(1);
    setMood(3);
    setEnergy(3);
    setFocus(3);
    setCompletedActions([]);
    setActiveTimer(null);
  };

  // Timer effect
  useEffect(() => {
    if (activeTimer !== null && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setActiveTimer(null);
            // toast.success('Timer complete! Great work! 🎉', {
            //   duration: 3000,
            // });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTimer, timerSeconds]);

  const handleSuggestionAction = (suggestionType: string, suggestion: any) => {
    if (!suggestion.action) return;

    if (suggestion.action === 'navigate') {
      onNavigate(suggestion.screen);
    } else if (suggestion.action === 'timer') {
      setActiveTimer({ type: suggestionType, duration: suggestion.duration });
      setTimerSeconds(suggestion.duration);
      // toast.success('Timer started! You got this 💪', {
      //   duration: 2000,
      // });
    } else if (suggestion.action === 'complete') {
      if (!completedActions.includes(suggestionType)) {
        setCompletedActions([...completedActions, suggestionType]);
        // toast.success('Marked as complete! Nice work! ✨', {
        //   duration: 3000,
        // });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSliderLabel = (value: number, type: 'mood' | 'energy' | 'focus') => {
    if (type === 'mood') {
      if (value <= 2) return '😔 Low';
      if (value >= 4) return '😊 High';
      return '😐 Okay';
    }
    if (type === 'energy') {
      if (value <= 2) return '🔋 Drained';
      if (value >= 4) return '⚡ Energized';
      return '🔆 Moderate';
    }
    if (value <= 2) return '💭 Scattered';
    if (value >= 4) return '🎯 Clear';
    return '🌤️ Okay';
  };

  const suggestions = getSuggestions();

  // Render tabs component
  const renderTabs = () => (
    <div className="sticky top-0 z-40 flow-card">
      <div className="max-w-2xl mx-auto px-2 sm:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex-shrink-0 px-2 sm:px-3 py-4 text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'checkin' 
                ? '' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={activeTab === 'checkin' ? {
              borderColor: themeColors.primary,
              color: themeColors.primary,
            } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              <ClipboardList size={16} />
              <span>Check-In</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex-shrink-0 px-2 sm:px-3 py-4 text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'mentor' 
                ? '' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={activeTab === 'mentor' ? {
              borderColor: themeColors.primary,
              color: themeColors.primary,
            } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              <Bot size={16} />
              <span>Mentor</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex-shrink-0 px-2 sm:px-3 py-4 text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'journey' 
                ? '' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={activeTab === 'journey' ? {
              borderColor: themeColors.primary,
              color: themeColors.primary,
            } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen size={16} />
              <span>Journey</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('lifeareas')}
            className={`flex-shrink-0 px-2 sm:px-3 py-4 text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'lifeareas' 
                ? '' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={activeTab === 'lifeareas' ? {
              borderColor: themeColors.primary,
              color: themeColors.primary,
            } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              <Compass size={16} />
              <span>Life Areas</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('discipline')}
            className={`flex-shrink-0 px-2 sm:px-3 py-4 text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'discipline' 
                ? '' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={activeTab === 'discipline' ? {
              borderColor: themeColors.primary,
              color: themeColors.primary,
            } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp size={16} />
              <span>Discipline</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex-shrink-0 px-2 sm:px-3 py-4 text-xs sm:text-sm transition-all border-b-2 ${
              activeTab === 'learn' 
                ? '' 
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={activeTab === 'learn' ? {
              borderColor: themeColors.primary,
              color: themeColors.primary,
            } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              <Lightbulb size={16} />
              <span>Learn</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // If Mentor tab is active, render that screen
  if (activeTab === 'mentor') {
    return (
      <div>
        {renderTabs()}
        {/* <AIMentorMode /> */}
      </div>
    );
  }

  // If Journey tab is active, render that screen
  if (activeTab === 'journey') {
    return (
      <div>
        {renderTabs()}
        {/* <HabitLearningJourney /> */}
      </div>
    );
  }

  // If Life Areas tab is active, render that screen
  if (activeTab === 'lifeareas') {
    return (
      <div>
        {renderTabs()}
        {/* <LifeAreaCoachingScreen /> */}
      </div>
    );
  }

  // If Discipline tab is active, render that screen
  if (activeTab === 'discipline') {
    return (
      <div>
        {renderTabs()}
        {/* <DisciplineBuilderScreen /> */}
      </div>
    );
  }

  // If Learn tab is active, render that screen
  if (activeTab === 'learn') {
    return (
      <div>
        {renderTabs()}
        {/* <HabitEducationScreen /> */}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 bg-black/75 text-white px-2 py-1 text-sm rounded-br z-50">COACHING SCREEN</div>
      {renderTabs()}
      
      <div
        className="min-h-screen pb-24"
        style={{
          background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
        }}
      >
        {/* Floating Timer */}
        {activeTimer && timerSeconds > 0 && (
          <div

            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className="flow-card"
              style={{ borderColor: themeColors.primary }}
            >
              <div className="text-sm opacity-60">Timer:</div>
              <div className="text-2xl">{formatTime(timerSeconds)}</div>
              <button
                onClick={() => setActiveTimer(null)}
                className="ml-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-xs"
              >
                Stop
              </button>
            </div>
          </ div>
        )}

        <div className="p-6 md:p-8 pt-12 md:pt-16">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 mb-3 text-lavender-600">
                <Sparkles size={24} />
                <h1>Daily Coaching Check-In</h1>
              </div>
              <p className="opacity-70">
                {hasCompletedToday && step === 4
                  ? "You've already checked in today"
                  : "Let's check in with how you're feeling"}
              </p>
              
              {/* Chat with Coach Button */}
              < button
                // whileHover={{ scale: 1.02 }}
                // whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('coach-chat')}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white shadow-lg transition-all"
                style={{ backgroundColor: themeColors.primary }}
              >
                <MessageCircle size={18} />
                <span>Chat with Your Coach</span>
              </ button>
            </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((dot) => (
              <div
                key={dot}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: step >= dot ? '32px' : '8px',
                  backgroundColor: step >= dot ? themeColors.primary : '#e5e7eb',
                }}
              />
            ))}
          </div>

          {/* Step 1: Mood */}
          {step === 1 && (
            <div

              className="flow-card"
            >
              <h2 className="mb-6 text-center">How's your mood right now?</h2>
              <div className="mb-8">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <span className="text-4xl">{['😔', '😕', '😐', '🙂', '😊'][mood - 1]}</span>
                </div>
                <div className="text-center mb-6 opacity-70">
                  {getSliderLabel(mood, 'mood')}
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${((mood - 1) / 4) * 100}%, #e5e7eb ${((mood - 1) / 4) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: themeColors.primary }}
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </ div>
          )}

          {/* Step 2: Energy */}
          {step === 2 && (
            <div

              className="flow-card"
            >
              <h2 className="mb-6 text-center">What's your energy level?</h2>
              <div className="mb-8">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <span className="text-4xl">{['🔋', '🪫', '🔆', '⚡', '✨'][energy - 1]}</span>
                </div>
                <div className="text-center mb-6 opacity-70">
                  {getSliderLabel(energy, 'energy')}
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${((energy - 1) / 4) * 100}%, #e5e7eb ${((energy - 1) / 4) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: themeColors.primary }}
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </ div>
          )}

          {/* Step 3: Focus */}
          {step === 3 && (
            <div

              className="flow-card"
            >
              <h2 className="mb-6 text-center">How clear is your focus?</h2>
              <div className="mb-8">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <span className="text-4xl">{['💭', '🌫️', '🌤️', '☀️', '🎯'][focus - 1]}</span>
                </div>
                <div className="text-center mb-6 opacity-70">
                  {getSliderLabel(focus, 'focus')}
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={focus}
                  onChange={(e) => setFocus(parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${themeColors.primary} 0%, ${themeColors.primary} ${((focus - 1) / 4) * 100}%, #e5e7eb ${((focus - 1) / 4) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: themeColors.primary }}
              >
                Get My Coaching
                <Sparkles size={20} />
              </button>
            </ div>
          )}

          {/* Step 4: Reflection & Suggestions */}
          {step === 4 && (
            <div

              className="space-y-6"
            >
              {/* Reflection */}
              <div className="bg-gradient-to-br from-lavender-50 to-peach-50 rounded-3xl shadow-lg p-8 border-2 border-lavender-200">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 size={28} className="text-lavender-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="mb-3 text-lavender-700">Here's what I see</h3>
                    <p className="leading-relaxed text-[var(--color-card-foreground)]">
                      {getReflection()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Three Suggestions */}
              <div className="flow-card">
                <h3 className="mb-6 text-center">Your personalized suggestions</h3>
                
                <div className="space-y-4">
                  {/* Mindset */}
                  <div className="bg-blue-50 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">🧠</span>
                      <div className="flex-1">
                        <div className="text-sm opacity-60 mb-1">Mindset</div>
                        <p className="text-[var(--color-card-foreground)]">{suggestions.mindset.text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Small Win */}
                  <div className="bg-green-50 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">✨</span>
                      <div className="flex-1">
                        <div className="text-sm opacity-60 mb-1">Small Win</div>
                        <p className="text-[var(--color-card-foreground)] mb-3">{suggestions.smallWin.text}</p>
                        {suggestions.smallWin.action && (
                          completedActions.includes('smallWin') ? (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                              <CheckCircle2 size={16} />
                              <span>Completed! Great job 🎉</span>
                            </div>
                          ) : activeTimer !== null && activeTimer.type === 'smallWin' && suggestions.smallWin.action === 'timer' ? (
                            <div className="flex items-center gap-3">
                              <div className="flex-1 flow-card">
                                <div className="text-2xl text-[var(--color-card-foreground)]">{formatTime(timerSeconds)}</div>
                              </div>
                              <button
                                onClick={() => setActiveTimer(null)}
                                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors text-sm"
                              >
                                Stop
                              </button>
                            </div>
                          ) : (
                            < button
                              // whileHover={{ scale: 1.02 }}
                              // whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestionAction('smallWin', suggestions.smallWin)}
                              className="w-full py-3 rounded-xl text-white transition-all duration-200 hover:shadow-md text-sm"
                              style={{ backgroundColor: themeColors.primary }}
                            >
                              {suggestions.smallWin.actionLabel}
                            </ button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Focus */}
                  <div className="bg-peach-50 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">🎯</span>
                      <div className="flex-1">
                        <div className="text-sm opacity-60 mb-1">Task Focus</div>
                        <p className="text-[var(--color-card-foreground)] mb-3">{suggestions.taskFocus.text}</p>
                        {suggestions.taskFocus.action && (
                          < button
                            // whileHover={{ scale: 1.02 }}
                            // whileTap={{ scale: 0.98 }}
                            onClick={() => handleSuggestionAction('taskFocus', suggestions.taskFocus)}
                            className="w-full py-3 rounded-xl text-white transition-all duration-200 hover:shadow-md text-sm"
                            style={{ backgroundColor: themeColors.primary }}
                          >
                            {suggestions.taskFocus.actionLabel}
                          </ button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retake Button */}
              {hasCompletedToday && (
                <button
                  onClick={handleRetake}
                  className="w-full py-3 rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-colors opacity-60 hover:opacity-100"
                >
                  Check in again
                </button>
              )}
            </ div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
