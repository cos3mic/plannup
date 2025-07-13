import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useState } from 'react-native';
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
      <View style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <View key={index} style={[styles.metricCard, { backgroundColor: colors.white }]}>
            <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
              <Ionicons name={metric.icon} size={28} color={metric.color} />
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>{metric.value}</Text>
            <Text style={[styles.metricTitle, { color: colors.text }]}>{metric.title}</Text>
          </View>
        ))}
      </View>

      {/* Sprint Progress */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Sprints</Text>
        {recentSprints.map((sprint, index) => (
          <View key={index} style={[styles.sprintCard, { backgroundColor: colors.white }]}>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Analytics</Text>
          <TouchableOpacity style={[styles.viewAllButton, { borderColor: colors.blue }]}>
            <Text style={[styles.viewAllText, { color: colors.blue }]}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.analyticsCard, { backgroundColor: colors.white }]}>
          {teamAnalytics.map((member, index) => (
            <View key={index} style={styles.analyticsItem}>
              <View style={styles.memberInfo}>
                <View style={[styles.avatar, { backgroundColor: member.color }]}>
                  <Text style={styles.avatarText}>{member.avatar}</Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                  <Text style={[styles.memberStatus, { color: colors.text }]}>
                    Last active: {member.lastActive}
                  </Text>
                </View>
              </View>
              <View style={styles.analyticsStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.coral }]}>{member.issuesCompleted}</Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.blue }]}>{member.issuesInProgress}</Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>In Progress</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: member.productivity > 80 ? '#4ECDC4' : '#FF6B6B' }]}>
                    {member.productivity}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.text }]}>Productivity</Text>
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
          <View style={styles.activityItem}>
            <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityName, { color: colors.text }]}>John Doe</Text>
              <Text style={[styles.activityText, { color: colors.text }]}>
                Completed issue "Fix login bug"
              </Text>
            </View>
            <Text style={[styles.activityTime, { color: colors.text }]}>2h ago</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.avatar, { backgroundColor: colors.blue }]}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityName, { color: colors.text }]}>Alice Smith</Text>
              <Text style={[styles.activityText, { color: colors.text }]}>
                Started work on "Dashboard redesign"
              </Text>
            </View>
            <Text style={[styles.activityTime, { color: colors.text }]}>4h ago</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.avatar, { backgroundColor: '#4ECDC4' }]}>
              <Text style={styles.avatarText}>MJ</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityName, { color: colors.text }]}>Mike Johnson</Text>
              <Text style={[styles.activityText, { color: colors.text }]}>
                Created new issue "Mobile app testing"
              </Text>
            </View>
            <Text style={[styles.activityTime, { color: colors.text }]}>6h ago</Text>
          </View>
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
    padding: 20,
    paddingTop: 40,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  reportsButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  metricsGrid: {
    padding: 20,
  },
  metricCard: {
    width: '100%',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  sprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sprintName: {
    fontSize: 16,
    fontWeight: '600',
  },
  sprintDays: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberDetails: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberStatus: {
    fontSize: 12,
    opacity: 0.6,
  },
  analyticsStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.7,
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
    marginBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
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
    fontSize: 10,
    opacity: 0.6,
  },
}); 