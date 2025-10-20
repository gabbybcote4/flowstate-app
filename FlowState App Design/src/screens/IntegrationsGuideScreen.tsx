// import { useState } from 'react';
// import { useTheme } from '../components/context/ThemeContext';
// import {
//   Code,
//   BookOpen,
//   ExternalLink,
//   CheckCircle2,
//   AlertCircle,
//   Shield,
//   Zap,
//   ChevronDown,
//   ChevronUp,
//   Copy,
//   Check
// } from 'lucide-react';
// //  from '../lib/motion-shim';
// import { Badge } from './ui/badge';
// import { toast } from 'sonner@2.0.3';

// interface APIGuide {
//   id: string;
//   name: string;
//   category: string;
//   difficulty: 'easy' | 'medium' | 'hard';
//   status: 'recommended' | 'optional' | 'future';
//   description: string;
//   useCase: string;
//   apiEndpoint: string;
//   documentation: string;
//   privacyNotes: string;
//   setupSteps: string[];
//   codeExample: string;
//   benefits: string[];
// }

// const API_GUIDES: APIGuide[] = [
//   {
//     id: 'apple-health',
//     name: 'Apple Health / HealthKit',
//     category: 'Health',
//     difficulty: 'medium',
//     status: 'recommended',
//     description: 'Access sleep, activity, heart rate, and wellness data',
//     useCase: 'Correlate energy levels with sleep quality, suggest rest-based routines on low sleep days',
//     apiEndpoint: 'HealthKit API (iOS native)',
//     documentation: 'https://developer.apple.com/documentation/healthkit',
//     privacyNotes: 'Read-only access. User must explicitly grant permissions for each data type.',
//     setupSteps: [
//       'Add HealthKit capability to Xcode project',
//       'Request specific permissions (sleep, heart rate, steps)',
//       'Create native bridge for React Native/Web',
//       'Query data using HKHealthStore',
//       'Parse and normalize data for FlowState'
//     ],
//     codeExample: `// Example: Fetching sleep data
// import { HealthDataIntegration } from './api-integrations';

// const healthAPI = new HealthDataIntegration('HEALTH_API_KEY', 'apple');
// const healthData = await healthAPI.fetchHealthData();

// if (healthData.sleep.hours < 6) {
//   // Suggest low-energy routine
//   suggestRoutine('rest');
// }`,
//     benefits: [
//       'Automatic energy level predictions',
//       'Migraine trigger detection via HRV',
//       'Activity-based habit suggestions',
//       'Sleep quality correlations'
//     ]
//   },
//   {
//     id: 'google-fit',
//     name: 'Google Fit',
//     category: 'Health',
//     difficulty: 'medium',
//     status: 'recommended',
//     description: 'Android equivalent for health and activity tracking',
//     useCase: 'Same as Apple Health but for Android users',
//     apiEndpoint: 'Google Fit REST API',
//     documentation: 'https://developers.google.com/fit',
//     privacyNotes: 'OAuth 2.0 authentication. Read-only scopes recommended.',
//     setupSteps: [
//       'Create project in Google Cloud Console',
//       'Enable Google Fit API',
//       'Set up OAuth 2.0 credentials',
//       'Request fitness.activity.read and fitness.sleep.read scopes',
//       'Use Fitness REST API to query data'
//     ],
//     codeExample: `// Example: Google Fit API call
// const response = await fetch(
//   'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
//   {
//     method: 'POST',
//     headers: {
//       'Authorization': \`Bearer \${accessToken}\`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       aggregateBy: [{ dataTypeName: 'com.google.sleep.segment' }],
//       bucketByTime: { durationMillis: 86400000 },
//       startTimeMillis: Date.now() - 86400000,
//       endTimeMillis: Date.now()
//     })
//   }
// );`,
//     benefits: [
//       'Cross-platform health data',
//       'Activity tracking for habit suggestions',
//       'Sleep analysis',
//       'Heart rate monitoring'
//     ]
//   },
//   {
//     id: 'google-calendar',
//     name: 'Google Calendar',
//     category: 'Productivity',
//     difficulty: 'easy',
//     status: 'recommended',
//     description: 'Sync calendar events to predict energy drain and suggest optimal task timing',
//     useCase: 'Detect heavy meeting days, find focus time gaps, adjust energy predictions',
//     apiEndpoint: 'Google Calendar API v3',
//     documentation: 'https://developers.google.com/calendar',
//     privacyNotes: 'Read-only calendar access. Can limit to specific calendars only.',
//     setupSteps: [
//       'Enable Google Calendar API in Console',
//       'Set up OAuth 2.0 with calendar.readonly scope',
//       'Use Calendar API to fetch events',
//       'Parse events and analyze meeting load',
//       'Suggest optimal focus times between meetings'
//     ],
//     codeExample: `// Example: Fetch and analyze calendar
// import { CalendarIntegration } from './api-integrations';

