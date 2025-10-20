import { useState } from 'react';
import { Settings } from 'lucide-react';
//import { useTheme } from '../components/context/ThemeContext';
//import { useLocalStorage } from './hooks/useLocalStorage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
//import { Input } from './ui/input';
import { Label } from '../ui/label';
//import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
//import { RadioGroup, RadioGroupItem } from './ui/radio-group';

// interface WeatherData {
//   temp: number;
//   condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
//   location: string;
// }

// interface MoonPhase {
//   phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
//   illumination: number;
//   emoji: string;
//   name: string;
// }

// interface WeatherSettings {
//   location: string;
//   useAutoLocation: boolean;
//   temperatureUnit: 'F' | 'C';
//   showMoonPhase: boolean;
//   showIntention: boolean;
// }

export function WeatherMoonWidget() {
  //const { themeColors } = useTheme();
  //const [weather, setWeather] = useState<WeatherData | null>(null);
  // const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings with localStorage persistence
  // const [settings, setSettings] = useLocalStorage<WeatherSettings>('weather-widget-settings', {
  //   location: 'San Francisco',
  //   useAutoLocation: true,
  //   temperatureUnit: 'F',
  //   showMoonPhase: true,
  //   showIntention: true,
  // });

  // useEffect(() => {
  //   // Calculate moon phase
  //   calculateMoonPhase();
    
  //   // Mock weather data (in production, you'd call a weather API)
  //   // Example: OpenWeatherMap, WeatherAPI, etc.
  //   const mockWeather: WeatherData = {
  //     temp: settings.temperatureUnit === 'F' ? 72 : Math.round((72 - 32) * 5/9),
  //     condition: getRandomWeatherCondition(),
  //     location: settings.location
  //   };
  //   setWeather(mockWeather);

  //   // Try to get user's location for more accurate data
  //   if (settings.useAutoLocation && navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         // In production, use position.coords.latitude/longitude to fetch real weather
  //         console.log('Location:', position.coords.latitude, position.coords.longitude);
  //       },
  //       // (error) => {
  //       //   console.log('Location access denied, using manual location');
  //       // }
  //     );
  //   }
  // }, [settings]);

  // const calculateMoonPhase = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = today.getMonth() + 1;
  //   const day = today.getDate();
    
  //   // Simple moon phase calculation (Simplified formula)
  //   const c = Math.floor((year - 2000) / 100);
  //   const e = Math.floor(2 - c + Math.floor(c / 4));
  //   const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
  //   const daysSinceNew = (jd - 2451549.5) % 29.53059;
    
  //   const phases: MoonPhase[] = [
  //     { phase: 'new', illumination: 0, emoji: '🌑', name: 'New Moon' },
  //     { phase: 'waxing-crescent', illumination: 25, emoji: '🌒', name: 'Waxing Crescent' },
  //     { phase: 'first-quarter', illumination: 50, emoji: '🌓', name: 'First Quarter' },
  //     { phase: 'waxing-gibbous', illumination: 75, emoji: '🌔', name: 'Waxing Gibbous' },
  //     { phase: 'full', illumination: 100, emoji: '🌕', name: 'Full Moon' },
  //     { phase: 'waning-gibbous', illumination: 75, emoji: '🌖', name: 'Waning Gibbous' },
  //     { phase: 'last-quarter', illumination: 50, emoji: '🌗', name: 'Last Quarter' },
  //     { phase: 'waning-crescent', illumination: 25, emoji: '🌘', name: 'Waning Crescent' }
  //   ];
    
  //   const phaseIndex = Math.floor((daysSinceNew / 29.53059) * 8) % 8;
  //   // setMoonPhase(phases[phaseIndex]);
  // };

  // const getRandomWeatherCondition = (): WeatherData['condition'] => {
  //   //const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
  //   const hour = new Date().getHours();
    
  //   // Make it more likely to be sunny during day, cloudy at night
  //   if (hour >= 6 && hour < 18) {
  //     return Math.random() > 0.3 ? 'sunny' : 'cloudy';
  //   } else {
  //     return Math.random() > 0.5 ? 'cloudy' : 'rainy';
  //   }
  // };

  // const getWeatherIcon = (condition: WeatherData['condition']) => {
  //   switch (condition) {
  //     case 'sunny': return <Sun size={24} />;
  //     case 'cloudy': return <Cloud size={24} />;
  //     case 'rainy': return <CloudRain size={24} />;
  //     case 'snowy': return <CloudSnow size={24} />;
  //     case 'windy': return <Wind size={24} />;
  //     default: return <Sun size={24} />;
  //   }
  // };

  // const getWeatherColor = (condition: WeatherData['condition']) => {
  //   switch (condition) {
  //     case 'sunny': return '#F59E0B';
  //     case 'cloudy': return '#9CA3AF';
  //     case 'rainy': return '#3B82F6';
  //     case 'snowy': return '#93C5FD';
  //     case 'windy': return '#6B7280';
  //     default: return '#F59E0B';
  //   }
  // };

  // const getIntentionForPhase = (phase: string) => {
  //   switch (phase) {
  //     case 'new': return 'New beginnings await ✨';
  //     case 'waxing-crescent': return 'Time to set intentions 🌱';
  //     case 'first-quarter': return 'Take action on your goals 💪';
  //     case 'waxing-gibbous': return 'Refine and adjust 🔧';
  //     case 'full': return 'Celebrate your progress 🎉';
  //     case 'waning-gibbous': return 'Release what no longer serves 🍃';
  //     case 'last-quarter': return 'Rest and reflect 🧘';
  //     case 'waning-crescent': return 'Surrender and trust 🙏';
  //     default: return 'Align with natural rhythms 🌙';
  //   }
  // };

  // const convertTemperature = (temp: number, fromUnit: 'F' | 'C', toUnit: 'F' | 'C') => {
  //   if (fromUnit === toUnit) return temp;
  //   if (toUnit === 'C') return Math.round((temp - 32) * 5/9);
  //   return Math.round(temp * 9/5 + 32);
  // };

  // const handleLocationChange = (newLocation: string) => {
  //   setSettings({ ...settings, location: newLocation });
  // };

  // const handleAutoLocationToggle = (checked: boolean) => {
  //   setSettings({ ...settings, useAutoLocation: checked });
  // };

  // const handleTemperatureUnitChange = (unit: 'F' | 'C') => {
  //   setSettings({ ...settings, temperatureUnit: unit });
  // };

  // const handleMoonPhaseToggle = (checked: boolean) => {
  //   setSettings({ ...settings, showMoonPhase: checked });
  // };

  // const handleIntentionToggle = (checked: boolean) => {
  //   setSettings({ ...settings, showIntention: checked });
  // };

  //if (!weather || !moonPhase) return null;

  return (
    <div className="bg-white rounded-3xl shadow-md p-5">
      <div className="flex items-center justify-between mb-4">
        {/* Weather Section */}
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ 
              // backgroundColor: `${getWeatherColor(weather.condition)}20`,
              // color: getWeatherColor(weather.condition)
            }}
          >
            {/* {getWeatherIcon(weather.condition)} */}
          </div>
          <div>
            {/* <div className="text-2xl">{weather.temp}°{settings.temperatureUnit}</div> */}
            {/* <div className="text-xs opacity-60 capitalize">{weather.condition}</div> */}
          </div>
        </div>

        {/* Moon Phase Section */}
        {/* {settings.showMoonPhase && (
          <div className="flex items-center gap-3">
            <div>
              <div className="text-2xl text-right">{moonPhase.emoji}</div>
              <div className="text-xs opacity-60 text-right">{moonPhase.illumination}%</div>
            </div>
            <div className="text-xs opacity-60">{moonPhase.name}</div>
          </div>
        )} */}

        {/* Settings Button */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <button 
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Weather Settings"
            >
              <Settings size={16} className="opacity-40 hover:opacity-70" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Weather Widget Settings</DialogTitle>
              <DialogDescription>
                Customize your weather and moon phase display
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Location Settings */}
              <div className="space-y-3">
                <Label htmlFor="location">Location</Label>
                {/* <Input
                  id="location"
                  value={settings.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  disabled={settings.useAutoLocation}
                  placeholder="Enter city name"
                /> */}
                <div className="flex items-center space-x-2">
                  {/* <Switch
                    id="auto-location"
                    checked={settings.useAutoLocation}
                    onCheckedChange={handleAutoLocationToggle}
                  /> */}
                  <Label htmlFor="auto-location" className="text-sm opacity-70">
                    Auto-detect location
                  </Label>
                </div>
              </div>

              {/* Temperature Unit */}
              <div className="space-y-3">
                <Label>Temperature Unit</Label>
                {/* <RadioGroup 
                  value={settings.temperatureUnit} 
                  onValueChange={(value) => handleTemperatureUnitChange(value as 'F' | 'C')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="fahrenheit" />
                    <Label htmlFor="fahrenheit" className="text-sm">Fahrenheit (°F)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="celsius" />
                    <Label htmlFor="celsius" className="text-sm">Celsius (°C)</Label>
                  </div>
                </RadioGroup> */}
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <Label>Display Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-moon" className="text-sm">Show moon phase</Label>
                    {/* <Switch
                      id="show-moon"
                      checked={settings.showMoonPhase}
                      onCheckedChange={handleMoonPhaseToggle}
                    /> */}
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-intention" className="text-sm">Show intention message</Label>
                    {/* <Switch
                      id="show-intention"
                      checked={settings.showIntention}
                      onCheckedChange={handleIntentionToggle}
                    /> */}
                  </div>
                </div>
              </div>

              {/* Info text */}
              <div className="text-xs opacity-60 p-3 bg-gray-50 rounded-lg">
                💡 Note: Weather data is currently simulated. Connect to a weather API for real-time data.
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSettingsOpen(false)}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Intention Line */}
      {/* {settings.showIntention && (
        <div 
          className="px-3 py-2 rounded-xl text-sm text-center transition-all"
          style={{ 
            backgroundColor: '#F3F4F6',
            fontStyle: 'italic'
          }}
        >
          {getIntentionForPhase(moonPhase.phase)}
        </div>
      )} */}
    </div>
  );
}