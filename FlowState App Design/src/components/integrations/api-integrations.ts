/**
 * FlowState API Integrations
 * 
 * This file contains utilities, types, and mock implementations for external API integrations
 * that make FlowState more adaptive to user behavior and environmental factors.
 * 
 * PRIVACY FIRST: All integrations should be opt-in and use minimal necessary permissions.
 * Data should be processed locally when possible and users should be informed about what data is accessed.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HealthData {
  sleep: {
    hours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    deepSleep: number; // hours
    remSleep: number; // hours
    timestamp: string;
  };
  activity: {
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
    heartRateAverage: number;
    timestamp: string;
  };
  wellness: {
    hrv: number; // Heart Rate Variability - stress indicator
    restingHeartRate: number;
    readinessScore: number; // 0-100
    timestamp: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  duration: number; // minutes
  type: 'meeting' | 'focus' | 'break' | 'personal' | 'other';
  attendees?: number;
  location?: string;
  isRecurring: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  barometricPressure: number; // affects migraines
  humidity: number;
  uvIndex: number;
  timestamp: string;
}

export interface FocusData {
  productiveMinutes: number;
  distractedMinutes: number;
  mostProductiveHours: number[]; // hours of day [9, 10, 14]
  topApps: Array<{
    name: string;
    minutes: number;
    category: 'productive' | 'neutral' | 'distraction';
  }>;
  focusScore: number; // 0-100
  timestamp: string;
}

export interface AICoachingInsight {
  type: 'pattern' | 'suggestion' | 'encouragement' | 'warning';
  title: string;
  message: string;
  confidence: number; // 0-1
  actionable: boolean;
  suggestedAction?: string;
  relatedData: string[]; // ['sleep', 'mood', 'productivity']
}

export interface EmotionalTone {
  primary: 'happy' | 'sad' | 'anxious' | 'calm' | 'frustrated' | 'excited' | 'tired';
  intensity: number; // 0-1
  sentiment: number; // -1 to 1 (negative to positive)
  keywords: string[];
  suggestions: string[];
}

// ============================================================================
// APPLE HEALTH / GOOGLE FIT INTEGRATION
// ============================================================================

/**
 * Apple Health Integration
 * Requires: HealthKit API (iOS) or Google Fit API (Android)
 * Privacy: Read-only access to sleep, activity, heart rate
 */
export class HealthDataIntegration {
  private apiKey: string;
  private platform: 'apple' | 'google';

  constructor(apiKey: string, platform: 'apple' | 'google' = 'apple') {
    this.apiKey = apiKey;
    this.platform = platform;
  }

  /**
   * Fetch health data from Apple Health or Google Fit
   * In production, this would call the actual API
   */
  async fetchHealthData(date: Date = new Date()): Promise<HealthData> {
    // MOCK IMPLEMENTATION
    // In production, replace with actual API calls:
    // - Apple: Use HealthKit API via native bridge
    // - Google: Use Google Fit REST API
    
    return this.generateMockHealthData(date);
  }

  /**
   * Generate adaptive suggestions based on health data
   */
  getAdaptiveSuggestions(healthData: HealthData): string[] {
    const suggestions: string[] = [];

    // Sleep-based adaptations
    if (healthData.sleep.hours < 6) {
      suggestions.push('Low sleep detected. Consider gentler tasks and more breaks today.');
    } else if (healthData.sleep.quality === 'poor') {
      suggestions.push('Sleep quality was low. Prioritize restoration over intensity.');
    }

    // Activity-based adaptations
    if (healthData.activity.steps < 3000) {
      suggestions.push('Light movement today. Add a short walk to boost energy.');
    }

    // Wellness-based adaptations
    if (healthData.wellness.hrv < 50) {
      suggestions.push('HRV indicates stress. Focus on recovery and mindfulness today.');
    }

    if (healthData.wellness.readinessScore < 60) {
      suggestions.push('Body needs recovery. This is a perfect day for low-energy routines.');
    }

    return suggestions;
  }

