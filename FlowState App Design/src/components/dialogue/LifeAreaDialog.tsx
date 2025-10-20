import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { TodoCard } from '../card/TodoCard';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui/input';

interface LifeAreaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lifeArea: {
    id: string;
    icon: string;
    title: string;
    color: string;
    progress: number;
    currentHabits: string[];
  };
}

interface LifeAreaTodo {
  id: number;
  title: string;
  completed: boolean;
  lifeAreaId: string;
  completedAt?: string;
}

export function LifeAreaDialog({ isOpen, onClose, lifeArea }: LifeAreaDialogProps) {
  const [todos, setTodos] = useState<LifeAreaTodo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  // Load todos for this life area
  useEffect(() => {
    if (isOpen) {
      const allTodos = JSON.parse(localStorage.getItem('flowstate-life-area-todos') || '[]');
      const areaTodos = allTodos.filter((t: LifeAreaTodo) => t.lifeAreaId === lifeArea.id);
      setTodos(areaTodos);
    }
  }, [isOpen, lifeArea.id]);

  // Save todos to localStorage
  useEffect(() => {
    const allTodos = JSON.parse(localStorage.getItem('flowstate-life-area-todos') || '[]');
    const otherTodos = allTodos.filter((t: LifeAreaTodo) => t.lifeAreaId !== lifeArea.id);
    const updatedTodos = [...otherTodos, ...todos];
    localStorage.setItem('flowstate-life-area-todos', JSON.stringify(updatedTodos));
  }, [todos, lifeArea.id]);

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const isCompleting = !todo.completed;
          return {
            ...todo,
            completed: isCompleting,
            completedAt: isCompleting ? new Date().toISOString() : undefined,
          };
        }
        return todo;
      })
    );
  };

  const addTodo = () => {
    if (newTodoTitle.trim()) {
      const newTodo: LifeAreaTodo = {
        id: Date.now(),
        title: newTodoTitle,
        completed: false,
        lifeAreaId: lifeArea.id,
      };
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
      setShowAddInput(false);
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{lifeArea.icon}</span>
            <span>{lifeArea.title}</span>
          </DialogTitle>
          <DialogDescription>
            Manage your goals and habits for this life area
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-60">Progress this week</div>
              <div className="text-sm">{progress}%</div>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: `${lifeArea.color}20` }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: lifeArea.color }}
              />
            </div>
            <div className="text-xs opacity-50 mt-2">
              {completedCount} of {totalCount} completed
            </div>
          </div>

          {/* Todos List */}
          <div className="mb-4">
            <h4 className="mb-3 text-sm opacity-70">Tasks & Habits</h4>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {todos.length === 0 ? (
                <div className="text-center py-8 opacity-50 text-sm">
                  No tasks yet. Add one to get started!
                </div>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <TodoCard
                        title={todo.title}
                        completed={todo.completed}
                        onToggle={() => toggleTodo(todo.id)}
                      />
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={16} className="opacity-40" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add New Todo */}
          {showAddInput ? (
            <div className="flex gap-2">
              <Input
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="New task or habit..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTodo();
                  if (e.key === 'Escape') {
                    setShowAddInput(false);
                    setNewTodoTitle('');
                  }
                }}
                autoFocus
                className="flex-1"
              />
              <button
                onClick={addTodo}
                className="px-4 py-2 rounded-2xl text-white"
                style={{ backgroundColor: lifeArea.color }}
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddInput(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 opacity-60 hover:opacity-100"
            >
              <Plus size={18} />
              <span>Add new task</span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
