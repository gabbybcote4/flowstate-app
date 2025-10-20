# FlowState Navigation Animation System

## Overview
A comprehensive, calm, and migraine-friendly navigation system with smooth micro-animations, blur overlays, and gentle transitions.

## Components

### 1. **NavigationTransition.tsx**
Main screen transition wrapper with three animation modes:
- `up`: Slide up with fade (default)
- `down`: Slide down with fade
- `fade`: Pure fade transition

**Timing**: 400ms entrance, 300ms exit
**Easing**: Custom cubic-bezier for smooth, natural motion

### 2. **ScreenBlurOverlay.tsx**
Subtle blur effect during screen transitions
- 8px backdrop blur
- 30% white overlay
- Migraine-friendly opacity levels

### 3. **ScreenTransitionLoader.tsx**
Top progress bar with shimmer effect
- Gradient color matching theme
- Smooth scaleX animation
- Shimmer effect for visual feedback

### 4. **AnimatedBottomNav.tsx**
Enhanced bottom navigation with:
- Spring-based tab switching
- Shared layout animations (layoutId)
- Tap feedback with scale
- Ripple effect on active tab
- Staggered entrance animations
- Floating active indicator

### 5. **AnimatedMoreMenu.tsx**
Full-screen "More" menu with:
- Spring-based slide up entrance
- Staggered category/item animations
- Hover effects on items
- Active state pulse animation
- Smooth backdrop blur

### 6. **ScrollToTop.tsx**
Auto-scroll to top on screen change with smooth behavior

### 7. **FadeInView.tsx**
Reusable component for content entrance
- Directional entrance (up/down/left/right)
- Configurable delay and duration
- Consistent easing

### 8. **TapFeedback.tsx**
Reusable tap/press feedback wrapper
- Spring-based scale animation
- Configurable scale amount
- Disability support

### 9. **StaggeredList.tsx**
List items with staggered entrance
- Configurable stagger delay
- Opacity + Y + Scale animation
- Perfect for todo lists, menus, etc.

## Animation Philosophy

### Timing
- **Fast interactions**: 200-300ms (taps, hovers)
- **Screen transitions**: 400ms entrance, 300ms exit
- **Menu animations**: 500ms with spring physics

### Easing
- **Primary**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` - Smooth, natural
- **Springs**: Stiffness 300-400, Damping 25-30

### Design Principles
1. **Calm & Gentle**: No jarring movements
2. **Migraine-Friendly**: Reduced motion support, gentle blur levels
3. **Responsive**: Spring physics for natural feel
4. **Purposeful**: Each animation communicates state/hierarchy
5. **Accessible**: Respects `prefers-reduced-motion`

## Usage Examples

### Basic Screen Transition
```tsx
<NavigationTransition screenKey={currentScreen} direction="up">
  <MyScreen />
</NavigationTransition>
```

### Staggered List
```tsx
<StaggeredList staggerDelay={0.05}>
  {items.map(item => (
    <TodoCard key={item.id} {...item} />
  ))}
</StaggeredList>
```

### Tap Feedback
```tsx
<TapFeedback scale={0.95} onClick={handleClick}>
  <Button>Click Me</Button>
</TapFeedback>
```

### Fade In Content
```tsx
<FadeInView delay={0.2} direction="up">
  <WelcomeMessage />
</FadeInView>
```

## Accessibility

All animations respect `prefers-reduced-motion`:
- Animations reduced to near-instant (0.01ms)
- Scroll behavior becomes instant
- Maintained in `globals.css`

## Performance

- Uses GPU-accelerated properties (transform, opacity)
- Leverages Motion's optimized renderer
- Minimal repaints during transitions
- Smooth 60fps on modern devices

## Theme Integration

All animated components use theme colors from `ThemeContext`:
- Progress bars use theme gradients
- Active states use primary colors
- Overlays respect theme opacity

## Future Enhancements

- Haptic feedback on supported devices
- Sound effects (optional)
- Custom transitions per screen type
- Gesture-based navigation