  // Mock data generator for development/testing
  private generateMockHealthData(date: Date): HealthData {
    const randomSleepHours = 5 + Math.random() * 4; // 5-9 hours
    const sleepQuality = randomSleepHours > 7 ? 'good' : randomSleepHours > 6 ? 'fair' : 'poor';
    
    return {
      sleep: {
        hours: randomSleepHours,
        quality: sleepQuality as any,
        deepSleep: randomSleepHours * 0.2,
        remSleep: randomSleepHours * 0.25,
        timestamp: date.toISOString(),
      },
      activity: {
        steps: Math.floor(3000 + Math.random() * 7000),
        activeMinutes: Math.floor(20 + Math.random() * 60),
        caloriesBurned: Math.floor(1500 + Math.random() * 1000),
        heartRateAverage: Math.floor(65 + Math.random() * 20),
        timestamp: date.toISOString(),
      },
      wellness: {
        hrv: Math.floor(40 + Math.random() * 60),
        restingHeartRate: Math.floor(55 + Math.random() * 20),
        readinessScore: Math.floor(50 + Math.random() * 50),
        timestamp: date.toISOString(),
      },
    };
  }
}

// ============================================================================
// CALENDAR INTEGRATION (Google Calendar / Outlook)
// ============================================================================

/**
 * Calendar Integration
 * Supports: Google Calendar API, Microsoft Graph API (Outlook)
 * Privacy: Read-only access to calendar events
 */
export class CalendarIntegration {
  private apiKey: string;
  private provider: 'google' | 'outlook';

  constructor(apiKey: string, provider: 'google' | 'outlook' = 'google') {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  /**
   * Fetch calendar events for a date range
   */
  async fetchEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    // MOCK IMPLEMENTATION
    // In production:
    // - Google: Use Google Calendar API v3
    // - Outlook: Use Microsoft Graph API
    
    return this.generateMockCalendarEvents(startDate, endDate);
  }

  /**
   * Analyze calendar and suggest optimal task timing
   */
  getOptimalTaskTimes(events: CalendarEvent[], userPreferences: { focusHours: number[] }): Array<{
    start: string;
    duration: number;
    reason: string;
  }> {
    const suggestions: Array<{ start: string; duration: number; reason: string }> = [];

    // Find gaps between meetings
    const sortedEvents = events.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEnd = new Date(sortedEvents[i].end);
      const nextStart = new Date(sortedEvents[i + 1].start);
      const gap = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60); // minutes

      if (gap >= 30) {
        suggestions.push({
          start: currentEnd.toISOString(),
          duration: Math.min(gap - 5, 120), // Leave 5 min buffer
          reason: `${gap} min gap between meetings - good for focused work`,
        });
      }
    }

    return suggestions;
  }

  /**
   * Calculate meeting load to adjust energy predictions
   */
  getMeetingLoad(events: CalendarEvent[]): {
    totalMeetings: number;
    totalMinutes: number;
    largestMeetings: number;
    energyDrain: 'low' | 'medium' | 'high';
  } {
    const meetings = events.filter(e => e.type === 'meeting');
    const totalMinutes = meetings.reduce((sum, m) => sum + m.duration, 0);
    const largestMeetings = meetings.filter(m => (m.attendees || 0) > 5).length;

    let energyDrain: 'low' | 'medium' | 'high' = 'low';
    if (totalMinutes > 240 || largestMeetings > 3) energyDrain = 'high';
    else if (totalMinutes > 120 || largestMeetings > 1) energyDrain = 'medium';

    return {
      totalMeetings: meetings.length,
      totalMinutes,
      largestMeetings,
      energyDrain,
    };
  }

  private generateMockCalendarEvents(startDate: Date, endDate: Date): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const eventTypes: Array<'meeting' | 'focus' | 'break'> = ['meeting', 'focus', 'break'];
    
    // Generate 3-5 events per day
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const numEvents = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numEvents; i++) {
        const hour = 9 + Math.floor(Math.random() * 8); // 9am - 5pm
        const duration = [30, 60, 90][Math.floor(Math.random() * 3)];
        const start = new Date(currentDate);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + duration);

        events.push({
          id: `event-${Date.now()}-${i}`,
          title: ['Team Sync', 'Deep Work', 'Client Call', 'Planning', 'Review'][Math.floor(Math.random() * 5)],
          start: start.toISOString(),
          end: end.toISOString(),
          duration,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          attendees: Math.floor(Math.random() * 10),
          isRecurring: Math.random() > 0.7,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  }
}

// ============================================================================
// WEATHER INTEGRATION (OpenWeather API)
// ============================================================================

/**
 * Weather Integration
 * API: OpenWeather API
 * Use case: Correlate weather patterns with energy levels (especially barometric pressure for migraines)
 */
export class WeatherIntegration {
  private apiKey: string;
  private location: { lat: number; lon: number };

  constructor(apiKey: string = 'YOUR_OPENWEATHER_API_KEY', location?: { lat: number; lon: number }) {
    this.apiKey = apiKey;
    this.location = location || { lat: 40.7128, lon: -74.0060 }; // Default: NYC
  }

