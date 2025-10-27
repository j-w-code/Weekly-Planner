import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { startOfWeek, endOfWeek, addWeeks, format, addDays, parseISO } from 'date-fns';
import DayColumn from './DayColumn';
import EventDetailsModal from './EventDetailsModal';
import AddEventForm from './AddEventForm';
import SequenceManager from './SequenceManager';
import { APP_CONFIG } from '../config';
import './WeeklyPlanner.css';

function WeeklyPlanner() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Memoize week calculations
  const weekStart = useMemo(
    () => startOfWeek(currentWeek, { weekStartsOn: APP_CONFIG.weekStartsOn }),
    [currentWeek]
  );
  
  const weekEnd = useMemo(
    () => endOfWeek(currentWeek, { weekStartsOn: APP_CONFIG.weekStartsOn }),
    [currentWeek]
  );
  
  // Memoize weekDays array to prevent recalculation
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: APP_CONFIG.calendarId,
        timeMin: weekStart.toISOString(),
        timeMax: weekEnd.toISOString(),
        maxResults: APP_CONFIG.maxResults,
        showDeleted: APP_CONFIG.showDeleted,
        singleEvents: APP_CONFIG.singleEvents,
        orderBy: APP_CONFIG.orderBy,
      });

      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Error fetching events:', process.env.NODE_ENV === 'development' ? error : 'API Error');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [weekStart, weekEnd]);
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Memoize navigation handlers
  const handlePreviousWeek = useCallback(() => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, -1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentWeek(new Date());
  }, []);

  // Memoize getEventsForDay function
  const getEventsForDay = useCallback((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(event => {
      const eventStart = event.start.dateTime || event.start.date;
      const eventDayStr = format(parseISO(eventStart), 'yyyy-MM-dd');
      return eventDayStr === dayStr;
    });
  }, [events]);

  // Memoize event handlers
  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleAddEventClick = useCallback((date) => {
    setSelectedDate(date);
    setShowAddEvent(true);
  }, []);

  const handleAddEvent = useCallback(async (eventData) => {
    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: APP_CONFIG.calendarId,
        resource: eventData,
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('Event created:', response.result);
      }
      await fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error creating event:', process.env.NODE_ENV === 'development' ? error : 'Creation failed');
      throw error;
    }
  }, [fetchEvents]);

  const handleDeleteEvent = useCallback(async (eventId) => {
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: APP_CONFIG.calendarId,
        eventId: eventId,
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('Event deleted:', eventId);
      }
      setSelectedEvent(null);
      await fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error deleting event:', process.env.NODE_ENV === 'development' ? error : 'Deletion failed');
      alert('Failed to delete event. Please try again.');
    }
  }, [fetchEvents]);

  return (
    <div className="weekly-planner" role="main">
      <SequenceManager weekStart={weekStart} weekDays={weekDays} />
      
      <nav className="planner-header" aria-label="Week navigation">
        <button 
          onClick={handlePreviousWeek} 
          className="nav-button"
          aria-label="Go to previous week"
          type="button"
        >
          ← Previous
        </button>
        <div className="week-info">
          <h2 id="current-week">{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</h2>
          <button 
            onClick={handleToday} 
            className="today-button"
            aria-label="Go to current week"
            type="button"
          >
            Today
          </button>
        </div>
        <button 
          onClick={handleNextWeek} 
          className="nav-button"
          aria-label="Go to next week"
          type="button"
        >
          Next →
        </button>
        <button 
          onClick={() => handleAddEventClick(new Date())} 
          className="add-event-button"
          aria-label="Add new event"
          type="button"
        >
          + Add Event
        </button>
      </nav>

      {loading ? (
        <div 
          className="loading" 
          role="status" 
          aria-live="polite" 
          aria-busy="true"
        >
          Loading events...
        </div>
      ) : (
        <div className="week-grid">
          {weekDays.map(day => (
            <DayColumn
              key={day.toISOString()}
              day={day}
              events={getEventsForDay(day)}
              isToday={format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
              onEventClick={handleEventClick}
              onAddEventClick={handleAddEventClick}
            />
          ))}
        </div>
      )}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}
      {showAddEvent && (
        <AddEventForm
          onClose={() => setShowAddEvent(false)}
          onAddEvent={handleAddEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default WeeklyPlanner;
