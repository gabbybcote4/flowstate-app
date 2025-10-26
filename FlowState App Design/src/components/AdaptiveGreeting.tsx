// src/components/AdaptiveGreeting.tsx
// adaptive greeting component that changes message, icon, and background based on time of day and user energy level
import { useEffect, useState } from 'react';
import { Sunrise, Sun, Sunset, Moon, Heart } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface GreetingData {
  message: string;
  submessage: string;
  icon: any;
  gradient: string[];
}

export function AdaptiveGreeting() {
  const { darkMode: isDarkMode } = useTheme();
  const [greeting, setGreeting] = useState<GreetingData | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateGreeting = () => {
      const hour = new Date().getHours();
      const userName = localStorage.getItem('flowstate-username') || 'friend';
      const today = new Date().toDateString();
      const savedData = localStorage.getItem('flowstate-coaching-data');
      let energy = 3;

      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          const savedDate = localStorage.getItem('flowstate-coaching-date');
          if (savedDate === today) energy = data.energy;
        } catch {
          console.error('Error parsing check-in data');
        }
      }

      let greetingData: GreetingData;
      if (hour >= 5 && hour < 7) {
        // early morning
        greetingData = {
          message: `Early bird, ${userName}`,
          submessage: energy <= 2
            ? 'Take it slow. The day will wait for you.'
            : 'The quiet morning is yours to savor.',
          icon: Sunrise,
          gradient: isDarkMode
            ? ['#382b54', '#231c31'] // softer violet dawn
            : ['#FFF8E7', '#FFE3A3'], // light butter sunrise
        };
      } else if (hour >= 7 && hour < 12) {
        // morning
        greetingData = {
          message: `Good morning, ${userName}`,
          submessage: energy <= 2
            ? 'One gentle step at a time today.'
            : "Let's make today meaningful, at your pace.",
          icon: Sun,
          gradient: isDarkMode
            ? ['#40331e', '#1e1810'] // muted brown-gold
            : ['#FFF1C7', '#FFD891'], // soft golden glow
        };
      } else if (hour >= 12 && hour < 17) {
        // afternoon
        greetingData = {
          message: `Good afternoon, ${userName}`,
          submessage: energy <= 2
            ? "It's okay to rest. Progress isn't always visible."
            : "You're doing great. Keep your rhythm steady.",
          icon: Sun,
          gradient: isDarkMode
            ? ['#3a2f28', '#2a2235'] // neutral taupe blend
            : ['#FFF7D1', '#FFE8A9'], // light warm daylight
        };
      } else if (hour >= 17 && hour < 21) {
        // evening
        greetingData = {
          message: `Good evening, ${userName}`,
          submessage: 'You did enough today. Time to wind down.',
          icon: Sunset,
          gradient: isDarkMode
            ? ['#3b2a54', '#261d3a'] // softened plum twilight
            : ['#FFE5F0', '#FFD6E8'], // pastel pink dusk
        };
      } else {
        // night
        greetingData = {
          message: `Good night, ${userName}`,
          submessage: 'Rest is productive. Tomorrow is a new beginning.',
          icon: Moon,
          gradient: isDarkMode
            ? ['#1e2035', '#2a2760'] // gentle indigo night
            : ['#EEE9FF', '#DAD0FF'], // soft lavender moonlight
        };
      }

      setGreeting(greetingData);
      const now = new Date();
      const nextHour = new Date();
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      timeoutId = setTimeout(updateGreeting, nextHour.getTime() - now.getTime());
    };

    updateGreeting();
    return () => clearTimeout(timeoutId);
  }, [isDarkMode]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (!greeting) return null;
  const Icon = greeting.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl mb-6 shadow-lg transition-all duration-700">
      <div className="flex justify-center text-lg font-bold mb-2">
        {timeString}
      </div>

      {/* sky layer (animated gradient) */}
      <div
        className="absolute inset-0 animate-gradient-move"
        style={{
          background: `linear-gradient(135deg, ${greeting.gradient[0]}, ${greeting.gradient[1]})`,
          filter: 'blur(30px)',
          opacity: isDarkMode ? 0.25 : 0.3,
          transition: 'background 1s ease',
        }}
      />

      {/* greeting content */}
      <div
        className="relative z-10 p-6 rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${greeting.gradient[0]}, ${greeting.gradient[1]})`,
          color: isDarkMode ? '#f4f3ff' : '#1a1300',
          boxShadow: isDarkMode
            ? '0 0 24px -4px rgba(167,139,250,0.25)'
            : '0 0 20px -4px rgba(251,191,36,0.25)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Icon size={128} />
        </div>
        <div className="relative z-10">
          <h2 className="mb-2 font-semibold text-lg">{greeting.message}</h2>
          <p className="opacity-80 leading-relaxed">{greeting.submessage}</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Heart size={14} className={isDarkMode ? 'text-pink-400' : 'text-red-500'} />
            <span className="opacity-70">Your energy matters more than your output</span>
          </div>
        </div>
      </div>
    </div>
  );
}
