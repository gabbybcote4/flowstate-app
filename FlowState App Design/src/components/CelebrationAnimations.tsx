// src/components/CelebrationAnimations.tsx
// import { motion, AnimatePresence } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// import { Sparkles, Heart, Star, Flower2, CheckCircle } from 'lucide-react';

// /**
//  * Celebration Animations
//  * 
//  * Nurturing, calm celebration animations for achievements:
//  * - Reflection complete: Soft glow + affirmations
//  * - Week complete: Flower bloom
//  * - Habit streak: Ripple effect
//  * - Milestone: Gentle sparkles
//  */

// interface CelebrationProps {
//   type: 'reflection' | 'week' | 'streak' | 'milestone';
//   onComplete?: () => void;
//   affirmation?: string;
//   metadata?: any;
// }

// export function CelebrationAnimation({ type, onComplete, affirmation, metadata }: CelebrationProps) {
//   const { themeColors } = useTheme();
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//       if (onComplete) {
//         setTimeout(onComplete, 500);
//       }
//     }, 3500);

//     return () => clearTimeout(timer);
//   }, [onComplete]);

//   if (!isVisible) return null;

//   return (
//     <AnimatePresence>
//       <div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
//       >
//         {type === 'reflection' && (
//           <ReflectionGlow affirmation={affirmation} themeColors={themeColors} />
//         )}
//         {type === 'week' && (
//           <FlowerBloom themeColors={themeColors} />
//         )}
//         {type === 'streak' && (
//           <RippleEffect metadata={metadata} themeColors={themeColors} />
//         )}
//         {type === 'milestone' && (
//           <GentleSparkles themeColors={themeColors} />
//         )}
//       </ div>
//     </AnimatePresence>
//   );
// }

// // Soft glow with affirmation for reflection completion
// function ReflectionGlow({ affirmation, themeColors }: any) {
//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {/* Radial glow */}
//       <div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ 
//           scale: [0, 2, 2.5],
//           opacity: [0, 0.3, 0]
//         }}
//         transition={{ duration: 2.5, ease: 'easeOut' }}
//         className="absolute rounded-full blur-3xl"
//         style={{
//           width: '600px',
//           height: '600px',
//           background: `radial-gradient(circle, ${themeColors.primary}40, transparent)`,
//         }}
//       />

//       {/* Center affirmation card */}
//       <div
//         initial={{ scale: 0.8, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
//         className="flow-card"
//       >
//         <div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
//           className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
//           style={{ backgroundColor: `${themeColors.primary}20` }}
//         >
//           <Heart size={32} style={{ color: themeColors.primary }} />
//         </ div>

//         <motion.h3
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.7 }}
//           className="text-center mb-3"
//           style={{ color: themeColors.primary }}
//         >
//           Reflection Complete
//         </motion.h3>

//         <p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9 }}
//           className="text-center text-gray-600 leading-relaxed"
//         >
//           {affirmation || "You took time to reflect. That's beautiful growth. 🌱"}
//         </p>

//         {/* Gentle particles */}
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ 
//               opacity: [0, 0.6, 0],
//               scale: [0, 1, 0],
//               x: [0, (Math.random() - 0.5) * 100],
//               y: [0, -50 - Math.random() * 50],
//             }}
//             transition={{ 
//               delay: 1 + i * 0.1,
//               duration: 2,
//               ease: 'easeOut'
//             }}
//             className="absolute w-2 h-2 rounded-full"
//             style={{ 
//               backgroundColor: themeColors.primary,
//               left: '50%',
//               top: '50%',
//             }}
//           />
//         ))}
//       </ div>
//     </div>
//   );
// }

// // Flower bloom animation for week completion
// function FlowerBloom({ themeColors }: any) {
//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {/* Background bloom */}
//       <div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ 
//           scale: [0, 1.2, 1],
//           opacity: [0, 0.4, 0]
//         }}
//         transition={{ duration: 3, ease: 'easeOut' }}
//         className="absolute w-96 h-96 rounded-full blur-2xl"
//         style={{
//           background: `radial-gradient(circle, ${themeColors.primary}60, ${themeColors.secondary}40, transparent)`,
//         }}
//       />

//       {/* Flower center */}
//       <div
//         initial={{ scale: 0, rotate: -90 }}
//         animate={{ scale: 1, rotate: 0 }}
//         transition={{ duration: 1, ease: 'easeOut' }}
//         className="relative pointer-events-auto"
//       >
//         {/* Petals */}
//         {[...Array(8)].map((_, i) => {
//           const angle = (i * 360) / 8;
//           return (
//             <div
//               key={i}
//               initial={{ scale: 0, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ 
//                 delay: 0.3 + i * 0.1,
//                 duration: 0.6,
//                 ease: 'easeOut'
//               }}
//               className="absolute w-20 h-20 rounded-full"
//               style={{
//                 background: `linear-gradient(135deg, ${themeColors.primary}80, ${themeColors.secondary}60)`,
//                 left: '50%',
//                 top: '50%',
//                 transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-40px)`,
//               }}
//             />
//           );
//         })}

