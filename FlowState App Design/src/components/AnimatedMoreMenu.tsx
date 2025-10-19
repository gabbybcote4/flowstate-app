import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface AnimatedMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  currentScreen: string;
  onNavigate: (screenId: string) => void;
}

export function AnimatedMoreMenu({
  isOpen,
  onClose,
  categories,
  currentScreen,
  onNavigate
}: AnimatedMoreMenuProps) {
  const { themeColors } = useTheme();

  const handleItemClick = (itemId: string) => {
    onNavigate(itemId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
            style={{ height: '80vh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    All Screens
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm opacity-60 mt-1"
                  >
                    Explore all the tools and features available
                  </motion.p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="overflow-y-auto px-6 py-4" 
              style={{ height: 'calc(80vh - 140px)' }}
            >
              <div className="space-y-6 pb-6">
                {categories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.1 + categoryIndex * 0.05,
                      duration: 0.4
                    }}
                  >
                    <h3 className="text-xs uppercase tracking-wider opacity-60 mb-3 px-2">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        const isActive = currentScreen === item.id;

                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden"
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.15 + categoryIndex * 0.05 + itemIndex * 0.03,
                              duration: 0.3
                            }}
                            style={isActive ? {
                              backgroundColor: themeColors.gradientTo,
                            } : {}}
                          >
                            {/* Hover effect */}
                            <motion.div
                              className="absolute inset-0 bg-gray-50"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: isActive ? 0 : 1 }}
                              transition={{ duration: 0.2 }}
                            />

                            {/* Icon container */}
                            <motion.div
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                              style={isActive ? {
                                backgroundColor: themeColors.primary,
                              } : {
                                backgroundColor: '#f3f4f6',
                              }}
                            >
                              <Icon
                                size={22}
                                style={isActive ? { color: 'white' } : { color: themeColors.primary }}
                              />
                            </motion.div>

                            {/* Text content */}
                            <div className="flex-1 text-left relative z-10">
                              <div
                                className="mb-1"
                                style={isActive ? { color: themeColors.primaryDark } : {}}
                              >
                                {item.label}
                              </div>
                              <div className="text-xs opacity-60">
                                {item.description}
                              </div>
                            </div>

                            {/* Arrow */}
                            <motion.div
                              className="relative z-10"
                              animate={{
                                x: isActive ? 0 : -5,
                                opacity: isActive ? 1 : 0.4
                              }}
                              whileHover={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight size={20} />
                            </motion.div>

                            {/* Active indicator pulse */}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0 }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  repeatDelay: 1
                                }}
                                style={{
                                  border: `2px solid ${themeColors.primary}`
                                }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
