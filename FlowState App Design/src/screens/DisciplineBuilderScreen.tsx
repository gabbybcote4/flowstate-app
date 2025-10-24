// import { useState, useEffect } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// import { 
//   Sparkles, 
//   TrendingUp, 
//   Star, 
//   Calendar,
//   CheckCircle2,
//   BookOpen,
//   Target,
//   Heart,
//   Zap,
//   Award,
//   Plus,
//   ChevronRight,
//   ArrowRight
// } from 'lucide-react';
// //  from '../lib/motion-shim';
// import { toast } from 'sonner@2.0.3';

// interface DailyReflection {
//   date: string;
//   whatMadeItEasier: string;
//   showedUp: boolean;
//   energyLevel: number;
// }

// interface DisciplineProgress {
//   totalShowUps: number;
//   currentLevel: number;
//   points: number;
//   reflections: DailyReflection[];
//   completedModules: string[];
// }

// const DISCIPLINE_MODULES = [
//   {
//     id: 'understanding',
//     title: 'Understanding Discipline',
//     icon: BookOpen,
//     color: '#a78bfa',
//     lessons: [
//       {
//         title: 'Discipline ≠ Punishment',
//         content: "True discipline isn't about forcing yourself to do things you hate. It's about loving yourself enough to show up, even when it's hard. It's self-care in action.",
//       },
//       {
//         title: 'Progress Over Perfection',
//         content: "Discipline is built through consistency, not intensity. Showing up 5 times a week at 70% is better than burning out trying for 100% every day.",
//       },
//       {
//         title: 'The 2-Minute Rule',
//         content: "When resistance feels strong, commit to just 2 minutes. Often, starting is the hardest part. Once you begin, momentum carries you forward.",
//       },
//     ],
//   },
//   {
//     id: 'building-systems',
//     title: 'Building Sustainable Systems',
//     icon: Target,
//     color: '#fb923c',
//     lessons: [
//       {
//         title: 'Environment Design',
//         content: "Make the right choice the easy choice. Want to drink more water? Keep a glass by your bed. Want to exercise? Sleep in your workout clothes.",
//       },
//       {
//         title: 'Habit Stacking',
//         content: "Link new behaviors to existing ones. 'After I pour my coffee, I'll write 3 gratitudes.' This creates automatic cues for discipline.",
//       },
//       {
//         title: 'Energy Mapping',
//         content: "Notice when you have the most energy and focus. Schedule your most important discipline practices during these peak windows.",
//       },
//     ],
//   },
//   {
//     id: 'resilience',
//     title: 'Building Resilience',
//     icon: Heart,
//     color: '#f472b6',
//     lessons: [
//       {
//         title: 'The Comeback Is Stronger',
//         content: "Missing a day doesn't erase your progress. What matters is how quickly you return. One day off, then back on track — that's resilience.",
//       },
//       {
//         title: 'Self-Compassion Fuels Discipline',
//         content: "Being harsh with yourself creates resistance. Being kind creates safety. When you feel safe, showing up becomes easier.",
//       },
//       {
//         title: 'Reframe Failure',
//         content: "There's no failure, only feedback. Each 'miss' teaches you something about your patterns, triggers, and what support you need.",
//       },
//     ],
//   },
// ];

// const DAILY_REMINDERS = [
//   "Discipline is choosing what you want most over what you want now.",
//   "You don't have to feel motivated to take action. Action creates motivation.",
//   "Small, consistent steps compound into extraordinary results.",
//   "Every time you show up, you're proving to yourself that you're trustworthy.",
//   "Discipline isn't about being perfect. It's about being persistent.",
//   "The version of you that you want to become is built through today's choices.",
//   "Rest is part of discipline. Pushing too hard leads to burnout.",
//   "You're not behind. You're exactly where you need to be, learning what you need to learn.",
// ];

// const REFLECTION_PROMPTS = [
//   "What made it easier to show up today?",
//   "What obstacle did you overcome today?",
//   "What did you learn about yourself today?",
//   "What small win can you celebrate?",
//   "What would make tomorrow even 1% easier?",
//   "What are you proud of yourself for?",
// ];

// // Growth levels based on total show-ups
// function calculateLevel(points: number): { level: number; title: string; nextLevelPoints: number } {
//   const levels = [
//     { min: 0, max: 49, level: 1, title: 'Seedling' },
//     { min: 50, max: 99, level: 2, title: 'Sprout' },
//     { min: 100, max: 199, level: 3, title: 'Growing Stem' },
//     { min: 200, max: 349, level: 4, title: 'Young Plant' },
//     { min: 350, max: 549, level: 5, title: 'Blooming Flower' },
//     { min: 550, max: 799, level: 6, title: 'Thriving Garden' },
//     { min: 800, max: 1099, level: 7, title: 'Wise Oak' },
//     { min: 1100, max: 1499, level: 8, title: 'Ancient Tree' },
//     { min: 1500, max: 1999, level: 9, title: 'Forest Guardian' },
//     { min: 2000, max: Infinity, level: 10, title: 'Master of Seasons' },
//   ];
  
