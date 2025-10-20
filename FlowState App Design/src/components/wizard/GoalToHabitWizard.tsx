// import { useState, useEffect } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
//   from '../lib/motion-shim';
// import {
//   Target,
//   Zap,
//   Gift,
//   CheckCircle2,
//   ArrowRight,
//   ArrowLeft,
//   Sparkles,
//   Heart,
//   TrendingUp,
//   Calendar,
//   Award,
//   X,
// } from 'lucide-react';
// import { toast } from 'sonner@2.0.3';

// interface GoalToHabitWizardProps {
//   onComplete: (habit: any) => void;
//   onClose: () => void;
// }

// const LIFE_AREAS = [
//   { name: 'Health', icon: '💚', color: '#10b981', description: 'Physical wellness and vitality' },
//   { name: 'Creativity', icon: '🎨', color: '#a78bfa', description: 'Creative expression' },
//   { name: 'Work', icon: '💼', color: '#3b82f6', description: 'Career and professional growth' },
//   { name: 'Relationships', icon: '💕', color: '#ec4899', description: 'Connections and community' },
//   { name: 'Learning', icon: '📚', color: '#f59e0b', description: 'Knowledge and growth' },
//   { name: 'Home', icon: '🏡', color: '#8b5cf6', description: 'Living space and comfort' },
// ];

// const GOAL_EXAMPLES = [
//   { goal: 'Get fitter', area: 'Health', actions: ['Walk 10 minutes daily', 'Stretch for 5 minutes', 'Drink more water'] },
//   { goal: 'Learn a new skill', area: 'Learning', actions: ['Read 10 pages daily', 'Practice 15 minutes', 'Watch one tutorial'] },
//   { goal: 'Improve relationships', area: 'Relationships', actions: ['Text a friend daily', 'Have one meaningful conversation', 'Express gratitude'] },
//   { goal: 'Be more creative', area: 'Creativity', actions: ['Doodle for 5 minutes', 'Write 3 ideas', 'Try something new'] },
//   { goal: 'Advance my career', area: 'Work', actions: ['Learn one new thing', 'Complete one priority task', 'Network with someone'] },
//   { goal: 'Create a peaceful home', area: 'Home', actions: ['Tidy one surface', 'Light a candle', 'Open the windows'] },
// ];

// const TRIGGER_SUGGESTIONS = [
//   { trigger: 'After I wake up', icon: '☀️' },
//   { trigger: 'After breakfast', icon: '🍳' },
//   { trigger: 'During lunch break', icon: '🥗' },
//   { trigger: 'After work', icon: '🏠' },
//   { trigger: 'Before dinner', icon: '🌆' },
//   { trigger: 'After dinner', icon: '🌙' },
//   { trigger: 'Before bed', icon: '😴' },
// ];

// const REWARD_SUGGESTIONS = [
//   { reward: 'Feel proud of myself', icon: '💪' },
//   { reward: 'Share my progress', icon: '📱' },
//   { reward: 'Enjoy a treat', icon: '🍪' },
//   { reward: 'Relax guilt-free', icon: '😌' },
//   { reward: 'Check it off my list', icon: '✅' },
//   { reward: 'Celebrate the win', icon: '🎉' },
// ];

// const AFFIRMATIONS = [
//   "Small steps create big changes 🌱",
//   "You're building something meaningful ✨",
//   "Every habit starts with one decision 💫",
//   "Progress over perfection, always 🎯",
//   "You're investing in your future self 🌟",
//   "Consistency is the secret ingredient 🔑",
//   "You deserve this growth 💚",
// ];

// export function GoalToHabitWizard({ onComplete, onClose }: GoalToHabitWizardProps) {
//   const { themeColors } = useTheme();
//   const [step, setStep] = useState(1);
//   const [goal, setGoal] = useState('');
//   const [selectedArea, setSelectedArea] = useState('Health');
//   const [action, setAction] = useState('');
//   const [trigger, setTrigger] = useState('');
//   const [reward, setReward] = useState('');
//   const [customTrigger, setCustomTrigger] = useState('');
//   const [customReward, setCustomReward] = useState('');
//   const [affirmation, setAffirmation] = useState('');

//   useEffect(() => {
//     // Set random affirmation
//     setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
//   }, [step]);

//   const handleNext = () => {
//     if (step === 1 && !goal.trim()) {
//       toast.error('Please enter your goal');
//       return;
//     }
//     if (step === 2 && !action.trim()) {
//       toast.error('Please choose a small action');
//       return;
//     }
//     if (step === 3 && !trigger && !customTrigger) {
//       toast.error('Please select or enter a trigger');
//       return;
//     }
    
