import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/Colors.jsx';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReportsModal from '../../components/ReportsModal';
import { useIssues } from '../../hooks/useIssues';
import { useSprints } from '../../hooks/useSprints';
import { useUser } from '@clerk/clerk-expo';
import { RetrospectiveProvider, useRetrospective } from '../../components/RetrospectiveContext';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  
  const { issues } = useIssues();
  const { sprints } = useSprints();
  const { user } = useUser();
  const userName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'anonymous';

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
    },
    {
      name: 'David Brown',
      avatar: 'DB',
      color: '#9C27B0',
      issuesCompleted: 10,
      issuesInProgress: 2,
      productivity: 88,
      lastActive: '45m ago'
    },
    {
      name: 'Jane Smith',
      avatar: 'JS',
      color: '#607D8B',
      issuesCompleted: 7,
      issuesInProgress: 3,
      productivity: 72,
      lastActive: '1h ago'
    },
    {
      name: 'Robert Chen',
      avatar: 'RC',
      color: '#795548',
      issuesCompleted: 14,
      issuesInProgress: 1,
      productivity: 91,
      lastActive: '15m ago'
    },
    {
      name: 'Emily Davis',
      avatar: 'ED',
      color: '#E91E63',
      issuesCompleted: 5,
      issuesInProgress: 5,
      productivity: 68,
      lastActive: '2h ago'
    },
    {
      name: 'Michael Wong',
      avatar: 'MW',
      color: '#3F51B5',
      issuesCompleted: 11,
      issuesInProgress: 2,
      productivity: 83,
      lastActive: '30m ago'
    }
  ];

  // Personal Focus & Burnout Prevention Section
  const myIssues = issues.filter(issue => issue.assignee === userName);
  const overdue = myIssues.filter(issue => new Date(issue.dueDate) < new Date() && issue.status !== 'Done');
  const inProgress = myIssues.filter(issue => issue.status === 'In Progress');
  const totalEstimated = myIssues.reduce((sum, i) => sum + (i.estimatedHours || 0), 0);
  const totalLogged = myIssues.reduce((sum, i) => sum + (i.loggedHours || 0), 0);
  const workloadLevel = myIssues.length > 7 || totalEstimated > 40 ? 'High' : myIssues.length > 3 ? 'Moderate' : 'Low';
  const burnoutRisk = workloadLevel === 'High' || overdue.length > 2 ? 'At Risk' : 'Healthy';
  const focusSuggestions = [];
  if (burnoutRisk === 'At Risk') focusSuggestions.push('Consider taking a break or reprioritizing tasks.');
  if (overdue.length > 0) focusSuggestions.push('You have overdue tasks. Address them soon.');
  if (workloadLevel === 'High') focusSuggestions.push('Your workload is high. Try to delegate or reschedule some tasks.');
  if (workloadLevel === 'Low') focusSuggestions.push('Great job! Your workload is manageable.');

  // --- Continuous Retrospective Section ---
  function RetrospectiveSection() {
    const { feedback, addFeedback, resolveFeedback, unresolveFeedback } = useRetrospective();
    const [type, setType] = useState('Went Well');
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
      if (!text.trim()) {
        setError('Feedback cannot be empty.');
        return;
      }
      addFeedback(type, text);
      setText('');
      setError('');
    };

    const feedbackTypes = ['Went Well', 'To Improve', 'Action Item'];
    const unresolved = feedback.filter(f => !f.resolved);
    const recent = feedback.slice(0, 5);

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Continuous Retrospective</Text>
        <View style={[styles.focusCard, { backgroundColor: colors.white, marginBottom: 10 }]}> 
          <Text style={{ fontWeight: 'bold', color: colors.coral, marginBottom: 4 }}>Share feedback or action items at any time:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }} contentContainerStyle={{ flexDirection: 'row', gap: 8 }}>
            {feedbackTypes.map(ft => (
              <TouchableOpacity
                key={ft}
                style={{
                  minWidth: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: type === ft ? colors.coral : colors.background,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: colors.coral,
                }}
                onPress={() => setType(ft)}
              >
                <Text style={{ color: type === ft ? '#fff' : colors.coral, fontWeight: '600' }}>{ft}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: colors.coral, borderRadius: 8, padding: 8, marginRight: 8, color: colors.text }}
              placeholder={`Add ${type.toLowerCase()}...`}
              placeholderTextColor={colors.textSecondary}
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: colors.coral, borderRadius: 8, padding: 10 }}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {error ? <Text style={{ color: colors.coral, marginTop: 4 }}>{error}</Text> : null}
        </View>
        <Text style={{ fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>Recent Feedback:</Text>
        {recent.length === 0 && <Text style={{ color: colors.textSecondary }}>No feedback yet.</Text>}
        {recent.map(f => (
          <View key={f.id} style={{ backgroundColor: colors.background, borderRadius: 8, padding: 8, marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.coral, fontWeight: 'bold' }}>{f.type}</Text>
              <Text style={{ color: colors.text }}>{f.text}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>By {f.author} • {new Date(f.createdAt).toLocaleString()}</Text>
            </View>
            {f.type === 'Action Item' && (
              <TouchableOpacity
                onPress={() => f.resolved ? unresolveFeedback(f.id) : resolveFeedback(f.id)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name={f.resolved ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={f.resolved ? '#4ECDC4' : colors.coral} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {unresolved.some(f => f.type === 'Action Item') && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: 'bold', color: colors.coral, marginBottom: 2 }}>Unresolved Action Items:</Text>
            {unresolved.filter(f => f.type === 'Action Item').map(f => (
              <Text key={f.id} style={{ color: colors.textSecondary, marginBottom: 2 }}>• {f.text}</Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <RetrospectiveProvider userEmail={userName}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header (now scrollable, improved alignment) */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          <View style={styles.headerButtonsRow}>
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
              {avatar: 'MJ', name: 'Mike Johnson', text: 'Created new issue "Mobile app testing"', time: '6h ago', color: '#4ECDC4'},
              {avatar: 'DB', name: 'David Brown', text: 'Updated sprint velocity metrics', time: '8h ago', color: '#9C27B0'},
              {avatar: 'JS', name: 'Jane Smith', text: 'Resolved bug in payment system', time: '10h ago', color: '#607D8B'},
              {avatar: 'RC', name: 'Robert Chen', text: 'Deployed new API endpoints', time: '12h ago', color: '#795548'},
              {avatar: 'ED', name: 'Emily Davis', text: 'Completed user research interviews', time: '1d ago', color: '#E91E63'},
              {avatar: 'MW', name: 'Michael Wong', text: 'Optimized database queries', time: '1d ago', color: '#3F51B5'}].map((activity, idx) => (
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

      {/* Personal Focus & Burnout Prevention */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Focus & Burnout Prevention</Text>
        <View style={[styles.focusCard, { backgroundColor: colors.white }]}> 
          <Text style={{ fontWeight: 'bold', color: colors.coral, marginBottom: 4 }}>Hi {userName}, here’s your current focus:</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>Assigned Issues: {myIssues.length}</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>Overdue: {overdue.length}</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>Estimated Hours: {totalEstimated}</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>Logged Hours: {totalLogged}</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>Workload: {workloadLevel}</Text>
          <Text style={{ color: burnoutRisk === 'At Risk' ? colors.coral : '#4ECDC4', fontWeight: 'bold', marginBottom: 8 }}>Burnout Risk: {burnoutRisk}</Text>
          {focusSuggestions.map((s, i) => (
            <Text key={i} style={{ color: colors.textSecondary, marginBottom: 2 }}>• {s}</Text>
          ))}
        </View>
        {myIssues.length > 0 && (
          <View style={[styles.focusList, { backgroundColor: colors.white, marginTop: 10, borderRadius: 8, padding: 10 }]}> 
            <Text style={{ fontWeight: 'bold', color: colors.text, marginBottom: 6 }}>Your Assigned Issues:</Text>
            {myIssues.map(issue => (
              <View key={issue.id} style={{ marginBottom: 8 }}>
                <Text style={{ color: colors.coral, fontWeight: 'bold' }}>{issue.key}: {issue.title}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Due: {new Date(issue.dueDate).toLocaleDateString()} | Status: {issue.status}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* Continuous Retrospective Section */}
      <RetrospectiveSection />
      </ScrollView>

      <ReportsModal
        visible={isReportsModalVisible}
        issues={issues}
        sprints={sprints}
        onClose={() => setIsReportsModalVisible(false)}
      />
    </RetrospectiveProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
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
  focusCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 3,
  },
  focusList: {
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
}); 