// src/components/FontSizeSelector.tsx
// dialog for selecting font size (small / medium / large)

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ChevronRight, Check } from "lucide-react";

interface FontSizeSelectorProps {
  currentSize: "Small" | "Medium" | "Large";
  onSelect: (size: "Small" | "Medium" | "Large") => void;
}

export function FontSizeSelector({
  currentSize,
  onSelect,
}: FontSizeSelectorProps) {
  const sizes = [
    { name: "Small", description: "compact view" },
    { name: "Medium", description: "default size" },
    { name: "Large", description: "easier to read" },
  ] as const;

  return (
    <Dialog>
      {/* trigger button that shows current size */}
      <DialogTrigger asChild>
        <button className="flex items-center justify-between w-full">
          <div>
            <div>Font Size</div>
            <div className="text-sm opacity-60">{currentSize}</div>
          </div>
          <ChevronRight size={20} className="opacity-40" />
        </button>
      </DialogTrigger>

      {/* dialog content */}
      <DialogContent className="max-w-sm bg-[var(--color-card)] text-[var(--color-card-foreground)]">
        <DialogHeader>
          <DialogTitle>Font Size</DialogTitle>
          <DialogDescription>
            choose your preferred text size for better readability
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {sizes.map((size) => (
            <button
              key={size.name}
              onClick={() => onSelect(size.name)}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
              style={{
                backgroundColor:
                  currentSize === size.name
                    ? "var(--color-input)"
                    : "var(--color-card)",
                border:
                  currentSize === size.name
                    ? "1px solid var(--color-ring)"
                    : "1px solid var(--color-accent)",
              }}
            >
              <div className="text-left">
                <div className="font-medium">{size.name}</div>
                <div className="text-sm opacity-60">{size.description}</div>
              </div>
              {currentSize === size.name && (
                <Check
                  size={20}
                  style={{ color: "var(--color-primary)" }}
                />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
