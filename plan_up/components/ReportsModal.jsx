import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { useTheme } from '../hooks/useTheme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ReportsModal({ visible, onClose }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [reportData, setReportData] = useState(null);

  if (!visible) return null;

  const reportTypes = [
    {
      id: 'velocity',
      title: 'Sprint Velocity',
      description: 'Track team velocity and story point completion',
      icon: 'trending-up',
      color: colors.blue,
    },
    {
      id: 'burndown',
      title: 'Burndown Chart',
      description: 'Monitor sprint progress and remaining work',
      icon: 'analytics',
      color: colors.blueAccent,
    },
    {
      id: 'issues',
      title: 'Issue Analysis',
      description: 'Analyze issue distribution and trends',
      icon: 'bug',
      color: colors.error,
    },
    {
      id: 'team',
      title: 'Team Performance',
      description: 'Track individual and team productivity',
      icon: 'people',
      color: colors.blue,
    },
    {
      id: 'timeline',
      title: 'Project Timeline',
      description: 'View project milestones and deadlines',
      icon: 'calendar',
      color: colors.blueAccent,
    },
    {
      id: 'custom',
      title: 'Custom Report',
      description: 'Create your own custom report',
      icon: 'create',
      color: colors.textSecondary,
    },
  ];

  const exportFormats = [
    { key: 'pdf', label: 'PDF', icon: 'document' },
    { key: 'csv', label: 'CSV', icon: 'grid' },
    { key: 'excel', label: 'Excel', icon: 'table' },
  ];

  const generateReportData = (reportType) => {
    // Mock data generation - in real app, this would fetch from your backend
    const timestamp = new Date().toISOString().split('T')[0];
    const data = {
      title: `${reportType.title} Report`,
      date: timestamp,
      data: {
        totalIssues: 156,
        completedIssues: 89,
        inProgressIssues: 23,
        overdueIssues: 5,
        teamVelocity: 85,
        sprintProgress: 78,
        averageCycleTime: 4.2,
        sprintCompletionRate: 92,
        teamProductivity: 87,
        defectRate: 3.2,
      }
    };
    setReportData(data);
    return data;
  };

  const exportToFile = async (reportType, format) => {
    setIsLoading(true);
    
    try {
      const reportData = generateReportData(reportType);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${reportType.id}_report_${timestamp}`;
      
      let fileContent = '';
      let fileExtension = '';
      let mimeType = '';
      
      switch (format) {
        case 'pdf':
          fileExtension = 'pdf';
          mimeType = 'application/pdf';
          fileContent = `Report: ${reportData.title}\nDate: ${reportData.date}\n\nData:\n${JSON.stringify(reportData.data, null, 2)}`;
          break;
        case 'csv':
          fileExtension = 'csv';
          mimeType = 'text/csv';
          fileContent = `Metric,Value\nTotal Issues,${reportData.data.totalIssues}\nCompleted Issues,${reportData.data.completedIssues}\nIn Progress Issues,${reportData.data.inProgressIssues}\nOverdue Issues,${reportData.data.overdueIssues}\nTeam Velocity,${reportData.data.teamVelocity}\nSprint Progress,${reportData.data.sprintProgress}`;
          break;
        case 'excel':
          fileExtension = 'xlsx';
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileContent = `Report: ${reportData.title}\nDate: ${reportData.date}\n\nData:\n${JSON.stringify(reportData.data, null, 2)}`;
          break;
      }
      
      const fileUri = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;
      await FileSystem.writeAsStringAsync(fileUri, fileContent);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType,
          dialogTitle: `Export ${reportType.title}`,
        });
      } else {
        Alert.alert(
          'Export Complete',
          `Report saved to: ${fileUri}`,
          [{ text: 'OK' }]
        );
      }
      
      Alert.alert(
        'Export Successful',
        `${reportType.title} has been exported as ${format.toUpperCase()} and shared.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export report. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedReport(null);
      setReportData(null);
    }
  };

  const handleGenerateReport = async (reportType) => {
    setSelectedReport(reportType);
    generateReportData(reportType);
  };

  const handleClose = () => {
    setSelectedReport(null);
    setReportData(null);
    onClose();
  };

  const renderReportPreview = () => {
    if (!reportData) return null;
    
    return (
      <View style={[styles.previewCard, { backgroundColor: colors.white }]}>
        <Text style={[styles.previewTitle, { color: colors.text }]}>Report Preview</Text>
        <View style={styles.previewData}>
          {Object.entries(reportData.data).map(([key, value]) => (
            <View key={key} style={styles.previewRow}>
              <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              </Text>
              <Text style={[styles.previewValue, { color: colors.text }]}>
                {typeof value === 'number' && key.includes('Rate') ? `${value}%` : value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
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
          {!selectedReport ? (
            <>
              <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Available Reports
                </Text>
                <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                  Generate and export detailed reports for your project analytics.
          </Text>
              </View>
          
          <View style={styles.reportsGrid}>
            {reportTypes.map((report) => (
              <TouchableOpacity
                key={report.id}
                    style={[styles.reportCard, { backgroundColor: colors.white, borderColor: colors.border }]}
                onPress={() => handleGenerateReport(report)}
              >
                <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
                  <Ionicons name={report.icon} size={24} color={report.color} />
                </View>
                  <Text style={[styles.reportTitle, { color: colors.text }]}>
                    {report.title}
                  </Text>
                  <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                    {report.description}
                  </Text>
              </TouchableOpacity>
            ))}
          </View>
            </>
          ) : (
            <View style={styles.exportSection}>
              <View style={styles.reportPreview}>
                <View style={[styles.reportIcon, { backgroundColor: selectedReport.color + '20' }]}>
                  <Ionicons name={selectedReport.icon} size={32} color={selectedReport.color} />
                </View>
                <Text style={[styles.reportTitle, { color: colors.text }]}>
                  {selectedReport.title}
            </Text>
                <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                  {selectedReport.description}
            </Text>
              </View>
              
              {renderReportPreview()}

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Export Format
                </Text>
                <View style={styles.formatOptions}>
                  {exportFormats.map((format) => (
                    <TouchableOpacity
                      key={format.key}
                      style={[
                        styles.formatOption,
                        {
                          backgroundColor: exportFormat === format.key ? colors.blue : colors.white,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => setExportFormat(format.key)}
                    >
                      <Ionicons 
                        name={format.icon} 
                        size={20} 
                        color={exportFormat === format.key ? colors.white : colors.textSecondary} 
                      />
                      <Text style={[
                        styles.formatText,
                        { color: exportFormat === format.key ? colors.white : colors.text }
                      ]}>
                        {format.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Export Location
                </Text>
                <View style={[styles.locationCard, { backgroundColor: colors.blueLight }]}>
                  <Ionicons name="folder" size={20} color={colors.blue} />
                  <Text style={[styles.locationText, { color: colors.text }]}>
                    Files will be saved to your device's Downloads folder and can be shared via email, cloud storage, or other apps.
                  </Text>
                </View>
              </View>
          
          <TouchableOpacity
            style={[
              styles.exportButton,
              {
                    backgroundColor: isLoading ? colors.textSecondary : colors.blue,
              },
            ]}
                onPress={() => exportToFile(selectedReport, exportFormat)}
            disabled={isLoading}
          >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="download" size={20} color={colors.white} />
                    <Text style={styles.exportButtonText}>
                      Export as {exportFormat.toUpperCase()}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.backButton, { borderColor: colors.border }]}
                onPress={() => setSelectedReport(null)}
              >
                <Text style={[styles.backButtonText, { color: colors.text }]}>
                  Back to Reports
                </Text>
          </TouchableOpacity>
        </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
  },
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  exportSection: {
    flex: 1,
  },
  reportPreview: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewData: {
    gap: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  formatOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  formatOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  formatText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 