interface AdaptiveBackground {
  gradientFrom: string;
  gradientTo: string;
  opacity: number;
}

export function getAdaptiveBackground(): AdaptiveBackground {
  const hour = new Date().getHours();
  
  // Early Morning (5-7 AM) - Soft sunrise colors
  if (hour >= 5 && hour < 7) {
    return {
      gradientFrom: '#FEF3C7', // Soft yellow
      gradientTo: '#FBCFE8',   // Soft pink
      opacity: 0.6
    };
  }
  
  // Morning (7-12 PM) - Bright, energizing
  if (hour >= 7 && hour < 12) {
    return {
      gradientFrom: '#FEF3C7', // Light yellow
      gradientTo: '#DBEAFE',   // Light blue
      opacity: 0.7
    };
  }
  
  // Afternoon (12-5 PM) - Warm and stable
  if (hour >= 12 && hour < 17) {
    return {
      gradientFrom: '#FED7AA', // Warm peach
      gradientTo: '#BFDBFE',   // Light sky blue
      opacity: 0.7
    };
  }
  
  // Evening (5-9 PM) - Sunset colors
  if (hour >= 17 && hour < 21) {
    return {
      gradientFrom: '#FBCFE8', // Soft pink
      gradientTo: '#DDD6FE',   // Soft lavender
      opacity: 0.8
    };
  }
  
  // Night (9 PM - 5 AM) - Deep, restful
  return {
    gradientFrom: '#C7D2FE', // Deeper lavender
    gradientTo: '#E0E7FF',   // Light indigo
    opacity: 0.9
  };
}

export function getMoonPhaseBackground(phase: string): AdaptiveBackground {
  switch (phase) {
    case 'new':
      return {
        gradientFrom: '#1E1B4B', // Deep indigo
        gradientTo: '#312E81',   // Dark purple
        opacity: 0.3
      };
    case 'full':
      return {
        gradientFrom: '#EDE9FE', // Light lavender
        gradientTo: '#FEF3C7',   // Soft yellow
        opacity: 0.8
      };
    case 'waxing-crescent':
    case 'waxing-gibbous':
      return {
        gradientFrom: '#DBEAFE', // Light blue
        gradientTo: '#EDE9FE',   // Light lavender
        opacity: 0.7
      };
    case 'waning-crescent':
    case 'waning-gibbous':
      return {
        gradientFrom: '#E0E7FF', // Soft indigo
        gradientTo: '#DDD6FE',   // Soft lavender
        opacity: 0.7
      };
    default:
      return {
        gradientFrom: '#F3E8FF', // Light purple
        gradientTo: '#E0E7FF',   // Light indigo
        opacity: 0.7
      };
  }
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}
