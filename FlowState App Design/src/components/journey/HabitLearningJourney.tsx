// import { useState } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// import { 
//   BookOpen, 
//   CheckCircle2, 
//   Lock, 
//   ArrowRight, 
//   Sparkles,
//   Play,
//   Target,
//   Anchor,
//   RefreshCw,
//   TrendingUp,
//   Brain,
//   Heart
// } from 'lucide-react';
// import { motion } from '../lib/motion-shim';

// interface Module {
//   id: number;
//   title: string;
//   subtitle: string;
//   icon: any;
//   duration: string;
//   content: {
//     mainConcept: string;
//     whyItMatters: string;
//     howToDo: string[];
//     example: string;
//     reflection: string;
//   };
//   color: string;
// }

// const modules: Module[] = [
//   {
//     id: 1,
//     title: 'Start Impossibly Small',
//     subtitle: 'The power of tiny beginnings',
//     icon: Play,
//     duration: '5 min',
//     color: '#A78BFA',
//     content: {
//       mainConcept: 'The best way to start a new habit is to make it so small that it feels laughably easy.',
//       whyItMatters: "Most habits fail not from lack of motivation, but from starting too big. When a habit feels easy, you're more likely to do it — and doing it is what matters most.",
//       howToDo: [
//         'Choose a habit you want to build (e.g., exercise, reading, meditation)',
//         'Reduce it to 2 minutes or less: "1 push-up," "read 1 page," "take 3 breaths"',
//         'Commit to doing just that tiny version every day for 2 weeks',
//         'Focus on showing up, not on results'
//       ],
//       example: 'Instead of "meditate for 20 minutes," start with "sit on my meditation cushion for 30 seconds." Once the habit of sitting becomes automatic, you can naturally extend the time.',
//       reflection: 'What\'s one habit you\'ve been putting off because it feels too big? How could you make it impossibly small?'
//     }
//   },
//   {
//     id: 2,
//     title: 'Anchor to What Already Exists',
//     subtitle: 'Habit stacking for success',
//     icon: Anchor,
//     duration: '6 min',
//     color: '#F59E0B',
//     content: {
//       mainConcept: 'The easiest way to remember a new habit is to attach it to something you already do every day.',
//       whyItMatters: 'Your brain loves routines. By linking a new behavior to an existing habit, you borrow the automatic nature of the old habit to help the new one stick.',
//       howToDo: [
//         'List 5-10 things you do every single day without thinking (e.g., brush teeth, make coffee, sit at desk)',
//         'Choose one as your "anchor"',
//         'Create a simple formula: "After I [anchor habit], I will [new tiny habit]"',
//         'Place a visual reminder near your anchor (sticky note, object)'
//       ],
//       example: '"After I pour my morning coffee, I will write down one thing I\'m grateful for." The coffee becomes the trigger, and gratitude becomes automatic.',
//       reflection: 'Which existing daily habit could serve as a strong anchor for something new you want to build?'
//     }
//   },
//   {
//     id: 3,
//     title: 'Reframe "Failure" as Data',
//     subtitle: 'Learning from slip-ups',
//     icon: RefreshCw,
//     duration: '7 min',
//     color: '#EC4899',
//     content: {
//       mainConcept: 'Missing a habit isn\'t failure — it\'s feedback. The question isn\'t "Did I fail?" but "What got in the way, and what can I adjust?"',
//       whyItMatters: 'Shame and guilt kill habits. Curiosity and compassion sustain them. When you treat slip-ups as experiments rather than failures, you stay in the game longer.',
//       howToDo: [
//         'When you miss your habit, pause and ask: "What happened?"',
//         'Identify the real obstacle (too tired, forgot, felt overwhelmed)',
//         'Adjust the habit or environment to make it easier next time',
//         'Restart immediately — don\'t wait for Monday or next month'
//       ],
//       example: 'You planned to exercise in the morning but kept hitting snooze. Instead of quitting, you experiment: "What if I lay out my workout clothes the night before?" Or "What if I do 1 jumping jack right when I get out of bed?"',
//       reflection: 'Think of a habit you "failed" at. What was the real obstacle? How could you design around it?'
//     }
//   },
//   {
//     id: 4,
//     title: 'Design Your Environment',
//     subtitle: 'Make good habits obvious',
//     icon: Target,
//     duration: '6 min',
//     color: '#10B981',
//     content: {
//       mainConcept: 'You don\'t need more willpower — you need a better environment. Make desired habits visible and easy, and unwanted habits invisible and hard.',
//       whyItMatters: 'Willpower is limited. Your environment is always working, 24/7. A well-designed space makes good choices automatic and bad choices harder to access.',
//       howToDo: [
//         'For good habits: Make them visible (book on pillow, yoga mat unrolled, water bottle on desk)',
//         'For bad habits: Add friction (phone in another room, junk food on high shelf, delete social media apps)',
//         'Reduce the steps between you and your desired action',
//         'Create a dedicated "habit space" if possible (meditation corner, workout zone)'
//       ],
//       example: 'Want to read more? Place a book on your pillow so you see it before bed. Want to scroll less? Charge your phone in another room at night.',
//       reflection: 'What\'s one small change you could make to your physical space today that would make a good habit easier?'
//     }
//   },
//   {
//     id: 5,
//     title: 'Track with Compassion',
//     subtitle: 'Gentle accountability',
//     icon: TrendingUp,
//     duration: '5 min',
//     color: '#8B5CF6',
//     content: {
//       mainConcept: 'Tracking your habits helps you see progress, but only if it\'s done with kindness, not judgment.',
//       whyItMatters: 'What gets measured gets done — but harsh tracking systems create stress and avoidance. Compassionate tracking celebrates consistency over perfection.',
//       howToDo: [
//         'Use a simple method: check mark, emoji, or color dot',
//         'Track effort, not results: "Did I show up?" not "Was I perfect?"',
//         'Celebrate streaks, but don\'t break down when they end',
//         'Review weekly: notice patterns without self-criticism'
//       ],
//       example: 'Instead of "I only did it 4 out of 7 days — I\'m terrible," try "I showed up 4 times this week! That\'s 4 more than zero. What helped those 4 days work?"',
//       reflection: 'How can you track progress in a way that motivates you rather than shames you?'
//     }
//   },
//   {
//     id: 6,
//     title: 'Build Identity, Not Just Habits',
//     subtitle: 'Become the person who does this',
//     icon: Brain,
//     duration: '8 min',
//     color: '#06B6D4',
//     content: {
//       mainConcept: 'The most powerful habits come from identity change. Instead of "I want to run," think "I am a runner." Be the person, then do the thing.',
//       whyItMatters: 'Behavior that\'s tied to identity is more sustainable than behavior driven by willpower. When running becomes part of who you are, you don\'t need to convince yourself to do it.',
//       howToDo: [
//         'Ask: "What kind of person do I want to become?" (healthy, creative, organized)',
//         'Define what that person does: "A healthy person moves their body daily"',
//         'Use every small action as a vote for that identity',
//         'Speak in identity terms: "I\'m someone who reads," not "I\'m trying to read more"'
//       ],
//       example: 'After one workout: "I\'m the kind of person who takes care of their body." After writing one page: "I\'m a writer." Each action reinforces the identity.',
//       reflection: 'What identity do you want to grow into? How can your daily habits be votes for that person?'
//     }
//   }
// ];

