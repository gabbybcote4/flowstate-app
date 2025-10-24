// src/screens/SettingsScreen.tsx
// user settings page with adaptive theme, font size, and dark mode toggle

import { ThemeSelector } from "../components/ThemeSelector";
import { FontSizeSelector } from "../components/FontSizeSelector";
import { Switch } from "../components/ui/switch";
import { useTheme } from "../components/ThemeContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

interface SettingsScreenProps {
  onNavigate?: (screen: string) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { theme, setTheme, fontSize, setFontSize, darkMode, setDarkMode, themeColors } =
    useTheme();

  // reset handler — clears all flowstate data and refreshes
  const handleResetData = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("flowstate-")) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        background: darkMode
          ? themeColors.background
          : `linear-gradient(to bottom, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      <div className="p-4 md:p-6 pt-8 md:pt-12 pb-32">
        <div className="max-w-md mx-auto px-4">
          {/* header */}
          <div className="mb-8">
            <h1 className="mb-2 text-[var(--color-card-foreground)]">Settings</h1>
            <p className="opacity-70 text-[var(--color-card-foreground)]">
              Customize your FlowState experience
            </p>
          </div>

          {/* theme section */}
          <div className="mb-8">
            <h2 className="mb-4 text-[var(--color-card-foreground)]">Theme</h2>
            <ThemeSelector selected={theme} onSelect={setTheme} />
          </div>

          {/* appearance section */}
          <div className="mb-8">
            <h2 className="mb-4 text-[var(--color-card-foreground)]">Appearance</h2>
            <div className="flow-card">
              <FontSizeSelector currentSize={fontSize} onSelect={setFontSize} />

              <div className="border-t border-[var(--color-ring-offset-background)]"></div>

              {/* dark mode toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[var(--color-card-foreground)]">Dark Mode</div>
                  <div className="text-sm opacity-60">Easy on the eyes, gentle for focus</div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </div>

          {/* dashboard layout section */}
          <div className="mb-8">
            <h2 className="mb-4 text-[var(--color-card-foreground)]">Dashboard Layout</h2>
            <div className="flow-card">
              <p className="text-sm opacity-70 text-[var(--color-card-foreground)]">
                Customize which widgets appear on your dashboard.
              </p>

              <button
                onClick={() => onNavigate?.("onboarding-layout")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--color-ring-offset-background)] transition-colors hover:bg-[var(--color-primary-light)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-primary-light)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[var(--color-card-foreground)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div>Customize Dashboard</div>
                    <div className="text-sm opacity-60">
                      Choose and reorder your widgets
                    </div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="text-xs opacity-60 mt-2">
                Your current layout:{" "}
                <span className="font-medium text-[var(--color-primary)]">
                  {localStorage.getItem("flowstate-dashboard-template") || "Hybrid"}
                </span>
              </div>
            </div>
          </div>

          {/* privacy & data section */}
          <div className="mb-8">
            <h2 className="mb-4 text-[var(--color-card-foreground)]">Privacy & Data</h2>
            <div className="flow-card">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center justify-between w-full text-red-500 hover:text-red-600 transition-colors">
                    <span>Reset All Data</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6v8H9zM4 4h16v4H4z"
                      />
                    </svg>
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="flow-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently erase all FlowState data and restart the app.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="mt-6 flex justify-end gap-3">
                    <AlertDialogCancel className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-card-foreground)] hover:opacity-80 transition">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="px-4 py-2 rounded-xl text-white hover:opacity-90 transition"
                      style={{ backgroundColor: themeColors.primary }}
                      onClick={handleResetData}
                    >
                      Confirm Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* about section */}
          <div className="text-center opacity-60 text-sm">
            FlowState v1.0.0
            <div className="mt-1">Made with care for gentle, adaptive productivity ✦</div>
          </div>
        </div>
      </div>
    </div>
  );
}
