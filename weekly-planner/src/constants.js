/**
 * Application Constants
 * Central location for all magic numbers and configuration values
 */

// Event Constraints
export const EVENT_CONSTRAINTS = {
  MAX_TITLE_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 8000,
  MAX_DURATION_HOURS: 24,
  MIN_DURATION_MINUTES: 1,
};

// Notification Options (in minutes)
export const NOTIFICATION_OPTIONS = [
  { value: '', label: 'No notification' },
  { value: '0', label: 'At time of event' },
  { value: '5', label: '5 minutes before' },
  { value: '10', label: '10 minutes before' },
  { value: '15', label: '15 minutes before' },
  { value: '30', label: '30 minutes before' },
  { value: '60', label: '1 hour before' },
  { value: '120', label: '2 hours before' },
  { value: '1440', label: '1 day before' },
];

// Default Form Values
export const DEFAULT_EVENT_FORM = {
  START_TIME: '09:00',
  END_TIME: '10:00',
  NOTIFICATION_MINUTES: '10',
};

// Week Configuration
export const WEEK_CONFIG = {
  DAYS_IN_WEEK: 7,
  START_DAY: {
    SUNDAY: 0,
    MONDAY: 1,
  },
};

// API Configuration
export const API_LIMITS = {
  MAX_EVENTS_PER_REQUEST: 250,
  REQUEST_TIMEOUT_MS: 30000,
};

// UI Messages
export const UI_MESSAGES = {
  LOADING: 'Loading...',
  NO_EVENTS: 'No events',
  LOADING_EVENTS: 'Loading events...',
  LOADING_API: 'Loading Google Calendar API...',
  SIGN_IN_PROMPT: 'Sign in with Google to view your calendar events',
  DELETE_CONFIRM: 'Are you sure you want to delete this event?',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_DELETE: 'Failed to delete event. Please try again.',
  ERROR_CREATE: 'Failed to create event. Please check your connection and try again.',
  ERROR_FETCH: 'Failed to load events. Please refresh the page.',
  PAST_EVENT_WARNING: 'You are creating an event in the past. It will be marked as completed.',
  PAST_EVENT_TAG: '[COMPLETED]',
  COMPLETED_EVENT_LABEL: 'Completed',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Event title is required',
  TITLE_TOO_LONG: `Event title must be less than ${EVENT_CONSTRAINTS.MAX_TITLE_LENGTH} characters`,
  END_BEFORE_START: 'End time must be after start time',
  END_DATE_BEFORE_START: 'End date cannot be before start date',
  DURATION_TOO_LONG: `Event duration cannot exceed ${EVENT_CONSTRAINTS.MAX_DURATION_HOURS} hours. Use all-day event for longer events.`,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM d',
  FULL_DATE: 'MMM d, yyyy',
  LONG_DATE: 'EEEE, MMMM d, yyyy',
  ISO_DATE: 'yyyy-MM-dd',
  SHORT_DAY: 'EEE',
  DAY_NUMBER: 'd',
  TIME_12H: 'h:mm a',
};

// Color Scheme (for future event color coding)
export const EVENT_COLORS = {
  DEFAULT: '#4285f4',
  WORK: '#f4b400',
  PERSONAL: '#0f9d58',
  IMPORTANT: '#db4437',
};

// Timeouts & Delays
export const TIMEOUTS = {
  DEBOUNCE_SEARCH_MS: 300,
  TOAST_DURATION_MS: 3000,
  ERROR_RETRY_DELAY_MS: 1000,
};

// Keyboard Keys
export const KEYBOARD_KEYS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  TAB: 'Tab',
  SPACE: ' ',
};

// Z-Index Layers
export const Z_INDEX = {
  MODAL_OVERLAY: 1000,
  MODAL_CONTENT: 1001,
  ERROR_BOUNDARY: 10000,
};

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
  ENABLE_RECURRING_EVENTS: false,
  ENABLE_EVENT_COLORS: false,
  ENABLE_MULTIPLE_CALENDARS: false,
  ENABLE_OFFLINE_MODE: false,
};

export default {
  EVENT_CONSTRAINTS,
  NOTIFICATION_OPTIONS,
  DEFAULT_EVENT_FORM,
  WEEK_CONFIG,
  API_LIMITS,
  UI_MESSAGES,
  VALIDATION_MESSAGES,
  DATE_FORMATS,
  EVENT_COLORS,
  TIMEOUTS,
  KEYBOARD_KEYS,
  Z_INDEX,
  FEATURE_FLAGS,
};
