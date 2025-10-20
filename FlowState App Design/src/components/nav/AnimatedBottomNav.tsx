//import { motion } from '../lib/motion-shim';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
    <nav 

      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40"
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item, ) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              < button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl relative"
                //whileTap={{ scale: 0.92 }}
              >
                {/* Active indicator */}
                {isActive && (
                  < div
                    //layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: themeColors.gradientTo }}
                  />
                )}
                
                {/* Icon */}
                < div
                  className="relative z-10"
                >
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{ 
                      color: isActive ? themeColors.primaryDark : '#9ca3af',
                      transition: 'color 0.3s ease'
                    }}
                  />
                </ div>
                
                {/* Label */}
                <span 
                  className="text-xs relative z-10"
                  style={{ 
                    color: isActive ? themeColors.primaryDark : '#9ca3af',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.label}
                </span>

                {/* Ripple effect on tap */}
                {isActive && (
                  < div
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      backgroundColor: themeColors.primary,
                    }}
                  />
                )}
              </ button>
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
    </nav>
  );
}
