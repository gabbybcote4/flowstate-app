// src/screens/TodosScreen.tsx
import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { TodoCard } from "../components/card/TodoCard";
import { useTheme } from "../components/ThemeContext";
import { useActivityNudges } from "../components/system/NudgeSystem";

interface Todo {
  id: number;
  title: string;
  icon: string;
  priority: "low" | "medium" | "high";
  lifeArea: string;
  energy: "low" | "moderate" | "high";
  completed: boolean;
}

const DEFAULT_LIFE_AREAS = [
  { id: "health", label: "Health & Wellness", icon: "💚", color: "#10B981", enabled: true },
  { id: "work", label: "Work & Career", icon: "💼", color: "#3B82F6", enabled: true },
  { id: "relationships", label: "Relationships", icon: "💜", color: "#A78BFA", enabled: true },
  { id: "personal", label: "Personal Growth", icon: "🌱", color: "#8B5CF6", enabled: true },
  { id: "creativity", label: "Creativity", icon: "🎨", color: "#EC4899", enabled: true },
  { id: "finance", label: "Finance", icon: "💰", color: "#F59E0B", enabled: true },
  { id: "home", label: "Home & Living", icon: "🏡", color: "#14B8A6", enabled: true },
  { id: "learning", label: "Learning", icon: "📚", color: "#6366F1", enabled: true },
];

const defaultTodos: Todo[] = [
  { id: 1, title: "Drink water", icon: "💧", priority: "low", lifeArea: "health", energy: "low", completed: false },
  { id: 2, title: "Journal entry", icon: "📓", priority: "medium", lifeArea: "personal", energy: "moderate", completed: false },
  { id: 3, title: "Clean workspace", icon: "🧹", priority: "medium", lifeArea: "home", energy: "low", completed: false },
  { id: 4, title: "Workout", icon: "💪", priority: "high", lifeArea: "health", energy: "high", completed: false },
];