//     if (step < 4) {
//       setStep(step + 1);
//     } else {
//       handleComplete();
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   const handleComplete = () => {
//     const habit = {
//       id: Date.now().toString(),
//       name: action,
//       purpose: goal,
//       frequency: 'daily' as const,
//       trigger: customTrigger || trigger,
//       motivation: customReward || reward || 'Feel accomplished',
//       lifeArea: selectedArea,
//       streak: 0,
//       completedSlots: [],
//       isActive: true,
//       createdAt: new Date().toISOString(),
//       fromGoalWizard: true,
//     };

//     onComplete(habit);
//     toast.success('🎉 Your habit has been created!');
//   };

//   const selectExample = (example: typeof GOAL_EXAMPLES[0]) => {
//     setGoal(example.goal);
//     setSelectedArea(example.area);
//   };

//   const progress = (step / 4) * 100;

//   return (
//     < div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       < div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//         className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//       >
//         {/* Header */}
//         <div 
//           className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div 
//                 className="w-12 h-12 rounded-2xl flex items-center justify-center"
//                 style={{ backgroundColor: `${themeColors.primary}20` }}
//               >
//                 <Target size={24} style={{ color: themeColors.primary }} />
//               </div>
//               <div>
//                 <h2 className="mb-0">Goal to Habit Wizard</h2>
//                 <p className="text-sm opacity-60">Let's break down your goal together</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Progress Bar */}
//           <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
//             < div
//               className="absolute inset-y-0 left-0 rounded-full"
//               style={{ backgroundColor: themeColors.primary }}
//               initial={{ width: 0 }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>
//           <div className="flex justify-between text-xs opacity-60 mt-2">
//             <span>Step {step} of 4</span>
//             <span>{Math.round(progress)}% Complete</span>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-8">
//           <AnimatePresence mode="wait">
//             {/* Step 1: Define Goal */}
//             {step === 1 && (
//               < div
//                 key="step1"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="space-y-6"
//               >
//                 <div className="text-center mb-6">
//                   < div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: 'spring', delay: 0.2 }}
//                     className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
//                     style={{ backgroundColor: `${themeColors.primary}15` }}
//                   >
//                     <Target size={32} style={{ color: themeColors.primary }} />
//                   </ div>
//                   <h3 className="mb-2">What's your goal?</h3>
//                   <p className="text-sm opacity-70 max-w-md mx-auto">
//                     Think big! We'll help you break it down into small, achievable steps.
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm mb-2 opacity-70">Your goal</label>
//                   <input
//                     type="text"
//                     value={goal}
//                     onChange={(e) => setGoal(e.target.value)}
//                     placeholder="e.g., Get fitter, Learn guitar, Write more..."
//                     className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-lavender-300 transition-colors"
//                     autoFocus
//                   />
//                 </div>

//                 {/* Example Goals */}
//                 <div>
//                   <p className="text-sm opacity-70 mb-3">Or choose an example:</p>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {GOAL_EXAMPLES.map((example, idx) => (
//                       < button
//                         key={idx}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: idx * 0.05 }}
//                         onClick={() => selectExample(example)}
//                         className="text-left p-4 rounded-xl border-2 border-gray-200 hover:border-lavender-300 transition-all"
//                       >
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="text-xl">
//                             {LIFE_AREAS.find(a => a.name === example.area)?.icon}
//                           </span>
//                           <span className="text-sm opacity-90">{example.goal}</span>
//                         </div>
//                       </ button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Affirmation */}
//                 < div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="text-center p-4 rounded-2xl"
//                   style={{ backgroundColor: `${themeColors.primary}10` }}
//                 >
//                   <p className="text-sm" style={{ color: themeColors.primary }}>
//                     {affirmation}
//                   </p>
//                 </ div>
//               </ div>
//             )}

//             {/* Step 2: Choose Action */}
//             {step === 2 && (
//               < div
//                 key="step2"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="space-y-6"
//               >
//                 <div className="text-center mb-6">
//                   < div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: 'spring', delay: 0.2 }}
//                     className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
//                     style={{ backgroundColor: `${themeColors.primary}15` }}
//                   >
//                     <Zap size={32} style={{ color: themeColors.primary }} />
//                   </ div>
//                   <h3 className="mb-2">What's one small action?</h3>
//                   <p className="text-sm opacity-70 max-w-md mx-auto">
//                     Choose something so small it feels almost silly. That's the secret to building lasting habits.
//                   </p>
//                 </div>

//                 {/* Show the goal */}
//                 <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100">
//                   <div className="text-xs opacity-60 mb-1">Your goal</div>
//                   <div className="flex items-center gap-2">
//                     <Target size={16} className="opacity-60" />
//                     <span>{goal}</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm mb-2 opacity-70">Small daily action</label>
//                   <input
//                     type="text"
//                     value={action}
//                     onChange={(e) => setAction(e.target.value)}
//                     placeholder="e.g., Walk for 10 minutes"
//                     className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-lavender-300 transition-colors"
//                     autoFocus
//                   />
//                 </div>

//                 {/* Suggestions based on goal */}
//                 {goal && (
//                   <div>
//                     <p className="text-sm opacity-70 mb-3">Suggested actions for "{goal}":</p>
//                     <div className="space-y-2">
//                       {GOAL_EXAMPLES.find(e => e.goal.toLowerCase().includes(goal.toLowerCase().split(' ')[0]))?.actions.map((suggestion, idx) => (
//                         < button
//                           key={idx}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: idx * 0.05 }}
//                           onClick={() => setAction(suggestion)}
//                           className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-lavender-300 transition-all flex items-center gap-3"
//                         >
//                           <CheckCircle2 size={18} className="opacity-60" />
//                           <span className="text-sm">{suggestion}</span>
//                         </ button>
//                       )) || (
//                         <div className="text-center py-4 text-sm opacity-60">
//                           Enter a small action that moves you toward your goal
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Affirmation */}
//                 < div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="text-center p-4 rounded-2xl"
//                   style={{ backgroundColor: `${themeColors.primary}10` }}
//                 >
//                   <p className="text-sm" style={{ color: themeColors.primary }}>
//                     {affirmation}
//                   </p>
//                 </ div>
//               </ div>
//             )}

