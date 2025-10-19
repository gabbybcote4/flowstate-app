# 📊 Weekly Insights Dashboard - Access Guide

## How to Access Weekly Insights

The Weekly Insights Dashboard can be accessed in **2 ways**:

### 1. **From Home Dashboard** (Quick Access)
- Go to the **Home** screen
- Find the **"This Week"** summary card (shows Mood, Sleep, Habits stats)
- Tap the **"View Full Insights"** button at the bottom of the card
- → Opens the full Weekly Insights Dashboard

### 2. **From More Menu** (Direct Navigation)
- Tap **"More"** in the bottom navigation bar
- Under **"Progress & Growth"** category
- Tap **"Weekly Insights"**
- Description: "Mood, sleep & life area analytics"
- → Opens the full Weekly Insights Dashboard

## Features in Weekly Insights Dashboard

### ✨ Insight of the Week Card
- **Gentle, compassionate insights** based on your data
- Examples:
  - "Beautiful Sleep Rhythm" — when sleeping well
  - "Your Body Needs You" — when sleep is low
  - "Upward Momentum" — when mood is trending up
  - "Beautiful Balance" — when engaging multiple life areas

### 📈 Mood vs. Sleep Line Chart
- **Dual-line visualization** showing patterns over 7 days
- Purple line = Mood (1-5 scale)
- Blue line = Sleep (hours)
- Interactive tooltips with daily details
- Context tip: "Notice the patterns: when sleep improves, mood often follows"

### 🥧 Life Area Time Distribution
- **Pie chart** showing time allocation across:
  - 💜 Health
  - 💼 Work
  - 💕 Relationships
  - 📈 Personal Growth
  - 🎨 Creativity
  - 🏡 Home
- **Detailed legend** with hours and percentages
- Pulls data from TimeFlow blocks and Calendar events
- Balance insight: "Balance isn't equal parts — it's honoring what each season needs"

### 🔄 Refresh Data
- Tap the refresh button in the top-right to reload latest data
- Data sources:
  - Check-in mood/energy/focus
  - Reflection sleep quality
  - Habit completions
  - TimeFlow blocks
  - Calendar events

## Navigation Structure

```
App.tsx
├── Screen: "weekly-insights"
├── Component: WeeklyInsightsDashboard
│   ├── onNavigate prop (to return to home)
│   └── Data from localStorage:
│       ├── flowstate-coaching-data (mood/energy/focus)
│       ├── flowstate-reflections (sleep)
│       ├── flowstate-habits (completions)
│       ├── flowstate-timeblocks (life area time)
│       └── flowstate-calendar-events (scheduled time)
```

## Data Flow

```
DashboardScreen (Home)
└── WeeklySummaryCard
    └── onViewDetails={() => onNavigate('weekly-insights')}
        └── Opens WeeklyInsightsDashboard

More Menu
└── "Weekly Insights" item
    └── setCurrentScreen('weekly-insights')
        └── Opens WeeklyInsightsDashboard
```

## Design Philosophy

All insights follow the **"Notion meets Headspace"** tone:
- ✅ Compassionate, never judgmental
- ✅ Acknowledges struggles ("This week was heavy")
- ✅ Celebrates small wins ("You showed up")
- ✅ Focuses on patterns, not perfection
- ✅ Empowering but gentle

Perfect for users managing migraines, ADHD, fatigue, and burnout! 🌸💜
