// src/components/greeting/AdaptiveGreeting.tsx
import { useEffect, useState } from 'react';
import { Sunrise, Sun, Sunset, Moon, Heart } from 'lucide-react';

interface GreetingData {
  message: string;
  submessage: string;
  icon: any;
  gradient: string[];
}

export function AdaptiveGreeting() {
  const [greeting, setGreeting] = useState<GreetingData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // detect dark mode dynamically
  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(match.matches);
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    match.addEventListener('change', listener);
    return () => match.removeEventListener('change', listener);
  }, []);

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
        greetingData = {
          message: `Early bird, ${userName}`,
          submessage:
            energy <= 2
              ? 'Take it slow. The day will wait for you.'
              : 'The quiet morning is yours to savor.',
          icon: Sunrise,
          gradient: isDarkMode
            ? ['#2a2139', '#1f1b2d']
            : ['#FEF3C7', '#FCD34D'],
        };
      } else if (hour >= 7 && hour < 12) {
        greetingData = {
          message: `Good morning, ${userName}`,
          submessage:
            energy <= 2
              ? 'One gentle step at a time today.'
              : "Let's make today meaningful, at your pace.",
          icon: Sun,
          gradient: isDarkMode
            ? ['#3b2f1c', '#1e1610']
            : ['#FBBF24', '#F59E0B'],
        };
      } else if (hour >= 12 && hour < 17) {
        greetingData = {
          message: `Good afternoon, ${userName}`,
          submessage:
            energy <= 2
              ? "It's okay to rest. Progress isn't always visible."
              : "You're doing great. Keep your rhythm steady.",
          icon: Sun,
          gradient: isDarkMode
            ? ['#3a2c1e', '#2a2134']
            : ['#FDE68A', '#FCD34D'],
        };
      } else if (hour >= 17 && hour < 21) {
        greetingData = {
          message: `Good evening, ${userName}`,
          submessage: 'You did enough today. Time to wind down.',
          icon: Sunset,
          gradient: isDarkMode
            ? ['#3b245a', '#2a1e40']
            : ['#FBCFE8', '#F9A8D4'],
        };
      } else {
        greetingData = {
          message: `Good night, ${userName}`,
          submessage: 'Rest is productive. Tomorrow is a new beginning.',
          icon: Moon,
          gradient: isDarkMode
            ? ['#1a1b28', '#2b2550']
            : ['#DDD6FE', '#C4B5FD'],
        };
      }

      setGreeting(greetingData);

      // schedule next update
      const now = new Date();
      const nextHour = new Date();
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const timeUntilNextHour = nextHour.getTime() - now.getTime();
      timeoutId = setTimeout(updateGreeting, timeUntilNextHour);
    };

    updateGreeting();
    return () => clearTimeout(timeoutId);
  }, [isDarkMode]);

  if (!greeting) return null;
  const Icon = greeting.icon;

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="mb-6 p-6 rounded-3xl shadow-lg relative overflow-hidden transition-all duration-500"
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
            <Heart
              size={14}
              className={isDarkMode ? 'text-pink-400' : 'text-red-500'}
            />
            <span className="opacity-70">
              Your energy matters more than your output
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
