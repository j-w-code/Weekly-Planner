import React from 'react';
import { format, parseISO } from 'date-fns';
import { isEventPast, isEventToday, getDateStatus } from '../utils/dateUtils';
import './EventCard.css';

const EventCard = React.memo(function EventCard({ event, onClick }) {
  const isPast = isEventPast(event);
  const isCurrentDay = isEventToday(event);
  const eventStart = event.start.dateTime || event.start.date;
  const status = getDateStatus(eventStart);
  
  const getEventTime = () => {
    if (event.start.dateTime) {
      const start = parseISO(event.start.dateTime);
      const end = parseISO(event.end.dateTime);
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
    return 'All day';
  };

  return (
    <button 
      className={`event-card ${isPast ? 'past-event' : ''} ${isCurrentDay ? 'today-event' : ''} event-status-${status}`}
      onClick={() => onClick(event)}
      style={{
        borderLeftColor: event.colorId ? `var(--color-${event.colorId})` : '#4285f4'
      }}
      aria-label={`${isPast ? 'Past event: ' : ''}${isCurrentDay ? 'Today: ' : ''}${event.summary || 'No title'} at ${getEventTime()}${event.location ? `, Location: ${event.location}` : ''}`}
      type="button"
    >
      <div className="event-time" aria-hidden="true">
        {isPast && <span className="past-indicator" title="Past Event">✓ </span>}
        {getEventTime()}
      </div>
      <div className="event-title" aria-hidden="true">{event.summary || '(No title)'}</div>
      {isPast && <div className="event-status-badge">Completed</div>}
      {event.location && (
        <div className="event-location" aria-hidden="true">
          <span aria-label="Location">📍</span> {event.location}
        </div>
      )}
      {event.description && (
        <div className="event-description" aria-hidden="true">{event.description}</div>
      )}
    </button>
  );
});

export default EventCard;
