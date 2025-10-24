// src/screens/GrowthMapScreen.tsx
// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// 
// import { 
//   Sparkles, 
//   TrendingUp, 
//   Target, 
//   Award, 
//   ArrowRight,
//   X,
//   MessageCircle,
//   Calendar,
//   Zap,
//   Heart,
//   Clock,
//   CheckCircle2,
//   Smile,
//   Frown,
//   Meh,
//   ZoomIn,
//   ZoomOut
// } from 'lucide-react';
// import { toast } from 'sonner';

// interface LifeAreaData {
//   name: string;
//   color: string;
//   icon: string;
//   activeHabits: number;
//   completedToday: number;
//   weeklyStreak: number;
//   totalCompleted: number;
//   growthTrend: 'up' | 'steady' | 'down';
//   insights: string[];
//   nextActions: string[];
// }

// interface GrowthMapScreenProps {
//   onNavigate: (screen: string, area?: string) => void;
// }

// const LIFE_AREAS = [
//   { name: 'Health', color: '#10b981', icon: '💚', description: 'Physical wellness and vitality' },
//   { name: 'Creativity', color: '#a78bfa', icon: '🎨', description: 'Creative expression and imagination' },
//   { name: 'Work', color: '#3b82f6', icon: '💼', description: 'Career and professional growth' },
//   { name: 'Relationships', color: '#ec4899', icon: '💕', description: 'Connections and community' },
//   { name: 'Learning', color: '#f59e0b', icon: '📚', description: 'Knowledge and personal development' },
//   { name: 'Home', color: '#8b5cf6', icon: '🏡', description: 'Living space and comfort' },
// ];

// interface TimelineEvent {
//   id: string;
//   date: Date;
//   type: 'milestone' | 'habit' | 'reflection' | 'mood';
//   title: string;
//   description?: string;
//   mood?: number;
//   icon?: string;
//   color?: string;
// }

// export function GrowthMapScreen({ onNavigate }: GrowthMapScreenProps) {
//   const { themeColors } = useTheme();
//   const [lifeAreaData, setLifeAreaData] = useState<Record<string, LifeAreaData>>({});
//   const [selectedArea, setSelectedArea] = useState<string | null>(null);
//   const [overallGrowth, setOverallGrowth] = useState(0);
//   const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
//   const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
//   const [timelineZoom, setTimelineZoom] = useState(1); // 1 = month view, 2 = week view, 0.5 = quarter view

//   useEffect(() => {
//     loadGrowthData();
//     loadTimelineData();
//   }, []);

//   const loadTimelineData = () => {
//     const events: TimelineEvent[] = [];
    
//     // Load habits data
//     const habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');
//     habits.forEach((habit: any) => {
//       // Add habit creation as event
//       if (habit.createdAt) {
//         events.push({
//           id: `habit-created-${habit.id}`,
//           date: new Date(habit.createdAt),
//           type: 'habit',
//           title: `Started "${habit.name}"`,
//           description: `New routine in ${habit.lifeArea || 'Life'}`,
//           icon: '✨',
//           color: '#A78BFA'
//         });
//       }
      
//       // Add significant streaks as milestones
//       if (habit.completedSlots && habit.completedSlots.length >= 7) {
//         const firstCompletion = habit.completedSlots[0];
//         const seventhCompletion = habit.completedSlots[6];
//         if (firstCompletion && seventhCompletion) {
//           events.push({
//             id: `habit-milestone-${habit.id}`,
//             date: new Date(seventhCompletion.date),
//             type: 'milestone',
//             title: `7-day streak: ${habit.name}`,
//             description: 'Consistency unlocked!',
//             icon: '🎯',
//             color: '#10B981'
//           });
//         }
//       }
//     });
    
//     // Load reflections
//     const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
//     Object.entries(reflections).forEach(([date, data]: [string, any]) => {
//       if (data.text && data.text.trim()) {
//         events.push({
//           id: `reflection-${date}`,
//           date: new Date(date),
//           type: 'reflection',
//           title: 'Daily Reflection',
//           description: data.text.slice(0, 100) + (data.text.length > 100 ? '...' : ''),
//           icon: '📝',
//           color: '#EC4899'
//         });
//       }
//     });
    
