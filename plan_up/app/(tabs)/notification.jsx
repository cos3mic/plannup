import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors.jsx';
import { useTheme } from '../../hooks/useTheme';

const notificationData = [
  {
    id: '1',
    type: 'issue_assigned',
    title: 'Issue assigned to you',
    message: 'You have been assigned to "Fix login authentication bug"',
    time: '2 minutes ago',
    read: false,
    project: 'MAD',
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment on issue',
    message: 'Franklin George commented on "Implement user dashboard"',
    time: '15 minutes ago',
    read: false,
    project: 'MAD',
  },
  {
    id: '3',
    type: 'status_change',
    title: 'Issue status updated',
    message: 'Issue "Design mobile app icons" moved to Done',
    time: '1 hour ago',
    read: true,
    project: 'WRD',
  },
  {
    id: '4',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Alice Smith mentioned you in a comment',
    time: '2 hours ago',
    read: true,
    project: 'API',
  },
  {
    id: '5',
    type: 'sprint_start',
    title: 'Sprint started',
    message: 'Sprint 23 has started with 15 issues',
    time: '1 day ago',
    read: true,
    project: 'MAD',
  },
  {
    id: '6',
    type: 'deadline',
    title: 'Deadline approaching',
    message: 'Issue "API endpoint testing" is due tomorrow',
    time: '1 day ago',
    read: false,
    project: 'API',
  },
];

const notificationIcons = {
  issue_assigned: 'person-add',
  comment: 'chatbubble',
  status_change: 'swap-horizontal',
  mention: 'at',
  sprint_start: 'play',
  deadline: 'warning',
};

const notificationColors = {
  issue_assigned: '#FF6B6B',
  comment: '#4ECDC4',
  status_change: '#45B7D1',
  mention: '#FFA500',
  sprint_start: '#96CEB4',
  deadline: '#FF6B6B',
};

export default function NotificationScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];


  const renderNotificationCard = ({ item }) => (
    <TouchableOpacity style={[
      styles.notificationCard, 
      { 
        backgroundColor: colors.white,
        borderLeftWidth: 4,
        borderLeftColor: item.read ? colors.icon : colors.coral,
      }
    ]}>
      <View style={styles.notificationHeader}>
        <View style={[styles.iconContainer, { backgroundColor: notificationColors[item.type] + '20' }]}>
          <Ionicons 
            name={notificationIcons[item.type]} 
            size={20} 
            color={notificationColors[item.type]} 
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: colors.text }]}>
            {item.message}
          </Text>
          <View style={styles.notificationMeta}>
            <Text style={[styles.projectKey, { color: colors.blue }]}>{item.project}</Text>
            <Text style={[styles.timeText, { color: colors.text }]}>{item.time}</Text>
          </View>
        </View>
        {!item.read && (
          <View style={[styles.unreadDot, { backgroundColor: colors.coral }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notificationData.filter(item => !item.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={[styles.unreadCount, { color: colors.coral }]}>
              {unreadCount} unread
            </Text>
          )}
        </View>
        <TouchableOpacity style={[styles.markAllButton, { borderColor: colors.blue }]}>
          <Text style={[styles.markAllText, { color: colors.blue }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>



      {/* Notification Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="notifications" size={24} color={colors.coral} />
          <Text style={[styles.statValue, { color: colors.text }]}>{notificationData.length}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="mail-unread" size={24} color={colors.blue} />
          <Text style={[styles.statValue, { color: colors.text }]}>{unreadCount}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Unread</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="at" size={24} color="#4ECDC4" />
          <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Mentions</Text>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notificationData}
        renderItem={renderNotificationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  unreadCount: {
    fontSize: 14,
    marginTop: 4,
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.8,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
}); 