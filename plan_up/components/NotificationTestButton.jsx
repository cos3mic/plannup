import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import PushNotificationService from './PushNotificationService';

export default function NotificationTestButton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const testInviteNotification = async () => {
    try {
      const result = await PushNotificationService.sendInviteNotification(
        'test@example.com',
        'Test Organization',
        'Franklin George'
      );
      
      if (result.success) {
        Alert.alert(
          'Notification Sent',
          'Check your notification panel! The notification should appear in 1 second.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to send notification');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testIssueNotification = async () => {
    try {
      const result = await PushNotificationService.showNotification(
        'Issue Assigned',
        'You have been assigned to "Fix login bug"',
        { 
          type: 'issue_assigned', 
          issueTitle: 'Fix login bug',
          issueId: '123'
        }
      );
      
      if (result.success) {
        Alert.alert(
          'Notification Sent',
          'Check your notification panel! The notification should appear in 1 second.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to send notification');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testSprintNotification = async () => {
    try {
      const result = await PushNotificationService.showNotification(
        'Sprint Started',
        'Sprint 23 has started with 15 issues',
        { 
          type: 'sprint_start', 
          sprintName: 'Sprint 23',
          sprintId: '23'
        }
      );
      
      if (result.success) {
        Alert.alert(
          'Notification Sent',
          'Check your notification panel! The notification should appear in 1 second.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to send notification');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const showExpoGoStatus = () => {
    const status = PushNotificationService.getExpoGoStatus();
    Alert.alert(
      'Notification Status',
      status.message,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.coral }]}
        onPress={testInviteNotification}
      >
        <Ionicons name="mail" size={20} color="white" />
        <Text style={styles.buttonText}>Test Invite Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.blue }]}
        onPress={testIssueNotification}
      >
        <Ionicons name="bug" size={20} color="white" />
        <Text style={styles.buttonText}>Test Issue Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={testSprintNotification}
      >
        <Ionicons name="play" size={20} color="white" />
        <Text style={styles.buttonText}>Test Sprint Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.textSecondary }]}
        onPress={showExpoGoStatus}
      >
        <Ionicons name="information-circle" size={20} color="white" />
        <Text style={styles.buttonText}>Show Status</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
}); 