//     // Load mood check-ins
//     const coachingDate = localStorage.getItem('flowstate-coaching-date');
//     const coachingData = localStorage.getItem('flowstate-coaching-data');
//     if (coachingDate && coachingData) {
//       try {
//         const data = JSON.parse(coachingData);
//         const avgMood = (data.mood + data.energy + data.focus) / 3;
//         events.push({
//           id: `mood-${coachingDate}`,
//           date: new Date(coachingDate),
//           type: 'mood',
//           title: 'Checked in with feelings',
//           description: `Mood: ${data.mood}/5, Energy: ${data.energy}/5, Focus: ${data.focus}/5`,
//           mood: avgMood,
//           icon: avgMood >= 4 ? '😊' : avgMood >= 3 ? '😐' : '😔',
//           color: avgMood >= 4 ? '#10B981' : avgMood >= 3 ? '#F59E0B' : '#EF4444'
//         });
//       } catch (e) {
//         console.error('Error parsing coaching data', e);
//       }
//     }
    
//     // Sort by date (most recent first)
//     events.sort((a, b) => b.date.getTime() - a.date.getTime());
    
//     setTimelineEvents(events);
//   };

//   const loadGrowthData = () => {
//     const habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');
//     const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
//     const today = new Date().toDateString();
    
//     const data: Record<string, LifeAreaData> = {};
//     let totalGrowth = 0;

//     LIFE_AREAS.forEach((area) => {
//       const areaHabits = habits.filter((h: any) => h.lifeArea === area.name && h.isActive);
//       const completedToday = areaHabits.filter((h: any) => 
//         h.completedSlots && h.completedSlots.some((slot: any) => slot.date === today)
//       ).length;

//       // Calculate weekly streak
//       const last7Days = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toDateString();
//       });

//       let weeklyCompletions = 0;
//       last7Days.forEach(date => {
//         const completedOnDate = areaHabits.filter((h: any) => 
//           h.completedSlots && h.completedSlots.some((slot: any) => slot.date === date)
//         ).length;
//         weeklyCompletions += completedOnDate;
//       });

//       // Total completions
//       const totalCompleted = areaHabits.reduce((sum: number, h: any) => 
//         sum + (h.completedSlots?.length || 0), 0
//       );

//       // Growth trend (compare last 3 days vs previous 3 days)
//       const recentDays = last7Days.slice(0, 3);
//       const previousDays = last7Days.slice(3, 6);
      
//       const recentCompletions = recentDays.reduce((sum, date) => {
//         return sum + areaHabits.filter((h: any) => 
//           h.completedSlots && h.completedSlots.some((slot: any) => slot.date === date)
//         ).length;
//       }, 0);

//       const previousCompletions = previousDays.reduce((sum, date) => {
//         return sum + areaHabits.filter((h: any) => 
//           h.completedSlots && h.completedSlots.some((slot: any) => slot.date === date)
//         ).length;
//       }, 0);

//       let growthTrend: 'up' | 'steady' | 'down' = 'steady';
//       if (recentCompletions > previousCompletions + 1) growthTrend = 'up';
//       else if (recentCompletions < previousCompletions - 1) growthTrend = 'down';

//       // Generate insights
//       const insights: string[] = [];
//       if (completedToday === areaHabits.length && areaHabits.length > 0) {
//         insights.push(`Perfect day! All ${area.name.toLowerCase()} habits completed 🎉`);
//       } else if (weeklyCompletions > areaHabits.length * 5) {
//         insights.push(`Strong week in ${area.name.toLowerCase()} - great consistency!`);
//       } else if (growthTrend === 'up') {
//         insights.push(`Trending upward - momentum is building in ${area.name.toLowerCase()}`);
//       } else if (areaHabits.length === 0) {
//         insights.push(`No active habits yet - ready to start something new?`);
//       } else if (weeklyCompletions === 0 && areaHabits.length > 0) {
//         insights.push(`This area needs some attention - small steps count`);
//       }

