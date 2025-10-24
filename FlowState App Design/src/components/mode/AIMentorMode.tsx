// import { useState, useEffect } from 'react';
// //import { useTheme } from '../components/context/ThemeContext';
// import { 
//   //Bot, 
//   //Volume2, 
//   //VolumeX, 
//   Heart, 
//   //TrendingUp, 
//   Brain,
//   Sparkles,
//   //MessageCircle,
//   //Settings,
//   //ArrowRight,
//   //CheckCircle2,
//   //AlertCircle,
//   //Zap,
//   //Coffee,
//   Moon,
//   Sun
// } from 'lucide-react';
// //import { toast } from 'sonner';

// interface CheckInData {
//   mood: number;
//   energy: number;
//   focus: number;
//   timestamp: string;
// }

// export function AIMentorMode() {
//   //const { themeColors } = useTheme();
//   const [personality, setPersonality] = useState<'gentle' | 'motivational' | 'analytical'>('gentle');
//   const [voiceEnabled, setVoiceEnabled] = useState(false);
//   //const [isSpeaking, setIsSpeaking] = useState(false);
//   //const [proactiveMessages, setProactiveMessages] = useState<any[]>([]);
//   const [currentMessage, setCurrentMessage] = useState<any | null>(null);
//   //const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     // Load preferences
//     const savedPersonality = localStorage.getItem('flowstate-mentor-personality');
//     const savedVoice = localStorage.getItem('flowstate-mentor-voice');
    
//     if (savedPersonality) setPersonality(savedPersonality as any);
//     if (savedVoice) setVoiceEnabled(savedVoice === 'true');

//     // Generate proactive messages on mount
//     analyzeUserState();
//   }, []);

//   useEffect(() => {
//     // Save preferences
//     localStorage.setItem('flowstate-mentor-personality', personality);
//     localStorage.setItem('flowstate-mentor-voice', voiceEnabled.toString());
//   }, [personality, voiceEnabled]);

//   const analyzeUserState = () => {
//     const messages: any[] = [];
    
//     // Check energy trend (last 3 days)
//     const energyTrend = checkEnergyTrend();
//     if (energyTrend.lowEnergyDays >= 3) {
//       messages.push({
//         id: 'low-energy-trend',
//         type: 'alert',
//         priority: 'high',
//         title: 'I\'ve noticed a pattern',
//         //message: generateMessage('low-energy-trend', personality),
//         action: {
//           label: 'Try a rest routine',
//           screen: 'habits',
//           suggestion: 'rest'
//         },
//         icon: Moon,
//         color: '#8B5CF6'
//       });
//     }

//     // Check habit completion rate
//     const habitStats = checkHabitCompletion();
//     if (habitStats.completionRate > 0 && habitStats.completionRate < 0.3) {
//       messages.push({
//         id: 'low-habit-completion',
//         type: 'encouragement',
//         priority: 'medium',
//         title: 'Let\'s adjust your approach',
//         //message: generateMessage('low-completion', personality),
//         action: {
//           label: 'Review your habits',
//           screen: 'habits'
//         },
//         icon: Heart,
//         color: '#EC4899'
//       });
//     } else if (habitStats.completionRate >= 0.8) {
//       messages.push({
//         id: 'high-habit-completion',
//         type: 'celebration',
//         priority: 'medium',
//         title: 'You\'re doing amazing!',
//         //message: generateMessage('high-completion', personality),
//         action: {
//           label: 'See your growth',
//           screen: 'growth'
//         },
//         icon: Sparkles,
//         color: '#10B981'
//       });
//     }

//     // Check if user hasn't reflected recently
//     const daysSinceReflection = checkReflectionFrequency();
//     if (daysSinceReflection >= 3) {
//       messages.push({
//         id: 'no-reflection',
//         type: 'nudge',
//         priority: 'low',
//         title: 'Take a moment to reflect',
//         //message: generateMessage('no-reflection', personality),
//         action: {
//           label: 'Open reflection',
//           screen: 'reflection'
//         },
//         icon: Brain,
//         color: '#F59E0B'
//       });
//     }

