//import React from 'react';

interface MoodButtonProps {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

export function MoodButton({ label, color, selected = false, onClick }: MoodButtonProps) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">
        MOOD BUTTON
      </div>
      <button
        onClick={onClick}
        className={`
          w-48 h-24 rounded-3xl transition-all duration-300 text-center relative
          ${selected ? 'scale-105 shadow-lg' : 'shadow-md hover:scale-102'}
          ${color}
        `}
      >
        <span className={`${selected ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
      </button>
    </div>
  );
}