//       // Next actions
//       const nextActions: string[] = [];
//       if (areaHabits.length === 0) {
//         nextActions.push('Create your first habit');
//       } else if (completedToday < areaHabits.length) {
//         nextActions.push(`Complete ${areaHabits.length - completedToday} more habit${areaHabits.length - completedToday > 1 ? 's' : ''} today`);
//       } else {
//         nextActions.push('Maintain your momentum tomorrow');
//       }

//       // Calculate area growth score (0-100)
//       const areaGrowth = areaHabits.length > 0 
//         ? Math.min(100, (weeklyCompletions / (areaHabits.length * 7)) * 100)
//         : 0;
//       totalGrowth += areaGrowth;

//       data[area.name] = {
//         name: area.name,
//         color: area.color,
//         icon: area.icon,
//         activeHabits: areaHabits.length,
//         completedToday,
//         weeklyStreak: weeklyCompletions,
//         totalCompleted,
//         growthTrend,
//         insights,
//         nextActions,
//       };
//     });

//     setLifeAreaData(data);
//     setOverallGrowth(Math.round(totalGrowth / LIFE_AREAS.length));
//   };

//   const getPositionForPetal = (index: number, total: number) => {
//     const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
//     const radius = 120; // Distance from center
//     return {
//       x: Math.cos(angle) * radius,
//       y: Math.sin(angle) * radius,
//       angle: angle * (180 / Math.PI),
//     };
//   };

//   const handleExploreArea = (areaName: string) => {
//     // Navigate to coach chat with context
//     toast.success(`Opening personalized coaching for ${areaName}...`);
//     setTimeout(() => {
//       onNavigate('coach-chat', areaName);
//     }, 500);
//   };

//   const selectedData = selectedArea ? lifeAreaData[selectedArea] : null;
//   const selectedAreaConfig = LIFE_AREAS.find(a => a.name === selectedArea);

//   return (
//     <div 
//       className="min-h-screen pb-24"
//       style={{ 
//         background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})` 
//       }}
//     >
//       <div className="p-6 md:p-8 pt-12 md:pt-16">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 mb-3">
//             <Sparkles size={28} style={{ color: themeColors.primary }} />
//             <h1>Growth Map</h1>
//           </div>
//           <p className="opacity-70 max-w-md mx-auto">
//             Your holistic view of growth across all life areas
//           </p>
//         </div>

//         {/* Overall Growth Score */}
//         <div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="max-w-xs mx-auto mb-12 flow-card"
//         >
//           <div className="text-sm opacity-60 mb-2">Overall Growth</div>
//           <div 
//             className="relative w-32 h-32 mx-auto mb-3"
//             animate={overallGrowth >= 70 ? { 
//               scale: [1, 1.05, 1],
//             } : {}}
//             transition={{ 
//               duration: 2,
//               repeat: overallGrowth >= 70 ? Infinity : 0,
//               ease: "easeInOut",
//             }}
//           >
//             <svg className="w-full h-full transform -rotate-90">
//               <circle
//                 cx="64"
//                 cy="64"
//                 r="56"
//                 stroke="#e5e7eb"
//                 strokeWidth="8"
//                 fill="none"
//               />
//               <motion.circle
//                 cx="64"
//                 cy="64"
//                 r="56"
//                 stroke={themeColors.primary}
//                 strokeWidth="8"
//                 fill="none"
//                 strokeLinecap="round"
//                 initial={{ strokeDashoffset: 352 }}
//                 animate={{ strokeDashoffset: 352 - (352 * overallGrowth) / 100 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//                 style={{
//                   strokeDasharray: 352,
//                   filter: overallGrowth >= 70 
//                     ? `drop-shadow(0 0 12px ${themeColors.primary}60)`
//                     : `drop-shadow(0 0 8px ${themeColors.primary}40)`,
//                 }}
//               />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <motion.span 
//                 className="text-3xl"
//                 style={{ color: themeColors.primary }}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1 }}
//               >
//                 {overallGrowth}%
//               </motion.span>
//             </div>
//           </ div>
//           <p className="text-sm opacity-70">
//             {overallGrowth >= 70 ? 'Thriving across life areas! 🌟' 
//               : overallGrowth >= 40 ? 'Building momentum 💪'
//               : 'Every journey starts somewhere 🌱'}
//           </p>
//         </ div>

