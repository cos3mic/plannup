import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';

export default function ReportsModal({ visible, onClose }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reportTypes = [
    {
      id: 'velocity',
      title: 'Sprint Velocity',
      description: 'Track team velocity and story point completion',
      icon: 'trending-up',
      color: '#4CAF50',
    },
    {
      id: 'burndown',
      title: 'Burndown Chart',
      description: 'Monitor sprint progress and remaining work',
      icon: 'analytics',
      color: '#FF9800',
    },
    {
      id: 'issues',
      title: 'Issue Analysis',
      description: 'Analyze issue distribution and trends',
      icon: 'bug',
      color: '#F44336',
    },
    {
      id: 'team',
      title: 'Team Performance',
      description: 'Track individual and team productivity',
      icon: 'people',
      color: '#2196F3',
    },
    {
      id: 'timeline',
      title: 'Project Timeline',
      description: 'View project milestones and deadlines',
      icon: 'calendar',
      color: '#9C27B0',
    },
    {
      id: 'custom',
      title: 'Custom Report',
      description: 'Create your own custom report',
      icon: 'create',
      color: '#607D8B',
    },
  ];

  const handleGenerateReport = async (reportType) => {
    setSelectedReport(reportType);
    setIsLoading(true);
    
    try {
      // Here you would integrate with Jira/ClickUp APIs
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Report Generated',
        `${reportType.title} report has been generated successfully!`,
        [{ text: 'OK', onPress: () => setSelectedReport(null) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReport(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Reports & Analytics
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose a Report Type
          </Text>
          
          <View style={styles.reportsGrid}>
            {reportTypes.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[
                  styles.reportCard,
                  { 
                    backgroundColor: colors.white,
                    borderColor: selectedReport?.id === report.id ? report.color : colors.border,
                    borderWidth: selectedReport?.id === report.id ? 2 : 1,
                  }
                ]}
                onPress={() => handleGenerateReport(report)}
                disabled={isLoading}
              >
                <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
                  <Ionicons name={report.icon} size={24} color={report.color} />
                </View>
                
                <View style={styles.reportInfo}>
                  <Text style={[styles.reportTitle, { color: colors.text }]}>
                    {report.title}
                  </Text>
                  <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                    {report.description}
                  </Text>
                </View>
                
                {isLoading && selectedReport?.id === report.id && (
                  <ActivityIndicator color={report.color} size="small" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Report Info */}
          <View style={[styles.infoCard, { backgroundColor: colors.white }]}>
            <Ionicons name="information-circle" size={20} color={colors.blue} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Reports help you track progress, identify bottlenecks, and make data-driven decisions.
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Stats
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.statValue, { color: colors.coral }]}>12</Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Active Issues</Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.statValue, { color: colors.blue }]}>3</Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Sprints</Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>85%</Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Completion</Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.statValue, { color: '#FF9800' }]}>24</Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Story Points</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={handleClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Close
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.exportButton,
              {
                backgroundColor: isLoading ? colors.textSecondary : colors.coral,
              },
            ]}
            onPress={() => Alert.alert('Export', 'Export functionality coming soon!')}
            disabled={isLoading}
          >
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  reportsGrid: {
    marginBottom: 24,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
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
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  quickStats: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exportButton: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    marginLeft: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 