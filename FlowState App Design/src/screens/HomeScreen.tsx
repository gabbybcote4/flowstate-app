import { useState, useEffect } from 'react';
import { HealthWidget } from '../components/widget/HealthWidget';
// import { TodoCard } from './TodoCard';
// import { AISuggestionsWidget } from '../components/widget/AISuggestionsWidget';
import { WeeklySummaryCard } from '../components/card/WeeklySummaryCard';
import { WeatherMoonWidget } from '../components/widget/WeatherMoonWidget';
import { AdaptiveGreeting } from '../components/greeting/AdaptiveGreeting';
import { MoodCheckInWidget } from '../components/widget/MoodCheckInWidget';
import { QuickReflectionCard } from '../components/card/QuickReflectionCard';
import { TimeOfDayIndicator } from '../components/indicator/TimeOfDayIndicator';
// import { AmbientParticles } from '../components/particles/AmbientParticles';
// import { useTheme } from '../components/context/ThemeContext';
// import { useActivityNudges } from '../components/system/NudgeSystem';
import { getAdaptiveBackground, getTimeOfDay } from '../components/background/adaptiveBackgrounds';
import { Moon, Footprints, Heart, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// const DEFAULT_TODOS = [
//   { id: 1, title: 'Morning meditation', completed: true, time: 'morning', icon: '🧘' },
//   { id: 2, title: 'Hydrate (500ml)', completed: true, time: 'morning', icon: '💧' },
//   { id: 3, title: 'Gentle stretch', completed: false, time: 'morning', icon: '🌱' },
//   { id: 4, title: 'Light lunch prep', completed: false, time: 'afternoon', icon: '🥗' },
//   { id: 5, title: 'Project check-in', completed: false, time: 'afternoon', icon: '💼' },
//   { id: 6, title: 'Evening walk', completed: false, time: 'evening', icon: '🌙' },
//   { id: 7, title: 'Reflection journal', completed: false, time: 'evening', icon: '📔' },
// ];

export function HomeScreen() {
  // const { themeColors } = useTheme();
  // const { showCompletionNudge } = useActivityNudges();
  const [adaptiveBg, setAdaptiveBg] = useState(getAdaptiveBackground());
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState(getTimeOfDay());
  
  // Update background every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setAdaptiveBg(getAdaptiveBackground());
      setCurrentTimeOfDay(getTimeOfDay());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Load todos from localStorage or use defaults
  // const [todos, setTodos] = useState(() => {
  //   try {
  //     const savedTodos = localStorage.getItem('flowstate-todos');
  //     return savedTodos ? JSON.parse(savedTodos) : DEFAULT_TODOS;
  //   } catch (error) {
  //     console.error('Error loading todos from localStorage:', error);
  //     return DEFAULT_TODOS;
  //   }
  // });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoTime, setNewTodoTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newTodoIcon, setNewTodoIcon] = useState('✨');

  // Save todos to localStorage whenever they change
  // useEffect(() => {
  //   try {
  //     localStorage.setItem('flowstate-todos', JSON.stringify(todos));
  //   } catch (error) {
  //     console.error('Error saving todos to localStorage:', error);
  //   }
  // }, [todos]);

  // const toggleTodo = (id: number) => {
  //   const updatedTodos = todos.map(todo => {
  //     if (todo.id === id) {
  //       const isCompleting = !todo.completed;
  //       return {
  //         ...todo,
  //         completed: isCompleting,
  //         completedAt: isCompleting ? new Date().toISOString() : undefined,
  //       };
  //     }
  //     return todo;
  //   });
  //   setTodos(updatedTodos);
    
  //   // Show completion nudge when a task is completed
  //   const toggledTodo = updatedTodos.find(t => t.id === id);
  //   if (toggledTodo?.completed) {
  //     const completedCount = updatedTodos.filter(t => t.completed).length;
  //     showCompletionNudge(completedCount);
  //   }
  // };

  // const handleAddTodo = () => {
  //   if (newTodoTitle.trim()) {
  //     const newTodo = {
  //       id: Math.max(...todos.map(t => t.id), 0) + 1,
  //       title: newTodoTitle,
  //       completed: false,
  //       time: newTodoTime,
  //       icon: newTodoIcon,
  //     };
  //     setTodos([...todos, newTodo]);
  //     setNewTodoTitle('');
  //     setNewTodoIcon('✨');
  //     setNewTodoTime('morning');
  //     setIsModalOpen(false);
  //   }
  // };

  // const todayDate = new Date().toLocaleDateString('en-US', { 
  //   weekday: 'long', 
  //   month: 'long', 
  //   day: 'numeric' 
  // });

  return (
    <div 
      className="min-h-screen bg-gradient-to-b transition-colors duration-1000 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${adaptiveBg.gradientFrom}, ${adaptiveBg.gradientTo})`
      }}
    >
      {/* Ambient particles that change with time of day */}
      
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32 relative" style={{ zIndex: 2 }}>
        <div className="max-w-md mx-auto px-4">
          {/* Adaptive Greeting */}
          <AdaptiveGreeting />

          {/* Time of Day Indicator */}
          <TimeOfDayIndicator />

          {/* Weather & Moon Phase */}
          <WeatherMoonWidget />

          {/* Mood Check-In Widget */}
          <MoodCheckInWidget />

        {/* Health Widgets */}
        <div className="flex gap-3 mb-6">
          <HealthWidget
            icon={<Moon size={20} />}
            label="Sleep"
            value="7h 20m"
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

        {/* Quick Reflection */}
        <QuickReflectionCard />

        {/* AI Suggestions Widget */}

        {/* Weekly Summary */}
        <WeeklySummaryCard />

        {/* Morning Block */}
        <div 
          className={`mb-6 p-5 rounded-3xl shadow-sm transition-all duration-500 ${
            currentTimeOfDay === 'morning' ? 'bg-lavender-100 ring-2 ring-lavender-300' : 'bg-lavender-50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lavender-700">🌅 Morning</h2>
            {currentTimeOfDay === 'morning' && (
              <span className="text-xs bg-lavender-200 px-3 py-1 rounded-full">Now</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {/* {todos.filter(t => t.time === 'morning').map(todo => (
              <TodoCard
                key={todo.id}
                title={todo.title}
                icon={<span>{todo.icon}</span>}
                completed={todo.completed}
                onToggle={() => toggleTodo(todo.id)}
              />
            ))} */}
          </div>
        </div>

        {/* Afternoon Block */}
        <div 
          className={`mb-6 p-5 rounded-3xl shadow-sm transition-all duration-500 ${
            currentTimeOfDay === 'afternoon' ? 'bg-peach-100 ring-2 ring-orange-300' : 'bg-peach-50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-orange-700">☀️ Afternoon</h2>
            {currentTimeOfDay === 'afternoon' && (
              <span className="text-xs bg-orange-200 px-3 py-1 rounded-full">Now</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {/* {todos.filter(t => t.time === 'afternoon').map(todo => (
              <TodoCard
                key={todo.id}
                title={todo.title}
                icon={<span>{todo.icon}</span>}
                completed={todo.completed}
                onToggle={() => toggleTodo(todo.id)}
              />
            ))} */}
          </div>
        </div>

        {/* Evening Block */}
        <div 
          className={`mb-6 p-5 rounded-3xl shadow-sm transition-all duration-500 ${
            currentTimeOfDay === 'evening' ? 'bg-blue-100 ring-2 ring-blue-300' : 'bg-blue-50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-blue-700">🌙 Evening</h2>
            {currentTimeOfDay === 'evening' && (
              <span className="text-xs bg-blue-200 px-3 py-1 rounded-full">Now</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {/* {todos.filter(t => t.time === 'evening').map(todo => (
              <TodoCard
                key={todo.id}
                title={todo.title}
                icon={<span>{todo.icon}</span>}
                completed={todo.completed}
                onToggle={() => toggleTodo(todo.id)}
              />
            ))} */}
          </div>
        </div>

          {/* Add To-Do Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 rounded-3xl bg-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border border-lavender-100"
          >
            <Plus size={20} className="text-lavender-400" />
            <span>Add To-Do</span>
          </button>
        </div>
      </div>

      {/* Add To-Do Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl border-0">
          <DialogHeader>
            <DialogTitle>Add New To-Do</DialogTitle>
            <DialogDescription>
              Create a gentle task for your day
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="e.g. Gentle yoga"
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time of Day</Label>
              <Select value={newTodoTime} onValueChange={(value: any) => setNewTodoTime(value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">🌅 Morning</SelectItem>
                  <SelectItem value="afternoon">☀️ Afternoon</SelectItem>
                  <SelectItem value="evening">🌙 Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={newTodoIcon}
                onChange={(e) => setNewTodoIcon(e.target.value)}
                placeholder="✨"
                className="rounded-xl"
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            {/* <button
              onClick={handleAddTodo}
              disabled={!newTodoTitle.trim()}
              className="px-4 py-2 rounded-xl bg-lavender-400 text-white hover:bg-lavender-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add To-Do
            </button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