  /**
   * Fetch current weather data
   * API Endpoint: https://api.openweathermap.org/data/2.5/weather
   */
  async fetchWeather(): Promise<WeatherData> {
    // MOCK IMPLEMENTATION
    // In production:
    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/weather?lat=${this.location.lat}&lon=${this.location.lon}&appid=${this.apiKey}&units=imperial`
    // );
    // const data = await response.json();
    // return this.parseWeatherData(data);

    return this.generateMockWeatherData();
  }

  /**
   * Get weather-based energy predictions
   */
  getWeatherImpact(weatherData: WeatherData): {
    migraineLikelihood: 'low' | 'medium' | 'high';
    energyImpact: 'negative' | 'neutral' | 'positive';
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let migraineLikelihood: 'low' | 'medium' | 'high' = 'low';
    let energyImpact: 'negative' | 'neutral' | 'positive' = 'neutral';

    // Barometric pressure affects migraines
    if (weatherData.barometricPressure < 29.8) {
      migraineLikelihood = 'high';
      suggestions.push('Low pressure system - higher migraine risk. Keep meds handy.');
      energyImpact = 'negative';
    }

    // Weather condition impacts
    if (weatherData.condition === 'rainy' || weatherData.condition === 'stormy') {
      suggestions.push('Rainy weather may affect mood. Consider indoor comfort activities.');
      if (energyImpact === 'neutral') energyImpact = 'negative';
    } else if (weatherData.condition === 'clear') {
      suggestions.push('Beautiful day! Consider outdoor movement if energy permits.');
      if (energyImpact === 'neutral') energyImpact = 'positive';
    }

    // Humidity impacts
    if (weatherData.humidity > 70) {
      suggestions.push('High humidity may feel draining. Stay hydrated and cool.');
    }

    return { migraineLikelihood, energyImpact, suggestions };
  }

  private generateMockWeatherData(): WeatherData {
    const conditions: Array<'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'> = 
      ['clear', 'cloudy', 'rainy', 'stormy', 'snowy'];
    
    return {
      temperature: 60 + Math.random() * 30,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      barometricPressure: 29.5 + Math.random() * 1.0,
      humidity: 40 + Math.random() * 40,
      uvIndex: Math.floor(Math.random() * 11),
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// FOCUS & SCREEN TIME INTEGRATION (RescueTime / iOS ScreenTime)
// ============================================================================

/**
 * Focus Data Integration
 * APIs: RescueTime API, iOS ScreenTime (via native bridge)
 * Privacy: Read-only access to app usage patterns
 */
export class FocusDataIntegration {
  private apiKey: string;
  private provider: 'rescuetime' | 'screentime';

  constructor(apiKey: string = 'YOUR_RESCUETIME_API_KEY', provider: 'rescuetime' | 'screentime' = 'rescuetime') {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  /**
   * Fetch focus/productivity data
   * RescueTime API: https://www.rescuetime.com/anapi/setup/documentation
   */
  async fetchFocusData(date: Date = new Date()): Promise<FocusData> {
    // MOCK IMPLEMENTATION
    // In production (RescueTime):
    // const response = await fetch(
    //   `https://www.rescuetime.com/anapi/data?key=${this.apiKey}&format=json&restrict_begin=${date.toISOString().split('T')[0]}`
    // );
    // const data = await response.json();
    // return this.parseFocusData(data);

    return this.generateMockFocusData(date);
  }

