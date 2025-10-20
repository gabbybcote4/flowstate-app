import { useState, useEffect } from 'react';
import { useTheme } from '../components/context/ThemeContext';
import { Clock, Calendar, AlertCircle, TrendingUp, Heart, Briefcase, Users, Sparkles, Home as HomeIcon, Palette, X, ArrowLeft } from 'lucide-react';
//  from 'motion/react';
//import { toast } from 'sonner@2.0.3';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  lifeArea: string;
  habitId?: string;
  habitName?: string;
  todoId?: string;
  todoName?: string;
  isFlexible: boolean;
}

interface Habit {
  id: string;
  name: string;
  lifeArea: string;
  purpose: string;
  frequency?: string;
  timeSlots?: { id: string; time: string; label: string }[];
}

interface Todo {
  id: string;
  title: string;
  lifeArea?: string;
  completed?: boolean;
}

interface LifeArea {
  name: string;
  color: string;
  icon: React.ReactNode;
  gradient: string;
}

const LIFE_AREAS: LifeArea[] = [
  { 
    name: 'Health', 
    color: '#D8B4FE', 
    icon: <Heart size={16} />,
    gradient: 'from-purple-200 to-pink-200'
  },
  { 
    name: 'Work', 
    color: '#FBBF24', 
    icon: <Briefcase size={16} />,
    gradient: 'from-amber-200 to-orange-200'
  },
  { 
    name: 'Relationships', 
    color: '#FCA5A5', 
    icon: <Users size={16} />,
    gradient: 'from-rose-200 to-pink-200'
  },
  { 
    name: 'Personal Growth', 
    color: '#A5B4FC', 
    icon: <TrendingUp size={16} />,
    gradient: 'from-indigo-200 to-purple-200'
  },
  { 
    name: 'Creativity', 
    color: '#FCD34D', 
    icon: <Palette size={16} />,
    gradient: 'from-yellow-200 to-amber-200'
  },
  { 
    name: 'Home', 
    color: '#A7F3D0', 
    icon: <HomeIcon size={16} />,
    gradient: 'from-emerald-200 to-teal-200'
  },
];

// Generate time slots for the day
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour < 23; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({ startTime, endTime, hour });
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Draggable Habit Item
function DraggableHabit({ habit }: { habit: Habit }) {
  //const { themeColors } = useTheme();
  const lifeArea = LIFE_AREAS.find(area => area.name === habit.lifeArea);

//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'habit',
//     item: { habit },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

  return (
    <div
    //   ref={drag}
    //   className={`px-3 py-2 rounded-lg border cursor-move transition-all ${
    //     isDragging ? 'opacity-50 scale-95' : 'opacity-100'
    //   }`}
    //   style={{
    //     borderColor: lifeArea?.color || themeColors.primary,
    //     backgroundColor: `${lifeArea?.color}15`,
    //   }}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0" style={{ color: lifeArea?.color }}>
          {lifeArea?.icon}
        </div>
        <p className="text-sm truncate flex-1">{habit.name}</p>
      </div>
    </div>
  );
}

// Draggable Todo Item
function DraggableTodo({ todo }: { todo: Todo }) {
  //const { themeColors } = useTheme();
  const lifeArea = LIFE_AREAS.find(area => area.name === todo.lifeArea);

//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'todo',
//     item: { todo },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

  return (
    <div
    //   ref={drag}
    //   className={`px-3 py-2 rounded-lg border cursor-move transition-all ${
    //     isDragging ? 'opacity-50 scale-95' : 'opacity-100'
    //   } ${todo.completed ? 'opacity-50' : ''}`}
    //   style={{
    //     borderColor: lifeArea?.color || '#a78bfa',
    //     backgroundColor: lifeArea ? `${lifeArea.color}15` : '#f3e8ff',
    //   }}
    >
      <div className="flex items-center gap-2">
        {lifeArea && (
          <div className="flex-shrink-0" style={{ color: lifeArea.color }}>
            {lifeArea.icon}
          </div>
        )}
        <p className={`text-sm truncate flex-1 ${todo.completed ? 'line-through' : ''}`}>
          {todo.title}
        </p>
      </div>
    </div>
  );
}

