import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';

export default function ReportsModal({ 
  visible, 
  issues = [], 
  sprints = [],
  onClose 
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [selectedReport, setSelectedReport] = useState('overview');

  const reports = [
    { key: 'overview', label: 'Overview', icon: 'analytics' },
    { key: 'velocity', label: 'Velocity', icon: 'speedometer' },
    { key: 'burndown', label: 'Burndown', icon: 'trending-down' },
    { key: 'team', label: 'Team Performance', icon: 'people' },
    { key: 'issues', label: 'Issue Analysis', icon: 'list' },
  ];

  // Calculate metrics
  const totalIssues = issues.length;
  const completedIssues = issues.filter(issue => issue.status === 'Done').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'In Progress').length;
  const todoIssues = issues.filter(issue => issue.status === 'To Do').length;
  
  const totalStoryPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
  const completedStoryPoints = issues
    .filter(issue => issue.status === 'Done')
    .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

  const activeSprints = sprints.filter(sprint => sprint.status === 'active');
  const completedSprints = sprints.filter(sprint => sprint.status === 'completed');

  const teamMembers = [...new Set(issues.map(issue => issue.assignee))];
  const teamPerformance = teamMembers.map(member => {
    const memberIssues = issues.filter(issue => issue.assignee === member);
    const completed = memberIssues.filter(issue => issue.status === 'Done').length;
    const total = memberIssues.length;
    return {
      name: member,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const issueTypes = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  const issuePriorities = issues.reduce((acc, issue) => {
    acc[issue.priority] = (acc[issue.priority] || 0) + 1;
    return acc;
  }, {});

  const renderOverview = () => (
    <ScrollView style={styles.reportContent}>
      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.white }]}>
            <Ionicons name="list" size={24} color={colors.coral} />
            <Text style={[styles.metricValue, { color: colors.text }]}>{totalIssues}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Total Issues</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.white }]}>
            <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{completedIssues}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Completed</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.white }]}>
            <Ionicons name="time" size={24} color={colors.blue} />
            <Text style={[styles.metricValue, { color: colors.text }]}>{inProgressIssues}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>In Progress</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.white }]}>
            <Ionicons name="analytics" size={24} color="#FFA500" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{totalStoryPoints}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Story Points</Text>
          </View>
        </View>
      </View>

      {/* Sprint Status */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sprint Status</Text>
        <View style={styles.sprintStats}>
          <View style={[styles.sprintStat, { backgroundColor: colors.white }]}>
            <Text style={[styles.sprintStatValue, { color: colors.coral }]}>
              {activeSprints.length}
            </Text>
            <Text style={[styles.sprintStatLabel, { color: colors.text }]}>Active Sprints</Text>
          </View>
          
          <View style={[styles.sprintStat, { backgroundColor: colors.white }]}>
            <Text style={[styles.sprintStatValue, { color: '#4ECDC4' }]}>
              {completedSprints.length}
            </Text>
            <Text style={[styles.sprintStatLabel, { color: colors.text }]}>Completed Sprints</Text>
          </View>
        </View>
      </View>

      {/* Progress Chart */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress Overview</Text>
        <View style={[styles.progressCard, { backgroundColor: colors.white }]}>
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>To Do</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(todoIssues / totalIssues) * 100}%`,
                    backgroundColor: colors.textSecondary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressValue, { color: colors.text }]}>{todoIssues}</Text>
          </View>
          
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>In Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(inProgressIssues / totalIssues) * 100}%`,
                    backgroundColor: colors.coral 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressValue, { color: colors.text }]}>{inProgressIssues}</Text>
          </View>
          
          <View style={styles.progressItem}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>Done</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(completedIssues / totalIssues) * 100}%`,
                    backgroundColor: '#4ECDC4' 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressValue, { color: colors.text }]}>{completedIssues}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderVelocity = () => (
    <ScrollView style={styles.reportContent}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Velocity Chart</Text>
        <View style={[styles.velocityCard, { backgroundColor: colors.white }]}>
          <Text style={[styles.velocityTitle, { color: colors.text }]}>Story Points Completed</Text>
          <Text style={[styles.velocityValue, { color: colors.coral }]}>{completedStoryPoints}</Text>
          <Text style={[styles.velocitySubtitle, { color: colors.textSecondary }]}>
            out of {totalStoryPoints} total points
          </Text>
          
          <View style={styles.velocityProgress}>
            <View style={styles.velocityBar}>
              <View 
                style={[
                  styles.velocityFill, 
                  { 
                    width: `${(completedStoryPoints / totalStoryPoints) * 100}%`,
                    backgroundColor: colors.coral 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.velocityPercentage, { color: colors.text }]}>
              {Math.round((completedStoryPoints / totalStoryPoints) * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderTeamPerformance = () => (
    <ScrollView style={styles.reportContent}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Performance</Text>
        <FlatList
          data={teamPerformance}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={[styles.teamMemberCard, { backgroundColor: colors.white }]}>
              <View style={styles.teamMemberInfo}>
                <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
                  <Text style={styles.avatarText}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.teamMemberDetails}>
                  <Text style={[styles.teamMemberName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.teamMemberStats, { color: colors.textSecondary }]}>
                    {item.completed}/{item.total} issues completed
                  </Text>
                </View>
              </View>
              
              <View style={styles.teamMemberProgress}>
                <View style={styles.teamProgressBar}>
                  <View 
                    style={[
                      styles.teamProgressFill, 
                      { 
                        width: `${item.percentage}%`,
                        backgroundColor: item.percentage > 80 ? '#4ECDC4' : 
                                       item.percentage > 60 ? colors.coral : '#FFA500'
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.teamProgressText, { color: colors.text }]}>
                  {item.percentage}%
                </Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );

  const renderIssueAnalysis = () => (
    <ScrollView style={styles.reportContent}>
      {/* Issue Types */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Issue Types</Text>
        <View style={[styles.analysisCard, { backgroundColor: colors.white }]}>
          {Object.entries(issueTypes).map(([type, count]) => (
            <View key={type} style={styles.analysisItem}>
              <Text style={[styles.analysisLabel, { color: colors.text }]}>{type}</Text>
              <Text style={[styles.analysisValue, { color: colors.coral }]}>{count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Issue Priorities */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Issue Priorities</Text>
        <View style={[styles.analysisCard, { backgroundColor: colors.white }]}>
          {Object.entries(issuePriorities).map(([priority, count]) => (
            <View key={priority} style={styles.analysisItem}>
              <Text style={[styles.analysisLabel, { color: colors.text }]}>{priority}</Text>
              <Text style={[styles.analysisValue, { color: colors.coral }]}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverview();
      case 'velocity':
        return renderVelocity();
      case 'team':
        return renderTeamPerformance();
      case 'issues':
        return renderIssueAnalysis();
      default:
        return renderOverview();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Reports & Analytics</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Report Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContent}
        >
          {reports.map((report) => (
            <TouchableOpacity
              key={report.key}
              style={[
                styles.reportTab,
                {
                  backgroundColor: selectedReport === report.key ? colors.coral : 'transparent',
                  borderColor: selectedReport === report.key ? colors.coral : colors.border
                }
              ]}
              onPress={() => setSelectedReport(report.key)}
            >
              <Ionicons 
                name={report.icon} 
                size={16} 
                color={selectedReport === report.key ? '#fff' : colors.textSecondary} 
              />
              <Text 
                style={[
                  styles.reportTabText,
                  { color: selectedReport === report.key ? '#fff' : colors.textSecondary }
                ]}
              >
                {report.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderReportContent()}
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
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  reportTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  reportTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportContent: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  sprintStats: {
    flexDirection: 'row',
    gap: 12,
  },
  sprintStat: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sprintStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sprintStatLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  velocityCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  velocityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  velocityValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  velocitySubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  velocityProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  velocityBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
    marginRight: 12,
  },
  velocityFill: {
    height: '100%',
    borderRadius: 6,
  },
  velocityPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 40,
  },
  teamMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  teamMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontWeight: 'bold',
  },
  teamMemberDetails: {
    flex: 1,
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  teamMemberStats: {
    fontSize: 12,
  },
  teamMemberProgress: {
    alignItems: 'flex-end',
  },
  teamProgressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginBottom: 4,
  },
  teamProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  teamProgressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  analysisCard: {
    padding: 16,
    borderRadius: 12,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 