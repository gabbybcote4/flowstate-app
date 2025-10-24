// src/components/AnimatedBottomNav.tsx
// persistent bottom navigation bar with theme-aware colors

import { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeContext";

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
  onNavigate,
}: AnimatedBottomNavProps) {
  const { themeColors } = useTheme();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t z-40 transition-colors"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-ring-offset-background)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl relative"
              >
                {/* active indicator background */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: themeColors.primaryLight,
                      opacity: 0.2,
                    }}
                  />
                )}

                {/* icon */}
                <div className="relative z-10">
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    style={{
                      color: isActive
                        ? themeColors.primaryDark
                        : "var(--color-muted-foreground)",
                      transition: "color 0.3s ease",
                    }}
                  />
                </div>

                {/* label */}
                <span
                  className="text-xs relative z-10"
                  style={{
                    color: isActive
                      ? themeColors.primaryDark
                      : "var(--color-muted-foreground)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* bottom gradient accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`,
        }}
      />
    </nav>
  );
}
