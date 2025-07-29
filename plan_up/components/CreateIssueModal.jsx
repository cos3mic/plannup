import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import * as Calendar from 'expo-calendar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from '../hooks/useTheme';

async function createCalendarEvent(title, description, dueDate) {
  if (!dueDate) return;
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return;

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];
  if (!defaultCalendar) return;

  await Calendar.createEventAsync(defaultCalendar.id, {
    title,
    notes: description,
    startDate: new Date(dueDate),
    endDate: new Date(new Date(dueDate).getTime() + 60 * 60 * 1000),
    timeZone: undefined,
  });
}

export default function CreateIssueModal({ visible, onClose, onIssueCreated }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  if (!visible) return null;

  const priorities = [
    { key: 'low', label: 'Low', color: '#4CAF50' },
    { key: 'medium', label: 'Medium', color: '#FF9800' },
    { key: 'high', label: 'High', color: '#F44336' },
  ];

  const handleCreateIssue = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the issue');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const activity = {
        type: 'issue_created',
        title: `New issue "${title}" created`,
        description: `Issue created with ${priority} priority${description ? `: ${description}` : ''}${dueDate ? `, due ${formatDate(dueDate)}` : ''}`,
        icon: 'create',
        color: '#FF6B6B',
      };

      if (onIssueCreated) onIssueCreated(activity);

      if (dueDate) {
        await createCalendarEvent(title, description, dueDate);
      }

      Alert.alert('Success', 'Issue created successfully!', [{ text: 'OK', onPress: handleClose }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleDateConfirm = (date) => {
    setDueDate(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Create New Issue</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Issue Title *</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter issue title"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      styles.priorityButton,
                      {
                        backgroundColor: priority === p.key ? p.color : colors.white,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setPriority(p.key)}
                  >
                    <Text style={[styles.priorityText, { color: priority === p.key ? '#fff' : colors.text }]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Due Date</Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                  },
                ]}
              onPress={showDatePicker}
              >
                <View style={styles.dateInputContent}>
                  <Ionicons name="calendar" size={20} color={colors.coral} />
                  <Text style={[styles.dateInputText, { color: dueDate ? colors.text : colors.textSecondary }]}>
                    {dueDate ? formatDate(dueDate) : 'Select due date (optional)'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter issue description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.border }]} onPress={handleClose}>
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createButton,
                {
                  backgroundColor: isLoading ? colors.textSecondary : colors.coral,
                },
              ]}
              onPress={handleCreateIssue}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.createButtonText}>Create Issue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
          mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
          minimumDate={new Date()}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
    // Remove justifyContent/alignItems so child fills screen
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  closeButton: { padding: 4 },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateInputText: {
    fontSize: 16,
    marginLeft: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
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
  createButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