//         {/* Flower Visualization */}
//         <div className="max-w-2xl mx-auto mb-12">
//           <div className="relative h-96 flex items-center justify-center">
//             {/* Center Hub */}
//             <div
//               initial={{ scale: 0 }}
//               animate={{ 
//                 scale: 1,
//               }}
//               transition={{ delay: 0.2, type: 'spring' }}
//               className="absolute w-24 h-24 rounded-full flex items-center justify-center z-10 shadow-xl"
//               style={{ 
//                 backgroundColor: themeColors.primary,
//                 boxShadow: `0 0 30px ${themeColors.primary}40`,
//               }}
//             >
//               <div
//                 animate={{ 
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{ 
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <Heart size={32} className="text-white" />
//               </ div>
//             </ div>

//             {/* Petals/Life Areas */}
//             {LIFE_AREAS.map((area, index) => {
//               const position = getPositionForPetal(index, LIFE_AREAS.length);
//               const data = lifeAreaData[area.name];
//               const completionRate = data?.activeHabits 
//                 ? (data.completedToday / data.activeHabits) * 100 
//                 : 0;

//               return (
//                 < button
//                   key={area.name}
//                   initial={{ scale: 0, opacity: 0 }}
//                   animate={{ 
//                     scale: selectedArea === area.name ? 1.1 : 1, 
//                     opacity: 1,
//                     x: position.x,
//                     y: position.y,
//                   }}
//                   transition={{ 
//                     delay: 0.3 + index * 0.1,
//                     type: 'spring',
//                     stiffness: 200,
//                     damping: 20,
//                   }}
//                   whileHover={{ scale: 1.15, rotate: 5 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setSelectedArea(area.name)}
//                   className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer"
//                   style={{
//                     backgroundColor: area.color,
//                     boxShadow: selectedArea === area.name
//                       ? `0 0 30px ${area.color}90, 0 0 15px ${area.color}60`
//                       : `0 0 15px ${area.color}40`,
//                     border: selectedArea === area.name 
//                       ? `3px solid white`
//                       : 'none',
//                   }}
//                 >
//                   <motion.span 
//                     className="text-2xl mb-1"
//                     animate={{ 
//                       scale: selectedArea === area.name ? [1, 1.2, 1] : 1 
//                     }}
//                     transition={{ 
//                       duration: 0.5,
//                       repeat: selectedArea === area.name ? Infinity : 0,
//                       repeatDelay: 1,
//                     }}
//                   >
//                     {area.icon}
//                   </motion.span>
//                   {data && data.growthTrend === 'up' && (
//                     <div 
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ delay: 0.5 + index * 0.1 }}
//                       className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
//                     >
//                       <TrendingUp size={12} className="text-white" />
//                     </ div>
//                   )}
//                   {data && completionRate === 100 && data.activeHabits > 0 && (
//                     <div 
//                       initial={{ scale: 0, rotate: -180 }}
//                       animate={{ scale: 1, rotate: 0 }}
//                       transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
//                       className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center"
//                     >
//                       <Award size={12} className="text-white" />
//                     </ div>
//                   )}
//                 </ button>
//               );
//             })}

//             {/* Connecting Lines (subtle) */}
//             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
//               <defs>
//                 <radialGradient id="lineGradient">
//                   <stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.3" />
//                   <stop offset="100%" stopColor={themeColors.primary} stopOpacity="0" />
//                 </radialGradient>
//               </defs>
//               {LIFE_AREAS.map((_, index) => {
//                 const pos = getPositionForPetal(index, LIFE_AREAS.length);
//                 return (
//                   <line
//                     key={index}
//                     x1="50%"
//                     y1="50%"
//                     x2={`calc(50% + ${pos.x}px)`}
//                     y2={`calc(50% + ${pos.y}px)`}
//                     stroke="url(#lineGradient)"
//                     strokeWidth="2"
//                   />
//                 );
//               })}
//             </svg>
//           </div>

