import { motion } from 'motion/react';
import { useUserConfig } from '../../config/UserConfigContext';
import { FEATURE_REGISTRY } from '../../config/featureRegistry';
import { Smartphone } from 'lucide-react';

export function LivePreviewPanel() {
  const { config } = useUserConfig();

  // Get enabled navigation items
  const navItems = config.navOrder
    .filter(key => config.enabledFeatures[key])
    .map(key => ({
      key,
      label: FEATURE_REGISTRY[key]?.label || key,
      icon: FEATURE_REGISTRY[key]?.icon,
    }))
    .slice(0, 5); // Show max 5 nav items

  // Get enabled widgets for preview
  const enabledWidgets = Object.entries(config.widgets)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      < div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Phone Mock Header */}
        <div className="mb-4 flex items-center justify-center gap-2 opacity-60">
          <Smartphone size={20} />
          <span className="text-sm">Live Preview</span>
        </div>

        {/* Phone Frame */}
        <div 
          className="relative rounded-[48px] p-3 shadow-2xl"
          style={{
            width: '320px',
            height: '640px',
            background: config.theme.mode === 'dark' 
              ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
            border: '8px solid #1F2937',
          }}
        >
          {/* Notch */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-3xl"
            style={{ backgroundColor: '#1F2937' }}
          />

          {/* Screen Content */}
          <div 
            className="relative h-full rounded-[40px] overflow-hidden"
            style={{
              background: config.theme.mode === 'dark' ? '#111827' : '#FFFFFF',
            }}
          >
            {/* Status Bar */}
            <div className="h-12 flex items-center justify-between px-6">
              <span className="text-xs opacity-60">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 rounded-sm bg-current opacity-60" />
                <div className="w-1 h-3 rounded-sm bg-current opacity-60" />
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="px-4 pb-20">
              {/* Greeting */}
              < div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <p 
                  className="opacity-60"
                  style={{ fontSize: '14px' }}
                >
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
                </p>
                <h1 
                  style={{ 
                    fontSize: '24px',
                    fontWeight: '600',
                    color: config.theme.primaryColor 
                  }}
                >
                  Your Flow
                </h1>
              </ div>

              {/* Widgets Grid */}
              <div className="space-y-3">
                {config.dashboardLayout.length > 0 ? (
                  config.dashboardLayout
                    .sort((a, b) => a.position - b.position)
                    .slice(0, 4)
                    .map((widget, index) => (
                      < div
                        key={widget.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-2xl p-3"
                        style={{
                          background: config.theme.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(167, 139, 250, 0.05)',
                          height: widget.size === 'L' ? '120px' : widget.size === 'M' ? '80px' : '60px',
                        }}
                      >
                        <div className="flex items-center gap-2 opacity-60">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: config.theme.primaryColor }}
                          />
                          <span style={{ fontSize: '11px' }}>
                            {widget.type}
                          </span>
                        </div>
                      </ div>
                    ))
                ) : enabledWidgets.length > 0 ? (
                  enabledWidgets.slice(0, 4).map((widget, index) => (
                    < div
                      key={widget}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-2xl p-3"
                      style={{
                        background: config.theme.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(167, 139, 250, 0.05)',
                        height: '80px',
                      }}
                    >
                      <div className="flex items-center gap-2 opacity-60">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config.theme.primaryColor }}
                        />
                        <span style={{ fontSize: '11px' }}>
                          {widget}
                        </span>
                      </div>
                    </ div>
                  ))
                ) : (
                  <div className="text-center py-12 opacity-30">
                    <p style={{ fontSize: '12px' }}>
                      Configure your widgets
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around px-4"
              style={{
                borderColor: config.theme.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                background: config.theme.mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  < div
                    key={item.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex flex-col items-center gap-1"
                  >
                    {Icon && (
                      <Icon 
                        size={18} 
                        style={{ 
                          color: index === 0 ? config.theme.primaryColor : undefined,
                          opacity: index === 0 ? 1 : 0.4 
                        }}
                      />
                    )}
                    <span 
                      style={{ 
                        fontSize: '9px',
                        color: index === 0 ? config.theme.primaryColor : undefined,
                        opacity: index === 0 ? 1 : 0.4 
                      }}
                    >
                      {item.label}
                    </span>
                  </ div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Theme Indicator */}
        < div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-center"
        >
          <p className="text-xs opacity-50">
            Theme: {config.theme.mode} • Tone: {config.tone}
          </p>
        </ div>
      </ div>
    </div>
  );
}
