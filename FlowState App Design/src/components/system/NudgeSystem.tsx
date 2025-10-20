// import {  useRef } from 'react';
//import { toast } from 'sonner@2.0.3';
// import { useTheme } from '../context/ThemeContext';
// import {  Droplet,  Moon, Heart, Wind } from 'lucide-react';

// interface NudgeConfig {
//   id: string;
//   message: string;
//   icon: any;
//   condition: () => boolean;
//   cooldown: number; // minutes before showing again
// }

// const NUDGE_CONFIGS: NudgeConfig[] = [
//   {
//     id: 'stretch',
//     message: 'Need a stretch? Your body will thank you 🌱',
//     icon: Wind,
//     condition: () => {
//       const hour = new Date().getHours();
//       return hour >= 10 && hour <= 16; // Mid-day
//     },
//     cooldown: 120, // 2 hours
//   },
//   {
//     id: 'hydrate',
//     message: 'Time for some water 💧',
//     icon: Droplet,
//     condition: () => {
//       const hour = new Date().getHours();
//       return hour >= 9 && hour <= 18;
//     },
//     cooldown: 90, // 1.5 hours
//   },
//   {
//     id: 'breath',
//     message: 'Take a moment to breathe deeply 🌸',
//     icon: Wind,
//     condition: () => {
//       const hour = new Date().getHours();
//       return hour >= 11 && hour <= 17;
//     },
//     cooldown: 150, // 2.5 hours
//   },
//   {
//     id: 'afternoon-check',
//     message: 'How are you feeling? Remember to be gentle with yourself',
//     icon: Heart,
//     condition: () => {
//       const hour = new Date().getHours();
//       return hour === 14 || hour === 15; // 2-3 PM
//     },
//     cooldown: 240, // 4 hours
//   },
//   {
//     id: 'evening-wind-down',
//     message: 'Evening approaching - time to start winding down 🌙',
//     icon: Moon,
//     condition: () => {
//       const hour = new Date().getHours();
//       return hour === 18 || hour === 19; // 6-7 PM
//     },
//     cooldown: 360, // 6 hours
//   },
// ];

// export function useNudgeSystem() {
  //const { themeColors, nudgesEnabled } = useTheme();
  // const lastShownRef = useRef<Map<string, number>>(new Map());
  //const checkIntervalRef = useRef<NodeJS.Timeout>();

  // useEffect(() => {
  //   // Don't set up nudges if disabled
  //   // if (!nudgesEnabled) {
  //   //   return;
  //   // }
  //   // Load last shown times from localStorage
  //   try {
  //     const saved = localStorage.getItem('flowstate-nudge-history');
  //     if (saved) {
  //       const history = JSON.parse(saved);
  //       lastShownRef.current = new Map(Object.entries(history));
  //     }
  //   } catch (error) {
  //     console.error('Error loading nudge history:', error);
  //   }

    // Check for nudges every 15 minutes
    // const checkNudges = () => {
    //   const now = Date.now();

    //   for (const nudge of NUDGE_CONFIGS) {
    //     const lastShown = lastShownRef.current.get(nudge.id) || 0;
    //     const timeSinceLastShown = (now - lastShown) / (1000 * 60); // minutes

    //     // Check if enough time has passed and condition is met
    //     if (timeSinceLastShown >= nudge.cooldown && nudge.condition()) {
    //       showNudge(nudge);
    //       lastShownRef.current.set(nudge.id, now);
          
    //       // Save to localStorage
    //       const history = Object.fromEntries(lastShownRef.current);
    //       localStorage.setItem('flowstate-nudge-history', JSON.stringify(history));
          
    //       // Only show one nudge at a time
    //       break;
    //     }
    //   }
    // };

    // Check immediately, then every 15 minutes
    // checkNudges();
    // checkIntervalRef.current = setInterval(checkNudges, 15 * 60 * 1000);

    // return () => {
    //   if (checkIntervalRef.current) {
    //     clearInterval(checkIntervalRef.current);
    //   }
    // };
  // }, [nudgesEnabled]);

  // const showNudge = (nudge: NudgeConfig) => {
  //   // const Icon = nudge.icon;
    
  //   // toast(nudge.message, {
  //   //   duration: 6000,
  //   //   icon: <Icon size={20} style={{ color: themeColors.primary }} />,
  //   //   style: {
  //   //     background: 'white',
  //   //     border: `1px solid ${themeColors.primaryLight}`,
  //   //     borderRadius: '16px',
  //   //     padding: '16px',
  //   //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  //   //   },
  //   //   className: 'gentle-nudge-toast',
  //   // });
  // };

//   return { showNudge };
// }

// Activity-based nudges that can be triggered manually
export function useActivityNudges() {
  // const { themeColors, nudgesEnabled } = useTheme();

  const showCompletionNudge = (count: number) => {
    // if (!nudgesEnabled) return;
    const messages = [
      { threshold: 1, text: 'Great start! You completed a task 🌟' },
      { threshold: 3, text: 'Small win: you checked off 3 to-dos! ✨' },
      { threshold: 5, text: 'Look at you go! 5 tasks done 🎉' },
      { threshold: 10, text: 'Amazing! You\'re on a roll with 10 tasks! 🚀' },
    ];

    const match = messages
      .reverse()
      .find(m => count >= m.threshold && count === m.threshold);

    if (match) {
      // toast(match.text, {
      //   duration: 5000,
      //   icon: <CheckCircle2 size={20} style={{ color: themeColors.primary }} />,
      //   style: {
      //     background: `linear-gradient(135deg, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      //     border: `1px solid ${themeColors.primaryLight}`,
      //     borderRadius: '16px',
      //     padding: '16px',
      //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      //   },
      // });
    }
  };

  const showMorningNudge = () => {
    // if (!nudgesEnabled) return;
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      // toast('Good morning! Ready to build your plan for today? ☀️', {
      //   duration: 6000,
      //   icon: <Sun size={20} style={{ color: themeColors.primary }} />,
      //   style: {
      //     background: 'white',
      //     border: `1px solid ${themeColors.primaryLight}`,
      //     borderRadius: '16px',
      //     padding: '16px',
      //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      //   },
      // });
    }
  };

  const showEncouragementNudge = () => {
    // if (!nudgesEnabled) return;
    
    // const messages = [
    //   'You\'re doing great! Every small step counts 💜',
    //   'Remember: progress, not perfection ✨',
    //   'Be proud of what you\'ve accomplished today 🌸',
    //   'Your effort matters, even on tough days 🌱',
    // ];

    // const message = messages[Math.floor(Math.random() * messages.length)];

    // toast(message, {
    //   duration: 6000,
    //   icon: <Sparkles size={20} style={{ color: themeColors.primary }} />,
    //   style: {
    //     background: 'white',
    //     border: `1px solid ${themeColors.primaryLight}`,
    //     borderRadius: '16px',
    //     padding: '16px',
    //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    //   },
    // });
  };

  const showRestNudge = () => {
    // if (!nudgesEnabled) return;
    
    // toast('It\'s okay to rest. Pause if you need to 🌙', {
    //   duration: 6000,
    //   icon: <Coffee size={20} style={{ color: themeColors.primary }} />,
    //   style: {
    //     background: 'white',
    //     border: `1px solid ${themeColors.primaryLight}`,
    //     borderRadius: '16px',
    //     padding: '16px',
    //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    //   },
    // });
  };

  return {
    showCompletionNudge,
    showMorningNudge,
    showEncouragementNudge,
    showRestNudge,
  };
}
