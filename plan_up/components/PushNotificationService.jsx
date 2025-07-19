import React from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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
  }

  // Register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

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
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your Expo project ID
      })).data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    this.expoPushToken = token;
    return token;
  }

  // Send push notification for email invite
  async sendInviteNotification(inviteeEmail, organizationName, inviterName) {
    try {
      // In a real app, you would:
      // 1. Store user's push token in your database
      // 2. Send notification to the invitee's device
      
      const message = {
        to: this.expoPushToken, // This would be the invitee's push token
        sound: 'default',
        title: 'Organization Invitation',
        body: `${inviterName} invited you to join ${organizationName}`,
        data: {
          type: 'organization_invite',
          organizationId: 'org-id',
          inviteId: 'invite-id',
          organizationName: organizationName,
          inviterName: inviterName,
        },
      };

      // For demo purposes, we'll show a local notification
      await this.showLocalNotification(message);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Show local notification (for demo purposes)
  async showLocalNotification(notificationData) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data,
      },
      trigger: { seconds: 1 }, // Show after 1 second
    });
  }

  // Handle notification received while app is running
  setupNotificationListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // Handle the notification (e.g., update UI, navigate to invites screen)
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      
      const data = response.notification.request.content.data;
      
      // Handle notification tap based on type
      if (data.type === 'organization_invite') {
        // Navigate to invites screen or show invite modal
        this.handleInviteNotificationTap(data);
      }
    });
  }

  // Handle invite notification tap
  handleInviteNotificationTap(data) {
    // In a real app, you would navigate to the invites screen
    // or show the invite modal
    console.log('User tapped invite notification:', data);
    
    // Example: Navigate to organization management
    // navigation.navigate('OrganizationManagement');
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

  // Get the current push token
  getPushToken() {
    return this.expoPushToken;
  }
}

export default new PushNotificationService(); 