// const calendar = new CalendarIntegration(API_KEY, 'google');
// const events = await calendar.fetchEvents(new Date(), new Date());
// const load = calendar.getMeetingLoad(events);

// if (load.energyDrain === 'high') {
//   toast.info('Heavy meeting day - schedule breaks between sessions');
// }`,
//     benefits: [
//       'Automatic focus time detection',
//       'Meeting fatigue predictions',
//       'Smart task scheduling',
//       'Calendar-based energy adjustments'
//     ]
//   },
//   {
//     id: 'openweather',
//     name: 'OpenWeather API',
//     category: 'Weather',
//     difficulty: 'easy',
//     status: 'recommended',
//     description: 'Track weather patterns to predict migraine triggers and energy impacts',
//     useCase: 'Alert users to low pressure systems (migraine trigger), suggest indoor activities on bad weather days',
//     apiEndpoint: 'https://api.openweathermap.org/data/2.5/weather',
//     documentation: 'https://openweathermap.org/api',
//     privacyNotes: 'No personal data required. Uses approximate location only.',
//     setupSteps: [
//       'Sign up for free OpenWeather API key',
//       'Get user location (with permission)',
//       'Fetch current weather data',
//       'Parse barometric pressure and conditions',
//       'Correlate with user mood/migraine logs'
//     ],
//     codeExample: `// Example: Weather-based insights
// import { WeatherIntegration } from './api-integrations';

// const weather = new WeatherIntegration(API_KEY);
// const data = await weather.fetchWeather();
// const impact = weather.getWeatherImpact(data);

// if (impact.migraineLikelihood === 'high') {
//   showAlert('⚠️ Low pressure detected - migraine risk higher today');
// }`,
//     benefits: [
//       'Migraine trigger predictions',
//       'Weather-based mood correlations',
//       'Outdoor activity suggestions',
//       'Barometric pressure tracking'
//     ]
//   },
//   {
//     id: 'rescuetime',
//     name: 'RescueTime',
//     category: 'Focus',
//     difficulty: 'easy',
//     status: 'optional',
//     description: 'Track productivity patterns and app usage to identify peak focus hours',
//     useCase: 'Suggest scheduling important tasks during peak productivity hours',
//     apiEndpoint: 'RescueTime Data API',
//     documentation: 'https://www.rescuetime.com/anapi/setup/documentation',
//     privacyNotes: 'Read-only access to productivity data. User controls what apps are tracked.',
//     setupSteps: [
//       'User installs RescueTime app',
//       'Generate API key from RescueTime dashboard',
//       'Query daily summary data',
//       'Identify most productive hours',
//       'Suggest task scheduling based on patterns'
//     ],
//     codeExample: `// Example: Focus pattern analysis
// import { FocusDataIntegration } from './api-integrations';

// const focus = new FocusDataIntegration(API_KEY, 'rescuetime');
// const data = await focus.fetchFocusData();

