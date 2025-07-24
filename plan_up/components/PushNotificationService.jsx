import React from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class PushNotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.isExpoGo = Constants.appOwnership === 'expo';
  }

  // Register for push notifications (Expo Go compatible)
  async registerForPushNotificationsAsync() {
    let token;

    // Check if running in Expo Go
    if (this.isExpoGo) {
      console.log('Running in Expo Go - Using local notifications only');
      console.log('Push notifications are limited in Expo Go');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        // For Expo Go, we won't get a real push token
        // This is just for demonstration
        token = 'expo-go-demo-token';
        console.log('Expo Go detected - using demo token');
      } catch (error) {
        console.error('Failed to get push token:', error);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    this.expoPushToken = token;
    return token;
  }

  // Send invite notification (Expo Go compatible)
  async sendInviteNotification(inviteeEmail, organizationName, inviterName) {
    try {
      // In Expo Go, we can only show local notifications
      console.log('Sending invite notification via local notification');
      
      const notificationData = {
        title: 'Organization Invitation',
        body: `${inviterName} invited you to join ${organizationName}`,
        data: {
          type: 'organization_invite',
          organizationName: organizationName,
          inviterName: inviterName,
          email: inviteeEmail,
          timestamp: new Date().toISOString(),
        },
      };

      // Show local notification
      await this.showLocalNotification(notificationData);
      
      console.log('Local notification sent for invite');
      return { success: true, method: 'local' };
    } catch (error) {
      console.error('Failed to send notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Show local notification
  async showLocalNotification(notificationData) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sound: 'default',
        },
        trigger: { seconds: 1 }, // Show after 1 second
      });
    } catch (error) {
      console.error('Failed to show local notification:', error);
      throw error;
    }
  }

  // Show notification for various events
  async showNotification(title, body, data = {}) {
    try {
      await this.showLocalNotification({
        title,
        body,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to show notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Setup notification listeners
  setupNotificationListeners() {
    // Listen for notifications received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // You can handle the notification here (e.g., update UI)
    });

    // Listen for notification taps
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      
      const data = response.notification.request.content.data;
      
      // Handle different notification types
      if (data.type === 'organization_invite') {
        this.handleInviteNotificationTap(data);
      } else if (data.type === 'issue_assigned') {
        this.handleIssueNotificationTap(data);
      } else if (data.type === 'sprint_start') {
        this.handleSprintNotificationTap(data);
      }
    });
  }

  // Handle invite notification tap
  handleInviteNotificationTap(data) {
    console.log('User tapped invite notification:', data);
    
    Alert.alert(
      'Organization Invitation',
      `${data.inviterName} invited you to join ${data.organizationName}`,
      [
        { text: 'Decline', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            console.log('User accepted invite via notification');
            // Navigate to organization management or show success message
            Alert.alert('Success', 'You have joined the organization!');
          }
        }
      ]
    );
  }

  // Handle issue notification tap
  handleIssueNotificationTap(data) {
    console.log('User tapped issue notification:', data);
    
    Alert.alert(
      'Issue Assigned',
      `You have been assigned to: ${data.issueTitle}`,
      [
        { text: 'View Later' },
        { 
          text: 'View Now', 
          onPress: () => {
            console.log('User wants to view issue');
            // Navigate to issue details
          }
        }
      ]
    );
  }

  // Handle sprint notification tap
  handleSprintNotificationTap(data) {
    console.log('User tapped sprint notification:', data);
    
    Alert.alert(
      'Sprint Started',
      `Sprint "${data.sprintName}" has started!`,
      [
        { text: 'OK' }
      ]
    );
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get the current push token (will be null in Expo Go)
  getPushToken() {
    return this.expoPushToken;
  }

  // Check if running in Expo Go
  isRunningInExpoGo() {
    return this.isExpoGo;
  }

  // Get Expo Go status message
  getExpoGoStatus() {
    if (this.isExpoGo) {
      return {
        isExpoGo: true,
        message: 'Running in Expo Go - Local notifications only',
        canSendRemote: false,
        canReceiveRemote: false,
      };
    }
    return {
      isExpoGo: false,
      message: 'Running in development build - Full notification support',
      canSendRemote: true,
      canReceiveRemote: true,
    };
  }

  // Show Expo Go limitations info
  showExpoGoLimitations() {
    if (this.isExpoGo) {
      Alert.alert(
        'Expo Go Limitations',
        'You are running in Expo Go. Push notifications are limited to local notifications only.\n\n' +
        'For full push notification support (remote notifications), you would need to create a development build.',
        [{ text: 'OK' }]
      );
    }
  }
}

export default new PushNotificationService(); 