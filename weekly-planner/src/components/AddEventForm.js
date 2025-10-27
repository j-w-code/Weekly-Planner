import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { isPastDate } from '../utils/dateUtils';
import './AddEventForm.css';

function AddEventForm({ onClose, onAddEvent, selectedDate }) {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    location: '',
    startDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    endTime: '10:00',
    isAllDay: false,
    notification: '10' // minutes before
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isPastEvent, setIsPastEvent] = useState(false);
  
  // Focus trap and keyboard navigation
  useEffect(() => {
    // Focus first input when modal opens
    firstInputRef.current?.focus();
    
    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
      
      // Trap focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
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
  }, [onClose, loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(newFormData);
    
    // Check if selected date is in the past
    if (name === 'startDate' || name === 'endDate') {
      const dateToCheck = name === 'startDate' ? value : newFormData.startDate;
      setIsPastEvent(isPastDate(dateToCheck));
    }
  };

  const validateForm = () => {
    // Reset validation error
    setValidationError('');
    
    // Check title
    if (!formData.summary || formData.summary.trim().length === 0) {
      setValidationError('Event title is required');
      return false;
    }
    
    if (formData.summary.length > 255) {
      setValidationError('Event title must be less than 255 characters');
      return false;
    }
    
    // Validate dates for non-all-day events
    if (!formData.isAllDay) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        setValidationError('End time must be after start time');
        return false;
      }
      
      // Check if event is not too long (more than 24 hours)
      const hoursDiff = (endDateTime - startDateTime) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        setValidationError('Event duration cannot exceed 24 hours. Use all-day event for longer events.');
        return false;
      }
    }
    
    // Validate end date is not before start date for all-day events
    if (formData.isAllDay) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        setValidationError('End date cannot be before start date');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const event = {
        summary: formData.summary,
        description: formData.description,
        location: formData.location,
      };

      if (formData.isAllDay) {
        event.start = {
          date: formData.startDate,
        };
        event.end = {
          date: formData.endDate,
        };
      } else {
        event.start = {
          dateTime: `${formData.startDate}T${formData.startTime}:00`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        event.end = {
          dateTime: `${formData.endDate}T${formData.endTime}:00`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }

      // Add notification/reminder
      if (formData.notification && !formData.isAllDay) {
        event.reminders = {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: parseInt(formData.notification) }
          ]
        };
      }

      // If the event is in the past, add a completed tag in description
      if (isPastEvent) {
        event.description = event.description 
          ? `[COMPLETED] ${event.description}`
          : '[COMPLETED] Added retrospectively';
      }

      await onAddEvent(event);
      onClose();
    } catch (error) {
      console.error('Error creating event:', process.env.NODE_ENV === 'development' ? error : 'Creation failed');
      setValidationError('Failed to create event. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => !loading && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-event-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2 id="add-event-title">Add New Event</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={loading}
            aria-label="Close add event form"
            type="button"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} aria-label="Add new calendar event">
          <div className="modal-body">
            {validationError && (
              <div 
                className="validation-error" 
                role="alert" 
                aria-live="assertive"
              >
                ⚠️ {validationError}
              </div>
            )}
            {isPastEvent && (
              <div className="past-event-warning" role="alert" aria-live="polite">
                You are creating an event in the past. It will be marked as completed.
              </div>
            )}
            <div className="form-group">
              <label htmlFor="summary">Event Title *</label>
              <input
                type="text"
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                placeholder="Enter event title"
                ref={firstInputRef}
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter event description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isAllDay"
                  checked={formData.isAllDay}
                  onChange={handleChange}
                />
                All day event
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {!formData.isAllDay && (
                <div className="form-group">
                  <label htmlFor="startTime">Start Time *</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {!formData.isAllDay && (
                <div className="form-group">
                  <label htmlFor="endTime">End Time *</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            {!formData.isAllDay && (
              <div className="form-group">
                <label htmlFor="notification">Notification</label>
                <select
                  id="notification"
                  name="notification"
                  value={formData.notification}
                  onChange={handleChange}
                >
                  <option value="">No notification</option>
                  <option value="0">At time of event</option>
                  <option value="5">5 minutes before</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEventForm;
