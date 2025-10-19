import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from '../lib/motion-shim';
import { useTheme } from './ThemeContext';
import { 
  Plus, 
  GripVertical, 
  ArrowDown, 
  X, 
  Save, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Clock,
  Lightbulb,
  CheckCircle2,
  Link2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LIFE_AREAS } from './LifeAreaFilterChips';

interface StackedHabit {
  id: string;
  habitId?: string; // Reference to existing habit
  name: string;
  order: number;
  isOptional: boolean;
}

interface Condition {
  id: string;
  type: 'weather' | 'energy' | 'time' | 'mood';
  condition: string;
  swapFromId: string;
  swapToId: string;
  swapToName: string;
}

interface HabitStack {
  id: string;
  name: string;
  lifeArea: string;
  habits: StackedHabit[];
  conditions: Condition[];
  suggestedTimeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  createdAt: string;
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', emoji: '🌅', description: '6am - 12pm' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️', description: '12pm - 5pm' },
  { id: 'evening', label: 'Evening', emoji: '🌆', description: '5pm - 9pm' },
  { id: 'night', label: 'Night', emoji: '🌙', description: '9pm - 12am' },
];

const STACKING_TIPS = [
  'Keep stacks tiny to start — 2-3 habits max',
  'Choose habits that naturally flow together',
  'Stack new habits onto existing strong ones',
  'Make it so easy you can\'t say no',
  'Use physical locations as triggers',
  'The best stack is the one you\'ll actually do',
];

