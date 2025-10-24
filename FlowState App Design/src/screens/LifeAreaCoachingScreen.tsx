// import { useState, useEffect } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// import { 
//   Heart, 
//   Briefcase, 
//   Sparkles, 
//   TrendingUp, 
//   Users, 
//   Home as HomeIcon,
//   Palette,
//   DollarSign,
//   ArrowLeft,
//   Target,
//   CheckCircle2,
//   Lightbulb,
//   MessageCircle,
//   Plus
// } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// interface LifeArea {
//   id: string;
//   name: string;
//   icon: any;
//   color: string;
//   gradient: string;
//   description: string;
//   reflectionPrompt: string;
//   aiSuggestions: string[];
// }

// const lifeAreas: LifeArea[] = [
//   {
//     id: 'health',
//     name: 'Health',
//     icon: Heart,
//     color: '#EF4444',
//     gradient: 'from-red-100 to-pink-100',
//     description: 'Physical and mental wellbeing, movement, nutrition, sleep',
//     reflectionPrompt: 'What would 1% healthier look like for you this week?',
//     aiSuggestions: [
//       'Start with a 2-minute morning stretch routine',
//       'Track your water intake with a simple check-in',
//       'Take a 5-minute walk after lunch',
//       'Set a consistent bedtime for 3 nights this week'
//     ]
//   },
//   {
//     id: 'work',
//     name: 'Work & Career',
//     icon: Briefcase,
//     color: '#3B82F6',
//     gradient: 'from-blue-100 to-indigo-100',
//     description: 'Professional growth, productivity, career development',
//     reflectionPrompt: 'What small step would make your workday 1% more focused?',
//     aiSuggestions: [
//       'Block 30 minutes of deep work time each morning',
//       'Learn one new skill related to your field this month',
//       'End each workday by writing tomorrow\'s top 3 priorities',
//       'Practice saying "no" to one non-essential request this week'
//     ]
//   },
//   {
//     id: 'selfcare',
//     name: 'Self-Care',
//     icon: Sparkles,
//     color: '#A78BFA',
//     gradient: 'from-purple-100 to-pink-100',
//     description: 'Rest, boundaries, joy, doing things just for you',
//     reflectionPrompt: 'What\'s one small way you could be kinder to yourself today?',
//     aiSuggestions: [
//       'Schedule 15 minutes of "do nothing" time',
//       'Say one kind thing to yourself in the mirror each morning',
//       'Set a boundary around checking work emails after 7pm',
//       'Do one activity this week that brings you pure joy'
//     ]
//   },
//   {
//     id: 'growth',
//     name: 'Personal Growth',
//     icon: TrendingUp,
//     color: '#10B981',
//     gradient: 'from-green-100 to-emerald-100',
//     description: 'Learning, skills, mindset, becoming who you want to be',
//     reflectionPrompt: 'What\'s one belief or habit that\'s holding you back from growing?',
//     aiSuggestions: [
//       'Read 5 pages of a book that challenges your thinking',
//       'Journal for 3 minutes about what you learned today',
//       'Try one new thing this week that scares you a little',
//       'Reflect on one mistake as a learning opportunity, not a failure'
//     ]
//   },
//   {
//     id: 'relationships',
//     name: 'Relationships',
//     icon: Users,
//     color: '#F59E0B',
//     gradient: 'from-amber-100 to-orange-100',
//     description: 'Connections, communication, quality time with loved ones',
//     reflectionPrompt: 'Who in your life deserves more of your attention and presence?',
//     aiSuggestions: [
//       'Send a thoughtful message to someone you care about',
//       'Put your phone away during one conversation today',
//       'Plan a simple quality time activity with a loved one',
//       'Express gratitude to someone who supported you recently'
//     ]
//   },
//   {
//     id: 'environment',
//     name: 'Environment',
//     icon: HomeIcon,
//     color: '#06B6D4',
//     gradient: 'from-cyan-100 to-blue-100',
//     description: 'Your space, organization, creating a supportive environment',
//     reflectionPrompt: 'What\'s one small change to your space that would make it more peaceful?',
//     aiSuggestions: [
//       'Declutter one drawer or surface',
//       'Add one plant or calming element to your space',
//       'Create a dedicated spot for daily habits (meditation, reading)',
//       'Organize your digital desktop or phone home screen'
//     ]
//   },
//   {
//     id: 'creativity',
//     name: 'Creativity',
//     icon: Palette,
//     color: '#EC4899',
//     gradient: 'from-pink-100 to-rose-100',
//     description: 'Expression, play, making things, trying new ideas',
//     reflectionPrompt: 'When was the last time you made something just for fun?',
//     aiSuggestions: [
//       'Doodle or sketch for 5 minutes without judgment',
//       'Try a new recipe or creative project this week',
//       'Write a paragraph about anything that interests you',
//       'Rearrange something in your space just to see it differently'
//     ]
//   },
//   {
//     id: 'finances',
//     name: 'Finances',
//     icon: DollarSign,
//     color: '#059669',
//     gradient: 'from-emerald-100 to-teal-100',
//     description: 'Money mindset, budgeting, financial health and planning',
//     reflectionPrompt: 'What\'s one small money habit that would make you feel more secure?',
//     aiSuggestions: [
//       'Track your spending for 3 days without judgment',
//       'Set aside $5 into savings this week',
//       'Review one subscription and decide if it still serves you',
//       'Write down one financial goal and break it into tiny steps'
//     ]
//   }
// ];

