//  from '../lib/motion-shim';
import { ChevronRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
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

  if (!isOpen) return null;

  const handleItemClick = (itemId: string) => {
    onNavigate(itemId);
    onClose();
  };

  return (
        <>
          {/* Backdrop */}
          < div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          < div
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
                  <h2
                  >
                    All Screens
                  </h2>
                  <p
                    className="text-sm opacity-60 mt-1"
                  >
                    Explore all the tools and features available
                  </p>
                </div>
                < button
                  //whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </ button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="overflow-y-auto px-6 py-4" 
              style={{ height: 'calc(80vh - 140px)' }}
            >
              <div className="space-y-6 pb-6">
                {categories.map((category, ) => (
                  < div
                    key={category.category}

                  >
                    <h3 className="text-xs uppercase tracking-wider opacity-60 mb-3 px-2">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, ) => {
                        const Icon = item.icon;
                        const isActive = currentScreen === item.id;

                        return (
                          < button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden"
                            //whileTap={{ scale: 0.98 }}

                            style={isActive ? {
                              backgroundColor: themeColors.gradientTo,
                            } : {}}
                          >
                            {/* Hover effect */}
                            < div
                              className="absolute inset-0 bg-gray-50"
                            />

                            {/* Icon container */}
                            < div
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                              //whileHover={{ scale: 1.05 }}
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
                            </ div>

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
                            < div
                              className="relative z-10"
                              //whileHover={{ x: 0, opacity: 1 }}
                            >
                              <ChevronRight size={20} />
                            </ div>

                            {/* Active indicator pulse */}
                            {isActive && (
                              < div
                                className="absolute inset-0 rounded-2xl"

                                style={{
                                  border: `2px solid ${themeColors.primary}`
                                }}
                              />
                            )}
                          </ button>
                        );
                      })}
                    </div>
                  </ div>
                ))}
              </div>
            </div>
          </ div>
        </>
      
  );
}
