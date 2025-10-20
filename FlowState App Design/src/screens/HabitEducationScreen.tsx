// import { useState } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// import { 
//   Repeat,
//   Zap,
//   Target,
//   Home,
//   Link2,
//   Timer,
//   TrendingUp,
//   Calendar,
//   Brain,
//   Gift,
//   Lightbulb,
//   ArrowRight,
//   X,
//   CheckCircle2,
//   Sparkles
// } from 'lucide-react';
// //  from '../lib/motion-shim';
// import { toast } from 'sonner@2.0.3';

// interface HabitCard {
//   id: string;
//   title: string;
//   icon: any;
//   color: string;
//   explanation: string;
//   visual: 'loop' | 'stack' | 'environment' | 'identity' | 'consistency' | 'timing' | 'reward' | 'trigger' | 'plateau' | 'bundle';
//   tryItPrompt: string;
//   tryItPlaceholder: string;
//   tryItExample: string;
// }

// const HABIT_CARDS: HabitCard[] = [
//   {
//     id: 'habit-loops',
//     title: 'Habit Loops',
//     icon: Repeat,
//     color: '#a78bfa',
//     explanation: 'Every habit follows a pattern: Cue → Routine → Reward. Understanding this loop helps you build better habits and break bad ones.',
//     visual: 'loop',
//     tryItPrompt: 'Map out a habit loop for one of your habits:',
//     tryItPlaceholder: 'Example:\nCue: Wake up\nRoutine: Drink water\nReward: Feel refreshed',
//     tryItExample: 'Cue: Morning alarm • Routine: Morning stretch • Reward: Feel energized',
//   },
//   {
//     id: 'triggers-rewards',
//     title: 'Triggers & Rewards',
//     icon: Zap,
//     color: '#f59e0b',
//     explanation: 'Triggers (cues) start your habits. Rewards reinforce them. Make triggers obvious and rewards satisfying to build lasting habits.',
//     visual: 'trigger',
//     tryItPrompt: 'Identify a trigger and reward for a habit you want to build:',
//     tryItPlaceholder: 'Trigger: After I pour my coffee...\nHabit: I will journal for 2 minutes\nReward: I feel accomplished',
//     tryItExample: 'Trigger: Phone on charger • Habit: Evening stretch • Reward: Better sleep',
//   },
//   {
//     id: 'identity-based',
//     title: 'Identity-Based Habits',
//     icon: Target,
//     color: '#ec4899',
//     explanation: 'Don\'t focus on goals—focus on who you want to become. "I\'m a runner" is more powerful than "I want to run more."',
//     visual: 'identity',
//     tryItPrompt: 'Reframe a goal as an identity statement:',
//     tryItPlaceholder: 'Instead of: "I want to exercise more"\nReframe: "I am someone who moves my body daily"',
//     tryItExample: 'I am someone who prioritizes rest and recovery',
//   },
//   {
//     id: 'environment-design',
//     title: 'Environment Design',
//     icon: Home,
//     color: '#10b981',
//     explanation: 'Your environment shapes your behavior. Make good habits easy and visible, bad habits hard and hidden.',
//     visual: 'environment',
//     tryItPrompt: 'Design your environment for one habit:',
//     tryItPlaceholder: 'Habit: Drink more water\nEnvironment change: Keep water bottle on desk',
//     tryItExample: 'Habit: Read before bed • Change: Book on pillow, phone in other room',
//   },
//   {
//     id: 'habit-stacking',
//     title: 'Habit Stacking',
//     icon: Link2,
//     color: '#3b82f6',
//     explanation: 'Link a new habit to an existing one. "After I [current habit], I will [new habit]." This creates automatic cues.',
//     visual: 'stack',
//     tryItPrompt: 'Create a habit stack:',
//     tryItPlaceholder: 'After I [existing habit], I will [new habit].\n\nExample: After I brush my teeth, I will do 5 push-ups.',
//     tryItExample: 'After I close my laptop, I will write 3 gratitudes',
//   },
//   {
//     id: 'two-minute-rule',
//     title: 'The 2-Minute Rule',
//     icon: Timer,
//     color: '#8b5cf6',
//     explanation: 'Start new habits with a version that takes less than 2 minutes. "Read 30 pages" becomes "Read 1 page."',
//     visual: 'timing',
//     tryItPrompt: 'Scale down a habit to 2 minutes:',
//     tryItPlaceholder: 'Big habit: Meditate for 20 minutes\n2-min version: Take 3 deep breaths',
//     tryItExample: 'Big: Write 1000 words • 2-min: Write 1 sentence',
//   },
//   {
//     id: 'consistency-over-intensity',
//     title: 'Consistency Over Intensity',
//     icon: TrendingUp,
//     color: '#f97316',
//     explanation: 'Showing up matters more than how hard you go. Daily 10-minute walks beat occasional 2-hour gym sessions.',
//     visual: 'consistency',
//     tryItPrompt: 'Choose consistency over intensity for one habit:',
//     tryItPlaceholder: 'Instead of: Workout 90 min on weekends\nConsistent version: Move 15 min every day',
//     tryItExample: 'Instead of: Deep clean monthly • Consistent: Tidy 5 min daily',
//   },
//   {
//     id: 'implementation-intentions',
//     title: 'Implementation Intentions',
//     icon: Calendar,
//     color: '#06b6d4',
//     explanation: 'Be specific about when and where. "I will exercise" vs "I will walk for 10 minutes at 7am in my living room."',
//     visual: 'timing',
//     tryItPrompt: 'Create an implementation intention:',
//     tryItPlaceholder: 'I will [habit] at [time] in [location].\n\nExample: I will stretch at 8am in my bedroom.',
//     tryItExample: 'I will journal at 9pm at my desk with tea',
//   },
//   {
//     id: 'plateau-of-latent-potential',
//     title: 'The Plateau of Latent Potential',
//     icon: Brain,
//     color: '#14b8a6',
//     explanation: 'Habits often feel ineffective early on because results lag behind effort. Trust the process—change takes time.',
//     visual: 'plateau',
//     tryItPrompt: 'Reflect on a habit that\'s in the "valley of disappointment":',
//     tryItPlaceholder: 'Habit I\'m building: ___\nHow long I\'ve done it: ___\nWhy I\'ll keep going: ___',
//     tryItExample: 'Meditation feels pointless now, but I trust it compounds over time',
//   },
//   {
//     id: 'temptation-bundling',
//     title: 'Temptation Bundling',
//     icon: Gift,
//     color: '#ef4444',
//     explanation: 'Pair a habit you need to do with one you want to do. "I can watch my favorite show while on the treadmill."',
//     visual: 'bundle',
//     tryItPrompt: 'Bundle a needed habit with a wanted one:',
//     tryItPlaceholder: 'I will [habit I need] while [habit I want].\n\nExample: I will walk while listening to podcasts.',
//     tryItExample: 'I will do stretches while watching evening shows',
//   },
// ];