//   const currentLevel = levels.find(l => points >= l.min && points <= l.max) || levels[0];
//   const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
  
//   return {
//     level: currentLevel.level,
//     title: currentLevel.title,
//     nextLevelPoints: nextLevel ? nextLevel.min : 2000,
//   };
// }

// export function DisciplineBuilderScreen() {
//   const { themeColors } = useTheme();
//   const [progress, setProgress] = useState<DisciplineProgress>({
//     totalShowUps: 0,
//     currentLevel: 1,
//     points: 0,
//     reflections: [],
//     completedModules: [],
//   });
//   const [selectedModule, setSelectedModule] = useState<string | null>(null);
//   const [currentLesson, setCurrentLesson] = useState(0);
//   const [showReflection, setShowReflection] = useState(false);
//   const [reflectionText, setReflectionText] = useState('');
//   const [todayShownUp, setTodayShownUp] = useState(false);
//   const [dailyReminder, setDailyReminder] = useState('');

//   // Load progress from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem('flowstate-discipline-progress');
//     if (saved) {
//       const data = JSON.parse(saved);
//       setProgress(data);
//     }
    
//     // Check if shown up today
//     const today = new Date().toDateString();
//     const savedDate = localStorage.getItem('flowstate-discipline-showup-date');
//     if (savedDate === today) {
//       setTodayShownUp(true);
//     }
    
//     // Set daily reminder
//     const reminderIndex = new Date().getDate() % DAILY_REMINDERS.length;
//     setDailyReminder(DAILY_REMINDERS[reminderIndex]);
//   }, []);

//   // Save progress whenever it changes
//   useEffect(() => {
//     localStorage.setItem('flowstate-discipline-progress', JSON.stringify(progress));
//   }, [progress]);

//   const handleShowUp = () => {
//     const today = new Date().toDateString();
//     const newPoints = progress.points + 10; // 10 points per show-up
//     const levelInfo = calculateLevel(newPoints);
    
//     setProgress({
//       ...progress,
//       totalShowUps: progress.totalShowUps + 1,
//       points: newPoints,
//       currentLevel: levelInfo.level,
//     });
    
//     setTodayShownUp(true);
//     localStorage.setItem('flowstate-discipline-showup-date', today);
    
//     // Check for level up
//     if (levelInfo.level > progress.currentLevel) {
//       toast.success(`🎉 Level Up! You're now a ${levelInfo.title}!`, {
//         duration: 5000,
//       });
//     } else {
//       toast.success('💜 +10 points! You showed up today!', {
//         duration: 3000,
//       });
//     }
    
//     setShowReflection(true);
//   };

//   const handleReflectionSubmit = () => {
//     if (!reflectionText.trim()) {
//       toast.error('Please share your reflection first');
//       return;
//     }
    
//     const newReflection: DailyReflection = {
//       date: new Date().toDateString(),
//       whatMadeItEasier: reflectionText,
//       showedUp: true,
//       energyLevel: 3,
//     };
    
//     setProgress({
//       ...progress,
//       reflections: [newReflection, ...progress.reflections].slice(0, 30), // Keep last 30
//     });
    
//     setReflectionText('');
//     setShowReflection(false);
//     toast.success('Reflection saved! 🌸');
//   };

//   const handleCompleteModule = (moduleId: string) => {
//     if (!progress.completedModules.includes(moduleId)) {
//       const newPoints = progress.points + 50; // 50 points for completing a module
//       const levelInfo = calculateLevel(newPoints);
      
//       setProgress({
//         ...progress,
//         completedModules: [...progress.completedModules, moduleId],
//         points: newPoints,
//         currentLevel: levelInfo.level,
//       });
      
//       if (levelInfo.level > progress.currentLevel) {
//         toast.success(`🎉 Level Up! You're now a ${levelInfo.title}!`, {
//           duration: 5000,
//         });
//       } else {
//         toast.success('✨ +50 points! Module complete!', {
//           duration: 3000,
//         });
//       }
//     }
    
//     setSelectedModule(null);
//     setCurrentLesson(0);
//   };

//   const levelInfo = calculateLevel(progress.points);
//   const progressToNextLevel = levelInfo.nextLevelPoints > 0 
//     ? ((progress.points % levelInfo.nextLevelPoints) / levelInfo.nextLevelPoints) * 100
//     : 100;

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
//               <TrendingUp size={28} style={{ color: themeColors.primary }} />
//               <h1>Discipline Builder</h1>
//             </div>
//             <p className="opacity-70">
//               Building consistency through compassion, not perfection
//             </p>
//           </div>

