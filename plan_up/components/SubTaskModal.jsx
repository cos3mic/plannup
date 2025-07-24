import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

export default function SubTaskModal({ 
  visible, 
  parentIssue, 
  subTasks = [], 
  onClose, 
  onAddSubTask,
  onUpdateSubTask,
  onDeleteSubTask,
  onToggleSubTask
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSubTask = async () => {
    if (!newSubTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a sub-task title');
      return;
    }

    setIsLoading(true);
    try {
      await onAddSubTask(parentIssue.id, {
        title: newSubTaskTitle.trim(),
        status: 'To Do',
        completed: false,
      });
      setNewSubTaskTitle('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add sub-task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSubTask = (subTaskId, completed) => {
    onToggleSubTask(parentIssue.id, subTaskId, completed);
  };

  const handleDeleteSubTask = (subTaskId) => {
    Alert.alert(
      'Delete Sub-task',
      'Are you sure you want to delete this sub-task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteSubTask(parentIssue.id, subTaskId)
        },
      ]
    );
  };

  const renderSubTask = ({ item }) => (
    <View style={[styles.subTaskItem, { backgroundColor: colors.white }]}>
      <TouchableOpacity
        style={styles.subTaskContent}
        onPress={() => handleToggleSubTask(item.id, !item.completed)}
      >
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
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSubTask(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const completedCount = subTasks.filter(task => task.completed).length;
  const totalCount = subTasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
            Sub-tasks
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Parent Issue Info */}
          <View style={[styles.parentIssueCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.parentIssueTitle, { color: colors.text }]}>
              {parentIssue?.title}
            </Text>
            <Text style={[styles.parentIssueKey, { color: colors.textSecondary }]}>
              {parentIssue?.key}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Progress
              </Text>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {completedCount} of {totalCount} completed
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.coral 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>
              {progressPercentage}%
            </Text>
          </View>

          {/* Add New Sub-task */}
          <View style={styles.addSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Add Sub-task
            </Text>
            <View style={styles.addInputContainer}>
              <TextInput
                style={[
                  styles.addInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={newSubTaskTitle}
                onChangeText={setNewSubTaskTitle}
                placeholder="Enter sub-task title"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  {
                    backgroundColor: isLoading ? colors.textSecondary : colors.coral,
                  },
                ]}
                onPress={handleAddSubTask}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="add" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub-tasks List */}
          <View style={styles.listSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Sub-tasks ({subTasks.length})
            </Text>
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
                renderItem={renderSubTask}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  parentIssueCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  parentIssueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  parentIssueKey: {
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
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
  percentageText: {
    fontSize: 12,
    textAlign: 'right',
  },
  addSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listSection: {
    flex: 1,
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
    fontSize: 16,
    marginBottom: 2,
  },
  subTaskStatus: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
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