//     // Check time of day for contextual suggestions
//     const timeOfDay = new Date().getHours();
//     if (timeOfDay >= 6 && timeOfDay < 9) {
//       messages.push({
//         id: 'morning-routine',
//         type: 'timing',
//         priority: 'medium',
//         title: 'Good morning!',
//         //message: generateMessage('morning', personality),
//         action: {
//           label: 'Start your day',
//           screen: 'coach'
//         },
//         icon: Sun,
//         color: '#F59E0B'
//       });
//     } else if (timeOfDay >= 20 && timeOfDay < 23) {
//       messages.push({
//         id: 'evening-routine',
//         type: 'timing',
//         priority: 'medium',
//         title: 'Evening check-in',
//        // message: generateMessage('evening', personality),
//         action: {
//           label: 'Wind down',
//           screen: 'reflection'
//         },
//         icon: Moon,
//         color: '#8B5CF6'
//       });
//     }

//     // Sort by priority
//     //const priorityOrder = { high: 0, medium: 1, low: 2 };
//     //messages.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

//    // setProactiveMessages(messages);
    
//     // Set current message to highest priority
//     if (messages.length > 0 && !currentMessage) {
//       setCurrentMessage(messages[0]);
//     }
//   };

//   const checkEnergyTrend = () => {
//     let lowEnergyDays = 0;
//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       return date.toDateString();
//     });

//     last7Days.forEach(dateStr => {
//       const savedData = localStorage.getItem(`flowstate-checkin-${dateStr}`);
//       if (savedData) {
//         try {
//           const data: CheckInData = JSON.parse(savedData);
//           if (data.energy <= 2) lowEnergyDays++;
//         } catch (e) {
//           console.error('Error parsing check-in data', e);
//         }
//       }
//     });

//     return { lowEnergyDays };
//   };

//   const checkHabitCompletion = () => {
//     const habits = JSON.parse(localStorage.getItem('flowstate-habits') || '[]');
//     if (habits.length === 0) return { completionRate: 0, totalHabits: 0 };

//     const today = new Date().toDateString();
//     const completedToday = habits.filter((h: any) => 
//       h.completedSlots && h.completedSlots.some((slot: any) => slot.date === today)
//     ).length;

//     return {
//       completionRate: completedToday / habits.length,
//       totalHabits: habits.length,
//       completedToday
//     };
//   };

//   const checkReflectionFrequency = () => {
//     const reflections = JSON.parse(localStorage.getItem('flowstate-reflections') || '{}');
//     const dates = Object.keys(reflections).sort((a, b) => 
//       new Date(b).getTime() - new Date(a).getTime()
//     );
    
//     if (dates.length === 0) return 999; // Never reflected
    
//     const lastReflectionDate = new Date(dates[0]);
//     const today = new Date();
//     const diffTime = Math.abs(today.getTime() - lastReflectionDate.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     return diffDays;
//   };

