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
  priority: "Low" | "Medium" | "High";
  lifeArea: string;
  energy: "Low" | "Moderate" | "High";
  completed: boolean;
}

const DEFAULT_LIFE_AREAS = [
  { id: "Health", label: "Health", icon: "💚", color: "#10B981", enabled: true },
  { id: "Work", label: "Work", icon: "💼", color: "#3B82F6", enabled: true },
  { id: "Relationships", label: "Relationships", icon: "💜", color: "#A78BFA", enabled: true },
  { id: "Personal", label: "Personal", icon: "🌱", color: "#8B5CF6", enabled: true },
  { id: "Creativity", label: "Creativity", icon: "🎨", color: "#EC4899", enabled: true },
  { id: "Finance", label: "Finance", icon: "💰", color: "#F59E0B", enabled: true },
  { id: "Home", label: "Home", icon: "🏡", color: "#14B8A6", enabled: true },
  { id: "Learning", label: "Learning", icon: "📚", color: "#6366F1", enabled: true },
];

const defaultTodos: Todo[] = [
  { id: 1, title: "Drink water", icon: "💧", priority: "Low", lifeArea: "Health", energy: "Low", completed: false },
  { id: 2, title: "Journal entry", icon: "📓", priority: "Medium", lifeArea: "Personal", energy: "Moderate", completed: false },
  { id: 3, title: "Clean workspace", icon: "🧹", priority: "Medium", lifeArea: "Home", energy: "Low", completed: false },
  { id: 4, title: "Workout", icon: "💪", priority: "High", lifeArea: "Health", energy: "High", completed: false },
];

export function TodosScreen() {
  const { themeColors, darkMode } = useTheme();
  const { showCompletionNudge } = useActivityNudges();

  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem("flowstate-todos");
      if (saved) {
        const parsed: Todo[] = JSON.parse(saved);
        return parsed.map((t) => ({
          ...t,
          lifeArea: t.lifeArea.charAt(0).toUpperCase() + t.lifeArea.slice(1).toLowerCase(),
        }));
      }
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
    priority: "Medium",
    lifeArea: "Work",
    energy: "Moderate",
    completed: false,
  });

  // persist todos in local storage
  useEffect(() => {
    localStorage.setItem("flowstate-todos", JSON.stringify(todos));
  }, [todos]);

  // filter + sort
  const filteredTodos = useMemo(() => {
    let list = [...todos];
    if (filters.lifeArea) list = list.filter((t) => t.lifeArea === filters.lifeArea);
    if (filters.priority) list = list.filter((t) => t.priority === filters.priority);
    if (filters.energy) list = list.filter((t) => t.energy === filters.energy);

    switch (sort) {
      case "priority":
        list.sort(
          (a, b) =>
            ({ High: 3, Medium: 2, Low: 1 }[b.priority] -
              { High: 3, Medium: 2, Low: 1 }[a.priority])
        );
        break;
      case "energy":
        list.sort(
          (a, b) =>
            ({ High: 3, Moderate: 2, Low: 1 }[b.energy] -
              { High: 3, Moderate: 2, Low: 1 }[a.energy])
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
      priority: "Medium",
      lifeArea: "Work",
      energy: "Moderate",
      completed: false,
    });
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors relative"
      style={{
        background: darkMode
          ? `linear-gradient(180deg, ${themeColors.background} 0%, #14131e 100%)`
          : `linear-gradient(180deg, ${themeColors.background} 0%, #ede9fe 100%)`,
      }}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${
          darkMode
            ? "bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05)_0%,transparent_70%)]"
            : "bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.25)_0%,transparent_70%)]"
        }`}
      />

      {/* header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b backdrop-blur-md"
        style={{
          backgroundColor: darkMode
            ? "rgba(18,18,28,0.6)"
            : "rgba(255,255,255,0.4)",
          borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        }}
      >
        <h1 className="text-lg font-semibold">My To-Dos</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full p-2 shadow-lg transition active:scale-95 outline"
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`,
            color: "#000000ff",
          }}
        >
          <Plus size={18} />
        </button>
      </header>

      {/* filters */}
      <section
        className="px-2  sticky top-[30px] backdrop-blur-md border-b z-10"
        style={{
          backgroundColor: darkMode
            ? "rgba(18,18,28,0.5)"
            : "rgba(255,255,255,0.5)",
          borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between ">
          <h3 className="text-sm font-semibold tracking-wide">Life Areas</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className={`border rounded-md py-2 text-xs transition ${
              darkMode
                ? "bg-[#1c1c28] border-[#3a3a4d] text-gray-200"
                : "bg-white border-purple-200"
            }`}
          >
            <option value="priority">Sort by Priority</option>
            <option value="energy">Sort by Energy</option>
            <option value="alphabetical">Sort A–Z</option>
          </select>
        </div>

        <div className="flex gap-1 py-2 overflow-x-auto">
          {DEFAULT_LIFE_AREAS.filter((a) => a.enabled).map((area) => {
            const has = todos.some((t) => t.lifeArea === area.id);
            const active = filters.lifeArea === area.id;
            return (
              <button
                key={area.id}
                disabled={!has}
                onClick={() =>
                  has &&
                  setFilters((p) => ({
                    ...p,
                    lifeArea: active ? "" : area.id,
                  }))
                }
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs transition-all ${
                  active
                    ? ""
                    : darkMode
                    ? ""
                    : ""
                } ${!has ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${area.color}, ${area.color}cc)`
                    : darkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.3)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span>{area.label}</span>
              </button>
            );
          })}

          {todos.length > 0 && (
            <button
              onClick={() => setFilters((p) => ({ ...p, lifeArea: "" }))}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs transition-all ${
                !filters.lifeArea
                  ? "text-white"
                  : darkMode
                  ? "bg-neutral-800 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
              style={{
                background: !filters.lifeArea
                  ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accentLight})`
                  : undefined,
              }}
            >
              All
            </button>
          )}
        </div>
      </section>

      {/* progress */}
      <div className="px-6 py-3">
        <div
          className="relative w-full h-[6px] rounded-full overflow-hidden outline"
          style={{
            background: darkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="absolute h-full left-0 top-0 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accentLight})`,
              boxShadow: `0 0 6px ${themeColors.primary}66`,
            }}
          />
        </div>
        <p className="text-xs mt-1 text-right opacity-70">
          {completedCount}/{todos.length} completed
        </p>
      </div>

      {/* grid */}
      <main className="flex-1 px-6 pb-24">
        <div className="grid gap-2">
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
    </div>
  );
}