//             {/* Step 3: Add Trigger & Reward */}
//             {step === 3 && (
//               < div
//                 key="step3"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="space-y-6"
//               >
//                 <div className="text-center mb-6">
//                   < div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ type: 'spring', delay: 0.2 }}
//                     className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
//                     style={{ backgroundColor: `${themeColors.primary}15` }}
//                   >
//                     <Sparkles size={32} style={{ color: themeColors.primary }} />
//                   </ div>
//                   <h3 className="mb-2">Set your trigger & reward</h3>
//                   <p className="text-sm opacity-70 max-w-md mx-auto">
//                     Triggers help you remember. Rewards make it stick.
//                   </p>
//                 </div>

//                 {/* Summary */}
//                 <div className="p-4 rounded-2xl bg-gradient-to-br from-lavender-50 to-peach-50 border-2 border-lavender-100">
//                   <div className="text-xs opacity-60 mb-2">Your habit so far</div>
//                   <div className="space-y-2">
//                     <div className="flex items-start gap-2">
//                       <Target size={16} className="opacity-60 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="text-xs opacity-60">Goal</div>
//                         <div className="text-sm">{goal}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <Zap size={16} className="opacity-60 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="text-xs opacity-60">Action</div>
//                         <div className="text-sm">{action}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Trigger */}
//                 <div>
//                   <label className="block text-sm mb-2 opacity-70 flex items-center gap-2">
//                     <Calendar size={16} />
//                     When will you do this?
//                   </label>
//                   <div className="grid grid-cols-2 gap-2 mb-3">
//                     {TRIGGER_SUGGESTIONS.map((t, idx) => (
//                       < button
//                         key={idx}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: idx * 0.03 }}
//                         onClick={() => {
//                           setTrigger(t.trigger);
//                           setCustomTrigger('');
//                         }}
//                         className={`p-3 rounded-xl border-2 transition-all text-sm ${
//                           trigger === t.trigger
//                             ? 'border-lavender-400 bg-lavender-50'
//                             : 'border-gray-200 hover:border-lavender-200'
//                         }`}
//                       >
//                         <span className="mr-2">{t.icon}</span>
//                         {t.trigger}
//                       </ button>
//                     ))}
//                   </div>
//                   <input
//                     type="text"
//                     value={customTrigger}
//                     onChange={(e) => {
//                       setCustomTrigger(e.target.value);
//                       setTrigger('');
//                     }}
//                     placeholder="Or write your own trigger..."
//                     className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-lavender-300 transition-colors"
//                   />
//                 </div>

//                 {/* Reward */}
//                 <div>
//                   <label className="block text-sm mb-2 opacity-70 flex items-center gap-2">
//                     <Gift size={16} />
//                     How will you celebrate?
//                   </label>
//                   <div className="grid grid-cols-2 gap-2 mb-3">
//                     {REWARD_SUGGESTIONS.map((r, idx) => (
//                       < button
//                         key={idx}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: idx * 0.03 }}
//                         onClick={() => {
//                           setReward(r.reward);
//                           setCustomReward('');
//                         }}
//                         className={`p-3 rounded-xl border-2 transition-all text-sm ${
//                           reward === r.reward
//                             ? 'border-peach-400 bg-peach-50'
//                             : 'border-gray-200 hover:border-peach-200'
//                         }`}
//                       >
//                         <span className="mr-2">{r.icon}</span>
//                         {r.reward}
//                       </ button>
//                     ))}
//                   </div>
//                   <input
//                     type="text"
//                     value={customReward}
//                     onChange={(e) => {
//                       setCustomReward(e.target.value);
//                       setReward('');
//                     }}
//                     placeholder="Or write your own reward..."
//                     className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-peach-300 transition-colors"
//                   />
//                 </div>