// export function HabitEducationScreen() {
//   const { themeColors } = useTheme();
//   const [selectedCard, setSelectedCard] = useState<HabitCard | null>(null);
//   const [userInput, setUserInput] = useState('');
//   const [completedCards, setCompletedCards] = useState<string[]>(() => {
//     const saved = localStorage.getItem('flowstate-habit-education-completed');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const handleTryIt = () => {
//     if (!selectedCard) return;
    
//     if (!userInput.trim()) {
//       toast.error('Please fill in your response first');
//       return;
//     }

//     // Save to completed
//     if (!completedCards.includes(selectedCard.id)) {
//       const updated = [...completedCards, selectedCard.id];
//       setCompletedCards(updated);
//       localStorage.setItem('flowstate-habit-education-completed', JSON.stringify(updated));
//     }

//     // Save the user's work
//     const savedWork = JSON.parse(localStorage.getItem('flowstate-habit-education-work') || '{}');
//     savedWork[selectedCard.id] = {
//       input: userInput,
//       timestamp: new Date().toISOString(),
//     };
//     localStorage.setItem('flowstate-habit-education-work', JSON.stringify(savedWork));

//     toast.success('Great work! Applied to your habits 🌟', {
//       duration: 3000,
//     });

//     setUserInput('');
//     setSelectedCard(null);
//   };

