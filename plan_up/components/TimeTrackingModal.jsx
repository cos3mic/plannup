import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';

const timeCategories = [
  { key: 'development', label: 'Development', icon: 'code', color: '#4CAF50' },
  { key: 'testing', label: 'Testing', icon: 'bug', color: '#FF9800' },
  { key: 'design', label: 'Design', icon: 'brush', color: '#9C27B0' },
  { key: 'research', label: 'Research', icon: 'search', color: '#2196F3' },
  { key: 'meeting', label: 'Meeting', icon: 'people', color: '#607D8B' },
  { key: 'documentation', label: 'Documentation', icon: 'document', color: '#795548' },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#9E9E9E' },
];

export default function TimeTrackingModal({ 
  visible, 
  issue, 
  timeLogs = [], 
  onClose, 
  onAddTimeLog,
  onUpdateTimeLog,
  onDeleteTimeLog,
  onUpdateEstimate
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [activeTab, setActiveTab] = useState('log');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('development');
  const [isLoading, setIsLoading] = useState(false);
  const [estimateHours, setEstimateHours] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState('');

  const tabs = [
    { key: 'log', label: 'Log Time', icon: 'time' },
    { key: 'history', label: 'History', icon: 'list' },
    { key: 'reports', label: 'Reports', icon: 'analytics' },
    { key: 'estimate', label: 'Estimate', icon: 'calculator' },
  ];

  useEffect(() => {
    if (issue) {
      setEstimateHours(Math.floor((issue.estimatedHours || 0) / 60).toString());
      setEstimateMinutes(((issue.estimatedHours || 0) % 60).toString());
    }
  }, [issue]);

  const handleAddTimeLog = async () => {
    if (!hours && !minutes) {
      Alert.alert('Error', 'Please enter time spent');
      return;
    }

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    if (totalMinutes === 0) {
      Alert.alert('Error', 'Please enter valid time');
      return;
    }

    setIsLoading(true);
    try {
      await onAddTimeLog(issue.id, {
        hours: totalMinutes / 60,
        description: description.trim() || 'Time logged',
        category: selectedCategory,
        date: new Date(),
      });
      
      // Reset form
      setHours('');
      setMinutes('');
      setDescription('');
      setSelectedCategory('development');
    } catch (error) {
      Alert.alert('Error', 'Failed to log time');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEstimate = async () => {
    const totalMinutes = (parseInt(estimateHours) || 0) * 60 + (parseInt(estimateMinutes) || 0);
    
    setIsLoading(true);
    try {
      await onUpdateEstimate(issue.id, totalMinutes / 60);
      Alert.alert('Success', 'Estimate updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update estimate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimeLog = (timeLogId) => {
    Alert.alert(
      'Delete Time Log',
      'Are you sure you want to delete this time log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteTimeLog(issue.id, timeLogId)
        },
      ]
    );
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTotalLoggedTime = () => {
    return timeLogs.reduce((total, log) => total + log.hours, 0);
  };

  const getRemainingTime = () => {
    const estimated = issue?.estimatedHours || 0;
    const logged = getTotalLoggedTime();
    return Math.max(0, estimated - logged);
  };

  const getProgressPercentage = () => {
    const estimated = issue?.estimatedHours || 0;
    if (estimated === 0) return 0;
    const logged = getTotalLoggedTime();
    return Math.min(100, (logged / estimated) * 100);
  };

  const getCategoryInfo = (category) => {
    return timeCategories.find(cat => cat.key === category) || timeCategories[0];
  };

  const renderTimeLog = ({ item }) => {
    const categoryInfo = getCategoryInfo(item.category);
    
    return (
      <View style={[styles.timeLogItem, { backgroundColor: colors.white }]}>
        <View style={styles.timeLogHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '20' }]}>
            <Ionicons name={categoryInfo.icon} size={16} color={categoryInfo.color} />
            <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
              {categoryInfo.label}
            </Text>
          </View>
          <Text style={[styles.timeLogDate, { color: colors.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        
        <Text style={[styles.timeLogDescription, { color: colors.text }]}>
          {item.description}
        </Text>
        
        <View style={styles.timeLogFooter}>
          <Text style={[styles.timeLogHours, { color: colors.coral }]}>
            {formatTime(item.hours)}
          </Text>
          <TouchableOpacity
            style={styles.deleteTimeLogButton}
            onPress={() => handleDeleteTimeLog(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedCategory === item.key ? item.color : colors.white,
          borderColor: selectedCategory === item.key ? item.color : colors.border,
        },
      ]}
      onPress={() => setSelectedCategory(item.key)}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedCategory === item.key ? '#fff' : item.color} 
      />
      <Text style={[
        styles.categoryButtonText,
        { color: selectedCategory === item.key ? '#fff' : colors.text }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Time Tracking
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Issue Info */}
        <View style={[styles.issueCard, { backgroundColor: colors.white }]}>
          <Text style={[styles.issueTitle, { color: colors.text }]}>
            {issue?.title}
          </Text>
          <Text style={[styles.issueKey, { color: colors.textSecondary }]}>
            {issue?.key}
          </Text>
        </View>

        {/* Time Summary */}
        <View style={styles.timeSummary}>
          <View style={[styles.summaryCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Estimated
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formatTime(issue?.estimatedHours || 0)}
            </Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Logged
            </Text>
            <Text style={[styles.summaryValue, { color: colors.coral }]}>
              {formatTime(getTotalLoggedTime())}
            </Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Remaining
            </Text>
            <Text style={[styles.summaryValue, { color: getRemainingTime() > 0 ? colors.blue : colors.text }]}>
              {formatTime(getRemainingTime())}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>
              Progress
            </Text>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {Math.round(getProgressPercentage())}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressPercentage() > 100 ? '#FF6B6B' : colors.coral 
                }
              ]} 
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: activeTab === tab.key ? colors.coral : colors.white,
                    borderColor: activeTab === tab.key ? colors.coral : colors.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={18} 
                  color={activeTab === tab.key ? '#fff' : colors.textSecondary} 
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? '#fff' : colors.text }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content}>
          {/* Log Time Tab */}
          {activeTab === 'log' && (
            <View style={styles.logTimeSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Log Time
              </Text>
              
              {/* Time Input */}
              <View style={styles.timeInputSection}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Time Spent
                </Text>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.white,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={hours}
                      onChangeText={setHours}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.timeUnit, { color: colors.textSecondary }]}>
                      hours
                    </Text>
                  </View>
                  
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.white,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={minutes}
                      onChangeText={setMinutes}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.timeUnit, { color: colors.textSecondary }]}>
                      minutes
                    </Text>
                  </View>
                </View>
              </View>

              {/* Category Selection */}
              <View style={styles.categorySection}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Category
                </Text>
                <FlatList
                  data={timeCategories}
                  renderItem={renderCategoryButton}
                  keyExtractor={(item) => item.key}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                />
              </View>

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Description
                </Text>
                <TextInput
                  style={[
                    styles.descriptionInput,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What did you work on?"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Log Button */}
              <TouchableOpacity
                style={[
                  styles.logButton,
                  {
                    backgroundColor: isLoading ? colors.textSecondary : colors.coral,
                  },
                ]}
                onPress={handleAddTimeLog}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.logButtonText}>
                    Log Time
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <View style={styles.historySection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Time Log History
              </Text>
              {timeLogs.length === 0 ? (
                <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
                  <Ionicons name="time-outline" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No time logs yet
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                    Start logging time to track your work
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={timeLogs}
                  renderItem={renderTimeLog}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <View style={styles.reportsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Time Reports
              </Text>
              
              {/* Category Breakdown */}
              <View style={[styles.reportCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.reportTitle, { color: colors.text }]}>
                  Time by Category
                </Text>
                {timeCategories.map(category => {
                  const categoryTime = timeLogs
                    .filter(log => log.category === category.key)
                    .reduce((total, log) => total + log.hours, 0);
                  
                  if (categoryTime === 0) return null;
                  
                  return (
                    <View key={category.key} style={styles.categoryReport}>
                      <View style={styles.categoryReportHeader}>
                        <Ionicons name={category.icon} size={16} color={category.color} />
                        <Text style={[styles.categoryReportLabel, { color: colors.text }]}>
                          {category.label}
                        </Text>
                      </View>
                      <Text style={[styles.categoryReportTime, { color: colors.coral }]}>
                        {formatTime(categoryTime)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Weekly Summary */}
              <View style={[styles.reportCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.reportTitle, { color: colors.text }]}>
                  This Week
                </Text>
                <Text style={[styles.weeklyTime, { color: colors.coral }]}>
                  {formatTime(getTotalLoggedTime())}
                </Text>
                <Text style={[styles.weeklyLabel, { color: colors.textSecondary }]}>
                  Total time logged
                </Text>
              </View>
            </View>
          )}

          {/* Estimate Tab */}
          {activeTab === 'estimate' && (
            <View style={styles.estimateSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Update Estimate
              </Text>
              
              <View style={styles.estimateInputSection}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Estimated Time
                </Text>
                <View style={styles.timeInputRow}>
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.white,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={estimateHours}
                      onChangeText={setEstimateHours}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.timeUnit, { color: colors.textSecondary }]}>
                      hours
                    </Text>
                  </View>
                  
                  <View style={styles.timeInputContainer}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: colors.white,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      value={estimateMinutes}
                      onChangeText={setEstimateMinutes}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.timeUnit, { color: colors.textSecondary }]}>
                      minutes
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.updateEstimateButton,
                  {
                    backgroundColor: isLoading ? colors.textSecondary : colors.blue,
                  },
                ]}
                onPress={handleUpdateEstimate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.updateEstimateButtonText}>
                    Update Estimate
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  issueCard: {
    padding: 16,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  issueKey: {
    fontSize: 14,
  },
  timeSummary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logTimeSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeInputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  timeInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  timeUnit: {
    fontSize: 12,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryList: {
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
  },
  logButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  historySection: {
    flex: 1,
  },
  timeLogItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  timeLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeLogDate: {
    fontSize: 12,
  },
  timeLogDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  timeLogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLogHours: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteTimeLogButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  reportsSection: {
    flex: 1,
  },
  reportCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryReportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryReportLabel: {
    fontSize: 14,
  },
  categoryReportTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyTime: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  weeklyLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  estimateSection: {
    flex: 1,
  },
  estimateInputSection: {
    marginBottom: 20,
  },
  updateEstimateButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateEstimateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 