//                 {/* Affirmation */}
//                 < div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="text-center p-4 rounded-2xl"
//                   style={{ backgroundColor: `${themeColors.primary}10` }}
//                 >
//                   <p className="text-sm" style={{ color: themeColors.primary }}>
//                     {affirmation}
//                   </p>
//                 </ div>
//               </ div>
//             )}

//             {/* Step 4: Choose Life Area */}
//             {step === 4 && (
//               < div
//                 key="step4"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="space-y-6"
//               >
//                 <div className="text-center mb-6">
//                   < div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: [0, 1.2, 1] }}
//                     transition={{ type: 'spring', delay: 0.2 }}
//                     className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
//                     style={{ backgroundColor: `${themeColors.primary}15` }}
//                   >
//                     <Heart size={32} style={{ color: themeColors.primary }} />
//                   </ div>
//                   <h3 className="mb-2">Which life area?</h3>
//                   <p className="text-sm opacity-70 max-w-md mx-auto">
//                     Choose where this habit fits in your life. This helps you see your holistic growth.
//                   </p>
//                 </div>

//                 {/* Full Summary */}
//                 < div 
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200"
//                 >
//                   <div className="flex items-center gap-2 mb-3">
//                     <TrendingUp size={18} className="text-green-600" />
//                     <div className="text-sm opacity-70">Your new habit</div>
//                   </div>
//                   <div className="space-y-2 text-sm">
//                     <div>
//                       <span className="opacity-60">Goal: </span>
//                       <span>{goal}</span>
//                     </div>
//                     <div>
//                       <span className="opacity-60">Action: </span>
//                       <span>{action}</span>
//                     </div>
//                     <div>
//                       <span className="opacity-60">Trigger: </span>
//                       <span>{customTrigger || trigger}</span>
//                     </div>
//                     <div>
//                       <span className="opacity-60">Reward: </span>
//                       <span>{customReward || reward || 'Feel accomplished'}</span>
//                     </div>
//                   </div>
//                 </ div>

//                 {/* Life Areas */}
//                 <div>
//                   <label className="block text-sm mb-3 opacity-70">Choose your life area</label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {LIFE_AREAS.map((area, idx) => (
//                       < button
//                         key={area.name}
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: idx * 0.05 }}
//                         onClick={() => setSelectedArea(area.name)}
//                         className={`p-4 rounded-2xl border-2 transition-all ${
//                           selectedArea === area.name
//                             ? 'shadow-lg scale-105'
//                             : 'hover:shadow-md'
//                         }`}
//                         style={{
//                           borderColor: selectedArea === area.name ? area.color : '#e5e7eb',
//                           backgroundColor: selectedArea === area.name ? `${area.color}10` : 'white',
//                         }}
//                       >
//                         <div className="text-3xl mb-2">{area.icon}</div>
//                         <div className="text-sm mb-1">{area.name}</div>
//                         <div className="text-xs opacity-60">{area.description}</div>
//                       </ button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Final Affirmation */}
//                 < div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="text-center p-6 rounded-2xl"
//                   style={{ backgroundColor: `${themeColors.primary}10` }}
//                 >
//                   <Award size={32} className="mx-auto mb-2" style={{ color: themeColors.primary }} />
//                   <p style={{ color: themeColors.primary }}>
//                     You're about to create something beautiful. Ready to start your journey?
//                   </p>
//                 </ div>
//               </ div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Footer Actions */}
//         <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
//           <div className="flex gap-3">
//             {step > 1 && (
//               < button
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 onClick={handleBack}
//                 className="px-6 py-3 rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all flex items-center gap-2"
//               >
//                 <ArrowLeft size={18} />
//                 Back
//               </ button>
//             )}
//             < button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleNext}
//               className="flex-1 py-4 rounded-2xl text-white flex items-center justify-center gap-2 shadow-lg transition-all"
//               style={{ backgroundColor: themeColors.primary }}
//             >
//               {step === 4 ? (
//                 <>
//                   <CheckCircle2 size={20} />
//                   Create My Habit
//                 </>
//               ) : (
//                 <>
//                   Continue
//                   <ArrowRight size={20} />
//                 </>
//               )}
//             </ button>
//           </div>
//         </div>
//       </ div>
//     </ div>
//   );
// }