//   const renderVisual = (type: string, color: string) => {
//     switch (type) {
//       case 'loop':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80" className="mb-2">
//             <defs>
//               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
//                 <polygon points="0 0, 10 3.5, 0 7" fill={color} />
//               </marker>
//             </defs>
//             <circle cx="40" cy="40" r="20" fill={`${color}30`} stroke={color} strokeWidth="2" />
//             <circle cx="100" cy="40" r="20" fill={`${color}30`} stroke={color} strokeWidth="2" />
//             <circle cx="160" cy="40" r="20" fill={`${color}30`} stroke={color} strokeWidth="2" />
//             <path d="M 60 35 L 80 35" stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" />
//             <path d="M 120 35 L 140 35" stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" />
//             <path d="M 160 60 Q 100 75 40 60" stroke={color} strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" strokeDasharray="3,3" />
//             <text x="40" y="45" textAnchor="middle" fontSize="11" fill={color}>Cue</text>
//             <text x="100" y="45" textAnchor="middle" fontSize="11" fill={color}>Routine</text>
//             <text x="160" y="45" textAnchor="middle" fontSize="11" fill={color}>Reward</text>
//           </svg>
//         );
      
//       case 'stack':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <rect x="50" y="50" width="100" height="20" rx="4" fill={`${color}50`} stroke={color} strokeWidth="2" />
//             <rect x="50" y="25" width="100" height="20" rx="4" fill={`${color}70`} stroke={color} strokeWidth="2" />
//             <rect x="50" y="0" width="100" height="20" rx="4" fill={color} stroke={color} strokeWidth="2" />
//             <text x="100" y="13" textAnchor="middle" fontSize="10" fill="white">New Habit</text>
//             <text x="100" y="38" textAnchor="middle" fontSize="10" fill={color}>Existing Habit</text>
//             <text x="100" y="63" textAnchor="middle" fontSize="10" fill={color}>Daily Routine</text>
//           </svg>
//         );
      
//       case 'environment':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <rect x="20" y="15" width="70" height="50" rx="6" fill={`${color}20`} stroke={color} strokeWidth="2" />
//             <circle cx="55" cy="30" r="8" fill={color} opacity="0.6" />
//             <rect x="110" y="15" width="70" height="50" rx="6" fill={`${color}40`} stroke={color} strokeWidth="2" strokeDasharray="4,4" />
//             <path d="M 90 40 L 110 40" stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" />
//             <text x="55" y="55" textAnchor="middle" fontSize="9" fill={color}>Before</text>
//             <text x="145" y="55" textAnchor="middle" fontSize="9" fill={color}>Optimized</text>
//           </svg>
//         );
      
//       case 'identity':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <circle cx="100" cy="40" r="30" fill={`${color}20`} stroke={color} strokeWidth="2" />
//             <circle cx="100" cy="40" r="20" fill={`${color}40`} stroke={color} strokeWidth="2" />
//             <circle cx="100" cy="40" r="10" fill={color} />
//             <text x="100" y="70" textAnchor="middle" fontSize="10" fill={color}>Identity</text>
//           </svg>
//         );
      
//       case 'consistency':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             {[0, 1, 2, 3, 4, 5, 6].map((i) => (
//               <rect
//                 key={i}
//                 x={20 + i * 25}
//                 y={60 - (i % 2 === 0 ? 20 : 35)}
//                 width="18"
//                 height={i % 2 === 0 ? 20 : 35}
//                 rx="2"
//                 fill={color}
//                 opacity={0.3 + (i * 0.1)}
//               />
//             ))}
//             <path d="M 25 55 L 50 40 L 75 50 L 100 35 L 125 45 L 150 30 L 175 35" stroke={color} strokeWidth="2" fill="none" />
//           </svg>
//         );
      
