import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { 
  Brain,
  Heart,
  Calendar,
  Cloud,
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { 
  AdaptiveEngine, 
  type AICoachingInsight 
} from './api-integrations';

/**
 * Adaptive Recommendations Widget
 * 
 * Displays AI-powered recommendations based on multiple data sources:
 * - Health data (sleep, activity, HRV)
 * - Calendar events (meeting load)
 * - Weather conditions (barometric pressure, temperature)
 * - Focus patterns (productivity history)
 * 
 * This widget demonstrates how to integrate the adaptive engine into FlowState UI
 */
export function AdaptiveRecommendationsWidget() {
  const { themeColors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize adaptive engine with mock data for demo
      // In production, replace with actual API keys from environment variables
      const engine = new AdaptiveEngine({
        healthApiKey: 'MOCK_HEALTH_KEY',
        calendarApiKey: 'MOCK_CALENDAR_KEY',
        weatherApiKey: 'MOCK_WEATHER_KEY',
        focusApiKey: 'MOCK_FOCUS_KEY',
        aiApiKey: 'MOCK_AI_KEY',
      });

      const dailyRecs = await engine.getDailyRecommendations();
      setRecommendations(dailyRecs);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Unable to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 animate-pulse" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-1/2" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 text-orange-600">
          <AlertCircle size={20} />
          <p className="text-sm">Unable to generate recommendations right now</p>
        </div>
      </div>
    );
  }

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#3b82f6'; // blue
      case 'medium':
        return '#f59e0b'; // amber
      case 'high':
        return '#10b981'; // green
      default:
        return themeColors.primary;
    }
  };

  const getEnergyIcon = (level: string) => {
    switch (level) {
      case 'low':
        return '🌙';
      case 'medium':
        return '☀️';
      case 'high':
        return '⚡';
      default:
        return '✨';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return TrendingUp;
      case 'suggestion':
        return Sparkles;
      case 'encouragement':
        return Heart;
      case 'warning':
        return AlertCircle;
      default:
        return Brain;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="text-white">Today's Adaptive Plan</h3>
              <p className="text-xs text-white/80">Powered by AI + your data</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <ChevronRight 
              size={18} 
              className={`transition-transform ${showDetails ? 'rotate-90' : ''}`}
            />
          </button>
        </div>

        {/* Energy Level */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{getEnergyIcon(recommendations.energyLevel)}</span>
          <div>
            <div className="text-sm opacity-80">Predicted Energy</div>
            <div className="text-lg capitalize">{recommendations.energyLevel} Energy Day</div>
          </div>
        </div>

        {/* Recommended Routine */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="text-xs opacity-80 mb-1">Recommended Approach</div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30">
              {recommendations.recommendedRoutine} routine
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Suggestions */}
      <div className="p-6 space-y-4">
        {/* Top Suggestions */}
        <div>
          <div className="text-xs opacity-60 mb-3">Key Recommendations</div>
          <div className="space-y-2">
            {recommendations.topSuggestions.map((suggestion: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
              >
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <Sparkles size={14} style={{ color: themeColors.primary }} />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optimal Work Times */}
        {recommendations.optimalWorkTimes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="opacity-60" />
              <div className="text-xs opacity-60">Best Times for Focus Work</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.optimalWorkTimes.map((time: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="border-purple-200 bg-purple-50 text-purple-700"
                >
                  <Clock size={12} className="mr-1" />
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Insights (Expandable) */}
      <AnimatePresence>
        {showDetails && recommendations.insights.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="p-6 bg-gray-50 space-y-3">
              <div className="text-xs opacity-60 mb-3">AI Insights</div>
              {recommendations.insights.map((insight: AICoachingInsight, index: number) => {
                const InsightIcon = getInsightIcon(insight.type);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: `${getEnergyColor(recommendations.energyLevel)}20` 
                        }}
                      >
                        <InsightIcon 
                          size={16} 
                          style={{ color: getEnergyColor(recommendations.energyLevel) }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                        
                        {insight.suggestedAction && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                            <Zap size={12} className="text-purple-600" />
                            <span className="text-xs text-purple-600">
                              {insight.suggestedAction}
                            </span>
                          </div>
                        )}

                        {/* Related Data Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {insight.relatedData.map((data, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs capitalize bg-gray-50"
                            >
                              {data}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Sources Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart size={12} />
              <span>Health</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Calendar</span>
            </div>
            <div className="flex items-center gap-1">
              <Cloud size={12} />
              <span>Weather</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} />
              <span>Focus</span>
            </div>
          </div>
          <button
            onClick={loadRecommendations}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

// Missing import
import { Clock } from 'lucide-react';
