// src/screens/DisciplineBuilderScreen.tsx
// builds discipline and consistency modules with reflections and progress tracking

import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Target,
  Heart,
  Zap,
  Award,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface DailyReflection {
  date: string;
  whatMadeItEasier: string;
  showedUp: boolean;
  energyLevel: number;
}

interface DisciplineProgress {
  totalShowUps: number;
  currentLevel: number;
  points: number;
  reflections: DailyReflection[];
  completedModules: string[];
}

const DISCIPLINE_MODULES = [
  {
    id: "understanding",
    title: "Understanding discipline",
    icon: BookOpen,
    color: "#a78bfa",
    lessons: [
      {
        title: "Discipline ≠ punishment",
        content:
          "True discipline isn’t about forcing yourself to do things you hate. It’s about loving yourself enough to show up, even when it’s hard.",
      },
      {
        title: "Progress over perfection",
        content:
          "Discipline is built through consistency, not intensity. Showing up 5 times a week at 70% is better than burning out trying for 100%.",
      },
      {
        title: "The 2-minute rule",
        content:
          "When resistance feels strong, commit to just 2 minutes. Starting is the hardest part — momentum will follow.",
      },
    ],
  },
  {
    id: "systems",
    title: "Building sustainable systems",
    icon: Target,
    color: "#fb923c",
    lessons: [
      {
        title: "Environment design",
        content:
          "Make the right choice the easy choice. Want to drink more water? Keep a glass nearby. Want to move more? Set your mat out.",
      },
      {
        title: "Habit stacking",
        content:
          "Link new behaviors to existing ones. After I pour my coffee, I’ll write 3 gratitudes. It creates automatic cues.",
      },
      {
        title: "Energy mapping",
        content:
          "Notice when you have the most energy and focus. Schedule your most important habits during those windows.",
      },
    ],
  },
  {
    id: "resilience",
    title: "Building resilience",
    icon: Heart,
    color: "#f472b6",
    lessons: [
      {
        title: "The comeback is stronger",
        content:
          "Missing a day doesn’t erase your progress. What matters is how quickly you return — that’s real resilience.",
      },
      {
        title: "Self-compassion fuels discipline",
        content:
          "Being kind to yourself builds safety. When you feel safe, showing up becomes easier and more sustainable.",
      },
      {
        title: "Reframe failure",
        content:
          "Failure isn’t final — it’s feedback. Each miss teaches you what you need for next time.",
      },
    ],
  },
];

const DAILY_REMINDERS = [
  "Discipline is choosing what you want most over what you want now.",
  "You don’t have to feel motivated to take action — action creates motivation.",
  "Small, consistent steps compound into extraordinary results.",
  "Every time you show up, you’re proving to yourself that you can trust you.",
  "Discipline isn’t about being perfect. It’s about being persistent.",
  "The version of you you want to become is built through today’s choices.",
  "Rest is part of discipline. Pushing too hard leads to burnout.",
];

const REFLECTION_PROMPTS = [
  "What made it easier to show up today?",
  "What small win can you celebrate?",
  "What did you learn about yourself today?",
  "What obstacle did you overcome?",
  "What would make tomorrow 1% easier?",
];

// level calculator
function calculateLevel(points: number) {
  const levels = [
    { min: 0, max: 49, level: 1, title: "Seedling" },
    { min: 50, max: 99, level: 2, title: "Sprout" },
    { min: 100, max: 199, level: 3, title: "Growing stem" },
    { min: 200, max: 349, level: 4, title: "Young plant" },
    { min: 350, max: 549, level: 5, title: "Blooming flower" },
    { min: 550, max: 799, level: 6, title: "Thriving garden" },
    { min: 800, max: 1099, level: 7, title: "Wise oak" },
    { min: 1100, max: Infinity, level: 8, title: "Forest guardian" },
  ];

  const currentLevel = levels.find((l) => points >= l.min && points <= l.max) || levels[0];
  const nextLevel = levels.find((l) => l.level === currentLevel.level + 1);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelPoints: nextLevel ? nextLevel.min : points + 1,
  };
}

