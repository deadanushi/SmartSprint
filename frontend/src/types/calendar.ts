// Calendar types and data structures
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

// Mock calendar data
export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 - Foundation',
    description: 'Core infrastructure and authentication system',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    status: 'completed',
    goal: 'Establish project foundation and user authentication',
    capacity: 100,
    velocity: 85,
    tasks: ['task-1', 'task-2', 'task-3'],
    teamMembers: ['user-1', 'user-2', 'user-3'],
    createdBy: 'user-1',
    createdAt: '2024-01-10',
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2 - Core Features',
    description: 'Main application features and API development',
    startDate: '2024-01-30',
    endDate: '2024-02-13',
    status: 'active',
    goal: 'Develop core application features and API endpoints',
    capacity: 120,
    velocity: 0,
    tasks: ['task-4', 'task-5', 'task-6'],
    teamMembers: ['user-1', 'user-2', 'user-4', 'user-5'],
    createdBy: 'user-1',
    createdAt: '2024-01-25',
  },
  {
    id: 'sprint-3',
    name: 'Sprint 3 - Testing & Polish',
    description: 'Testing, bug fixes, and UI polish',
    startDate: '2024-02-14',
    endDate: '2024-02-28',
    status: 'planning',
    goal: 'Complete testing and polish user experience',
    capacity: 100,
    velocity: 0,
    tasks: ['task-7', 'task-8', 'task-9'],
    teamMembers: ['user-2', 'user-3', 'user-5', 'user-6'],
    createdBy: 'user-1',
    createdAt: '2024-02-01',
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  // Sprint Events
  {
    id: 'event-1',
    title: 'Sprint 1 Planning',
    description: 'Sprint planning meeting for Sprint 1',
    startDate: '2024-01-15T09:00:00',
    endDate: '2024-01-15T11:00:00',
    type: 'planning',
    priority: 'High',
    status: 'completed',
    assignees: ['user-1', 'user-2', 'user-3'],
    sprintId: 'sprint-1',
    color: '#3b82f6',
    isAllDay: false,
    location: 'Conference Room A',
  },
  {
    id: 'event-2',
    title: 'Sprint 1 Review',
    description: 'Sprint 1 review and demo',
    startDate: '2024-01-29T14:00:00',
    endDate: '2024-01-29T16:00:00',
    type: 'review',
    priority: 'High',
    status: 'completed',
    assignees: ['user-1', 'user-2', 'user-3'],
    sprintId: 'sprint-1',
    color: '#10b981',
    isAllDay: false,
    location: 'Conference Room A',
  },
  {
    id: 'event-3',
    title: 'Sprint 1 Retrospective',
    description: 'Sprint 1 retrospective meeting',
    startDate: '2024-01-29T16:30:00',
    endDate: '2024-01-29T17:30:00',
    type: 'retrospective',
    priority: 'Medium',
    status: 'completed',
    assignees: ['user-1', 'user-2', 'user-3'],
    sprintId: 'sprint-1',
    color: '#8b5cf6',
    isAllDay: false,
    location: 'Conference Room A',
  },
  {
    id: 'event-4',
    title: 'Sprint 2 Planning',
    description: 'Sprint planning meeting for Sprint 2',
    startDate: '2024-01-30T09:00:00',
    endDate: '2024-01-30T11:00:00',
    type: 'planning',
    priority: 'High',
    status: 'completed',
    assignees: ['user-1', 'user-2', 'user-4', 'user-5'],
    sprintId: 'sprint-2',
    color: '#3b82f6',
    isAllDay: false,
    location: 'Conference Room A',
  },
  {
    id: 'event-5',
    title: 'Sprint 2 Daily Standup',
    description: 'Daily standup meeting',
    startDate: '2024-02-05T09:00:00',
    endDate: '2024-02-05T09:30:00',
    type: 'meeting',
    priority: 'Medium',
    status: 'upcoming',
    assignees: ['user-1', 'user-2', 'user-4', 'user-5'],
    sprintId: 'sprint-2',
    color: '#f59e0b',
    isAllDay: false,
    location: 'Conference Room A',
  },
  {
    id: 'event-6',
    title: 'Sprint 2 Review',
    description: 'Sprint 2 review and demo',
    startDate: '2024-02-13T14:00:00',
    endDate: '2024-02-13T16:00:00',
    type: 'review',
    priority: 'High',
    status: 'upcoming',
    assignees: ['user-1', 'user-2', 'user-4', 'user-5'],
    sprintId: 'sprint-2',
    color: '#10b981',
    isAllDay: false,
    location: 'Conference Room A',
  },
  {
    id: 'event-7',
    title: 'Sprint 3 Planning',
    description: 'Sprint planning meeting for Sprint 3',
    startDate: '2024-02-14T09:00:00',
    endDate: '2024-02-14T11:00:00',
    type: 'planning',
    priority: 'High',
    status: 'upcoming',
    assignees: ['user-2', 'user-3', 'user-5', 'user-6'],
    sprintId: 'sprint-3',
    color: '#3b82f6',
    isAllDay: false,
    location: 'Conference Room A',
  },
  
  // Task Deadlines
  {
    id: 'event-8',
    title: 'User Authentication System - Deadline',
    description: 'Deadline for user authentication system implementation',
    startDate: '2024-01-25T17:00:00',
    endDate: '2024-01-25T17:00:00',
    type: 'task-deadline',
    priority: 'High',
    status: 'completed',
    assignees: ['user-1', 'user-2'],
    taskId: 'task-1',
    color: '#ef4444',
    isAllDay: true,
  },
  {
    id: 'event-9',
    title: 'Database Schema Design - Deadline',
    description: 'Deadline for database schema design',
    startDate: '2024-01-28T17:00:00',
    endDate: '2024-01-28T17:00:00',
    type: 'task-deadline',
    priority: 'High',
    status: 'completed',
    assignees: ['user-3', 'user-4'],
    taskId: 'task-2',
    color: '#ef4444',
    isAllDay: true,
  },
  {
    id: 'event-10',
    title: 'API Endpoints Development - Deadline',
    description: 'Deadline for API endpoints development',
    startDate: '2024-02-10T17:00:00',
    endDate: '2024-02-10T17:00:00',
    type: 'task-deadline',
    priority: 'High',
    status: 'upcoming',
    assignees: ['user-1', 'user-5'],
    taskId: 'task-3',
    color: '#ef4444',
    isAllDay: true,
  },
  {
    id: 'event-11',
    title: 'Frontend Dashboard UI - Deadline',
    description: 'Deadline for frontend dashboard UI',
    startDate: '2024-02-12T17:00:00',
    endDate: '2024-02-12T17:00:00',
    type: 'task-deadline',
    priority: 'Medium',
    status: 'upcoming',
    assignees: ['user-2', 'user-6'],
    taskId: 'task-4',
    color: '#f59e0b',
    isAllDay: true,
  },
  
  // Milestones
  {
    id: 'event-12',
    title: 'MVP Release',
    description: 'Minimum Viable Product release milestone',
    startDate: '2024-02-28T17:00:00',
    endDate: '2024-02-28T17:00:00',
    type: 'milestone',
    priority: 'High',
    status: 'upcoming',
    assignees: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    color: '#8b5cf6',
    isAllDay: true,
  },
  
  // Meetings
  {
    id: 'event-13',
    title: 'Architecture Review',
    description: 'Review system architecture and technical decisions',
    startDate: '2024-02-07T10:00:00',
    endDate: '2024-02-07T12:00:00',
    type: 'meeting',
    priority: 'Medium',
    status: 'upcoming',
    assignees: ['user-1', 'user-3', 'user-5'],
    color: '#06b6d4',
    isAllDay: false,
    location: 'Conference Room B',
  },
  {
    id: 'event-14',
    title: 'Client Demo',
    description: 'Demo progress to client stakeholders',
    startDate: '2024-02-20T14:00:00',
    endDate: '2024-02-20T15:00:00',
    type: 'meeting',
    priority: 'High',
    status: 'upcoming',
    assignees: ['user-1', 'user-2'],
    color: '#06b6d4',
    isAllDay: false,
    location: 'Conference Room A',
  },
];

// Helper functions
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

