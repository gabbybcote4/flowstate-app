// src/screens/AuthScreen.tsx
// adaptive authentication screen — theme-based gradients and dark mode support

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTheme } from "../components/ThemeContext";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface AuthScreenProps {
  onAuthComplete: () => void;
}

type AuthMode = "login" | "signup";

export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { themeColors, darkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onAuthComplete();
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-700"
      style={{
        background: darkMode
          ? themeColors.background
          : `linear-gradient(to bottom right, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      {/* header */}
      <div className="pt-12 pb-8 px-6">
        <div className="flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primaryLight}, ${themeColors.primary})`,
              boxShadow: `0 10px 40px ${themeColors.primaryLight}55`,
            }}
          >
            <Sparkles className="text-white" size={32} />
          </div>
          <h1
            className="text-center text-[var(--color-card-foreground)]"
            style={{
              fontSize: "32px",
              fontWeight: 600,
            }}
          >
            FlowState
          </h1>
          <p className="text-center mt-2 opacity-70 text-[var(--color-card-foreground)]">
            {mode === "login" ? "welcome back" : "start your journey"}
          </p>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-md mx-auto">
          <div key={mode}>
            {/* form card */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl p-6 mb-6 transition-all"
              style={{
                background: darkMode ? themeColors.card : "#ffffff",
                boxShadow: darkMode
                  ? "0 0 0 1px rgba(255,255,255,0.05)"
                  : "0 10px 40px rgba(0,0,0,0.08)",
              }}
            >
              <div className="space-y-5">
                {/* email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="opacity-70">
                    email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-[var(--color-card-foreground)]"
                      size={20}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-12 h-14 rounded-2xl border border-[var(--color-ring-offset-background)] focus:border-[var(--color-primary)] transition-colors"
                      style={{ fontSize: "16px" }}
                      required
                    />
                  </div>
                </div>

                {/* password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="opacity-70">
                    password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-[var(--color-card-foreground)]"
                      size={20}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-12 pr-12 h-14 rounded-2xl border border-[var(--color-ring-offset-background)] focus:border-[var(--color-primary)] transition-colors"
                      style={{ fontSize: "16px" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl transition-all duration-300"
                  style={{
                    background: isLoading
                      ? `${themeColors.primaryLight}80`
                      : `linear-gradient(135deg, ${themeColors.primaryLight}, ${themeColors.primaryDark})`,
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 500,
                    boxShadow: isLoading
                      ? "none"
                      : `0 4px 20px ${themeColors.primaryLight}55`,
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      />
                      <span>please wait...</span>
                    </div>
                  ) : mode === "login" ? (
                    "log in"
                  ) : (
                    "create account"
                  )}
                </Button>
              </div>
            </form>

            {/* divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--color-ring-offset-background)]" />
              <span className="text-sm opacity-40 text-[var(--color-card-foreground)]">
                or continue with
              </span>
              <div className="flex-1 h-px bg-[var(--color-ring-offset-background)]" />
            </div>

            {/* social auth buttons */}
            <div className="space-y-3 mb-6">
              {/* google */}
              <button
                type="button"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-md disabled:opacity-50"
                style={{
                  background: darkMode ? themeColors.card : "#ffffff",
                  border: `1px solid ${themeColors.primaryLight}44`,
                  color: "var(--color-card-foreground)",
                  fontSize: "15px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* apple */}
              <button
                type="button"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-md disabled:opacity-50"
                style={{
                  background: darkMode ? themeColors.card : "#ffffff",
                  border: `1px solid ${themeColors.primaryLight}44`,
                  color: "var(--color-card-foreground)",
                  fontSize: "15px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15.538 1.5c.115 1.363-.395 2.646-1.17 3.597-.775.951-2.005 1.673-3.343 1.577-.14-1.318.445-2.691 1.195-3.562.75-.872 2.04-1.547 3.318-1.612zM18.333 14.583c-.358 1.023-.533 1.48-.995 2.386-.646 1.27-1.558 2.85-2.687 2.863-1.004.013-1.266-.663-2.616-.656-1.35.007-1.645.67-2.65.657-1.128-.013-1.983-1.433-2.629-2.703-1.812-3.558-2-7.728-.883-9.946.795-1.578 2.055-2.501 3.22-2.501 1.197 0 1.95.67 2.938.67.958 0 1.542-.672 2.922-.672 1.043 0 2.153.715 2.943 1.944-2.587 1.42-2.167 5.115.437 5.958z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* note */}
            <p className="text-center text-sm opacity-60 mb-6 px-4 text-[var(--color-card-foreground)]">
              we’ll never spam or overwhelm you 💜
            </p>

            {/* toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity text-[var(--color-card-foreground)]"
              >
                {mode === "login" ? (
                  <>
                    don’t have an account?{" "}
                    <span
                      className="font-medium"
                      style={{ color: themeColors.primary }}
                    >
                      sign up
                    </span>
                  </>
                ) : (
                  <>
                    already have an account?{" "}
                    <span
                      className="font-medium"
                      style={{ color: themeColors.primary }}
                    >
                      log in
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* loading indicator */}
      {isLoading && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: themeColors.primary }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
