//import React, { useState } from 'react';
//import { ThemeSelector } from './ThemeSelector';
//import { FontSizeSelector } from './FontSizeSelector';
//import { BrightnessControl } from './GentleModeOverlay';
//import { useEmotionalState } from './EmotionalStateManager';
//import { Switch } from './ui/switch';
//import { ChevronRight, Heart, Smartphone, Moon, Download, AlertTriangle } from 'lucide-react';
//import { useTheme } from './ThemeContext';
//import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
//import { MoodButton } from './MoodButton';
//import { IntegrationsScreen } from './IntegrationsScreen';
//import { getLocalStorageItem, setLocalStorageItem } from '../hooks/useLocalStorage';

export function SettingsScreen() {
  //const { theme, setTheme, fontSize, setFontSize, minimalMode, setMinimalMode, nudgesEnabled, setNudgesEnabled, darkMode, setDarkMode, themeColors } = useTheme();
  //const { isGentleMode, toggleGentleMode } = useEmotionalState();
  // const [showMoodDialog, setShowMoodDialog] = useState(false);
  // const [selectedMood, setSelectedMood] = useState<string | null>(null);
  // const [showIntegrations, setShowIntegrations] = useState(false);
  // const [showResetDialog, setShowResetDialog] = useState(false);
  
  // Get current mood
  // const getCurrentMood = () => {
  //   const savedMood = getLocalStorageItem('flowstate-mood', null);
  //   if (savedMood === 'low') return 'Low Energy';
  //   if (savedMood === 'moderate') return 'Moderate Energy';
  //   if (savedMood === 'good') return 'Good Energy';
  //   return 'Not set';
  // };
  
  // const handleMoodChange = () => {
  //   if (selectedMood) {
  //     const today = new Date().toDateString();
  //     setLocalStorageItem('flowstate-mood-date', today);
  //     setLocalStorageItem('flowstate-mood', selectedMood);
  //     setShowMoodDialog(false);
  //     setSelectedMood(null);
  //   }
  // };

  // const handleExportData = () => {
  //   // Gather all FlowState data from localStorage
  //   const allData: Record<string, any> = {};
    
  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (key && key.startsWith('flowstate-')) {
  //       const value = localStorage.getItem(key);
  //       try {
  //         allData[key] = JSON.parse(value || '');
  //       } catch {
  //         allData[key] = value;
  //       }
  //     }
  //   }
    
    // Create JSON file
    //const dataStr = JSON.stringify(allData, null, 2);
    //const dataBlob = new Blob([dataStr], { type: 'application/json' });
    //const url = URL.createObjectURL(dataBlob);
    
    // Create download link
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `flowstate-data-${new Date().toISOString().split('T')[0]}.json`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  // const handleResetData = () => {
  //   // Clear all FlowState data from localStorage
  //   const keysToRemove: string[] = [];
    
  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (key && key.startsWith('flowstate-')) {
  //       keysToRemove.push(key);
  //     }
  //   }
    
  //   keysToRemove.forEach(key => localStorage.removeItem(key));
    
  //   //setShowResetDialog(false);
    
  //   // Reload the page to restart the app
  //   window.location.reload();
  // };

  // const getConnectedIntegrationsCount = () => {
  //   const saved = localStorage.getItem('flowstate-integrations');
  //   if (!saved) return 2; // Default: Google Calendar and OpenWeather
  //   const integrations = JSON.parse(saved);
  //   return Object.values(integrations).filter(Boolean).length;
  // };

  // If showing integrations, render that screen
  // if (showIntegrations) {
  //   return <IntegrationsScreen onBack={() => setShowIntegrations(false)} />;
  // }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b"
      style={{
        //backgroundImage: `linear-gradient(to bottom, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`
      }}
    >
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2">Settings</h1>
            <p className="opacity-70">Customize your FlowState experience</p>
          </div>

        {/* Theme Section */}
        {/* <div className="mb-8">
          <h2 className="mb-4">Theme</h2>
          <ThemeSelector selected={theme} onSelect={setTheme} />
        </div> */}

        {/* Appearance Section */}
        <div className="mb-8">
          <h2 className="mb-4">Appearance</h2>
          {/* <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <FontSizeSelector currentSize={fontSize} onSelect={setFontSize} />
            <div className="border-t border-gray-100"></div>
            <div className="flex items-center justify-between">
              <div>
                <div>Dark Mode</div>
                <div className="text-sm opacity-60">Easy on the eyes</div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="flex items-center justify-between">
              <div>
                <div>Minimal Mode</div>
                <div className="text-sm opacity-60">Reduced motion & dim UI</div>
              </div>
              <Switch checked={minimalMode} onCheckedChange={setMinimalMode} />
            </div>
          </div> */}
        </div>

        {/* Daily Check-In Section */}
        <div className="mb-8">
          <h2 className="mb-4">Daily Check-In</h2>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            {/* <button 
              className="flex items-center justify-between w-full"
              onClick={() => setShowMoodDialog(true)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: themeColors.primaryLight }}
                >
                  <Heart size={20} style={{ color: themeColors.primary }} />
                </div>
                <div className="text-left">
                  <div>Today's Mood</div>
                  <div className="text-sm opacity-60">{getCurrentMood()}</div>
                </div>
              </div>
              <ChevronRight size={20} className="opacity-40" />
            </button> */}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-8">
          <h2 className="mb-4">Notifications</h2>
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            {/* <div className="flex items-center justify-between">
              <div>
                <div>Gentle Nudges</div>
                <div className="text-sm opacity-60">Friendly reminders & celebrations</div>
              </div>
              <Switch checked={nudgesEnabled} onCheckedChange={setNudgesEnabled} />
            </div> */}
          </div>
        </div>

        {/* Integrations Section */}
        <div className="mb-8">
          <h2 className="mb-4">Integrations</h2>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            {/* <button 
              className="flex items-center justify-between w-full"
              onClick={() => setShowIntegrations(true)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: themeColors.primaryLight }}
                >
                  <Smartphone size={20} style={{ color: themeColors.primary }} />
                </div>
                <div className="text-left">
                  <div>Connected Apps</div>
                  <div className="text-sm opacity-60">
                    {getConnectedIntegrationsCount()} integrations active
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="opacity-40" />
            </button> */}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mb-8">
          <h2 className="mb-4">Privacy & Data</h2>
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            {/* <button className="flex items-center justify-between w-full" onClick={handleExportData}>
              <span>Export My Data</span>
              <Download size={20} className="opacity-40" />
            </button>
            <div className="border-t border-gray-100"></div>
            <button className="flex items-center justify-between w-full text-red-500" onClick={() => setShowResetDialog(true)}>
              <span>Reset All Data</span>
              <AlertTriangle size={20} className="opacity-40" />
            </button> */}
          </div>
        </div>

          {/* About */}
          <div className="text-center opacity-50 text-sm">
            FlowState v1.0.0
            <div className="mt-1">Made with care for gentle productivity</div>
          </div>
        </div>
      </div>
      
      {/* Change Mood Dialog */}
      {/* <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
        <DialogContent className="rounded-2xl shadow-lg max-w-md mx-auto p-6">
          <DialogHeader>
            <DialogTitle>Change Your Mood</DialogTitle>
            <DialogDescription>
              How are you feeling right now?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-3 mt-4">
            <MoodButton
              label="Low Energy"
              color="bg-blue-100 text-blue-700"
              selected={selectedMood === "low"}
              onClick={() => setSelectedMood("low")}
            />
            <MoodButton
              label="Moderate Energy"
              color="bg-peach-100 text-orange-700"
              selected={selectedMood === "moderate"}
              onClick={() => setSelectedMood("moderate")}
            />
            <MoodButton
              label="Good Energy"
              color="bg-green-100 text-green-700"
              selected={selectedMood === "good"}
              onClick={() => setSelectedMood("good")}
            />
          </div>
          
          <button
            onClick={handleMoodChange}
            disabled={!selectedMood}
            className="mt-6 py-3 w-full text-center rounded-2xl shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedMood ? themeColors.primary : themeColors.primaryLight,
              color: '#ffffff',
            }}
          >
            Update Mood
          </button>
        </DialogContent>
      </Dialog> */}

      {/* Reset Data Dialog */}
      {/* <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="rounded-2xl shadow-lg max-w-md mx-auto p-6">
          <DialogHeader>
            <DialogTitle>Reset All Data</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all your FlowState data? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-3 mt-4">
            <button
              className="py-3 w-full text-center rounded-2xl shadow-lg transition-all duration-200 bg-red-500 text-white"
              onClick={handleResetData}
            >
              Reset Data
            </button>
            <button
              className="py-3 w-full text-center rounded-2xl shadow-lg transition-all duration-200 bg-gray-200 text-gray-700"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}