//         {/* Center */}
//         <div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 1, type: 'spring', stiffness: 200 }}
//           className="relative z-10 w-32 h-32 rounded-full flow-card"
//         >
//           <Flower2 size={48} style={{ color: themeColors.primary }} />
//         </ div>

//         {/* Completion message */}
//         <div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.5 }}
//           className="absolute -bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
//         >
//           <h3 style={{ color: themeColors.primary }}>Week Complete! 🌸</h3>
//           <p className="text-sm text-gray-600 mt-1">You've blossomed beautifully</p>
//         </ div>
//       </ div>
//     </div>
//   );
// }

// // Ripple effect for habit streaks
// function RippleEffect({ metadata, themeColors }: any) {
//   const streakCount = metadata?.streak || 7;

//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {/* Ripples */}
//       {[...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           initial={{ scale: 0, opacity: 0.6 }}
//           animate={{ 
//             scale: [0, 3, 4],
//             opacity: [0.6, 0.3, 0]
//           }}
//           transition={{ 
//             delay: i * 0.3,
//             duration: 2,
//             ease: 'easeOut'
//           }}
//           className="absolute rounded-full border-4"
//           style={{
//             width: '200px',
//             height: '200px',
//             borderColor: themeColors.primary,
//           }}
//         />
//       ))}

//       {/* Center badge */}
//       <div
//         initial={{ scale: 0, rotate: -180 }}
//         animate={{ scale: 1, rotate: 0 }}
//         transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
//         className="relative z-10 flow-card"
//       >
//         <CheckCircle size={64} style={{ color: themeColors.primary }} />
        
//         <div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//           className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
//         >
//           <h3 style={{ color: themeColors.primary }}>{streakCount} Day Streak! 🔥</h3>
//           <p className="text-sm text-gray-600 mt-1">Consistency is your superpower</p>
//         </ div>
//       </ div>

//       {/* Floating particles */}
//       {[...Array(12)].map((_, i) => (
//         <div
//           key={i}
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ 
//             opacity: [0, 1, 0],
//             scale: [0, 1.5, 0],
//             x: [0, (Math.random() - 0.5) * 200],
//             y: [0, -100 - Math.random() * 100],
//           }}
//           transition={{ 
//             delay: 0.5 + i * 0.1,
//             duration: 2.5,
//             ease: 'easeOut'
//           }}
//           className="absolute w-3 h-3 rounded-full"
//           style={{ 
//             backgroundColor: themeColors.primary,
//             left: '50%',
//             top: '50%',
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// // Gentle sparkles for milestones
// function GentleSparkles({ themeColors }: any) {
//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {/* Sparkle particles */}
//       {[...Array(20)].map((_, i) => {
//         const angle = (i * 360) / 20;
//         const distance = 150 + Math.random() * 100;
        
//         return (
//           <div
//             key={i}
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ 
//               opacity: [0, 1, 0.8, 0],
//               scale: [0, 1.5, 1, 0],
//             }}
//             transition={{ 
//               delay: i * 0.05,
//               duration: 2,
//               ease: 'easeOut'
//             }}
//             className="absolute"
//             style={{
//               left: '50%',
//               top: '50%',
//               transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance}px)`,
//             }}
//           >
//             <Sparkles size={24} style={{ color: themeColors.primary }} />
//           </ div>
//         );
//       })}

//       {/* Center message */}
//       <div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.3, type: 'spring' }}
//         className="flow-card"
//       >
//         <div
//           animate={{ rotate: [0, 10, -10, 0] }}
//           transition={{ delay: 0.8, duration: 0.5 }}
//         >
//           <Star size={48} className="mx-auto mb-4" style={{ color: themeColors.primary }} />
//         </ div>
        
//         <h3 className="mb-2" style={{ color: themeColors.primary }}>
//           Milestone Reached! ✨
//         </h3>
//         <p className="text-sm text-gray-600">
//           Every step forward matters. You're doing amazing.
//         </p>
//       </ div>
//     </div>
//   );
// }

// // Affirmation toast for smaller wins
// export function AffirmationToast({ message, icon = '💜' }: { message: string; icon?: string }) {
//   return (
//     <div
//       initial={{ opacity: 0, y: 20, scale: 0.9 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 shadow-lg border border-purple-200"
//     >
//       <span className="text-2xl">{icon}</span>
//       <p className="text-sm text-[var(--color-card-foreground)]">{message}</p>
//     </ div>
//   );
// }
