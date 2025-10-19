# 🎨 Design System Extensions

## Overview

Extended FlowState's design system with mood theme tokens, life area tokens, and 5 new UI components for enhanced data visualization and social features.

---

## 🎯 **New Design Tokens**

### Mood Theme Tokens

CSS variables for Low/Moderate/Good energy states with consistent color schemes:

```css
/* Low Energy (Blue) */
--mood-low-bg: #dbeafe;
--mood-low-border: #93c5fd;
--mood-low-text: #1e3a8a;
--mood-low-accent: #3b82f6;

/* Moderate Energy (Orange) */
--mood-moderate-bg: #fed7aa;
--mood-moderate-border: #fb923c;
--mood-moderate-text: #9a3412;
--mood-moderate-accent: #f97316;

/* Good Energy (Green) */
--mood-good-bg: #d1fae5;
--mood-good-border: #6ee7b7;
--mood-good-text: #065f46;
--mood-good-accent: #10b981;
```

**Usage:**
```tsx
<div style={{ 
  backgroundColor: 'var(--mood-low-bg)',
  borderColor: 'var(--mood-low-border)',
  color: 'var(--mood-low-text)',
}} />
```

---

### Life Area Tokens

CSS variables for 6 life areas with distinct color palettes:

```css
/* Health (Yellow/Amber) */
--life-health-bg: #fef3c7;
--life-health-border: #fbbf24;
--life-health-text: #92400e;
--life-health-accent: #f59e0b;

/* Work (Purple) */
--life-work-bg: #ddd6fe;
--life-work-border: #a78bfa;
--life-work-text: #5b21b6;
--life-work-accent: #8b5cf6;

/* Social (Pink) */
--life-social-bg: #fce7f3;
--life-social-border: #f9a8d4;
--life-social-text: #9f1239;
--life-social-accent: #ec4899;

/* Personal (Green) */
--life-personal-bg: #d1fae5;
--life-personal-border: #6ee7b7;
--life-personal-text: #065f46;
--life-personal-accent: #10b981;

/* Creative (Magenta) */
--life-creative-bg: #fae8ff;
--life-creative-border: #e879f9;
--life-creative-text: #701a75;
--life-creative-accent: #d946ef;

/* Learning (Blue) */
--life-learning-bg: #dbeafe;
--life-learning-border: #60a5fa;
--life-learning-text: #1e3a8a;
--life-learning-accent: #3b82f6;
```

---

## 🔷 **New Components**

### 1. **MomentumRing**

Circular progress indicator for daily momentum tracking with animated ring.

**Location:** `/components/ui/momentum-ring.tsx`

#### Basic Usage:
```tsx
import { MomentumRing } from './components/ui/momentum-ring';

<MomentumRing
  progress={75}
  size={120}
  color="#8b5cf6"
  label="Today"
  showPercentage={true}
  animate={true}
/>
```

#### Props:
- `progress` (number) - Progress percentage (0-100)
- `size` (number) - Size in pixels (default: 120)
- `strokeWidth` (number) - Ring thickness (default: 8)
- `color` (string) - Progress ring color (default: lavender)
- `backgroundColor` (string) - Background ring color
- `label` (string) - Optional center label
- `value` (string | number) - Custom value display
- `showPercentage` (boolean) - Show percentage (default: true)
- `animate` (boolean) - Animate on mount (default: true)

#### Variants:

**MomentumRingMini** - Compact inline version:
```tsx
<MomentumRingMini progress={60} size={24} color="#8b5cf6" />
```

#### Examples:
```tsx
// Daily completion ring
<MomentumRing
  progress={80}
  label="Daily"
  color="#10b981"
/>

// Custom value display
<MomentumRing
  progress={66}
  value="8/12"
  label="Habits"
/>
```

---

### 2. **LifeAreaChip**

Pill-shaped chip for displaying and filtering life areas with consistent color theming.

**Location:** `/components/ui/life-area-chip.tsx`

#### Basic Usage:
```tsx
import { LifeAreaChip } from './components/ui/life-area-chip';

<LifeAreaChip
  area="health"
  selected={true}
  onClick={() => handleSelect('health')}
/>
```

