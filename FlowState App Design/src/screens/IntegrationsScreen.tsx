// src/screens/IntegrationsScreen.tsx
// integrations hub screen with connection management and permission scopes
import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  Heart,
  Calendar,
  Music,
  Cloud,
  Shield,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

type IntegrationStatus =
  | "disconnected"
  | "connected"
  | "read-only"
  | "syncing"
  | "error";

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
  privacyType: "local" | "read-only" | "read-write";
  category: string;
  scopes: IntegrationScope[];
  syncFrequency?: string;
  lastSync?: string;
  dataTypes?: string[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: "apple-health",
    name: "Apple Health",
    description: "Sync sleep, steps, heart rate",
    longDescription:
      "Connect to Apple Health to automatically track your sleep, activity, and heart rate. FlowState uses this data to adjust your daily plan.",
    icon: Heart,
    iconBg: "#fee2e2",
    iconColor: "#ef4444",
    status: "disconnected",
    privacyType: "read-only",
    category: "health",
    scopes: [
      { id: "sleep", name: "Sleep Data", description: "Sleep hours and quality", required: true },
      { id: "activity", name: "Activity Data", description: "Steps and movement", required: true },
      { id: "heart", name: "Heart Rate", description: "Resting HR and HRV", required: false },
    ],
    dataTypes: ["Sleep", "Steps", "Heart Rate"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync events & schedule",
    longDescription:
      "Connect Google Calendar to view meetings, events, and reminders within FlowState.",
    icon: Calendar,
    iconBg: "#e0f2fe",
    iconColor: "#0284c7",
    status: "connected",
    privacyType: "read-write",
    category: "productivity",
    syncFrequency: "Every 15 min",
    lastSync: "2 mins ago",
    scopes: [
      { id: "read", name: "Read Events", description: "View events and availability", required: true },
      { id: "write", name: "Add Events", description: "Create tasks as events", required: false },
    ],
    dataTypes: ["Events", "Reminders"],
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Focus playlists & music",
    longDescription:
      "Connect Spotify to access playlists and use music to boost focus and energy.",
    icon: Music,
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    status: "read-only",
    privacyType: "read-only",
    category: "mindfulness",
    syncFrequency: "Manual",
    lastSync: "1 hr ago",
    scopes: [
      { id: "playlists", name: "Playlists", description: "Access and play music", required: true },
      { id: "history", name: "Listening History", description: "Recently played tracks", required: false },
    ],
    dataTypes: ["Playlists", "Tracks"],
  },
  {
    id: "openweather",
    name: "OpenWeather",
    description: "Weather-based energy",
    longDescription:
      "Track local weather and pressure changes to anticipate energy dips or migraine triggers.",
    icon: Cloud,
    iconBg: "#e0e7ff",
    iconColor: "#6366f1",
    status: "syncing",
    privacyType: "local",
    category: "weather",
    syncFrequency: "Hourly",
    lastSync: "Just now",
    scopes: [
      { id: "current", name: "Current Weather", description: "Temperature and pressure", required: true },
      { id: "forecast", name: "Forecast", description: "5-day forecast", required: false },
    ],
    dataTypes: ["Temperature", "Pressure", "Conditions"],
  },
];

interface IntegrationsScreenProps {
  onBack?: () => void;
}

