// src/components/onboarding/steps/DashboardLayoutStep.tsx
import React from "react";
import { OnboardingStepProps } from "../ConfigOnboardingWizard";
import { useUserConfig } from "../../../config/UserConfigContext";
import { DashboardTemplate, DashboardWidget } from "../../../config/userConfig.types";
import { LayoutGrid, Heart, Zap, Target, Check, ListTodo, Calendar, Activity, Brain, ClipboardList } from "lucide-react";

const TEMPLATES: Array<{
  value: DashboardTemplate;
  label: string;
  icon: any;
  description: string;
  widgets: DashboardWidget[];
}> = [
  {
    value: "wellness",
    label: "Wellness Focus",
    icon: Heart,
    description: "Energy tracking, mood, and self-care first.",
    widgets: [
      { id: "mood", type: "Mood Check-In", size: "medium", position: 0 },
      { id: "momentum", type: "Daily Momentum", size: "small", position: 1 },
      { id: "health", type: "Health Stats", size: "medium", position: 2 },
      { id: "reflection", type: "Quick Reflection", size: "large", position: 3 },
    ],
  },
  {
    value: "planner",
    label: "Planner Mode",
    icon: Target,
    description: "Tasks, calendar, and productivity tools.",
    widgets: [
      { id: "todos", type: "To-Do List", size: "large", position: 0 },
      { id: "calendar", type: "Calendar Events", size: "medium", position: 1 },
      { id: "focus", type: "Focus Timer", size: "small", position: 2 },
      { id: "weekly", type: "Weekly Summary", size: "medium", position: 3 },
    ],
  },
  {
    value: "hybrid",
    label: "Balanced Hybrid",
    icon: Zap,
    description: "A mix of wellness and productivity tools.",
    widgets: [
      { id: "mood", type: "Mood Check-In", size: "small", position: 0 },
      { id: "todos", type: "To-Do List", size: "medium", position: 1 },
      { id: "momentum", type: "Daily Momentum", size: "small", position: 2 },
      { id: "habits", type: "Habits", size: "medium", position: 3 },
    ],
  },
  {
    value: "custom",
    label: "Custom Layout",
    icon: LayoutGrid,
    description: "Build your own dashboard from scratch.",
    widgets: [],
  },
];

export function DashboardLayoutStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const selectTemplate = (template: DashboardTemplate, widgets: DashboardWidget[]) => {
    updateConfig({
      dashboardTemplate: template,
      dashboardLayout: widgets,
    });
  };

  return (
    <div className="space-y-6">
      <p className="opacity-70 mb-6 text-[15px] leading-relaxed text-[var(--color-card-foreground)]">
        Choose a dashboard template or create your own. You can always customize widgets later.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          const isSelected = config.dashboardTemplate === template.value;

          return (
            <button
              key={template.value}
              onClick={() => selectTemplate(template.value, template.widgets)}
              className={`rounded-2xl text-left border transition-all duration-200 p-4 hover:shadow-md ${
                isSelected
                  ? "border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary-light)]/10 to-[var(--color-primary)]/5"
                  : "border-[var(--color-ring-offset-background)] bg-[var(--color-card)]"
              }`}
            >
              {/* header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon
                    size={22}
                    className={`${
                      isSelected
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-primary-light)]"
                    }`}
                  />
                  <div>
                    <h4 className="text-[16px] font-semibold text-[var(--color-card-foreground)]">
                      {template.label}
                    </h4>
                    <p className="text-sm opacity-70">{template.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-primary)] text-white shadow-sm">
                    <Check size={16} />
                  </div>
                )}
              </div>

              {/* widget preview */}
              {template.widgets.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`text-xs px-3 py-1.5 rounded-full border ${
                        isSelected
                          ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-[var(--color-ring-offset-background)] text-[var(--color-muted-foreground)] bg-[var(--color-primary-light)]/5"
                      }`}
                    >
                      {widget.type}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm opacity-60 italic">
                  Add widgets after setup to build your perfect layout.
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
