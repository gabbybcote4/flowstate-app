import React from 'react';
import { Checkbox } from '../ui/checkbox';

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
  lifeAreaEmoji 
}: TodoCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <Checkbox checked={completed} onCheckedChange={onToggle} className="border-lavender-300" />
      <div className="flex items-center gap-2 flex-1">
        {icon && <span className="text-lavender-400">{icon}</span>}
        <span className={completed ? 'opacity-50 line-through' : ''}>{title}</span>
      </div>
      {lifeArea && lifeAreaEmoji && (
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
          <span className="text-sm">{lifeAreaEmoji}</span>
          <span className="text-xs opacity-60">{lifeArea}</span>
        </div>
      )}
    </div>
  );
}