#### Props:
- `area` (LifeArea) - Life area type: 'health' | 'work' | 'social' | 'personal' | 'creative' | 'learning'
- `label` (string) - Custom label (defaults to area name)
- `selected` (boolean) - Selected/active state
- `removable` (boolean) - Show close button
- `size` ('sm' | 'md' | 'lg') - Size variant
- `onClick` (function) - Click handler
- `onRemove` (function) - Remove handler
- `icon` (ReactNode) - Custom icon

#### Variants:

**LifeAreaChipGroup** - Multi-select group:
```tsx
<LifeAreaChipGroup
  selected={['health', 'work']}
  multiSelect={true}
  onChange={(selected) => setSelected(selected)}
/>
```

**LifeAreaBadge** - Compact badge:
```tsx
<LifeAreaBadge area="health" showLabel={true} />
```

#### Examples:
```tsx
// Filter chips
<LifeAreaChip
  area="work"
  selected={activeFilters.includes('work')}
  size="md"
  onClick={toggleFilter}
/>

// Removable tags
<LifeAreaChip
  area="creative"
  removable={true}
  onRemove={() => removeTag('creative')}
/>

// Badge indicator
<LifeAreaBadge area="learning" showLabel={false} />
```

---

### 3. **CorrelationCard**

Displays insights about correlations between habits, moods, and life areas.

**Location:** `/components/ui/correlation-card.tsx`

#### Basic Usage:
```tsx
import { CorrelationCard } from './components/ui/correlation-card';

<CorrelationCard
  from={{ label: 'Morning Exercise', emoji: '🏃' }}
  to={{ label: 'Better Focus', emoji: '🎯' }}
  strength={85}
  direction="positive"
  insight="You focus 85% better on days when you exercise in the morning."
  dataPoints={14}
/>
```

#### Props:
- `from` (object) - Source element with label, icon, or emoji
- `to` (object) - Target element with label, icon, or emoji
- `strength` (number) - Correlation strength (0-100)
- `direction` ('positive' | 'negative' | 'neutral') - Correlation type
- `insight` (string) - Descriptive text
- `context` (string) - Additional context
- `dataPoints` (number) - Data points used
- `onClick` (function) - Click handler

#### Variants:

**CorrelationCardCompact** - Smaller list variant:
```tsx
<CorrelationCardCompact
  from="Sleep 8+ hours"
  to="High Energy"
  strength={78}
  direction="positive"
/>
```

**CorrelationInsightsList** - Group of cards:
```tsx
<CorrelationInsightsList
  insights={[...]}
  onInsightClick={(id) => viewDetails(id)}
/>
```

#### Examples:
```tsx
// Positive correlation
<CorrelationCard
  from={{ label: 'Meditation', emoji: '🧘' }}
  to={{ label: 'Low Anxiety', emoji: '😌' }}
  strength={92}
  direction="positive"
  insight="Meditation reduces anxiety by 92%"
  dataPoints={30}
/>

// Negative correlation
<CorrelationCard
  from={{ label: 'Late Coffee', emoji: '☕' }}
  to={{ label: 'Poor Sleep', emoji: '😴' }}
  strength={67}
  direction="negative"
  insight="Coffee after 2 PM disrupts sleep quality"
/>
```

---

### 4. **StackConnector**

Visual connector for habit stacking - shows relationships between trigger and new habits.

**Location:** `/components/ui/stack-connector.tsx`

#### Basic Usage:
```tsx
import { StackConnector } from './components/ui/stack-connector';

<StackConnector
  type="arrow"
  label="then"
  color="#8b5cf6"
  animated={true}
  orientation="vertical"
  size="md"
/>
```

#### Props:
- `type` ('arrow' | 'chain' | 'flow') - Connection type
- `label` (string) - Connection label (default: "then")
- `color` (string) - Theme color
- `animated` (boolean) - Show animation
- `orientation` ('vertical' | 'horizontal')
- `size` ('sm' | 'md' | 'lg')

#### Variants:

**StackConnectorDotted** - Dotted line:
```tsx
<StackConnectorDotted orientation="vertical" color="#8b5cf6" />
```

