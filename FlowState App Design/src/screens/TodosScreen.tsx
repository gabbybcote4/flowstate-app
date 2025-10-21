import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TodoCard } from '../components/card/TodoCard';
import { useTheme } from '../components/context/ThemeContext';
import { useActivityNudges } from '../components/system/NudgeSystem';
import { Plus } from 'lucide-react';
//import { DevTag } from '../components/overlay/DevTag';

interface Todo {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
}

interface RoutineTemplates {
  low: Todo[];
  moderate: Todo[];
  good: Todo[];
}

// Lightweight inline fallback for CoachingNudgeCard when the external file is not a module
const CoachingNudgeCard = ({ context }: { context?: string }) => {
  return (
    <div className="p-4 rounded-lg bg-white/5">
      {/* Minimal placeholder for coaching nudge */}
      <p className="text-sm opacity-80">Coaching nudge: {context}</p>
    </div>
  );
};

const defaultTemplates: RoutineTemplates = {
  low: [
    { id: 1, title: 'Rest & hydrate', icon: '💧', completed: false },
    { id: 2, title: 'Gentle breathing', icon: '🫁', completed: false },
    { id: 3, title: 'Minimal screen time', icon: '📱', completed: false },
    { id: 4, title: 'Light snack', icon: '🍎', completed: false },
    { id: 5, title: 'Comfort position', icon: '🛋️', completed: false },
  ],
  moderate: [
    { id: 6, title: 'Morning meditation', icon: '🧘', completed: false },
    { id: 7, title: 'Hydrate (500ml)', icon: '💧', completed: false },
    { id: 8, title: 'Gentle stretch', icon: '🌱', completed: false },
    { id: 9, title: 'Light work block', icon: '💼', completed: false },
    { id: 10, title: 'Creative time', icon: '🎨', completed: false },
    { id: 11, title: 'Evening walk', icon: '🚶', completed: false },
  ],
  good: [
    { id: 12, title: 'Full meditation', icon: '🧘', completed: false },
    { id: 13, title: 'Workout or yoga', icon: '💪', completed: false },
    { id: 14, title: 'Deep work session', icon: '💼', completed: false },
    { id: 15, title: 'Social time', icon: '👥', completed: false },
    { id: 16, title: 'Project progress', icon: '🚀', completed: false },
    { id: 17, title: 'Learning time', icon: '📚', completed: false },
    { id: 18, title: 'Evening reflection', icon: '✨', completed: false },
  ],
};

export function TodosScreen() {
  const { themeColors } = useTheme();
  const { showCompletionNudge } = useActivityNudges();
  const [activeTab, setActiveTab] = useState('low');
  
  // Load todos from localStorage or use defaults
  const [routineTemplates, setRoutineTemplates] = useState<RoutineTemplates>(() => {
    try {
      const savedTemplates = localStorage.getItem('flowstate-routine-templates');
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        // Validate that the parsed data has the correct structure
        if (parsed && parsed.low && parsed.moderate && parsed.good) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading routine templates:', error);
    }
    return defaultTemplates;
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    try {
      localStorage.setItem('flowstate-routine-templates', JSON.stringify(routineTemplates));
    } catch (error) {
      console.error('Error saving routine templates:', error);
    }
  }, [routineTemplates]);

  const toggleTodo = (id: number) => {
    setRoutineTemplates(prev => {
      const newTemplates = { ...prev };
      let wasCompleted = false;
      let totalCompleted = 0;
      
      // Find and toggle the todo in all categories
      Object.keys(newTemplates).forEach((key) => {
        const category = key as keyof RoutineTemplates;
        newTemplates[category] = newTemplates[category].map(todo => {
          if (todo.id === id) {
            wasCompleted = !todo.completed;
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        });
      });
      
      // Count total completed in active tab
      const activeCategory = activeTab as keyof RoutineTemplates;
      totalCompleted = newTemplates[activeCategory].filter(t => t.completed).length;
      
      // Show nudge if task was just completed
      if (wasCompleted) {
        showCompletionNudge(totalCompleted);
      }
      
      return newTemplates;
    });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`
      }}
    >
      <div className="absolute top-0 left-0 bg-black/75 text-white px-2 py-1 text-sm rounded-br z-50">TODOS SCREEN</div>
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-2">Routine Templates</h1>
            <p className="opacity-70">Adjust your plan based on how you feel</p>
          </div>

          {/* Coaching Nudge */}
          <div className="mb-6">
            <CoachingNudgeCard context="todos" />
          </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-lavender-100 p-1 rounded-2xl mb-6">
            <TabsTrigger value="low" className="rounded-xl data-[state=active]:bg-white">
              Low
            </TabsTrigger>
            <TabsTrigger value="moderate" className="rounded-xl data-[state=active]:bg-white">
              Moderate
            </TabsTrigger>
            <TabsTrigger value="good" className="rounded-xl data-[state=active]:bg-white">
              Good
            </TabsTrigger>
          </TabsList>

          <TabsContent value="low" className="mt-0">
            <div className="flex flex-col gap-3 mb-6">
              {routineTemplates.low.map(todo => (
                <TodoCard
                  key={todo.id}
                  title={todo.title}
                  icon={<span>{todo.icon}</span>}
                  completed={todo.completed}
                  onToggle={() => toggleTodo(todo.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moderate" className="mt-0">
            <div className="flex flex-col gap-3 mb-6">
              {routineTemplates.moderate.map(todo => (
                <TodoCard
                  key={todo.id}
                  title={todo.title}
                  icon={<span>{todo.icon}</span>}
                  completed={todo.completed}
                  onToggle={() => toggleTodo(todo.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="good" className="mt-0">
            <div className="flex flex-col gap-3 mb-6">
              {routineTemplates.good.map(todo => (
                <TodoCard
                  key={todo.id}
                  title={todo.title}
                  icon={<span>{todo.icon}</span>}
                  completed={todo.completed}
                  onToggle={() => toggleTodo(todo.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

          {/* Add Custom Task Button */}
          <button className="w-full py-4 rounded-3xl bg-lavender-400 text-white shadow-lg hover:bg-lavender-500 transition-all duration-200 flex items-center justify-center gap-2">
            <Plus size={20} />
            <span>Add Custom Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
