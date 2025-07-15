import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/Colors.jsx';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportsModal from '../../components/ReportsModal';
import { useIssues } from '../../hooks/useIssues';
import { useSprints } from '../../hooks/useSprints';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  
  const { issues } = useIssues();
  const { sprints } = useSprints();

  const metrics = [
    { title: 'Total Issues', value: '156', icon: 'list', color: colors.coral },
    { title: 'In Progress', value: '23', icon: 'time', color: colors.blue },
    { title: 'Completed', value: '89', icon: 'checkmark-circle', color: '#4ECDC4' },
    { title: 'Overdue', value: '5', icon: 'warning', color: '#FF6B6B' },
  ];

  const recentSprints = [
    { name: 'Sprint 23', progress: 85, daysLeft: 3 },
    { name: 'Sprint 22', progress: 100, daysLeft: 0 },
    { name: 'Sprint 21', progress: 92, daysLeft: 0 },
  ];

  const teamAnalytics = [
    {
      name: 'John Doe',
      avatar: 'JD',
      color: colors.coral,
      issuesCompleted: 12,
      issuesInProgress: 3,
      productivity: 85,
      lastActive: '2h ago'
    },
    {
      name: 'Alice Smith',
      avatar: 'AS',
      color: colors.blue,
      issuesCompleted: 8,
      issuesInProgress: 2,
      productivity: 92,
      lastActive: '1h ago'
    },
    {
      name: 'Mike Johnson',
      avatar: 'MJ',
      color: '#4ECDC4',
      issuesCompleted: 15,
      issuesInProgress: 1,
      productivity: 78,
      lastActive: '30m ago'
    },
    {
      name: 'Sarah Wilson',
      avatar: 'SW',
      color: '#FFA500',
      issuesCompleted: 6,
      issuesInProgress: 4,
      productivity: 65,
      lastActive: '4h ago'
    }
  ];

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
        {/* Header (now scrollable) */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.reportsButton, { borderColor: colors.coral }]}
              onPress={() => setIsReportsModalVisible(true)}
            >
              <Ionicons name="analytics" size={20} color={colors.coral} />
              <Text style={[styles.reportsButtonText, { color: colors.coral }]}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, { borderColor: colors.blue }]}> 
              <Ionicons name="filter" size={20} color={colors.blue} />
              <Text style={[styles.filterText, { color: colors.blue }]}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGridWrapper}>
          <View style={styles.metricsGridRow}>
            {metrics.slice(0, 2).map((metric, index) => (
              <View key={index} style={[styles.metricCard, { backgroundColor: colors.white, marginRight: index === 0 ? 12 : 0 }]}> 
                <View style={styles.metricContent}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}> 
                    <Ionicons name={metric.icon} size={20} color={metric.color} />
                  </View>
                  <View style={styles.metricText}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>{metric.value}</Text>
                    <Text style={[styles.metricTitle, { color: colors.text }]}>{metric.title}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.metricsGridRow}>
            {metrics.slice(2, 4).map((metric, index) => (
              <View key={index} style={[styles.metricCard, { backgroundColor: colors.white, marginRight: index === 0 ? 12 : 0 }]}> 
                <View style={styles.metricContent}>
                  <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}> 
                    <Ionicons name={metric.icon} size={20} color={metric.color} />
                  </View>
                  <View style={styles.metricText}>
                    <Text style={[styles.metricValue, { color: colors.text }]}>{metric.value}</Text>
                    <Text style={[styles.metricTitle, { color: colors.text }]}>{metric.title}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Sprint Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Sprints</Text>
          {recentSprints.map((sprint, index) => (
            <View key={index} style={[styles.sprintCard, { backgroundColor: colors.white, marginBottom: 14 }]}> 
              <View style={styles.sprintHeader}>
                <Text style={[styles.sprintName, { color: colors.text }]}>{sprint.name}</Text>
                <Text style={[styles.sprintDays, { color: colors.coral }]}> 
                  {sprint.daysLeft > 0 ? `${sprint.daysLeft} days left` : 'Completed'}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${sprint.progress}%`,
                        backgroundColor: sprint.progress === 100 ? '#4ECDC4' : colors.coral 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.text }]}>{sprint.progress}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Team Analytics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Team Analytics</Text>
            <TouchableOpacity style={[styles.viewAllButton, { borderColor: colors.blue }]}> 
              <Text style={[styles.viewAllText, { color: colors.blue }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.analyticsCard, { backgroundColor: colors.white }]}> 
            {teamAnalytics.map((member, index) => (
              <View key={index} style={[styles.analyticsItem, { marginBottom: index === teamAnalytics.length - 1 ? 0 : 18 }]}> 
                <View style={styles.memberInfo}>
                  <View style={[styles.avatar, { backgroundColor: member.color }]}> 
                    <Text style={styles.avatarText}>{member.avatar}</Text>
                  </View>
                  <View style={styles.memberDetails}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberStatus, { color: colors.textSecondary }]}> 
                      Last active: {member.lastActive}
                    </Text>
                  </View>
                  {member.name === 'John Doe' && (
                    <TouchableOpacity 
                      style={[styles.updateButton, { backgroundColor: colors.blue, marginLeft: 8 }]}
                      onPress={() => Alert.alert('Update Progress', 'Update your progress here')}
                    >
                      <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.analyticsStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.coral }]}>{member.issuesCompleted}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.blue }]}>{member.issuesInProgress}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: member.productivity > 80 ? '#4ECDC4' : '#FF6B6B' }]}> 
                      {member.productivity}%
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Productivity</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Team Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <View style={[styles.activityCard, { backgroundColor: colors.white }]}> 
            {[{avatar: 'JD', name: 'John Doe', text: 'Completed issue "Fix login bug"', time: '2h ago', color: colors.coral},
              {avatar: 'AS', name: 'Alice Smith', text: 'Started work on "Dashboard redesign"', time: '4h ago', color: colors.blue},
              {avatar: 'MJ', name: 'Mike Johnson', text: 'Created new issue "Mobile app testing"', time: '6h ago', color: '#4ECDC4'}].map((activity, idx) => (
              <View key={idx} style={[styles.activityItem, { marginBottom: idx === 2 ? 0 : 14 }]}> 
                <View style={[styles.avatar, { backgroundColor: activity.color }]}> 
                  <Text style={styles.avatarText}>{activity.avatar}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityName, { color: colors.text }]}>{activity.name}</Text>
                  <Text style={[styles.activityText, { color: colors.text }]}>{activity.text}</Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.text }]}>{activity.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <ReportsModal
        visible={isReportsModalVisible}
        issues={issues}
        sprints={sprints}
        onClose={() => setIsReportsModalVisible(false)}
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
    paddingTop: 36,
    paddingBottom: 12,
    backgroundColor: 'transparent',
    flexWrap: 'wrap', // allow wrapping if needed
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    flexShrink: 1,
    flexWrap: 'wrap', // allow buttons to wrap if space is tight
    gap: 8,
  },
  reportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    flexShrink: 1,
    maxWidth: 120,
  },
  reportsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 1,
    maxWidth: 120,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  metricsGridWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  metricsGridRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricText: {
    flex: 1,
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sprintCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sprintName: {
    fontSize: 16,
    fontWeight: '600',
  },
  sprintDays: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    marginLeft: 8,
  },
  analyticsCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyticsItem: {
    marginBottom: 18,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberStatus: {
    fontSize: 12,
  },
  analyticsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  updateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activityCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityText: {
    fontSize: 12,
    opacity: 0.8,
  },
  activityTime: {
    fontSize: 11,
    opacity: 0.6,
    marginLeft: 8,
  },
}); 