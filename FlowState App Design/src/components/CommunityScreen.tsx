import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '../lib/motion-shim';
import { useTheme } from './ThemeContext';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Sparkles,
  Download,
  BookOpen,
  Flower2,
  Calendar,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Send,
  MoreHorizontal,
  Check,
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  timestamp: number;
  reactions: {
    heart: number;
    pray: number;
    sparkle: number;
  };
  userReaction?: 'heart' | 'pray' | 'sparkle';
  tags?: string[];
  circleId?: string;
}

interface SupportCircle {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  memberCount: number;
  petalProgress: number;
  recentActivity: string;
  joined: boolean;
}

interface RoutineTemplate {
  id: string;
  name: string;
  author: string;
  description: string;
  category: string;
  emoji: string;
  duration: string;
  activities: string[];
  downloads: number;
  tags: string[];
  color: string;
}

interface CommunityScreenProps {
  onNavigate?: (screen: string) => void;
}

// Mock data
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: 'Sarah',
    authorInitials: 'SM',
    authorColor: '#ec4899',
    content: 'Finally completed my morning routine 3 days in a row! 🌅 Small wins are still wins. The breathing exercise really helps.',
    timestamp: Date.now() - 3600000,
    reactions: { heart: 12, pray: 4, sparkle: 8 },
    tags: ['morning', 'breathing'],
  },
  {
    id: '2',
    author: 'Alex',
    authorInitials: 'AC',
    authorColor: '#06b6d4',
    content: 'Migraine today but I\'m being gentle with myself. Adjusted my goals and that\'s okay 💜',
    timestamp: Date.now() - 7200000,
    reactions: { heart: 24, pray: 15, sparkle: 6 },
    tags: ['migraine', 'self-compassion'],
  },
  {
    id: '3',
    author: 'Maya',
    authorInitials: 'MK',
    authorColor: '#8b5cf6',
    content: 'The ADHD support circle has been life-changing. Knowing I\'m not alone in this struggle means everything 🙏',
    timestamp: Date.now() - 10800000,
    reactions: { heart: 31, pray: 22, sparkle: 12 },
    tags: ['adhd', 'community'],
    circleId: 'adhd-warriors',
  },
  {
    id: '4',
    author: 'Jordan',
    authorInitials: 'JL',
    authorColor: '#f97316',
    content: 'Just shared my "Low Energy Days" routine template. Hope it helps someone else who struggles with chronic fatigue ✨',
    timestamp: Date.now() - 14400000,
    reactions: { heart: 18, pray: 7, sparkle: 20 },
    tags: ['template', 'fatigue'],
  },
];

