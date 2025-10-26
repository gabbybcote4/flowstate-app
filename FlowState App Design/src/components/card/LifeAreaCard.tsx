// src/components/card/LifeAreaCard.tsx
// card component to display life area progress and suggestions (2-column grid-ready)
import React from "react";
import { ChevronRight } from "lucide-react";

interface LifeAreaCardProps {
  icon: string;
  title: string;
  progress: number;
  currentHabits: string[];
  suggestion: string;
  color: string;
  onClick?: () => void;
}

export function LifeAreaCard({
  icon,
  title,
  progress,
  currentHabits,
  suggestion,
  color,
  onClick,
}: LifeAreaCardProps) {
  return (
    <div
      className="flow-card cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex">
          <div className="text-md">{icon}</div>
          <div>
            <h3 className="text-md text-[var(--color-card-foreground)] leading-snug">
              {title}
            </h3>
            <div className="text-xs opacity-60 mt-0.5">
              {progress}% this week
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="opacity-60" />
      </div>

      {/* progress bar */}
      <div className="mb-3">
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: `${color}25` }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* current habits */}
      <div className="mb-2">
        <div className="text-sm opacity-50 mb-1 text-left">Active habits:</div>

        {currentHabits.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {currentHabits.map((habit, index) => (
              <div
                key={index}
                className="text-xs px-2.5 py-1 rounded-full border font-medium"
                style={{
                  borderColor: `${color}40`,
                  color: color,
                  backgroundColor: `${color}10`,
                }}
              >
                {habit}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-xs italic opacity-60 px-2 py-1 rounded-md"
            style={{
              backgroundColor: `${color}08`,
            }}
          >
            No active habits yet — tap to add one
          </div>
        )}
      </div>

      {/* gentle suggestion */}
      <div
        className="mt-auto w-[calc(100%+2rem)] -mx-4 text-xs opacity-40 italic"
        style={{
          textAlign: "left",
        }}
      >
        {suggestion}
      </div>
    </div>
  );
}