export function DisciplineBuilderScreen() {
  const { themeColors } = useTheme();
  const [progress, setProgress] = useState<DisciplineProgress>({
    totalShowUps: 0,
    currentLevel: 1,
    points: 0,
    reflections: [],
    completedModules: [],
  });
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [todayShownUp, setTodayShownUp] = useState(false);
  const [dailyReminder, setDailyReminder] = useState("");
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("flowstate-discipline-progress");
    if (saved) setProgress(JSON.parse(saved));
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("flowstate-discipline-showup-date");
    if (savedDate === today) setTodayShownUp(true);
    const reminderIndex = new Date().getDate() % DAILY_REMINDERS.length;
    setDailyReminder(DAILY_REMINDERS[reminderIndex]);
  }, []);

  useEffect(() => {
    localStorage.setItem("flowstate-discipline-progress", JSON.stringify(progress));
  }, [progress]);

  const handleShowUp = () => {
    if (todayShownUp) return;
    const today = new Date().toDateString();
    const newPoints = progress.points + 10;
    const levelInfo = calculateLevel(newPoints);
    setProgress({
      ...progress,
      totalShowUps: progress.totalShowUps + 1,
      points: newPoints,
      currentLevel: levelInfo.level,
    });
    localStorage.setItem("flowstate-discipline-showup-date", today);
    setTodayShownUp(true);
    toast.success("you showed up today (+10 pts)");
    setShowReflection(true);
  };

  const handleReflectionSubmit = () => {
    if (!reflectionText.trim()) {
      toast.error("please add your reflection first");
      return;
    }
    const reflection: DailyReflection = {
      date: new Date().toDateString(),
      whatMadeItEasier: reflectionText,
      showedUp: true,
      energyLevel: 3,
    };
    setProgress({
      ...progress,
      reflections: [reflection, ...progress.reflections].slice(0, 30),
    });
    setReflectionText("");
    setShowReflection(false);
    toast.success("reflection saved");
  };

  const handleCompleteModule = (id: string) => {
    if (progress.completedModules.includes(id)) return;
    const newPoints = progress.points + 50;
    const levelInfo = calculateLevel(newPoints);
    setProgress({
      ...progress,
      completedModules: [...progress.completedModules, id],
      points: newPoints,
      currentLevel: levelInfo.level,
    });
    setSelectedModule(null);
    toast.success("module complete (+50 pts)");
  };

  const levelInfo = calculateLevel(progress.points);
  const progressPercent =
    ((progress.points - (levelInfo.nextLevelPoints - 100)) / 100) * 100 || 0;

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
      }}
    >
      <div className="p-6 md:p-8 pt-12 md:pt-16 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <TrendingUp size={28} style={{ color: themeColors.primary }} />
            <h1>Discipline builder</h1>
          </div>
          <p className="opacity-70">Build consistency through compassion, not perfection</p>
        </div>

        {/* level card */}
        <div
          className="rounded-3xl p-6 mb-6 text-white shadow-lg"
          style={{ backgroundColor: themeColors.primary }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80 mb-1">Your growth level</p>
              <div className="flex items-center gap-2">
                <h2 className="text-white capitalize">{levelInfo.title}</h2>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  level {levelInfo.level}
                </div>
              </div>
            </div>
            <Award size={48} className="opacity-80" />
          </div>

          <div className="bg-white/30 rounded-full h-3 overflow-hidden mb-3">
            <div
              className="bg-white h-full rounded-full"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm opacity-90">
            <span>{progress.points} pts</span>
            <span>{levelInfo.nextLevelPoints - progress.points} to next</span>
          </div>
        </div>

        {/* daily show up */}
        {!todayShownUp ? (
          <div className="flow-card">
            <Sparkles size={48} className="mx-auto mb-3" style={{ color: themeColors.primary }} />
            <h2>Show up today</h2>
            <p className="opacity-70 mb-6">
              Discipline isn’t about being perfect — it’s about being present.
            </p>
            <button
              onClick={handleShowUp}
              className="w-full py-4 rounded-2xl text-white font-medium shadow-lg"
              style={{ backgroundColor: themeColors.primary }}
            >
              I’m showing up (+10 pts)
            </button>
          </div>
        ) : (
          <div className="bg-green-50 rounded-3xl border border-green-200 p-8 text-center mb-6">
            <CheckCircle2 size={48} className="mx-auto mb-3 text-green-600" />
            <h3 className="text-green-800 mb-2">You showed up today</h3>
            <p className="text-green-700 opacity-80">
              That’s {progress.totalShowUps} times you’ve chosen to be present.
            </p>
          </div>
        )}

        {/* reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex gap-3 items-start">
            <Zap size={24} className="text-blue-600 mt-1" />
            <div>
              <p className="text-sm opacity-60 mb-1">Today’s focus</p>
              <p className="text-[var(--color-card-foreground)]">{dailyReminder}</p>
            </div>
          </div>
        </div>

        {/* modules */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} style={{ color: themeColors.primary }} />
            <h3>Learning modules</h3>
          </div>
          <div className="grid gap-3">
            {DISCIPLINE_MODULES.map((m) => {
              const Icon = m.icon;
              const completed = progress.completedModules.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModule(m.id);
                    setCurrentLesson(0);
                  }}
                  className="flow-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${m.color}20` }}
                    >
                      <Icon size={24} style={{ color: m.color }} />
                    </div>
                    <div>
                      <h4 className="mb-1 capitalize">{m.title}</h4>
                      <p className="text-xs opacity-60">
                        {m.lessons.length} lessons
                        {completed && " • completed ✓"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="opacity-40" />
                </button>
              );
            })}
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="show ups" value={progress.totalShowUps} color={themeColors.primary} />
          <Stat label="modules" value={progress.completedModules.length} color={themeColors.primary} />
          <Stat label="reflections" value={progress.reflections.length} color={themeColors.primary} />
        </div>
      </div>

      {/* module modal */}
      {selectedModule && (
        <ModuleModal
          moduleId={selectedModule}
          lessonIndex={currentLesson}
          onNext={() => setCurrentLesson(currentLesson + 1)}
          onClose={() => setSelectedModule(null)}
          onComplete={handleCompleteModule}
        />
      )}

      {/* reflection modal */}
      {showReflection && (
        <ReflectionModal
          value={reflectionText}
          onChange={setReflectionText}
          onClose={() => setShowReflection(false)}
          onSave={handleReflectionSubmit}
          theme={themeColors}
        />
      )}
    </div>
  );
}

