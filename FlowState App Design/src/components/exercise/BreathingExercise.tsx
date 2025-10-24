// import React, { useState, useEffect } from 'react';
// import { Play, Pause } from 'lucide-react';

// type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

// export function BreathingExercise() {
//   const [isActive, setIsActive] = useState(false);
//   const [phase, setPhase] = useState<BreathPhase>('inhale');
//   const [cycles, setCycles] = useState(0);

//   const phaseConfig = {
//     inhale: { duration: 4, text: 'Breathe In', color: 'from-blue-300 to-lavender-300' },
//     hold: { duration: 4, text: 'Hold', color: 'from-lavender-300 to-purple-300' },
//     exhale: { duration: 6, text: 'Breathe Out', color: 'from-purple-300 to-pink-300' },
//     rest: { duration: 2, text: 'Rest', color: 'from-pink-200 to-peach-200' },
//   };

//   useEffect(() => {
//     if (!isActive) return;

//     const currentPhase = phaseConfig[phase];
//     const timer = setTimeout(() => {
//       // Move to next phase
//       if (phase === 'inhale') setPhase('hold');
//       else if (phase === 'hold') setPhase('exhale');
//       else if (phase === 'exhale') setPhase('rest');
//       else {
//         setPhase('inhale');
//         setCycles(prev => prev + 1);
//       }
//     }, currentPhase.duration * 1000);

//     return () => clearTimeout(timer);
//   }, [isActive, phase]);

//   const handleToggle = () => {
//     if (!isActive) {
//       setPhase('inhale');
//       setCycles(0);
//     }
//     setIsActive(!isActive);
//   };

//   const currentConfig = phaseConfig[phase];
//   const scale = phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : 0.6;

//   return (
//     <div className="flex flex-col items-center">
//       {/* Cycles Counter */}
//       {cycles > 0 && (
//         <div
//           className="mb-6 px-6 py-3 flow-card"
//         >
//           <p className="text-lavender-600">
//             <span className="text-2xl">{cycles}</span> {cycles === 1 ? 'cycle' : 'cycles'} completed
//           </p>
//         </ div>
//       )}

//       {/* Breathing Circle */}
//       <div className="relative w-80 h-80 flex items-center justify-center mb-12">
//         {/* Animated breathing circle */}
//         <div


//           className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${currentConfig.color} shadow-2xl`}
//         >
//           {/* Inner glow effect */}
//           <div

//             className="absolute inset-0 rounded-full flow-card"
//           />
//         </ div>

//         {/* Instruction text */}

//         {isActive && (
//           <div
//             key={phase}

//             className="absolute text-center z-10"
//           >
//             <p className="text-3xl text-lavender-700 mb-2">
//               {currentConfig.text}
//             </p>
//             <div

//               className="text-sm opacity-60"
//             >
//               {currentConfig.duration}s
//             </ div>
//           </ div>
//         )}


//         {/* Start prompt */}
//         {!isActive && (
//           <div

//             className="absolute text-center z-10"
//           >
//             <p className="text-2xl text-lavender-600 mb-2">Ready to breathe?</p>
//             <p className="text-sm opacity-60">Box breathing • 4-4-6-2</p>
//           </ div>
//         )}

//         {/* Pulse rings */}
//         {isActive && (
//           <>
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}

//                 className={`absolute w-48 h-48 rounded-full border-2 border-lavender-300`}
//               />
//             ))}
//           </>
//         )}
//       </div>

//       {/* Control Button */}
//       < button

//         onClick={handleToggle}
//         className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender-400 to-purple-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
//       >
//         {isActive ? (
//           <div
//             key="pause"

//           >
//             <Pause size={36} fill="white" />
//           </ div>
//         ) : (
//           <div
//             key="play"

//           >
//             <Play size={36} fill="white" className="ml-1" />
//           </ div>
//         )}
//       </ button>

//       {/* Guidance text */}
//       {!isActive && (
//         <p

//           className="mt-8 text-center max-w-xs"
//         >
//           Box breathing helps reduce stress and improve focus. Follow the circle as it expands and contracts.
//         </p>
//       )}
//     </div>
//   );
// }
