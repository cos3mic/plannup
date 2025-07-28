import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Alert,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';

export default function NativeDatePicker({ 
  visible, 
  onClose, 
  onDateSelected, 
  title = "Select Date",
  minDate = null,
  maxDate = null,
}) {
  console.log('NativeDatePicker rendered with visible:', visible);
  const colorScheme = useColorScheme();
  console.log('Color scheme:', colorScheme);
  const colors = Colors[colorScheme ?? 'light'];
  console.log('Colors object:', colors);
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    console.log('Date selected in NativeDatePicker:', date);
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    console.log('Confirming date:', selectedDate);
    onDateSelected(selectedDate);
    onClose();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openNativeDatePicker = () => {
    if (Platform.OS === 'android') {
      // For Android, we'll use a simple modal with date selection
      // In a real app, you'd use DateTimePickerAndroid
      Alert.alert(
        'Date Picker',
        'Select a date from the options below',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Today', onPress: () => handleDateSelect(new Date()) },
          { text: 'Tomorrow', onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            handleDateSelect(tomorrow);
          }},
          { text: 'Next Week', onPress: () => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            handleDateSelect(nextWeek);
          }},
        ]
      );
    } else {
      // For iOS, we'll use a simple modal with date selection
      Alert.alert(
        'Date Picker',
        'Select a date from the options below',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Today', onPress: () => handleDateSelect(new Date()) },
          { text: 'Tomorrow', onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            handleDateSelect(tomorrow);
          }},
          { text: 'Next Week', onPress: () => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            handleDateSelect(nextWeek);
          }},
        ]
      );
    }
  };

  // Generate quick date options
  const generateQuickOptions = () => {
    const today = new Date();
    const options = [
      { label: 'Today', date: today },
      { label: 'Tomorrow', date: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      { label: 'Next Week', date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) },
      { label: 'Next Month', date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) },
    ];

    // Filter based on min/max constraints
    return options.filter(option => {
      if (minDate && option.date < minDate) return false;
      if (maxDate && option.date > maxDate) return false;
      return true;
    });
  };

  const quickOptions = generateQuickOptions();

  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
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

        <View style={styles.content}>
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

          {/* Quick Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Selection
            </Text>
            {quickOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickOption,
                  { backgroundColor: colors.white },
                  isDateSelected(option.date) && { backgroundColor: colors.coral + '20' },
                ]}
                onPress={() => handleDateSelect(option.date)}
              >
                <View style={styles.quickOptionContent}>
                  <View style={styles.quickOptionInfo}>
                    <Text style={[
                      styles.quickOptionLabel,
                      { color: isDateSelected(option.date) ? colors.coral : colors.text }
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.quickOptionDate,
                      { color: isDateSelected(option.date) ? colors.coral : colors.textSecondary }
                    ]}>
                      {formatDate(option.date)}
                    </Text>
                  </View>
                  {isDateSelected(option.date) && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.coral} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Date Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.customDateButton, { backgroundColor: colors.white, borderColor: colors.border }]}
              onPress={openNativeDatePicker}
            >
              <Ionicons name="calendar-outline" size={24} color={colors.coral} />
              <Text style={[styles.customDateText, { color: colors.text }]}>
                Choose Custom Date
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

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
  quickOption: {
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  quickOptionInfo: {
    flex: 1,
  },
  quickOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickOptionDate: {
    fontSize: 14,
  },
  customDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  customDateText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
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