// if (data.focusScore > 80) {
//   toast.success('Great focus today! 🎯');
// }`,
//     benefits: [
//       'Personalized peak hours detection',
//       'Distraction identification',
//       'Productivity trend analysis',
//       'App usage insights'
//     ]
//   },
//   {
//     id: 'openai',
//     name: 'OpenAI GPT-4',
//     category: 'AI',
//     difficulty: 'medium',
//     status: 'recommended',
//     description: 'Generate personalized coaching insights from multi-modal user data',
//     useCase: 'Analyze journal entries, detect patterns across mood/habits/health, provide compassionate suggestions',
//     apiEndpoint: 'https://api.openai.com/v1/chat/completions',
//     documentation: 'https://platform.openai.com/docs/api-reference',
//     privacyNotes: 'Data sent to OpenAI. Anonymize personal info. User consent required.',
//     setupSteps: [
//       'Get OpenAI API key',
//       'Set up secure backend proxy (never expose key)',
//       'Create coaching prompts with user context',
//       'Call GPT-4 API with temperature 0.7',
//       'Parse and display insights in UI'
//     ],
//     codeExample: `// Example: AI coaching insights
// import { AICoachingIntegration } from './api-integrations';

// const ai = new AICoachingIntegration(API_KEY);
// const insights = await ai.generateInsights({
//   moodHistory: [...],
//   habitData: [...],
//   healthData: {...}
// });

// insights.forEach(insight => {
//   displayInsight(insight.title, insight.message);
// });`,
//     benefits: [
//       'Pattern detection across data sources',
//       'Personalized affirmations',
//       'Journal sentiment analysis',
//       'Contextual habit suggestions'
//     ]
//   },
//   {
//     id: 'affectiva',
//     name: 'Affectiva / Emotion AI',
//     category: 'Emotion',
//     difficulty: 'hard',
//     status: 'future',
//     description: 'Detect emotional tone from text to adapt UI and suggestions',
//     useCase: 'Adjust app color scheme, message tone, and suggested activities based on detected emotion',
//     apiEndpoint: 'Custom emotion detection API',
//     documentation: 'https://www.affectiva.com/ or IBM Watson Tone Analyzer',
//     privacyNotes: 'Analyze text locally when possible. Anonymize before sending to APIs.',
//     setupSteps: [
//       'Choose emotion detection service',
//       'Set up API credentials',
//       'Analyze journal/chat text on submit',
//       'Detect primary emotion and intensity',
//       'Adapt UI colors and suggestions'
//     ],
//     codeExample: `// Example: Emotion-based adaptation
// import { EmotionalToneIntegration } from './api-integrations';

// const emotion = new EmotionalToneIntegration(API_KEY);
// const tone = await emotion.analyzeTone(journalText);
// const adaptations = emotion.getUIAdaptations(tone);

// if (tone.primary === 'anxious') {
//   showBreathingExercise();
//   setColorScheme('cool');
// }`,
//     benefits: [
//       'Adaptive UI based on emotional state',
//       'Contextual activity suggestions',
//       'Emotional pattern tracking',
//       'Personalized message tone'
//     ]
//   }
// ];

// export function IntegrationsGuideScreen() {
//   const { themeColors } = useTheme();
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [copiedCode, setCopiedCode] = useState<string | null>(null);

//   const handleCopyCode = (code: string, id: string) => {
//     navigator.clipboard.writeText(code);
//     setCopiedCode(id);
//     toast.success('Code copied to clipboard!');
//     setTimeout(() => setCopiedCode(null), 2000);
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case 'easy': return '#10b981';
//       case 'medium': return '#f59e0b';
//       case 'hard': return '#ef4444';
//       default: return themeColors.primary;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'recommended':
//         return <Badge className="bg-green-100 text-green-700 border-green-300">Recommended</Badge>;
//       case 'optional':
//         return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Optional</Badge>;
//       case 'future':
//         return <Badge className="bg-purple-100 text-purple-700 border-purple-300">Future Phase</Badge>;
//       default:
//         return null;
//     }
//   };

