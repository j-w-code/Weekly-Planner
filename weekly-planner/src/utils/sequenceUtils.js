import { format, addDays } from 'date-fns';

// Available colors for sequences
export const SEQUENCE_COLORS = [
  '#4285f4', // Blue
  '#ea4335', // Red
  '#34a853', // Green
  '#fbbc04', // Yellow
  '#ff6d01', // Orange
  '#46bdc6', // Cyan
  '#9334e6', // Purple
  '#f538a0', // Pink
  '#7c5295', // Lavender
  '#33b679', // Teal
];

// Day pattern presets
export const DAY_PATTERNS = {
  FULL_WEEK: [0, 1, 2, 3, 4, 5, 6],
  WEEKDAYS: [1, 2, 3, 4, 5],
  WEEKEND: [0, 6],
  CUSTOM: [],
};

export const DAY_PATTERN_LABELS = {
  FULL_WEEK: 'Full Week (7 days)',
  WEEKDAYS: 'Weekdays (Mon-Fri)',
  WEEKEND: 'Weekend (Sat-Sun)',
  CUSTOM: 'Custom Days',
};

/**
 * Creates a new sequence object
 */
export function createSequence({
  name,
  description = '',
  color = SEQUENCE_COLORS[0],
  dayPattern = 'FULL_WEEK',
  customDays = [],
  recurring = true,
  startDate = new Date(),
}) {
  const days = dayPattern === 'CUSTOM' ? customDays : DAY_PATTERNS[dayPattern];
  
  return {
    id: generateSequenceId(),
    name,
    description,
    color,
    dayPattern,
    days, // Array of day indices (0=Sun, 1=Mon, etc.)
    recurring,
    paused: false,
    startDate: startDate.toISOString(),
    completedDays: {}, // { 'YYYY-MM-DD': true }
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates a unique sequence ID
 */
function generateSequenceId() {
  return `seq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets the days this sequence applies to for a given week
 */
export function getSequenceDaysForWeek(sequence, weekStart) {
  const weekDays = [];
  
  sequence.days.forEach(dayIndex => {
    const day = addDays(weekStart, dayIndex);
    weekDays.push(day);
  });
  
  return weekDays;
}

/**
 * Checks if a sequence is active on a given date
 */
export function isSequenceActiveOnDate(sequence, date) {
  if (sequence.paused) return false;
  
  const dayOfWeek = date.getDay();
  return sequence.days.includes(dayOfWeek);
}

/**
 * Checks if a day is completed in the sequence
 */
export function isDayCompleted(sequence, date) {
  const dateKey = format(date, 'yyyy-MM-dd');
  return sequence.completedDays[dateKey] === true;
}

/**
 * Toggles completion status for a day
 */
export function toggleDayCompletion(sequence, date) {
  const dateKey = format(date, 'yyyy-MM-dd');
  const newCompletedDays = { ...sequence.completedDays };
  
  if (newCompletedDays[dateKey]) {
    delete newCompletedDays[dateKey];
  } else {
    newCompletedDays[dateKey] = true;
  }
  
  return {
    ...sequence,
    completedDays: newCompletedDays,
  };
}

/**
 * Gets completion statistics for a sequence
 */
export function getSequenceStats(sequence, weekStart) {
  const weekDays = getSequenceDaysForWeek(sequence, weekStart);
  const completed = weekDays.filter(day => isDayCompleted(sequence, day)).length;
  const total = weekDays.length;
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * Pauses a sequence
 */
export function pauseSequence(sequence) {
  return {
    ...sequence,
    paused: true,
  };
}

/**
 * Resumes a sequence
 */
export function resumeSequence(sequence) {
  return {
    ...sequence,
    paused: false,
  };
}

/**
 * Rolls over a sequence to the next week
 * (clears completed days if not recurring)
 */
export function rolloverSequence(sequence, newWeekStart) {
  if (!sequence.recurring) {
    return null; // Non-recurring sequences don't roll over
  }
  
  // Keep the sequence but don't clear completed days
  // Users can manually clear if they want a fresh start
  return sequence;
}

/**
 * Clears all completed days for a sequence
 */
export function clearCompletedDays(sequence) {
  return {
    ...sequence,
    completedDays: {},
  };
}

/**
 * Updates sequence properties
 */
export function updateSequence(sequence, updates) {
  return {
    ...sequence,
    ...updates,
  };
}

/**
 * Validates sequence name
 */
export function validateSequenceName(name) {
  if (!name || name.trim().length === 0) {
    return 'Sequence name is required';
  }
  if (name.trim().length > 50) {
    return 'Sequence name must be 50 characters or less';
  }
  return null;
}

/**
 * Validates sequence description
 */
export function validateSequenceDescription(description) {
  if (description && description.length > 200) {
    return 'Description must be 200 characters or less';
  }
  return null;
}
