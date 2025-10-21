import React from 'react';
import { DevTag } from '../overlay/DevTag';

interface HealthWidgetProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export function HealthWidget({ icon, label, value, color }: HealthWidgetProps) {
  return (
    <div style={{ position: 'relative' }}>
      <DevTag name="HealthWidget" />
      <div className={`flex-1 p-4 rounded-2xl shadow-sm ${color} relative`}>
        <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">{label.toUpperCase()}</div>
        <div className="flex flex-col gap-2">
          <div className="opacity-70">{icon}</div>
          <div className="opacity-60 text-sm">{label}</div>
          <div>{value}</div>
        </div>
      </div>
    </div>
  );
}
