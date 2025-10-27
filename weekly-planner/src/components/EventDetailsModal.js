import React, { useEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import './EventDetailsModal.css';

function EventDetailsModal({ event, onClose, onDelete }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!event) return;
    
    // Focus close button when modal opens
    closeButtonRef.current?.focus();
    
    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Trap focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);
  
  if (!event) return null;

  const getEventTime = () => {
    if (event.start.dateTime) {
      const start = parseISO(event.start.dateTime);
      const end = parseISO(event.end.dateTime);
      return `${format(start, 'EEEE, MMMM d, yyyy')} at ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
    return `${format(parseISO(event.start.date), 'EEEE, MMMM d, yyyy')} (All day)`;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2 id="modal-title">{event.summary || '(No title)'}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Close event details"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="event-detail">
            <strong>🕒 Time:</strong>
            <p>{getEventTime()}</p>
          </div>
          {event.location && (
            <div className="event-detail">
              <strong>📍 Location:</strong>
              <p>{event.location}</p>
            </div>
          )}
          {event.description && (
            <div className="event-detail">
              <strong>📝 Description:</strong>
              <p>{event.description}</p>
            </div>
          )}
          {event.attendees && event.attendees.length > 0 && (
            <div className="event-detail">
              <strong>👥 Attendees:</strong>
              <ul>
                {event.attendees.map((attendee, index) => (
                  <li key={index}>{attendee.email}</li>
                ))}
              </ul>
            </div>
          )}
          {event.htmlLink && (
            <div className="event-detail">
              <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                Open in Google Calendar
              </a>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="delete-button" 
            onClick={handleDelete}
            aria-label={`Delete event: ${event.summary || 'untitled event'}`}
            type="button"
          >
            <span aria-hidden="true">🗑️</span> Delete Event
          </button>
          <button 
            className="cancel-button" 
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;
