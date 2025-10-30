import React, { useState, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSidebar } from '../contexts/SidebarContext';
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
} from '../types/calendar';

const CalendarPage: React.FC = () => {
  const { hasPermission } = useUser();
  const { isCollapsed } = useSidebar();
  const [currentView, setCurrentView] = useState<CalendarView['type']>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);

  const pageStyles: React.CSSProperties = {
    marginLeft: isCollapsed ? '80px' : '280px',
    minHeight: '100vh',
    background: '#F4F6F8',
    transition: 'margin-left 0.3s ease',
  };

  const breadcrumbStyles: React.CSSProperties = {
    padding: '12px 24px',
    background: '#FFFFFF',
    borderBottom: '1px solid #F4F6F8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280',
  };

  const breadcrumbLinkStyles: React.CSSProperties = {
    color: '#0056D2',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const headerStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    margin: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '16px',
    color: '#6B7280',
    margin: '0 0 24px 0',
  };

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const viewToggleStyles: React.CSSProperties = {
    display: 'flex',
    background: '#F3F4F6',
    borderRadius: '8px',
    padding: '4px',
  };

  const viewButtonStyles: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const activeViewButtonStyles: React.CSSProperties = {
    ...viewButtonStyles,
    background: '#FFFFFF',
    color: '#111827',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const navigationStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const navButtonStyles: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const dateDisplayStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    minWidth: '200px',
    textAlign: 'center',
  };

  const contentStyles: React.CSSProperties = {
    padding: '0 24px 24px 24px',
  };

  const calendarGridStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  };

  const monthHeaderStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    marginBottom: '8px',
  };

  const dayHeaderStyles: React.CSSProperties = {
    padding: '12px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
    background: '#F9FAFB',
    borderRadius: '6px',
  };

  const monthGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    minHeight: '500px',
  };

  const dayCellStyles: React.CSSProperties = {
    minHeight: '80px',
    padding: '8px',
    border: '1px solid #F3F4F6',
    background: '#FFFFFF',
    borderRadius: '6px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const todayCellStyles: React.CSSProperties = {
    ...dayCellStyles,
    background: '#EFF6FF',
    borderColor: '#3B82F6',
  };

  const otherMonthCellStyles: React.CSSProperties = {
    ...dayCellStyles,
    background: '#F9FAFB',
    color: '#9CA3AF',
  };

  const dayNumberStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  };

  const otherMonthDayNumberStyles: React.CSSProperties = {
    ...dayNumberStyles,
    color: '#9CA3AF',
  };

  const eventStyles: React.CSSProperties = {
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '4px',
    marginBottom: '2px',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: '500',
  };

  const sprintCardStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
    border: '1px solid #F4F6F8',
  };

  const sprintHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  };

  const sprintTitleStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  };

  const sprintStatusStyles: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const sprintMetaStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px',
  };

  const sprintProgressStyles: React.CSSProperties = {
    marginBottom: '12px',
  };

  const progressBarStyles: React.CSSProperties = {
    width: '100%',
    height: '8px',
    background: '#F3F4F6',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  };

  const progressFillStyles: React.CSSProperties = {
    height: '100%',
    background: '#3B82F6',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  };

  const progressTextStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500',
  };

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const getSprintsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockSprints.filter(sprint => {
      const startDate = new Date(sprint.startDate).toISOString().split('T')[0];
      const endDate = new Date(sprint.endDate).toISOString().split('T')[0];
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      days.push(
        <div key={`prev-${day}`} style={otherMonthCellStyles}>
          <div style={otherMonthDayNumberStyles}>{day}</div>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const events = getEventsForDate(date);
      const sprints = getSprintsForDate(date);

      days.push(
        <div 
          key={day} 
          style={isToday ? todayCellStyles : dayCellStyles}
          onMouseEnter={(e) => {
            if (!isToday) {
              e.currentTarget.style.background = '#F9FAFB';
            }
          }}
          onMouseLeave={(e) => {
            if (!isToday) {
              e.currentTarget.style.background = '#FFFFFF';
            }
          }}
        >
          <div style={dayNumberStyles}>{day}</div>
          {events.slice(0, 3).map(event => (
            <div
              key={event.id}
              style={{
                ...eventStyles,
                background: event.color,
                color: '#FFFFFF',
              }}
              onClick={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            >
              <span className="material-icons" style={{ fontSize: '10px', marginRight: '2px' }}>
                {getEventTypeIcon(event.type)}
              </span>
              {event.title}
            </div>
          ))}
          {events.length > 3 && (
            <div style={{ ...eventStyles, background: '#6B7280', color: '#FFFFFF' }}>
              +{events.length - 3} more
            </div>
          )}
          {sprints.length > 0 && (
            <div
              style={{
                ...eventStyles,
                background: '#8B5CF6',
                color: '#FFFFFF',
                fontWeight: '600',
              }}
              onClick={() => {
                setSelectedSprint(sprints[0]);
                setShowSprintModal(true);
              }}
            >
              <span className="material-icons" style={{ fontSize: '10px', marginRight: '2px' }}>
                sprint
              </span>
              {sprints[0].name}
            </div>
          )}
        </div>
      );
    }

    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} style={otherMonthCellStyles}>
          <div style={otherMonthDayNumberStyles}>{day}</div>
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
    // Calculate based on completed tasks or time elapsed
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  return (
    <div style={pageStyles}>
      <div style={breadcrumbStyles}>
        <span style={{ cursor: 'pointer' }}>←</span>
        <span style={breadcrumbLinkStyles}>Team spaces</span>
        <span>›</span>
        <span>Calendar</span>
      </div>

      <div style={headerStyles}>
        <h1 style={titleStyles}>Project Calendar</h1>
        <p style={subtitleStyles}>
          View sprints, deadlines, meetings, and project milestones
        </p>
        
        <div style={controlsStyles}>
          <div style={viewToggleStyles}>
            <button
              style={currentView === 'month' ? activeViewButtonStyles : viewButtonStyles}
              onClick={() => setCurrentView('month')}
            >
              Month
            </button>
            <button
              style={currentView === 'week' ? activeViewButtonStyles : viewButtonStyles}
              onClick={() => setCurrentView('week')}
            >
              Week
            </button>
            <button
              style={currentView === 'day' ? activeViewButtonStyles : viewButtonStyles}
              onClick={() => setCurrentView('day')}
            >
              Day
            </button>
            <button
              style={currentView === 'agenda' ? activeViewButtonStyles : viewButtonStyles}
              onClick={() => setCurrentView('agenda')}
            >
              Agenda
            </button>
          </div>

          <div style={navigationStyles}>
            <button
              style={navButtonStyles}
              onClick={() => navigateMonth('prev')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>chevron_left</span>
            </button>
            <div style={dateDisplayStyles}>
              {formatDate(currentDate)}
            </div>
            <button
              style={navButtonStyles}
              onClick={() => navigateMonth('next')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
            <button
              style={{
                ...navButtonStyles,
                background: '#2563EB',
                color: '#FFFFFF',
                padding: '8px 16px',
              }}
              onClick={() => setCurrentDate(new Date())}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1D4ED8'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2563EB'}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      <div style={contentStyles}>
        {currentView === 'month' && (
          <div style={calendarGridStyles}>
            <div style={monthHeaderStyles}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={dayHeaderStyles}>{day}</div>
              ))}
            </div>
            <div style={monthGridStyles}>
              {renderMonthView()}
            </div>
          </div>
        )}

        {/* Active Sprints Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
            Active Sprints
          </h2>
          {mockSprints.filter(sprint => sprint.status === 'active').map(sprint => (
            <div key={sprint.id} style={sprintCardStyles}>
              <div style={sprintHeaderStyles}>
                <div>
                  <h3 style={sprintTitleStyles}>{sprint.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>
                    {sprint.description}
                  </p>
                </div>
                <div
                  style={{
                    ...sprintStatusStyles,
                    color: getSprintStatusColor(sprint.status),
                    backgroundColor: getSprintStatusBgColor(sprint.status),
                  }}
                >
                  {sprint.status}
                </div>
              </div>
              
              <div style={sprintMetaStyles}>
                <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>event</span> {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>flag</span> {sprint.goal}</span>
                <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>group</span> {sprint.teamMembers.length} members</span>
                <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>assessment</span> Capacity: {sprint.capacity}h</span>
              </div>
              
              <div style={sprintProgressStyles}>
                <div style={progressBarStyles}>
                  <div 
                    style={{
                      ...progressFillStyles,
                      width: `${getSprintProgress(sprint)}%`,
                    }}
                  />
                </div>
                <div style={progressTextStyles}>
                  {Math.round(getSprintProgress(sprint))}% complete
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events Section */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
            Upcoming Events
          </h2>
          {mockCalendarEvents
            .filter(event => new Date(event.startDate) >= new Date())
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5)
            .map(event => (
              <div key={event.id} style={sprintCardStyles}>
                <div style={sprintHeaderStyles}>
                  <div>
                    <h3 style={sprintTitleStyles}>{event.title}</h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>
                      {event.description}
                    </p>
                  </div>
                  <div
                    style={{
                      ...sprintStatusStyles,
                      color: getEventTypeColor(event.type),
                      backgroundColor: `${getEventTypeColor(event.type)}20`,
                    }}
                  >
                    {event.type}
                  </div>
                </div>
                
                <div style={sprintMetaStyles}>
                  <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>event</span> {new Date(event.startDate).toLocaleDateString()}</span>
                  {event.location && <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>location_on</span> {event.location}</span>}
                  <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>person</span> {event.assignees.length} assignees</span>
                  <span><span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>bolt</span> {event.priority} priority</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;