// export function HabitLearningJourney() {
//   const { themeColors } = useTheme();
//   const [completedModules, setCompletedModules] = useState<number[]>(() => {
//     const saved = localStorage.getItem('flowstate-learning-completed');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [currentModule, setCurrentModule] = useState<number | null>(null);

//   const handleCompleteModule = (moduleId: number) => {
//     const updated = [...completedModules, moduleId];
//     setCompletedModules(updated);
//     localStorage.setItem('flowstate-learning-completed', JSON.stringify(updated));
//     setCurrentModule(null);
//   };

//   const handleApplyToLife = () => {
//     // This could navigate to habits screen or open a modal
//     setCurrentModule(null);
//   };

//   const isModuleUnlocked = (moduleId: number) => {
//     if (moduleId === 1) return true;
//     return completedModules.includes(moduleId - 1);
//   };

//   const progressPercentage = (completedModules.length / modules.length) * 100;

//   if (currentModule !== null) {
//     const module = modules.find(m => m.id === currentModule);
//     if (!module) return null;

//     return (
//       <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-gray-50">
//         <div className="max-w-2xl mx-auto p-6">
//           {/* Back button */}
//           <button
//             onClick={() => setCurrentModule(null)}
//             className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <ArrowRight size={20} className="rotate-180" />
//             <span>Back to Journey</span>
//           </button>

//           {/* Module header */}
//           < div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <div 
//               className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
//               style={{ backgroundColor: module.color }}
//             >
//               <module.icon size={32} className="text-white" />
//             </div>
//             <h1 className="mb-2">{module.title}</h1>
//             <p className="opacity-70">{module.subtitle}</p>
//             <div className="flex items-center gap-2 mt-3 text-sm opacity-60">
//               <BookOpen size={16} />
//               <span>{module.duration} read</span>
//             </div>
//           </ div>

//           {/* Content */}
//           < div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="space-y-6"
//           >
//             {/* Main concept */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <h3 className="mb-3 text-gray-900">💡 Main Concept</h3>
//               <p className="text-gray-700 leading-relaxed">{module.content.mainConcept}</p>
//             </div>

//             {/* Why it matters */}
//             <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
//               <h3 className="mb-3 text-blue-900">🎯 Why It Matters</h3>
//               <p className="text-blue-800 leading-relaxed">{module.content.whyItMatters}</p>
//             </div>

//             {/* How to do it */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <h3 className="mb-4 text-gray-900">✨ How To Do It</h3>
//               <ol className="space-y-3">
//                 {module.content.howToDo.map((step, index) => (
//                   <li key={index} className="flex gap-3">
//                     <span 
//                       className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
//                       style={{ backgroundColor: module.color }}
//                     >
//                       {index + 1}
//                     </span>
//                     <span className="text-gray-700 leading-relaxed">{step}</span>
//                   </li>
//                 ))}
//               </ol>
//             </div>

