// src/screens/TodosScreen.tsx
// task dashboard screen with life area filters, add modal, and adaptive theme support

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

  // persist todos in local storage
  useEffect(() => {
    localStorage.setItem("flowstate-todos", JSON.stringify(todos));
  }, [todos]);

  // filtering + sorting logic
  const filteredTodos = useMemo(() => {
    let list = [...todos];
    Object.entries(filters).forEach(([key, val]) => {
      if (val) list = list.filter((t) => (t as any)[key] === val);
    });

    switch (sort) {
      case "priority":
        list.sort(
          (a, b) =>
            ({ high: 3, medium: 2, low: 1 }[b.priority] -
             { high: 3, medium: 2, low: 1 }[a.priority])
        );
        break;
      case "energy":
        list.sort(
          (a, b) =>
            ({ high: 3, moderate: 2, low: 1 }[b.energy] -
             { high: 3, moderate: 2, low: 1 }[a.energy])
        );
        break;
      case "alphabetical":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [todos, filters, sort]);

  // toggle task completion
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
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

  // progress stats
  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

  // main ui
  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${themeColors.gradientFrom}, ${themeColors.gradientTo})`,
      }}
    >
      {/* header */}
      <header
        className="sticky top-0 backdrop-blur-md z-10 px-6 py-4 flex justify-between items-center border-b"
        style={{
          backgroundColor: `${themeColors.card}cc`,
          borderColor: themeColors.accentLight,
        }}
      >
        <h1 className="text-xl font-semibold text-[var(--color-card-foreground)]">
          My To-Dos
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full p-3 shadow-lg transition"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`,
            color: "#fff",
          }}
        >
          <Plus size={18} />
        </button>
      </header>

      {/* filters section */}
      <section
        className="px-4 py-3 sticky top-[60px] bg-[var(--color-card)]/60 backdrop-blur-md border-b z-10"
        style={{ borderColor: themeColors.accentLight }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--color-card-foreground)] tracking-wide">
            Life Areas
          </h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="border border-purple-200 rounded-lg px-3 py-1.5 text-xs bg-[var(--color-card)]/70 hover:bg-[var(--color-card)] transition"
          >
            <option value="priority">Sort by Priority</option>
            <option value="energy">Sort by Energy</option>
            <option value="alphabetical">Sort A–Z</option>
          </select>
        </div>

        {/* scrollable life area bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {DEFAULT_LIFE_AREAS.filter((area) => area.enabled).map((area) => {
            const hasTasks = todos.some((t) => t.lifeArea === area.id);
            const isActive = filters.lifeArea === area.id;

            return (
              <button
                key={area.id}
                onClick={() =>
                  hasTasks &&
                  setFilters((prev) => ({
                    ...prev,
                    lifeArea: prev.lifeArea === area.id ? "" : area.id,
                  }))
                }
                disabled={!hasTasks}
                className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${
                  isActive
                    ? "text-white scale-[1.05]"
                    : hasTasks
                    ? "bg-[var(--color-card)]/70 hover:bg-[var(--color-card)] text-[var(--color-card-foreground)]"
                    : "opacity-40 cursor-not-allowed"
                }`}
                style={{
                  borderColor: isActive ? area.color : "rgba(167,139,250,0.25)",
                  background: isActive
                    ? `linear-gradient(135deg, ${area.color}, ${area.color}cc)`
                    : undefined,
                  boxShadow: isActive
                    ? `0 3px 10px ${area.color}44`
                    : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <span className="text-base leading-none">{area.icon}</span>
                <span
                  className="whitespace-nowrap"
                  style={{
                    color: isActive ? "#fff" : "var(--color-card-foreground)",
                    textShadow: isActive ? "0 1px 1px rgba(0,0,0,0.25)" : undefined,
                  }}
                >
                  {area.label}
                </span>
              </button>
            );
          })}

          {/* all button */}
          {todos.length > 0 && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, lifeArea: "" }))}
              className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                !filters.lifeArea
                  ? "bg-purple-500 text-white"
                  : "bg-[var(--color-card)]/60 text-[var(--color-card-foreground)] hover:bg-[var(--color-card)]"
              }`}
            >
              🌐 All
            </button>
          )}
        </div>
      </section>

      {/* progress bar */}
      <div className="px-6 py-3">
        <div className="w-full h-2 bg-[var(--color-card)]/40 rounded-full overflow-hidden">
          <div
            className="h-full transition-all rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accentLight})`,
            }}
          />
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1 text-right">
          {completedCount}/{todos.length} completed
        </p>
      </div>

      {/* todos grid */}
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
          {filteredTodos.length === 0 && (
            <p className="text-sm text-center opacity-50 col-span-full mt-6">
              No tasks match your filters.
            </p>
          )}
        </div>
      </main>

      {/* floating add button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg text-white hover:scale-105 transition"
        style={{
          background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`,
        }}
      >
        <Plus size={22} />
      </button>

      {/* add task modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div
            className="bg-[var(--color-card)] rounded-3xl p-6 w-80 shadow-xl border"
            style={{ borderColor: themeColors.accentLight }}
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-card-foreground)]">
              Add a Task
            </h3>

            <input
              type="text"
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full border border-purple-200 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              type="text"
              placeholder="Emoji (optional)"
              value={newTodo.icon}
              onChange={(e) => setNewTodo({ ...newTodo, icon: e.target.value })}
              className="w-full border border-purple-200 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            <div className="flex flex-col gap-3 mb-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                className="w-full border border-purple-200 rounded-xl p-3"
              >
                <option value="low">Priority: Low</option>
                <option value="medium">Priority: Medium</option>
                <option value="high">Priority: High</option>
              </select>

              <select
                value={newTodo.lifeArea}
                onChange={(e) => setNewTodo({ ...newTodo, lifeArea: e.target.value as any })}
                className="w-full border border-purple-200 rounded-xl p-3"
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
                className="w-full border border-purple-200 rounded-xl p-3"
              >
                <option value="low">Energy: Low</option>
                <option value="moderate">Energy: Moderate</option>
                <option value="high">Energy: High</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
              >
                cancel
              </button>
              <button
                onClick={addTodo}
                className="flex-1 py-3 rounded-xl text-white font-medium"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`,
                }}
              >
                add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
