import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from '../components/ThemeContext';
import { Plus, Calendar as CalendarIcon, GripVertical, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle, ArrowRight, Heart, Briefcase, Users, TrendingUp, Palette, Home as HomeIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';

type ViewType = 'day' | '3day' | 'week' | 'month';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // "HH:MM" format
  duration: number; // in minutes
  type: 'todo' | 'event';
  color: string;
  lifeArea?: string;
  source?: 'google' | 'local' | 'todo';
  completed?: boolean;
  date?: string; // "YYYY-MM-DD" format for multi-day views
}

interface LifeAreaBalance {
  area: string;
  color: string;
  icon: any;
  hours: number;
  percentage: number;
}

const LIFE_AREAS = [
  { name: 'Health', color: '#D8B4FE', icon: Heart },
  { name: 'Work', color: '#FBBF24', icon: Briefcase },
  { name: 'Relationships', color: '#FCA5A5', icon: Users },
  { name: 'Personal Growth', color: '#A5B4FC', icon: TrendingUp },
  { name: 'Creativity', color: '#FCD34D', icon: Palette },
  { name: 'Home', color: '#A7F3D0', icon: HomeIcon },
];

interface DraggableEventProps {
  event: CalendarEvent;
  onDrop: (eventId: string, newTime: string, date?: string) => void;
  onToggleComplete: (eventId: string) => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  onConvertToEvent: (eventId: string) => void;
  hasConflict: boolean;
  conflictCount?: number;
  viewType: ViewType;
  compact?: boolean;
}

