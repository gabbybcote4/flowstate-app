import { useState } from 'react';

interface FocusAreaSelectorProps {
  selectedArea: string;
  onSelect: (area: string) => void;
}

const focusAreas = [
  { id: 'self-care', label: 'Self-Care', icon: '🌸', color: '#C9A3DC' },
  { id: 'work', label: 'Work', icon: '💼', color: '#A3C9DC' },
  { id: 'relationships', label: 'Relationships', icon: '💕', color: '#DCADC9' },
  { id: 'growth', label: 'Growth', icon: '🌱', color: '#A3DCC9' },
  { id: 'health', label: 'Health', icon: '❤️', color: '#DCBBA3' },
  { id: 'environment', label: 'Environment', icon: '🏡', color: '#C9DCA3' },
  { id: 'creativity', label: 'Creativity', icon: '🎨', color: '#DCA3BB' },
  { id: 'finances', label: 'Finances', icon: '💰', color: '#A3BBDC' },
];

export function FocusAreaSelector({ selectedArea, onSelect }: FocusAreaSelectorProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 border border-gray-100">
      <h3 className="mb-4 text-gray-700">Today's Focus Area</h3>
      <div className="grid grid-cols-4 gap-3">
        {focusAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => onSelect(area.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 ${
              selectedArea === area.id
                ? 'shadow-md scale-105'
                : 'hover:scale-105 opacity-70'
            }`}
            style={{
              backgroundColor: selectedArea === area.id ? `${area.color}30` : '#f9fafb',
              borderWidth: selectedArea === area.id ? '2px' : '1px',
              borderColor: selectedArea === area.id ? area.color : '#e5e7eb',
            }}
          >
            <span className="text-2xl">{area.icon}</span>
            <span className="text-xs text-center">{area.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { focusAreas };
