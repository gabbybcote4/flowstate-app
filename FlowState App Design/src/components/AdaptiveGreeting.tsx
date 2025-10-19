import { useEffect, useState } from 'react';
import { motion } from '../lib/motion-shim';
import { useTheme } from './ThemeContext';
import { Sunrise, Sun, Sunset, Moon, Heart } from 'lucide-react';

interface GreetingData {
  message: string;
  submessage: string;
  icon: any;
  gradient: string[];
}

export function AdaptiveGreeting() {
  const { themeColors } = useTheme();
  const [greeting, setGreeting] = useState<GreetingData | null>(null);

  useEffect(() => {
    updateGreeting();
    // Update every minute to keep time-based greetings fresh
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    const userName = localStorage.getItem('flowstate-username') || 'friend';
    
    // Get today's check-in data for energy-aware messaging
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('flowstate-coaching-data');
    let energy = 3; // default
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const savedDate = localStorage.getItem('flowstate-coaching-date');
        if (savedDate === today) {
          energy = data.energy;
        }
      } catch (e) {
        console.error('Error parsing check-in data');
      }
    }

    let greetingData: GreetingData;

    // Early Morning (5-7 AM)
    if (hour >= 5 && hour < 7) {
      greetingData = {
        message: `Early bird, ${userName} 🌅`,
        submessage: energy <= 2 
          ? "Take it slow. The day will wait for you."
          : "The quiet morning is yours to savor.",
        icon: Sunrise,
        gradient: ['#FEF3C7', '#FCD34D']
      };
    }
    // Morning (7-12 PM)
    else if (hour >= 7 && hour < 12) {
      greetingData = {
        message: `Good morning, ${userName} ☀️`,
        submessage: energy <= 2
          ? "One gentle step at a time today."
          : "Let's make today meaningful, at your pace.",
        icon: Sun,
        gradient: ['#FBBF24', '#F59E0B']
      };
    }
    // Afternoon (12-5 PM)
    else if (hour >= 12 && hour < 17) {
      greetingData = {
        message: `Good afternoon, ${userName} 🌤️`,
        submessage: energy <= 2
          ? "It's okay to rest. Progress isn't always visible."
          : "You're doing great. Keep your rhythm steady.",
        icon: Sun,
        gradient: ['#FDE68A', '#FCD34D']
      };
    }
    // Evening (5-9 PM)
    else if (hour >= 17 && hour < 21) {
      greetingData = {
        message: `Good evening, ${userName} 🌅`,
        submessage: "You did enough today. Time to wind down.",
        icon: Sunset,
        gradient: ['#FBCFE8', '#F9A8D4']
      };
    }
    // Night (9 PM - 5 AM)
    else {
      greetingData = {
        message: `Good night, ${userName} 🌙`,
        submessage: "Rest is productive. Tomorrow is a new beginning.",
        icon: Moon,
        gradient: ['#DDD6FE', '#C4B5FD']
      };
    }

    setGreeting(greetingData);
  };

  if (!greeting) return null;

  const Icon = greeting.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-6 rounded-3xl shadow-lg relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${greeting.gradient[0]}, ${greeting.gradient[1]})`
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Icon size={128} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
            <Icon size={20} />
          </div>
          <h2 className="text-gray-800">{greeting.message}</h2>
        </div>
        <p className="text-gray-700 opacity-80 leading-relaxed">
          {greeting.submessage}
        </p>
        
        {/* Mood indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Heart size={14} className="text-red-500" />
          <span className="opacity-70">Your energy matters more than your output</span>
        </div>
      </div>
    </motion.div>
  );
}
