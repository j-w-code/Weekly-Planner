# Sequences Feature

The **Sequences** feature is a modular weekly goal/event tracker that allows users to create and manage recurring or one-time activity sequences across days of the week.

## Features

### Creating Sequences

Users can create new sequences with the following options:

- **Name**: Alphanumeric name (up to 50 characters)
- **Description**: Optional description to specify parameters (up to 200 characters)
  - Example: "Exercise sequence, hit goal of 3Mi walking a day"
- **Color**: Choose from 10 distinct colors for easy visibility
- **Day Pattern**: 
  - Full Week (7 days)
  - Weekdays (Mon-Fri, 5 days)
  - Weekend (Sat-Sun, 2 days)
  - Custom (select specific days)
- **Recurring**: Toggle between recurring (continues weekly) or single cycle
- **Start Date**: Automatically set to current date

### Managing Sequences

- **Edit**: Modify any sequence parameter (name, description, color, days, recurring status)
- **Pause**: Temporarily pause a sequence
- **Resume**: Resume a paused sequence
- **Delete**: Remove a sequence permanently (with confirmation)
- **Clear Completed**: Reset all completed days for a fresh start

### Tracking Progress

- **Day-by-day completion**: Click on individual days to mark as complete/incomplete
- **Visual indicators**: 
  - Active days are highlighted in the sequence color
  - Completed days show a checkmark and filled background
  - Inactive days (not part of the sequence pattern) are grayed out
- **Progress bar**: Real-time percentage and count of completed days
- **Weekly stats**: Shows "X / Y days" completion

### Visual Design

- **Enterprise-level polish**: Material Design-inspired with refined margins, shadows, and spacing
- **Color-coded**: Each sequence has a custom color for easy identification
- **Visual distinction**: 
  - Enhanced card shadows and borders for clear separation
  - Dashed borders for paused sequences
  - Premium badges with borders and uppercase styling
  - Smooth hover animations and transitions
- **Action buttons**: 
  - Edit (✏️) - Blue highlight
  - Pause/Resume (⏸/▶) - Yellow/Green highlights
  - Clear (↻) - Blue highlight
  - Delete (🗑) - Red highlight
- **Progress tracking**:
  - Visual progress bar with percentage
  - Day-by-day grid with checkmarks
  - Inactive days shown with dashed borders
- **Typography**: Optimized letter-spacing, line-height, and font weights
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Collapsible**: Toggle sequences section to show/hide

### Data Persistence

- Sequences are automatically saved to browser localStorage
- Data persists across sessions
- No server required

## Usage

### Creating a Sequence
1. **Sign in** to the Weekly Planner with your Google account
2. Click **"+ New Sequence"** button
3. Fill in the sequence details:
   - Enter a name (required)
   - Optionally add a description
   - Choose a color
   - Select days pattern
   - Set recurring or single cycle
4. Click **"Create Sequence"**
5. The sequence will appear as a distinct card in the Sequences section

### Using Sequences
- **Track Progress**: Mark days complete by clicking on them in the sequence card
- **Edit**: Click the ✏️ button to modify sequence parameters
- **Pause/Resume**: Use the ⏸/▶ buttons to temporarily pause or resume tracking
- **Clear**: Use the ↻ button to reset all completed days
- **Delete**: Use the 🗑 button to permanently remove a sequence

## Technical Implementation

### Components

- **SequenceManager**: Main container for sequences section with add/edit state management
- **SequenceCard**: Individual sequence display with progress tracking and action buttons
- **AddSequenceForm**: Modal form for creating new sequences
- **EditSequenceForm**: Modal form for editing existing sequences

### Utilities

- **sequenceUtils.js**: Core logic for sequence operations
  - Create, update, pause, resume sequences
  - Track completion status
  - Calculate statistics
  - Validate inputs

### Storage

- Uses browser localStorage with key: `weekly-planner-sequences`
- Automatically saves on every change
- Loads on component mount

## Future Enhancements

Potential improvements:
- Duplicate sequences
- Archive completed single-cycle sequences
- Export/import sequences
- Notifications/reminders
- Sync across devices via cloud storage
- Sequence templates library
- Analytics and insights dashboard
