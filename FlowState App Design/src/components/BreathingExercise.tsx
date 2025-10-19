import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [cycles, setCycles] = useState(0);

  const phaseConfig = {
    inhale: { duration: 4, text: 'Breathe In', color: 'from-blue-300 to-lavender-300' },
    hold: { duration: 4, text: 'Hold', color: 'from-lavender-300 to-purple-300' },
    exhale: { duration: 6, text: 'Breathe Out', color: 'from-purple-300 to-pink-300' },
    rest: { duration: 2, text: 'Rest', color: 'from-pink-200 to-peach-200' },
  };

  useEffect(() => {
    if (!isActive) return;

    const currentPhase = phaseConfig[phase];
    const timer = setTimeout(() => {
      // Move to next phase
      if (phase === 'inhale') setPhase('hold');
      else if (phase === 'hold') setPhase('exhale');
      else if (phase === 'exhale') setPhase('rest');
      else {
        setPhase('inhale');
        setCycles(prev => prev + 1);
      }
    }, currentPhase.duration * 1000);

    return () => clearTimeout(timer);
  }, [isActive, phase]);

  const handleToggle = () => {
    if (!isActive) {
      setPhase('inhale');
      setCycles(0);
    }
    setIsActive(!isActive);
  };

  const currentConfig = phaseConfig[phase];
  const scale = phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : 0.6;

  return (
    <div className="flex flex-col items-center">
      {/* Cycles Counter */}
      {cycles > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-6 py-3 bg-white rounded-2xl shadow-md"
        >
          <p className="text-lavender-600">
            <span className="text-2xl">{cycles}</span> {cycles === 1 ? 'cycle' : 'cycles'} completed
          </p>
        </motion.div>
      )}

      {/* Breathing Circle */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-12">
        {/* Animated breathing circle */}
        <motion.div
          animate={{
            scale: isActive ? scale : 1,
          }}
          transition={{
            duration: currentConfig.duration,
            ease: 'easeInOut',
          }}
          className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${currentConfig.color} shadow-2xl`}
        >
          {/* Inner glow effect */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-white/30 blur-xl"
          />
        </motion.div>

        {/* Instruction text */}
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute text-center z-10"
            >
              <p className="text-3xl text-lavender-700 mb-2">
                {currentConfig.text}
              </p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm opacity-60"
              >
                {currentConfig.duration}s
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start prompt */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute text-center z-10"
          >
            <p className="text-2xl text-lavender-600 mb-2">Ready to breathe?</p>
            <p className="text-sm opacity-60">Box breathing • 4-4-6-2</p>
          </motion.div>
        )}

        {/* Pulse rings */}
        {isActive && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                  scale: [1, 2, 2.5],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: 'easeOut',
                }}
                className={`absolute w-48 h-48 rounded-full border-2 border-lavender-300`}
              />
            ))}
          </>
        )}
      </div>

      {/* Control Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender-400 to-purple-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="pause"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <Pause size={36} fill="white" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <Play size={36} fill="white" className="ml-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Guidance text */}
      {!isActive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="mt-8 text-center max-w-xs"
        >
          Box breathing helps reduce stress and improve focus. Follow the circle as it expands and contracts.
        </motion.p>
      )}
    </div>
  );
}
