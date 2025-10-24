// src/screens/CommunityScreen.tsx
// community screen with feed, support circles, and routine templates
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  ArrowLeft,
  MessageCircle,
  Users,
  BookOpen,
  Plus,
  Send,
  Check,
  Flower2,
  Download,
  Clock,
} from "lucide-react";

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
  userReaction?: "heart" | "pray" | "sparkle";
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

// Mock Data
const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    author: "Sarah",
    authorInitials: "SM",
    authorColor: "#ec4899",
    content:
      "Finally completed my morning routine 3 days in a row! 🌅 The breathing exercise really helps.",
    timestamp: Date.now() - 3600000,
    reactions: { heart: 12, pray: 4, sparkle: 8 },
    tags: ["morning", "breathing"],
  },
  {
    id: "2",
    author: "Alex",
    authorInitials: "AC",
    authorColor: "#06b6d4",
    content: "Migraine today but I’m being gentle with myself 💜",
    timestamp: Date.now() - 7200000,
    reactions: { heart: 24, pray: 15, sparkle: 6 },
    tags: ["migraine", "self-compassion"],
  },
  {
    id: "3",
    author: "Maya",
    authorInitials: "MK",
    authorColor: "#8b5cf6",
    content:
      "The ADHD support circle has been life-changing. Knowing I’m not alone means everything 🙏",
    timestamp: Date.now() - 10800000,
    reactions: { heart: 31, pray: 22, sparkle: 12 },
    tags: ["adhd", "community"],
    circleId: "adhd-warriors",
  },
];

const SUPPORT_CIRCLES: SupportCircle[] = [
  {
    id: "migraine-support",
    name: "Migraine Warriors",
    description: "Supporting each other through chronic migraines",
    emoji: "🌙",
    color: "#9333ea",
    memberCount: 247,
    petalProgress: 73,
    recentActivity: "12 posts today",
    joined: true,
  },
  {
    id: "adhd-warriors",
    name: "ADHD Together",
    description: "A safe space for executive dysfunction and wins",
    emoji: "⚡",
    color: "#06b6d4",
    memberCount: 432,
    petalProgress: 85,
    recentActivity: "28 posts today",
    joined: true,
  },
  {
    id: "gentle-morning",
    name: "Gentle Mornings",
    description: "Soft starts for fluctuating energy",
    emoji: "🌅",
    color: "#f59e0b",
    memberCount: 189,
    petalProgress: 62,
    recentActivity: "8 posts today",
    joined: false,
  },
];

const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: "1",
    name: "Gentle Morning Flow",
    author: "Emma",
    description: "A compassionate start for low-energy mornings",
    category: "Morning",
    emoji: "🌸",
    duration: "15-20 min",
    activities: [
      "Gentle stretch",
      "Hydrate",
      "Light breakfast",
      "Check-in",
      "5-min breathing",
    ],
    downloads: 892,
    tags: ["gentle", "morning", "low-energy"],
    color: "#fce7f3",
  },
  {
    id: "2",
    name: "Focus Builder (ADHD)",
    author: "Jordan",
    description: "Structure for productive work sessions",
    category: "Productivity",
    emoji: "🎯",
    duration: "45 min",
    activities: [
      "Clear workspace",
      "5-min warm-up",
      "25-min focus block",
      "5-min break",
    ],
    downloads: 1205,
    tags: ["adhd", "focus", "productivity"],
    color: "#ddd6fe",
  },
];