// interface Goal {
//   id: string;
//   text: string;
//   lifeArea: string;
// }

// interface Habit {
//   id: string;
//   name: string;
//   lifeArea: string;
// }

// export function LifeAreaCoachingScreen() {
//   const { themeColors } = useTheme();
//   const [selectedArea, setSelectedArea] = useState<string | null>(null);
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [habits, setHabits] = useState<Habit[]>([]);
//   const [newGoal, setNewGoal] = useState('');
//   const [showGoalInput, setShowGoalInput] = useState(false);

//   useEffect(() => {
//     const savedGoals = localStorage.getItem('flowstate-lifearea-goals');
//     const savedHabits = localStorage.getItem('flowstate-habits');
    
//     if (savedGoals) setGoals(JSON.parse(savedGoals));
//     if (savedHabits) {
//       const allHabits = JSON.parse(savedHabits);
//       setHabits(allHabits);
//     }
//   }, []);

//   const handleAddGoal = () => {
//     if (newGoal.trim() && selectedArea) {
//       const goal: Goal = {
//         id: Date.now().toString(),
//         text: newGoal.trim(),
//         lifeArea: selectedArea
//       };
//       const updated = [...goals, goal];
//       setGoals(updated);
//       localStorage.setItem('flowstate-lifearea-goals', JSON.stringify(updated));
//       setNewGoal('');
//       setShowGoalInput(false);
//     }
//   };

//   const getAreaProgress = (areaId: string) => {
//     const areaHabits = habits.filter(h => h.lifeArea === areaId);
//     const areaGoals = goals.filter(g => g.lifeArea === areaId);
    
//     // Simple progress based on number of habits and goals
//     const total = areaHabits.length + areaGoals.length;
//     return Math.min(total * 15, 100); // Cap at 100%
//   };

//   if (selectedArea) {
//     const area = lifeAreas.find(a => a.id === selectedArea);
//     if (!area) return null;

//     const areaGoals = goals.filter(g => g.lifeArea === selectedArea);
//     const areaHabits = habits.filter(h => h.lifeArea === selectedArea);
//     const Icon = area.icon;
//     const progress = getAreaProgress(selectedArea);

//     return (
//       <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-gray-50">
//         <div className="max-w-2xl mx-auto p-6">
//           {/* Back button */}
//           <button
//             onClick={() => setSelectedArea(null)}
//             className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <ArrowLeft size={20} />
//             <span>All Life Areas</span>
//           </button>

//           {/* Area header */}
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`bg-gradient-to-br ${area.gradient} rounded-3xl p-8 mb-8 border border-gray-200`}
//           >
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex items-center gap-4">
//                 <div 
//                   className="w-16 h-16 rounded-2xl flex items-center justify-center"
//                   style={{ backgroundColor: area.color }}
//                 >
//                   <Icon size={32} className="text-white" />
//                 </div>
//                 <div>
//                   <h1 className="mb-1" style={{ color: area.color }}>{area.name}</h1>
//                   <p className="text-sm opacity-70">{area.description}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Progress visualization */}
//             <div className="mb-4">
//               <div className="flex items-center justify-between mb-2 text-sm">
//                 <span className="opacity-70">Life Balance Progress</span>
//                 <span style={{ color: area.color }}>{progress}%</span>
//               </div>
//               <div className="flow-card">
//                 <div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progress}%` }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   className="h-full rounded-full"
//                   style={{ backgroundColor: area.color }}
//                 />
//               </div>
//             </div>
//           </ div>

//           {/* Reflection prompt */}
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="flow-card"
//           >
//             <div className="flex items-start gap-3">
//               <div 
//                 className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//                 style={{ backgroundColor: `${area.color}20` }}
//               >
//                 <MessageCircle size={20} style={{ color: area.color }} />
//               </div>
//               <div>
//                 <h3 className="mb-2 text-gray-900">Reflection Prompt</h3>
//                 <p className="text-[var(--color-card-foreground)] leading-relaxed italic">
//                   "{area.reflectionPrompt}"
//                 </p>
//               </div>
//             </div>
//           </ div>

//           {/* Goals overview */}
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="flow-card"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <Target size={20} style={{ color: area.color }} />
//                 <h3 className="text-gray-900">Your Goals</h3>
//               </div>
//               <button
//                 onClick={() => setShowGoalInput(true)}
//                 className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
//                 style={{ color: area.color }}
//               >
//                 <Plus size={16} />
//                 <span>Add</span>
//               </button>
//             </div>

//             {showGoalInput && (
//               <div className="mb-4 flex gap-2">
//                 <input
//                   type="text"
//                   value={newGoal}
//                   onChange={(e) => setNewGoal(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
//                   placeholder="Enter a goal for this area..."
//                   className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2"
//                   style={{ '--tw-ring-color': area.color } as any}
//                   autoFocus
//                 />
//                 <button
//                   onClick={handleAddGoal}
//                   className="px-4 py-2 rounded-xl text-white"
//                   style={{ backgroundColor: area.color }}
//                 >
//                   Add
//                 </button>
//               </div>
//             )}

