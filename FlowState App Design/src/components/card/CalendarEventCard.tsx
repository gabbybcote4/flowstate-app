//import React from 'react';

interface CalendarEventCardProps {
  time: string;
  title: string;
  type: 'event' | 'todo';
  color?: string;
}

export function CalendarEventCard({ time, title, type, color = 'bg-lavender-50' }: CalendarEventCardProps) {
  return (
    <div style={{ position: 'relative' }}>
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">
        CALENDAR EVENT CARD
      </div>
      <div className="flex items-start gap-4 mb-3">
        <div className="text-sm opacity-60 w-16 pt-1">{time}</div>
        <div className={`flex-1 p-3 rounded-xl ${color} border border-opacity-20`}>
          <div className="text-sm opacity-50 mb-1">{type === 'event' ? '📅 Event' : '✓ To-Do'}</div>
          <div>{title}</div>
        </div>
      </div>
    </div>
  );
}
