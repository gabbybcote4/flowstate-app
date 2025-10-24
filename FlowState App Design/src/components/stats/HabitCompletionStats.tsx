import { motion, AnimatePresence } from "framer-motion";
// import { TrendingUp, Target, CheckCircle2 } from 'lucide-react';
// import { useTheme } from '../components/context/ThemeContext';

// interface Habit {
//   id: string;
//   name: string;
//   frequency: 'daily' | 'multiple-daily' | 'weekdays' | '3x-week' | 'weekly' | 'as-needed';
//   timeSlots?: { id: string; time: string; label: string }[];
//   completedSlots: { date: string; slotId?: string }[];
// }

// interface HabitCompletionStatsProps {
//   habits: Habit[];
// }

// export function HabitCompletionStats({ habits }: HabitCompletionStatsProps) {
//   const { themeColors } = useTheme();
//   const today = new Date().toDateString();

//   // Calculate completion stats
//   const completedToday = habits.filter(h => {
//     if (h.frequency === 'multiple-daily' && h.timeSlots) {
//       return h.timeSlots.every(slot =>
//         (h.completedSlots || []).some(c => c.date === today && c.slotId === slot.id)
//       );
//     }
//     return (h.completedSlots || []).some(c => c.date === today);
//   }).length;

//   const completionPercentage = habits.length > 0
//     ? Math.round((completedToday / habits.length) * 100)
//     : 0;

//   const remainingHabits = habits.length - completedToday;

//   if (habits.length === 0) return null;

//   return (
//     < div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-[var(--color-card)] rounded-2xl shadow-md p-5 mb-6"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <div
//             className="w-9 h-9 rounded-xl flex items-center justify-center"
//             style={{ backgroundColor: `${themeColors.primary}20` }}
//           >
//             <TrendingUp size={18} style={{ color: themeColors.primary }} />
//           </div>
//           <div>
//             <h3 className="text-sm">Today's Progress</h3>
//             <p className="text-xs opacity-60">
//               {completedToday} of {habits.length} completed
//             </p>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="text-2xl" style={{ color: themeColors.primary }}>
//             {completionPercentage}%
//           </div>
//           <p className="text-xs opacity-60">complete</p>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
//         < div
//           initial={{ width: 0 }}
//           animate={{ width: `${completionPercentage}%` }}
//           transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
//           className="h-full rounded-full"
//           style={{
//             background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.primaryDark})`,
//           }}
//         />
//         {/* Milestone markers */}
//         <div className="absolute top-0 left-1/4 w-0.5 h-full bg-[var(--color-card)]/40" />
//         <div className="absolute top-0 left-1/2 w-0.5 h-full bg-[var(--color-card)]/40" />
//         <div className="absolute top-0 left-3/4 w-0.5 h-full bg-[var(--color-card)]/40" />
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 gap-3">
//         < div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.3 }}
//           className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 flex items-center gap-2"
//         >
//           <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
//             <CheckCircle2 size={16} className="text-white" />
//           </div>
//           <div className="min-w-0">
//             <div className="text-lg text-green-700">{completedToday}</div>
//             <div className="text-xs text-green-600 opacity-80 truncate">
//               Done today
//             </div>
//           </div>
//         </ div>

//         < div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.4 }}
//           className="rounded-xl p-3 flex items-center gap-2"
//           style={{
//             background: `linear-gradient(to bottom right, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
//           }}
//         >
//           <div
//             className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
//             style={{ backgroundColor: themeColors.primary }}
//           >
//             <Target size={16} className="text-white" />
//           </div>
//           <div className="min-w-0">
//             <div className="text-lg" style={{ color: themeColors.primaryDark }}>
//               {remainingHabits}
//             </div>
//             <div className="text-xs opacity-70 truncate">
//               {remainingHabits === 0 ? 'All done!' : 'To go'}
//             </div>
//           </div>
//         </ div>
//       </div>

//       {/* Motivational Message */}
//       {completionPercentage === 100 && (
//         < div
//           initial={{ opacity: 0, y: 5 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200"
//         >
//           <p className="text-xs text-amber-800 text-center">
//             🎉 Amazing! You completed all your habits today!
//           </p>
//         </ div>
//       )}
//       {completionPercentage >= 75 && completionPercentage < 100 && (
//         < div
//           initial={{ opacity: 0, y: 5 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
//         >
//           <p className="text-xs text-blue-800 text-center">
//             ⭐ Almost there! Just {remainingHabits} more to go!
//           </p>
//         </ div>
//       )}
//       {completionPercentage >= 50 && completionPercentage < 75 && (
//         < div
//           initial={{ opacity: 0, y: 5 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mt-3 p-3 rounded-xl border"
//           style={{
//             background: `linear-gradient(to right, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
//             borderColor: themeColors.primary + '40',
//           }}
//         >
//           <p className="text-xs text-center opacity-80">
//             💫 You're halfway there! Keep up the momentum!
//           </p>
//         </ div>
//       )}
//     </ div>
//   );
// }