export function HabitStackingScreen() {
  const { themeColors } = useTheme();
  const [stacks, setStacks] = useState<HabitStack[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [availableHabits, setAvailableHabits] = useState<any[]>([]);
  
  // New stack form state
  const [newStackName, setNewStackName] = useState('');
  const [selectedLifeArea, setSelectedLifeArea] = useState('Health');
  const [stackedHabits, setStackedHabits] = useState<StackedHabit[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('morning');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    loadStacks();
    loadAvailableHabits();
    
    // Rotate tips every 8 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % STACKING_TIPS.length);
    }, 8000);

    return () => clearInterval(tipInterval);
  }, []);

  const loadStacks = () => {
    const saved = localStorage.getItem('flowstate-habit-stacks');
    if (saved) {
      setStacks(JSON.parse(saved));
    }
  };

  const loadAvailableHabits = () => {
    const saved = localStorage.getItem('flowstate-habits');
    if (saved) {
      const habits = JSON.parse(saved);
      setAvailableHabits(habits.filter((h: any) => h.isActive));
    }
  };

  const startNewStack = () => {
    setIsCreating(true);
    setNewStackName('');
    setStackedHabits([]);
    setConditions([]);
    setSelectedLifeArea('Health');
    setSelectedTimeSlot('morning');
  };

  const addHabitToStack = (habit: any) => {
    const newHabit: StackedHabit = {
      id: Date.now().toString(),
      habitId: habit.id,
      name: habit.name,
      order: stackedHabits.length,
      isOptional: false,
    };
    setStackedHabits([...stackedHabits, newHabit]);
    setShowAddHabit(false);
    toast.success(`Added "${habit.name}" to stack`);
  };

  const addCustomHabit = (name: string) => {
    if (!name.trim()) return;
    
    const newHabit: StackedHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      order: stackedHabits.length,
      isOptional: false,
    };
    setStackedHabits([...stackedHabits, newHabit]);
    toast.success(`Added "${name}" to stack`);
  };

  const removeHabitFromStack = (id: string) => {
    setStackedHabits(stackedHabits.filter(h => h.id !== id));
    // Also remove any conditions related to this habit
    setConditions(conditions.filter(c => c.swapFromId !== id));
  };

  const toggleOptional = (id: string) => {
    setStackedHabits(stackedHabits.map(h => 
      h.id === id ? { ...h, isOptional: !h.isOptional } : h
    ));
  };

  const addCondition = (fromId: string, toName: string, conditionType: string, conditionValue: string) => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: conditionType as any,
      condition: conditionValue,
      swapFromId: fromId,
      swapToId: Date.now().toString(),
      swapToName: toName,
    };
    setConditions([...conditions, newCondition]);
    setShowAddCondition(false);
    toast.success('Condition added to stack');
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const saveStack = () => {
    if (!newStackName.trim()) {
      toast.error('Please give your stack a name');
      return;
    }

    if (stackedHabits.length < 2) {
      toast.error('Add at least 2 habits to create a stack');
      return;
    }

    const newStack: HabitStack = {
      id: Date.now().toString(),
      name: newStackName,
      lifeArea: selectedLifeArea,
      habits: stackedHabits,
      conditions,
      suggestedTimeSlot: selectedTimeSlot as any,
      createdAt: new Date().toISOString(),
    };

    const updatedStacks = [...stacks, newStack];
    setStacks(updatedStacks);
    localStorage.setItem('flowstate-habit-stacks', JSON.stringify(updatedStacks));
    
    toast.success(`Stack "${newStackName}" created! 🎉`);
    setIsCreating(false);
  };

  const deleteStack = (id: string) => {
    const updatedStacks = stacks.filter(s => s.id !== id);
    setStacks(updatedStacks);
    localStorage.setItem('flowstate-habit-stacks', JSON.stringify(updatedStacks));
    toast.success('Stack deleted');
  };

  return (
    <div 
      className="min-h-screen pb-24 p-4 md:p-6 pt-8"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link2 size={32} style={{ color: themeColors.primary }} />
            <h1>Habit Stacking</h1>
          </div>
          <p className="opacity-70">
            Chain habits together for automatic routines
          </p>
        </motion.div>

        {/* Rotating Tip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 mb-6 flex items-start gap-3"
          >
            <Lightbulb size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">{STACKING_TIPS[currentTip]}</p>
          </motion.div>
        </AnimatePresence>

        {/* Create New Stack Button */}
        {!isCreating && (
          <motion.button
            onClick={startNewStack}
            className="w-full bg-white rounded-3xl p-6 shadow-md mb-6 flex items-center justify-center gap-3 hover:shadow-lg transition-shadow border-2 border-dashed"
            style={{ borderColor: themeColors.primary }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus size={24} style={{ color: themeColors.primary }} />
            <span style={{ color: themeColors.primary }}>Create New Stack</span>
          </motion.button>
        )}

        {/* Stack Builder */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-lg p-6 mb-6 border-2"
              style={{ borderColor: themeColors.primary }}
            >
              {/* Stack Name */}
              <div className="mb-6">
                <label className="block text-sm opacity-60 mb-2">Stack Name</label>
                <input
                  type="text"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  placeholder="e.g., Morning Energy Routine"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 transition-shadow"
                  style={{ 
                    focusRing: `0 0 0 2px ${themeColors.primary}40`,
                  }}
                />
              </div>

              {/* Life Area */}
              <div className="mb-6">
                <label className="block text-sm opacity-60 mb-2">Life Area</label>
                <div className="flex flex-wrap gap-2">
                  {LIFE_AREAS.filter(a => a.id !== 'all').map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedLifeArea(area.id)}
                      className="px-4 py-2 rounded-full text-sm transition-all"
                      style={
                        selectedLifeArea === area.id
                          ? {
                              backgroundColor: themeColors.primary,
                              color: 'white',
                            }
                          : {
                              backgroundColor: '#F3F4F6',
                              color: '#6B7280',
                            }
                      }
                    >
                      {area.emoji} {area.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Time Slot */}
              <div className="mb-6">
                <label className="block text-sm opacity-60 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Suggested Time
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                      className="p-3 rounded-2xl text-center transition-all border-2"
                      style={
                        selectedTimeSlot === slot.id
                          ? {
                              backgroundColor: `${themeColors.primary}20`,
                              borderColor: themeColors.primary,
                            }
                          : {
                              backgroundColor: 'white',
                              borderColor: '#E5E7EB',
                            }
                      }
                    >
                      <div className="text-2xl mb-1">{slot.emoji}</div>
                      <div className="text-sm">{slot.label}</div>
                      <div className="text-xs opacity-60">{slot.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Habit Chain */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm opacity-60">
                    Your Habit Chain ({stackedHabits.length})
                  </label>
                  <button
                    onClick={() => setShowAddHabit(!showAddHabit)}
                    className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors"
                    style={{
                      backgroundColor: `${themeColors.primary}20`,
                      color: themeColors.primary,
                    }}
                  >
                    <Plus size={16} />
                    Add Habit
                  </button>
                </div>

                {/* Add Habit Panel */}
                <AnimatePresence>
                  {showAddHabit && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-gray-50 rounded-2xl"
                    >
                      <p className="text-sm opacity-60 mb-3">
                        Choose an existing habit or create a new one:
                      </p>
                      
                      {/* Custom Habit Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Type a habit name..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addCustomHabit(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <p className="text-xs opacity-50 mt-1">Press Enter to add</p>
                      </div>

                      {/* Existing Habits */}
                      {availableHabits.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {availableHabits.map((habit) => (
                            <button
                              key={habit.id}
                              onClick={() => addHabitToStack(habit)}
                              className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-gray-100 transition-colors text-sm flex items-center justify-between group"
                            >
                              <span>{habit.name}</span>
                              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                Add →
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Draggable Habit List */}
                {stackedHabits.length > 0 ? (
                  <Reorder.Group
                    axis="y"
                    values={stackedHabits}
                    onReorder={setStackedHabits}
                    className="space-y-3"
                  >
                    {stackedHabits.map((habit, index) => (
                      <Reorder.Item
                        key={habit.id}
                        value={habit}
                        className="bg-gradient-to-r from-lavender-50 to-blue-50 rounded-2xl p-4 shadow-sm border border-lavender-200"
                      >
                        <div className="flex items-center gap-3">
                          {/* Drag Handle */}
                          <GripVertical size={20} className="text-gray-400 cursor-grab active:cursor-grabbing" />
                          
                          {/* Order Number */}
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                            style={{ backgroundColor: themeColors.primary, color: 'white' }}
                          >
                            {index + 1}
                          </div>

                          {/* Habit Name */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {index === 0 && <span className="text-xs opacity-60">After I</span>}
                              {index > 0 && index < stackedHabits.length - 1 && (
                                <span className="text-xs opacity-60">then</span>
                              )}
                              {index === stackedHabits.length - 1 && index > 0 && (
                                <span className="text-xs opacity-60">finally</span>
                              )}
                              <span>{habit.name}</span>
                              {habit.isOptional && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                  optional
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <button
                            onClick={() => toggleOptional(habit.id)}
                            className="p-2 rounded-lg hover:bg-white/50 transition-colors text-xs opacity-60 hover:opacity-100"
                          >
                            {habit.isOptional ? 'Required' : 'Optional'}
                          </button>
                          
                          <button
                            onClick={() => removeHabitFromStack(habit.id)}
                            className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <X size={16} className="text-red-500" />
                          </button>
                        </div>

                        {/* Arrow indicator */}
                        {index < stackedHabits.length - 1 && (
                          <div className="flex justify-center mt-2">
                            <ArrowDown size={20} className="text-lavender-400" />
                          </div>
                        )}
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl">
                    <p className="text-sm opacity-60">Add habits to start building your stack</p>
                  </div>
                )}
              </div>

              {/* Conditions */}
              {stackedHabits.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm opacity-60 flex items-center gap-2">
                      <CloudRain size={16} />
                      Optional Conditions
                    </label>
                    <button
                      onClick={() => setShowAddCondition(!showAddCondition)}
                      className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors"
                      style={{
                        backgroundColor: `${themeColors.primaryDark}20`,
                        color: themeColors.primaryDark,
                      }}
                    >
                      <Plus size={16} />
                      Add Condition
                    </button>
                  </div>

                  {/* Add Condition Panel */}
                  <AnimatePresence>
                    {showAddCondition && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 bg-blue-50 rounded-2xl border border-blue-200"
                      >
                        <p className="text-sm mb-3">
                          Create a smart swap based on conditions:
                        </p>
                        <div className="space-y-3">
                          <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm">
                            <option value="">Select condition type...</option>
                            <option value="weather">If weather is rainy</option>
                            <option value="energy">If energy is low</option>
                            <option value="time">If running late</option>
                            <option value="mood">If mood is low</option>
                          </select>
                          
                          <div className="flex gap-2 items-center text-sm">
                            <span className="opacity-60">Swap</span>
                            <select className="flex-1 px-3 py-2 rounded-xl border border-gray-200">
                              <option value="">Select habit...</option>
                              {stackedHabits.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                              ))}
                            </select>
                            <span className="opacity-60">→</span>
                            <input
                              type="text"
                              placeholder="Alternative habit"
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-200"
                            />
                          </div>
                          
                          <button
                            className="w-full py-2 rounded-xl text-sm"
                            style={{
                              backgroundColor: themeColors.primaryDark,
                              color: 'white',
                            }}
                          >
                            Add Condition
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Existing Conditions */}
                  {conditions.length > 0 && (
                    <div className="space-y-2">
                      {conditions.map((condition) => {
                        const fromHabit = stackedHabits.find(h => h.id === condition.swapFromId);
                        return (
                          <div
                            key={condition.id}
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-sm"
                          >
                            <CloudRain size={16} className="text-blue-600" />
                            <span className="flex-1">
                              <span className="opacity-60">If {condition.condition}, swap </span>
                              <span className="font-medium">{fromHabit?.name}</span>
                              <span className="opacity-60"> → </span>
                              <span className="font-medium">{condition.swapToName}</span>
                            </span>
                            <button
                              onClick={() => removeCondition(condition.id)}
                              className="p-1 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <X size={14} className="text-red-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStack}
                  className="flex-1 py-3 rounded-2xl text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <Save size={20} />
                  Save Stack
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Stacks */}
        {stacks.length > 0 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2">
              <Sparkles size={24} style={{ color: themeColors.primary }} />
              Your Habit Stacks
            </h2>
            
            {stacks.map((stack, index) => (
              <motion.div
                key={stack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3>{stack.name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs" style={{
                        backgroundColor: `${themeColors.primary}20`,
                        color: themeColors.primary,
                      }}>
                        {LIFE_AREAS.find(a => a.id === stack.lifeArea)?.emoji} {stack.lifeArea}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-60">
                      <Clock size={14} />
                      {TIME_SLOTS.find(t => t.id === stack.suggestedTimeSlot)?.emoji}{' '}
                      {TIME_SLOTS.find(t => t.id === stack.suggestedTimeSlot)?.label}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteStack(stack.id)}
                    className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <X size={20} className="text-red-500" />
                  </button>
                </div>

                {/* Habit Chain Preview */}
                <div className="space-y-2">
                  {stack.habits.map((habit, idx) => (
                    <div key={habit.id}>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                          style={{ 
                            backgroundColor: `${themeColors.primary}30`,
                            color: themeColors.primary 
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          {idx === 0 && <span className="text-xs opacity-60 mr-2">After I</span>}
                          {idx > 0 && idx < stack.habits.length - 1 && (
                            <span className="text-xs opacity-60 mr-2">then</span>
                          )}
                          {idx === stack.habits.length - 1 && idx > 0 && (
                            <span className="text-xs opacity-60 mr-2">finally</span>
                          )}
                          <span className="text-sm">{habit.name}</span>
                          {habit.isOptional && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                              optional
                            </span>
                          )}
                        </div>
                      </div>
                      {idx < stack.habits.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowDown size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Conditions */}
                {stack.conditions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs opacity-60 mb-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Smart Swaps
                    </p>
                    {stack.conditions.map((condition) => {
                      const fromHabit = stack.habits.find(h => h.id === condition.swapFromId);
                      return (
                        <div key={condition.id} className="text-xs bg-blue-50 rounded-lg p-2 mb-2">
                          <CloudRain size={12} className="inline text-blue-600 mr-1" />
                          If {condition.condition}: {fromHabit?.name} → {condition.swapToName}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: `${themeColors.primary}20`,
                      color: themeColors.primary,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Start Stack
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {stacks.length === 0 && !isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="mb-2 opacity-80">No habit stacks yet</h3>
            <p className="text-sm opacity-60 mb-6">
              Create your first stack to chain habits together
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