export function IntegrationsScreen({ onBack }: IntegrationsScreenProps) {
  const { themeColors } = useTheme();
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    const saved = localStorage.getItem("flowstate-integrations");
    if (saved) {
      const parsed = JSON.parse(saved);
      return INTEGRATIONS.map((i) => ({
        ...i,
        status: (parsed[i.id]?.status as IntegrationStatus) || i.status,
      }));
    }
    return INTEGRATIONS;
  });

  const [selected, setSelected] = useState<Integration | null>(null);
  const [filter, setFilter] = useState("all");

  const toggleIntegration = (id: string) => {
    const updated = integrations.map((i) => {
      if (i.id === id) {
        const newStatus: IntegrationStatus =
          i.status === "disconnected"
            ? i.privacyType === "read-only"
              ? "read-only"
              : "connected"
            : "disconnected";
        toast.success(
          newStatus === "disconnected"
            ? `${i.name} disconnected`
            : `${i.name} connected 🔗`
        );
        return { ...i, status: newStatus };
      }
      return i;
    });

    setIntegrations(updated);

    const save: Record<string, { status: IntegrationStatus }> = {};
    updated.forEach((i) => (save[i.id] = { status: i.status }));
    localStorage.setItem("flowstate-integrations", JSON.stringify(save));
  };

  const categories = [
    { id: "all", name: "All" },
    { id: "health", name: "Health" },
    { id: "productivity", name: "Productivity" },
    { id: "mindfulness", name: "Mindfulness" },
    { id: "weather", name: "Weather" },
  ];

  const filtered =
    filter === "all" ? integrations : integrations.filter((i) => i.category === filter);

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="p-6 md:p-8 pt-12 md:pt-16 max-w-6xl mx-auto">
        {/* header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 opacity-70 hover:opacity-100"
            >
              <ArrowLeft size={20} />
              back
            </button>
          )}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: themeColors.primaryLight }}
            >
              <Shield size={28} style={{ color: themeColors.primary }} />
            </div>
            <div>
              <h1>integrations hub</h1>
              <p className="text-sm opacity-70">
                {integrations.filter((i) => i.status !== "disconnected").length} connected •
                privacy-first
              </p>
            </div>
          </div>
        </div>

        {/* privacy section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Shield size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="mb-1">privacy first</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                flowstate never stores your personal data externally. integrations use minimal
                permissions and stay local unless you sync manually.
              </p>
            </div>
          </div>
        </div>

        {/* filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className="px-4 py-2 rounded-2xl text-sm whitespace-nowrap transition-all"
              style={{
                backgroundColor: filter === c.id ? themeColors.primary : "white",
                color: filter === c.id ? "white" : "#374151",
                border: filter === c.id ? "none" : "1px solid #e5e7eb",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* integration list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {filtered.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onToggle={toggleIntegration}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* coming soon */}
        <div className="flow-card">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-3">
            <ExternalLink size={24} className="text-gray-400" />
          </div>
          <h3 className="mb-2">more integrations coming soon</h3>
          <p className="text-sm text-gray-600 mb-4">
            we’re adding notion, fitbit, oura ring, and more.
          </p>
          <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50">
            request integration
          </button>
        </div>
      </div>

      {selected && <ScopesModal integration={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function IntegrationCard({
  integration,
  onToggle,
  onSelect,
}: {
  integration: Integration;
  onToggle: (id: string) => void;
  onSelect: (integration: Integration) => void;
}) {
  const Icon = integration.icon;
  const isActive = integration.status !== "disconnected";

  return (
    <div className="flow-card">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: integration.iconBg }}
      >
        <Icon size={26} style={{ color: integration.iconColor }} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <h3>{integration.name}</h3>
          <button
            onClick={() => onToggle(integration.id)}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            {isActive ? "Disconnect" : "Connect"}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
        <p
          className={`text-xs ${
            isActive ? "text-green-600" : "text-gray-400"
          }`}
        >
          {integration.status}
        </p>
        {isActive && (
          <div className="mt-3">
            <button
              onClick={() => onSelect(integration)}
              className="text-xs text-blue-600 underline hover:text-blue-800"
            >
              View Scopes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScopesModal({
  integration,
  onClose,
}: {
  integration: Integration;
  onClose: () => void;
}) {
  const Icon = integration.icon;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="flow-card">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: integration.iconBg }}
          >
            <Icon size={24} style={{ color: integration.iconColor }} />
          </div>
          <div>
            <h3>{integration.name} permissions</h3>
            <p className="text-sm text-gray-600">{integration.privacyType} access</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{integration.longDescription}</p>
        <div className="space-y-2">
          {integration.scopes.map((s) => (
            <div key={s.id} className="p-3 bg-gray-50 rounded-xl flex items-start gap-3">
              <CheckCircle2
                size={16}
                className={s.required ? "text-green-600 mt-1" : "text-gray-400 mt-1"}
              />
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-gray-600">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              toast.success(`${integration.name} authorized`);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: integration.iconColor }}
          >
            Authorize
          </button>
        </div>
      </div>
    </div>
  );
}
