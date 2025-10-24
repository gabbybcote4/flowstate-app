// src/components/ThemeSelector.tsx
// lets the user choose between the lavender, mint, and peach theme color sets

interface ThemeSelectorProps {
  selected: "Lavender" | "Mint" | "Peach";
  onSelect: (theme: "Lavender" | "Mint" | "Peach") => void;
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  // base theme options with light color references
  const themes = [
    { name: "Lavender" as const, color: "#ddd6fe", ringColor: "#a78bfa" },
    { name: "Mint" as const, color: "#a7f3d0", ringColor: "#34d399" },
    { name: "Peach" as const, color: "#fed7aa", ringColor: "#fb923c" },
  ];

  return (
    <div className="flex gap-3">
      {themes.map((theme) => {
        const isSelected = selected === theme.name;

        return (
          <button
            key={theme.name}
            onClick={() => onSelect(theme.name)}
            className="flex-1 py-3 px-4 rounded-2xl transition-all duration-200 border border-transparent"
            style={{
              backgroundColor: theme.color,
              opacity: isSelected ? 1 : 0.65,
              transform: isSelected ? "scale(1.05)" : "scale(1)",
              boxShadow: isSelected
                ? `0 0 0 2px var(--color-background), 0 0 0 4px ${theme.ringColor}`
                : "none",
            }}
          >
            <span
              className="font-medium"
              style={{
                color: isSelected ? "var(--color-card-foreground)" : "#1f2937",
              }}
            >
              {theme.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
