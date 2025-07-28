import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import WorkingDatePicker from './WorkingDatePicker.jsx';

export default function SprintModal({ visible, onClose }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleCreateSprint = async () => {
    if (!sprintName.trim()) {
      Alert.alert('Error', 'Please enter a sprint name');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select start and end dates');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would integrate with Jira/ClickUp APIs
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Sprint created successfully!',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create sprint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSprintName('');
    setSprintGoal('');
    setStartDate('');
    setEndDate('');
    onClose();
  };

  const handleStartDateSelect = (date) => {
    try {
      console.log('Start date selected:', date);
      setStartDate(date.toISOString().split('T')[0]);
      setShowStartDatePicker(false);
    } catch (error) {
      console.error('Error in handleStartDateSelect:', error);
    }
  };

  const handleEndDateSelect = (date) => {
    try {
      console.log('End date selected:', date);
      setEndDate(date.toISOString().split('T')[0]);
      setShowEndDatePicker(false);
    } catch (error) {
      console.error('Error in handleEndDateSelect:', error);
    }
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
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Create New Sprint
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Sprint Name */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Sprint Name *
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
                value={sprintName}
                onChangeText={setSprintName}
                placeholder="Enter sprint name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Sprint Goal */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Sprint Goal
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={sprintGoal}
                onChangeText={setSprintGoal}
                placeholder="What do you want to accomplish in this sprint?"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Start Date */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Start Date *
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  console.log('Opening start date picker');
                  setShowStartDatePicker(true);
                }}
              >
                <View style={styles.dateInputContent}>
                  <Ionicons name="calendar" size={20} color={colors.coral} />
                  <Text style={[
                    styles.dateInputText,
                    { color: startDate ? colors.text : colors.textSecondary }
                  ]}>
                    {startDate ? formatDate(startDate) : 'Select start date'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* End Date */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                End Date *
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  console.log('Opening end date picker');
                  setShowEndDatePicker(true);
                }}
              >
                <View style={styles.dateInputContent}>
                  <Ionicons name="calendar" size={20} color={colors.coral} />
                  <Text style={[
                    styles.dateInputText,
                    { color: endDate ? colors.text : colors.textSecondary }
                  ]}>
                    {endDate ? formatDate(endDate) : 'Select end date'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Sprint Info */}
            <View style={[styles.infoCard, { backgroundColor: colors.white }]}>
              <Ionicons name="information-circle" size={20} color={colors.blue} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Sprints typically last 1-4 weeks and help teams focus on specific goals.
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.createButton,
                {
                  backgroundColor: isLoading ? colors.textSecondary : colors.coral,
                },
              ]}
              onPress={handleCreateSprint}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.createButtonText}>Create Sprint</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Working Date Pickers */}
      <WorkingDatePicker
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onDateSelected={handleStartDateSelect}
        title="Select Start Date"
        minDate={new Date()}
      />

      <WorkingDatePicker
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onDateSelected={handleEndDateSelect}
        title="Select End Date"
        minDate={startDate ? new Date(startDate) : new Date()}
      />
    </>
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
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