export function CommunityScreen({ onNavigate }: CommunityScreenProps) {
  const { themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState<"feed" | "circles" | "templates">("feed");
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [circles, setCircles] = useState<SupportCircle[]>(SUPPORT_CIRCLES);
  const [templates, setTemplates] = useState<RoutineTemplate[]>(ROUTINE_TEMPLATES);
  const [newPost, setNewPost] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);

  // 🧩 Load saved posts + circles
  useEffect(() => {
    const savedPosts = localStorage.getItem("flowstate-community-posts");
    if (savedPosts) setPosts([...JSON.parse(savedPosts), ...MOCK_POSTS]);

    const savedCircles = localStorage.getItem("flowstate-user-circles");
    if (savedCircles) {
      const userCircles = JSON.parse(savedCircles);
      setCircles((prev) =>
        prev.map((c) => ({ ...c, joined: userCircles.includes(c.id) }))
      );
    }
  }, []);

  // ❤️ React to posts
  const handleReaction = (postId: string, reaction: "heart" | "pray" | "sparkle") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updated = { ...post.reactions };
          if (post.userReaction) updated[post.userReaction]--;
          if (post.userReaction === reaction)
            return { ...post, userReaction: undefined, reactions: updated };
          updated[reaction]++;
          return { ...post, userReaction: reaction, reactions: updated };
        }
        return post;
      })
    );
  };

  // 🌸 Join/Leave Circles
  const handleJoinCircle = (circleId: string) => {
    setCircles((prev) =>
      prev.map((c) => (c.id === circleId ? { ...c, joined: !c.joined } : c))
    );
    const joined = circles
      .map((c) => (c.id === circleId ? !c.joined : c.joined ? c.id : null))
      .filter(Boolean);
    localStorage.setItem("flowstate-user-circles", JSON.stringify(joined));
  };

  // 📦 Import Templates
  const handleImportTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    const imported = JSON.parse(localStorage.getItem("flowstate-imported") || "[]");
    imported.push({ ...template, importedAt: Date.now() });
    localStorage.setItem("flowstate-imported", JSON.stringify(imported));
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId ? { ...t, downloads: t.downloads + 1 } : t
      )
    );
  };

  // ✏️ New Post
  const handlePostSubmit = () => {
    if (!newPost.trim()) return;
    const newEntry: CommunityPost = {
      id: Date.now().toString(),
      author: "You",
      authorInitials: "ME",
      authorColor: themeColors.primary,
      content: newPost,
      timestamp: Date.now(),
      reactions: { heart: 0, pray: 0, sparkle: 0 },
    };
    setPosts([newEntry, ...posts]);
    localStorage.setItem(
      "flowstate-community-posts",
      JSON.stringify([newEntry, ...posts])
    );
    setNewPost("");
    setShowNewPost(false);
  };

  // 🪞 Render single post
  const PostCard = ({ post }: { post: CommunityPost }) => (
    <div className="flow-card">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: post.authorColor }}
        >
          {post.authorInitials}
        </div>
        <div>
          <p className="font-medium">{post.author}</p>
          <p className="text-xs opacity-50">
            {new Date(post.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <p className="mb-3 text-[var(--color-card-foreground)]">{post.content}</p>
      <div className="flex items-center gap-3 border-t pt-3">
        {["heart", "pray", "sparkle"].map((r) => (
          <button
            key={r}
            onClick={() => handleReaction(post.id, r as any)}
            className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100"
          >
            <span>
              {r === "heart" ? "💜" : r === "pray" ? "🙏" : "✨"}
            </span>
            <span className="text-sm text-gray-600">
              {post.reactions[r as keyof typeof post.reactions]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Header */}
      <div className="sticky top-0 flow-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.("home")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-medium">Community</h1>
              <p className="text-xs opacity-60">Connect • Share • Support</p>
            </div>
          </div>
          {activeTab === "feed" && (
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="p-2 rounded-full"
              style={{
                backgroundColor: showNewPost ? themeColors.primary : "#f3f4f6",
                color: showNewPost ? "white" : "#374151",
              }}
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { id: "feed", icon: <MessageCircle size={16} />, label: "Feed" },
            { id: "circles", icon: <Users size={16} />, label: "Circles" },
            { id: "templates", icon: <BookOpen size={16} />, label: "Templates" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 py-3 rounded-2xl text-sm flex justify-center gap-2 transition-all"
              style={{
                backgroundColor:
                  activeTab === tab.id ? themeColors.primary : "#f3f4f6",
                color: activeTab === tab.id ? "white" : "#6b7280",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* New post box */}
        {showNewPost && activeTab === "feed" && (
          <div className="flow-card">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your journey or a small win..."
              className="w-full border rounded-2xl p-3 mb-3 resize-none text-sm"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={handlePostSubmit}
                disabled={!newPost.trim()}
                className="px-4 py-2 rounded-2xl text-sm"
                style={{
                  backgroundColor: themeColors.primary,
                  color: "white",
                  opacity: newPost ? 1 : 0.6,
                }}
              >
                <Send size={14} className="inline mr-1" />
                Share
              </button>
            </div>
          </div>
        )}

        {/* Feed */}
        {activeTab === "feed" &&
          posts.map((post) => <PostCard key={post.id} post={post} />)}

        {/* Circles */}
        {activeTab === "circles" &&
          circles.map((circle) => (
            <div
              key={circle.id}
              className="flow-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 flex items-center justify-center text-2xl rounded-2xl"
                  style={{ backgroundColor: `${circle.color}15` }}
                >
                  {circle.emoji}
                </div>
                <div>
                  <p className="font-medium">{circle.name}</p>
                  <p className="text-xs opacity-70">{circle.description}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs opacity-70">Collective Growth</span>
                  <Flower2 size={14} style={{ color: circle.color }} />
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${circle.petalProgress}%`,
                      backgroundColor: circle.color,
                    }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => handleJoinCircle(circle.id)}
                className="w-full py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all"
                style={{
                  backgroundColor: circle.joined ? `${circle.color}15` : circle.color,
                  color: circle.joined ? circle.color : "white",
                  border: circle.joined ? `2px solid ${circle.color}` : "none",
                }}
              >
                {circle.joined ? (
                  <>
                    <Check size={14} /> Joined
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Join
                  </>
                )}
              </button>
            </div>
          ))}

        {/* Templates */}
        {activeTab === "templates" &&
          templates.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl border p-5"
              style={{ backgroundColor: t.color }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{t.emoji}</div>
                <div className="text-xs bg-white/80 px-3 py-1 rounded-full">
                  {t.category}
                </div>
              </div>
              <h3 className="font-medium mb-1">{t.name}</h3>
              <p className="text-sm opacity-70 mb-3">{t.description}</p>
              <div className="flex items-center gap-2 text-xs opacity-70 mb-3">
                <Clock size={12} />
                {t.duration} • by {t.author}
              </div>
              <button
                onClick={() => handleImportTemplate(t.id)}
                className="w-full py-2.5 rounded-xl bg-white/80 hover:bg-white transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download size={14} />
                Import ({t.downloads})
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