//           {/* Legend */}
//           <div className="flex flex-wrap justify-center gap-3 mt-8">
//             {LIFE_AREAS.map((area) => (
//               <button
//                 key={area.name}
//                 onClick={() => setSelectedArea(area.name)}
//                 className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
//                   selectedArea === area.name ? 'shadow-md' : 'opacity-60 hover:opacity-100'
//                 }`}
//                 style={{
//                   backgroundColor: selectedArea === area.name ? area.color : `${area.color}20`,
//                   color: selectedArea === area.name ? 'white' : area.color,
//                 }}
//               >
//                 {area.icon} {area.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Life Timeline Section */}
//         <div className="max-w-4xl mx-auto mt-16">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center gap-2 mb-3">
//               <Clock size={28} style={{ color: themeColors.primary }} />
//               <h2>Life Timeline</h2>
//             </div>
//             <p className="opacity-70 max-w-md mx-auto mb-6">
//               Your journey of growth, milestones, and self-discovery
//             </p>
            
//             {/* Zoom Controls */}
//             <div className="flex items-center justify-center gap-3">
//               <button
//                 onClick={() => setTimelineZoom(Math.max(0.5, timelineZoom - 0.5))}
//                 className="p-2 rounded-xl flow-card"
//                 disabled={timelineZoom <= 0.5}
//               >
//                 <ZoomOut size={20} style={{ color: themeColors.primary }} />
//               </button>
//               <span className="text-sm opacity-60 min-w-[100px] text-center">
//                 {timelineZoom === 0.5 ? '3 Months' : timelineZoom === 1 ? '1 Month' : '1 Week'}
//               </span>
//               <button
//                 onClick={() => setTimelineZoom(Math.min(2, timelineZoom + 0.5))}
//                 className="p-2 rounded-xl flow-card"
//                 disabled={timelineZoom >= 2}
//               >
//                 <ZoomIn size={20} style={{ color: themeColors.primary }} />
//               </button>
//             </div>
//           </div>

//           {/* Timeline */}
//           <div className="flow-card">
//             {timelineEvents.length === 0 ? (
//               <div className="text-center py-12 opacity-60">
//                 <Clock size={48} className="mx-auto mb-4" style={{ color: themeColors.primary }} />
//                 <p>Your journey starts here</p>
//                 <p className="text-sm mt-2">Create habits, reflect, and track your growth</p>
//               </div>
//             ) : (
//               <div className="relative">
//                 {/* Timeline line */}
//                 <div 
//                   className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-gray-200 to-transparent"
//                   style={{ 
//                     left: '32px',
//                   }}
//                 />

//                 {/* Events */}
//                 <div className="space-y-6">
//                   {timelineEvents.map((event, index) => (
//                     < button
//                       key={event.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       whileHover={{ scale: 1.02 }}
//                       onClick={() => setSelectedEvent(event)}
//                       className="w-full flex items-start gap-6 text-left group relative"
//                     >
//                       {/* Date dot */}
//                       <div className="relative flex-shrink-0">
//                         <div
//                           whileHover={{ scale: 1.3 }}
//                           className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-all"
//                           style={{ 
//                             backgroundColor: event.color || themeColors.primary,
//                             boxShadow: selectedEvent?.id === event.id 
//                               ? `0 0 20px ${event.color}60` 
//                               : `0 0 10px ${event.color}30`,
//                           }}
//                         >
//                           <span className="text-2xl">{event.icon}</span>
//                         </ div>
                        
//                         {/* Connection pulse */}
//                         <div
//                           initial={{ scale: 0.8, opacity: 0 }}
//                           animate={{ 
//                             scale: [0.8, 1.2, 0.8],
//                             opacity: [0.5, 0.2, 0.5]
//                           }}
//                           transition={{ 
//                             duration: 2,
//                             repeat: Infinity,
//                             ease: "easeInOut"
//                           }}
//                           className="absolute inset-0 rounded-full"
//                           style={{ 
//                             backgroundColor: event.color,
//                             opacity: 0.2,
//                           }}
//                         />
//                       </div>