//   //const generateMessage = (context: string, personalityType: string) => {
//     //const messages = {
//       //'low-energy-trend': {
//       //  gentle: "Hey there. I've noticed you've been running low on energy for a few days now. That's your body asking for something. How about we try a gentle rest routine? Even 10 minutes of stillness counts. You deserve to recharge. 💜",
//       //  motivational: "I see you've been pushing through some low-energy days. That takes real strength! But even champions need recovery time. Let's build a power-rest routine that'll get you back to 100%. You've got this! 💪",
//       //  analytical: "Data shows your energy levels have been below 3/5 for three consecutive days. Research suggests that consistent low energy often indicates a need for routine adjustment. I recommend implementing a structured rest protocol. Evidence-based recovery practices typically show improvement within 48-72 hours. 📊"
//       //},
//       //'low-completion': {
//       //  gentle: "I see your habits haven't been flowing easily lately, and that's completely okay. Sometimes life just gets heavy. What if we simplified things? Less pressure, more compassion. Small steps are still steps forward. 🌱",
//       //  motivational: "You're capable of so much more than what the numbers show! Let's reignite that fire. I know you can do this - you just need the right game plan. Ready to level up your habit game? Let's go! 🔥",
//       //  analytical: "Your current habit completion rate is below 30%. This suggests a potential misalignment between habit difficulty and current capacity. Recommendation: Reduce habit frequency by 40% and increase difficulty gradually using progressive overload principles. 📈"
//       //},
//       //'high-completion': {
//       //  gentle: "Look at you, showing up day after day. I'm so proud of the consistency you're building. This is what growth looks like - steady, patient, and beautiful. Keep being amazing. ✨",
//       //  motivational: "YES! This is what I'm talking about! You're absolutely crushing it with your habits! This momentum is UNSTOPPABLE. Keep this energy going - you're building something incredible! 🚀",
//       //  analytical: "Excellent performance: 80%+ habit completion rate achieved. This consistency level correlates with a 94% probability of long-term habit retention. Optimal time to introduce habit stacking or slight difficulty increase for continued growth. 📊"
//       //},
//       //'no-reflection': {
//       //  gentle: "It's been a little while since you've taken time to reflect. Your thoughts and feelings matter. Even a few quiet moments of journaling can bring so much clarity and peace. No pressure - whenever you're ready. 🌸",
//       //  motivational: "Time to level up your self-awareness game! Reflection is how winners learn and grow. Let's capture some insights about your journey - 5 minutes could unlock your next breakthrough! 💡",
//       //  analytical: "Reflection frequency has decreased. Studies indicate that weekly reflection increases goal achievement by 23% and reduces stress by 31%. Suggested interval: 3-4 days between reflections for optimal benefit. 🧠"
//      // },
//      // 'morning': {
//     //    gentle: "Good morning, friend. A new day, a fresh start. There's no rush - just breathe, be present, and let's take this one gentle step at a time. How are you feeling? ☀️",
//      //   motivational: "GOOD MORNING! Today is YOUR day to shine! You woke up with purpose - now let's make it count! What's one powerful thing you're going to accomplish today? Let's DO THIS! 🌟",
//      //   analytical: "Morning check-in initiated. Optimal time for goal-setting and priority alignment. Morning routines completed within the first 90 minutes of waking correlate with 40% higher daily productivity. Ready to optimize your day? ⚡"
//     //  },
//    //   'evening': {
//      //   gentle: "The day is winding down. You made it through - that's worth celebrating. Take a moment to be kind to yourself. What went well today? Even the smallest thing counts. 🌙",
//     //    motivational: "Another day conquered! Time to review your wins and prepare for tomorrow's victories. You're building momentum every single day. Rest well, champion - you earned it! 💪",
//     //    analytical: "Evening analysis period. Optimal time for reflection and next-day planning. Studies show evening reviews increase task completion by 26% the following day. Recommended: 10-minute reflection + priority setting. 📋"
//     //  }
//   //  };

//     //return messages[context]?.[personalityType] || "I'm here to support you on your journey. 💜";
//   };

//   //const speakMessage = (text: string) => {
//  //   if (!voiceEnabled) return;
    
//     // Cancel any current speech
//   //  window.speechSynthesis.cancel();
    
//  //   const utterance = new SpeechSynthesisUtterance(text);
    
//     // Adjust voice based on personality
//  //   utterance.rate = personality === 'motivational' ? 1.1 : personality === 'analytical' ? 0.9 : 1.0;
//  //   utterance.pitch = personality === 'gentle' ? 1.1 : personality === 'motivational' ? 1.2 : 1.0;
    
//  //   utterance.onstart = () => setIsSpeaking(true);
//  //   utterance.onend = () => setIsSpeaking(false);
    
// //    window.speechSynthesis.speak(utterance);
//  // };

//  // const stopSpeaking = () => {
// //    window.speechSynthesis.cancel();
// //    setIsSpeaking(false);
// //  };

//  // const handleMessageAction = (message: any) => {
//  //   if (message.action?.screen) {
//       //toast.success('Opening ' + message.action.screen);
//       // Navigation would happen here via props
//  //   }
//  // };

//   //const getPersonalityColor = (p: string) => {
//   //  switch (p) {
//    //   case 'gentle': return '#A78BFA';
//   //    case 'motivational': return '#EF4444';
//    //   case 'analytical': return '#3B82F6';
//   //    default: return themeColors.primary;
//   //  }
//   //};

//   //const getPersonalityIcon = (p: string) => {
//   //  switch (p) {
//    //   case 'gentle': return Heart;
//    //   case 'motivational': return Zap;
//     //  case 'analytical': return Brain;
//    //   default: return Heart;
//   //  }
//   //};

