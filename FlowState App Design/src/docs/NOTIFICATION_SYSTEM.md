# 🔔 Enhanced Notification System Documentation

## Overview

The Enhanced Notification System extends FlowState's existing notification infrastructure (MindfulNotificationSystem, NudgeSystem, GentleModeOverlay) with four new intelligent notification types, action buttons, and a beautiful translucent toast design.

---

## 🎯 Notification Types

### 1. **Micro-win Time** ✨
**Purpose:** Celebrate small achievements and maintain momentum

**Triggered When:**
- User completes a habit (within last 5 minutes)
- User completes a todo (within last 5 minutes)
- Cooldown: 10 minutes between notifications

**Message Examples:**
- "You just completed something. That momentum? Keep it going with one more tiny win."

**Actions:**
- 🎯 **Add to Plan** → Navigate to TimeFlow
- 📋 **View Habits** → Navigate to Habits screen
- ⏰ **Snooze 20m** → Delay notification

**Visual Design:**
- Purple/pink gradient background
- Sparkles (✨) icon
- Purple accent color (#a855f7)

---

### 2. **Breathe** 🫁
**Purpose:** Prompt mindful breathing during stress or afternoon slumps

**Triggered When:**
- Afternoon slump hours (2-4 PM)
- User is in "anxious" or "overwhelmed" emotional state
- Cooldown: 30 minutes between notifications

**Message Examples:**
- "Your mind needs a reset. Three deep breaths can shift everything."
- "Notice your breathing right now. Is it shallow? Let's fix that together."
- "Pause. Breathe in for 4, hold for 4, out for 6. You've got this."

**Actions:**
- 🌬️ **Start Breathing** → Navigate to Focus Tools
- ⏰ **Snooze 20m** → Delay notification

**Visual Design:**
- Blue/cyan gradient background
- Wind icon (🌬️)
- Blue accent color (#3b82f6)

---

### 3. **Gentle Plan Available** 📋
**Purpose:** Suggest adaptive daily plans based on energy levels

**Triggered When:**
- User checks in with low energy (≤2)
- Morning hours (7-10 AM) with no time blocks planned
- Cooldown: 1 hour between notifications

**Message Examples:**
- "You checked in with low energy. We made a gentle plan that honors where you're at today."
- "Morning is here. Want a realistic plan for today? Nothing intense—just what feels doable."
- "A gentle, adaptive plan is ready for you. Built around your energy, not against it."

**Actions:**
- 📅 **View Plan** → Navigate to TimeFlow
- 💬 **Ask Coach** → Navigate to AI Coach Chat
- ⏰ **Snooze 20m** → Delay notification

**Visual Design:**
- Amber/yellow gradient background
- Calendar icon (📅)
- Amber accent color (#f59e0b)

---

### 4. **Focus Window** ⚡
**Purpose:** Alert users to optimal productivity periods

**Triggered When:**
- Morning peak hours (9-11 AM)
- User has high energy (≥4) AND high focus (≥4)
- Cooldown: 2 hours between notifications

**Message Examples:**
- "This is your morning power window. Your mind is fresh and focused. Use it wisely."
- "You checked in with high energy AND focus. This is rare—protect this window for your most important work."
- "Peak focus window detected. What's the one thing that matters most right now?"

**Actions:**
- 🧠 **Start Timer** → Navigate to Focus Tools
- ➕ **Add to Plan** → Navigate to TimeFlow
- ⏰ **Snooze 20m** → Delay notification

**Visual Design:**
- Emerald/green gradient background
- Brain icon (🧠)
- Green accent color (#10b981)

---

## 🎨 Design Features

### Toast Card Design
- **Rounded corners:** 24px border radius (rounded-3xl)
- **Translucent background:** 95% opacity with gradient
- **Backdrop blur:** Subtle blur effect for depth
- **Shadow:** Multi-layer shadow for elevation
- **Border:** 2px semi-transparent border

### Animations
- **Entry:** Slide from right + scale up
- **Exit:** Slide to right + scale down (slow fade)
- **Duration:** 400ms spring animation
- **Progress bar:** Linear countdown at bottom
- **Icon:** Rotate + scale on entry

### Visual Hierarchy
1. Icon (12x12, colored background circle)
2. Title (h4, dark gray)
3. Message (text-sm, gray-700)
4. Action buttons (rounded-xl, colored)
5. Progress bar (1px height, countdown)

---

## 🛠️ Technical Implementation

### File Structure
```
/components/
├── EnhancedNotificationSystem.tsx  (Main system)
├── NotificationTestPanel.tsx       (Testing UI)
├── MindfulNotificationSystem.tsx   (Original system)
├── NudgeSystem.tsx                 (Gentle nudges)
└── GentleModeOverlay.tsx           (Gentle mode)
```

### Context Provider
```tsx
<NotificationProvider>
  <App />
</NotificationProvider>
```

### Hook Usage
```tsx
const { showNotification, dismissNotification, snoozeNotification } = useNotifications();

showNotification({
  type: 'micro-win',
  title: '✨ Micro-win time!',
  message: 'You just completed something...',
  actions: [...],
  duration: 15000,
});
```

### Smart Triggers
The `useSmartNotifications` hook automatically:
- Monitors habits and todos for completions
- Checks time of day and emotional state
- Detects energy/focus levels from check-ins
- Respects cooldown periods
- Prevents notification spam

---

## 📊 Data Sources

### localStorage Keys Used
- `flowstate-habits` - Habit completions
- `flowstate-todos` - Todo completions
- `flowstate-coaching-data` - Energy/focus check-ins
- `flowstate-timeblocks` - Planned time blocks
- Emotional state from `EmotionalStateManager`

### Cooldown Management
Each notification type tracks last shown time to prevent spam:
- Micro-win: 10 minutes
- Breathe: 30 minutes
- Gentle Plan: 1 hour
- Focus Window: 2 hours

---

## 🎭 User Experience Philosophy

### Compassionate Messaging
All notifications follow the "Notion meets Headspace" tone:
- ✅ Supportive, not demanding
- ✅ Acknowledges struggle ("Your mind needs a reset")
- ✅ Celebrates progress ("You just completed something")
- ✅ Empowering language ("You've got this")
- ✅ Gentle suggestions ("Want a realistic plan?")

### Non-Intrusive
- Auto-dismiss after duration
- Snooze option on all notifications
- Easy dismiss with X button
- Respects gentle mode settings
- Lower notification frequency in gentle mode

### Actionable
Every notification includes:
- 1-2 primary action buttons
- Clear next steps
- Direct navigation to relevant screens
- Optional snooze for flexibility

---

## 🧪 Testing

### Test Panel
A `NotificationTestPanel` component is available for testing:

**Features:**
- Trigger any notification type on demand
- See active notification count
- Clear all notifications
- View auto-trigger conditions
- Understand design features

**How to Access:**
Can be added to Settings screen or accessed via debug mode.

### Manual Testing
1. Complete a habit/todo → Micro-win notification
2. Set emotional state to "anxious" → Breathe notification
3. Check in with low energy → Gentle plan notification
4. Check in with high energy+focus → Focus window notification

---

## 🔧 Customization

### Adjust Cooldown Periods
In `EnhancedNotificationSystem.tsx`:
```tsx
// Change from 10 minutes to 15 minutes
const timeSinceLastMicroWin = Date.now() - lastMicroWin;
if (... && timeSinceLastMicroWin > 900000) { // 15 min
```

### Add New Notification Type
1. Add type to `NotificationType` union
2. Create trigger logic in `useSmartNotifications`
3. Add visual styles in `getStyles()` function
4. Add to test panel

### Modify Messages
Messages are defined in the trigger functions and can be:
- Randomized from arrays
- Contextual based on user data
- Personalized with user names/stats

---

## 🚀 Integration with Existing Systems

### MindfulNotificationSystem
- Original time-based notifications (morning, lunch, reflection)
- Uses different positioning (top-right vs top-4 right-4)
- Both systems work independently

### NudgeSystem
- Toast-style gentle nudges (stretch, hydrate, breathe)
- Uses Sonner toast library
- Complementary to enhanced notifications

### GentleModeOverlay
- Full-screen gentle mode with dimming
- Enhanced notifications respect gentle mode state
- Reduced notification frequency when active

---

## 📱 Responsive Design

- Mobile: Single column, full width
- Desktop: Max width 28rem (max-w-md)
- Positioned top-20 right-4 (below header)
- Stack vertically with 12px gap
- Pointer events only on cards (not overlay)

---

## 🎯 Best Practices

### Do's ✅
- Keep messages under 100 characters
- Use emoji sparingly (1 per notification)
- Provide clear action buttons
- Respect user's emotional state
- Test on different screen sizes

### Don'ts ❌
- Don't spam users (respect cooldowns)
- Don't use alarming language
- Don't block user interactions
- Don't assume user context
- Don't ignore gentle mode

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Notification history log
- [ ] Custom notification schedules
- [ ] Sound effects (optional)
- [ ] Haptic feedback on mobile
- [ ] Machine learning for optimal timing
- [ ] User preference settings
- [ ] A/B testing different messages
- [ ] Analytics on notification engagement

### Integration Opportunities
- [ ] Connect with external calendars
- [ ] Integrate with health apps (Apple Health, Google Fit)
- [ ] Weather-based notifications
- [ ] Time zone awareness
- [ ] Focus mode integrations

---

## 📚 Related Documentation

- [MindfulNotificationSystem.tsx](./components/MindfulNotificationSystem.tsx)
- [NudgeSystem.tsx](./components/NudgeSystem.tsx)
- [GentleModeOverlay.tsx](./components/GentleModeOverlay.tsx)
- [EmotionalStateManager.tsx](./components/EmotionalStateManager.tsx)

---

**Version:** 1.0.0  
**Last Updated:** October 18, 2025  
**Maintained by:** FlowState Team