//   const categories = Array.from(new Set(API_GUIDES.map(g => g.category)));

//   return (
//     <div
//       className="min-h-screen pb-24"
//       style={{
//         background: `linear-gradient(to bottom, ${themeColors.gradientTo}, ${themeColors.gradientFrom})`,
//       }}
//     >
//       <div className="p-6 md:p-8 pt-12 md:pt-16">
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center gap-3 mb-3">
//               <div
//                 className="w-12 h-12 rounded-2xl flex items-center justify-center"
//                 style={{ backgroundColor: themeColors.primaryLight }}
//               >
//                 <Code size={24} style={{ color: themeColors.primary }} />
//               </div>
//               <div>
//                 <h1>API Integration Guide</h1>
//                 <p className="text-sm opacity-70">
//                   Developer documentation for making FlowState adaptive
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Overview */}
//           <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
//             <div className="flex items-start gap-3">
//               <BookOpen size={20} className="text-blue-600 mt-1 flex-shrink-0" />
//               <div>
//                 <h3 className="mb-2">Making FlowState Truly Adaptive</h3>
//                 <p className="text-sm text-gray-700 leading-relaxed mb-3">
//                   FlowState becomes more powerful when connected to real user data. These integrations allow the app to:
//                 </p>
//                 <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
//                   <li>Predict energy levels based on sleep and health data</li>
//                   <li>Suggest optimal task timing using calendar and focus patterns</li>
//                   <li>Warn about migraine triggers from weather patterns</li>
//                   <li>Generate personalized coaching insights with AI</li>
//                   <li>Adapt UI and messaging to emotional state</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Code Reference */}
//           <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
//             <div className="flex items-center gap-2 mb-3">
//               <Code size={18} style={{ color: themeColors.primary }} />
//               <h3>Implementation Reference</h3>
//             </div>
//             <p className="text-sm text-gray-600 mb-3">
//               All integration utilities are available in <code className="bg-gray-100 px-2 py-1 rounded text-xs">/components/api-integrations.ts</code>
//             </p>
//             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//               <code className="text-xs text-gray-700 block">
//                 {`import { AdaptiveEngine } from './api-integrations';

// const engine = new AdaptiveEngine({
//   healthApiKey: process.env.APPLE_HEALTH_KEY,
//   calendarApiKey: process.env.GOOGLE_CALENDAR_KEY,
//   weatherApiKey: process.env.OPENWEATHER_KEY,
//   aiApiKey: process.env.OPENAI_KEY,
// });

// const recommendations = await engine.getDailyRecommendations();`}
//               </code>
//             </div>
//           </div>

//           {/* API Guides by Category */}
//           {categories.map(category => (
//             <div key={category} className="mb-8">
//               <h2 className="mb-4 flex items-center gap-2">
//                 {category} APIs
//                 <Badge variant="outline" className="text-xs">
//                   {API_GUIDES.filter(g => g.category === category).length} integrations
//                 </Badge>
//               </h2>

//               <div className="space-y-3">
//                 {API_GUIDES.filter(g => g.category === category).map(guide => {
//                   const isExpanded = expandedId === guide.id;

//                   return (
//                     < div
//                       key={guide.id}
//                       className="bg-white rounded-2xl shadow-md overflow-hidden"
//                       initial={false}
//                     >
//                       {/* Header - Always visible */}
//                       <button
//                         onClick={() => setExpandedId(isExpanded ? null : guide.id)}
//                         className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
//                       >
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-2">
//                               <h3 className="text-base">{guide.name}</h3>
//                               {getStatusBadge(guide.status)}
//                               <Badge 
//                                 variant="outline"
//                                 className="text-xs"
//                                 style={{ 
//                                   borderColor: getDifficultyColor(guide.difficulty),
//                                   color: getDifficultyColor(guide.difficulty)
//                                 }}
//                               >
//                                 {guide.difficulty}
//                               </Badge>
//                             </div>
//                             <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
//                             <div className="flex items-center gap-2 text-xs text-gray-500">
//                               <Shield size={12} />
//                               <span>{guide.privacyNotes}</span>
//                             </div>
//                           </div>
//                           <div className="flex-shrink-0">
//                             {isExpanded ? (
//                               <ChevronUp size={20} className="text-gray-400" />
//                             ) : (
//                               <ChevronDown size={20} className="text-gray-400" />
//                             )}
//                           </div>
//                         </div>
//                       </button>