//       case 'timing':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <circle cx="100" cy="40" r="30" fill="none" stroke={`${color}30`} strokeWidth="2" />
//             <circle cx="100" cy="40" r="30" fill="none" stroke={color} strokeWidth="3" strokeDasharray="30 150" transform="rotate(-90 100 40)" />
//             <line x1="100" y1="40" x2="100" y2="20" stroke={color} strokeWidth="2" />
//             <line x1="100" y1="40" x2="115" y2="40" stroke={color} strokeWidth="2" />
//             <text x="100" y="70" textAnchor="middle" fontSize="10" fill={color}>2 minutes</text>
//           </svg>
//         );
      
//       case 'reward':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <path d="M 40 40 L 80 40 L 80 20 L 100 40 L 80 60 L 80 40" fill={color} opacity="0.4" />
//             <circle cx="150" cy="40" r="20" fill={color} opacity="0.6" />
//             <text x="150" y="45" textAnchor="middle" fontSize="18" fill="white">🎁</text>
//           </svg>
//         );
      
//       case 'trigger':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <circle cx="50" cy="40" r="15" fill={color} opacity="0.8" />
//             <text x="50" y="45" textAnchor="middle" fontSize="16">⚡</text>
//             <path d="M 70 40 L 110 40" stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="4,4" />
//             <rect x="115" y="25" width="70" height="30" rx="4" fill={`${color}40`} stroke={color} strokeWidth="2" />
//             <text x="150" y="45" textAnchor="middle" fontSize="11" fill={color}>Habit</text>
//           </svg>
//         );
      
//       case 'plateau':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <path d="M 20 70 L 50 68 L 80 65 L 110 60 L 140 45 L 170 20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
//             <path d="M 20 70 L 110 70 L 110 60" stroke={`${color}50`} strokeWidth="1" strokeDasharray="3,3" fill="none" />
//             <text x="65" y="75" textAnchor="middle" fontSize="9" fill={color}>Valley of Disappointment</text>
//             <text x="150" y="15" textAnchor="middle" fontSize="9" fill={color}>Results</text>
//           </svg>
//         );
      
//       case 'bundle':
//         return (
//           <svg width="100%" height="80" viewBox="0 0 200 80">
//             <rect x="30" y="20" width="60" height="40" rx="6" fill={`${color}30`} stroke={color} strokeWidth="2" />
//             <text x="60" y="45" textAnchor="middle" fontSize="12">Need</text>
//             <text x="100" y="45" textAnchor="middle" fontSize="20" fill={color}>+</text>
//             <rect x="110" y="20" width="60" height="40" rx="6" fill={`${color}60`} stroke={color} strokeWidth="2" />
//             <text x="140" y="45" textAnchor="middle" fontSize="12">Want</text>
//           </svg>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className="min-h-screen pb-24"
//       style={{
//         background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
//       }}
//     >
//       <div className="p-6 md:p-8 pt-12 md:pt-16">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="mb-8 text-center">
//             <div className="inline-flex items-center gap-2 mb-3">
//               <Lightbulb size={28} style={{ color: themeColors.primary }} />
//               <h1>Learn About Habits</h1>
//             </div>
//             <p className="opacity-70">
//               Understanding the psychology of behavior change
//             </p>
//           </div>

//           {/* Progress */}
//           <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
//             <div className="flex items-center justify-between mb-3">
//               <div className="text-sm opacity-60">Your Progress</div>
//               <div className="text-sm" style={{ color: themeColors.primary }}>
//                 {completedCards.length} / {HABIT_CARDS.length} completed
//               </div>
//             </div>
//             <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
//               < div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${(completedCards.length / HABIT_CARDS.length) * 100}%` }}
//                 transition={{ duration: 0.5 }}
//                 className="h-full rounded-full"
//                 style={{ backgroundColor: themeColors.primary }}
//               />
//             </div>
//           </div>

