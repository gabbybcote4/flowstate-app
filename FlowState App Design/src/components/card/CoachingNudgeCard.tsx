// import { motion } from '../lib/motion-shim';
// import { useTheme } from '../components/context/ThemeContext';
// import { useEmotionalState } from './EmotionalStateManager';
// import { Sparkles, Heart, Lightbulb, Coffee, Moon } from 'lucide-react';
// import { useState, useEffect } from 'react';

// /**
//  * Coaching Nudge Card
//  * 
//  * Gentle, in-context coaching suggestions that appear on screens
//  * Based on user's emotional state, time of day, and current context
//  */

// interface CoachingNudge {
//   message: string;
//   emoji: string;
//   type: 'energy' | 'encouragement' | 'suggestion' | 'reflection';
// }

// export function CoachingNudgeCard({ context }: { context?: 'dashboard' | 'todos' | 'habits' | 'focus' }) {
//   const { themeColors } = useTheme();
//   const { currentState, isGentleMode } = useEmotionalState();
//   const [nudge, setNudge] = useState<CoachingNudge | null>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const generateNudge = () => {
//       const hour = new Date().getHours();
//       const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      
//       let message = '';
//       let emoji = '💜';
//       let type: CoachingNudge['type'] = 'encouragement';

//       // Context-specific nudges
//       if (context === 'dashboard') {
//         if (currentState === 'overwhelmed') {
//           message = 'Feeling a lot? Pick just one thing. The rest can wait.';
//           emoji = '🫂';
//           type = 'suggestion';
//         } else if (currentState === 'tired') {
//           message = 'Low energy noticed. Your smallest task is the right task.';
//           emoji = '🌙';
//           type = 'energy';
//         } else if (timeOfDay === 'morning') {
//           message = 'Morning friend! What would make today feel like a win?';
//           emoji = '☀️';
//           type = 'reflection';
//         } else if (timeOfDay === 'afternoon') {
//           message = 'You\'re doing great. A micro-win keeps momentum alive.';
//           emoji = '✨';
//           type = 'encouragement';
//         } else {
//           message = 'Evening check-in: Did you honor your energy today?';
//           emoji = '🌸';
//           type = 'reflection';
//         }
//       } else if (context === 'todos') {
//         if (currentState === 'overwhelmed') {
//           message = 'Too many tasks? Hide the low-priority ones for now.';
//           emoji = '🎯';
//           type = 'suggestion';
//         } else if (currentState === 'anxious') {
//           message = 'Start with the task that feels easiest. Momentum builds confidence.';
//           emoji = '💪';
//           type = 'suggestion';
//         } else {
//           message = 'Not everything needs to be done today. Choose what matters.';
//           emoji = '🧘';
//           type = 'suggestion';
//         }
//       } else if (context === 'habits') {
//         if (currentState === 'tired') {
//           message = 'Tired days count too. Even 1% effort is progress.';
//           emoji = '🌱';
//           type = 'encouragement';
//         } else {
//           message = 'Small daily actions create big transformations.';
//           emoji = '🌟';
//           type = 'encouragement';
//         }
//       } else if (context === 'focus') {
//         message = 'Set a timer. Single-task. Honor breaks. You\'ve got this.';
//         emoji = '⏱️';
//         type = 'suggestion';
//       } else {
//         // General nudges
//         const generalNudges = [
//           { message: 'Progress over perfection. Always.', emoji: '💜', type: 'encouragement' as const },
//           { message: 'Pause for a breath? Your nervous system will thank you.', emoji: '🫁', type: 'suggestion' as const },
//           { message: 'You\'re doing better than you think.', emoji: '✨', type: 'encouragement' as const },
//           { message: 'Rest is productive. Really.', emoji: '🌙', type: 'suggestion' as const },
//         ];
//         const random = generalNudges[Math.floor(Math.random() * generalNudges.length)];
//         message = random.message;
//         emoji = random.emoji;
//         type = random.type;
//       }

//       setNudge({ message, emoji, type });
//       setIsVisible(true);
//     };

//     // Generate nudge after a delay
//     const timer = setTimeout(generateNudge, 2000);
//     return () => clearTimeout(timer);
//   }, [context, currentState]);

//   if (!nudge || !isVisible) return null;

