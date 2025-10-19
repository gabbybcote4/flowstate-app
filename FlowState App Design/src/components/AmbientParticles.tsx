import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function AmbientParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleType, setParticleType] = useState<'stars' | 'sparkles' | 'none'>('none');

  useEffect(() => {
    updateParticleType();
    const interval = setInterval(updateParticleType, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const updateParticleType = () => {
    const hour = new Date().getHours();
    
    // Evening/Night - show stars
    if (hour >= 19 || hour < 6) {
      setParticleType('stars');
      generateParticles(8); // Fewer particles for stars
    }
    // Morning - show sparkles
    else if (hour >= 6 && hour < 12) {
      setParticleType('sparkles');
      generateParticles(12); // More particles for sparkles
    }
    // Day - no particles
    else {
      setParticleType('none');
      setParticles([]);
    }
  };

  const generateParticles = (count: number) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  };

  if (particleType === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particleType === 'stars' 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(251, 207, 232, 0.8)',
            boxShadow: particleType === 'stars'
              ? '0 0 8px rgba(255, 255, 255, 0.8)'
              : '0 0 12px rgba(251, 207, 232, 0.9)'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Additional floating elements based on time */}
      {particleType === 'sparkles' && (
        <>
          {/* Morning light rays */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: '-10%',
                width: '2px',
                height: '30%',
                background: 'linear-gradient(180deg, rgba(252, 211, 77, 0.3), transparent)',
                transformOrigin: 'top center'
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scaleY: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
