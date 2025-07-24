# Google Calendar Integration

This document explains how to use the Google Calendar integration feature in PlanUp.

## Overview

The Google Calendar integration allows users to select dates using a calendar interface that can optionally connect to Google Calendar to show existing events and conflicts.

## Features

### 🗓️ Calendar Picker Component
- **Visual Calendar Interface**: Month view with easy date selection
- **Google Calendar Integration**: Shows existing events from your Google Calendar
- **Event Indicators**: Visual dots on dates with scheduled events
- **Date Validation**: Prevents selecting invalid dates (past dates, etc.)
- **Time Selection**: Optional time picker for precise scheduling

### 📱 Where It's Used

1. **Sprint Creation** (`SprintModal.jsx`)
   - Start Date selection
   - End Date selection
   - Validates that end date is after start date

2. **Issue Creation** (`CreateIssueModal.jsx`)
   - Due Date selection (optional)
   - Helps with task scheduling and deadlines

## How to Use

### For Sprint Creation:
1. Tap "Create Sprint" from the home screen
2. Fill in sprint name and goal
3. Tap "Select start date" to open calendar picker
4. Choose your start date from the calendar
5. Tap "Select end date" to open calendar picker
6. Choose your end date (must be after start date)
7. Create the sprint

### For Issue Creation:
1. Tap "Create Issue" from the home screen
2. Fill in issue title and description
3. Select priority level
4. Tap "Select due date" to open calendar picker (optional)
5. Choose your due date from the calendar
6. Create the issue

## Calendar Features

### 📅 Visual Calendar
- Month view with clear date grid
- Today's date highlighted with blue border
- Selected date highlighted with coral background
- Week day headers for easy navigation

### 🎯 Event Integration
- **Connected Mode**: Shows events from Google Calendar
- **Local Mode**: Works without Google Calendar connection
- **Event Dots**: Small indicators on dates with events
- **Event Details**: Shows event titles and times when available

### ⏰ Time Selection
- Optional time picker for precise scheduling
- 24-hour format support
- Default time of 9:00 AM for new selections

## Technical Implementation

### Component: `GoogleCalendarPicker.jsx`
```javascript
<GoogleCalendarPicker
  visible={showDatePicker}
  onClose={() => setShowDatePicker(false)}
  onDateSelected={handleDateSelect}
  title="Select Due Date"
  minDate={new Date()}
  showTime={false}
/>
```

### Props:
- `visible`: Boolean to show/hide the picker
- `onClose`: Function called when picker is closed
- `onDateSelected`: Function called with selected date
- `title`: Custom title for the picker
- `minDate`: Minimum selectable date
- `maxDate`: Maximum selectable date
- `showTime`: Whether to include time selection
- `initialDate`: Default selected date

### Date Format
Dates are returned in ISO format (`YYYY-MM-DD`) for consistency across the app.

## Google Calendar Setup

### Current Implementation
The current implementation uses mock data to simulate Google Calendar events. To connect to real Google Calendar:

1. **Set up Google Calendar API**
   - Create a Google Cloud Project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials

2. **Install Google Calendar SDK**
   ```bash
   npm install @google-cloud/local-auth googleapis
   ```

3. **Configure Authentication**
   - Add Google Calendar scopes
   - Handle OAuth flow
   - Store authentication tokens securely

### Mock Events
Currently shows these sample events:
- Team Meeting (today at 10:00 AM)
- Sprint Planning (tomorrow)
- Code Review (day after tomorrow)

## Future Enhancements

### 🔮 Planned Features
- **Real Google Calendar Integration**: Connect to actual Google Calendar
- **Event Creation**: Create new events directly from PlanUp
- **Conflict Detection**: Warn about scheduling conflicts
- **Recurring Events**: Support for recurring meetings
- **Multiple Calendars**: Support for team and personal calendars
- **Calendar Sync**: Two-way sync with Google Calendar

### 🛠️ Technical Improvements
- **Offline Support**: Cache calendar data for offline use
- **Performance**: Optimize calendar rendering for large datasets
- **Accessibility**: Improve screen reader support
- **Internationalization**: Support for different date formats

## Troubleshooting

### Common Issues

1. **Calendar not loading**
   - Check internet connection
   - Verify Google Calendar API setup
   - Check authentication tokens

2. **Events not showing**
   - Ensure Google Calendar is connected
   - Check calendar permissions
   - Verify event visibility settings

3. **Date selection issues**
   - Check min/max date constraints
   - Verify date format compatibility
   - Ensure proper timezone handling

### Debug Mode
Enable debug logging by setting:
```javascript
const DEBUG_CALENDAR = true;
```

## Best Practices

### 📋 Usage Guidelines
1. **Always validate dates**: Check that selected dates make sense
2. **Provide clear feedback**: Show selected dates clearly
3. **Handle errors gracefully**: Provide fallback for calendar issues
4. **Respect user preferences**: Remember user's calendar settings

### 🎨 UI/UX Considerations
- Use consistent date formatting across the app
- Provide clear visual feedback for selected dates
- Include helpful placeholder text
- Support both light and dark themes

## API Reference

### GoogleCalendarPicker Methods
- `loadCalendarEvents()`: Load events from Google Calendar
- `handleDateSelect(date)`: Handle date selection
- `formatDate(dateString)`: Format date for display
- `getDaysInMonth(date)`: Get calendar grid for a month

### Event Object Structure
```javascript
{
  id: 'unique-id',
  title: 'Event Title',
  start: new Date(),
  end: new Date(),
  color: '#4285F4',
  description: 'Optional description'
}
```

---

For more information or to report issues, please refer to the main project documentation or contact the development team. 