//   return (
//     <div 
//       className="min-h-screen pb-24"
//       style={{ 
//         //background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})` 
//       }}
//     >
//       <div className="p-6 md:p-8 pt-12 md:pt-16">
//         <div className="max-w-2xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center gap-2 mb-3">
//               <Bot size={28}  />
//               <h1>AI Mentor Mode</h1>
//             </div>
//             <p className="opacity-70 max-w-md mx-auto">
//               Your proactive coach, checking in and guiding you based on patterns in your journey
//             </p>
//           </div>

//           {/* Settings Toggle */}
//           < button
//             //whileHover={{ scale: 1.02 }}
//             //whileTap={{ scale: 0.98 }}
//             onClick={() => setShowSettings(!showSettings)}
//             className="w-full mb-6 flow-card"
//           >
//             <div className="flex items-center gap-3">
//               <Settings size={20}  />
//               <span>Mentor Settings</span>
//             </div>
//             <div
//             >
//               <ArrowRight size={20} className="transform rotate-90" />
//             </ div>
//           </ button>

//           {/* Settings Panel */}
//             {showSettings && (
//               <div
//                 className="overflow-hidden mb-6"
//               >
//                 <div className="flow-card">
//                   {/* Voice Toggle */}
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-3">
//                         {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
//                         <div>
//                           <h4 className="mb-1">Voice Coaching</h4>
//                           <p className="text-sm opacity-60">Hear your mentor speak messages aloud</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => {
//                          // setVoiceEnabled(!voiceEnabled);
//                           //toast.success(
//                            // !voiceEnabled ? 'Voice enabled! 🔊' : 'Voice disabled',
//                            //</div> { duration: 2000 }
//                           //);
//                         }}
//                         className="relative w-14 h-8 rounded-full transition-colors"
//                         style={{ 
//                           //backgroundColor: voiceEnabled ? themeColors.primary : '#e5e7eb' 
//                         }}
//                       >
//                         <div
//                           className="absolute top-1 w-6 h-6 flow-card"
//                         />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Personality Selector */}
//                   <div>
//                     <h4 className="mb-4 flex items-center gap-2">
//                       <Sparkles size={18}  />
//                       Mentor Personality
//                     </h4>
//                     <div className="grid grid-cols-1 gap-3">
//                       {[
//                         { 
//                           value: 'gentle', 
//                           label: 'Gentle', 
//                           icon: Heart,
//                           description: 'Compassionate, patient, and nurturing',
//                           color: '#A78BFA'
//                         },
//                         { 
//                           value: 'motivational', 
//                           label: 'Motivational', 
//                           icon: Zap,
//                           description: 'Energetic, encouraging, and driven',
//                           color: '#EF4444'
//                         },
//                         { 
//                           value: 'analytical', 
//                           label: 'Analytical', 
//                           icon: Brain,
//                           description: 'Data-driven, strategic, and precise',
//                           color: '#3B82F6'
//                         }
//                       ].map((option) => {
//                         const Icon = option.icon;
//                         //const isSelected = personality === option.value;
//                         return (
//                           < button
//                             key={option.value}
//                             //whileHover={{ scale: 1.02 }}
//                             //whileTap={{ scale: 0.98 }}
//                             onClick={() => {
//                               //setPersonality(option.value as any);
//                               //toast.success(`Mentor personality: ${option.label}`, {
//                               //  duration: 2000
//                               //});
//                              // analyzeUserState(); // Re-generate messages
//                             }}
//                             className="p-4 rounded-xl border-2 transition-all text-left"
//                             style={{
//                              // borderColor: isSelected ? option.color : '#e5e7eb',
//                               //backgroundColor: isSelected ? `${option.color}10` : 'white',
//                             }}
//                           >
//                             <div className="flex items-start gap-3">
//                               <div 
//                                 className="w-10 h-10 rounded-full flex items-center justify-center"
//                                 style={{ backgroundColor: `${option.color}20` }}
//                               >
//                                 <Icon size={20} style={{ color: option.color }} />
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <span className="font-medium">{option.label}</span>
//                                   {isSelected && (
//                                     <CheckCircle2 size={16} style={{ color: option.color }} />
//                                   )}
//                                 </div>
//                                 <p className="text-sm opacity-60">{option.description}</p>
//                               </div>
//                             </div>
//                           </ button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </ div>
//             )}

