import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FocusTimer } from '../components/FocusTimer';
//import { BreathingExercise } from '../components/exercise/BreathingExercise';
//import { MusicPlayer } from '../components/player/MusicPlayer';
import { useTheme } from '../components/ThemeContext';

export function FocusToolsScreen() {
  const { themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div 
      className="min-h-screen bg-gradient-to-b relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`
      }}
    >
      <div className="absolute top-0 left-0 bg-black/75 text-white px-2 py-1 text-sm rounded-br z-50">FOCUS TOOLS SCREEN</div>
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 
              className="mb-2"
              style={{ color: themeColors.primaryDark }}
            >
              Focus Tools
            </h1>
            <p className="opacity-70">Find your calm and concentrate</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[var(--color-card)] p-1.5 rounded-3xl mb-8 shadow-md">
              <TabsTrigger 
                value="timer" 
                className="rounded-2xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-lavender-400 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                Timer
              </TabsTrigger>
              <TabsTrigger 
                value="breathing" 
                className="rounded-2xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-lavender-400 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                Breathe
              </TabsTrigger>
              <TabsTrigger 
                value="music" 
                className="rounded-2xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-lavender-400 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                Music
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timer" className="mt-0">
              <FocusTimer />
            </TabsContent>
{/* 
            <TabsContent value="breathing" className="mt-0">
              <BreathingExercise />
            </TabsContent>

            <TabsContent value="music" className="mt-0">
              <MusicPlayer />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
