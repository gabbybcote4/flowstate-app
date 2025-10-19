import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { DashboardTemplate, DashboardWidget } from '../../../config/userConfig.types';
import { LayoutGrid, Heart, Zap, Target } from 'lucide-react';

const TEMPLATES: Array<{
  value: DashboardTemplate;
  label: string;
  icon: any;
  description: string;
  widgets: DashboardWidget[];
}> = [
  {
    value: 'wellness',
    label: 'Wellness Focus',
    icon: Heart,
    description: 'Energy tracking, mood, and self-care first',
    widgets: [
      { id: 'mood', type: 'Mood Check-In', size: 'M', position: 0 },
      { id: 'momentum', type: 'Daily Momentum', size: 'S', position: 1 },
      { id: 'health', type: 'Health Stats', size: 'M', position: 2 },
      { id: 'reflection', type: 'Quick Reflection', size: 'L', position: 3 },
    ],
  },
  {
    value: 'planner',
    label: 'Planner Mode',
    icon: Target,
    description: 'Tasks, calendar, and productivity tools',
    widgets: [
      { id: 'todos', type: 'To-Do List', size: 'L', position: 0 },
      { id: 'calendar', type: 'Calendar Events', size: 'M', position: 1 },
      { id: 'focus', type: 'Focus Timer', size: 'S', position: 2 },
      { id: 'weekly', type: 'Weekly Summary', size: 'M', position: 3 },
    ],
  },
  {
    value: 'hybrid',
    label: 'Balanced Hybrid',
    icon: Zap,
    description: 'Mix of wellness and productivity',
    widgets: [
      { id: 'mood', type: 'Mood Check-In', size: 'S', position: 0 },
      { id: 'todos', type: 'To-Do List', size: 'M', position: 1 },
      { id: 'momentum', type: 'Daily Momentum', size: 'S', position: 2 },
      { id: 'habits', type: 'Habits', size: 'M', position: 3 },
    ],
  },
  {
    value: 'custom',
    label: 'Custom Layout',
    icon: LayoutGrid,
    description: 'Build your own from scratch',
    widgets: [],
  },
];

export function DashboardLayoutStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const selectTemplate = (template: DashboardTemplate, widgets: DashboardWidget[]) => {
    updateConfig({ 
      dashboardTemplate: template,
      dashboardLayout: widgets 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Choose a dashboard template or create your own. You can customize this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template, index) => {
          const Icon = template.icon;
          const isSelected = config.dashboardTemplate === template.value;

          return (
            < button
              key={template.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => selectTemplate(template.value, template.widgets)}
              className="rounded-3xl overflow-hidden text-left transition-all"
              style={{
                border: isSelected
                  ? '3px solid #A78BFA'
                  : '2px solid rgba(0, 0, 0, 0.1)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected
                  ? '0 10px 40px rgba(167, 139, 250, 0.3)'
                  : '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Preview Area */}
              <div 
                className="h-40 p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
                }}
              >
                <div className="grid grid-cols-2 gap-2 h-full">
                  {template.widgets.slice(0, 4).map((widget, i) => (
                    <div
                      key={i}
                      className="rounded-xl"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                          : 'rgba(255, 255, 255, 0.8)',
                        gridColumn: widget.size === 'L' ? 'span 2' : 'span 1',
                        opacity: isSelected ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={24} style={{ color: '#A78BFA' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '600' }}>
                    {template.label}
                  </h4>
                </div>
                <p className="text-sm opacity-60">{template.description}</p>
              </div>
            </ button>
          );
        })}
      </div>
    </div>
  );
}