//           {/* Current Message Card */}
//           {currentMessage && (
//             <div
//               className="mb-6 flow-card"
//             >
//               <div 
//                 className="p-6 text-white"
//                 style={{ backgroundColor: currentMessage.color }}
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 flow-card">
//                       <currentMessage.icon size={24} />
//                     </div>
//                     <h3 className="text-white">{currentMessage.title}</h3>
//                   </div>
//                   {voiceEnabled && (
//                     <button
//                       onClick={() => 
//                         isSpeaking 
//                           ? stopSpeaking() 
//                           : speakMessage(currentMessage.message)
//                       }
//                       className="w-10 h-10 rounded-full flow-card"
//                     >
//                       {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="p-6">
//                 <p className="leading-relaxed mb-6 text-[var(--color-card-foreground)]">
//                   {currentMessage.message}
//                 </p>

//                 <div className="flex gap-3">
//                   {currentMessage.action && (
//                     < button
//                       //whileHover={{ scale: 1.02 }}
//                       //whileTap={{ scale: 0.98 }}
//                       onClick={() => handleMessageAction(currentMessage)}
//                       className="flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-2"
//                       style={{ backgroundColor: currentMessage.color }}
//                     >
//                       <span>{currentMessage.action.label}</span>
//                       <ArrowRight size={18} />
//                     </ button>
//                   )}
//                   <button
//                     onClick={() => {
//                       const nextIndex = (proactiveMessages.indexOf(currentMessage) + 1) % proactiveMessages.length;
//                       setCurrentMessage(proactiveMessages[nextIndex]);
//                       stopSpeaking();
//                     }}
//                     className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
//                     disabled={proactiveMessages.length <= 1}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </ div>
//           )}

//           {/* All Messages List */}
//           <div className="space-y-4">
//             <h3 className="flex items-center gap-2 px-2">
//               <MessageCircle size={18} style={{ color: themeColors.primary }} />
//               All Insights ({proactiveMessages.length})
//             </h3>

//             {proactiveMessages.length === 0 ? (
//               <div className="flow-card">
//                 <Bot size={48} className="mx-auto mb-4 opacity-20" />
//                 <p className="opacity-60">No insights right now. Keep building your routine!</p>
//               </div>
//             ) : (
//               //proactiveMessages.map((message, ) => {
//                // const Icon = message.icon;
//               //  const isActive = currentMessage?.id === message.id;
                
//               //  return (
//               //    < button
//               //      key={message.id}
//                     //whileHover={{ scale: 1.02 }}
//               //      onClick={() => {
//                       //setCurrentMessage(message);
//                       //stopSpeaking();
//                      // if (voiceEnabled) {
//                      //   speakMessage(message.message);
//                      // }
//                    // }}
//                //     className="w-full flow-card"
//                //     style={{
//               //        borderLeft: isActive ? `4px solid ${message.color}` : '4px solid transparent',
//               //        backgroundColor: isActive ? `${message.color}10` : 'white'
//               //      }}
//               //    >
//               //      <div 
//              //         className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//                //       style={{ backgroundColor: `${message.color}20` }}
//               //      >
//               //</div>        <Icon size={24} style={{ color: message.color }} />
//                //     </div>
//               //      <div className="flex-1">
//               //        <h4 className="mb-1">{message.title}</h4>
//               //</div>        <p className="text-sm opacity-60 line-clamp-2">{message.message}</p>
//              //       </div>
//                //     {isActive && (
//               //        <div 
//               //          className="w-2 h-2 rounded-full"
//               //          style={{ backgroundColor: message.color }}
//               //        />
//                //</div>     )}
//              //     </ button>
//             //    );
//           //    })
//          //   )}
//        //   </div>

//           {/* Refresh Button */}
//        //</div>   < button
//            // whileHover={{ scale: 1.02 }}
//             //whileTap={{ scale: 0.98 }}
//        //     onClick={() => {
//              // analyzeUserState();
//               //toast.success('Refreshed insights!', { duration: 2000 });
//        //     }}
//        //     className="w-full mt-6 py-4 rounded-2xl flow-card"
//            // style={{ color: themeColors.primary }}
//        //   >
//       //      <Sparkles size={20} />
//       //</div>      <span>Refresh Insights</span>
//      //</div>     </ button>
//    //     </div>
//  //     </div>
//  //   </div>
// //  );
// }
