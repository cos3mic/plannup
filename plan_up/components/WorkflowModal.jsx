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

const defaultWorkflows = [
  {
    id: 'agile',
    name: 'Agile Workflow',
    description: 'Standard agile workflow with To Do → In Progress → Done',
    statuses: ['To Do', 'In Progress', 'Done'],
    transitions: [
      { from: 'To Do', to: 'In Progress', label: 'Start Work' },
      { from: 'In Progress', to: 'Done', label: 'Complete' },
      { from: 'In Progress', to: 'To Do', label: 'Reopen' },
      { from: 'Done', to: 'In Progress', label: 'Reopen' },
    ],
    color: '#4CAF50',
  },
  {
    id: 'bug',
    name: 'Bug Workflow',
    description: 'Bug tracking workflow with additional statuses',
    statuses: ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'],
    transitions: [
      { from: 'Open', to: 'In Progress', label: 'Start Fix' },
      { from: 'In Progress', to: 'In Review', label: 'Ready for Review' },
      { from: 'In Review', to: 'Resolved', label: 'Approve Fix' },
      { from: 'In Review', to: 'In Progress', label: 'Needs Changes' },
      { from: 'Resolved', to: 'Closed', label: 'Close Bug' },
      { from: 'Resolved', to: 'In Progress', label: 'Reopen' },
    ],
    color: '#FF6B6B',
  },
  {
    id: 'feature',
    name: 'Feature Workflow',
    description: 'Feature development workflow with planning stages',
    statuses: ['Backlog', 'Planning', 'In Development', 'Testing', 'Ready for Release', 'Released'],
    transitions: [
      { from: 'Backlog', to: 'Planning', label: 'Start Planning' },
      { from: 'Planning', to: 'In Development', label: 'Start Development' },
      { from: 'In Development', to: 'Testing', label: 'Ready for Testing' },
      { from: 'Testing', to: 'Ready for Release', label: 'Testing Complete' },
      { from: 'Testing', to: 'In Development', label: 'Needs Changes' },
      { from: 'Ready for Release', to: 'Released', label: 'Release' },
    ],
    color: '#2196F3',
  },
];