// Droppable Time Slot
function TimeSlot({ 
  slot, 
  blocks, 
  //onDrop,
  onRemove 
}: { 
  slot: { startTime: string; endTime: string; hour: number };
  blocks: TimeBlock[];
  onDrop: (item: { habit?: Habit; todo?: Todo }, time: string) => void;
  onRemove: (blockId: string) => void;
}) {
  const { themeColors } = useTheme();

//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: ['habit', 'todo'],
//     drop: (item: { habit?: Habit; todo?: Todo }) => {
//       onDrop(item, slot.startTime);
//     },
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   }));

  const hasBlocks = blocks.length > 0;

  return (
    <div className="flex gap-0">
      {/* Time label - Always visible on the left */}
      <div className="w-16 flex-shrink-0 flex items-start justify-center pt-3">
        <span className="text-xs opacity-50">{slot.startTime}</span>
      </div>

      {/* Timeline bar - Visual representation */}
      <div className="w-2 flex-shrink-0 relative">
        {hasBlocks ? (
          // Colored bar by life area
          <div className="absolute inset-0 flex flex-col">
            {blocks.map((block, index) => {
              const lifeArea = LIFE_AREAS.find(area => area.name === block.lifeArea);
              const bgColor = lifeArea?.color || themeColors.primary;
              
              return (
                < div
                  key={block.id}

                  className="flex-1 rounded-sm"
                  style={{
                    backgroundColor: bgColor,
                    marginBottom: index < blocks.length - 1 ? '2px' : '0',
                  }}
                />
              );
            })}
          </div>
        ) : (
          // Empty state - subtle line
          <div className="absolute inset-0 bg-gray-200 rounded-sm" />
        )}
      </div>

      {/* Drop zone and blocks */}
      <div 
        // ref={drop}
        // className={`flex-1 min-h-[60px] p-2 rounded-xl transition-all ${
        //   isOver ? 'bg-lavender-50 border-2 border-dashed border-lavender-300' : 'bg-gray-50 border border-transparent'
        // }`}
      >
        {hasBlocks ? (
          <div className="space-y-2">
            {blocks.map(block => {
              const lifeArea = LIFE_AREAS.find(area => area.name === block.lifeArea);
              const bgGradient = lifeArea?.gradient || 'from-lavender-200 to-purple-200';
              
              return (
                < div
                  key={block.id}

                  className={`p-3 rounded-lg bg-gradient-to-r ${bgGradient} relative group`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div style={{ color: lifeArea?.color || themeColors.primary }}>
                        {lifeArea?.icon || <Sparkles size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          {block.habitName || block.todoName || 'Untitled'}
                        </p>
                        <p className="text-xs opacity-60">
                          {block.startTime} - {block.endTime}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(block.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/30 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mt-1 text-xs opacity-70 flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-white/40 rounded">
                      {block.lifeArea}
                    </span>
                    {block.isFlexible && (
                      <span className="px-2 py-0.5 bg-white/40 rounded">Flexible</span>
                    )}
                  </div>
                </ div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs opacity-30">Drop habit or todo here</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TimeFlowScreenProps {
  onNavigate?: (screen: string) => void;
}

export function TimeFlowScreen({ onNavigate }: TimeFlowScreenProps) {
  const { themeColors } = useTheme();
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    // Load time blocks
    const savedBlocks = localStorage.getItem('flowstate-timeblocks');
    if (savedBlocks) {
      setTimeBlocks(JSON.parse(savedBlocks));
    }

    // Load habits
    const savedHabits = localStorage.getItem('flowstate-habits');
    if (savedHabits) {
      const habitsList = JSON.parse(savedHabits);
      setHabits(habitsList.filter((h: any) => h.isActive));
    }

    // Load todos from routine templates
    const savedTemplates = localStorage.getItem('flowstate-routine-templates');
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const allTodos: Todo[] = [];
      
      ['low', 'moderate', 'good'].forEach(level => {
        if (templates[level]) {
          templates[level].forEach((todo: any) => {
            allTodos.push({
              id: todo.id.toString(),
              title: todo.title,
              completed: todo.completed,
              lifeArea: inferLifeArea(todo.title),
            });
          });
        }
      });
      
      setTodos(allTodos.filter(t => !t.completed));
    }
  }, []);

  // Save time blocks
  useEffect(() => {
    if (timeBlocks.length > 0 || localStorage.getItem('flowstate-timeblocks')) {
      localStorage.setItem('flowstate-timeblocks', JSON.stringify(timeBlocks));
    }
  }, [timeBlocks]);

  // Infer life area from todo title (simple heuristic)
  const inferLifeArea = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('work') || lower.includes('project') || lower.includes('meeting')) return 'Work';
    if (lower.includes('exercise') || lower.includes('health') || lower.includes('workout') || lower.includes('meditat')) return 'Health';
    if (lower.includes('social') || lower.includes('friend') || lower.includes('family')) return 'Relationships';
    if (lower.includes('learn') || lower.includes('read') || lower.includes('study')) return 'Personal Growth';
    if (lower.includes('creative') || lower.includes('art') || lower.includes('music')) return 'Creativity';
    if (lower.includes('home') || lower.includes('clean') || lower.includes('tidy')) return 'Home';
    return 'Personal Growth'; // default
  };

  const handleDrop = (item: { habit?: Habit; todo?: Todo }, startTime: string) => {
    const [hour] = startTime.split(':').map(Number);
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      startTime,
      endTime,
      lifeArea: item.habit?.lifeArea || item.todo?.lifeArea || 'Personal Growth',
      habitId: item.habit?.id,
      habitName: item.habit?.name,
      todoId: item.todo?.id,
      todoName: item.todo?.title,
      isFlexible: false,
    };

    setTimeBlocks([...timeBlocks, newBlock]);
    //toast.success('Added to timeline');
  };

  const handleRemoveBlock = (blockId: string) => {
    setTimeBlocks(timeBlocks.filter(b => b.id !== blockId));
    //toast.success('Removed from timeline');
  };

  const getBlocksForSlot = (startTime: string) => {
    return timeBlocks.filter(block => block.startTime === startTime);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen pb-24" >
        {/* Header */}
        < div

          className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-20"
        >
          <div className="flex items-center justify-between mb-4">
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
                  <Clock size={24} style={{ color: themeColors.primary }} />
                  Time Flow
                </h1>
                <p className="text-sm opacity-60">Visual timeline & scheduler</p>
              </div>
            </div>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="px-4 py-2 rounded-2xl text-sm transition-all"
              style={{
                backgroundColor: showSidebar ? themeColors.primary : '#f3f4f6',
                color: showSidebar ? 'white' : '#374151',
              }}
            >
              {showSidebar ? 'Hide' : 'Show'} Sidebar
            </button>
          </div>

          {/* Life Area Legend */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {LIFE_AREAS.map(area => (
              <div
                key={area.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap"
                style={{
                  backgroundColor: `${area.color}20`,
                  border: `1px solid ${area.color}40`,
                }}
              >
                <div style={{ color: area.color }}>{area.icon}</div>
                <span>{area.name}</span>
              </div>
            ))}
          </div>
        </ div>

        {/* Main Content */}
        <div className="flex gap-6 p-6">
          {/* Sidebar - Draggable Items */}
            {showSidebar && (
              < div

                className="w-80 flex-shrink-0 space-y-4"
              >
                {/* Habits */}
                {habits.length > 0 && (
                  <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm opacity-70 mb-3 flex items-center gap-2">
                      <Sparkles size={16} style={{ color: themeColors.primary }} />
                      Your Habits
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                      {habits.slice(0, 10).map(habit => (
                        <DraggableHabit key={habit.id} habit={habit} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Todos */}
                {todos.length > 0 && (
                  <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm opacity-70 mb-3 flex items-center gap-2">
                      <Calendar size={16} style={{ color: themeColors.primary }} />
                      Today's Tasks
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                      {todos.slice(0, 10).map(todo => (
                        <DraggableTodo key={todo.id} todo={todo} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-3xl p-4 border border-lavender-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-lavender-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs opacity-70">
                      <p className="mb-2">Drag habits or tasks onto time slots to schedule your day.</p>
                      <p>Colored bars show life area balance at a glance.</p>
                    </div>
                  </div>
                </div>
              </ div>
            )}

          {/* Timeline */}
          <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
            <div className="space-y-0">
              {TIME_SLOTS.map(slot => (
                <TimeSlot
                  key={slot.startTime}
                  slot={slot}
                  blocks={getBlocksForSlot(slot.startTime)}
                  onDrop={handleDrop}
                  onRemove={handleRemoveBlock}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