const SUPPORT_CIRCLES: SupportCircle[] = [
  {
    id: 'migraine-support',
    name: 'Migraine Warriors',
    description: 'Supporting each other through the ups and downs of chronic migraines',
    emoji: '🌙',
    color: '#9333ea',
    memberCount: 247,
    petalProgress: 73,
    recentActivity: '12 posts today',
    joined: true,
  },
  {
    id: 'adhd-warriors',
    name: 'ADHD Together',
    description: 'A judgment-free space for executive dysfunction, time blindness, and wins',
    emoji: '⚡',
    color: '#06b6d4',
    memberCount: 432,
    petalProgress: 85,
    recentActivity: '28 posts today',
    joined: true,
  },
  {
    id: 'gentle-morning',
    name: 'Gentle Mornings',
    description: 'Building sustainable morning routines that work for fluctuating energy',
    emoji: '🌅',
    color: '#f59e0b',
    memberCount: 189,
    petalProgress: 62,
    recentActivity: '8 posts today',
    joined: false,
  },
  {
    id: 'burnout-recovery',
    name: 'Burnout Recovery',
    description: 'Healing together from burnout with compassion and patience',
    emoji: '🕊️',
    color: '#10b981',
    memberCount: 356,
    petalProgress: 78,
    recentActivity: '15 posts today',
    joined: false,
  },
  {
    id: 'chronic-illness',
    name: 'Chronic Illness Support',
    description: 'Living fully while managing chronic conditions',
    emoji: '💜',
    color: '#ec4899',
    memberCount: 521,
    petalProgress: 91,
    recentActivity: '34 posts today',
    joined: false,
  },
];

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: '1',
    name: 'Gentle Morning Flow',
    author: 'Emma',
    description: 'A compassionate start for low-energy mornings',
    category: 'Morning',
    emoji: '🌸',
    duration: '15-20 min',
    activities: ['Gentle stretch in bed', 'Hydrate', 'Light breakfast', 'Quick check-in', '5-min breathing'],
    downloads: 892,
    tags: ['gentle', 'morning', 'low-energy'],
    color: '#fce7f3',
  },
  {
    id: '2',
    name: 'ADHD Evening Wind-Down',
    author: 'Alex',
    description: 'Calm the racing thoughts and prepare for rest',
    category: 'Evening',
    emoji: '🌙',
    duration: '20-25 min',
    activities: ['Brain dump', 'Tomorrow prep (3 items max)', 'Sensory-friendly routine', 'Calming music', 'Gratitude'],
    downloads: 654,
    tags: ['adhd', 'evening', 'sleep'],
    color: '#dbeafe',
  },
  {
    id: '3',
    name: 'Migraine Recovery Day',
    author: 'Sarah',
    description: 'Self-care for the day after a migraine',
    category: 'Recovery',
    emoji: '🌿',
    duration: 'Flexible',
    activities: ['Gentle movement', 'Hydration focus', 'Light tasks only', 'Rest periods', 'Avoid screens'],
    downloads: 423,
    tags: ['migraine', 'recovery', 'rest'],
    color: '#f3e8ff',
  },
  {
    id: '4',
    name: 'Focus Builder (ADHD)',
    author: 'Jordan',
    description: 'Structure for productive work sessions',
    category: 'Productivity',
    emoji: '🎯',
    duration: '45 min',
    activities: ['Clear workspace', '5-min timer warm-up', '25-min focus block', '5-min break', 'Celebrate completion'],
    downloads: 1205,
    tags: ['adhd', 'focus', 'productivity'],
    color: '#ddd6fe',
  },
  {
    id: '5',
    name: 'Burnout Prevention Check',
    author: 'Maya',
    description: 'Weekly self-assessment and boundary setting',
    category: 'Self-Care',
    emoji: '🛡️',
    duration: '10-15 min',
    activities: ['Energy check', 'Review commitments', 'Identify one thing to drop', 'Schedule rest', 'Affirmations'],
    downloads: 567,
    tags: ['burnout', 'boundaries', 'self-care'],
    color: '#ccfbf1',
  },
];

