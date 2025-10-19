import React from 'react';

interface HealthWidgetProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export function HealthWidget({ icon, label, value, color }: HealthWidgetProps) {
  return (
    <div className={`flex-1 p-4 rounded-2xl shadow-sm ${color}`}>
      <div className="flex flex-col gap-2">
        <div className="opacity-70">{icon}</div>
        <div className="opacity-60 text-sm">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
