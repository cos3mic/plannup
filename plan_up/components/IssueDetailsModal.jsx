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

export default function IssueDetailsModal({ 
  visible, 
  issue, 
  onClose, 
  onUpdate,
  onAddComment,
  onAddTimeLog,
  onAddAttachment,
  addDecisionLogToIssue = () => {}, // Add this prop
  userName = 'anonymous',
  epics = [],
  sprints = [],
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [activeTab, setActiveTab] = useState('details');
  const [commentText, setCommentText] = useState('');
  const [timeLogHours, setTimeLogHours] = useState('');
  const [timeLogDescription, setTimeLogDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decisionLogText, setDecisionLogText] = useState('');
  const [decisionLogLoading, setDecisionLogLoading] = useState(false);
  const [decisionLogError, setDecisionLogError] = useState('');
  // Remove: const userEmail = 'Current User';

  const tabs = [
    { key: 'details', label: 'Details', icon: 'document' },
    { key: 'comments', label: 'Comments', icon: 'chatbubbles' },
    { key: 'time', label: 'Time', icon: 'time' },
    { key: 'attachments', label: 'Attachments', icon: 'attach' },
    { key: 'decisionLog', label: 'Decision Log', icon: 'book' }, // Add tab
  ];

  const priorityColors = {
    'High': '#FF6B6B',
    'Medium': '#FFA500',
    'Low': '#4ECDC4',
  };

  const statusColors = {
    'To Do': '#E5E5E5',
    'In Progress': '#FF6B6B',
    'Done': '#4ECDC4',
  };

  const typeColors = {
    'Bug': '#FF6B6B',
    'Story': '#4ECDC4',
    'Task': '#45B7D1',
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleUpdateField = (field, value) => {
    onUpdate(issue.id, { [field]: value });
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setIsLoading(true);
    try {
      await onAddComment(issue.id, {
        author: 'Current User',
        content: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTimeLog = async () => {
    if (!timeLogHours || !timeLogDescription.trim()) {
      Alert.alert('Error', 'Please enter hours and description');
      return;
    }

    const hours = parseFloat(timeLogHours);
    if (isNaN(hours) || hours <= 0) {
      Alert.alert('Error', 'Please enter a valid number of hours');
      return;
    }

    setIsLoading(true);
    try {
      await onAddTimeLog(issue.id, {
        author: 'Current User',
        hours,
        description: timeLogDescription.trim(),
      });
      setTimeLogHours('');
      setTimeLogDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to log time');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttachment = () => {
    Alert.alert('Info', 'File upload functionality would be implemented here');
  };

  const renderDetails = () => (
    <ScrollView style={styles.tabContent}>
      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Key:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{issue?.key}</Text>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Type:</Text>
          <View style={[styles.badge, { backgroundColor: typeColors[issue?.type] }]}>
            <Text style={styles.badgeText}>{issue?.type}</Text>
          </View>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Priority:</Text>
          <View style={[styles.badge, { backgroundColor: priorityColors[issue?.priority] }]}>
            <Text style={styles.badgeText}>{issue?.priority}</Text>
          </View>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Status:</Text>
          <View style={[styles.badge, { backgroundColor: statusColors[issue?.status] }]}>
            <Text style={styles.badgeText}>{issue?.status}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
        <Text style={[styles.description, { color: colors.text }]}>{issue?.description}</Text>
      </View>

      {/* Assignee & Reporter */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>People</Text>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Assignee:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{issue?.assignee}</Text>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Reporter:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{issue?.reporter}</Text>
        </View>
      </View>

      {/* Dates */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dates</Text>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Created:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{formatDateTime(issue?.created)}</Text>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Updated:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{formatDateTime(issue?.updated)}</Text>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Due Date:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{formatDate(issue?.dueDate)}</Text>
        </View>
      </View>

      {/* Time Tracking */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Time Tracking</Text>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Estimated:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{issue?.estimatedHours}h</Text>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Logged:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{issue?.loggedHours}h</Text>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Remaining:</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{Math.max(0, issue?.estimatedHours - issue?.loggedHours)}h</Text>
        </View>
      </View>

      {/* Labels & Components */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Labels</Text>
        <View style={styles.tagsContainer}>
          {issue?.labels?.map((label, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.coral + '20' }]}>
              <Text style={[styles.tagText, { color: colors.coral }]}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Components</Text>
        <View style={styles.tagsContainer}>
          {issue?.components?.map((component, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.blue + '20' }]}>
              <Text style={[styles.tagText, { color: colors.blue }]}>{component}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderComments = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={issue?.comments || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.commentItem, { backgroundColor: colors.white }]}>
            <View style={styles.commentHeader}>
              <Text style={[styles.commentAuthor, { color: colors.text }]}>{item.author}</Text>
              <Text style={[styles.commentTime, { color: colors.textSecondary }]}>
                {formatDateTime(item.timestamp)}
              </Text>
            </View>
            <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.addCommentSection}>
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: isLoading ? colors.textSecondary : colors.coral,
                },
              ]}
              onPress={handleAddComment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add Comment</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );

  const renderTimeLogs = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={issue?.timeLogs || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.timeLogItem, { backgroundColor: colors.white }]}>
            <View style={styles.timeLogHeader}>
              <Text style={[styles.timeLogAuthor, { color: colors.text }]}>{item.author}</Text>
              <Text style={[styles.timeLogHours, { color: colors.coral }]}>{item.hours}h</Text>
            </View>
            <Text style={[styles.timeLogDescription, { color: colors.text }]}>{item.description}</Text>
            <Text style={[styles.timeLogDate, { color: colors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.addTimeLogSection}>
            <View style={styles.timeLogInputRow}>
              <TextInput
                style={[
                  styles.timeLogInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={timeLogHours}
                onChangeText={setTimeLogHours}
                placeholder="Hours"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <TextInput
                style={[
                  styles.timeLogInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                    flex: 1,
                    marginLeft: 8,
                  },
                ]}
                value={timeLogDescription}
                onChangeText={setTimeLogDescription}
                placeholder="Description"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
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
                <Text style={styles.addButtonText}>Log Time</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );

  const renderAttachments = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={issue?.attachments || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.attachmentItem, { backgroundColor: colors.white }]}>
            <Ionicons name="document" size={24} color={colors.coral} />
            <View style={styles.attachmentInfo}>
              <Text style={[styles.attachmentName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.attachmentDetails, { color: colors.textSecondary }]}>
                {item.size} • {item.uploadedBy} • {formatDateTime(item.uploadedAt)}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="download" size={20} color={colors.blue} />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={[styles.addAttachmentButton, { borderColor: colors.border }]}
            onPress={handleAddAttachment}
          >
            <Ionicons name="add" size={24} color={colors.coral} />
            <Text style={[styles.addAttachmentText, { color: colors.coral }]}>Add Attachment</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );

  const renderDecisionLog = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={issue?.decisionLog || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.commentItem, { backgroundColor: colors.white }]}> {/* Reuse commentItem style */}
            <View style={styles.commentHeader}>
              <Text style={[styles.commentAuthor, { color: colors.text }]}>{item.author}</Text>
              <Text style={[styles.commentTime, { color: colors.textSecondary }]}> {formatDateTime(item.createdAt)} </Text>
            </View>
            <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.addCommentSection}>
            <TextInput
              style={[
                styles.commentInput,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={decisionLogText}
              onChangeText={setDecisionLogText}
              placeholder="Add context, rationale, or decision..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
            {decisionLogError ? <Text style={{ color: 'red' }}>{decisionLogError}</Text> : null}
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: decisionLogLoading ? colors.textSecondary : colors.coral,
                },
              ]}
              onPress={async () => {
                if (!decisionLogText.trim()) {
                  setDecisionLogError('Please enter a decision/context.');
                  return;
                }
                setDecisionLogLoading(true);
                setDecisionLogError('');
                try {
                  await addDecisionLogToIssue(issue.id, {
                    author: userName,
                    content: decisionLogText.trim(),
                  });
                  setDecisionLogText('');
                } catch (e) {
                  setDecisionLogError('Failed to add entry.');
                } finally {
                  setDecisionLogLoading(false);
                }
              }}
              disabled={decisionLogLoading}
            >
              {decisionLogLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add Entry</Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetails();
      case 'comments':
        return renderComments();
      case 'time':
        return renderTimeLogs();
      case 'attachments':
        return renderAttachments();
      case 'decisionLog':
        return renderDecisionLog();
      default:
        return renderDetails();
    }
  };

  if (!issue) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.issueKey, { color: colors.text }]}>{issue.key}</Text>
            <Text style={[styles.issueTitle, { color: colors.text }]}>{issue.title}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                {
                  borderBottomColor: activeTab === tab.key ? colors.coral : 'transparent',
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.key ? colors.coral : colors.textSecondary} 
              />
              <Text 
                style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? colors.coral : colors.textSecondary }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
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
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  issueKey: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  tabText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  tabContent: {
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
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  fieldValue: {
    fontSize: 14,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentItem: {
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  addCommentSection: {
    padding: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    minHeight: 80,
  },
  timeLogItem: {
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 8,
  },
  timeLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeLogAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeLogHours: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeLogDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeLogDate: {
    fontSize: 12,
  },
  addTimeLogSection: {
    padding: 20,
  },
  timeLogInputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeLogInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    width: 80,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  attachmentDetails: {
    fontSize: 12,
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addAttachmentText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 