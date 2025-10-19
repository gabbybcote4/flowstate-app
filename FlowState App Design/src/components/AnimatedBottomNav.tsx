import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AnimatedBottomNavProps {
  navItems: NavItem[];
  currentScreen: string;
  onNavigate: (screenId: string) => void;
}

export function AnimatedBottomNav({ 
  navItems, 
  currentScreen, 
  onNavigate 
}: AnimatedBottomNavProps) {
  const { themeColors } = useTheme();

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.5,
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl relative"
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: themeColors.gradientTo }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
                
                {/* Icon */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ 
                      color: isActive ? themeColors.primaryDark : '#9ca3af',
                      transition: 'color 0.3s ease'
                    }}
                  />
                </motion.div>
                
                {/* Label */}
                <motion.span 
                  className="text-xs relative z-10"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    fontWeight: isActive ? 600 : 400
                  }}
                  style={{ 
                    color: isActive ? themeColors.primaryDark : '#9ca3af',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.label}
                </motion.span>

                {/* Ripple effect on tap */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ 
                      backgroundColor: themeColors.primary,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Subtle shadow gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`
        }}
      />
    </motion.nav>
  );
}
