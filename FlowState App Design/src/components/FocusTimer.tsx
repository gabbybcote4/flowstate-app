// src/components/FocusTimer.tsx
// A Focus Timer component with duration selection, start/pause, reset functionality, and animated progress circle.
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function FocusTimer() {
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);

  const durations = [
    { value: 10, label: '10 min' },
    { value: 25, label: '25 min' },
    { value: 45, label: '45 min' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleDurationChange = (duration: number) => {
    if (!isRunning) {
      setSelectedDuration(duration);
      setTimeLeft(duration * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <div className="flex flex-col items-center">

      {/* duration selector */}
      {!isRunning && (
        < motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8"
        >
          {durations.map((duration) => (
            <button
              key={duration.value}
              onClick={() => handleDurationChange(duration.value)}
              className={`px-6 py-3 rounded-2xl transition-all duration-300 ${
                selectedDuration === duration.value
                  ? 'bg-lavender-400 text-white shadow-lg scale-105'
                  : 'bg-[var(--color-card)] text-lavender-600 shadow-md hover:shadow-lg'
              }`}
            >
              {duration.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* timer display */}
      <div className="relative mb-8">
        <svg className="transform -rotate-90" width="280" height="280">

          {/* background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="#e9d5ff"
            strokeWidth="12"
            fill="none"
          />

          {/* progress circle */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 754' }}
            animate={{ 
              strokeDasharray: `${(progress / 100) * 754} 754`
            }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* time text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={timeLeft}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="text-6xl text-lavender-700 tracking-wider mb-2">
              {formatTime(timeLeft)}
            </div>
            {isRunning && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-sm"
              >
                Stay focused...
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* controls */}
      <div className="flex gap-4">

        {/* play/pause button */}
        < motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender-400 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Pause size={32} fill="white" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Play size={32} fill="white" className="ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* reset button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="w-20 h-20 rounded-full bg-[var(--color-card)] text-lavender-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <RotateCcw size={28} />
        </motion.button>
      </div>

      {/* completion message */}
      {timeLeft === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-green-50 rounded-3xl text-center"
        >
          <p className="text-2xl mb-2">✨ Great focus session!</p>
          <p className="opacity-70">You completed {selectedDuration} minutes</p>
        </motion.div>
      )}
    </div>
  );
}