//                       {/* Expanded Content */}
//                       <AnimatePresence>
//                         {isExpanded && (
//                           < div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: 'auto', opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             transition={{ duration: 0.3 }}
//                             className="overflow-hidden"
//                           >
//                             <div className="px-5 pb-5 space-y-4 border-t border-gray-200 pt-4">
//                               {/* Use Case */}
//                               <div>
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <Zap size={14} style={{ color: themeColors.primary }} />
//                                   <h4 className="text-sm">Use Case</h4>
//                                 </div>
//                                 <p className="text-sm text-gray-600 pl-6">{guide.useCase}</p>
//                               </div>

//                               {/* Documentation Link */}
//                               <div>
//                                 <a
//                                   href={guide.documentation}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="inline-flex items-center gap-2 text-sm hover:underline"
//                                   style={{ color: themeColors.primary }}
//                                 >
//                                   <ExternalLink size={14} />
//                                   API Documentation
//                                 </a>
//                               </div>

//                               {/* Setup Steps */}
//                               <div>
//                                 <h4 className="text-sm mb-2">Setup Steps</h4>
//                                 <ol className="text-sm text-gray-600 space-y-1 pl-6 list-decimal">
//                                   {guide.setupSteps.map((step, index) => (
//                                     <li key={index}>{step}</li>
//                                   ))}
//                                 </ol>
//                               </div>

//                               {/* Code Example */}
//                               <div>
//                                 <div className="flex items-center justify-between mb-2">
//                                   <h4 className="text-sm">Code Example</h4>
//                                   <button
//                                     onClick={() => handleCopyCode(guide.codeExample, guide.id)}
//                                     className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
//                                     style={{ color: themeColors.primary }}
//                                   >
//                                     {copiedCode === guide.id ? (
//                                       <>
//                                         <Check size={12} />
//                                         Copied!
//                                       </>
//                                     ) : (
//                                       <>
//                                         <Copy size={12} />
//                                         Copy
//                                       </>
//                                     )}
//                                   </button>
//                                 </div>
//                                 <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
//                                   <pre className="text-xs text-gray-100">
//                                     <code>{guide.codeExample}</code>
//                                   </pre>
//                                 </div>
//                               </div>

//                               {/* Benefits */}
//                               <div>
//                                 <h4 className="text-sm mb-2">Benefits</h4>
//                                 <div className="grid gap-2">
//                                   {guide.benefits.map((benefit, index) => (
//                                     <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
//                                       <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
//                                       <span>{benefit}</span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </ div>
//                         )}
//                       </AnimatePresence>
//                     </ div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}

//           {/* Privacy Notice */}
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
//             <div className="flex items-start gap-3">
//               <Shield size={20} className="text-purple-600 mt-1 flex-shrink-0" />
//               <div>
//                 <h3 className="mb-2">Privacy & Security Best Practices</h3>
//                 <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
//                   <li>Always request minimal necessary permissions</li>
//                   <li>Store API keys securely (environment variables, never commit to repo)</li>
//                   <li>Use read-only scopes when possible</li>
//                   <li>Anonymize personal data before sending to third-party APIs</li>
//                   <li>Provide clear privacy explanations to users</li>
//                   <li>Allow users to disconnect integrations anytime</li>
//                   <li>Process data locally when possible (e.g., emotion detection)</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
