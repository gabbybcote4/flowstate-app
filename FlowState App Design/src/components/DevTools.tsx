/**
 * Developer Tools Component
 * 
 * Hidden developer utilities for debugging localStorage issues
 * Access by adding ?devtools=true to the URL
 */

import { useState, useEffect } from 'react';
import { clearCorruptedKeys } from '../lib/localStorage-migration';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    // Check if devtools parameter is in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('devtools') === 'true') {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadKeys();
    }
  }, [isOpen]);

  const loadKeys = () => {
    if (typeof window === 'undefined') return;
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('flowstate-'));
    setKeys(allKeys);
  };

  const clearCorrupted = () => {
    clearCorruptedKeys();
    loadKeys();
    alert('Cleared corrupted localStorage keys');
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear ALL FlowState data?')) {
      keys.forEach(key => localStorage.removeItem(key));
      loadKeys();
      alert('Cleared all FlowState data. Page will reload.');
      window.location.reload();
    }
  };

  const inspectKey = (key: string) => {
    const value = localStorage.getItem(key);
    console.log(`Key: ${key}`);
    console.log(`Raw value:`, value);
    try {
      const parsed = JSON.parse(value || '');
      console.log(`Parsed value:`, parsed);
    } catch (e) {
      console.log(`Parse error:`, e);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Developer Tools
          </DialogTitle>
          <DialogDescription>
            Debug and manage localStorage data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={clearCorrupted}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear Corrupted Keys
            </Button>
            <Button 
              onClick={clearAll}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All Data
            </Button>
            <Button 
              onClick={loadKeys}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="mb-3">localStorage Keys ({keys.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {keys.map(key => {
                const value = localStorage.getItem(key);
                let isValid = true;
                try {
                  if (value) JSON.parse(value);
                } catch {
                  isValid = false;
                }

                return (
                  <div 
                    key={key}
                    className={`p-2 rounded border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm">{key}</div>
                        <div className="text-xs opacity-60 truncate max-w-md">
                          {value?.substring(0, 100)}
                          {value && value.length > 100 ? '...' : ''}
                        </div>
                      </div>
                      <Button
                        onClick={() => inspectKey(key)}
                        variant="ghost"
                        size="sm"
                      >
                        Inspect
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs opacity-60">
            Tip: Open browser console to see detailed inspection results
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
