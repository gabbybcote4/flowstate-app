import React from 'react';

interface MoodButtonProps {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

export function MoodButton({ label, color, selected = false, onClick }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-48 h-24 rounded-3xl transition-all duration-300 text-center
        ${selected ? 'scale-105 shadow-lg' : 'shadow-md hover:scale-102'}
        ${color}
      `}
    >
      <span className={`${selected ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    </button>
  );
}
