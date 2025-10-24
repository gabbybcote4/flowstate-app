// TimeFlowScreen.tsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../components/ThemeContext";
import {
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
  Heart,
  Briefcase,
  Users,
  Sparkles,
  Home as HomeIcon,
  Palette,
  X,
  ArrowLeft,
  Plus,
} from "lucide-react";

import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

// type DragType = "HABIT" | "TODO";

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  lifeArea: string;
  habitId?: string;
  habitName?: string;
  todoId?: string;
  todoName?: string;
  isFlexible: boolean;
}

interface Habit {
  id: string;
  name: string;
  lifeArea: string;
  purpose: string;
  frequency?: string;
  timeSlots?: { id: string; time: string; label: string }[];
}

interface Todo {
  id: string;
  title: string;
  lifeArea?: string;
  completed?: boolean;
}

interface LifeArea {
  name: string;
  color: string;
  icon: React.ReactNode;
  gradient: string;
}

const LIFE_AREAS: LifeArea[] = [
  { name: "Health", color: "#D8B4FE", icon: <Heart size={16} />, gradient: "from-purple-200 to-pink-200" },
  { name: "Work", color: "#FBBF24", icon: <Briefcase size={16} />, gradient: "from-amber-200 to-orange-200" },
  { name: "Relationships", color: "#FCA5A5", icon: <Users size={16} />, gradient: "from-rose-200 to-pink-200" },
  { name: "Personal Growth", color: "#A5B4FC", icon: <TrendingUp size={16} />, gradient: "from-indigo-200 to-purple-200" },
  { name: "Creativity", color: "#FCD34D", icon: <Palette size={16} />, gradient: "from-yellow-200 to-amber-200" },
  { name: "Home", color: "#A7F3D0", icon: <HomeIcon size={16} />, gradient: "from-emerald-200 to-teal-200" },
];

// ---------- time helpers (15-min grid) ----------
// const toMinutes = (hhmm: string) => {
//   const [h, m] = hhmm.split(":").map(Number);
//   return h * 60 + m;
// };
// const fromMinutes = (mins: number) => {
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
// };
// const addMinutes = (hhmm: string, delta: number) => fromMinutes(toMinutes(hhmm) + delta);

// const generateTimeSlots = (start = "06:00", end = "23:00") => {
//   const slots: { key: string; startTime: string; endTime: string }[] = [];
//   let cur = toMinutes(start);
//   const endMin = toMinutes(end);
//   while (cur < endMin) {
//     const startTime = fromMinutes(cur);
//     const endTime = fromMinutes(cur + 15);
//     slots.push({ key: `${startTime}-${endTime}`, startTime, endTime });
//     cur += 15;
//   }
//   return slots;
// };

// ---------- drag payload ----------
// type DragItem =
//   | { type: "HABIT"; habit: Habit }
//   | { type: "TODO"; todo: Todo };