//           {/* Education Cards Grid */}
//           <div className="grid gap-4 md:grid-cols-2">
//             {HABIT_CARDS.map((card, index) => {
//               const Icon = card.icon;
//               const isCompleted = completedCards.includes(card.id);
              
//               return (
//                 < div
//                   key={card.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   {/* Visual */}
//                   <div 
//                     className="px-6 pt-6 pb-3"
//                     style={{ backgroundColor: `${card.color}10` }}
//                   >
//                     {renderVisual(card.visual, card.color)}
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     <div className="flex items-start gap-3 mb-3">
//                       <div
//                         className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//                         style={{ backgroundColor: `${card.color}20` }}
//                       >
//                         <Icon size={20} style={{ color: card.color }} />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between gap-2 mb-2">
//                           <h3 className="text-base">{card.title}</h3>
//                           {isCompleted && (
//                             <CheckCircle2 size={18} className="flex-shrink-0 mt-1" style={{ color: card.color }} />
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 leading-relaxed">
//                           {card.explanation}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Try It Button */}
//                     < button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setSelectedCard(card)}
//                       className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2 shadow-md transition-all text-sm"
//                       style={{ backgroundColor: card.color }}
//                     >
//                       <Sparkles size={16} />
//                       Try It
//                       <ArrowRight size={16} />
//                     </ button>
//                   </div>
//                 </ div>
//               );
//             })}
//           </div>

//           {/* Encouragement */}
//           {completedCards.length > 0 && (
//             < div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md p-6 border border-purple-200 text-center"
//             >
//               <p className="text-gray-700">
//                 {completedCards.length === HABIT_CARDS.length 
//                   ? "🎉 Amazing! You've completed all the habit lessons!"
//                   : `Great work! You've applied ${completedCards.length} concept${completedCards.length > 1 ? 's' : ''} to your habits. Keep going! 🌟`
//                 }
//               </p>
//             </ div>
//           )}
//         </div>
//       </div>

//       {/* Try It Modal */}
//       <AnimatePresence>
//         {selectedCard && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             < div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//             >
//               {/* Header */}
//               <div 
//                 className="p-6 text-white relative"
//                 style={{ backgroundColor: selectedCard.color }}
//               >
//                 <button
//                   onClick={() => {
//                     setSelectedCard(null);
//                     setUserInput('');
//                   }}
//                   className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
//                 >
//                   <X size={18} />
//                 </button>
                
//                 <div className="flex items-center gap-3 mb-2">
//                   {(() => {
//                     const Icon = selectedCard.icon;
//                     return <Icon size={28} />;
//                   })()}
//                   <h2 className="text-white">{selectedCard.title}</h2>
//                 </div>
//                 <p className="text-white/90 text-sm">{selectedCard.explanation}</p>
//               </div>

//               {/* Content */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 <div className="mb-4">
//                   <h3 className="mb-3">{selectedCard.tryItPrompt}</h3>
                  
//                   <textarea
//                     value={userInput}
//                     onChange={(e) => setUserInput(e.target.value)}
//                     placeholder={selectedCard.tryItPlaceholder}
//                     className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-2 resize-none"
//                     style={{ '--tw-ring-color': selectedCard.color } as any}
//                     rows={6}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = selectedCard.color;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = '#e5e7eb';
//                     }}
//                   />
//                 </div>

//                 {/* Example */}
//                 <div 
//                   className="rounded-xl p-4 border-l-4"
//                   style={{ 
//                     backgroundColor: `${selectedCard.color}10`,
//                     borderColor: selectedCard.color 
//                   }}
//                 >
//                   <div className="text-xs opacity-60 mb-1">Example:</div>
//                   <p className="text-sm text-gray-700">{selectedCard.tryItExample}</p>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="p-6 border-t border-gray-200">
//                 < button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleTryIt}
//                   className="w-full py-4 rounded-2xl text-white shadow-lg flex items-center justify-center gap-2"
//                   style={{ backgroundColor: selectedCard.color }}
//                 >
//                   <CheckCircle2 size={20} />
//                   Apply to My Habits
//                 </ button>
//               </div>
//             </ div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
