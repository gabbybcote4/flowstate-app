import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ChevronRight, Check } from 'lucide-react';

interface FontSizeSelectorProps {
  currentSize: 'Small' | 'Medium' | 'Large';
  onSelect: (size: 'Small' | 'Medium' | 'Large') => void;
}

export function FontSizeSelector({ currentSize, onSelect }: FontSizeSelectorProps) {
  const sizes = [
    { name: 'Small', description: 'Compact view' },
    { name: 'Medium', description: 'Default size' },
    { name: 'Large', description: 'Easier to read' },
  ] as const;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-between w-full">
          <div>
            <div>Font Size</div>
            <div className="text-sm opacity-60">{currentSize}</div>
          </div>
          <ChevronRight size={20} className="opacity-40" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Font Size</DialogTitle>
          <DialogDescription>
            Choose your preferred text size for better readability
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {sizes.map((size) => (
            <button
              key={size.name}
              onClick={() => {
                onSelect(size.name);
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium">{size.name}</div>
                <div className="text-sm opacity-60">{size.description}</div>
              </div>
              {currentSize === size.name && (
                <Check size={20} className="text-lavender-600" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
