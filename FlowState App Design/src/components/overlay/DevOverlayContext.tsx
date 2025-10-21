/**
 * DevOverlayContext
 * Provides a simple toggle for development overlays (ScreenLabel, DevTag).
 * Persists state to localStorage and listens for the `D` key to toggle.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const STORAGE_KEY = 'flowstate-dev-overlays-enabled';

interface DevOverlayContextType {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  toggle: () => void;
}

const DevOverlayContext = createContext<DevOverlayContextType | undefined>(undefined);

export function DevOverlayProvider({ children }: { children: ReactNode }) {
  // Only initialize when running in the browser
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return true; // default ON for dev
      return raw === '1';
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }, [enabled]);

  // Keyboard listener: press 'd' or 'D' to toggle overlays, but avoid when typing in inputs
  useEffect(() => {
    // Safety: only in dev mode
    if (!(import.meta as any)?.env?.DEV) return;

    const handler = (e: KeyboardEvent) => {
      // debug
      // eslint-disable-next-line no-console
      console.debug('[DevOverlay] keydown', e.key);
      // Ignore modifier combos
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase();
        const editable = (target as HTMLElement).isContentEditable;
        if (tag === 'input' || tag === 'textarea' || editable) return;
      }

      if (e.key === 'd' || e.key === 'D') {
        // eslint-disable-next-line no-console
        console.debug('[DevOverlay] toggling overlays via keyboard');
        setEnabled((s) => !s);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggle = () => setEnabled((s) => !s);

  return (
    <DevOverlayContext.Provider value={{ enabled, setEnabled, toggle }}>
      {children}
      {/* Small dev indicator to show overlay state and allow clicking to toggle */}
      <button
        onClick={() => toggle()}
        title="Toggle dev overlays (press D)"
        aria-pressed={enabled}
        style={{
          position: 'fixed',
          right: 16,
          top: 16,
          zIndex: 99999,
          cursor: 'pointer',
          outline: 'none',
          border: 'none',
          background: 'none',
          padding: 0,
        }}
      >
        <div
          className={
            'select-none flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border ' +
            (enabled
              ? 'bg-green-100 border-green-300 text-green-800'
              : 'bg-gray-100 border-gray-300 text-gray-500 opacity-70')
          }
          style={{ minWidth: 120, fontSize: 13, fontWeight: 500 }}
        >
          <span style={{ fontSize: 16 }}>{enabled ? '🟢' : '⚪'}</span>
          <span>Dev overlays</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>({enabled ? 'ON' : 'OFF'})</span>
        </div>
      </button>
    </DevOverlayContext.Provider>
  );
}

export function useDevOverlay() {
  const ctx = useContext(DevOverlayContext);
  if (!ctx) {
    throw new Error('useDevOverlay must be used within DevOverlayProvider');
  }
  return ctx;
}
