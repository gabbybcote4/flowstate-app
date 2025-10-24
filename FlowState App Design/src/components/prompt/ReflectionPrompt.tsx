import React from 'react';

interface ReflectionPromptProps {
  text: string;
  selected?: boolean;
  onClick?: () => void;
}

export function ReflectionPrompt({ text, selected = false, onClick }: ReflectionPromptProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-4 rounded-2xl transition-all duration-200
        ${selected 
          ? 'bg-lavender-100 border-2 border-lavender-300 shadow-md' 
          : 'bg-[var(--color-card)] border-2 border-[var(--color-ring-offset-background)] hover:border-lavender-200'
        }
      `}
    >
      <span className="text-left block">{text}</span>
    </button>
  );
}
