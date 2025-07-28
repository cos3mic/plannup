import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';

export default function GoogleCalendarPicker({ 
  visible, 
  onClose, 
  onDateSelected, 
  title = "Select Date",
  initialDate = null,
  minDate = null,
  maxDate = null,
  showTime = false
}) {
  console.log('GoogleCalendarPicker rendered with visible:', visible);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isLoading, setIsLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Ensure selectedDate is always a valid Date object
  useEffect(() => {
    if (!selectedDate || !(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      setSelectedDate(new Date());
    }
  }, [selectedDate]);

  // Mock Google Calendar events for demo
  const mockCalendarEvents = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 0, 0, 0)),
      color: '#4285F4',
    },
    {
      id: '2',
      title: 'Sprint Planning',
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      color: '#34A853',
    },
    {
      id: '3',
      title: 'Code Review',
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
      color: '#FBBC05',
    },
  ];

  useEffect(() => {
    if (visible) {
      loadCalendarEvents();
    }
  }, [visible]);

  const loadCalendarEvents = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would call Google Calendar API here
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCalendarEvents(mockCalendarEvents);
      setIsCalendarConnected(true);
    } catch (error) {
      console.log('Calendar not connected, using local date picker');
      setIsCalendarConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    try {
      console.log('Date selected in picker:', date);
      setSelectedDate(date);
    } catch (error) {
      console.error('Error in handleDateSelect:', error);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    try {
      const finalDate = new Date(selectedDate);
      if (showTime) {
        const [hours, minutes] = selectedTime.split(':');
        finalDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      
      console.log('Date selected:', finalDate);
      onDateSelected(finalDate);
      onClose();
    } catch (error) {
      console.error('Error in handleConfirm:', error);
      Alert.alert('Error', 'Failed to select date. Please try again.');
    }
  };

  const formatDate = (date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTime = (date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid Time';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const getDaysInMonth = (date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return [];
      }
      
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    } catch (error) {
      console.error('Error in getDaysInMonth:', error);
      return [];
    }
  };

  const navigateMonth = (direction) => {
    try {
      if (!currentMonth || !(currentMonth instanceof Date) || isNaN(currentMonth.getTime())) {
        setCurrentMonth(new Date());
        return;
      }
      
      const newMonth = new Date(currentMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      setCurrentMonth(newMonth);
    } catch (error) {
      console.error('Error in navigateMonth:', error);
      setCurrentMonth(new Date());
    }
  };

  const renderCalendar = () => {
    try {
      const days = getDaysInMonth(currentMonth);
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.calendarContainer}>
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {currentMonth ? currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Loading...'}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarHeader}>
          {weekDays.map(day => (
            <Text key={day} style={[styles.weekDay, { color: colors.textSecondary }]}>
              {day}
            </Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            if (!day) {
              return <View key={index} style={styles.calendarDay} />;
            }
            
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
            const isToday = day && day.toDateString() === new Date().toDateString();
            const hasEvent = calendarEvents.some(event => 
              event && event.start && day && 
              event.start.toDateString() === day.toDateString()
            );
            
            // Check if date is disabled (before minDate or after maxDate)
            const isDisabled = day && ((minDate && day < minDate) || (maxDate && day > maxDate));
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  isSelected && { backgroundColor: colors.coral },
                  isToday && { borderColor: colors.blue, borderWidth: 2 },
                  isDisabled && { opacity: 0.3 },
                ]}
                onPress={() => !isDisabled && day && handleDateSelect(day)}
                disabled={isDisabled}
              >
                <Text style={[
                  styles.dayText,
                  { color: isSelected ? '#fff' : colors.text },
                  isToday && !isSelected && { color: colors.blue },
                  isDisabled && { color: colors.textSecondary },
                ]}>
                  {day && day.getDate ? day.getDate().toString() : ''}
                </Text>
                {hasEvent && !isDisabled && (
                  <View style={[styles.eventDot, { backgroundColor: colors.blue }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
    } catch (error) {
      console.error('Error in renderCalendar:', error);
      return (
        <View style={styles.calendarContainer}>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            Error loading calendar
          </Text>
        </View>
      );
    }
  };

  const renderTimePicker = () => {
    if (!showTime) return null;
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Time
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.white,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={selectedTime}
          onChangeText={setSelectedTime}
          placeholder="HH:MM"
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    );
  };

  const renderCalendarEvents = () => {
    if (!isCalendarConnected || calendarEvents.length === 0) return null;
    
    const selectedDateEvents = calendarEvents.filter(event => 
      event && event.start && selectedDate &&
      event.start.toDateString() === selectedDate.toDateString()
    );
    
    if (selectedDateEvents.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Calendar Events
        </Text>
        {selectedDateEvents.map(event => (
          <View key={event.id} style={[styles.eventItem, { backgroundColor: colors.white }]}>
            <View style={[styles.eventColor, { backgroundColor: event.color }]} />
            <View style={styles.eventInfo}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>
                {event.title}
              </Text>
              <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                {formatTime(event.start)} - {formatTime(event.end)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Calendar Connection Status */}
          <View style={styles.section}>
            <View style={[styles.statusCard, { backgroundColor: colors.white }]}>
              <Ionicons 
                name={isCalendarConnected ? "calendar" : "calendar-outline"} 
                size={24} 
                color={isCalendarConnected ? colors.blue : colors.textSecondary} 
              />
              <View style={styles.statusInfo}>
                <Text style={[styles.statusTitle, { color: colors.text }]}>
                  {isCalendarConnected ? 'Google Calendar Connected' : 'Local Date Picker'}
                </Text>
                <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                  {isCalendarConnected 
                    ? 'Viewing events from your Google Calendar' 
                    : 'Select dates manually'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Selected Date Display */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Selected Date
            </Text>
            <View style={[styles.selectedDateCard, { backgroundColor: colors.white }]}>
              <Ionicons name="calendar" size={24} color={colors.coral} />
              <Text style={[styles.selectedDateText, { color: colors.text }]}>
                {formatDate(selectedDate)}
              </Text>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Calendar
            </Text>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.coral} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading calendar...
                </Text>
              </View>
            ) : (
              renderCalendar()
            )}
          </View>

          {/* Time Picker */}
          {renderTimePicker()}

          {/* Calendar Events */}
          {renderCalendarEvents()}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.coral }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  selectedDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 