export function CommunityScreen({ onNavigate }: CommunityScreenProps) {
  const { themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState<'feed' | 'circles' | 'templates'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [circles, setCircles] = useState<SupportCircle[]>(SUPPORT_CIRCLES);
  const [templates, setTemplates] = useState<RoutineTemplate[]>(ROUTINE_TEMPLATES);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Load saved data
  useEffect(() => {
    const savedPosts = localStorage.getItem('flowstate-community-posts');
    if (savedPosts) {
      setPosts([...JSON.parse(savedPosts), ...MOCK_POSTS]);
    }
    
    const savedCircles = localStorage.getItem('flowstate-user-circles');
    if (savedCircles) {
      const userCircles = JSON.parse(savedCircles);
      setCircles(circles.map(c => ({
        ...c,
        joined: userCircles.includes(c.id),
      })));
    }
  }, []);

  const handleReaction = (postId: string, reaction: 'heart' | 'pray' | 'sparkle') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        
        // Remove previous reaction if exists
        if (post.userReaction) {
          newReactions[post.userReaction]--;
        }
        
        // Add new reaction or remove if same
        if (post.userReaction === reaction) {
          return { ...post, userReaction: undefined, reactions: newReactions };
        } else {
          newReactions[reaction]++;
          return { ...post, userReaction: reaction, reactions: newReactions };
        }
      }
      return post;
    }));
  };

  const handleJoinCircle = (circleId: string) => {
    setCircles(circles.map(c => 
      c.id === circleId ? { ...c, joined: !c.joined } : c
    ));
    
    const joinedCircles = circles.filter(c => c.joined || c.id === circleId).map(c => c.id);
    localStorage.setItem('flowstate-user-circles', JSON.stringify(joinedCircles));
  };

  const handleImportTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Save to localStorage as imported routine
    const imported = JSON.parse(localStorage.getItem('flowstate-imported-routines') || '[]');
    imported.push({
      ...template,
      importedAt: Date.now(),
    });
    localStorage.setItem('flowstate-imported-routines', JSON.stringify(imported));

    // Update download count
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, downloads: t.downloads + 1 } : t
    ));
  };

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      authorInitials: 'ME',
      authorColor: themeColors.primary,
      content: newPost,
      timestamp: Date.now(),
      reactions: { heart: 0, pray: 0, sparkle: 0 },
      tags: selectedTags,
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedTags([]);
    setShowNewPost(false);

    // Save to localStorage
    const userPosts = [post, ...posts.filter(p => p.author === 'You')];
    localStorage.setItem('flowstate-community-posts', JSON.stringify(userPosts));
  };

  const PostCard = ({ post }: { post: CommunityPost }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
    >
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: post.authorColor }}
        >
          {post.authorInitials}
        </div>
        <div className="flex-1">
          <div className="text-gray-900">{post.author}</div>
          <div className="text-xs opacity-50">
            {new Date(post.timestamp).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        {post.circleId && (
          <div className="text-xs px-3 py-1 rounded-full bg-lavender-100 text-lavender-700">
            Circle
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-3 leading-relaxed">{post.content}</p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleReaction(post.id, 'heart')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-pink-50 transition-colors"
          style={{
            backgroundColor: post.userReaction === 'heart' ? '#fce7f3' : 'transparent',
          }}
        >
          <span className="text-lg">💜</span>
          <span className="text-sm text-gray-600">{post.reactions.heart}</span>
        </button>
        <button
          onClick={() => handleReaction(post.id, 'pray')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-blue-50 transition-colors"
          style={{
            backgroundColor: post.userReaction === 'pray' ? '#dbeafe' : 'transparent',
          }}
        >
          <span className="text-lg">🙏</span>
          <span className="text-sm text-gray-600">{post.reactions.pray}</span>
        </button>
        <button
          onClick={() => handleReaction(post.id, 'sparkle')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-yellow-50 transition-colors"
          style={{
            backgroundColor: post.userReaction === 'sparkle' ? '#fef3c7' : 'transparent',
          }}
        >
          <span className="text-lg">✨</span>
          <span className="text-sm text-gray-600">{post.reactions.sparkle}</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeColors.background }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.('home')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-gray-900">Community</h1>
                <p className="text-sm opacity-60">Connect, share, support</p>
              </div>
            </div>
            {activeTab === 'feed' && (
              <button
                onClick={() => setShowNewPost(!showNewPost)}
                className="p-2 rounded-full transition-all"
                style={{
                  backgroundColor: showNewPost ? themeColors.primary : '#f3f4f6',
                  color: showNewPost ? 'white' : '#374151',
                }}
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: activeTab === 'feed' ? themeColors.primary : '#f3f4f6',
                color: activeTab === 'feed' ? 'white' : '#6b7280',
              }}
            >
              <MessageCircle size={16} />
              Feed
            </button>
            <button
              onClick={() => setActiveTab('circles')}
              className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: activeTab === 'circles' ? themeColors.primary : '#f3f4f6',
                color: activeTab === 'circles' ? 'white' : '#6b7280',
              }}
            >
              <Users size={16} />
              Circles
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="flex-1 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: activeTab === 'templates' ? themeColors.primary : '#f3f4f6',
                color: activeTab === 'templates' ? 'white' : '#6b7280',
              }}
            >
              <BookOpen size={16} />
              Templates
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* New Post Form */}
        <AnimatePresence>
          {showNewPost && activeTab === 'feed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6"
            >
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your journey, wins, or support others..."
                className="w-full p-4 rounded-2xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-lavender-300 mb-3"
                rows={4}
                style={{ fontFamily: 'inherit' }}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs opacity-50">Add tags (optional)</span>
                </div>
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="px-4 py-2 rounded-2xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: 'white',
                  }}
                >
                  <Send size={16} />
                  Share
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-3xl p-5 border border-lavender-200 mb-6">
              <div className="flex items-start gap-3">
                <Heart size={20} className="text-lavender-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">Welcome to our Community 💜</h3>
                  <p className="text-sm opacity-70">
                    This is a supportive, judgment-free space. Share your journey, celebrate wins, and support others. 
                    No follower counts, no comparison - just connection.
                  </p>
                </div>
              </div>
            </div>

            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Circles Tab */}
        {activeTab === 'circles' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-5 border border-cyan-200 mb-6">
              <div className="flex items-start gap-3">
                <Users size={20} className="text-cyan-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">Support Circles 🌸</h3>
                  <p className="text-sm opacity-70">
                    Small groups focused on specific experiences. Each circle has a shared progress flower that grows with collective engagement.
                  </p>
                </div>
              </div>
            </div>

            {circles.map((circle, index) => (
              <motion.div
                key={circle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${circle.color}15` }}
                  >
                    {circle.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{circle.name}</h3>
                    <p className="text-sm opacity-70 mb-2">{circle.description}</p>
                    <div className="flex items-center gap-4 text-xs opacity-60">
                      <span>{circle.memberCount} members</span>
                      <span>•</span>
                      <span>{circle.recentActivity}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Flower */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70">Collective Growth</span>
                    <Flower2 size={16} style={{ color: circle.color }} />
                  </div>
                  <div className="w-full bg-white rounded-full h-3 mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${circle.petalProgress}%`,
                        backgroundColor: circle.color,
                      }}
                    />
                  </div>
                  <p className="text-xs opacity-60">
                    {circle.petalProgress}% bloomed this week
                  </p>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinCircle(circle.id)}
                  className="w-full py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: circle.joined ? `${circle.color}15` : circle.color,
                    color: circle.joined ? circle.color : 'white',
                    border: circle.joined ? `2px solid ${circle.color}` : 'none',
                  }}
                >
                  {circle.joined ? (
                    <>
                      <Check size={16} />
                      Joined
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Join Circle
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 mb-6">
              <div className="flex items-start gap-3">
                <BookOpen size={20} className="text-amber-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 mb-1">Community Templates 📚</h3>
                  <p className="text-sm opacity-70">
                    Routines and structures shared by the community. Import and adapt to your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
                  style={{ backgroundColor: template.color }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{template.emoji}</div>
                    <div className="text-xs px-3 py-1 rounded-full bg-white text-gray-600">
                      {template.category}
                    </div>
                  </div>

                  <h3 className="text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm opacity-70 mb-3">{template.description}</p>

                  <div className="flex items-center gap-2 text-xs opacity-60 mb-3">
                    <Clock size={12} />
                    <span>{template.duration}</span>
                    <span>•</span>
                    <span>by {template.author}</span>
                  </div>

                  {/* Activities */}
                  <div className="bg-white/80 rounded-2xl p-3 mb-3">
                    <div className="text-xs opacity-60 mb-2">Includes:</div>
                    <ul className="text-sm space-y-1">
                      {template.activities.slice(0, 3).map((activity, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="opacity-40">•</span>
                          <span className="opacity-80">{activity}</span>
                        </li>
                      ))}
                      {template.activities.length > 3 && (
                        <li className="text-xs opacity-50">
                          +{template.activities.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-white/80 text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Import Button */}
                  <button
                    onClick={() => handleImportTemplate(template.id)}
                    className="w-full py-3 rounded-2xl transition-all flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
                  >
                    <Download size={16} />
                    <span>Import Template</span>
                    <span className="text-xs opacity-50">({template.downloads})</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