//   const getIcon = () => {
//     switch (nudge.type) {
//       case 'energy':
//         return <Coffee size={16} style={{ color: themeColors.primary }} />;
//       case 'encouragement':
//         return <Heart size={16} style={{ color: themeColors.primary }} />;
//       case 'suggestion':
//         return <Lightbulb size={16} style={{ color: themeColors.primary }} />;
//       case 'reflection':
//         return <Sparkles size={16} style={{ color: themeColors.primary }} />;
//       default:
//         return <Sparkles size={16} style={{ color: themeColors.primary }} />;
//     }
//   };

//   return (
//     < div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ delay: 0.3 }}
//       className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 shadow-sm"
//     >
//       <div className="flex items-start gap-3">
//         <motion.span 
//           className="text-2xl flex-shrink-0"
//           animate={{ 
//             scale: [1, 1.1, 1],
//             rotate: [0, 5, -5, 0]
//           }}
//           transition={{ 
//             duration: 2,
//             repeat: Infinity,
//             repeatDelay: 3
//           }}
//         >
//           {nudge.emoji}
//         </motion.span>
        
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-2">
//             {getIcon()}
//             <span className="text-xs uppercase tracking-wide" style={{ color: themeColors.primary }}>
//               {nudge.type === 'energy' && 'Energy Tip'}
//               {nudge.type === 'encouragement' && 'Gentle Reminder'}
//               {nudge.type === 'suggestion' && 'Suggestion'}
//               {nudge.type === 'reflection' && 'Reflection'}
//             </span>
//           </div>
//           <p className="text-sm text-gray-700 leading-relaxed">
//             {nudge.message}
//           </p>
//         </div>

//         <button
//           onClick={() => setIsVisible(false)}
//           className="flex-shrink-0 w-6 h-6 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-colors text-xs text-gray-500"
//         >
//           ✕
//         </button>
//       </div>
//     </ div>
//   );
// }

// // Mini version for compact spaces
// export function MiniCoachingNudge({ message, emoji = '💜' }: { message: string; emoji?: string }) {
//   const { themeColors } = useTheme();

//   return (
//     < div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 border border-purple-200 flex items-center gap-2"
//     >
//       <span className="text-lg">{emoji}</span>
//       <p className="text-xs text-gray-700 flex-1">{message}</p>
//     </ div>
//   );
// }

// // Conversational prompts for empty states
// export function EmptyStateCoaching({ 
//   context,
//   action
// }: { 
//   context: 'no-habits' | 'no-tasks' | 'no-reflections' | 'no-focus-sessions';
//   action?: () => void;
// }) {
//   const { themeColors } = useTheme();

//   const getContent = () => {
//     switch (context) {
//       case 'no-habits':
//         return {
//           emoji: '🌱',
//           message: 'No habits yet?',
//           subtext: 'Start tiny. One small action, repeated, changes everything.',
//           actionLabel: 'Build your first habit',
//         };
//       case 'no-tasks':
//         return {
//           emoji: '📝',
//           message: 'Fresh start',
//           subtext: 'What would make today feel like a win? Add just one thing.',
//           actionLabel: 'Add a task',
//         };
//       case 'no-reflections':
//         return {
//           emoji: '✨',
//           message: 'Reflection helps you grow',
//           subtext: 'End your day with awareness. Notice what worked.',
//           actionLabel: 'Start reflecting',
//         };
//       case 'no-focus-sessions':
//         return {
//           emoji: '⏱️',
//           message: 'Ready to focus?',
//           subtext: 'Deep work happens in protected time. Create your first session.',
//           actionLabel: 'Plan a focus session',
//         };
//       default:
//         return {
//           emoji: '💜',
//           message: 'You\'re here',
//           subtext: 'That\'s the first step.',
//           actionLabel: 'Get started',
//         };
//     }
//   };

//   const content = getContent();

//   return (
//     < div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="text-center py-12 px-6"
//     >
//       < div
//         animate={{ 
//           scale: [1, 1.05, 1],
//           rotate: [0, 2, -2, 0]
//         }}
//         transition={{ 
//           duration: 3,
//           repeat: Infinity,
//           ease: 'easeInOut'
//         }}
//         className="text-6xl mb-6"
//       >
//         {content.emoji}
//       </ div>

//       <h3 className="mb-3 text-gray-800">
//         {content.message}
//       </h3>
      
//       <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
//         {content.subtext}
//       </p>

//       {action && (
//         <button
//           onClick={action}
//           className="px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg"
//           style={{
//             backgroundColor: themeColors.primary,
//             color: 'white',
//           }}
//         >
//           {content.actionLabel}
//         </button>
//       )}
//     </ div>
//   );
// }