// ---------- Draggable chips ----------
function DraggableHabit({ habit }: { habit: Habit }) {
  const life = LIFE_AREAS.find((a) => a.name === habit.lifeArea);
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: "HABIT" as DragType,
  //   item: { type: "HABIT", habit } as DragItem,
  //   collect: (m) => ({ isDragging: m.isDragging() }),
  // }));

  return (
    <div
      //ref={drag}
      className="px-3 py-2 rounded-xl border cursor-grab active:cursor-grabbing transition-all text-sm"
      style={{
        borderColor: life?.color || "#a78bfa",
        backgroundColor: `${life?.color || "#a78bfa"}15`,
        // opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: life?.color }}>{life?.icon}</span>
        <span className="truncate">{habit.name}</span>
      </div>
    </div>
  );
}

// function DraggableTodo({ todo }: { todo: Todo }) {
//   const life = LIFE_AREAS.find((a) => a.name === todo.lifeArea);
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "TODO" as DragType,
//     item: { type: "TODO", todo } as DragItem,
//     canDrag: !todo.completed,
//     collect: (m) => ({ isDragging: m.isDragging() }),
//   }));

//   // return (
//   //   <div
//   //     ref={drag}
//   //     className={`px-3 py-2 rounded-xl border cursor-grab active:cursor-grabbing transition-all text-sm ${
//   //       todo.completed ? "opacity-50" : ""
//   //     }`}
//   //     style={{
//   //       borderColor: life?.color || "#a78bfa",
//   //       backgroundColor: `${life?.color || "#a78bfa"}15`,
//   //       opacity: isDragging ? 0.5 : 1,
//   //       touchAction: "none",
//   //     }}
//   //   >
//   //     <div className="flex items-center gap-2">
//   //       {!!life && <span style={{ color: life.color }}>{life.icon}</span>}
//   //       <span className={`truncate ${todo.completed ? "line-through" : ""}`}>{todo.title}</span>
//   //     </div>
//   //   </div>
//   // );
// }

// ---------- droppable slot ----------
// function TimeSlot({
//   slot,
//   blocks,
//   onDrop,
//   onRemove,
// }: {
//   slot: { startTime: string; endTime: string; key: string };
//   blocks: TimeBlock[];
//   onDrop: (item: DragItem, startTime: string) => void;
//   onRemove: (blockId: string) => void;
// }) {
//   const { themeColors } = useTheme();
//   // const [{ isOver, canDrop }, drop] = useDrop(
//   //   () => ({
//   //     accept: ["HABIT", "TODO"],
//   //     drop: (item: DragItem) => onDrop(item, slot.startTime),
//   //     canDrop: () => true,
//   //     collect: (m) => ({ isOver: m.isOver({ shallow: true }), canDrop: m.canDrop() }),
//   //   }),
//   //   [slot.startTime, onDrop]
//   // );

//   const hasBlocks = blocks.length > 0;

  // return (
    // <div className="flex gap-2 sm:gap-3 items-stretch">
    //   {/* time */}
    //   <div className="w-14 sm:w-16 flex-shrink-0 flex items-start justify-center pt-2">
    //     <span className="text-[11px] sm:text-xs opacity-50">{slot.startTime}</span>
    //   </div>

    //   {/* life area spine */}
    //   <div className="w-1.5 sm:w-2 flex-shrink-0 relative">
    //     {hasBlocks ? (
    //       <div className="absolute inset-0 flex flex-col gap-[2px]">
    //         {blocks.map((b) => {
    //           const life = LIFE_AREAS.find((a) => a.name === b.lifeArea);
    //           return (
    //             <div
    //               key={b.id}
    //               className="flex-1 rounded-sm"
    //               style={{ backgroundColor: life?.color || themeColors.primary }}
    //             />
    //           );
    //         })}
    //       </div>
    //     ) : (
    //       <div className="absolute inset-0 bg-gray-200 rounded-sm" />
    //     )}
    //   </div>

      {/* drop area */}
      {/* <div
        ref={drop}
        className={`flex-1 rounded-xl p-2 min-h-[52px] sm:min-h-[56px] transition-colors ${
          isOver && canDrop
            ? "bg-purple-50 border-2 border-dashed border-purple-300"
            : "bg-gray-50 border border-transparent"
        }`}
        style={{ touchAction: "none" }}
      > */}
        {/* {hasBlocks ? (
          <div className="space-y-2">
            {blocks.map((b) => {
              const life = LIFE_AREAS.find((a) => a.name === b.lifeArea);
              const gradient = life?.gradient || "from-purple-200 to-pink-200";
              return (
                <div key={b.id} className={`p-2.5 rounded-lg bg-gradient-to-r ${gradient} relative group`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span style={{ color: life?.color || themeColors.primary }}>
                        {life?.icon || <Sparkles size={16} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm truncate">{b.habitName || b.todoName || "Untitled"}</p>
                        <p className="text-[11px] opacity-70">
                          {b.startTime} - {b.endTime}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(b.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/40 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mt-1 text-[11px] opacity-80 flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-white/50 rounded">{b.lifeArea}</span>
                    {b.isFlexible && <span className="px-2 py-0.5 bg-white/50 rounded">Flexible</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[11px] opacity-30">Drop here</p>
          </div>
        )}
      </div>
    </div> */}
  // );
// }

interface TimeFlowScreenProps {
  onNavigate?: (screen: string) => void;
}

export function TimeFlowScreen({ onNavigate }: TimeFlowScreenProps) {
  const { themeColors } = useTheme();
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // const SLOTS = useMemo(() => generateTimeSlots("06:00", "23:00"), []);

  // load data
  useEffect(() => {
    const savedBlocks = localStorage.getItem("flowstate-timeblocks");
    if (savedBlocks) setTimeBlocks(JSON.parse(savedBlocks));

    const savedHabits = localStorage.getItem("flowstate-habits");
    if (savedHabits) {
      const list = JSON.parse(savedHabits);
      setHabits(list.filter((h: any) => h.isActive));
    }

    const savedTemplates = localStorage.getItem("flowstate-routine-templates");
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const all: Todo[] = [];
      ["low", "moderate", "good"].forEach((lvl) => {
        if (templates[lvl]) {
          templates[lvl].forEach((t: any) => {
            all.push({
              id: String(t.id),
              title: t.title,
              completed: t.completed,
              lifeArea: inferLifeArea(t.title),
            });
          });
        }
      });
      setTodos(all.filter((t) => !t.completed));
    }
  }, []);

  // persist blocks
  useEffect(() => {
    if (timeBlocks.length || localStorage.getItem("flowstate-timeblocks")) {
      localStorage.setItem("flowstate-timeblocks", JSON.stringify(timeBlocks));
    }
  }, [timeBlocks]);

  // helpers
  const inferLifeArea = (title: string): string => {
    const s = title.toLowerCase();
    if (s.includes("work") || s.includes("project") || s.includes("meeting")) return "Work";
    if (s.includes("exercise") || s.includes("health") || s.includes("workout") || s.includes("meditat"))
      return "Health";
    if (s.includes("social") || s.includes("friend") || s.includes("family")) return "Relationships";
    if (s.includes("learn") || s.includes("read") || s.includes("study")) return "Personal Growth";
    if (s.includes("creative") || s.includes("art") || s.includes("music")) return "Creativity";
    if (s.includes("home") || s.includes("clean") || s.includes("tidy")) return "Home";
    return "Personal Growth";
  };

  // drop handler (default block length = 30 minutes)
  // const handleDrop = (item: DragItem, startTime: string) => {
  //   const endTime = addMinutes(startTime, 30);

  //   const block: TimeBlock = {
  //     id: Date.now().toString(),
  //     startTime,
  //     endTime,
  //     lifeArea:
  //       item.type === "HABIT"
  //         ? item.habit.lifeArea
  //         : item.todo.lifeArea || inferLifeArea(item.todo.title),
  //     habitId: item.type === "HABIT" ? item.habit.id : undefined,
  //     habitName: item.type === "HABIT" ? item.habit.name : undefined,
  //     todoId: item.type === "TODO" ? item.todo.id : undefined,
  //     todoName: item.type === "TODO" ? item.todo.title : undefined,
  //     isFlexible: false,
  //   };

  //   setTimeBlocks((prev) => [...prev, block]);
  // };

  // const handleRemoveBlock = (id: string) => setTimeBlocks((prev) => prev.filter((b) => b.id !== id));

  // const getBlocksForSlot = (startTime: string) =>
  //   timeBlocks.filter((b) => b.startTime === startTime);

const BottomSheet = () => {
  //const dark = themeColors.isDark;

  return (
    <>
      {/* Backdrop */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-[70] backdrop-blur-sm transition-opacity duration-200 sm:hidden"
          // style={{
          //   backgroundColor: dark ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.45)",
          // }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed left-0 right-0 transition-all duration-300 ease-out sm:hidden ${
          sheetOpen ? "bottom-[env(safe-area-inset-bottom,0px)] opacity-100" : "-bottom-[75vh] opacity-0"
        }`}
        style={{
          zIndex: 75, // higher than your bottom nav
          willChange: "bottom,opacity",
        }}
      >
        <div
          className="mx-3 mb-[env(safe-area-inset-bottom,20px)] rounded-3xl shadow-2xl overflow-hidden border"
          style={{
            // backgroundColor: dark ? themeColors.card || "#1c1c1e" : "#ffffff",
            // borderColor: dark ? "#2a2a2a" : "#e5e7eb",
            maxHeight: "70vh",
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b flex items-center justify-between"
            // style={{
            //   borderColor: dark ? "#2a2a2a" : "#e5e7eb",
            // }}
          >
            <div
              className="w-10 h-1.5 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 -top-2"
              // style={{
              //   backgroundColor: dark ? "#3f3f46" : "#d1d5db",
              // }}
            />
            <h3
              className="text-base font-medium"
              // style={{
              //   color: dark ? "#f5f5f5" : "#111827",
              // }}
            >
              Add to Timeline
            </h3>
            <button
              onClick={() => setSheetOpen(false)}
              className="p-2 rounded-full"
              // style={{
              //   color: dark ? "#e5e5e5" : "#374151",
              //   backgroundColor: dark ? "#2a2a2a" : "transparent",
              // }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable list */}
          <div
            className="p-4 grid grid-cols-1 gap-4 overflow-y-auto"
            // style={{
            //   maxHeight: "calc(70vh - 64px)",
            //   color: dark ? "#e5e5e5" : "#1f2937",
            // }}
          >
            {/* Habits */}
            {!!habits.length && (
              <div>
                <div
                  className="text-xs mb-2 uppercase tracking-wide"
                  // style={{
                  //   color: dark ? "#a3a3a3" : "#6b7280",
                  // }}
                >
                  Habits
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {habits.slice(0, 12).map((h) => (
                    <DraggableHabit key={h.id} habit={h} />
                  ))}
                </div>
              </div>
            )}

            {/* Todos */}
            {!!todos.length && (
              <div>
                <div
                  className="text-xs mb-2 uppercase tracking-wide"
                  // style={{
                  //   color: dark ? "#a3a3a3" : "#6b7280",
                  // }}
                >
                  To-Dos
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* {todos.slice(0, 12).map((t) => (
                    // <DraggableTodo key={t.id} todo={t} />
                  ))} */}
                </div>
              </div>
            )}

            {/* Tip */}
            <div
              className="rounded-2xl p-3 border text-xs mt-2"
              // style={{
              //   backgroundColor: dark ? "rgba(147, 51, 234, 0.15)" : "#faf5ff",
              //   borderColor: dark ? "#7e22ce" : "#c4b5fd",
              //   color: dark ? "#d8b4fe" : "#6b21a8",
              // }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5" />
                <p>Drag a habit or to-do onto a 15-minute slot above to schedule it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


  // drag preview (nice ghost chip)
  //const DragPreview = () => (
    // <Preview>
      {/* {(item: any) => {
        if (!item) return null;
        const isHabit = item.type === "HABIT";
        const name = isHabit ? item.habit?.name : item.todo?.title;
        const areaName = isHabit ? item.habit?.lifeArea : item.todo?.lifeArea;
        const life = LIFE_AREAS.find((a) => a.name === areaName);
        return (
          <div
            className="px-3 py-2 rounded-xl border text-sm shadow-md"
            style={{
              borderColor: life?.color || "#a78bfa",
              backgroundColor: `${life?.color || "#a78bfa"}22`,
            }}
          >
            {name}
          </div>
        );
      }} */}
    // </Preview>
  //);

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {/* <DragPreview /> */}
      <div className="min-h-screen pb-24">

        {/* header */}
        <div className="flow-card">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {onNavigate && (
                <button
                  onClick={() => onNavigate("home")}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-gray-900 flex items-center gap-2 text-lg sm:text-xl">
                  <Clock size={22} style={{ color: themeColors.primary }} />
                  Time Flow
                </h1>
                <p className="text-xs sm:text-sm opacity-60">15-minute visual scheduler</p>
              </div>
            </div>

            {/* Desktop: toggle sidebar — Mobile: open sheet */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSheetOpen(true)}
                className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm"
                style={{ backgroundColor: themeColors.primary, color: "white" }}
              >
                <Plus size={16} />
                Add
              </button>
              <button
                onClick={() => setShowSidebar((v) => !v)}
                className="hidden sm:inline-flex px-4 py-2 rounded-2xl text-sm transition-all"
                style={{
                  backgroundColor: showSidebar ? themeColors.primary : "#f3f4f6",
                  color: showSidebar ? "white" : "#374151",
                }}
              >
                {showSidebar ? "Hide" : "Show"} Sidebar
              </button>
            </div>
          </div>

          {/* legend */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {LIFE_AREAS.map((area) => (
              <div
                key={area.name}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs whitespace-nowrap"
                style={{ backgroundColor: `${area.color}20`, border: `1px solid ${area.color}40` }}
              >
                <span style={{ color: area.color }}>{area.icon}</span>
                <span>{area.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="flex gap-4 sm:gap-6 p-4 sm:p-6">

          {/* sidebar (desktop only) */}
          {showSidebar && (
            <div className="hidden sm:block w-80 flex-shrink-0 space-y-4">
              {!!habits.length && (
                <div className="flow-card">
                  <h3 className="text-sm opacity-70 mb-3 flex items-center gap-2">
                    <Sparkles size={16} style={{ color: themeColors.primary }} />
                    Your Habits
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-1">
                    {habits.slice(0, 20).map((h) => (
                      <DraggableHabit key={h.id} habit={h} />
                    ))}
                  </div>
                </div>
              )}

              {!!todos.length && (
                <div className="flow-card">
                  <h3 className="text-sm opacity-70 mb-3 flex items-center gap-2">
                    <Calendar size={16} style={{ color: themeColors.primary }} />
                    Today’s Tasks
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-1">
                    {/* {todos.slice(0, 20).map((t) => (
                      <DraggableTodo key={t.id} todo={t} />
                    ))} */}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-3xl p-4 border border-lavender-200">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-lavender-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs opacity-80">
                    Drag a habit or task onto a 15-minute slot to schedule it. Colored bars show life-area balance.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* timeline */}
          <div className="flex-1 flow-card">
            <div className="space-y-1">
              {/* {SLOTS.map((slot) => (
                <TimeSlot
                  key={slot.key}
                  slot={slot}
                  blocks={getBlocksForSlot(slot.startTime)}
                  onDrop={handleDrop}
                  onRemove={handleRemoveBlock}
                />
              ))} */}
            </div>
          </div>
        </div>

        {/* mobile add sheet */}
        <BottomSheet />
      </div>
    </DndProvider>
  );
}
