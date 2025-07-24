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

const bulkOperations = [
  {
    key: 'status',
    label: 'Update Status',
    icon: 'git-branch',
    color: '#4CAF50',
    description: 'Change status for all selected issues',
  },
  {
    key: 'assignee',
    label: 'Assign To',
    icon: 'person',
    color: '#2196F3',
    description: 'Assign all selected issues to a user',
  },
  {
    key: 'priority',
    label: 'Set Priority',
    icon: 'flag',
    color: '#FF9800',
    description: 'Set priority for all selected issues',
  },
  {
    key: 'labels',
    label: 'Add Labels',
    icon: 'pricetag',
    color: '#9C27B0',
    description: 'Add labels to all selected issues',
  },
  {
    key: 'move',
    label: 'Move to Sprint',
    icon: 'calendar',
    color: '#607D8B',
    description: 'Move issues to a different sprint',
  },
  {
    key: 'delete',
    label: 'Delete Issues',
    icon: 'trash',
    color: '#F44336',
    description: 'Permanently delete selected issues',
  },
];

const statusOptions = ['To Do', 'In Progress', 'Done'];
const priorityOptions = ['High', 'Medium', 'Low'];
const assigneeOptions = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Unassigned'];

export default function BulkOperationsModal({ 
  visible, 
  selectedIssues = [], 
  onClose, 
  onBulkUpdate,
  onBulkDelete,
  availableSprints = [],
  availableLabels = [],
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [selectedOperation, setSelectedOperation] = useState('');
  const [operationValue, setOperationValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation.key);
    setOperationValue('');
  };

  const handleBulkOperation = async () => {
    if (!selectedOperation || !operationValue) {
      Alert.alert('Error', 'Please select an operation and provide a value');
      return;
    }

    if (selectedOperation === 'delete') {
      setShowConfirmation(true);
      return;
    }

    setIsLoading(true);
    try {
      await onBulkUpdate(selectedIssues.map(issue => issue.id), {
        operation: selectedOperation,
        value: operationValue,
      });
      
      Alert.alert('Success', `Updated ${selectedIssues.length} issues`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to perform bulk operation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      await onBulkDelete(selectedIssues.map(issue => issue.id));
      Alert.alert('Success', `Deleted ${selectedIssues.length} issues`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete issues');
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  const getOperationInput = () => {
    switch (selectedOperation) {
      case 'status':
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              New Status
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {statusOptions.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: operationValue === status ? colors.coral : colors.white,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setOperationValue(status)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: operationValue === status ? '#fff' : colors.text }
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 'assignee':
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Assign To
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {assigneeOptions.map(assignee => (
                  <TouchableOpacity
                    key={assignee}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: operationValue === assignee ? colors.coral : colors.white,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setOperationValue(assignee)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: operationValue === assignee ? '#fff' : colors.text }
                    ]}>
                      {assignee}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 'priority':
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Priority Level
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {priorityOptions.map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: operationValue === priority ? colors.coral : colors.white,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setOperationValue(priority)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: operationValue === priority ? '#fff' : colors.text }
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 'labels':
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Add Labels
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={operationValue}
              onChangeText={setOperationValue}
              placeholder="Enter labels separated by commas"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        );

      case 'move':
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Move to Sprint
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {availableSprints.map(sprint => (
                  <TouchableOpacity
                    key={sprint.id}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: operationValue === sprint.id ? colors.coral : colors.white,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setOperationValue(sprint.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: operationValue === sprint.id ? '#fff' : colors.text }
                    ]}>
                      {sprint.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  const renderOperation = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.operationCard,
        {
          backgroundColor: selectedOperation === item.key ? item.color + '20' : colors.white,
          borderColor: selectedOperation === item.key ? item.color : colors.border,
        },
      ]}
      onPress={() => handleOperationSelect(item)}
    >
      <View style={styles.operationHeader}>
        <View style={[styles.operationIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={20} color="#fff" />
        </View>
        <View style={styles.operationInfo}>
          <Text style={[styles.operationTitle, { color: colors.text }]}>
            {item.label}
          </Text>
          <Text style={[styles.operationDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSelectedIssue = ({ item }) => (
    <View style={[styles.selectedIssueItem, { backgroundColor: colors.white }]}>
      <View style={styles.selectedIssueContent}>
        <Text style={[styles.selectedIssueKey, { color: colors.text }]}>
          {item.key}
        </Text>
        <Text style={[styles.selectedIssueTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.selectedIssueMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <Text style={[styles.selectedIssueType, { color: colors.textSecondary }]}>
            {item.type}
          </Text>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    const statusColors = {
      'To Do': '#E5E5E5',
      'In Progress': '#FF6B6B',
      'Done': '#4ECDC4',
    };
    return statusColors[status] || '#E5E5E5';
  };

  if (showConfirmation) {
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
              Confirm Deletion
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmationContent}>
            <View style={[styles.warningCard, { backgroundColor: '#FFF3CD', borderColor: '#FFEAA7' }]}>
              <Ionicons name="warning" size={48} color="#856404" />
              <Text style={[styles.warningTitle, { color: '#856404' }]}>
                Delete {selectedIssues.length} Issues?
              </Text>
              <Text style={[styles.warningText, { color: '#856404' }]}>
                This action cannot be undone. All selected issues will be permanently deleted.
              </Text>
            </View>

            <View style={styles.confirmationActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.white, borderColor: colors.border }]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#F44336' }]}
                onPress={handleBulkDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.deleteButtonText}>
                    Delete {selectedIssues.length} Issues
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
            Bulk Operations
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Selected Issues Summary */}
          <View style={styles.summarySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Selected Issues ({selectedIssues.length})
            </Text>
            <FlatList
              data={selectedIssues.slice(0, 5)} // Show first 5
              renderItem={renderSelectedIssue}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            {selectedIssues.length > 5 && (
              <Text style={[styles.moreIssuesText, { color: colors.textSecondary }]}>
                +{selectedIssues.length - 5} more issues
              </Text>
            )}
          </View>

          {/* Operations */}
          <View style={styles.operationsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Choose Operation
            </Text>
            <FlatList
              data={bulkOperations}
              renderItem={renderOperation}
              keyExtractor={(item) => item.key}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Operation Input */}
          {selectedOperation && (
            <View style={styles.inputSection}>
              {getOperationInput()}
            </View>
          )}

          {/* Execute Button */}
          {selectedOperation && operationValue && (
            <View style={styles.executeSection}>
              <TouchableOpacity
                style={[
                  styles.executeButton,
                  {
                    backgroundColor: isLoading ? colors.textSecondary : colors.coral,
                  },
                ]}
                onPress={handleBulkOperation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.executeButtonText}>
                    Apply to {selectedIssues.length} Issues
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
  content: {
    flex: 1,
    padding: 20,
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedIssueItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedIssueContent: {
    flex: 1,
  },
  selectedIssueKey: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedIssueTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  selectedIssueMeta: {
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
  selectedIssueType: {
    fontSize: 12,
  },
  moreIssuesText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  operationsSection: {
    marginBottom: 24,
  },
  operationCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  operationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  operationInfo: {
    flex: 1,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  operationDescription: {
    fontSize: 14,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  executeSection: {
    marginTop: 20,
  },
  executeButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  confirmationContent: {
    flex: 1,
    padding: 20,
  },
  warningCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 