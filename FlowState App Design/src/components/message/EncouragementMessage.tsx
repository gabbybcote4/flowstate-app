// src/components/message/EncouragementMessage.tsx
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const encouragementMessages = [
  "You're doing your best, and that's more than enough 🌟",
  "Small steps today, beautiful progress tomorrow 🌱",
  "Rest is productive too. Honor what you need 💜",
  "Your energy matters more than your output today ✨",
  "Be gentle with yourself - you're growing 🌸",
  "Progress isn't linear, and that's perfectly okay 🦋",
  "You showed up today. That's brave 💪",
  "Listen to your body - it knows what it needs 🌙",
  "Every tiny choice you make counts 🌟",
  "You're allowed to do things at your own pace 🐢",
];


export function EncouragementMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // select message based on day of year for consistency
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % encouragementMessages.length;
    setMessage(encouragementMessages[index]);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div className="bg-gradient-to-br from-lavender-100 to-peach-100 rounded-3xl shadow-sm p-2 border border-lavender-200">
        <div className="flex gap-2">
          <div className="flex mt-1">
            <Sparkles size={24} className="text-lavender-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lavender-700 mb-2">A gentle reminder</h3>
            <p className="text-[var(--color-card-foreground)] leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
