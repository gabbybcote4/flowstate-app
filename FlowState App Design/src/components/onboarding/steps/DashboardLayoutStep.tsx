// src/components/onboarding/steps/DashboardLayoutStep.tsx
import { OnboardingStepProps } from "../ConfigOnboardingWizard";
import { useUserConfig } from "../../../config/UserConfigContext";
import { DashboardTemplate, DashboardWidget } from "../../../config/userConfig.types";
import { LayoutGrid, Heart, Zap, Target, Check } from "lucide-react";

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
    description: "Energy tracking, mood, and self-care first",
    widgets: [
      { id: "mood", type: "Mood Check-In", size: "M", position: 0 },
      { id: "momentum", type: "Daily Momentum", size: "S", position: 1 },
      { id: "health", type: "Health Stats", size: "M", position: 2 },
      { id: "reflection", type: "Quick Reflection", size: "L", position: 3 },
    ],
  },
  {
    value: "planner",
    label: "Planner Mode",
    icon: Target,
    description: "Tasks, calendar, and productivity tools",
    widgets: [
      { id: "todos", type: "To-Do List", size: "L", position: 0 },
      { id: "calendar", type: "Calendar Events", size: "M", position: 1 },
      { id: "focus", type: "Focus Timer", size: "S", position: 2 },
      { id: "weekly", type: "Weekly Summary", size: "M", position: 3 },
    ],
  },
  {
    value: "hybrid",
    label: "Balanced Hybrid",
    icon: Zap,
    description: "Mix of wellness and productivity",
    widgets: [
      { id: "mood", type: "Mood Check-In", size: "S", position: 0 },
      { id: "todos", type: "To-Do List", size: "M", position: 1 },
      { id: "momentum", type: "Daily Momentum", size: "S", position: 2 },
      { id: "habits", type: "Habits", size: "M", position: 3 },
    ],
  },
  {
    value: "custom",
    label: "Custom Layout",
    icon: LayoutGrid,
    description: "Build your own from scratch",
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
      <p className="opacity-70 mb-6 text-[16px] leading-relaxed">
        Choose a dashboard template or create your own. You can customize this later.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          const isSelected = config.dashboardTemplate === template.value;

          return (
            <button
              key={template.value}
              onClick={() => selectTemplate(template.value, template.widgets)}
              className="rounded-3xl overflow-hidden text-left border transition-none"
              style={{
                borderColor: isSelected ? "#A78BFA" : "rgba(0,0,0,0.1)",
                backgroundColor: "white",
                boxShadow: isSelected
                  ? "0 0 0 2px #A78BFA inset"
                  : "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon size={22} style={{ color: "#A78BFA" }} />
                    <h4 className="text-[16px] font-semibold">{template.label}</h4>
                  </div>
                  <p className="text-sm opacity-60">{template.description}</p>
                </div>
                {isSelected && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white">
                    <Check size={16} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
