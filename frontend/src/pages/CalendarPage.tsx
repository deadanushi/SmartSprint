import React, { useState } from 'react';
import clsx from 'clsx';
import { useUser } from '../contexts/UserContext';
import { 
  CalendarEvent, 
  Sprint, 
  CalendarView, 
  mockCalendarEvents, 
  mockSprints,
  getEventTypeColor,
  getEventTypeIcon,
  getSprintStatusColor,
  getSprintStatusBgColor
} from '../services/calendarService';

const CalendarPage: React.FC = () => {
  const { hasPermission } = useUser();
  const [currentView, setCurrentView] = useState<CalendarView['type']>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return mockCalendarEvents.filter((event: CalendarEvent) => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const getSprintsForDate = (date: Date): Sprint[] => {
    const dateStr = date.toISOString().split('T')[0];
    return mockSprints.filter((sprint: Sprint) => {
      const startDate = new Date(sprint.startDate).toISOString().split('T')[0];
      const endDate = new Date(sprint.endDate).toISOString().split('T')[0];
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div key={`prev-${day}`} className="calendar-day-cell calendar-day-other-month">
          <div className="calendar-day-number text-secondary">{day}</div>
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const events = getEventsForDate(date);
      const sprints = getSprintsForDate(date);

      days.push(
        <div 
          key={day} 
          className={clsx('calendar-day-cell', { 'calendar-day-today': isToday })}
        >
          <div className="calendar-day-number">{day}</div>
          {events.slice(0, 3).map((event: CalendarEvent) => (
            <div
              key={event.id}
              className="calendar-event-item text-white cursor-pointer"
              style={{ background: event.color }}
              onClick={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            >
              <span className="material-icons calendar-event-icon">{getEventTypeIcon(event.type)}</span>
              {event.title}
            </div>
          ))}
          {events.length > 3 && (
            <div className="calendar-event-item bg-secondary text-white">
              +{events.length - 3} more
            </div>
          )}
          {sprints.length > 0 && (
            <div
              className="calendar-event-item bg-primary text-white fw-semibold cursor-pointer"
              onClick={() => {
                setSelectedSprint(sprints[0]);
                setShowSprintModal(true);
              }}
            >
              <span className="material-icons calendar-event-icon">sprint</span>
              {sprints[0].name}
            </div>
          )}
        </div>
      );
    }

    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day-cell calendar-day-other-month">
          <div className="calendar-day-number text-secondary">{day}</div>
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getSprintProgress = (sprint: Sprint) => {
    if (sprint.status === 'completed') return 100;
    if (sprint.status === 'planning') return 0;
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  return (
      <div className="page-container">
      <div className="breadcrumb bg-white px-3 py-2 border-bottom d-flex align-items-center gap-2 small text-secondary">
        <span className="cursor-pointer">←</span>
        <span className="text-primary text-decoration-none cursor-pointer">Team spaces</span>
        <span>›</span>
        <span>Calendar</span>
      </div>

      <div className="bg-white rounded-3 p-4 m-3 shadow-sm">
        <h1 className="display-6 fw-bold text-dark mb-2">Project Calendar</h1>
        <p className="fs-6 text-secondary mb-4">
          View sprints, deadlines, meetings, and project milestones
        </p>
        
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="calendar-view-toggle bg-light rounded p-1 d-flex">
            {(['month', 'week', 'day', 'agenda'] as const).map(view => (
              <button
                key={view}
                className={clsx('btn btn-sm border-0 rounded', { 'bg-white shadow-sm fw-semibold': currentView === view, 'text-secondary': currentView !== view })}
                onClick={() => setCurrentView(view)}
                style={{ textTransform: 'capitalize' }}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm rounded" onClick={() => navigateMonth('prev')}>
              <span className="material-icons" style={{ fontSize: '18px' }}>chevron_left</span>
            </button>
            <div className="fw-semibold text-dark" style={{ minWidth: '200px', textAlign: 'center' }}>
              {formatDate(currentDate)}
            </div>
            <button className="btn btn-outline-secondary btn-sm rounded" onClick={() => navigateMonth('next')}>
              <span className="material-icons" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        {currentView === 'month' && (
          <div className="calendar-grid bg-white rounded-3 p-3 shadow-sm mb-4">
            <div className="calendar-month-header d-grid mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-day-header bg-light rounded p-2 text-center small fw-semibold text-secondary">{day}</div>
              ))}
            </div>
            <div className="calendar-month-grid d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', minHeight: '500px' }}>
              {renderMonthView()}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="h5 fw-semibold text-dark mb-3">Active Sprints</h2>
          {mockSprints.filter((sprint: Sprint) => sprint.status === 'active').map((sprint: Sprint) => (
            <div key={sprint.id} className="calendar-sprint-card bg-white rounded-3 p-4 shadow-sm border mb-3">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 className="h6 fw-semibold text-dark mb-1">{sprint.name}</h3>
                  <p className="small text-secondary mb-0">{sprint.description}</p>
                </div>
                <div
                  className="small fw-semibold rounded-pill px-2 py-1 text-uppercase"
                  style={{
                    color: getSprintStatusColor(sprint.status),
                    backgroundColor: getSprintStatusBgColor(sprint.status),
                  }}
                >
                  {sprint.status}
                </div>
              </div>
              
              <div className="d-flex gap-3 small text-secondary mb-3 flex-wrap">
                <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>event</span> {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>flag</span> {sprint.goal}</span>
                <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>group</span> {sprint.teamMembers.length} members</span>
                <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>assessment</span> Capacity: {sprint.capacity}h</span>
              </div>
              
              <div className="mb-2">
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar"
                    style={{ width: `${getSprintProgress(sprint)}%` }}
                  />
                </div>
                <div className="small text-secondary fw-medium mt-1">
                  {Math.round(getSprintProgress(sprint))}% complete
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="h5 fw-semibold text-dark mb-3">Upcoming Events</h2>
          {mockCalendarEvents
            .filter((event: CalendarEvent) => new Date(event.startDate) >= new Date())
            .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5)
            .map((event: CalendarEvent) => (
              <div key={event.id} className="calendar-sprint-card bg-white rounded-3 p-4 shadow-sm border mb-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="h6 fw-semibold text-dark mb-1">{event.title}</h3>
                    <p className="small text-secondary mb-0">{event.description}</p>
                  </div>
                  <div
                    className="small fw-semibold rounded-pill px-2 py-1"
                    style={{
                      color: getEventTypeColor(event.type),
                      backgroundColor: `${getEventTypeColor(event.type)}20`,
                    }}
                  >
                    {event.type}
                  </div>
                </div>
                
                <div className="d-flex gap-3 small text-secondary flex-wrap">
                  <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>event</span> {new Date(event.startDate).toLocaleDateString()}</span>
                  {event.location && <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>location_on</span> {event.location}</span>}
                  <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>person</span> {event.assignees.length} assignees</span>
                  <span><span className="material-icons align-middle" style={{ fontSize: '14px' }}>bolt</span> {event.priority} priority</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