//           {/* Growth Level Card */}
//           < div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl p-6 mb-6 text-white"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <div className="text-sm opacity-90 mb-1">Your Growth Level</div>
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-white">{levelInfo.title}</h2>
//                   <div className="px-3 py-1 bg-[var(--color-card)]/20 rounded-full text-sm">
//                     Level {levelInfo.level}
//                   </div>
//                 </div>
//               </div>
//               <Award size={48} className="opacity-90" />
//             </div>

//             {/* Progress bar */}
//             <div className="mb-3">
//               <div className="bg-[var(--color-card)]/20 rounded-full h-3 overflow-hidden">
//                 < div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressToNextLevel}%` }}
//                   transition={{ duration: 1, ease: 'easeOut' }}
//                   className="bg-[var(--color-card)] h-full rounded-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between text-sm opacity-90">
//               <span>{progress.points} points</span>
//               <span>{levelInfo.nextLevelPoints - progress.points} to next level</span>
//             </div>
//           </ div>

//           {/* Daily Show Up Section */}
//           {!todayShownUp ? (
//             < div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-[var(--color-card)] rounded-3xl shadow-lg p-8 mb-6"
//             >
//               <div className="text-center mb-6">
//                 <Sparkles size={48} className="mx-auto mb-3" style={{ color: themeColors.primary }} />
//                 <h2 className="mb-2">Show Up Today</h2>
//                 <p className="opacity-70">
//                   Discipline isn't about being perfect—it's about being present.
//                   <br />
//                   Click below to mark that you showed up today.
//                 </p>
//               </div>

//               < button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleShowUp}
//                 className="w-full py-5 rounded-2xl text-white shadow-lg text-lg flex items-center justify-center gap-3"
//                 style={{ backgroundColor: themeColors.primary }}
//               >
//                 <CheckCircle2 size={24} />
//                 I'm Showing Up Today (+10 pts)
//               </ button>
//             </ div>
//           ) : (
//             < div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-8 mb-6 border-2 border-green-200"
//             >
//               <div className="text-center">
//                 <CheckCircle2 size={48} className="mx-auto mb-3 text-green-600" />
//                 <h3 className="mb-2 text-green-800">You Showed Up Today! 🎉</h3>
//                 <p className="text-green-700 opacity-80">
//                   That's {progress.totalShowUps} times you've chosen to be present.
//                   <br />
//                   Come back tomorrow to keep building momentum.
//                 </p>
//               </div>
//             </ div>
//           )}

//           {/* Daily Focus Reminder */}
//           < div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-md p-6 mb-6 border border-blue-200"
//           >
//             <div className="flex items-start gap-3">
//               <Zap size={24} className="flex-shrink-0 mt-1 text-blue-600" />
//               <div>
//                 <div className="text-sm opacity-60 mb-1">Today's Focus</div>
//                 <p className="text-[var(--color-card-foreground)]">{dailyReminder}</p>
//               </div>
//             </div>
//           </ div>

//           {/* Learning Modules */}
//           <div className="mb-6">
//             <div className="flex items-center gap-2 mb-4">
//               <BookOpen size={20} style={{ color: themeColors.primary }} />
//               <h3>Learning Modules</h3>
//             </div>

//             <div className="grid gap-3">
//               {DISCIPLINE_MODULES.map((module) => {
//                 const isCompleted = progress.completedModules.includes(module.id);
//                 const Icon = module.icon;
                
//                 return (
//                   < button
//                     key={module.id}
//                     whileHover={{ scale: 1.01 }}
//                     whileTap={{ scale: 0.99 }}
//                     onClick={() => {
//                       setSelectedModule(module.id);
//                       setCurrentLesson(0);
//                     }}
//                     className="bg-[var(--color-card)] rounded-2xl shadow-md p-5 text-left transition-all hover:shadow-lg"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 flex-1">
//                         <div
//                           className="w-12 h-12 rounded-xl flex items-center justify-center"
//                           style={{ backgroundColor: `${module.color}20` }}
//                         >
//                           <Icon size={24} style={{ color: module.color }} />
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="mb-1">{module.title}</h4>
//                           <div className="text-xs opacity-60">
//                             {module.lessons.length} lessons
//                             {isCompleted && ' • Completed ✓'}
//                           </div>
//                         </div>
//                       </div>
//                       <ChevronRight size={20} className="opacity-40" />
//                     </div>
//                   </ button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Recent Reflections */}
//           {progress.reflections.length > 0 && (
//             <div className="mb-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Heart size={20} style={{ color: themeColors.primary }} />
//                 <h3>Your Reflections</h3>
//               </div>