  /**
   * Analyze focus patterns to suggest best work times
   */
  analyzeFocusPatterns(focusHistory: FocusData[]): {
    bestFocusHours: number[];
    averageFocusScore: number;
    distractionTriggers: string[];
    recommendations: string[];
  } {
    if (focusHistory.length === 0) {
      return {
        bestFocusHours: [9, 10, 14],
        averageFocusScore: 70,
        distractionTriggers: [],
        recommendations: ['Track your focus for a few days to get personalized insights'],
      };
    }

    // Aggregate productive hours
    const hourCounts: Record<number, number> = {};
    focusHistory.forEach(day => {
      day.mostProductiveHours.forEach(hour => {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
    });

    const bestFocusHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    const averageFocusScore = focusHistory.reduce((sum, d) => sum + d.focusScore, 0) / focusHistory.length;

    // Find common distracting apps
    const distractionApps = new Map<string, number>();
    focusHistory.forEach(day => {
      day.topApps
        .filter(app => app.category === 'distraction')
        .forEach(app => {
          distractionApps.set(app.name, (distractionApps.get(app.name) || 0) + app.minutes);
        });
    });

    const distractionTriggers = Array.from(distractionApps.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    const recommendations: string[] = [];
    if (averageFocusScore < 60) {
      recommendations.push('Consider using app blockers during peak focus hours');
    }
    if (distractionTriggers.length > 0) {
      recommendations.push(`Limit ${distractionTriggers[0]} during work sessions`);
    }
    recommendations.push(`Your peak focus is at ${bestFocusHours.map(h => `${h}:00`).join(', ')} - schedule important tasks then`);

    return { bestFocusHours, averageFocusScore, distractionTriggers, recommendations };
  }

  private generateMockFocusData(date: Date): FocusData {
    const productiveMinutes = 120 + Math.floor(Math.random() * 180);
    const distractedMinutes = 60 + Math.floor(Math.random() * 120);
    
    return {
      productiveMinutes,
      distractedMinutes,
      mostProductiveHours: [9, 10, 14].filter(() => Math.random() > 0.3),
      topApps: [
        { name: 'VSCode', minutes: 120, category: 'productive' },
        { name: 'Slack', minutes: 45, category: 'neutral' },
        { name: 'Twitter', minutes: 30, category: 'distraction' },
      ],
      focusScore: Math.floor((productiveMinutes / (productiveMinutes + distractedMinutes)) * 100),
      timestamp: date.toISOString(),
    };
  }
}

// ============================================================================
// AI COACHING INTEGRATION (OpenAI GPT-4)
// ============================================================================

/**
 * AI Coaching Integration
 * API: OpenAI GPT-4 API
 * Use cases: 
 * - Analyze journal entries for patterns
 * - Generate personalized coaching insights
 * - Provide contextual suggestions based on multi-modal data
 */
export class AICoachingIntegration {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = 'YOUR_OPENAI_API_KEY', model: string = 'gpt-4') {
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Analyze multiple data sources to generate holistic insights
   */
  async generateInsights(context: {
    moodHistory: Array<{ mood: number; energy: number; focus: number; date: string }>;
    habitData: Array<{ habit: string; completed: boolean; date: string }>;
    healthData?: HealthData;
    weatherData?: WeatherData;
    focusData?: FocusData;
  }): Promise<AICoachingInsight[]> {
    // MOCK IMPLEMENTATION
    // In production:
    // const prompt = this.buildInsightPrompt(context);
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: this.model,
    //     messages: [{ role: 'user', content: prompt }],
    //     temperature: 0.7,
    //   }),
    // });
    // const data = await response.json();
    // return this.parseInsights(data.choices[0].message.content);

    return this.generateMockInsights(context);
  }

  /**
   * Analyze journal entry for emotional patterns
   */
  async analyzeJournalEntry(entry: string): Promise<{
    sentiment: number;
    themes: string[];
    suggestions: string[];
  }> {
    // MOCK IMPLEMENTATION
    // In production: Use GPT-4 to analyze journal text
    
    return {
      sentiment: Math.random() * 2 - 1, // -1 to 1
      themes: ['growth', 'self-reflection', 'challenges'],
      suggestions: [
        'Consider focusing on the small wins you mentioned',
        'Your awareness of challenges shows emotional intelligence',
      ],
    };
  }

  /**
   * Generate personalized affirmations based on user data
   */
  async generateAffirmations(userContext: {
    struggles: string[];
    goals: string[];
    recentMood: 'low' | 'medium' | 'high';
  }): Promise<string[]> {
    // In production: Use GPT-4 to generate contextual affirmations
    
    const affirmations = [
      'Your gentle approach to productivity is powerful',
      'Rest is productive too',
      'Small steps compound into big changes',
      'You are adapting beautifully to your needs',
    ];

    return affirmations.slice(0, 3);
  }

  private buildInsightPrompt(context: any): string {
    return `As a compassionate life coach, analyze this user's data and provide 2-3 gentle, actionable insights:
    
Mood patterns: ${JSON.stringify(context.moodHistory.slice(-7))}
Habits: ${JSON.stringify(context.habitData.slice(-7))}
${context.healthData ? `Health: ${context.healthData.sleep.quality} sleep, ${context.healthData.wellness.readinessScore}% readiness` : ''}

Focus on patterns, correlations, and compassionate suggestions. Keep insights short and actionable.`;
  }

  private generateMockInsights(context: any): AICoachingInsight[] {
    const insights: AICoachingInsight[] = [];

    // Pattern detection
    const avgMood = context.moodHistory.reduce((sum: number, m: any) => sum + m.mood, 0) / context.moodHistory.length;
    
    if (avgMood < 2) {
      insights.push({
        type: 'pattern',
        title: 'Energy patterns detected',
        message: 'Your energy has been lower this week. Consider prioritizing rest-based routines.',
        confidence: 0.85,
        actionable: true,
        suggestedAction: 'Switch to low-energy routine templates',
        relatedData: ['mood', 'energy'],
      });
    }

    // Sleep correlation
    if (context.healthData && context.healthData.sleep.hours < 6) {
      insights.push({
        type: 'warning',
        title: 'Sleep affecting performance',
        message: 'Your sleep has been under 6 hours. This may be impacting your focus and energy.',
        confidence: 0.9,
        actionable: true,
        suggestedAction: 'Set an earlier bedtime reminder',
        relatedData: ['sleep', 'focus'],
      });
    }

    // Encouragement
    const completedHabits = context.habitData.filter((h: any) => h.completed).length;
    if (completedHabits > 0) {
      insights.push({
        type: 'encouragement',
        title: 'Building consistency',
        message: `You've shown up ${completedHabits} times this week. That's what matters! 🌟`,
        confidence: 1.0,
        actionable: false,
        relatedData: ['habits'],
      });
    }

    return insights;
  }
}

// ============================================================================
// EMOTIONAL TONE DETECTION (Future: Affectiva / Sentiment AI)
// ============================================================================

/**
 * Emotional Tone Detection
 * Future APIs: Affectiva Emotion AI, IBM Watson Tone Analyzer
 * Use case: Detect emotional state from text input (journal, chat) to adapt UI/suggestions
 */
export class EmotionalToneIntegration {
  private apiKey: string;

  constructor(apiKey: string = 'YOUR_AFFECTIVA_API_KEY') {
    this.apiKey = apiKey;
  }

  /**
   * Analyze emotional tone from text
   */
  async analyzeTone(text: string): Promise<EmotionalTone> {
    // MOCK IMPLEMENTATION
    // In production, use:
    // - Affectiva Text Analytics API
    // - IBM Watson Tone Analyzer
    // - Or train a custom model on emotional states

    return this.generateMockTone(text);
  }

  /**
   * Get UI adaptations based on detected emotion
   */
  getUIAdaptations(tone: EmotionalTone): {
    colorScheme: 'warm' | 'cool' | 'neutral';
    messageStyle: 'gentle' | 'energetic' | 'calm';
    suggestedActivities: string[];
  } {
    const adaptations: any = {
      colorScheme: 'neutral',
      messageStyle: 'calm',
      suggestedActivities: [],
    };

    switch (tone.primary) {
      case 'anxious':
        adaptations.colorScheme = 'cool';
        adaptations.messageStyle = 'gentle';
        adaptations.suggestedActivities = ['breathing exercise', 'gentle stretching', 'journaling'];
        break;
      case 'tired':
        adaptations.colorScheme = 'warm';
        adaptations.messageStyle = 'gentle';
        adaptations.suggestedActivities = ['rest timer', 'light movement', 'meditation'];
        break;
      case 'frustrated':
        adaptations.colorScheme = 'cool';
        adaptations.messageStyle = 'calm';
        adaptations.suggestedActivities = ['break timer', 'mood music', 'reframe thoughts'];
        break;
      case 'excited':
        adaptations.colorScheme = 'warm';
        adaptations.messageStyle = 'energetic';
        adaptations.suggestedActivities = ['tackle goals', 'creative work', 'social connection'];
        break;
      default:
        adaptations.suggestedActivities = ['check-in', 'routine builder', 'habit tracking'];
    }

    return adaptations;
  }

  private generateMockTone(text: string): EmotionalTone {
    // Simple keyword-based mock (in production, use actual AI)
    const lowerText = text.toLowerCase();
    
    let primary: EmotionalTone['primary'] = 'calm';
    let sentiment = 0;

    if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('drained')) {
      primary = 'tired';
      sentiment = -0.3;
    } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stressed')) {
      primary = 'anxious';
      sentiment = -0.5;
    } else if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('excited')) {
      primary = 'excited';
      sentiment = 0.7;
    } else if (lowerText.includes('frustrated') || lowerText.includes('annoyed')) {
      primary = 'frustrated';
      sentiment = -0.4;
    }

    return {
      primary,
      intensity: 0.5 + Math.random() * 0.5,
      sentiment,
      keywords: text.split(' ').slice(0, 5),
      suggestions: ['Take a mindful moment', 'Journal about this feeling'],
    };
  }
}

