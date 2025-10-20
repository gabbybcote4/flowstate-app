import React from 'react';

interface ThemeSelectorProps {
  selected: 'Lavender' | 'Mint' | 'Peach';
  onSelect: (theme: 'Lavender' | 'Mint' | 'Peach') => void;
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  const themes = [
    { name: 'Lavender' as const, color: '#ddd6fe', ringColor: '#a78bfa' },
    { name: 'Mint' as const, color: '#a7f3d0', ringColor: '#34d399' },
    { name: 'Peach' as const, color: '#fed7aa', ringColor: '#fb923c' }
  ];

  return (
    <div className="flex gap-3">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onSelect(theme.name)}
          className="flex-1 py-3 px-4 rounded-2xl transition-all duration-200"
          style={{
            backgroundColor: theme.color,
            opacity: selected === theme.name ? 1 : 0.6,
            transform: selected === theme.name ? 'scale(1.05)' : 'scale(1)',
            boxShadow: selected === theme.name ? `0 0 0 2px white, 0 0 0 4px ${theme.ringColor}` : 'none',
          }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}
