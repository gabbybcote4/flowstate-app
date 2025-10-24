// src/components/MoodButton.tsx
// adaptive mood button component — theme + dark mode aware

import { useTheme } from "../components/ThemeContext";

interface MoodButtonProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  color?: string; // optional override
  textColor?: string; // optional override
}

export function MoodButton({
  label,
  selected = false,
  onClick,
  color,
  textColor,
}: MoodButtonProps) {
  const { themeColors, darkMode } = useTheme();

  const baseBackground =
    color ||
    (darkMode
      ? "rgba(30, 41, 59, 0.6)" // dark slate tone
      : themeColors.card);

  const activeGlow = `0 0 20px ${themeColors.primaryLight}55`;

  return (
    <div className="relative w-full flex justify-center">
      <button
        onClick={onClick}
        className={`
          w-48 h-24 rounded-3xl transition-all duration-300 text-center font-medium capitalize
          ${selected ? "scale-105" : "hover:scale-[1.02]"}
          focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]
        `}
        style={{
          background: selected
            ? `linear-gradient(135deg, ${themeColors.primaryLight}, ${themeColors.primaryDark})`
            : baseBackground,
          color:
            textColor ||
            (selected
              ? "#ffffff"
              : darkMode
              ? "#e2e8f0"
              : "var(--color-card-foreground)"),
          boxShadow: selected ? activeGlow : "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <span
          className={`transition-opacity ${
            selected ? "opacity-100" : "opacity-80"
          }`}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
