import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function TimeOfDayIndicator() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours();
  const minute = time.getMinutes();
  const timeString = time.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Calculate position of sun/moon (0-100%)
  const dayProgress = ((hour * 60 + minute) / (24 * 60)) * 100;

  // Determine if it's day or night
  const isDay = hour >= 6 && hour < 20;

  return (
    <div className="mb-4 relative h-12 bg-white/40 rounded-2xl overflow-hidden">
      {/* Time indicator track */}
      <div className="absolute inset-0 flex items-center px-4">
        <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
          {/* Progress indicator */}
          < div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${dayProgress}%`,
              background: isDay 
                ? 'linear-gradient(90deg, #FCD34D, #F59E0B)'
                : 'linear-gradient(90deg, #8B5CF6, #6366F1)'
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Moving sun/moon icon */}
          < div
            className="absolute top-1/2 -translate-y-1/2 -ml-4"
            style={{ left: `${dayProgress}%` }}
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-lg">
              {isDay ? '☀️' : '🌙'}
            </div>
          </ div>
        </div>
      </div>

      {/* Time display */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium opacity-70">
        {timeString}
      </div>
    </div>
  );
}