//             {/* Example */}
//             <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
//               <h3 className="mb-3 text-green-900">📖 Real Example</h3>
//               <p className="text-green-800 leading-relaxed italic">{module.content.example}</p>
//             </div>

//             {/* Reflection */}
//             <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
//               <h3 className="mb-3 text-purple-900">🤔 Reflect On This</h3>
//               <p className="text-purple-800 leading-relaxed">{module.content.reflection}</p>
//             </div>

//             {/* Action buttons */}
//             <div className="flex flex-col gap-3 pt-4">
//               {!completedModules.includes(module.id) && (
//                 < button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => handleCompleteModule(module.id)}
//                   className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 shadow-lg"
//                   style={{ backgroundColor: themeColors.primary }}
//                 >
//                   <CheckCircle2 size={20} />
//                   <span>Mark as Complete</span>
//                 </ button>
//               )}
              
//               < button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleApplyToLife}
//                 className="w-full py-4 rounded-2xl border-2 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-colors"
//                 style={{ borderColor: themeColors.primary, color: themeColors.primary }}
//               >
//                 <Sparkles size={20} />
//                 <span>Apply to My Life</span>
//               </ button>
//             </div>
//           </ div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-gray-50">
//       <div className="max-w-2xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: themeColors.gradientTo }}>
//             <BookOpen size={32} style={{ color: themeColors.primary }} />
//           </div>
//           <h1 className="mb-2">Habit Learning Journey</h1>
//           <p className="opacity-70 mb-6">
//             A step-by-step course on building habits that actually stick
//           </p>
          
//           {/* Progress bar */}
//           <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
//             < div
//               initial={{ width: 0 }}
//               animate={{ width: `${progressPercentage}%` }}
//               transition={{ duration: 0.5 }}
//               className="h-full rounded-full"
//               style={{ backgroundColor: themeColors.primary }}
//             />
//           </div>
//           <p className="text-sm opacity-60 mt-2">
//             {completedModules.length} of {modules.length} modules complete
//           </p>
//         </div>

//         {/* Learning path */}
//         <div className="relative">
//           {/* Connection line */}
//           <div 
//             className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200"
//             style={{ zIndex: 0 }}
//           />

//           <div className="space-y-6 relative" style={{ zIndex: 1 }}>
//             {modules.map((module, index) => {
//               const isCompleted = completedModules.includes(module.id);
//               const isUnlocked = isModuleUnlocked(module.id);
//               const Icon = module.icon;

//               return (
//                 < div
//                   key={module.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <button
//                     onClick={() => isUnlocked && setCurrentModule(module.id)}
//                     disabled={!isUnlocked}
//                     className={`w-full bg-white rounded-2xl p-6 shadow-sm border-2 transition-all text-left ${
//                       isUnlocked ? 'hover:shadow-md hover:scale-[1.02]' : 'opacity-50 cursor-not-allowed'
//                     }`}
//                     style={{
//                       borderColor: isCompleted ? module.color : isUnlocked ? '#e5e7eb' : '#f3f4f6'
//                     }}
//                   >
//                     <div className="flex items-start gap-4">
//                       {/* Icon */}
//                       <div 
//                         className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//                         style={{ 
//                           backgroundColor: isCompleted ? module.color : isUnlocked ? `${module.color}20` : '#f3f4f6'
//                         }}
//                       >
//                         {isCompleted ? (
//                           <CheckCircle2 size={24} className="text-white" />
//                         ) : isUnlocked ? (
//                           <Icon size={24} style={{ color: module.color }} />
//                         ) : (
//                           <Lock size={24} className="text-gray-400" />
//                         )}
//                       </div>

//                       {/* Content */}
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between gap-4 mb-2">
//                           <div>
//                             <h3 className="text-gray-900 mb-1">{module.title}</h3>
//                             <p className="text-sm opacity-70">{module.subtitle}</p>
//                           </div>
//                           {isCompleted && (
//                             <div className="flex-shrink-0 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
//                               Complete
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2 text-xs opacity-60 mt-3">
//                           <BookOpen size={14} />
//                           <span>{module.duration}</span>
//                           {!isUnlocked && (
//                             <>
//                               <span>•</span>
//                               <Lock size={14} />
//                               <span>Complete previous module to unlock</span>
//                             </>
//                           )}
//                         </div>
//                       </div>

//                       {/* Arrow */}
//                       {isUnlocked && (
//                         <ArrowRight size={20} className="text-gray-400 flex-shrink-0 mt-1" />
//                       )}
//                     </div>
//                   </button>
//                 </ div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Completion message */}
//         {completedModules.length === modules.length && (
//           < div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 text-center"
//           >
//             <div className="text-4xl mb-3">🎉</div>
//             <h3 className="mb-2 text-purple-900">Journey Complete!</h3>
//             <p className="text-purple-800 opacity-80">
//               You've completed all modules. Now go apply what you've learned to build habits that last.
//             </p>
//           </ div>
//         )}
//       </div>
//     </div>
//   );
// }