export function TodosScreen() {
  const { themeColors } = useTheme();
  const dark = themeColors.isDark;
  const { showCompletionNudge } = useActivityNudges();

  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem("flowstate-todos");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultTodos;
  });

  const [filters, setFilters] = useState({
    lifeArea: "",
    priority: "",
    energy: "",
  });

  const [sort, setSort] = useState<"priority" | "energy" | "alphabetical">("priority");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTodo, setNewTodo] = useState<Omit<Todo, "id">>({
    title: "",
    icon: "📝",
    priority: "medium",
    lifeArea: "work",
    energy: "moderate",
    completed: false,
  });

  // persist todos in local storage (used by TimeFlowScreen)
  useEffect(() => {
    localStorage.setItem("flowstate-todos", JSON.stringify(todos));
  }, [todos]);

  // filtering + sorting
  const filteredTodos = useMemo(() => {
    let list = [...todos];
    Object.entries(filters).forEach(([key, val]) => {
      if (val) list = list.filter((t) => (t as any)[key] === val);
    });

    switch (sort) {
      case "priority":
        list.sort((a, b) =>
          ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority])
        );
        break;
      case "energy":
        list.sort((a, b) =>
          ({ high: 3, moderate: 2, low: 1 }[b.energy] - { high: 3, moderate: 2, low: 1 }[a.energy])
        );
        break;
      case "alphabetical":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [todos, filters, sort]);

  // toggle completion
  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    const completed = todos.filter((t) => t.completed).length + 1;
    showCompletionNudge(completed);
  };

  // add new todo
  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    setTodos((prev) => [...prev, { ...newTodo, id: Date.now() }]);
    setShowAddModal(false);
    setNewTodo({
      title: "",
      icon: "📝",
      priority: "medium",
      lifeArea: "work",
      energy: "moderate",
      completed: false,
    });
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{
        backgroundColor: dark ? "#0b0b0e" : themeColors.card,
        color: dark ? "#f5f5f5" : "var(--color-card-foreground)",
      }}
    >
      {/* header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b backdrop-blur-md"
        style={{
          backgroundColor: dark ? "#18181b99" : `${themeColors.card}cc`,
          borderColor: dark ? "#27272a" : themeColors.accentLight,
        }}
      >
        <h1 className="text-xl font-semibold">My To-Dos</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full p-3 shadow-lg transition active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`,
            color: "#fff",
          }}
        >
          <Plus size={18} />
        </button>
      </header>

      {/* filters */}
      <section
        className="px-4 py-3 sticky top-[60px] backdrop-blur-md border-b z-10"
        style={{
          backgroundColor: dark ? "#18181b80" : "var(--color-card)/70",
          borderColor: dark ? "#27272a" : themeColors.accentLight,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold tracking-wide">Life Areas</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className={`border rounded-lg px-3 py-1.5 text-xs ${
              dark ? "bg-neutral-900 border-neutral-700 text-gray-200" : "bg-white border-purple-200"
            }`}
          >
            <option value="priority">Sort by Priority</option>
            <option value="energy">Sort by Energy</option>
            <option value="alphabetical">Sort A–Z</option>
          </select>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {DEFAULT_LIFE_AREAS.filter((a) => a.enabled).map((area) => {
            const has = todos.some((t) => t.lifeArea === area.id);
            const active = filters.lifeArea === area.id;
            return (
              <button
                key={area.id}
                onClick={() =>
                  has &&
                  setFilters((p) => ({ ...p, lifeArea: p.lifeArea === area.id ? "" : area.id }))
                }
                disabled={!has}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  active
                    ? "text-white scale-105"
                    : has
                    ? "opacity-100"
                    : "opacity-40 cursor-not-allowed"
                }`}
                style={{
                  borderColor: active ? area.color : dark ? "#3f3f46" : "#e5e7eb",
                  background: active
                    ? `linear-gradient(135deg, ${area.color}, ${area.color}cc)`
                    : dark
                    ? "#27272a"
                    : "var(--color-card)",
                  boxShadow: active ? `0 3px 10px ${area.color}44` : "none",
                }}
              >
                <span>{area.icon}</span>
                <span>{area.label}</span>
              </button>
            );
          })}
          {todos.length > 0 && (
            <button
              onClick={() => setFilters((p) => ({ ...p, lifeArea: "" }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !filters.lifeArea
                  ? "text-white"
                  : dark
                  ? "bg-neutral-800 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
              style={{
                background: !filters.lifeArea
                  ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`
                  : undefined,
              }}
            >
              🌐 All
            </button>
          )}
        </div>
      </section>

      {/* progress */}
      <div className="px-6 py-3">
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{
            backgroundColor: dark ? "#27272a" : "rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accentLight})`,
            }}
          />
        </div>
        <p className="text-xs mt-1 text-right opacity-70">
          {completedCount}/{todos.length} completed
        </p>
      </div>

      {/* grid */}
      <main className="flex-1 px-6 pb-24">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              title={`${todo.icon} ${todo.title}`}
              completed={todo.completed}
              onToggle={() => toggleTodo(todo.id)}
            />
          ))}
          {!filteredTodos.length && (
            <p className="text-sm text-center opacity-60 col-span-full mt-6">
              No tasks match your filters.
            </p>
          )}
        </div>
      </main>

      {/* add modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: dark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)" }}
        >
          <div
            className="rounded-3xl p-6 w-80 shadow-2xl border"
            style={{
              backgroundColor: dark ? "#18181b" : themeColors.card,
              color: dark ? "#f5f5f5" : "var(--color-card-foreground)",
              borderColor: dark ? "#3f3f46" : themeColors.accentLight,
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Add a Task</h3>
            <input
              type="text"
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className={`w-full rounded-xl p-3 mb-3 border focus:outline-none ${
                dark
                  ? "bg-neutral-900 border-neutral-700 focus:ring-2 focus:ring-purple-600"
                  : "bg-white border-purple-200 focus:ring-2 focus:ring-purple-300"
              }`}
            />
            <input
              type="text"
              placeholder="Emoji (optional)"
              value={newTodo.icon}
              onChange={(e) => setNewTodo({ ...newTodo, icon: e.target.value })}
              className={`w-full rounded-xl p-3 mb-3 border focus:outline-none ${
                dark
                  ? "bg-neutral-900 border-neutral-700 focus:ring-2 focus:ring-purple-600"
                  : "bg-white border-purple-200 focus:ring-2 focus:ring-purple-300"
              }`}
            />

            <div className="flex flex-col gap-3 mb-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                className={`w-full rounded-xl p-3 border ${
                  dark ? "bg-neutral-900 border-neutral-700" : "bg-white border-purple-200"
                }`}
              >
                <option value="low">Priority: Low</option>
                <option value="medium">Priority: Medium</option>
                <option value="high">Priority: High</option>
              </select>

              <select
                value={newTodo.lifeArea}
                onChange={(e) => setNewTodo({ ...newTodo, lifeArea: e.target.value as any })}
                className={`w-full rounded-xl p-3 border ${
                  dark ? "bg-neutral-900 border-neutral-700" : "bg-white border-purple-200"
                }`}
              >
                {DEFAULT_LIFE_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.icon} {a.label}
                  </option>
                ))}
              </select>

              <select
                value={newTodo.energy}
                onChange={(e) => setNewTodo({ ...newTodo, energy: e.target.value as any })}
                className={`w-full rounded-xl p-3 border ${
                  dark ? "bg-neutral-900 border-neutral-700" : "bg-white border-purple-200"
                }`}
              >
                <option value="low">Energy: Low</option>
                <option value="moderate">Energy: Moderate</option>
                <option value="high">Energy: High</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-3 rounded-xl border ${
                  dark
                    ? "border-neutral-700 hover:bg-neutral-800"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={addTodo}
                className="flex-1 py-3 rounded-xl text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`,
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