//                       {/* Event content */}
//                       <div 
//                         className="flex-1 bg-gray-50 rounded-2xl p-5 group-hover:bg-gray-100 transition-all"
//                         whileHover={{ x: 5 }}
//                       >
//                         <div className="flex items-start justify-between mb-2">
//                           <div>
//                             <h4 className="mb-1">{event.title}</h4>
//                             <p className="text-xs opacity-60">
//                               {event.date.toLocaleDateString('en-US', { 
//                                 weekday: 'short',
//                                 year: 'numeric', 
//                                 month: 'short', 
//                                 day: 'numeric' 
//                               })}
//                             </p>
//                           </div>
                          
//                           {/* Type badge */}
//                           <div 
//                             className="px-3 py-1 rounded-full text-xs"
//                             style={{ 
//                               backgroundColor: `${event.color}20`,
//                               color: event.color 
//                             }}
//                           >
//                             {event.type === 'milestone' && '🏆 Milestone'}
//                             {event.type === 'habit' && '✨ Routine'}
//                             {event.type === 'reflection' && '📝 Reflection'}
//                             {event.type === 'mood' && '💭 Check-in'}
//                           </div>
//                         </div>
                        
//                         {event.description && (
//                           <p className="text-sm opacity-70 mt-2">{event.description}</p>
//                         )}
                        
//                         {/* Mood indicator for mood events */}
//                         {event.type === 'mood' && event.mood && (
//                           <div className="mt-3 flex items-center gap-2">
//                             <div className="flex gap-1">
//                               {[1, 2, 3, 4, 5].map((i) => (
//                                 <div
//                                   key={i}
//                                   className="w-6 h-2 rounded-full"
//                                   style={{
//                                     backgroundColor: i <= event.mood! 
//                                       ? event.color 
//                                       : '#e5e7eb'
//                                   }}
//                                 />
//                               ))}
//                             </div>
//                             <span className="text-xs opacity-60">
//                               {event.mood >= 4 ? 'Feeling great' 
//                                 : event.mood >= 3 ? 'Feeling okay' 
//                                 : 'Tough day'}
//                             </span>
//                           </div>
//                         )}
//                       </ div>
//                     </ button>
//                   ))}
//                 </div>

//                 {/* End marker */}
//                 <div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: timelineEvents.length * 0.05 + 0.5 }}
//                   className="flex items-center gap-6 mt-8"
//                 >
//                   <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg"
//                     style={{
//                       background: `linear-gradient(135deg, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`
//                     }}
//                   >
//                     <Sparkles size={24} className="text-white" />
//                   </div>
//                   <div className="flex-1 text-center opacity-60 text-sm py-4">
//                     Your journey continues...
//                   </div>
//                 </ div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Expanded Detail Panel */}
//       <AnimatePresence>
//         {selectedArea && selectedData && selectedAreaConfig && (
//           <div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
//             onClick={() => setSelectedArea(null)}
//           >
//             <div
//               initial={{ y: '100%', opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: '100%', opacity: 0 }}
//               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
//               onClick={(e) => e.stopPropagation()}
//               className="flow-card"
//             >
//               {/* Header */}
//               <div 
//                 className="p-6 text-white relative overflow-hidden"
//                 style={{ backgroundColor: selectedAreaConfig.color }}
//               >
//                 <button
//                   onClick={() => setSelectedArea(null)}
//                   className="absolute top-4 right-4 w-8 h-8 rounded-full flow-card"
//                 >
//                   <X size={18} />
//                 </button>
                
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="text-4xl">{selectedAreaConfig.icon}</span>
//                   <div>
//                     <h2 className="mb-1 text-white">{selectedAreaConfig.name}</h2>
//                     <p className="text-sm opacity-90">{selectedAreaConfig.description}</p>
//                   </div>
//                 </div>

//                 {/* Gradient overlay */}
//                 <div 
//                   className="absolute inset-0 opacity-20 pointer-events-none"
//                   style={{
//                     background: `radial-gradient(circle at top right, white, transparent)`,
//                   }}
//                 />
//               </div>

