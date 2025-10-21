import { useState } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function QuickReflectionCard() {
  const { themeColors } = useTheme();
  const [reflection, setReflection] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (reflection.trim()) {
      // Save to localStorage
      const today = new Date().toISOString().split('T')[0];
      const existingReflections = JSON.parse(
        localStorage.getItem('flowstate-reflections') || '{}'
      );
      
      if (!existingReflections[today]) {
        existingReflections[today] = [];
      }
      
      existingReflections[today].push({
        text: reflection,
        timestamp: new Date().toISOString(),
        type: 'quick'
      });
      
      localStorage.setItem('flowstate-reflections', JSON.stringify(existingReflections));
      setReflection('');
      setIsFocused(false);
    }
  };

  const prompts = [
    "How are you feeling right now?",
    "What's one thing that went well today?",
    "What do you need more of today?",
    "What can you let go of?",
    "What are you grateful for in this moment?"
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div style={{ position: 'relative' }}>
      <div className="absolute top-0 right-0 bg-black/75 text-white px-2 py-1 text-[10px] rounded-bl z-50">
        QUICK REFLECTION CARD
      </div>
      <div 
        className="bg-white rounded-3xl shadow-md p-5 mb-6"
        style={{ 
          boxShadow: isFocused 
            ? `0 10px 40px -10px ${themeColors.primary}40` 
            : '0 1px 3px 0 rgb(0 0 0 / 0.1)' 
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={18} style={{ color: themeColors.primary }} />
          <h3 className="text-sm opacity-80">Quick Reflection</h3>
        </div>
        
        <div className="text-xs opacity-60 mb-3 flex items-center gap-1">
          <Sparkles size={12} />
          <span>{randomPrompt}</span>
        </div>

        <div className="relative">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Write a quick thought..."
            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 resize-none transition-colors focus:outline-none"
            style={{
              borderColor: isFocused ? themeColors.primary : '#e5e7eb',
              minHeight: '80px'
            }}
            maxLength={200}
          />
          
          {reflection.trim() && (
            <button
              onClick={handleSubmit}
              className="absolute right-3 bottom-3 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Send size={14} />
            </button>
          )}
        </div>
        
        <div className="text-xs opacity-40 mt-2 text-right">
          {reflection.length}/200
        </div>
      </div>
    </div>
  );
}
