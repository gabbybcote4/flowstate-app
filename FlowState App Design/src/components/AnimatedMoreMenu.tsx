// src/components/AnimatedMoreMenu.tsx
// expandable “more” menu sheet with adaptive dark/light theme styling

import { ChevronRight, X } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { LucideIcon } from "lucide-react";

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
  onNavigate,
}: AnimatedMoreMenuProps) {
  const { themeColors } = useTheme();

  if (!isOpen) return null;

  const handleItemClick = (itemId: string) => {
    onNavigate(itemId);
    onClose();
  };

  return (
    <>
      {/* translucent backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm transition-all"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        onClick={onClose}
      />

      {/* sliding sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl z-50 transition-all duration-300 border-t"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-ring-offset-background)",
          height: "80vh",
        }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div
            className="w-12 h-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: "var(--color-accent)",
            }}
          />
        </div>

        {/* header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between transition-colors"
          style={{ borderColor: "var(--color-ring-offset-background)" }}
        >
          <div>
            <h2 className="text-[var(--color-card-foreground)] font-semibold">
              All Screens
            </h2>
            <p className="text-sm opacity-70 mt-1">
              Explore all the tools and features available
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-card-foreground)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* scrollable categories */}
        <div
          className="overflow-y-auto px-6 py-4"
          style={{ height: "calc(80vh - 140px)" }}
        >
          <div className="space-y-8 pb-6">
            {categories.map((category) => (
              <div key={category.category}>
                <h3 className="text-xs uppercase tracking-wider opacity-60 mb-3 px-2">
                  {category.category}
                </h3>

                <div className="space-y-2">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden group border"
                        style={{
                          backgroundColor: isActive
                            ? themeColors.primaryLight
                            : "var(--color-card)",
                          borderColor: isActive
                            ? themeColors.primary
                            : "var(--color-ring-offset-background)",
                        }}
                      >
                        {/* icon container */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 transition-colors"
                          style={{
                            backgroundColor: isActive
                              ? themeColors.primary
                              : "var(--color-accent)",
                          }}
                        >
                          <Icon
                            size={22}
                            style={{
                              color: isActive
                                ? "#ffffff"
                                : themeColors.primaryDark,
                            }}
                          />
                        </div>

                        {/* label + description */}
                        <div className="flex-1 text-left relative z-10">
                          <div
                            className="mb-1 font-medium transition-colors"
                            style={{
                              color: isActive
                                ? themeColors.primaryDark
                                : "var(--color-card-foreground)",
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            className="text-xs opacity-70"
                            style={{
                              color: "var(--color-muted-foreground)",
                            }}
                          >
                            {item.description}
                          </div>
                        </div>

                        {/* chevron */}
                        <div className="relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                          <ChevronRight
                            size={20}
                            style={{
                              color: "var(--color-muted-foreground)",
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
