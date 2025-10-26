// src/screens/WelcomeScreen.tsx
// adaptive welcome screen — matches theme and dark mode system
import { Sparkles, Shield } from "lucide-react";
import { useTheme } from "../components/ThemeContext";

interface WelcomeScreenProps {
  userName?: string;
  onStartCheckIn: () => void;
}

export function WelcomeScreen({ userName = "Friend", onStartCheckIn }: WelcomeScreenProps) {
  const { themeColors, darkMode } = useTheme();

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-700"
      style={{
        background: darkMode
          ? themeColors.background
          : `linear-gradient(to bottom right, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      {/* wave background */}
      <div className="absolute inset-0 overflow-hidden opacity-70">

        {/* wave 1 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: "320px" }}
          >
            <path
              fill={themeColors.primaryDark}
              fillOpacity="0.25"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L0,320Z"
            />
          </svg>
        </div>

        {/* wave 2 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: "280px" }}
          >
            <path
              fill={themeColors.primary}
              fillOpacity="0.35"
              d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,202.7C960,192,1056,192,1152,213.3C1248,235,1344,277,1392,298.7L1440,320L0,320Z"
            />
          </svg>
        </div>

        {/* wave 3 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: "240px" }}
          >
            <path
              fill={themeColors.primaryLight}
              fillOpacity="0.4"
              d="M0,288L48,277.3C96,267,192,245,288,250.7C384,256,480,288,576,293.3C672,299,768,277,864,266.7C960,256,1056,256,1152,277.3C1248,299,1344,341,1392,362.7L1440,384L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">

          {/* icon circle */}
          <div className="mb-8 flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primaryLight}, ${themeColors.primary})`,
                boxShadow: `0 20px 60px ${themeColors.primaryLight}55`,
              }}
            >
              <Sparkles className="text-white" size={40} />
            </div>
          </div>

          {/* greeting */}
          <div className="mb-4">
            <h1
              className="mb-2 text-[var(--color-card-foreground)]"
              style={{
                fontSize: "32px",
                fontWeight: 600,
                lineHeight: "1.2",
                textTransform: "capitalize",
              }}
            >
              Welcome {userName} 🌿
            </h1>
            <p
              className="opacity-70 text-[var(--color-card-foreground)]"
              style={{
                fontSize: "20px",
                lineHeight: "1.4",
              }}
            >
              You're in flow.
            </p>
          </div>

          {/* intro text */}
          <p
            className="mb-10 opacity-80 text-[var(--color-card-foreground)]"
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Let's begin by checking in with how you're feeling today. This helps
            FlowState adapt to your energy and set the right tone for your day.
          </p>

          {/* cta button */}
          <div className="mb-12">
            <button
              onClick={onStartCheckIn}
              className="w-full py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 text-white font-medium"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primaryLight}, ${themeColors.primaryDark})`,
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              Start your first check-in
              <Sparkles size={20} />
            </button>
          </div>

          {/* privacy note */}
          <div
            className="rounded-2xl p-4 mx-auto max-w-sm text-[var(--color-card-foreground)]"
            style={{
              background: darkMode
                ? "rgba(30, 41, 59, 0.7)"
                : "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${themeColors.primaryLight}33`,
            }}
          >
            <div className="flex items-start gap-3">
              <Shield
                className="flex-shrink-0 mt-0.5 opacity-50"
                size={18}
                style={{ color: themeColors.primary }}
              />
              <p
                className="text-left opacity-70"
                style={{
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                <span style={{ color: themeColors.primary, fontWeight: 500 }}>
                  Your privacy matters:
                </span>{" "}
                Data is stored locally on your device and only syncs when you
                choose. You’re always in control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