function DraggableEvent({ event, onDrop, onToggleComplete, onEdit, onDelete, onConvertToEvent, hasConflict, conflictCount, viewType, compact = false }: DraggableEventProps) {
  const [showActions, setShowActions] = useState(false);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { id: event.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ time: string; date?: string }>();
      if (item && dropResult) {
        onDrop(item.id, dropResult.time, dropResult.date);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [event.id, onDrop]);

  const heightInPixels = viewType === 'month' ? 'auto' : (event.duration / 15) * 20; // 20px per 15 min
  
  // Get life area color or default
  const lifeArea = LIFE_AREAS.find(area => area.name === event.lifeArea);
  const areaColor = lifeArea?.color || (event.type === 'event' ? '#60a5fa' : '#a78bfa');
  
  const conflictStyle = hasConflict ? 'ring-2 ring-amber-400' : '';
  const completedStyle = event.completed ? 'opacity-50' : '';

  // Compact view for week/month
  if (viewType === 'week' || viewType === 'month') {
    return (
      <div
        //ref={drag}
        onClick={() => onEdit(event)}
        className={`rounded-lg border-l-4 px-2 py-1 mb-1 cursor-pointer text-xs ${conflictStyle} ${completedStyle} ${
          isDragging ? 'opacity-50' : 'hover:shadow-sm'
        } transition-all relative`}
        style={{
          borderColor: areaColor,
          backgroundColor: `${areaColor}20`,
        }}
      >
        <div className="flex items-center gap-1.5">
          {event.type === 'todo' && (
            <Checkbox
              checked={event.completed || false}
              onCheckedChange={() => onToggleComplete(event.id)}
              className="h-3 w-3"
              style={{ borderColor: areaColor }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className={`truncate ${event.completed ? 'line-through' : ''}`}>
              <span className="opacity-70">{event.startTime}</span> {event.title}
            </div>
          </div>
          {hasConflict && conflictCount && conflictCount > 1 && (
            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-amber-100 rounded text-amber-700">
              <AlertTriangle size={10} />
              <span className="text-[10px]">{conflictCount}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full view for day/3day
  return (
    <div
      //ref={drag}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`absolute ${compact ? 'left-0 right-1' : 'left-16 right-2'} rounded-xl border-l-4 p-2 cursor-move transition-all duration-200 ${conflictStyle} ${completedStyle} ${
        isDragging ? 'opacity-50 scale-95' : 'shadow-sm hover:shadow-md'
      }`}
      style={{ 
        height: `${heightInPixels}px`,
        minHeight: '40px',
        borderColor: areaColor,
        backgroundColor: `${areaColor}20`,
      }}
    >
      {/* Conflict Badge */}
      {hasConflict && conflictCount && conflictCount > 1 && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-amber-400 text-white rounded-full text-xs shadow-md z-10">
          <AlertTriangle size={12} />
          <span>{conflictCount} conflicts</span>
        </div>
      )}

      <div className="flex items-start gap-2 h-full">
        <GripVertical size={14} className="opacity-40 flex-shrink-0 mt-0.5" />
        
        {event.type === 'todo' && (
          <Checkbox
            checked={event.completed || false}
            onCheckedChange={() => onToggleComplete(event.id)}
            className="mt-0.5 flex-shrink-0 h-4 w-4"
            style={{ borderColor: areaColor }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className={`text-sm truncate ${event.completed ? 'line-through' : ''}`}>{event.title}</div>
          <div className="text-xs opacity-60 truncate flex items-center gap-2">
            <span>{event.startTime} • {event.duration}min</span>
            {event.lifeArea && (
              <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${areaColor}30` }}>
                {event.lifeArea}
              </span>
            )}
          </div>
        </div>
        
        {showActions && event.source !== 'google' && (
          <div className="flex gap-1 flex-shrink-0">
            {event.type === 'todo' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConvertToEvent(event.id);
                }}
                className="p-1 hover:flow-card"
                title="Convert to Event"
              >
                <ArrowRight size={12} className="opacity-60" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="p-1 hover:flow-card"
            >
              <Edit2 size={12} className="opacity-60" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="p-1 hover:flow-card"
            >
              <Trash2 size={12} className="opacity-60" />
            </button>
          </div>
        )}
        
        {!showActions && event.type === 'event' && (
          <CalendarIcon size={14} className="opacity-40 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

interface TimeSlotProps {
  hour: number;
  minute: number;
  onDrop: (time: string, date?: string) => void;
  date?: string;
  showLabel?: boolean;
}

function TimeSlot({ hour, minute, onDrop, date, showLabel = true }: TimeSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'event',
    drop: () => ({ 
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      date 
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [hour, minute, date]);

  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const showTimeLabel = showLabel && minute === 0;

  return (
    <div
      //ref={drop}
      className={`relative h-5 border-b transition-colors ${
        minute === 0 ? 'border-gray-300' : 'border-[var(--color-ring-offset-background)]'
      } ${isOver ? 'bg-lavender-50' : ''}`}
    >
      {showTimeLabel && (
        <div className="absolute left-0 -top-2.5 text-xs opacity-60 w-14 pr-2 text-right flow-card">
          {hour.toString().padStart(2, '0')}:00
        </div>
      )}
    </div>
  );
}

export function CalendarScreen() {
  const { themeColors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('day');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lifeAreaBalance, setLifeAreaBalance] = useState<LifeAreaBalance[]>([]);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('flowstate-calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0 || localStorage.getItem('flowstate-calendar-events')) {
      localStorage.setItem('flowstate-calendar-events', JSON.stringify(events));
    }
    calculateLifeAreaBalance();
  }, [events]);

  // Calculate Smart Balance
  const calculateLifeAreaBalance = () => {
    const today = currentDate.toISOString().split('T')[0];
    const todayEvents = events.filter(e => {
      const eventDate = e.date || today;
      return eventDate === today;
    });

    const balanceMap = new Map<string, number>();
    let totalMinutes = 0;

    todayEvents.forEach(event => {
      if (event.lifeArea) {
        const current = balanceMap.get(event.lifeArea) || 0;
        balanceMap.set(event.lifeArea, current + event.duration);
        totalMinutes += event.duration;
      }
    });

    const balance: LifeAreaBalance[] = LIFE_AREAS.map(area => {
      const minutes = balanceMap.get(area.name) || 0;
      const hours = Math.round((minutes / 60) * 10) / 10;
      const percentage = totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;
      
      return {
        area: area.name,
        color: area.color,
        icon: area.icon,
        hours,
        percentage,
      };
    });

    setLifeAreaBalance(balance.filter(b => b.hours > 0));
  };

  const handleDrop = (eventId: string, newTime: string, date?: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return { 
          ...event, 
          startTime: newTime,
          date: date || event.date
        };
      }
      return event;
    }));
    toast.success('Event moved');
  };

  const handleToggleComplete = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return { ...event, completed: !event.completed };
      }
      return event;
    }));
  };

  const handleConvertToEvent = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId && event.type === 'todo') {
        toast.success('Converted to event');
        return { ...event, type: 'event' as const };
      }
      return event;
    }));
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDelete = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast.success('Event deleted');
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (editingEvent) {
      setEvents(events.map(e => 
        e.id === editingEvent.id ? { ...e, ...eventData } : e
      ));
      toast.success('Event updated');
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventData.title || 'New Event',
        startTime: eventData.startTime || '09:00',
        duration: eventData.duration || 60,
        type: eventData.type || 'event',
        color: eventData.color || themeColors.primary,
        lifeArea: eventData.lifeArea,
        source: 'local',
        date: currentDate.toISOString().split('T')[0],
      };
      setEvents([...events, newEvent]);
      toast.success('Event created');
    }
    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  // Check for conflicts
  const getConflicts = (event: CalendarEvent) => {
    const eventDate = event.date || currentDate.toISOString().split('T')[0];
    const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
    const eventStart = eventHour * 60 + eventMinute;
    const eventEnd = eventStart + event.duration;

    const conflicts = events.filter(e => {
      if (e.id === event.id) return false;
      const eDate = e.date || currentDate.toISOString().split('T')[0];
      if (eDate !== eventDate) return false;

      const [eHour, eMinute] = e.startTime.split(':').map(Number);
      const eStart = eHour * 60 + eMinute;
      const eEnd = eStart + e.duration;

      return (eventStart < eEnd && eventEnd > eStart);
    });

    return conflicts;
  };

  const getEventsForTimeSlot = (hour: number, minute: number, date?: string) => {
    const targetDate = date || currentDate.toISOString().split('T')[0];
    const timeInMinutes = hour * 60 + minute;

    return events.filter(event => {
      const eventDate = event.date || targetDate;
      if (eventDate !== targetDate) return false;

      const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
      const eventStart = eventHour * 60 + eventMinute;
      const eventEnd = eventStart + event.duration;

      return timeInMinutes >= eventStart && timeInMinutes < eventEnd;
    }).sort((a, b) => {
      const [aHour, aMinute] = a.startTime.split(':').map(Number);
      const [bHour, bMinute] = b.startTime.split(':').map(Number);
      return (aHour * 60 + aMinute) - (bHour * 60 + bMinute);
    });
  };

  const renderDayView = (date: Date, compact = false) => {
    const dateStr = date.toISOString().split('T')[0];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="relative">
        {hours.map(hour => (
          <div key={hour} className="relative">
            {[0, 15, 30, 45].map(minute => {
              const events = getEventsForTimeSlot(hour, minute, dateStr);
              const showEvent = minute === 0 && events.length > 0;

              return (
                <div key={minute} className="relative">
                  <TimeSlot 
                    hour={hour} 
                    minute={minute} 
                    onDrop={handleDrop}
                    date={dateStr}
                    showLabel={!compact}
                  />
                  {showEvent && events.map((event, index) => {
                    const conflicts = getConflicts(event);
                    return (
                      <DraggableEvent
                        key={event.id}
                        event={event}
                        onDrop={handleDrop}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onConvertToEvent={handleConvertToEvent}
                        hasConflict={conflicts.length > 0}
                        conflictCount={conflicts.length + 1}
                        viewType="day"
                        compact={compact}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen pb-24" style={{ backgroundColor: themeColors.background }}>
        {/* Header */}
        <div className="flow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 flex items-center gap-2">
                <CalendarIcon size={24} style={{ color: themeColors.primary }} />
                Calendar
              </h1>
              <p className="text-sm opacity-60">
                {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsDialogOpen(true);
              }}
              className="p-3 rounded-2xl transition-all"
              style={{ backgroundColor: themeColors.primary, color: 'white' }}
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-2xl text-sm bg-gray-100 hover:bg-gray-200"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Smart Balance Status */}
          {lifeAreaBalance.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm opacity-70 mb-2">Smart Balance</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {lifeAreaBalance.map(balance => {
                  const Icon = balance.icon;
                  const status = balance.hours >= 2 ? 'full' : balance.hours >= 1 ? 'balanced' : 'empty';
                  const statusColor = status === 'full' ? '#10b981' : status === 'balanced' ? '#f59e0b' : '#ef4444';
                  
                  return (
                    <motion.div
                      key={balance.area}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm whitespace-nowrap"
                      style={{
                        backgroundColor: `${balance.color}20`,
                        border: `1px solid ${balance.color}40`,
                      }}
                    >
                      <Icon size={14} style={{ color: balance.color }} />
                      <span>{balance.area}</span>
                      <span className="opacity-60">{balance.hours}h</span>
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: statusColor }}
                        title={status}
                      />
                    </ motion.div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-2 text-xs opacity-60">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Full (2h+)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Balanced (1-2h)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Empty (&lt;1h)</span>
                </div>
              </div>
            </div>
          )}

          {/* View Tabs */}
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)}>
            <TabsList className="w-full">
              <TabsTrigger value="day" className="flex-1">Day</TabsTrigger>
              <TabsTrigger value="3day" className="flex-1">3 Day</TabsTrigger>
              <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar View */}
        <ScrollArea className="h-[calc(100vh-340px)]">
          <div className="px-6 py-4">
            {viewType === 'day' && renderDayView(currentDate)}
            
            {viewType === '3day' && (
              <div className="grid grid-cols-3 gap-4">
                {[-1, 0, 1].map(offset => {
                  const date = new Date(currentDate.getTime() + offset * 86400000);
                  return (
                    <div key={offset}>
                      <h3 className="text-sm mb-2 sticky top-0 flow-card">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h3>
                      {renderDayView(date, true)}
                    </div>
                  );
                })}
              </div>
            )}

            {viewType === 'week' && (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date(currentDate);
                  date.setDate(date.getDate() - date.getDay() + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const dayEvents = events.filter(e => (e.date || dateStr) === dateStr);

                  return (
                    <div key={i} className="min-h-[200px]">
                      <h3 className="text-sm mb-2 sticky top-0 flow-card">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h3>
                      <div className="space-y-1">
                        {dayEvents.map(event => {
                          const conflicts = getConflicts(event);
                          return (
                            <DraggableEvent
                              key={event.id}
                              event={event}
                              onDrop={handleDrop}
                              onToggleComplete={handleToggleComplete}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onConvertToEvent={handleConvertToEvent}
                              hasConflict={conflicts.length > 0}
                              conflictCount={conflicts.length + 1}
                              viewType="week"
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Event Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
              <DialogDescription>
                {editingEvent?.type === 'todo' ? 'Convert task to event or edit details' : 'Add event to your calendar'}
              </DialogDescription>
            </DialogHeader>
            <EventForm
              event={editingEvent}
              onSave={handleSaveEvent}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}

function EventForm({ 
  event, 
  onSave, 
  onCancel 
}: { 
  event: CalendarEvent | null;
  onSave: (data: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(event?.title || '');
  const [startTime, setStartTime] = useState(event?.startTime || '09:00');
  const [duration, setDuration] = useState(event?.duration || 60);
  const [type, setType] = useState<'todo' | 'event'>(event?.type || 'event');
  const [lifeArea, setLifeArea] = useState(event?.lifeArea || '');

  const handleSubmit = () => {
    onSave({ title, startTime, duration, type, lifeArea });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Time</Label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <Label>Duration (min)</Label>
          <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as 'todo' | 'event')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="todo">Task</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Life Area</Label>
        <Select value={lifeArea} onValueChange={setLifeArea}>
          <SelectTrigger>
            <SelectValue placeholder="Select life area" />
          </SelectTrigger>
          <SelectContent>
            {LIFE_AREAS.map(area => (
              <SelectItem key={area.name} value={area.name}>{area.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </div>
  );
}
