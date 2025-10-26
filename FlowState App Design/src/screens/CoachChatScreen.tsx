//src/screens/CoachChatScreen.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../components/ThemeContext';
import { MessageCircle, Send, Sparkles, TrendingUp, Moon, Brain, Heart, RotateCcw, ArrowLeft, Activity, Coffee, Sun, Lightbulb, Zap, Target } from 'lucide-react';

import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'coach' | 'user';
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  tone?: 'gentle' | 'motivational' | 'analytical';
}

interface QuickReply {
  id: string;
  text: string;
  action?: string;
}

interface UserContext {
  mood?: number;
  energy?: number;
  focus?: number;
  sleepHours?: number;
  mainFocus?: string;
  completedHabits?: number;
  totalHabits?: number;
  steps?: number;
}

interface InsightChip {
  id: string;
  type: 'sleep' | 'mood' | 'steps' | 'energy' | 'habits';
  label: string;
  value: string;
  color: string;
  icon: any;
}

interface CoachChatScreenProps {
  onNavigate: (screen: string) => void;
}

export function CoachChatScreen({ onNavigate }: CoachChatScreenProps) {
  const { themeColors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({});
  const [coachTone, setCoachTone] = useState<'gentle' | 'motivational' | 'analytical'>('gentle');
  const [insightChips, setInsightChips] = useState<InsightChip[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationStage, setConversationStage] = useState(0);

  // Predefined quick action buttons
  const quickActions = [
    { id: 'reframe', text: 'Reframe this', icon: Brain, action: 'reframe' },
    { id: 'encourage', text: 'Encourage me', icon: Heart, action: 'encourage' },
    { id: 'simplify', text: 'Simplify plan', icon: Target, action: 'simplify' },
  ];

  // Load conversation history
  useEffect(() => {
    const savedMessages = localStorage.getItem('flowstate-coach-chat');
    const savedContext = localStorage.getItem('flowstate-coach-context');
    const savedTone = localStorage.getItem('flowstate-coach-tone');
    const lastChatDate = localStorage.getItem('flowstate-coach-chat-date');
    const today = new Date().toDateString();

    if (savedTone) {
      setCoachTone(savedTone as 'gentle' | 'motivational' | 'analytical');
    }

    if (savedMessages && lastChatDate === today) {
      setMessages(JSON.parse(savedMessages).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
      if (savedContext) {
        setUserContext(JSON.parse(savedContext));
      }
    } else {
      // Start new conversation
      startNewConversation();
    }

    // Load user data for context
    loadUserContext();
  }, []);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('flowstate-coach-chat', JSON.stringify(messages));
      localStorage.setItem('flowstate-coach-chat-date', new Date().toDateString());
    }
  }, [messages]);

  // Save context
  useEffect(() => {
    localStorage.setItem('flowstate-coach-context', JSON.stringify(userContext));
  }, [userContext]);

  // Save tone
  useEffect(() => {
    localStorage.setItem('flowstate-coach-tone', coachTone);
  }, [coachTone]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Generate insight chips based on context
  useEffect(() => {
    const chips: InsightChip[] = [];

    if (userContext.sleepHours !== undefined) {
      const sleepQuality = userContext.sleepHours >= 7 ? 'good' : userContext.sleepHours >= 6 ? 'fair' : 'low';
      chips.push({
        id: 'sleep',
        type: 'sleep',
        label: 'Sleep',
        value: `${userContext.sleepHours}h`,
        color: sleepQuality === 'good' ? '#10b981' : sleepQuality === 'fair' ? '#f59e0b' : '#ef4444',
        icon: Moon,
      });
    }

    if (userContext.mood !== undefined) {
      const moodLabel = userContext.mood >= 4 ? 'Great' : userContext.mood >= 3 ? 'Good' : userContext.mood >= 2 ? 'Fair' : 'Low';
      chips.push({
        id: 'mood',
        type: 'mood',
        label: 'Mood',
        value: moodLabel,
        color: userContext.mood >= 3 ? '#ec4899' : '#9ca3af',
        icon: Heart,
      });
    }

    if (userContext.energy !== undefined) {
      const energyLabel = userContext.energy >= 4 ? 'High' : userContext.energy >= 3 ? 'Good' : userContext.energy >= 2 ? 'Low' : 'Very Low';
      chips.push({
        id: 'energy',
        type: 'energy',
        label: 'Energy',
        value: energyLabel,
        color: userContext.energy >= 3 ? '#f97316' : '#9ca3af',
        icon: Zap,
      });
    }

    if (userContext.steps !== undefined && userContext.steps > 0) {
      chips.push({
        id: 'steps',
        type: 'steps',
        label: 'Steps',
        value: userContext.steps >= 1000 ? `${Math.round(userContext.steps / 1000)}k` : `${userContext.steps}`,
        color: '#06b6d4',
        icon: Activity,
      });
    }

    if (userContext.completedHabits !== undefined && userContext.totalHabits !== undefined) {
      const progress = Math.round((userContext.completedHabits / userContext.totalHabits) * 100);
      chips.push({
        id: 'habits',
        type: 'habits',
        label: 'Habits',
        value: `${userContext.completedHabits}/${userContext.totalHabits}`,
        color: progress >= 70 ? '#10b981' : progress >= 40 ? '#f59e0b' : '#9ca3af',
        icon: Target,
      });
    }

    setInsightChips(chips);
  }, [userContext]);

  const loadUserContext = () => {
    // Load from other screens
    const checkInData = localStorage.getItem('flowstate-coaching-data');
    const habits = localStorage.getItem('flowstate-habits');
    const reflections = localStorage.getItem('flowstate-reflections');
    
    const context: UserContext = {};

    // Load mood/energy/focus
    if (checkInData) {
      const data = JSON.parse(checkInData);
      context.mood = data.mood;
      context.energy = data.energy;
      context.focus = data.focus;
    }

    // Load habit completion
    if (habits) {
      const habitsList = JSON.parse(habits);
      const today = new Date().toDateString();
      const completedToday = habitsList.filter((h: any) => 
        h.completedSlots && h.completedSlots.some((slot: any) => slot.date === today)
      ).length;
      context.completedHabits = completedToday;
      context.totalHabits = habitsList.filter((h: any) => h.isActive).length;
    }

    // Estimate sleep from reflection data (if available)
    if (reflections) {
      try {
        const reflectionData = JSON.parse(reflections);
        const today = new Date().toDateString();
        const todayReflection = reflectionData[today];
        if (todayReflection?.sleepQuality) {
          // Estimate sleep hours from quality (rough approximation)
          const quality = todayReflection.sleepQuality;
          context.sleepHours = quality >= 4 ? 8 : quality >= 3 ? 6.5 : quality >= 2 ? 5.5 : 4;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Mock steps data (could integrate with health APIs)
    context.steps = Math.floor(Math.random() * 8000) + 2000;

    setUserContext(context);
  };

  const startNewConversation = () => {
    const greeting = getTimeBasedGreeting();
    addCoachMessage(greeting.message, greeting.quickReplies);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const { completedHabits, totalHabits, mood, energy, sleepHours } = userContext;
    
    // Build context-aware message based on tone
    let contextNote = '';
    if (mood && mood <= 2 && energy && energy <= 2) {
      contextNote = coachTone === 'gentle' 
        ? ' I notice your energy and mood are both low today. ' 
        : coachTone === 'motivational' 
        ? ' I see you\'re facing some challenges today. Let\'s turn this around! '
        : ' Data shows low mood and energy levels today. ';
    } else if (energy && energy <= 2) {
      contextNote = coachTone === 'gentle'
        ? ' I notice you\'re running on low energy. '
        : coachTone === 'motivational'
        ? ' Your energy is low, but we can work with that! '
        : ' Energy levels are currently low. ';
    } else if (mood && mood >= 4 && energy && energy >= 4) {
      contextNote = coachTone === 'gentle'
        ? ' You seem to be in a great headspace today! '
        : coachTone === 'motivational'
        ? ' You\'re in peak state! Let\'s make the most of it! '
        : ' Optimal mood and energy levels detected. ';
    }
    
    if (hour < 12) {
      const morningMessages = {
        gentle: completedHabits && completedHabits > 0
          ? `Good morning! ☀️${contextNote}I see you've already completed ${completedHabits} habit${completedHabits > 1 ? 's' : ''} today. That's a beautiful start! What's your main focus for today?`
          : sleepHours && sleepHours < 6
          ? `Good morning! ☀️ I noticed you didn't sleep much last night. How are you feeling? Let's make today gentle.`
          : `Good morning! ☀️${contextNote}How are you feeling as you start your day?`,
        motivational: completedHabits && completedHabits > 0
          ? `Rise and shine! ☀️${contextNote}You've CRUSHED ${completedHabits} habit${completedHabits > 1 ? 's' : ''} already! What's next on your conquest list?`
          : `Good morning, champion! ☀️${contextNote}Today is YOURS. What amazing thing will you accomplish?`,
        analytical: completedHabits && completedHabits > 0
          ? `Morning. ☀️${contextNote}${completedHabits}/${totalHabits} habits completed. Current completion rate: ${Math.round((completedHabits / (totalHabits || 1)) * 100)}%. What's your primary objective today?`
          : `Morning. ☀️${contextNote}What's your key focus area for optimal productivity today?`,
      };

      return {
        message: morningMessages[coachTone],
        quickReplies: energy && energy <= 2 ? [
          { id: 'focus-rest', text: 'Focus on rest', action: 'rest' },
          { id: 'small-win', text: 'Just one small thing', action: 'small-win' },
          { id: 'feeling-low', text: 'Struggling today', action: 'low-energy' },
        ] : [
          { id: 'small-win', text: 'Do a small win', action: 'small-win' },
          { id: 'feeling-good', text: 'Feeling energized', action: 'energized' },
          { id: 'need-guidance', text: 'Need some guidance', action: 'guidance' },
        ]
      };
    } else if (hour < 17) {
      const progressNote = completedHabits && totalHabits 
        ? ` You've completed ${completedHabits}/${totalHabits} habits so far.`
        : '';
      
      const afternoonMessages = {
        gentle: `Hey there! 👋${contextNote}How's your afternoon going?${progressNote}`,
        motivational: `Afternoon check-in! 💪${contextNote}Keep that momentum going!${progressNote}`,
        analytical: `Afternoon status.${contextNote}Progress: ${completedHabits}/${totalHabits} habits.${progressNote}`,
      };

      return {
        message: afternoonMessages[coachTone],
        quickReplies: [
          { id: 'going-well', text: 'Going well!', action: 'well' },
          { id: 'need-break', text: 'Need a break', action: 'break' },
          { id: 'feeling-stuck', text: 'Feeling stuck', action: 'stuck' },
          { id: 'overwhelmed', text: 'A bit overwhelmed', action: 'overwhelmed' },
        ]
      };
    } else {
      const eveningMessages = {
        gentle: completedHabits && completedHabits > 0
          ? `Good evening! 🌙 You completed ${completedHabits}/${totalHabits} habits today. ${completedHabits === totalHabits ? 'Amazing work! 🎉' : 'That\'s progress!'} How do you feel about your day?`
          : `Good evening! 🌙${contextNote}How are you winding down?`,
        motivational: completedHabits && completedHabits > 0
          ? `Evening warrior! 🌙 You CONQUERED ${completedHabits}/${totalHabits} habits! ${completedHabits === totalHabits ? 'PERFECT SCORE! 🎉' : 'Great effort!'} Ready to celebrate?`
          : `Evening! 🌙${contextNote}Time to reflect on your victories!`,
        analytical: completedHabits && completedHabits > 0
          ? `Evening. 🌙 Daily summary: ${completedHabits}/${totalHabits} habits (${Math.round((completedHabits / (totalHabits || 1)) * 100)}%). How would you rate today's productivity?`
          : `Evening. 🌙${contextNote}Daily assessment time.`,
      };

      return {
        message: eveningMessages[coachTone],
        quickReplies: [
          { id: 'proud', text: 'Proud of today', action: 'proud' },
          { id: 'could-be-better', text: 'Could be better', action: 'better' },
          { id: 'exhausted', text: 'Pretty exhausted', action: 'exhausted' },
          { id: 'peaceful', text: 'Feeling peaceful', action: 'peaceful' },
        ]
      };
    }
  };

  const addCoachMessage = (content: string, quickReplies?: QuickReply[]) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'coach',
      content,
      timestamp: new Date(),
      quickReplies,
      tone: coachTone,
    };
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, message]);
    }, 800 + Math.random() * 400);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
  };

  const handleQuickReply = (reply: QuickReply) => {
    addUserMessage(reply.text);
    
    setTimeout(() => {
      const response = getResponseForAction(reply.action || '', reply.text);
      addCoachMessage(response.message, response.quickReplies);
      setConversationStage(prev => prev + 1);
    }, 600);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'reframe') {
      const lastUserMessage = messages.filter(m => m.type === 'user').slice(-1)[0];
      if (lastUserMessage) {
        const reframeResponse = getReframeResponse(lastUserMessage.content);
        addCoachMessage(reframeResponse, []);
      } else {
        addCoachMessage("I'd love to help you reframe your thinking! What's on your mind?", []);
      }
    } else if (action === 'encourage') {
      const encouragement = getEncouragement();
      addCoachMessage(encouragement, []);
    } else if (action === 'simplify') {
      addCoachMessage("Let's simplify. What's the ONE thing that matters most right now?", [
        { id: 'work', text: 'Work task', action: 'work-task' },
        { id: 'self', text: 'Self-care', action: 'self-care' },
        { id: 'rest', text: 'Just rest', action: 'rest' },
      ]);
    }
  };

  const getReframeResponse = (message: string) => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('fail') || messageLower.includes('mess up')) {
      return coachTone === 'gentle'
        ? "Instead of 'I failed,' try: 'I tried something and learned from it.' Every attempt teaches you something valuable. 💜"
        : coachTone === 'motivational'
        ? "STOP! You didn't fail - you found one way that doesn't work! Edison failed 1000 times before the lightbulb. You're on your way to success! 💪"
        : "Reframe: Failure is data. Each attempt provides information that increases probability of future success. Iteration is progress.";
    }
    
    if (messageLower.includes('cant') || messageLower.includes('can\'t') || messageLower.includes('impossible')) {
      return coachTone === 'gentle'
        ? "Let's reframe that: Instead of 'I can't,' try 'I haven't figured out how yet.' The word 'yet' changes everything. 🌱"
        : coachTone === 'motivational'
        ? "REPLACE 'I can't' with 'I'LL FIND A WAY!' You're more capable than you think! 🚀"
        : "Cognitive reframe: 'Can't' is a fixed mindset. Replace with 'current constraints require alternative approach.' Problem-solving mode activated.";
    }
    
    if (messageLower.includes('lazy') || messageLower.includes('procrastinating')) {
      return coachTone === 'gentle'
        ? "You're not lazy - you might be overwhelmed, unclear on where to start, or simply need rest. That's being human, not being lazy. 💙"
        : coachTone === 'motivational'
        ? "You're not lazy - you're STRATEGIC! Your brain is conserving energy. Let's channel that energy into ONE small action NOW! ⚡"
        : "Analysis: 'Laziness' is often unclear goals, decision fatigue, or energy depletion. Identify root cause for targeted intervention.";
    }
    
    return coachTone === 'gentle'
      ? "Let's look at this differently: What if this challenge is here to teach you something important? What might that be? 🤔"
      : coachTone === 'motivational'
      ? "FLIP THE SCRIPT! This isn't a problem - it's your next growth opportunity! What strength will you build from this? 💪"
      : "Alternative perspective: Current challenge = opportunity to develop new capability. What skill would resolve this?";
  };

  const getEncouragement = () => {
    const encouragements = {
      gentle: [
        "You're doing better than you think. Every small step counts, even the ones no one else sees. 💜",
        "I see you trying, and that matters so much. You don't have to be perfect - just present. 🌸",
        "You're exactly where you need to be. Trust the process, and be kind to yourself along the way. ✨",
        "Your efforts matter. Your struggles are valid. And you are worthy of compassion - especially from yourself. 💙",
      ],
      motivational: [
        "YOU'VE GOT THIS! Every champion was once someone who refused to give up. That's YOU! 💪🔥",
        "Small progress is still PROGRESS! You're building momentum every single day! Keep pushing! 🚀",
        "You're STRONGER than your challenges! This is temporary - your resilience is PERMANENT! ⚡",
        "BELIEVE IN YOURSELF! You've overcome 100% of your bad days so far. This one won't break you! 🌟",
      ],
      analytical: [
        "Data shows: Past challenges overcome: 100%. Current challenge probability: solvable. Your track record supports optimism. 📊",
        "Progress analysis: You've demonstrated consistent growth. Current trajectory: positive. Continue current approach. 📈",
        "Performance metrics indicate you're in acceptable range. Consistency over perfection = optimal strategy. ✓",
        "Historical data: You've adapted successfully before. Pattern suggests you'll adapt again. Probability: high. 🎯",
      ],
    };
    
    const toneEncouragements = encouragements[coachTone];
    return toneEncouragements[Math.floor(Math.random() * toneEncouragements.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    const userMessage = inputValue.toLowerCase();
    setInputValue('');
    
    setTimeout(() => {
      const response = getResponseForMessage(userMessage);
      addCoachMessage(response.message, response.quickReplies);
    }, 600);
  };

  const getResponseForMessage = (message: string) => {
    // Tone-aware responses
    const tonePrefix = {
      gentle: '',
      motivational: '',
      analytical: 'Analysis: ',
    };
    
    // Fatigue & exhaustion
    if (message.includes('tired') || message.includes('exhausted') || message.includes('drained')) {
      const responses = {
        gentle: "I hear you. Being tired is your body's way of asking for care. What would feel most restorative right now?",
        motivational: "Your body needs fuel! Even warriors need to recharge. What's one thing that'll give you a boost?",
        analytical: "Fatigue detected. Recommended actions: 1) Rest 2) Hydration 3) Light movement. Select optimal intervention:",
      };
      return {
        message: responses[coachTone],
        quickReplies: [
          { id: 'rest', text: 'Just rest', action: 'rest' },
          { id: 'gentle', text: 'Something gentle', action: 'gentle' },
          { id: 'skip', text: 'Skip today\'s extras', action: 'skip' },
        ]
      };
    }

    // Anxiety & stress
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('stressed') || message.includes('overwhelm')) {
      const responses = {
        gentle: "Anxiety can be so draining. Let's ground you back in the present. Would a breathing exercise help, or do you need to shift your focus?",
        motivational: "Anxiety is just energy! Let's redirect it! We can channel this into action or calm it with breathing. Your call!",
        analytical: "Elevated stress response detected. Options: 1) Breathing protocol 2) Task simplification 3) Verbal processing. Choose:",
      };
      return {
        message: responses[coachTone],
        quickReplies: [
          { id: 'breathe', text: 'Breathing exercise', action: 'breathe' },
          { id: 'talk', text: 'Keep talking', action: 'listen' },
          { id: 'simplify', text: 'Simplify my day', action: 'minimal' },
        ]
      };
    }

    // Focus challenges
    if (message.includes('focus') || message.includes('distract') || message.includes('adhd')) {
      const responses = {
        gentle: "Focus challenges are real, and they're not a personal failing. What would help right now - structure, a timer, or permission to work with your natural rhythm?",
        motivational: "Your brain works differently - that's a SUPERPOWER when you use the right tools! Let's find what clicks for you!",
        analytical: "Attention optimization needed. Recommended: Pomodoro technique, environmental modification, or task breakdown. Select:",
      };
      return {
        message: responses[coachTone],
        quickReplies: [
          { id: 'timer-help', text: 'Use a timer', action: 'focus-timer' },
          { id: 'structure', text: 'Give me structure', action: 'view-timeflow' },
          { id: 'flow', text: 'Work with my flow', action: 'listen' },
        ]
      };
    }

    // Default response
    const defaults = {
      gentle: "I'm here with you. What matters most to you right now?",
      motivational: "Alright! Let's tackle this together! What's your next move?",
      analytical: "Input received. What's your primary objective currently?",
    };

    return {
      message: defaults[coachTone],
      quickReplies: [
        { id: 'rest', text: 'I need rest', action: 'rest' },
        { id: 'progress', text: 'Make progress', action: 'progress' },
        { id: 'reflect', text: 'Just reflect', action: 'listen' },
      ]
    };
  };

  const getResponseForAction = (action: string, userText: string) => {
    // Tone-based response variations
    const responses: Record<string, { message: string; quickReplies?: QuickReply[] }> = {
      'rest': {
        message: coachTone === 'gentle'
          ? "Rest isn't giving up - it's how you recharge. Your only job right now is to be kind to yourself. Everything else can wait."
          : coachTone === 'motivational'
          ? "STRATEGIC REST! Even champions need recovery time. Recharge now so you can DOMINATE tomorrow! 🔋"
          : "Rest protocol initiated. Recovery is essential for sustained performance. Optimize for tomorrow's output.",
        quickReplies: [
          { id: 'skip-today', text: 'Skip today\'s extras', action: 'skip-confirmed' },
          { id: 'gentle-stretch', text: 'Gentle stretching', action: 'stretch' },
          { id: 'done', text: 'That\'s all I needed', action: 'end' },
        ]
      },
      'small-win': {
        message: coachTone === 'gentle'
          ? "Perfect! Small wins build momentum. Here's what I suggest: pick ONE tiny thing you can do in the next 10 minutes. What feels doable?"
          : coachTone === 'motivational'
          ? "YES! Small wins create BIG momentum! Let's get that first victory NOW! What's your target?"
          : "Micro-goal strategy activated. Select one 10-minute task. Completion builds neural pathway for continued progress.",
        quickReplies: [
          { id: 'water', text: 'Drink water', action: 'water' },
          { id: 'tidy', text: 'Tidy one surface', action: 'tidy' },
          { id: 'habit', text: 'Complete a habit', action: 'habit' },
        ]
      },
      'energized': {
        message: coachTone === 'gentle'
          ? "I love that energy! Let's use it wisely. What would make today feel like a win for you?"
          : coachTone === 'motivational'
          ? "THAT'S THE SPIRIT! Your energy is FIRE right now! Let's CHANNEL IT! What are we conquering today?!"
          : "High energy state detected. Optimal time for challenging tasks. What's your highest-value activity?",
        quickReplies: [
          { id: 'focus-task', text: 'Focus on top task', action: 'top-task' },
          { id: 'creative', text: 'Something creative', action: 'creative' },
          { id: 'multiple', text: 'Tackle multiple things', action: 'multiple' },
        ]
      },
      'overwhelmed': {
        message: coachTone === 'gentle'
          ? "Overwhelm means you care, but it doesn't mean you have to do everything right now. Let's simplify. What's the ONE thing that matters most today?"
          : coachTone === 'motivational'
          ? "Stop! Breathe! You're trying to climb 10 mountains at once! Let's pick ONE peak and CRUSH it! Which one?!"
          : "Overwhelm = excessive cognitive load. Solution: Prioritization matrix. Identify single highest-priority item:",
        quickReplies: [
          { id: 'work', text: 'Work task', action: 'work-task' },
          { id: 'self', text: 'Self-care', action: 'self-care' },
          { id: 'unclear', text: 'Not sure', action: 'unclear' },
        ]
      },
      'breathe': {
        message: coachTone === 'gentle'
          ? "Let's ground you. I'll guide you through a simple breathing exercise. Ready?"
          : coachTone === 'motivational'
          ? "BREATHE! Let's reset your nervous system and come back STRONGER! Ready to do this?!"
          : "Initiating parasympathetic nervous system activation protocol. Breathing exercise ready. Proceed?",
        quickReplies: [
          { id: 'start-breathe', text: 'Start breathing', action: 'start-breathe' },
          { id: 'not-now', text: 'Maybe later', action: 'end' },
        ]
      },
      'celebrate': {
        message: coachTone === 'gentle'
          ? "Yes! Look at you taking care of yourself. That's the kind of momentum that matters. What's next?"
          : coachTone === 'motivational'
          ? "BOOM! 🎉 THAT'S how it's done! You just proved you can do it! What's your NEXT win?!"
          : "Task completed. Dopamine release confirmed. Momentum established. Next action item?",
        quickReplies: [
          { id: 'another', text: 'Another small thing', action: 'small-win' },
          { id: 'enough', text: 'That\'s enough', action: 'end' },
          { id: 'habits', text: 'Check my habits', action: 'view-habits' },
        ]
      },
      'end': {
        message: coachTone === 'gentle'
          ? "You're doing great. I'm here whenever you need support. Take care of yourself. 💜"
          : coachTone === 'motivational'
          ? "You're AMAZING! Keep that fire burning! Come back anytime you need a boost! 💪🔥"
          : "Session complete. Progress logged. Available for future consultation. Optimize well.",
        quickReplies: []
      },
    };

    return responses[action] || {
      message: "I'm here for you. What would help most right now?",
      quickReplies: []
    };
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeColors.background }}>

      {/* Header */}
      <div
        // initial={{ opacity: 0, y: -20 }}
        // animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 flow-card"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('coaching')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900 flex items-center gap-2">
                  <Sparkles size={20} style={{ color: themeColors.primary }} />
                  AI Coach
                </h1>
                <p className="text-sm opacity-60">Personal support & guidance</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMessages([]);
                startNewConversation();
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RotateCcw size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Tone Selector */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setCoachTone('gentle')}
              className="flex-1 py-2 px-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: coachTone === 'gentle' ? '#fce7f3' : '#f3f4f6',
                color: coachTone === 'gentle' ? '#ec4899' : '#6b7280',
                border: coachTone === 'gentle' ? '2px solid #ec4899' : 'none',
              }}
            >
              <Heart size={14} />
              Gentle
            </button>
            <button
              onClick={() => setCoachTone('motivational')}
              className="flex-1 py-2 px-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: coachTone === 'motivational' ? '#fef3c7' : '#f3f4f6',
                color: coachTone === 'motivational' ? '#f59e0b' : '#6b7280',
                border: coachTone === 'motivational' ? '2px solid #f59e0b' : 'none',
              }}
            >
              <Zap size={14} />
              Motivational
            </button>
            <button
              onClick={() => setCoachTone('analytical')}
              className="flex-1 py-2 px-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: coachTone === 'analytical' ? '#dbeafe' : '#f3f4f6',
                color: coachTone === 'analytical' ? '#3b82f6' : '#6b7280',
                border: coachTone === 'analytical' ? '2px solid #3b82f6' : 'none',
              }}
            >
              <Brain size={14} />
              Analytical
            </button>
          </div>

          {/* Insight Chips */}
          {insightChips.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {insightChips.map(chip => {
                const Icon = chip.icon;
                return (
                  <motion.div
                    key={chip.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap"
                    style={{
                      backgroundColor: `${chip.color}15`,
                      border: `1px solid ${chip.color}40`,
                    }}
                  >
                    <Icon size={12} style={{ color: chip.color }} />
                    <span style={{ color: chip.color }}>{chip.label}:</span>
                    <span className="opacity-80">{chip.value}</span>
                  </ motion.div>
                );
              })}
            </div>
          )}
        </div>
      </ div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-lavender-100 to-purple-100 text-gray-900'
                    : 'bg-gradient-to-br from-white to-gray-50 text-[var(--color-card-foreground)] shadow-sm border border-[var(--color-ring-offset-background)]'
                }`}
                style={{
                  marginBottom: message.quickReplies && message.quickReplies.length > 0 ? '8px' : '0',
                }}
              >
                <p className="leading-relaxed">{message.content}</p>
                
                {/* Quick Replies */}
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {message.quickReplies.map(reply => (
                      < button
                        key={reply.id}
                        // whileHover={{ scale: 1.05 }}
                        // whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 rounded-2xl text-sm transition-all flow-card"
                      >
                        {reply.text}
                      </ button>
                    ))}
                  </div>
                )}
              </div>
            </ motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl px-5 py-4 shadow-sm border border-[var(--color-ring-offset-background)]">
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-gray-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-gray-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-gray-400"
                />
              </div>
            </div>
          </ motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Bar */}
      <div className="fixed bottom-20 left-0 right-0 z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-3 justify-center">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                < button
                  key={action.id}
                  // whileHover={{ scale: 1.05 }}
                  // whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm flow-card"
                >
                  <Icon size={16} style={{ color: themeColors.primary }} />
                  {action.text}
                </ button>
              );
            })}
          </div>

          {/* Input */}
          <div className="flow-card">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
            < button
              // whileHover={{ scale: 1.05 }}
              // whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 rounded-2xl transition-all disabled:opacity-50"
              style={{
                backgroundColor: inputValue.trim() ? themeColors.primary : '#f3f4f6',
                color: inputValue.trim() ? 'white' : '#9ca3af',
              }}
            >
              <Send size={18} />
            </ button>
          </div>
        </div>
      </div>
    </div>
  );
}