**StackConnectorFlow** - Animated flow with particles:
```tsx
<StackConnectorFlow orientation="vertical" color="#10b981" />
```

**HabitStackVisualizer** - Complete stack with cards:
```tsx
<HabitStackVisualizer
  habits={[
    { id: '1', name: 'Wake up', emoji: '☀️', completed: true },
    { id: '2', name: 'Drink water', emoji: '💧', completed: false },
    { id: '3', name: 'Meditate', emoji: '🧘', completed: false },
  ]}
  color="#8b5cf6"
/>
```

#### Examples:
```tsx
// Vertical stack
<div>
  <HabitCard habit={triggerHabit} />
  <StackConnector type="arrow" label="then" />
  <HabitCard habit={newHabit} />
</div>

// Horizontal flow
<div className="flex items-center">
  <HabitCard habit={habit1} />
  <StackConnector orientation="horizontal" type="flow" />
  <HabitCard habit={habit2} />
</div>

// Chain visualization
<StackConnector type="chain" size="lg" />
```

---

### 5. **SupportCircleBadge**

Badge for displaying support circle members, accountability partners, and social connections.

**Location:** `/components/ui/support-circle-badge.tsx`

#### Basic Usage:
```tsx
import { SupportCircleBadge } from './components/ui/support-circle-badge';

<SupportCircleBadge
  name="Sarah"
  avatar="👩"
  role="Accountability Partner"
  type="accountability"
  active={true}
  size="md"
/>
```

#### Props:
- `name` (string) - Member name
- `avatar` (string) - Avatar URL or emoji
- `role` (string) - Relationship/role
- `type` ('accountability' | 'encouragement' | 'community' | 'mentor')
- `active` (boolean) - Online/active status
- `size` ('sm' | 'md' | 'lg')
- `onClick` (function) - Click handler

#### Variants:

**SupportCircleAvatar** - Avatar-only minimal variant:
```tsx
<SupportCircleAvatar
  name="Alex"
  avatar="👨"
  active={true}
  size="md"
/>
```

**SupportCircleGroup** - Overlapping avatars group:
```tsx
<SupportCircleGroup
  members={[
    { id: '1', name: 'Sarah', avatar: '👩', active: true },
    { id: '2', name: 'Alex', avatar: '👨', active: false },
    { id: '3', name: 'Jordan', avatar: '🧑', active: true },
  ]}
  maxDisplay={5}
  onMemberClick={(id) => viewProfile(id)}
/>
```

**SupportCircleStats** - Statistics card:
```tsx
<SupportCircleStats
  totalMembers={12}
  activeMembers={5}
  encouragementCount={47}
/>
```

#### Examples:
```tsx
// Accountability partner
<SupportCircleBadge
  name="Jamie"
  avatar="👤"
  role="Morning Routine Buddy"
  type="accountability"
  active={true}
/>

// Mentor badge
<SupportCircleBadge
  name="Dr. Chen"
  type="mentor"
  role="Habit Coach"
  active={false}
/>

// Avatar group
<SupportCircleGroup
  members={supportCircle}
  maxDisplay={3}
/>
```

---

## 🎨 **Design Principles**

### Color System
All components follow FlowState's design philosophy:
- **Soft, pastel backgrounds** for reduced eye strain
- **Distinct borders** for clarity without harshness
- **Dark, readable text** on light backgrounds
- **Consistent accent colors** tied to meaning

### Accessibility
- **High contrast ratios** (WCAG AA compliant)
- **Large tap areas** (minimum 44x44px)
- **Clear visual hierarchy**
- **Semantic color use** (green = positive, red = negative)

### Animations
- **Gentle spring animations** for organic feel
- **Staggered delays** for sequential reveals
- **Reduced motion support** via prefers-reduced-motion
- **Meaningful motion** that guides attention

---

## 📊 **Integration Examples**