// small components
function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flow-card">
      <div className="text-2xl mb-1 font-medium" style={{ color }}>
        {value}
      </div>
      <p className="text-xs opacity-60">{label}</p>
    </div>
  );
}

// modal for modules
function ModuleModal({
  moduleId,
  lessonIndex,
  onNext,
  onClose,
  onComplete,
}: {
  moduleId: string;
  lessonIndex: number;
  onNext: () => void;
  onClose: () => void;
  onComplete: (id: string) => void;
}) {
  const module = DISCIPLINE_MODULES.find((m) => m.id === moduleId);
  if (!module) return null;
  const lesson = module.lessons[lessonIndex];
  const last = lessonIndex === module.lessons.length - 1;
  const Icon = module.icon;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="flow-card">
        <div className="p-6 text-white" style={{ backgroundColor: module.color }}>
          <div className="flex items-center gap-3 mb-2">
            <Icon size={28} />
            <h2 className="text-white capitalize">{module.title}</h2>
          </div>
          <p className="text-sm opacity-90">
            Lesson {lessonIndex + 1} of {module.lessons.length}
          </p>
        </div>
        <div className="p-6 overflow-y-auto">
          <h3 className="mb-3">{lesson.title}</h3>
          <p className="text-[var(--color-card-foreground)] leading-relaxed">
            {lesson.content}
          </p>
        </div>
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200">
            Close
          </button>
          {!last ? (
            <button
              onClick={onNext}
              className="flex-1 py-3 rounded-xl text-white shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: module.color }}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => onComplete(module.id)}
              className="flex-1 py-3 rounded-xl text-white shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: module.color }}
            >
              Complete module <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// reflection modal
function ReflectionModal({
  value,
  onChange,
  onClose,
  onSave,
  theme,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  theme: any;
}) {
  const prompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="flow-card">
        <div className="text-center mb-6">
          <Heart size={48} className="mx-auto mb-3" style={{ color: theme.primary }} />
          <h3 className="mb-2">quick reflection</h3>
          <p className="text-sm opacity-70">{prompt}</p>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="share your thoughts..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 resize-none mb-4"
          style={{ "--tw-ring-color": theme.primary } as any}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200">
            Skip
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-xl text-white shadow-lg"
            style={{ backgroundColor: theme.primary }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