//             {areaGoals.length > 0 ? (
//               <div className="space-y-2">
//                 {areaGoals.map((goal) => (
//                   <div
//                     key={goal.id}
//                     className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
//                   >
//                     <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: area.color }} />
//                     <span className="text-[var(--color-card-foreground)]">{goal.text}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">
//                 No goals yet. Add one to get started!
//               </p>
//             )}
//           </ div>

//           {/* Current habits */}
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="flow-card"
//           >
//             <div className="flex items-center gap-2 mb-4">
//               <CheckCircle2 size={20} style={{ color: area.color }} />
//               <h3 className="text-gray-900">Active Habits</h3>
//             </div>

//             {areaHabits.length > 0 ? (
//               <div className="space-y-2">
//                 {areaHabits.map((habit) => (
//                   <div
//                     key={habit.id}
//                     className="flex items-center gap-3 p-3 rounded-xl"
//                     style={{ backgroundColor: `${area.color}10` }}
//                   >
//                     <div 
//                       className="w-2 h-2 rounded-full"
//                       style={{ backgroundColor: area.color }}
//                     />
//                     <span className="text-[var(--color-card-foreground)]">{habit.name}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500 italic">
//                 No habits tracked yet in this area.
//               </p>
//             )}
//           </ div>

//           {/* AI suggestions */}
//           <div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200"
//           >
//             <div className="flex items-center gap-2 mb-4">
//               <Lightbulb size={20} className="text-purple-600" />
//               <h3 className="text-purple-900">AI Suggestions</h3>
//             </div>
//             <p className="text-sm text-purple-800 opacity-80 mb-4">
//               Small, actionable steps to improve this life area
//             </p>
//             <div className="space-y-3">
//               {area.aiSuggestions.map((suggestion, index) => (
//                 <div
//                   key={index}
//                   className="flow-card"
//                 >
//                   <div 
//                     className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
//                     style={{ backgroundColor: area.color }}
//                   >
//                     {index + 1}
//                   </div>
//                   <p className="text-[var(--color-card-foreground)] text-sm leading-relaxed">{suggestion}</p>
//                 </div>
//               ))}
//             </div>
//           </ div>
//         </div>
//       </div>
//     );
//   }

//   // Life areas overview
//   return (
//     <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-gray-50">
//       <div className="max-w-2xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div 
//             className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
//             style={{ backgroundColor: themeColors.gradientTo }}
//           >
//             <Sparkles size={32} style={{ color: themeColors.primary }} />
//           </div>
//           <h1 className="mb-2">Life Area Coaching</h1>
//           <p className="opacity-70">
//             Deep dive into each area of your life with personalized guidance
//           </p>
//         </div>

//         {/* Balance wheel visualization */}
//         <div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="flow-card"
//         >
//           <h3 className="text-center mb-6 text-gray-900">Your Life Balance</h3>
//           <div className="grid grid-cols-4 gap-4">
//             {lifeAreas.map((area) => {
//               const progress = getAreaProgress(area.id);
//               return (
//                 <div key={area.id} className="text-center">
//                   <div className="relative w-16 h-16 mx-auto mb-2">
//                     <svg className="transform -rotate-90 w-16 h-16">
//                       <circle
//                         cx="32"
//                         cy="32"
//                         r="28"
//                         stroke="#e5e7eb"
//                         strokeWidth="6"
//                         fill="none"
//                       />
//                       <circle
//                         cx="32"
//                         cy="32"
//                         r="28"
//                         stroke={area.color}
//                         strokeWidth="6"
//                         fill="none"
//                         strokeDasharray={`${(progress / 100) * 176} 176`}
//                         strokeLinecap="round"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <area.icon size={20} style={{ color: area.color }} />
//                     </div>
//                   </div>
//                   <p className="text-xs text-gray-600">{area.name}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </ div>

//         {/* Life area cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {lifeAreas.map((area, index) => {
//             const Icon = area.icon;
//             const progress = getAreaProgress(area.id);
            
//             return (
//               < button
//                 key={area.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setSelectedArea(area.id)}
//                 className={`bg-gradient-to-br ${area.gradient} rounded-2xl p-6 border border-gray-200 text-left hover:shadow-lg transition-all`}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div 
//                     className="w-12 h-12 rounded-xl flex items-center justify-center"
//                     style={{ backgroundColor: area.color }}
//                   >
//                     <Icon size={24} className="text-white" />
//                   </div>
//                   <div 
//                     className="px-2 py-1 rounded-full text-xs"
//                     style={{ 
//                       backgroundColor: 'white',
//                       color: area.color 
//                     }}
//                   >
//                     {progress}%
//                   </div>
//                 </div>
//                 <h3 className="mb-2" style={{ color: area.color }}>{area.name}</h3>
//                 <p className="text-sm opacity-70 line-clamp-2">{area.description}</p>
//               </ button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
