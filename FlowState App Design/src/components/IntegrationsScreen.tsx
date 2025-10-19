import { useState } from 'react';
import { useTheme } from './ThemeContext';
import { 
  Heart,
  Calendar,
  CheckSquare,
  Brain,
  Music,
  BookOpen,
  Cloud,
  Activity,
  Shield,
  Eye,
  Lock,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Info,
  X,
  AlertCircle,
  Settings
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion, AnimatePresence } from '../lib/motion-shim';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

type IntegrationStatus = 'disconnected' | 'connected' | 'read-only' | 'syncing' | 'error';

interface IntegrationScope {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  status: IntegrationStatus;
  privacyType: 'local' | 'read-only' | 'read-write';
  category: string;
  scopes: IntegrationScope[];
  syncFrequency?: string;
  lastSync?: string;
  dataTypes?: string[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    description: 'Sync sleep, steps, heart rate',
    longDescription: 'Connect to Apple Health to automatically track your sleep patterns, daily activity, and heart rate variability. This helps FlowState adapt your routines based on your physical readiness.',
    icon: Heart,
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    status: 'disconnected',
    privacyType: 'read-only',
    category: 'health',
    scopes: [
      { id: 'sleep', name: 'Sleep Data', description: 'Hours slept, sleep quality, sleep stages', required: true },
      { id: 'activity', name: 'Activity Data', description: 'Steps, active minutes, calories', required: true },
      { id: 'heart', name: 'Heart Rate', description: 'Resting heart rate, HRV', required: false },
      { id: 'mindful', name: 'Mindful Minutes', description: 'Meditation and breathing sessions', required: false },
    ],
    dataTypes: ['Sleep', 'Steps', 'Heart Rate', 'HRV'],
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    description: 'Activity & wellness tracking',
    longDescription: 'Integrate with Google Fit to bring your fitness and activity data into FlowState. Track how movement affects your energy and mood over time.',
    icon: Activity,
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    status: 'disconnected',
    privacyType: 'read-only',
    category: 'health',
    scopes: [
      { id: 'activity', name: 'Activity Data', description: 'Steps, distance, active minutes', required: true },
      { id: 'sleep', name: 'Sleep Sessions', description: 'Sleep duration and quality', required: false },
      { id: 'heart', name: 'Heart Points', description: 'Cardiovascular activity', required: false },
    ],
    dataTypes: ['Steps', 'Activity', 'Sleep'],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync events & schedule',
    longDescription: 'Connect Google Calendar to automatically see your meetings and commitments. FlowState will help you find optimal times for focus work and self-care around your schedule.',
    icon: Calendar,
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    status: 'connected',
    privacyType: 'read-write',
    category: 'productivity',
    syncFrequency: 'Every 15 minutes',
    lastSync: '2 mins ago',
    scopes: [
      { id: 'read', name: 'Read Calendar Events', description: 'View your calendar events and availability', required: true },
      { id: 'write', name: 'Create Events', description: 'Add habits and tasks as calendar events', required: false },
      { id: 'metadata', name: 'Event Metadata', description: 'Access event descriptions and attendees', required: false },
    ],
    dataTypes: ['Events', 'Free/Busy', 'Reminders'],
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Calendar & task management',
    longDescription: 'Integrate with Microsoft Outlook to sync your calendar, tasks, and availability. Perfect for work-life balance across Microsoft 365.',
    icon: Calendar,
    iconBg: '#dbeafe',
    iconColor: '#0078d4',
    status: 'disconnected',
    privacyType: 'read-write',
    category: 'productivity',
    scopes: [
      { id: 'calendar', name: 'Calendar Access', description: 'Read and write calendar events', required: true },
      { id: 'tasks', name: 'Tasks & To-Do', description: 'Sync Microsoft To-Do tasks', required: false },
      { id: 'presence', name: 'Presence Status', description: 'Know when you\'re in meetings', required: false },
    ],
    dataTypes: ['Calendar', 'Tasks', 'Presence'],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Focus playlists & listening',
    longDescription: 'Connect Spotify to access your focus playlists and track how music affects your productivity. Create the perfect soundtrack for your routines.',
    icon: Music,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    status: 'read-only',
    privacyType: 'read-only',
    category: 'mindfulness',
    syncFrequency: 'Manual',
    lastSync: '1 hour ago',
    scopes: [
      { id: 'playlists', name: 'Access Playlists', description: 'View and play your playlists', required: true },
      { id: 'playback', name: 'Control Playback', description: 'Play, pause, and skip tracks', required: true },
      { id: 'listening', name: 'Listening History', description: 'See recently played tracks', required: false },
    ],
    dataTypes: ['Playlists', 'Listening History', 'Playback'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Import tasks & notes',
    longDescription: 'Sync your Notion workspace with FlowState. Import tasks from databases and keep your notes in sync across both platforms.',
    icon: BookOpen,
    iconBg: '#f3f4f6',
    iconColor: '#374151',
    status: 'disconnected',
    privacyType: 'read-only',
    category: 'productivity',
    scopes: [
      { id: 'pages', name: 'Read Pages', description: 'Access selected Notion pages', required: true },
      { id: 'databases', name: 'Read Databases', description: 'Query task and habit databases', required: true },
      { id: 'comments', name: 'Comments', description: 'Read comments and discussions', required: false },
    ],
    dataTypes: ['Pages', 'Databases', 'Tasks'],
  },
  {
    id: 'openweather',
    name: 'OpenWeather',
    description: 'Energy based on weather',
    longDescription: 'Track local weather patterns and barometric pressure. Especially helpful for migraine sufferers to anticipate low-pressure triggers.',
    icon: Cloud,
    iconBg: '#e0e7ff',
    iconColor: '#6366f1',
    status: 'syncing',
    privacyType: 'local',
    category: 'weather',
    syncFrequency: 'Hourly',
    lastSync: 'Just now',
    scopes: [
      { id: 'current', name: 'Current Weather', description: 'Real-time weather conditions', required: true },
      { id: 'forecast', name: '5-Day Forecast', description: 'Plan ahead for weather changes', required: false },
      { id: 'pressure', name: 'Barometric Pressure', description: 'Track pressure for migraine prevention', required: true },
    ],
    dataTypes: ['Temperature', 'Conditions', 'Pressure', 'Humidity'],
  },
];

interface IntegrationsScreenProps {
  onBack?: () => void;
}

function IntegrationCard({ 
  integration, 
  onToggle, 
  onViewScopes 
}: { 
  integration: Integration;
  onToggle: (id: string) => void;
  onViewScopes: (integration: Integration) => void;
}) {
  const Icon = integration.icon;
  
  const getStatusBadge = () => {
    switch (integration.status) {
      case 'connected':
        return (
          <Badge className="text-xs gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 size={10} />
            Connected
          </Badge>
        );
      case 'read-only':
        return (
          <Badge className="text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200">
            <Eye size={10} />
            Read-only
          </Badge>
        );
      case 'syncing':
        return (
          <Badge className="text-xs gap-1 bg-purple-50 text-purple-700 border-purple-200">
            <RefreshCw size={10} className="animate-spin" />
            Syncing
          </Badge>
        );
      case 'error':
        return (
          <Badge className="text-xs gap-1 bg-red-50 text-red-700 border-red-200">
            <AlertCircle size={10} />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs opacity-50">
            Disconnected
          </Badge>
        );
    }
  };

  const getPrivacyBadge = () => {
    switch (integration.privacyType) {
      case 'local':
        return (
          <Badge variant="outline" className="text-xs gap-1 border-green-300 bg-green-50 text-green-700">
            <Lock size={10} />
            Local only
          </Badge>
        );
      case 'read-only':
        return (
          <Badge variant="outline" className="text-xs gap-1 border-blue-300 bg-blue-50 text-blue-700">
            <Eye size={10} />
            Read only
          </Badge>
        );
      case 'read-write':
        return (
          <Badge variant="outline" className="text-xs gap-1 border-purple-300 bg-purple-50 text-purple-700">
            <Shield size={10} />
            Read & write
          </Badge>
        );
    }
  };

  const isActive = integration.status !== 'disconnected';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: integration.iconBg }}
          >
            <Icon size={26} style={{ color: integration.iconColor }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="truncate mb-1">{integration.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {integration.description}
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={() => onToggle(integration.id)}
                className="flex-shrink-0"
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {getStatusBadge()}
              {getPrivacyBadge()}
            </div>

            {/* Sync Info */}
            {isActive && integration.syncFrequency && (
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                <RefreshCw size={12} />
                <span>{integration.syncFrequency}</span>
                {integration.lastSync && (
                  <>
                    <span>•</span>
                    <span>Last sync: {integration.lastSync}</span>
                  </>
                )}
              </div>
            )}

            {/* Data Types */}
            {isActive && integration.dataTypes && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {integration.dataTypes.map(type => (
                  <span
                    key={type}
                    className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewScopes(integration)}
                className="text-xs"
              >
                <Info size={12} className="mr-1" />
                View Scopes
              </Button>
              {isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Settings size={12} className="mr-1" />
                  Configure
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScopesModal({ 
  integration, 
  onClose 
}: { 
  integration: Integration | null;
  onClose: () => void;
}) {
  if (!integration) return null;

  const Icon = integration.icon;

  return (
    <Dialog open={!!integration} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: integration.iconBg }}
            >
              <Icon size={24} style={{ color: integration.iconColor }} />
            </div>
            <div>
              <DialogTitle>{integration.name} Permissions</DialogTitle>
              <DialogDescription>
                Data access and privacy details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Long Description */}
        <div className="py-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {integration.longDescription}
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-900 mb-1">
                <strong>Privacy Protection:</strong>
              </p>
              <p className="text-blue-700">
                {integration.privacyType === 'local' 
                  ? 'All data stays on your device. Nothing is sent to external servers.'
                  : integration.privacyType === 'read-only'
                  ? 'FlowState can only read your data. We never modify or delete your information.'
                  : 'FlowState can read and create entries. You control what data is shared.'}
              </p>
            </div>
          </div>
        </div>

        {/* Scopes */}
        <div>
          <h4 className="mb-3 text-sm opacity-70">Required Permissions</h4>
          <div className="space-y-3">
            {integration.scopes.map(scope => (
              <div
                key={scope.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="mt-0.5">
                  {scope.required ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm">{scope.name}</h5>
                    {scope.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{scope.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose}>
            Authorize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function IntegrationsScreen({ onBack }: IntegrationsScreenProps) {
  const { themeColors } = useTheme();
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem('flowstate-integrations-v2');
    if (saved) {
      const savedData = JSON.parse(saved);
      return INTEGRATIONS.map(integration => ({
        ...integration,
        status: savedData[integration.id]?.status || integration.status,
      }));
    }
    return INTEGRATIONS;
  });

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleIntegration = (id: string) => {
    const newIntegrations = integrations.map(integration => {
      if (integration.id === id) {
        const newStatus: IntegrationStatus = 
          integration.status === 'disconnected' 
            ? (integration.privacyType === 'read-only' ? 'read-only' : 'connected')
            : 'disconnected';
        
        toast.success(
          newStatus === 'disconnected' 
            ? `${integration.name} disconnected` 
            : `${integration.name} connected 🔗`
        );

        return { ...integration, status: newStatus };
      }
      return integration;
    });

    setIntegrations(newIntegrations);

    // Save to localStorage
    const savedData: Record<string, any> = {};
    newIntegrations.forEach(integration => {
      savedData[integration.id] = { status: integration.status };
    });
    localStorage.setItem('flowstate-integrations-v2', JSON.stringify(savedData));
  };

  const categories = [
    { id: 'all', name: 'All', count: integrations.length },
    { id: 'health', name: 'Health', count: integrations.filter(i => i.category === 'health').length },
    { id: 'productivity', name: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length },
    { id: 'mindfulness', name: 'Mindfulness', count: integrations.filter(i => i.category === 'mindfulness').length },
    { id: 'weather', name: 'Weather', count: integrations.filter(i => i.category === 'weather').length },
  ];

  const filteredIntegrations = filterCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === filterCategory);

  const connectedCount = integrations.filter(i => i.status !== 'disconnected').length;

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="p-6 md:p-8 pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 mb-4 opacity-60 hover:opacity-100 transition-opacity"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: themeColors.primaryLight }}
                >
                  <Shield size={28} style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <h1>Integrations Hub</h1>
                  <p className="text-sm opacity-70">
                    {connectedCount} connected • Privacy-first design
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-5 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">Privacy First</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  FlowState never collects or stores your personal information on our servers. All integrations use minimal permissions and your data stays on your device unless you explicitly sync to external services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className="px-4 py-2 rounded-2xl text-sm whitespace-nowrap transition-all"
                style={{
                  backgroundColor: filterCategory === category.id ? themeColors.primary : 'white',
                  color: filterCategory === category.id ? 'white' : '#374151',
                  border: filterCategory === category.id ? 'none' : '1px solid #e5e7eb',
                }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Integration Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {filteredIntegrations.map(integration => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={toggleIntegration}
                onViewScopes={setSelectedIntegration}
              />
            ))}
          </div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-3">
              <ExternalLink size={24} className="text-gray-400" />
            </div>
            <h3 className="mb-2">More Integrations Coming</h3>
            <p className="text-sm text-gray-600 mb-4">
              We're working on Todoist, Asana, Trello, Oura Ring, Fitbit, and more. Have a suggestion?
            </p>
            <Button variant="outline" size="sm">
              Request Integration
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scopes Modal */}
      <ScopesModal
        integration={selectedIntegration}
        onClose={() => setSelectedIntegration(null)}
      />
    </div>
  );
}
