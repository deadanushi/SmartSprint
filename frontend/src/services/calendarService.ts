export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: EventType;
  priority: 'Low' | 'Medium' | 'High';
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  assignees: string[];
  sprintId?: string;
  taskId?: string;
  meetingId?: string;
  color: string;
  isAllDay: boolean;
  location?: string;
  url?: string;
}

export type EventType = 
  | 'sprint'
  | 'task-deadline'
  | 'meeting'
  | 'milestone'
  | 'release'
  | 'holiday'
  | 'review'
  | 'retrospective'
  | 'planning';

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  goal: string;
  capacity: number;
  velocity: number;
  tasks: string[];
  teamMembers: string[];
  createdBy: string;
  createdAt: string;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

// Mock data for development
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Sprint Planning',
    description: 'Plan tasks for next sprint',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    type: 'planning',
    priority: 'High',
    status: 'upcoming',
    assignees: ['user-1', 'user-2'],
    color: '#3b82f6',
    isAllDay: false,
  },
];

export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1',
    description: 'First sprint',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    goal: 'Launch MVP',
    capacity: 100,
    velocity: 80,
    tasks: ['task-1', 'task-2'],
    teamMembers: ['user-1', 'user-2'],
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
  },
];

export const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case 'sprint': return '#3b82f6';
    case 'task-deadline': return '#ef4444';
    case 'meeting': return '#06b6d4';
    case 'milestone': return '#8b5cf6';
    case 'release': return '#10b981';
    case 'holiday': return '#f59e0b';
    case 'review': return '#10b981';
    case 'retrospective': return '#8b5cf6';
    case 'planning': return '#3b82f6';
    default: return '#6b7280';
  }
};

export const getEventTypeIcon = (type: EventType): string => {
  switch (type) {
    case 'sprint': return 'sprint';
    case 'task-deadline': return 'schedule';
    case 'meeting': return 'groups';
    case 'milestone': return 'flag';
    case 'release': return 'rocket_launch';
    case 'holiday': return 'celebration';
    case 'review': return 'rate_review';
    case 'retrospective': return 'psychology';
    case 'planning': return 'event_note';
    default: return 'event';
  }
};

export const getSprintStatusColor = (status: Sprint['status']): string => {
  switch (status) {
    case 'planning': return '#6b7280';
    case 'active': return '#10b981';
    case 'completed': return '#3b82f6';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getSprintStatusBgColor = (status: Sprint['status']): string => {
  switch (status) {
    case 'planning': return '#f9fafb';
    case 'active': return '#ecfdf5';
    case 'completed': return '#eff6ff';
    case 'cancelled': return '#fef2f2';
    default: return '#f9fafb';
  }
};
