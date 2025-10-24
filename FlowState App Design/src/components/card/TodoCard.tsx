// src/components/card/TodoCard.tsx
// to-do card component with adaptive theme support and dark mode

import React from "react";
import { Checkbox } from "../ui/checkbox";
import { useTheme } from "../ThemeContext";

interface TodoCardProps {
  title: string;
  icon?: React.ReactNode;
  completed?: boolean;
  onToggle?: () => void;
  lifeArea?: string;
  lifeAreaEmoji?: string;
}

export function TodoCard({
  title,
  icon,
  completed = false,
  onToggle,
  lifeArea,
  lifeAreaEmoji,
}: TodoCardProps) {
  const { themeColors } = useTheme();

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border shadow-sm hover:shadow-md"
        style={{
          backgroundColor: themeColors.card,
          borderColor: themeColors.accentLight,
          color: themeColors.cardForeground,
          boxShadow: completed
            ? `inset 0 0 0 1px ${themeColors.primary}55`
            : `0 2px 6px ${themeColors.shadow || "#00000022"}`,
          opacity: completed ? 0.7 : 1,
        }}
      >
        <Checkbox checked={completed} onCheckedChange={onToggle} />

        <div className="flex items-center gap-2 flex-1">
          {icon && <span className="opacity-80">{icon}</span>}
          <span
            className={`transition-all ${
              completed ? "line-through opacity-70" : ""
            }`}
          >
            {title}
          </span>
        </div>

        {lifeArea && lifeAreaEmoji && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: `${themeColors.accentLight}22`,
              color: themeColors.cardForeground,
              border: `1px solid ${themeColors.accentLight}44`,
            }}
          >
            <span>{lifeAreaEmoji}</span>
            <span className="opacity-70">{lifeArea}</span>
          </div>
        )}
      </div>
    </div>
  );
}