//               <div className="space-y-3">
//                 {progress.reflections.slice(0, 5).map((reflection, index) => (
//                   < div
//                     key={index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="bg-[var(--color-card)] rounded-2xl shadow-md p-5"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${themeColors.primary}20` }}>
//                         <Star size={16} style={{ color: themeColors.primary }} />
//                       </div>
//                       <div className="flex-1">
//                         <div className="text-xs opacity-50 mb-1">
//                           {new Date(reflection.date).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </div>
//                         <p className="text-sm text-[var(--color-card-foreground)]">{reflection.whatMadeItEasier}</p>
//                       </div>
//                     </div>
//                   </ div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-3">
//             <div className="bg-[var(--color-card)] rounded-2xl shadow-md p-4 text-center">
//               <div className="text-2xl mb-1" style={{ color: themeColors.primary }}>
//                 {progress.totalShowUps}
//               </div>
//               <div className="text-xs opacity-60">Show Ups</div>
//             </div>
//             <div className="bg-[var(--color-card)] rounded-2xl shadow-md p-4 text-center">
//               <div className="text-2xl mb-1" style={{ color: themeColors.primary }}>
//                 {progress.completedModules.length}
//               </div>
//               <div className="text-xs opacity-60">Modules</div>
//             </div>
//             <div className="bg-[var(--color-card)] rounded-2xl shadow-md p-4 text-center">
//               <div className="text-2xl mb-1" style={{ color: themeColors.primary }}>
//                 {progress.reflections.length}
//               </div>
//               <div className="text-xs opacity-60">Reflections</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Module Lesson Modal */}
//       <AnimatePresence>
//         {selectedModule && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             < div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-[var(--color-card)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//             >
//               {(() => {
//                 const module = DISCIPLINE_MODULES.find(m => m.id === selectedModule);
//                 if (!module) return null;
                
//                 const lesson = module.lessons[currentLesson];
//                 const Icon = module.icon;
//                 const isLastLesson = currentLesson === module.lessons.length - 1;
                
//                 return (
//                   <>
//                     {/* Header */}
//                     <div 
//                       className="p-6 text-white"
//                       style={{ backgroundColor: module.color }}
//                     >
//                       <div className="flex items-center gap-3 mb-2">
//                         <Icon size={28} />
//                         <h2 className="text-white">{module.title}</h2>
//                       </div>
//                       <div className="text-sm opacity-90">
//                         Lesson {currentLesson + 1} of {module.lessons.length}
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 overflow-y-auto p-6">
//                       <h3 className="mb-4">{lesson.title}</h3>
//                       <p className="text-[var(--color-card-foreground)] leading-relaxed text-lg">
//                         {lesson.content}
//                       </p>
//                     </div>

//                     {/* Footer */}
//                     <div className="p-6 border-t border-gray-200 flex gap-3">
//                       <button
//                         onClick={() => {
//                           setSelectedModule(null);
//                           setCurrentLesson(0);
//                         }}
//                         className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
//                       >
//                         Close
//                       </button>
                      
//                       {!isLastLesson ? (
//                         <button
//                           onClick={() => setCurrentLesson(currentLesson + 1)}
//                           className="flex-1 py-3 rounded-xl text-white shadow-lg flex items-center justify-center gap-2"
//                           style={{ backgroundColor: module.color }}
//                         >
//                           Next Lesson
//                           <ArrowRight size={18} />
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleCompleteModule(module.id)}
//                           className="flex-1 py-3 rounded-xl text-white shadow-lg flex items-center justify-center gap-2"
//                           style={{ backgroundColor: module.color }}
//                         >
//                           Complete Module (+50 pts)
//                           <CheckCircle2 size={18} />
//                         </button>
//                       )}
//                     </div>
//                   </>
//                 );
//               })()}
//             </ div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Reflection Modal */}
//       <AnimatePresence>
//         {showReflection && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             < div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-[var(--color-card)] rounded-3xl max-w-lg w-full p-6"
//             >
//               <div className="text-center mb-6">
//                 <Heart size={48} className="mx-auto mb-3" style={{ color: themeColors.primary }} />
//                 <h3 className="mb-2">Quick Reflection</h3>
//                 <p className="text-sm opacity-70">
//                   {REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]}
//                 </p>
//               </div>

//               <textarea
//                 value={reflectionText}
//                 onChange={(e) => setReflectionText(e.target.value)}
//                 placeholder="Share what's on your mind..."
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 resize-none mb-4"
//                 style={{ '--tw-ring-color': themeColors.primary } as any}
//                 rows={4}
//               />

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowReflection(false);
//                     setReflectionText('');
//                   }}
//                   className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                   Skip
//                 </button>
//                 <button
//                   onClick={handleReflectionSubmit}
//                   className="flex-1 py-3 rounded-xl text-white shadow-lg"
//                   style={{ backgroundColor: themeColors.primary }}
//                 >
//                   Save Reflection
//                 </button>
//               </div>
//             </ div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
