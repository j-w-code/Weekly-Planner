import { startOfDay, endOfDay, isBefore, isAfter, isSameDay, parseISO } from 'date-fns';

/**
 * Date Utility Functions
 * Helpers for determining date status (past, present, future)
 */

/**
 * Get the current date at start of day (midnight)
 * @returns {Date} Today's date at 00:00:00
 */
export const getTodayStart = () => startOfDay(new Date());

/**
 * Get the current date at end of day (23:59:59)
 * @returns {Date} Today's date at 23:59:59
 */
export const getTodayEnd = () => endOfDay(new Date());

/**
 * Check if a date is in the past (before today)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is before today
 */
export const isPastDate = (date) => {
  const dateToCheck = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(startOfDay(dateToCheck), getTodayStart());
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const dateToCheck = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(dateToCheck, new Date());
};

/**
 * Check if a date is in the future (after today)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is after today
 */
export const isFutureDate = (date) => {
  const dateToCheck = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(startOfDay(dateToCheck), getTodayStart());
};

/**
 * Get the status of a date (past, present, future)
 * @param {Date|string} date - Date to check
 * @returns {'past'|'present'|'future'} Date status
 */
export const getDateStatus = (date) => {
  if (isToday(date)) return 'present';
  if (isPastDate(date)) return 'past';
  return 'future';
};

/**
 * Check if an event is in the past
 * @param {Object} event - Event object with start date/time
 * @returns {boolean} True if event has passed
 */
export const isEventPast = (event) => {
  if (!event || !event.start) return false;
  
  const eventStart = event.start.dateTime || event.start.date;
  return isPastDate(eventStart);
};

/**
 * Check if an event is happening today
 * @param {Object} event - Event object with start date/time
 * @returns {boolean} True if event is today
 */
export const isEventToday = (event) => {
  if (!event || !event.start) return false;
  
  const eventStart = event.start.dateTime || event.start.date;
  return isToday(eventStart);
};

/**
 * Check if an event is in the future
 * @param {Object} event - Event object with start date/time
 * @returns {boolean} True if event is in the future
 */
export const isEventFuture = (event) => {
  if (!event || !event.start) return false;
  
  const eventStart = event.start.dateTime || event.start.date;
  return isFutureDate(eventStart);
};

/**
 * Get a human-readable status label
 * @param {'past'|'present'|'future'} status - Date status
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  const labels = {
    past: 'Past Event',
    present: 'Today',
    future: 'Upcoming',
  };
  return labels[status] || '';
};

/**
 * Get CSS class name for date status
 * @param {'past'|'present'|'future'} status - Date status
 * @returns {string} CSS class name
 */
export const getStatusClassName = (status) => {
  return `status-${status}`;
};

const dateUtils = {
  getTodayStart,
  getTodayEnd,
  isPastDate,
  isToday,
  isFutureDate,
  getDateStatus,
  isEventPast,
  isEventToday,
  isEventFuture,
  getStatusLabel,
  getStatusClassName,
};

export default dateUtils;
