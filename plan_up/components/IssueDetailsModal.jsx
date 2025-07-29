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
    View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Colors } from '../constants/Colors.jsx';
import SubTaskModal from './SubTaskModal.jsx';
import IssueLinksModal from './IssueLinksModal.jsx';
import WorkflowModal from './WorkflowModal.jsx';
import AdvancedSearchModal from './AdvancedSearchModal.jsx';
import TimeTrackingModal from './TimeTrackingModal.jsx';
import { useTheme } from '../hooks/useTheme';

export default function IssueDetailsModal({ 
  visible, 
  issue, 
  onClose, 
  onUpdate,
  onAddComment,
  onAddTimeLog,
  onAddAttachment,
  addDecisionLogToIssue = () => {},
  userName = 'anonymous',
  epics = [],
  sprints = [],
  // New props for advanced features
  subTasks = [],
  linkedIssues = [],
  allIssues = [],
  timeLogs = [],
  onAddSubTask,
  onUpdateSubTask,
  onDeleteSubTask,
  onToggleSubTask,
  onAddLink,
  onRemoveLink,
  onSearchIssues,
  onAddTimeLogAdvanced,
  onUpdateTimeLog,
  onDeleteTimeLog,
  onUpdateEstimate,
  onSelectWorkflow,
  currentWorkflow,
}) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const [activeTab, setActiveTab] = useState('details');
  const [commentText, setCommentText] = useState('');
  const [timeLogHours, setTimeLogHours] = useState('');
  const [timeLogDescription, setTimeLogDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [decisionLogText, setDecisionLogText] = useState('');
  const [decisionLogLoading, setDecisionLogLoading] = useState(false);
  const [decisionLogError, setDecisionLogError] = useState('');
  
  // New modal states
  const [showSubTasksModal, setShowSubTasksModal] = useState(false);
  const [showIssueLinksModal, setShowIssueLinksModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);

  const tabs = [
    { key: 'details', label: 'Details', icon: 'document' },
    { key: 'subtasks', label: 'Sub-tasks', icon: 'list' },
    { key: 'links', label: 'Links', icon: 'link' },
    { key: 'comments', label: 'Comments', icon: 'chatbubbles' },
    { key: 'time', label: 'Time', icon: 'time' },
    { key: 'attachments', label: 'Attachments', icon: 'attach' },
    { key: 'decisionLog', label: 'Decision Log', icon: 'book' },
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
    if (!timeLogHours && !timeLogDescription.trim()) {
      Alert.alert('Error', 'Please enter either hours or a description');
      return;
    }

    const hours = timeLogHours ? parseFloat(timeLogHours) : 0;
    if (timeLogHours && (isNaN(hours) || hours < 0)) {
      Alert.alert('Error', 'Please enter a valid number of hours');
      return;
    }

    setIsLoading(true);
    try {
      await onAddTimeLog(issue.id, {
        author: userName,
        hours: hours || 0,
        description: timeLogDescription.trim() || 'Time logged',
      });
      setTimeLogHours('');
      setTimeLogDescription('');
      Alert.alert('Success', 'Time logged successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to log time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttachment = async () => {
    try {
      setIsLoading(true);
      
      // Pick a document
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        setIsLoading(false);
        return;
      }

      const file = result.assets[0];
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      const fileSize = fileInfo.size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      
      // Create attachment object
      const attachment = {
        id: Date.now().toString(),
        name: file.name,
        size: `${fileSizeMB} MB`,
        uploadedBy: userName,
        uploadedAt: new Date().toISOString(),
        type: file.mimeType || 'application/octet-stream',
        uri: file.uri,
        fileSize: fileSize,
      };
      
      // Call the onAddAttachment prop if provided
      if (onAddAttachment) {
        await onAddAttachment(issue.id, attachment);
      }
      
      Alert.alert('Success', `File "${file.name}" uploaded successfully!`);
      
    } catch (error) {
      console.error('File upload error:', error);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAttachment = async (attachment) => {
    try {
      if (attachment.uri) {
        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(attachment.uri, {
            mimeType: attachment.type,
            dialogTitle: `Open ${attachment.name}`,
          });
        } else {
          Alert.alert('Info', 'Sharing is not available on this device');
        }
      } else {
        Alert.alert('Error', 'File not found');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open file');
    }
  };

  const getSubTasksProgress = () => {
    if (subTasks.length === 0) return 0;
    const completed = subTasks.filter(task => task.completed).length;
    return Math.round((completed / subTasks.length) * 100);
  };

  const getLinkedIssuesCount = () => {
    return linkedIssues.length;
  };

  const renderDetails = () => (
    <ScrollView style={styles.tabContent}>
      {/* Workflow Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Workflow</Text>
          <TouchableOpacity
            style={[styles.workflowButton, { backgroundColor: colors.coral }]}
            onPress={() => setShowWorkflowModal(true)}
          >
            <Ionicons name="settings" size={16} color="#fff" />
            <Text style={styles.workflowButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Current Status:</Text>
          <View style={[styles.badge, { backgroundColor: statusColors[issue?.status] }]}>
            <Text style={styles.badgeText}>{issue?.status}</Text>
          </View>
        </View>
        
        {currentWorkflow && (
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Workflow:</Text>
            <Text style={[styles.fieldValue, { color: colors.text }]}>{currentWorkflow.name}</Text>
          </View>
        )}
      </View>

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
        
        {issue?.dueDate && (
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Due Date:</Text>
            <Text style={[styles.fieldValue, { color: colors.text }]}>{formatDate(issue.dueDate)}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderSubTasks = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sub-tasks</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.coral }]}
          onPress={() => setShowSubTasksModal(true)}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Summary */}
      <View style={[styles.progressCard, { backgroundColor: colors.white }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>
            Progress
          </Text>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {subTasks.filter(task => task.completed).length} of {subTasks.length} completed
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${getSubTasksProgress()}%`,
                backgroundColor: colors.coral 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
          {getSubTasksProgress()}%
        </Text>
      </View>

      {/* Sub-tasks List */}
      {subTasks.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
          <Ionicons name="list-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No sub-tasks yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Add sub-tasks to break down this issue
          </Text>
        </View>
      ) : (
        <FlatList
          data={subTasks}
          renderItem={({ item }) => (
            <View style={[styles.subTaskItem, { backgroundColor: colors.white }]}>
              <View style={styles.subTaskContent}>
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: item.completed ? colors.coral : 'transparent',
                    borderColor: item.completed ? colors.coral : colors.border
                  }
                ]}>
                  {item.completed && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <View style={styles.subTaskInfo}>
                  <Text style={[
                    styles.subTaskTitle,
                    { 
                      color: item.completed ? colors.textSecondary : colors.text,
                      textDecorationLine: item.completed ? 'line-through' : 'none'
                    }
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.subTaskStatus, { color: colors.textSecondary }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const renderLinks = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Issue Links</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.coral }]}
          onPress={() => setShowIssueLinksModal(true)}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Links Summary */}
      <View style={[styles.linksCard, { backgroundColor: colors.white }]}>
        <View style={styles.linksHeader}>
          <Ionicons name="link" size={24} color={colors.coral} />
          <View style={styles.linksInfo}>
            <Text style={[styles.linksCount, { color: colors.text }]}>
              {getLinkedIssuesCount()} linked issues
            </Text>
            <Text style={[styles.linksSubtext, { color: colors.textSecondary }]}>
              View and manage issue relationships
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Links */}
      {linkedIssues.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
          <Ionicons name="link-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No linked issues
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Link this issue to other issues to show relationships
          </Text>
        </View>
      ) : (
        <FlatList
          data={linkedIssues.slice(0, 5)} // Show first 5
          renderItem={({ item }) => (
            <View style={[styles.linkedIssueItem, { backgroundColor: colors.white }]}>
              <View style={styles.linkedIssueContent}>
                <Text style={[styles.linkedIssueKey, { color: colors.text }]}>
                  {item.issue.key}
                </Text>
                <Text style={[styles.linkedIssueTitle, { color: colors.text }]} numberOfLines={2}>
                  {item.issue.title}
                </Text>
                <View style={styles.linkedIssueMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.issue.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.issue.status) }]}>
                      {item.issue.status}
                    </Text>
                  </View>
                  <Text style={[styles.linkType, { color: colors.textSecondary }]}>
                    {item.linkType}
                  </Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const renderComments = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Comments</Text>
      
      <FlatList
        data={issue?.comments || []}
        renderItem={({ item }) => (
          <View style={[styles.commentItem, { backgroundColor: colors.white }]}>
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
                  backgroundColor: isLoading || !commentText.trim() ? colors.textSecondary : colors.coral,
                },
              ]}
              onPress={handleAddComment}
              disabled={isLoading || !commentText.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add Comment</Text>
              )}
            </TouchableOpacity>
          </View>
        }
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTimeLogs = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Time Tracking</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.coral }]}
          onPress={() => setShowTimeTrackingModal(true)}
        >
          <Ionicons name="time" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Track</Text>
        </TouchableOpacity>
      </View>

      {/* Time Summary */}
      <View style={[styles.timeSummaryCard, { backgroundColor: colors.white }]}>
        <View style={styles.timeSummaryHeader}>
          <Ionicons name="time" size={24} color={colors.coral} />
          <View style={styles.timeSummaryInfo}>
            <Text style={[styles.timeSummaryTitle, { color: colors.text }]}>
              Time Summary
            </Text>
            <Text style={[styles.timeSummarySubtext, { color: colors.textSecondary }]}>
              View detailed time tracking and reports
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Time Log */}
      <View style={[styles.quickTimeLog, { backgroundColor: colors.white }]}>
        <Text style={[styles.quickTimeLogTitle, { color: colors.text }]}>
          Quick Time Log
        </Text>
        
        <View style={styles.timeInputRow}>
          <View style={styles.timeInputContainer}>
            <Text style={[styles.timeInputLabel, { color: colors.textSecondary }]}>Hours</Text>
            <TextInput
              style={[
                styles.timeInput,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={timeLogHours}
              onChangeText={setTimeLogHours}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.timeInputContainer}>
            <Text style={[styles.timeInputLabel, { color: colors.textSecondary }]}>Description</Text>
            <TextInput
              style={[
                styles.timeDescriptionInput,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={timeLogDescription}
              onChangeText={setTimeLogDescription}
              placeholder="What did you work on?"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.logTimeButton,
            {
              backgroundColor: isLoading || (!timeLogHours && !timeLogDescription.trim()) ? colors.textSecondary : colors.coral,
            },
          ]}
          onPress={handleAddTimeLog}
          disabled={isLoading || (!timeLogHours && !timeLogDescription.trim())}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.logTimeButtonText}>Log Time</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAttachments = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Attachments</Text>
      
      {/* Upload Button */}
      <TouchableOpacity
        style={[
          styles.uploadButton, 
          { 
            backgroundColor: colors.white, 
            borderColor: colors.border,
            opacity: isLoading ? 0.6 : 1
          }
        ]}
        onPress={handleAddAttachment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.coral} />
        ) : (
          <>
            <Ionicons name="cloud-upload" size={32} color={colors.coral} />
            <Text style={[styles.uploadText, { color: colors.text }]}>
              Upload Files
            </Text>
            <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
              Tap to select files from your device
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Attachments List */}
      {issue?.attachments && issue.attachments.length > 0 && (
        <View style={styles.attachmentsList}>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Uploaded Files ({issue.attachments.length})
          </Text>
          {issue.attachments.map((attachment, index) => (
            <TouchableOpacity 
              key={attachment.id || index} 
              style={[styles.attachmentItem, { backgroundColor: colors.white }]}
              onPress={() => handleOpenAttachment(attachment)}
            >
              <View style={styles.attachmentInfo}>
                <Ionicons name="document" size={20} color={colors.coral} />
                <View style={styles.attachmentDetails}>
                  <Text style={[styles.attachmentName, { color: colors.text }]} numberOfLines={1}>
                    {attachment.name}
                  </Text>
                  <Text style={[styles.attachmentMeta, { color: colors.textSecondary }]}>
                    {attachment.size} • {formatDate(attachment.uploadedAt)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleOpenAttachment(attachment)}
              >
                <Ionicons name="open" size={16} color={colors.coral} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderDecisionLog = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Decision Log</Text>
      
      <FlatList
        data={issue?.decisionLog || []}
        renderItem={({ item }) => (
          <View style={[styles.decisionItem, { backgroundColor: colors.white }]}>
            <View style={styles.decisionHeader}>
              <Text style={[styles.decisionAuthor, { color: colors.text }]}>{item.author}</Text>
              <Text style={[styles.decisionTime, { color: colors.textSecondary }]}> {formatDateTime(item.createdAt)} </Text>
            </View>
            <Text style={[styles.decisionContent, { color: colors.text }]}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.addDecisionSection}>
            <TextInput
              style={[
                styles.decisionInput,
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
                  backgroundColor: decisionLogLoading || !decisionLogText.trim() ? colors.textSecondary : colors.coral,
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
              disabled={decisionLogLoading || !decisionLogText.trim()}
            >
              {decisionLogLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add Entry</Text>
              )}
            </TouchableOpacity>
          </View>
        }
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetails();
      case 'subtasks':
        return renderSubTasks();
      case 'links':
        return renderLinks();
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

  const getStatusColor = (status) => {
    const statusColors = {
      'To Do': '#E5E5E5',
      'In Progress': '#FF6B6B',
      'Done': '#4ECDC4',
    };
    return statusColors[status] || '#E5E5E5';
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {issue?.key} - {issue?.title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key ? styles.tabButtonActive : {},
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
                  activeTab === tab.key ? styles.tabTextActive : {},
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tab Content */}
          <ScrollView style={styles.content}>
            {renderTabContent()}
          </ScrollView>
        </View>
      </Modal>

      {/* Sub-tasks Modal */}
      <SubTaskModal
        visible={showSubTasksModal}
        parentIssue={issue}
        subTasks={subTasks}
        onClose={() => setShowSubTasksModal(false)}
        onAddSubTask={onAddSubTask}
        onUpdateSubTask={onUpdateSubTask}
        onDeleteSubTask={onDeleteSubTask}
        onToggleSubTask={onToggleSubTask}
      />

      {/* Issue Links Modal */}
      <IssueLinksModal
        visible={showIssueLinksModal}
        currentIssue={issue}
        linkedIssues={linkedIssues}
        allIssues={allIssues}
        onClose={() => setShowIssueLinksModal(false)}
        onAddLink={onAddLink}
        onRemoveLink={onRemoveLink}
        onSearchIssues={onSearchIssues}
      />

      {/* Workflow Modal */}
      <WorkflowModal
        visible={showWorkflowModal}
        currentWorkflow={currentWorkflow}
        onClose={() => setShowWorkflowModal(false)}
        onSelectWorkflow={onSelectWorkflow}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        visible={showAdvancedSearchModal}
        issues={allIssues}
        onClose={() => setShowAdvancedSearchModal(false)}
        onSearch={(searchResults) => {
          // Handle search results
          console.log('Search results:', searchResults);
        }}
      />

      {/* Time Tracking Modal */}
      <TimeTrackingModal
        visible={showTimeTrackingModal}
        issue={issue}
        timeLogs={timeLogs}
        onClose={() => setShowTimeTrackingModal(false)}
        onAddTimeLog={onAddTimeLogAdvanced}
        onUpdateTimeLog={onUpdateTimeLog}
        onDeleteTimeLog={onDeleteTimeLog}
        onUpdateEstimate={onUpdateEstimate}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    height: 48,
    backgroundColor: '#F6F8FB',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 0,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    gap: 6,
    minWidth: 110,
    maxWidth: 140,
    justifyContent: 'center',
    height: 38,
    backgroundColor: '#F0F4FA',
    borderColor: '#D0D7E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonActive: {
    backgroundColor: '#2684FF',
    borderColor: '#2684FF',
    transform: [{ scale: 1.08 }],
    zIndex: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 0,
    marginVertical: 0,
    color: '#1A2330',
  },
  tabTextActive: {
    color: '#fff',
    fontSize: 17,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  workflowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  workflowButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
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
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    textAlign: 'right',
  },
  subTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  subTaskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTaskInfo: {
    flex: 1,
  },
  subTaskTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  subTaskStatus: {
    fontSize: 12,
  },
  linksCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  linksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linksInfo: {
    marginLeft: 12,
    flex: 1,
  },
  linksCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  linksSubtext: {
    fontSize: 12,
  },
  linkedIssueItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  linkedIssueContent: {
    flex: 1,
  },
  linkedIssueKey: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  linkedIssueTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  linkedIssueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  linkType: {
    fontSize: 12,
  },
  commentItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentTime: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  addCommentSection: {
    marginTop: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  timeSummaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  timeSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSummaryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  timeSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeSummarySubtext: {
    fontSize: 12,
  },
  quickTimeLog: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickTimeLogTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  timeInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  timeDescriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  logTimeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logTimeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  uploadButton: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  attachmentsList: {
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentDetails: {
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
  },
  attachmentMeta: {
    fontSize: 12,
  },
  downloadButton: {
    padding: 8,
  },
  decisionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  decisionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  decisionAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  decisionTime: {
    fontSize: 12,
  },
  decisionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  addDecisionSection: {
    marginTop: 16,
  },
  decisionInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
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
}); 