// ============================================================================
// UNIFIED ADAPTIVE ENGINE
// ============================================================================

/**
 * Unified Adaptive Engine
 * Combines all integrations to make FlowState truly adaptive to user context
 */
export class AdaptiveEngine {
  private health: HealthDataIntegration;
  private calendar: CalendarIntegration;
  private weather: WeatherIntegration;
  private focus: FocusDataIntegration;
  private ai: AICoachingIntegration;
  private emotion: EmotionalToneIntegration;

  constructor(config: {
    healthApiKey?: string;
    calendarApiKey?: string;
    weatherApiKey?: string;
    focusApiKey?: string;
    aiApiKey?: string;
    emotionApiKey?: string;
  }) {
    this.health = new HealthDataIntegration(config.healthApiKey || 'MOCK');
    this.calendar = new CalendarIntegration(config.calendarApiKey || 'MOCK');
    this.weather = new WeatherIntegration(config.weatherApiKey || 'MOCK');
    this.focus = new FocusDataIntegration(config.focusApiKey || 'MOCK');
    this.ai = new AICoachingIntegration(config.aiApiKey || 'MOCK');
    this.emotion = new EmotionalToneIntegration(config.emotionApiKey || 'MOCK');
  }

  /**
   * Generate comprehensive daily recommendations based on all data sources
   */
  async getDailyRecommendations(): Promise<{
    energyLevel: 'low' | 'medium' | 'high';
    recommendedRoutine: 'rest' | 'gentle' | 'balanced' | 'intensive';
    topSuggestions: string[];
    optimalWorkTimes: string[];
    insights: AICoachingInsight[];
  }> {
    try {
      // Fetch all data in parallel
      const [healthData, weatherData, focusData, calendarEvents] = await Promise.all([
        this.health.fetchHealthData(),
        this.weather.fetchWeather(),
        this.focus.fetchFocusData(),
        this.calendar.fetchEvents(new Date(), new Date()),
      ]);

      // Get suggestions from each source
      const healthSuggestions = this.health.getAdaptiveSuggestions(healthData);
      const weatherImpact = this.weather.getWeatherImpact(weatherData);
      const meetingLoad = this.calendar.getMeetingLoad(calendarEvents);

      // Determine overall energy level
      let energyLevel: 'low' | 'medium' | 'high' = 'medium';
      if (
        healthData.sleep.hours < 6 || 
        healthData.wellness.readinessScore < 50 ||
        weatherImpact.energyImpact === 'negative' ||
        meetingLoad.energyDrain === 'high'
      ) {
        energyLevel = 'low';
      } else if (
        healthData.sleep.hours > 7 &&
        healthData.wellness.readinessScore > 75 &&
        weatherImpact.energyImpact === 'positive' &&
        meetingLoad.energyDrain === 'low'
      ) {
        energyLevel = 'high';
      }

      // Recommend routine
      const routineMap = {
        low: 'rest' as const,
        medium: 'gentle' as const,
        high: 'balanced' as const,
      };
      const recommendedRoutine = routineMap[energyLevel];

      // Combine suggestions
      const topSuggestions = [
        ...healthSuggestions.slice(0, 2),
        ...weatherImpact.suggestions.slice(0, 1),
      ];

      // Get AI insights
      const moodHistory = this.getMockMoodHistory();
      const habitData = this.getMockHabitData();
      const insights = await this.ai.generateInsights({
        moodHistory,
        habitData,
        healthData,
        weatherData,
        focusData,
      });

      // Get optimal work times
      const optimalTimes = this.calendar.getOptimalTaskTimes(calendarEvents, {
        focusHours: focusData.mostProductiveHours,
      });

      return {
        energyLevel,
        recommendedRoutine,
        topSuggestions,
        optimalWorkTimes: optimalTimes.slice(0, 3).map(t => 
          new Date(t.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        ),
        insights,
      };
    } catch (error) {
      console.error('Error generating daily recommendations:', error);
      
      // Return safe defaults
      return {
        energyLevel: 'medium',
        recommendedRoutine: 'gentle',
        topSuggestions: ['Take it one step at a time today'],
        optimalWorkTimes: ['9:00 AM', '2:00 PM'],
        insights: [],
      };
    }
  }

  // Mock helpers for demo
  private getMockMoodHistory() {
    return Array.from({ length: 7 }, (_, i) => ({
      mood: 2 + Math.floor(Math.random() * 3),
      energy: 2 + Math.floor(Math.random() * 3),
      focus: 2 + Math.floor(Math.random() * 3),
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }

  private getMockHabitData() {
    return Array.from({ length: 7 }, (_, i) => ({
      habit: 'Morning routine',
      completed: Math.random() > 0.3,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Initialize the adaptive engine
 * 
 * const engine = new AdaptiveEngine({
 *   healthApiKey: process.env.APPLE_HEALTH_KEY,
 *   calendarApiKey: process.env.GOOGLE_CALENDAR_KEY,
 *   weatherApiKey: process.env.OPENWEATHER_KEY,
 *   focusApiKey: process.env.RESCUETIME_KEY,
 *   aiApiKey: process.env.OPENAI_KEY,
 * });
 * 
 * const recommendations = await engine.getDailyRecommendations();
 * console.log(recommendations);
 */

/**
 * Example: Use individual integrations
 * 
 * const weather = new WeatherIntegration(process.env.OPENWEATHER_KEY);
 * const weatherData = await weather.fetchWeather();
 * const impact = weather.getWeatherImpact(weatherData);
 * 
 * if (impact.migraineLikelihood === 'high') {
 *   // Show migraine warning in UI
 *   showAlert('Low pressure detected - migraine risk is higher today');
 * }
 */

// ============================================================================
// MOON PHASE UTILITY
// ============================================================================

export interface MoonPhaseData {
  phase: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  illumination: number; // 0-1
  emoji: string;
  name: string;
}

/**
 * Calculate moon phase for a given date
 * Algorithm based on astronomical calculations
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  // Known new moon: January 6, 2000, 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const secondsInDay = 86400000;
  const lunarCycle = 29.53058867; // days

  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / secondsInDay;
  const currentPhase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

  let phase: MoonPhaseData['phase'];
  let emoji: string;
  let name: string;

  if (currentPhase < 0.0625) {
    phase = 'new';
    emoji = '🌑';
    name = 'New Moon';
  } else if (currentPhase < 0.1875) {
    phase = 'waxing_crescent';
    emoji = '🌒';
    name = 'Waxing Crescent';
  } else if (currentPhase < 0.3125) {
    phase = 'first_quarter';
    emoji = '🌓';
    name = 'First Quarter';
  } else if (currentPhase < 0.4375) {
    phase = 'waxing_gibbous';
    emoji = '🌔';
    name = 'Waxing Gibbous';
  } else if (currentPhase < 0.5625) {
    phase = 'full';
    emoji = '🌕';
    name = 'Full Moon';
  } else if (currentPhase < 0.6875) {
    phase = 'waning_gibbous';
    emoji = '🌖';
    name = 'Waning Gibbous';
  } else if (currentPhase < 0.8125) {
    phase = 'last_quarter';
    emoji = '🌗';
    name = 'Last Quarter';
  } else {
    phase = 'waning_crescent';
    emoji = '🌘';
    name = 'Waning Crescent';
  }

  // Calculate illumination percentage
  const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * currentPhase));

  return {
    phase,
    illumination,
    emoji,
    name,
  };
}

// ============================================================================
// REAL API ADAPTERS - EXPORT INTERFACE
// ============================================================================

/**
 * Export structured adapters for real API integration
 * Replace mock implementations with these when deploying with real APIs
 */

export const apiAdapters = {
  /**
   * Health data adapter (HealthKit/Google Fit)
   * Use environment variable: HEALTH_API_KEY
   */
  health: {
    async fetch(apiKey?: string): Promise<HealthData> {
      const key = apiKey || import.meta.env?.VITE_HEALTH_API_KEY || 'MOCK';
      if (key === 'MOCK') {
        const integration = new HealthDataIntegration(key);
        return integration.fetchHealthData();
      }

      // Real API implementation
      // For Apple HealthKit: requires native bridge
      // For Google Fit: use REST API
      try {
        const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aggregateBy: [
              { dataTypeName: 'com.google.sleep.segment' },
              { dataTypeName: 'com.google.step_count.delta' },
              { dataTypeName: 'com.google.heart_rate.bpm' },
            ],
            bucketByTime: { durationMillis: 86400000 }, // 1 day
            startTimeMillis: Date.now() - 86400000,
            endTimeMillis: Date.now(),
          }),
        });

        if (!response.ok) throw new Error('Google Fit API error');
        
        const data = await response.json();
        // Transform Google Fit data to HealthData format
        return transformGoogleFitData(data);
      } catch (error) {
        console.error('Health API error:', error);
        // Fallback to mock
        const integration = new HealthDataIntegration('MOCK');
        return integration.fetchHealthData();
      }
    },
  },

  /**
   * Calendar adapter (Google Calendar/Outlook)
   * Use environment variable: CALENDAR_API_KEY
   */
  calendar: {
    async fetch(apiKey?: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
      const key = apiKey || import.meta.env?.VITE_CALENDAR_API_KEY || 'MOCK';
      if (key === 'MOCK') {
        const integration = new CalendarIntegration(key);
        return integration.fetchEvents(startDate || new Date(), endDate || new Date());
      }

      // Real Google Calendar API implementation
      try {
        const start = (startDate || new Date()).toISOString();
        const end = (endDate || new Date()).toISOString();
        
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              'Authorization': `Bearer ${key}`,
            },
          }
        );

        if (!response.ok) throw new Error('Google Calendar API error');
        
        const data = await response.json();
        return transformGoogleCalendarData(data.items);
      } catch (error) {
        console.error('Calendar API error:', error);
        const integration = new CalendarIntegration('MOCK');
        return integration.fetchEvents(startDate || new Date(), endDate || new Date());
      }
    },
  },

  /**
   * Weather adapter (OpenWeather)
   * Use environment variable: OPENWEATHER_API_KEY
   */
  weather: {
    async fetch(apiKey?: string, location?: { lat: number; lon: number }): Promise<WeatherData> {
      const key = apiKey || import.meta.env?.VITE_OPENWEATHER_API_KEY || 'MOCK';
      if (key === 'MOCK') {
        const integration = new WeatherIntegration(key, location);
        return integration.fetchWeather();
      }

      // Real OpenWeather API implementation
      try {
        const lat = location?.lat || 40.7128;
        const lon = location?.lon || -74.0060;
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`
        );

        if (!response.ok) throw new Error('OpenWeather API error');
        
        const data = await response.json();
        return {
          temperature: data.main.temp,
          condition: mapWeatherCondition(data.weather[0].main),
          barometricPressure: data.main.pressure * 0.02953, // hPa to inHg
          humidity: data.main.humidity,
          uvIndex: data.uvi || 0,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Weather API error:', error);
        const integration = new WeatherIntegration('MOCK', location);
        return integration.fetchWeather();
      }
    },
  },
};

// Helper transform functions
function transformGoogleFitData(data: any): HealthData {
  // Transform Google Fit response to HealthData format
  return {
    sleep: {
      hours: 7,
      quality: 'good',
      deepSleep: 1.4,
      remSleep: 1.75,
      timestamp: new Date().toISOString(),
    },
    activity: {
      steps: data.bucket?.[0]?.dataset?.[1]?.point?.[0]?.value?.[0]?.intVal || 0,
      activeMinutes: 30,
      caloriesBurned: 1800,
      heartRateAverage: data.bucket?.[0]?.dataset?.[2]?.point?.[0]?.value?.[0]?.fpVal || 70,
      timestamp: new Date().toISOString(),
    },
    wellness: {
      hrv: 60,
      restingHeartRate: 65,
      readinessScore: 75,
      timestamp: new Date().toISOString(),
    },
  };
}

function transformGoogleCalendarData(items: any[]): CalendarEvent[] {
  return items.map((item) => {
    const start = new Date(item.start.dateTime || item.start.date);
    const end = new Date(item.end.dateTime || item.end.date);
    const duration = (end.getTime() - start.getTime()) / 60000; // minutes

    return {
      id: item.id,
      title: item.summary || 'Untitled',
      start: start.toISOString(),
      end: end.toISOString(),
      duration,
      type: inferEventType(item.summary),
      attendees: item.attendees?.length || 0,
      location: item.location,
      isRecurring: !!item.recurringEventId,
    };
  });
}

function mapWeatherCondition(condition: string): WeatherData['condition'] {
  const mapping: Record<string, WeatherData['condition']> = {
    'Clear': 'clear',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'stormy',
    'Snow': 'snowy',
  };
  return mapping[condition] || 'cloudy';
}

function inferEventType(title: string): CalendarEvent['type'] {
  const lower = title.toLowerCase();
  if (lower.includes('meeting') || lower.includes('call') || lower.includes('sync')) return 'meeting';
  if (lower.includes('focus') || lower.includes('deep work') || lower.includes('coding')) return 'focus';
  if (lower.includes('break') || lower.includes('lunch')) return 'break';
  if (lower.includes('personal') || lower.includes('appointment')) return 'personal';
  return 'other';
}