//               {/* Stats */}
//               <div className="p-6 border-b border-[var(--color-ring-offset-background)]">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">{selectedData.activeHabits}</div>
//                     <div className="text-xs opacity-60">Active Habits</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">{selectedData.completedToday}</div>
//                     <div className="text-xs opacity-60">Done Today</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">{selectedData.weeklyStreak}</div>
//                     <div className="text-xs opacity-60">This Week</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Growth Trend */}
//               <div className="p-6 border-b border-[var(--color-ring-offset-background)]">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div 
//                     className="w-10 h-10 rounded-full flex items-center justify-center"
//                     style={{ backgroundColor: `${selectedAreaConfig.color}20` }}
//                   >
//                     {selectedData.growthTrend === 'up' && <TrendingUp size={20} style={{ color: selectedAreaConfig.color }} />}
//                     {selectedData.growthTrend === 'steady' && <Target size={20} style={{ color: selectedAreaConfig.color }} />}
//                     {selectedData.growthTrend === 'down' && <Zap size={20} style={{ color: selectedAreaConfig.color }} />}
//                   </div>
//                   <div>
//                     <div className="text-sm mb-1">Growth Trend</div>
//                     <div className="text-xs opacity-60">
//                       {selectedData.growthTrend === 'up' && 'Trending upward - keep it up!'}
//                       {selectedData.growthTrend === 'steady' && 'Steady progress - stay consistent'}
//                       {selectedData.growthTrend === 'down' && 'Opportunity to refocus'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Insights */}
//               {selectedData.insights.length > 0 && (
//                 <div className="p-6 border-b border-[var(--color-ring-offset-background)]">
//                   <h3 className="mb-3 flex items-center gap-2">
//                     <Sparkles size={18} style={{ color: selectedAreaConfig.color }} />
//                     Insights
//                   </h3>
//                   <div className="space-y-2">
//                     {selectedData.insights.map((insight, idx) => (
//                       <div 
//                         key={idx} 
//                         className="text-sm p-3 rounded-xl"
//                         style={{ backgroundColor: `${selectedAreaConfig.color}10` }}
//                       >
//                         {insight}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Next Actions */}
//               <div className="p-6 border-b border-[var(--color-ring-offset-background)]">
//                 <h3 className="mb-3 flex items-center gap-2">
//                   <Target size={18} style={{ color: selectedAreaConfig.color }} />
//                   Next Steps
//                 </h3>
//                 <div className="space-y-2">
//                   {selectedData.nextActions.map((action, idx) => (
//                     <div key={idx} className="flex items-center gap-3 text-sm">
//                       <div 
//                         className="w-2 h-2 rounded-full flex-shrink-0"
//                         style={{ backgroundColor: selectedAreaConfig.color }}
//                       />
//                       <span>{action}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="p-6 space-y-3">
//                 < button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => handleExploreArea(selectedAreaConfig.name)}
//                   className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 shadow-lg transition-all"
//                   style={{ backgroundColor: selectedAreaConfig.color }}
//                 >
//                   <MessageCircle size={20} />
//                   <span>Explore with AI Coach</span>
//                   <ArrowRight size={18} />
//                 </ button>

//                 <button
//                   onClick={() => {
//                     setSelectedArea(null);
//                     onNavigate('habits', selectedAreaConfig.name);
//                   }}
//                   className="w-full py-3 rounded-2xl border-2 transition-all hover:shadow-md"
//                   style={{ 
//                     borderColor: selectedAreaConfig.color,
//                     color: selectedAreaConfig.color,
//                   }}
//                 >
//                   View Habits
//                 </button>

//                 <button
//                   onClick={() => {
//                     setSelectedArea(null);
//                     onNavigate('timeflow');
//                   }}
//                   className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-[var(--color-card-foreground)]"
//                 >
//                   Schedule in Time Flow
//                 </button>
//               </div>
//             </ div>
//           </ div>
//         )}
//       </AnimatePresence>

//       {/* Timeline Event Detail Modal */}
//       <AnimatePresence>
//         {selectedEvent && (
//           <div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
//             onClick={() => setSelectedEvent(null)}
//           >
//             <div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//               onClick={(e) => e.stopPropagation()}
//               className="flow-card"
//             >
//               {/* Header */}
//               <div 
//                 className="p-6 text-white relative overflow-hidden"
//                 style={{ backgroundColor: selectedEvent.color }}
//               >
//                 <button
//                   onClick={() => setSelectedEvent(null)}
//                   className="absolute top-4 right-4 w-8 h-8 rounded-full flow-card"
//                 >
//                   <X size={18} />
//                 </button>
                