export default function WorkflowModal({ 
  visible, 
  currentWorkflow = defaultWorkflows[0],
  onClose, 
  onSaveWorkflow,
  onDeleteWorkflow,
  onSelectWorkflow
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [workflows, setWorkflows] = useState(defaultWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState(currentWorkflow);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    if (onSelectWorkflow) {
      onSelectWorkflow(workflow);
    }
  };

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow({ ...workflow });
    setIsEditing(true);
  };

  const handleSaveWorkflow = async () => {
    if (!editingWorkflow.name.trim()) {
      Alert.alert('Error', 'Please enter a workflow name');
      return;
    }

    if (editingWorkflow.statuses.length < 2) {
      Alert.alert('Error', 'Workflow must have at least 2 statuses');
      return;
    }

    setIsLoading(true);
    try {
      const updatedWorkflows = workflows.map(w => 
        w.id === editingWorkflow.id ? editingWorkflow : w
      );
      setWorkflows(updatedWorkflows);
      setSelectedWorkflow(editingWorkflow);
      setIsEditing(false);
      setEditingWorkflow(null);
      
      if (onSaveWorkflow) {
        await onSaveWorkflow(editingWorkflow);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkflow = (workflow) => {
    Alert.alert(
      'Delete Workflow',
      `Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedWorkflows = workflows.filter(w => w.id !== workflow.id);
            setWorkflows(updatedWorkflows);
            if (selectedWorkflow.id === workflow.id) {
              setSelectedWorkflow(updatedWorkflows[0]);
            }
          }
        },
      ]
    );
  };

  const renderWorkflowCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.workflowCard,
        {
          backgroundColor: selectedWorkflow.id === item.id ? item.color + '20' : colors.white,
          borderColor: selectedWorkflow.id === item.id ? item.color : colors.border,
        },
      ]}
      onPress={() => handleSelectWorkflow(item)}
    >
      <View style={styles.workflowHeader}>
        <View style={[styles.workflowIcon, { backgroundColor: item.color }]}>
          <Ionicons name="git-branch" size={20} color="#fff" />
        </View>
        <View style={styles.workflowInfo}>
          <Text style={[styles.workflowName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.workflowDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.workflowActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditWorkflow(item)}
          >
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          {item.id !== 'agile' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteWorkflow(item)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.workflowStatuses}>
        <Text style={[styles.statusesTitle, { color: colors.textSecondary }]}>
          Statuses ({item.statuses.length})
        </Text>
        <View style={styles.statusesList}>
          {item.statuses.map((status, index) => (
            <View key={status} style={styles.statusItem}>
              <Text style={[styles.statusText, { color: colors.text }]}>
                {status}
              </Text>
              {index < item.statuses.length - 1 && (
                <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
              )}
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTransition = ({ item }) => (
    <View style={[styles.transitionItem, { backgroundColor: colors.white }]}>
      <View style={styles.transitionContent}>
        <Text style={[styles.transitionFrom, { color: colors.text }]}>
          {item.from}
        </Text>
        <View style={styles.transitionArrow}>
          <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
        </View>
        <Text style={[styles.transitionTo, { color: colors.text }]}>
          {item.to}
        </Text>
      </View>
      <Text style={[styles.transitionLabel, { color: colors.textSecondary }]}>
        {item.label}
      </Text>
    </View>
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
            Workflows
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Workflow Selection */}
          <View style={styles.workflowSelection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Select Workflow
            </Text>
            <FlatList
              data={workflows}
              renderItem={renderWorkflowCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Selected Workflow Details */}
          {selectedWorkflow && (
            <View style={styles.workflowDetails}>
              <View style={styles.detailsHeader}>
                <Text style={[styles.detailsTitle, { color: colors.text }]}>
                  {selectedWorkflow.name}
                </Text>
                <Text style={[styles.detailsDescription, { color: colors.textSecondary }]}>
                  {selectedWorkflow.description}
                </Text>
              </View>

              {/* Status Flow */}
              <View style={styles.statusFlowSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Status Flow
                </Text>
                <View style={styles.statusFlow}>
                  {selectedWorkflow.statuses.map((status, index) => (
                    <View key={status} style={styles.statusFlowItem}>
                      <View style={[styles.statusBadge, { backgroundColor: selectedWorkflow.color + '20' }]}>
                        <Text style={[styles.statusBadgeText, { color: selectedWorkflow.color }]}>
                          {status}
                        </Text>
                      </View>
                      {index < selectedWorkflow.statuses.length - 1 && (
                        <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Transitions */}
              <View style={styles.transitionsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Transitions ({selectedWorkflow.transitions.length})
                </Text>
                <FlatList
                  data={selectedWorkflow.transitions}
                  renderItem={renderTransition}
                  keyExtractor={(item, index) => `${item.from}-${item.to}-${index}`}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          )}

          {/* Apply Button */}
          <View style={styles.applySection}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.coral }]}
              onPress={() => {
                if (onSelectWorkflow) {
                  onSelectWorkflow(selectedWorkflow);
                }
                onClose();
              }}
            >
              <Text style={styles.applyButtonText}>
                Apply Workflow
              </Text>
            </TouchableOpacity>
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
  workflowSelection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  workflowCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  workflowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workflowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workflowInfo: {
    flex: 1,
  },
  workflowName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  workflowDescription: {
    fontSize: 14,
  },
  workflowActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  workflowStatuses: {
    marginTop: 8,
  },
  statusesTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusesList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  workflowDetails: {
    marginBottom: 24,
  },
  detailsHeader: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsDescription: {
    fontSize: 14,
  },
  statusFlowSection: {
    marginBottom: 20,
  },
  statusFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFlowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transitionsSection: {
    marginBottom: 20,
  },
  transitionItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  transitionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  transitionFrom: {
    fontSize: 14,
    fontWeight: '500',
  },
  transitionArrow: {
    marginHorizontal: 8,
  },
  transitionTo: {
    fontSize: 14,
    fontWeight: '500',
  },
  transitionLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  applySection: {
    marginTop: 20,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 