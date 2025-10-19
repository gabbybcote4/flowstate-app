import { motion } from 'motion/react';
import { OnboardingStepProps } from '../ConfigOnboardingWizard';
import { useUserConfig } from '../../../config/UserConfigContext';
import { Badge } from '../../ui/badge';
import { Activity, Calendar, Cloud, Music, FileText, Check } from 'lucide-react';

const INTEGRATION_ICONS: Record<string, any> = {
  appleHealth: Activity,
  googleFit: Activity,
  googleCalendar: Calendar,
  outlook: Calendar,
  spotify: Music,
  notion: FileText,
  openweather: Cloud,
};

export function IntegrationsStep({}: OnboardingStepProps) {
  const { config, updateConfig } = useUserConfig();

  const toggleIntegration = (id: string) => {
    const updatedIntegrations = config.integrations.map(int =>
      int.id === id ? { ...int, enabled: !int.enabled } : int
    );
    updateConfig({ integrations: updatedIntegrations });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="opacity-70 mb-2" style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Connect your favorite tools to get a complete picture of your wellbeing. You can set these up later.
        </p>
        <p className="text-sm opacity-50">
          🔒 We'll only request read-only access. OAuth setup happens after onboarding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {config.integrations.map((integration, index) => {
          const Icon = INTEGRATION_ICONS[integration.id] || Activity;
          const isEnabled = integration.enabled;

          return (
            < button
              key={integration.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleIntegration(integration.id)}
              className="rounded-2xl p-4 text-left transition-all"
              style={{
                background: isEnabled
                  ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)'
                  : 'white',
                border: isEnabled
                  ? '2px solid rgba(167, 139, 250, 0.3)'
                  : '2px solid rgba(0, 0, 0, 0.05)',
                transform: isEnabled ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isEnabled
                      ? 'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)'
                      : 'rgba(167, 139, 250, 0.1)',
                  }}
                >
                  <Icon 
                    size={20} 
                    style={{ color: isEnabled ? 'white' : '#A78BFA' }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 style={{ fontSize: '15px', fontWeight: '500' }}>
                      {integration.name}
                    </h4>
                    {isEnabled && (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {integration.scopes.includes('read') ? 'Read-only' : 'Read/Write'}
                    </Badge>
                    {!integration.connected && (
                      <Badge variant="outline" className="text-xs">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </ button>
          );
        })}
      </div>

      <div 
        className="rounded-2xl p-4 text-sm"
        style={{
          background: 'rgba(167, 139, 250, 0.05)',
          border: '1px solid rgba(167, 139, 250, 0.1)',
        }}
      >
        <p className="opacity-70">
          💡 Selected integrations will be available in Settings where you can complete the OAuth connection.
        </p>
      </div>
    </div>
  );
}
