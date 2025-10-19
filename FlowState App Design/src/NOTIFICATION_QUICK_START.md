# 🚀 Notification System Quick Start

## What You Just Built

A complete **Enhanced Notification System** with 4 smart notification types, beautiful UI, and intelligent auto-triggering.

---

## ✨ **How It Works**

### **Automatic Triggers**

The system monitors your activity and automatically shows notifications when:

#### 1️⃣ **Micro-win Time** (Purple ✨)
```
When: You complete a habit or todo
Example: "You just finished meditation!"
→ Notification appears suggesting next micro-win
```

#### 2️⃣ **Breathe** (Blue 🫁)
```
When: 2-4 PM OR you're feeling anxious
Example: Afternoon slump hits
→ Notification suggests breathing exercise
```

#### 3️⃣ **Gentle Plan** (Yellow 📋)
```
When: Low energy check-in OR morning with no plans
Example: You check in with energy level 2/5
→ Notification offers adaptive plan
```

#### 4️⃣ **Focus Window** (Green ⚡)
```
When: 9-11 AM OR high energy+focus (4+/5)
Example: You check in with energy 5, focus 5
→ Notification alerts you to peak productivity time
```

---

## 🎨 **Visual Design**

Each notification is a **rounded, translucent toast card** with:

```
┌────────────────────────────────────────┐
│  🎯  ✨ Micro-win time!            ✕  │
│                                        │
│  You just completed something.         │
│  Keep that momentum going!             │
│                                        │
│  [Add to Plan]  [View Habits]  [Snooze]│
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░ (progress)  │
└────────────────────────────────────────┘
```

**Features:**
- Gradient background (95% opacity)
- Backdrop blur effect
- Colored icon in rounded square
- 2-3 action buttons
- Progress bar countdown
- Slow fade-out animation

---

## 🎯 **Action Buttons**

Every notification includes actionable buttons:

### Common Actions:
- **Add to Plan** → Opens TimeFlow screen
- **View Habits** → Opens Habits screen
- **Start Timer** → Opens Focus Tools
- **Start Breathing** → Opens breathing exercise
- **Ask Coach** → Opens AI Coach Chat
- **Snooze 20m** → Delays notification by 20 minutes

All buttons dismiss the notification and navigate you to the right place.

---

## 📱 **Where They Appear**

Notifications show up at **top-right** of screen (mobile: centered)

```
┌─────────────────────────────────┐
│  FlowState Header               │
├─────────────────────────────────┤
│                    ┌──────────┐ │
│  Your content      │ Notif 1  │ │
│  goes here         ├──────────┤ │
│                    │ Notif 2  │ │
│                    └──────────┘ │
│                                 │
└─────────────────────────────────┘
```

Stack vertically with smooth animations.

---

## 🧠 **Smart Logic**

### Cooldown Periods (prevents spam)
- Micro-win: 10 minutes
- Breathe: 30 minutes
- Gentle Plan: 1 hour
- Focus Window: 2 hours

### Data Sources
- `flowstate-habits` → Habit completions
- `flowstate-todos` → Todo completions
- `flowstate-coaching-data` → Energy/focus levels
- Emotional state → From EmotionalStateManager

### Respect User State
- **Gentle Mode ON** → Fewer notifications
- **User dismissed** → Won't show same type again soon
- **Snoozed** → Re-appears after 20 minutes

---

## 🧪 **Testing Notifications**

### Manual Test Panel
Use the `NotificationTestPanel` component to test all notification types:

1. Select notification type
2. Click "Trigger" button
3. See notification appear
4. Test action buttons
5. Try snooze/dismiss

### Trigger Real Notifications
1. **Micro-win:** Complete a habit in Habits screen
2. **Breathe:** Set emotional state to "anxious" in settings
3. **Gentle Plan:** Check in with low energy (1-2)
4. **Focus Window:** Check in with high energy+focus (4-5) at 9-11 AM

---

## 🔧 **Integration**

Already integrated into your app! Here's what was added:

### `App.tsx`
```tsx
import { 
  NotificationProvider, 
  EnhancedNotificationDisplay,
  useSmartNotifications 
} from './components/EnhancedNotificationSystem';

// In App component:
useSmartNotifications((screen) => setCurrentScreen(screen));

// In providers:
<NotificationProvider>
  <AppContent />
</NotificationProvider>

// In render:
<EnhancedNotificationDisplay />
```

### Files Created
- ✅ `/components/EnhancedNotificationSystem.tsx` (Main system)
- ✅ `/components/NotificationTestPanel.tsx` (Testing UI)
- ✅ `/NOTIFICATION_SYSTEM.md` (Full documentation)
- ✅ `/NOTIFICATION_QUICK_START.md` (This file)

---

## 🎯 **Quick Reference**

### Show Notification Manually
```tsx
import { useNotifications } from './components/EnhancedNotificationSystem';

const { showNotification } = useNotifications();

showNotification({
  type: 'micro-win',
  title: '✨ Great job!',
  message: 'You completed something important.',
  actions: [
    {
      id: 'next-task',
      label: 'Next Task',
      icon: Plus,
      variant: 'primary',
      handler: () => navigateToTodos(),
    },
  ],
  duration: 12000, // 12 seconds
});
```

### Dismiss Notification
```tsx
const { dismissNotification } = useNotifications();
dismissNotification(notificationId);
```

### Snooze Notification
```tsx
const { snoozeNotification } = useNotifications();
snoozeNotification(notificationId, 1200000); // 20 minutes
```

---

## 🌟 **User Experience**

### Compassionate Tone
- "You just completed something" (celebrates achievement)
- "Your mind needs a reset" (acknowledges difficulty)
- "Built around your energy, not against it" (empowering)

### Non-Intrusive
- Auto-dismiss after duration
- Easy to snooze or dismiss
- Respects user preferences
- Doesn't block interactions

### Actionable
- Every notification has clear next steps
- Buttons navigate to relevant screens
- One-click actions

---

## 📊 **Notification Matrix**

| Type | Color | Icon | Trigger | Cooldown | Actions |
|------|-------|------|---------|----------|---------|
| Micro-win | Purple | ✨ | Habit/todo done | 10 min | Add to Plan, View Habits, Snooze |
| Breathe | Blue | 🫁 | 2-4 PM / Anxious | 30 min | Start Breathing, Snooze |
| Gentle Plan | Yellow | 📋 | Low energy / Morning | 1 hour | View Plan, Ask Coach, Snooze |
| Focus Window | Green | ⚡ | 9-11 AM / High focus | 2 hours | Start Timer, Add to Plan, Snooze |

---

## 💡 **Tips**

1. **Test frequently** using the test panel
2. **Adjust cooldowns** in code if needed
3. **Customize messages** for your users
4. **Monitor engagement** to see which work best
5. **Respect gentle mode** - users need peace sometimes

---

## 🎉 **What Users See**

```
User completes "Morning meditation" habit
     ↓
Notification appears:
"✨ Micro-win time!
You just completed something. Keep that momentum going!"
     ↓
User clicks "Add to Plan"
     ↓
Opens TimeFlow screen
     ↓
User adds next task to schedule
     ↓
Productivity momentum maintained! 🚀
```

---

## 🔗 **Related Systems**

Works alongside existing notification systems:

1. **MindfulNotificationSystem** - Time-based notifications
2. **NudgeSystem** - Gentle toast nudges  
3. **GentleModeOverlay** - Full-screen gentle mode
4. **EmotionalStateManager** - Emotional state tracking

All systems work together harmoniously! 💜

---

**Ready to use!** The system is already active and monitoring your app for opportunities to send helpful, compassionate notifications. 🎯✨
