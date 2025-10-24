// AdaptiveGreeting.tsx
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
          if (savedDate === today) {
            energy = data.energy;
          }
        } catch {
          console.error('Error parsing check-in data');
        }
      }

      let greetingData: GreetingData;
      if (hour >= 5 && hour < 7) {
        greetingData = {
          message: `Early bird, ${userName}`,
          submessage: energy <= 2
            ? "Take it slow. The day will wait for you."
            : "The quiet morning is yours to savor.",
          icon: Sunrise,
          gradient: ['#FEF3C7', '#FCD34D']
        };
      } else if (hour >= 7 && hour < 12) {
        greetingData = {
          message: `Good morning, ${userName}`,
          submessage: energy <= 2
            ? "One gentle step at a time today."
            : "Let's make today meaningful, at your pace.",
          icon: Sun,
          gradient: ['#FBBF24', '#F59E0B']
        };
      } else if (hour >= 12 && hour < 17) {
        greetingData = {
          message: `Good afternoon, ${userName}`,
          submessage: energy <= 2
            ? "It's okay to rest. Progress isn't always visible."
            : "You're doing great. Keep your rhythm steady.",
          icon: Sun,
          gradient: ['#FDE68A', '#FCD34D']
        };
      } else if (hour >= 17 && hour < 21) {
        greetingData = {
          message: `Good evening, ${userName}`,
          submessage: "You did enough today. Time to wind down.",
          icon: Sunset,
          gradient: ['#FBCFE8', '#F9A8D4']
        };
      } else {
        greetingData = {
          message: `Good night, ${userName}`,
          submessage: "Rest is productive. Tomorrow is a new beginning.",
          icon: Moon,
          gradient: ['#DDD6FE', '#C4B5FD']
        };
      }

      setGreeting(greetingData);

      // 🔁 Schedule next update exactly at the next hour mark
      const now = new Date();
      const nextHour = new Date();
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const timeUntilNextHour = nextHour.getTime() - now.getTime();

      timeoutId = setTimeout(updateGreeting, timeUntilNextHour);
    };

    updateGreeting();
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (!greeting) return null;

  const Icon = greeting.icon;

  return (
    <div style={{ position: 'relative' }}>
      <div 
        className="mb-6 p-6 rounded-3xl shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${greeting.gradient[0]}, ${greeting.gradient[1]})`
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Icon size={128} />
        </div>
        <div className="relative z-10">
          <h2 className="text-[var(--color-card-foreground)] mb-2">{greeting.message}</h2>
          <p className="text-[var(--color-card-foreground)] opacity-80 leading-relaxed">{greeting.submessage}</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Heart size={14} className="text-red-500" />
            <span className="opacity-70">Your energy matters more than your output</span>
          </div>
        </div>
      </div>
    </div>
  );
}
