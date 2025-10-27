import React from 'react';
import { format } from 'date-fns';
import EventCard from './EventCard';
import { getDateStatus } from '../utils/dateUtils';
import './DayColumn.css';

const DayColumn = React.memo(function DayColumn({ day, events, isToday, onEventClick, onAddEventClick }) {
  const dayName = format(day, 'EEEE, MMMM d, yyyy');
  const eventCount = events.length;
  const dateStatus = getDateStatus(day);
  const isPast = dateStatus === 'past';
  
  return (
    <section 
      className={`day-column ${isToday ? 'today' : ''} ${isPast ? 'past-date' : ''} status-${dateStatus}`}
      aria-label={`${dayName}${isToday ? ' (Today)' : ''}${isPast ? ' (Past)' : ''}, ${eventCount} ${eventCount === 1 ? 'event' : 'events'}`}
    >
      <header className="day-header">
        <div className="day-name" aria-hidden="true">{format(day, 'EEE')}</div>
        <div className={`day-number ${isToday ? 'today-number' : ''}`} aria-hidden="true">
          {format(day, 'd')}
        </div>
        <button 
          className="day-add-button" 
          onClick={() => onAddEventClick(day)}
          aria-label={`Add event for ${dayName}`}
          type="button"
        >
          <span aria-hidden="true">+</span>
        </button>
      </header>
      <div className="events-container" role="list">
        {events.length === 0 ? (
          <div className="no-events" role="status" aria-live="polite">No events</div>
        ) : (
          events.map(event => (
            <div key={event.id} role="listitem">
              <EventCard event={event} onClick={onEventClick} />
            </div>
          ))
        )}
      </div>
    </section>
  );
});

export default DayColumn;
