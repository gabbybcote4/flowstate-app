// DevTag.tsx
interface DevTagProps {
  name: string;
}

import { useDevOverlay } from './DevOverlayContext';

export function DevTag({ name }: DevTagProps) {
  if (!(import.meta as any)?.env?.DEV) return null;

  const { enabled } = useDevOverlay();
  if (!enabled) return null;

  return (
    <div
      className="absolute top-2 left-2 z-[9999]"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="group relative">
        <span
          className="block w-2 h-2 rounded-full bg-slate-400 opacity-60 hover:opacity-100 cursor-pointer"
          style={{ transition: 'opacity 0.2s' }}
          tabIndex={0}
          aria-label={`Show dev tag for ${name}`}
        ></span>
        <div
          className="absolute left-4 top-0 bg-white text-slate-700 text-xs font-medium px-2 py-1 rounded shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none"
          style={{ minWidth: 80, whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
