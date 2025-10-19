import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, Shield, Database } from 'lucide-react';

interface WelcomeScreenProps {
  userName?: string;
  onStartCheckIn: () => void;
}

export function WelcomeScreen({ userName = 'Friend', onStartCheckIn }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-peach-50">
      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave 1 - Bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.15 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '320px' }}
          >
            <motion.path
              fill="#A78BFA"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,170.7C960,160,1056,160,1152,181.3C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* Wave 2 - Mid */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 0.1 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '280px' }}
          >
            <motion.path
              fill="#C084FC"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,202.7C960,192,1056,192,1152,213.3C1248,235,1344,277,1392,298.7L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,202.7C960,192,1056,192,1152,213.3C1248,235,1344,277,1392,298.7L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,261.3C672,267,768,245,864,234.7C960,224,1056,224,1152,245.3C1248,267,1344,309,1392,330.7L1440,352L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,202.7C960,192,1056,192,1152,213.3C1248,235,1344,277,1392,298.7L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </svg>
        </motion.div>

        {/* Wave 3 - Top accent */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 0.08 }}
          transition={{ duration: 2.5, ease: 'easeOut', delay: 0.4 }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: '240px' }}
          >
            <motion.path
              fill="#E9D5FF"
              fillOpacity="1"
              d="M0,288L48,277.3C96,267,192,245,288,250.7C384,256,480,288,576,293.3C672,299,768,277,864,266.7C960,256,1056,256,1152,277.3C1248,299,1344,341,1392,362.7L1440,384L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,288L48,277.3C96,267,192,245,288,250.7C384,256,480,288,576,293.3C672,299,768,277,864,266.7C960,256,1056,256,1152,277.3C1248,299,1344,341,1392,362.7L1440,384L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,261.3C672,267,768,245,864,234.7C960,224,1056,224,1152,245.3C1248,267,1344,309,1392,330.7L1440,352L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,288L48,277.3C96,267,192,245,288,250.7C384,256,480,288,576,293.3C672,299,768,277,864,266.7C960,256,1056,256,1152,277.3C1248,299,1344,341,1392,362.7L1440,384L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* Sparkle Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.5
            }}
            className="mb-8 flex justify-center"
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
                boxShadow: '0 20px 60px rgba(167, 139, 250, 0.3)'
              }}
            >
              <Sparkles className="text-white" size={40} />
            </div>
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-4"
          >
            <h1 
              className="mb-2"
              style={{
                fontSize: '32px',
                fontWeight: '600',
                color: '#6B21A8',
                lineHeight: '1.2'
              }}
            >
              Welcome {userName} 🌿
            </h1>
            <p 
              className="opacity-60"
              style={{
                fontSize: '20px',
                lineHeight: '1.4'
              }}
            >
              You're in Flow.
            </p>
          </motion.div>

          {/* Main Message */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-10 opacity-70"
            style={{
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          >
            Let's begin by understanding how you're feeling today. This helps us adapt everything to your energy.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.1,
              type: "spring",
              stiffness: 200
            }}
            className="mb-12"
          >
            <button
              onClick={onStartCheckIn}
              className="w-full py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '500'
              }}
            >
              Let's Start Your First Check-In
              <Sparkles size={20} />
            </button>
          </motion.div>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(167, 139, 250, 0.1)'
            }}
          >
            <div className="flex items-start gap-3">
              <Shield 
                className="flex-shrink-0 mt-0.5 opacity-40" 
                size={18}
                style={{ color: '#6B21A8' }}
              />
              <p 
                className="text-left opacity-60"
                style={{
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}
              >
                <span style={{ color: '#6B21A8', fontWeight: '500' }}>Your privacy matters:</span> Data is stored locally on your device and syncs only when you choose to. You're always in control.
              </p>
            </div>
          </motion.div>

          {/* Floating particles decoration */}
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ background: '#A78BFA' }}
            />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ background: '#C084FC' }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 left-1/3"
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ background: '#E9D5FF' }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