### Mood Tracking Dashboard
```tsx
<div className="space-y-4">
  <MomentumRing
    progress={calculateDailyProgress()}
    label="Today's Momentum"
    color="var(--mood-good-accent)"
  />
  
  <LifeAreaChipGroup
    selected={activeAreas}
    onChange={setActiveAreas}
  />
  
  <CorrelationCard
    from={{ label: 'Sleep Quality', emoji: '😴' }}
    to={{ label: 'Energy Level', emoji: '⚡' }}
    strength={89}
    direction="positive"
    insight="Quality sleep boosts your energy"
  />
</div>
```

### Habit Stacking Builder
```tsx
<HabitStackVisualizer
  habits={habitStack}
  color={themeColors.primary}
/>

<StackConnector type="arrow" label="triggers" />

<div className="mt-4">
  <LifeAreaChip area="health" selected={true} />
  <LifeAreaChip area="personal" selected={true} />
</div>
```

### Support Circle View
```tsx
<SupportCircleStats
  totalMembers={8}
  activeMembers={3}
  encouragementCount={24}
/>

<div className="mt-4">
  {supportMembers.map(member => (
    <SupportCircleBadge
      key={member.id}
      {...member}
      onClick={() => viewProfile(member.id)}
    />
  ))}
</div>

<SupportCircleGroup
  members={supportMembers}
  maxDisplay={5}
/>
```

---

## 🔧 **Customization**

### Theme Colors
All components accept custom colors via props:
```tsx
<MomentumRing color={themeColors.primary} />
<LifeAreaChip area="health" /> // Uses design token
<StackConnector color="#custom-color" />
```

### Sizes
Consistent size variants across components:
```tsx
<LifeAreaChip size="sm" />
<LifeAreaChip size="md" /> // default
<LifeAreaChip size="lg" />
```

### Custom Styling
All components accept `className` prop:
```tsx
<MomentumRing className="my-4 shadow-lg" />
<CorrelationCard className="hover:scale-105" />
```

---

## 📱 **Responsive Design**

All components are mobile-first and responsive:
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** tap targets (44x44px minimum)
- **Readable text** at all viewport sizes
- **Appropriate spacing** for small screens

---

## ♿ **Accessibility Features**

- **Semantic HTML** for screen readers
- **ARIA labels** where needed
- **Keyboard navigation** support
- **Focus indicators** on interactive elements
- **Color contrast** meets WCAG AA standards
- **Motion reduction** respected

---

## 🧪 **Testing Checklist**

When using these components:
- [ ] Test with different data values
- [ ] Verify animations with reduced motion
- [ ] Check keyboard navigation
- [ ] Test on mobile devices
- [ ] Verify color contrast in dark mode
- [ ] Test with screen readers
- [ ] Validate responsive breakpoints

---

## 📚 **Component Files**

| Component | File Path | Export Name |
|-----------|-----------|-------------|
| MomentumRing | `/components/ui/momentum-ring.tsx` | `MomentumRing`, `MomentumRingMini` |
| LifeAreaChip | `/components/ui/life-area-chip.tsx` | `LifeAreaChip`, `LifeAreaChipGroup`, `LifeAreaBadge` |
| CorrelationCard | `/components/ui/correlation-card.tsx` | `CorrelationCard`, `CorrelationCardCompact`, `CorrelationInsightsList` |
| StackConnector | `/components/ui/stack-connector.tsx` | `StackConnector`, `StackConnectorDotted`, `StackConnectorFlow`, `HabitStackVisualizer` |
| SupportCircleBadge | `/components/ui/support-circle-badge.tsx` | `SupportCircleBadge`, `SupportCircleAvatar`, `SupportCircleGroup`, `SupportCircleStats` |

---

## 🎯 **Best Practices**

### Do's ✅
- Use design tokens for consistent theming
- Provide meaningful labels and context
- Test with real user data
- Respect user motion preferences
- Maintain visual hierarchy

### Don'ts ❌
- Don't hardcode colors (use tokens)
- Don't ignore accessibility
- Don't over-animate
- Don't hide important info on mobile
- Don't forget loading states

---

## 🔮 **Future Enhancements**

Potential additions to the design system:
- Dark mode variants for all tokens
- Additional life area categories
- Custom mood states
- Animation configuration
- Theme builder UI
- Component playground

---

**Version:** 1.0.0  
**Last Updated:** October 18, 2025  
**Maintained by:** FlowState Design Team