//                 <div className="flex items-center gap-4 mb-3">
//                   <div className="w-16 h-16 flow-card">
//                     {selectedEvent.icon}
//                   </div>
//                   <div className="flex-1">
//                     <div 
//                       className="inline-block px-3 py-1 rounded-full text-xs mb-2 flow-card"
//                     >
//                       {selectedEvent.type === 'milestone' && '🏆 Milestone'}
//                       {selectedEvent.type === 'habit' && '✨ Routine Started'}
//                       {selectedEvent.type === 'reflection' && '📝 Reflection'}
//                       {selectedEvent.type === 'mood' && '💭 Daily Check-in'}
//                     </div>
//                     <h2 className="text-white mb-1">{selectedEvent.title}</h2>
//                   </div>
//                 </div>
                
//                 <div className="text-sm opacity-90 flex items-center gap-2">
//                   <Calendar size={16} />
//                   {selectedEvent.date.toLocaleDateString('en-US', { 
//                     weekday: 'long',
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric' 
//                   })}
//                 </div>

//                 {/* Gradient overlay */}
//                 <div 
//                   className="absolute inset-0 opacity-20 pointer-events-none"
//                   style={{
//                     background: `radial-gradient(circle at top right, white, transparent)`,
//                   }}
//                 />
//               </div>

//               {/* Content */}
//               <div className="p-6">
//                 {selectedEvent.description && (
//                   <div className="mb-6">
//                     <h4 className="mb-2 text-gray-900">Details</h4>
//                     <p className="text-[var(--color-card-foreground)] leading-relaxed">{selectedEvent.description}</p>
//                   </div>
//                 )}

//                 {/* Mood details */}
//                 {selectedEvent.type === 'mood' && selectedEvent.mood && (
//                   <div className="mb-6">
//                     <h4 className="mb-3 text-gray-900">How you felt</h4>
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="flex-1 flex gap-1">
//                         {[1, 2, 3, 4, 5].map((i) => (
//                           <div
//                             key={i}
//                             className="flex-1 h-3 rounded-full transition-all"
//                             style={{
//                               backgroundColor: i <= selectedEvent.mood! 
//                                 ? selectedEvent.color 
//                                 : '#e5e7eb'
//                             }}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-sm opacity-70">
//                         {selectedEvent.mood.toFixed(1)}/5
//                       </span>
//                     </div>
//                     <p className="text-sm opacity-60">
//                       {selectedEvent.mood >= 4 
//                         ? 'You were feeling great this day! 🌟' 
//                         : selectedEvent.mood >= 3 
//                         ? 'A balanced, okay day ⚖️' 
//                         : 'It was a tough day, but you showed up 💪'}
//                     </p>
//                   </div>
//                 )}

//                 {/* Actions based on type */}
//                 <div className="flex gap-3">
//                   {selectedEvent.type === 'habit' && (
//                     < button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => {
//                         setSelectedEvent(null);
//                         onNavigate('habits');
//                       }}
//                       className="flex-1 py-3 rounded-xl text-white"
//                       style={{ backgroundColor: selectedEvent.color }}
//                     >
//                       View Habit
//                     </ button>
//                   )}
//                   {selectedEvent.type === 'reflection' && (
//                     < button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => {
//                         setSelectedEvent(null);
//                         onNavigate('reflection');
//                       }}
//                       className="flex-1 py-3 rounded-xl text-white"
//                       style={{ backgroundColor: selectedEvent.color }}
//                     >
//                       Open Reflections
//                     </ button>
//                   )}
//                   {selectedEvent.type === 'mood' && (
//                     < button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => {
//                         setSelectedEvent(null);
//                         onNavigate('coach');
//                       }}
//                       className="flex-1 py-3 rounded-xl text-white"
//                       style={{ backgroundColor: selectedEvent.color }}
//                     >
//                       Daily Check-in
//                     </ button>
//                   )}
//                   <button
//                     onClick={() => setSelectedEvent(null)}
//                     className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </ div>
//           </ div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
