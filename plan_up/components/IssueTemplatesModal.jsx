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

const defaultTemplates = [
  {
    id: 'bug-template',
    name: 'Bug Report',
    description: 'Standard template for reporting bugs',
    icon: 'bug',
    color: '#FF6B6B',
    fields: {
      title: 'Bug: [Brief description]',
      description: `## Bug Description
[Describe the bug in detail]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., iOS 15.0]
- App Version: [e.g., 1.2.3]
- Device: [e.g., iPhone 13]

## Additional Information
[Screenshots, logs, etc.]`,
      type: 'Bug',
      priority: 'High',
      labels: ['bug', 'needs-investigation'],
    },
  },
  {
    id: 'feature-template',
    name: 'Feature Request',
    description: 'Template for requesting new features',
    icon: 'star',
    color: '#4ECDC4',
    fields: {
      title: 'Feature: [Feature name]',
      description: `## Feature Overview
[Brief description of the feature]

## Problem Statement
[What problem does this feature solve?]

## Proposed Solution
[How should this feature work?]

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Technical Considerations
[Any technical notes or requirements]

## Priority
[High/Medium/Low]`,
      type: 'Story',
      priority: 'Medium',
      labels: ['feature', 'enhancement'],
    },
  },
  {
    id: 'task-template',
    name: 'Task',
    description: 'Simple task template',
    icon: 'checkbox',
    color: '#45B7D1',
    fields: {
      title: 'Task: [Task description]',
      description: `## Task Description
[Detailed description of the task]

## Requirements
- [ ] [Requirement 1]
- [ ] [Requirement 2]

## Notes
[Any additional notes]`,
      type: 'Task',
      priority: 'Medium',
      labels: ['task'],
    },
  },
  {
    id: 'research-template',
    name: 'Research Task',
    description: 'Template for research and investigation tasks',
    icon: 'search',
    color: '#9C27B0',
    fields: {
      title: 'Research: [Topic]',
      description: `## Research Topic
[What needs to be researched?]

## Research Questions
1. [Question 1]
2. [Question 2]
3. [Question 3]

## Scope
[What should be included/excluded?]

## Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

## Timeline
[Estimated time needed]`,
      type: 'Task',
      priority: 'Low',
      labels: ['research', 'investigation'],
    },
  },
];

export default function IssueTemplatesModal({ 
  visible, 
  onClose, 
  onUseTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  customTemplates = []
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [activeTab, setActiveTab] = useState('default');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Create template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    icon: 'document',
    color: '#4CAF50',
    fields: {
      title: '',
      description: '',
      type: 'Task',
      priority: 'Medium',
      labels: '',
    },
  });

  const tabs = [
    { key: 'default', label: 'Default', icon: 'library' },
    { key: 'custom', label: 'Custom', icon: 'create' },
  ];

  const allTemplates = activeTab === 'default' ? defaultTemplates : customTemplates;

  const handleUseTemplate = async (template) => {
    setIsLoading(true);
    try {
      await onUseTemplate(template);
      Alert.alert('Success', 'Template applied successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to apply template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.fields.title.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const templateToSave = {
        ...newTemplate,
        id: Date.now().toString(),
        fields: {
          ...newTemplate.fields,
          labels: newTemplate.fields.labels.split(',').map(label => label.trim()).filter(Boolean),
        },
      };
      
      await onSaveTemplate(templateToSave);
      setShowCreateForm(false);
      setNewTemplate({
        name: '',
        description: '',
        icon: 'document',
        color: '#4CAF50',
        fields: {
          title: '',
          description: '',
          type: 'Task',
          priority: 'Medium',
          labels: '',
        },
      });
      Alert.alert('Success', 'Template saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = (template) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteTemplate(template.id)
        },
      ]
    );
  };

  const renderTemplate = ({ item }) => (
    <TouchableOpacity
      style={[styles.templateCard, { backgroundColor: colors.white }]}
      onPress={() => {
        setSelectedTemplate(item);
        setShowTemplateDetails(true);
      }}
    >
      <View style={styles.templateHeader}>
        <View style={[styles.templateIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={20} color="#fff" />
        </View>
        <View style={styles.templateInfo}>
          <Text style={[styles.templateName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.templateDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.templateActions}>
          <TouchableOpacity
            style={[styles.useButton, { backgroundColor: colors.coral }]}
            onPress={() => handleUseTemplate(item)}
          >
            <Text style={styles.useButtonText}>Use</Text>
          </TouchableOpacity>
          {activeTab === 'custom' && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteTemplate(item)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTemplateDetails = () => {
    if (!selectedTemplate) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowTemplateDetails(false)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.detailsTitle, { color: colors.text }]}>
            Template Details
          </Text>
        </View>

        <ScrollView style={styles.detailsContent}>
          {/* Template Info */}
          <View style={[styles.detailCard, { backgroundColor: colors.white }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailIcon, { backgroundColor: selectedTemplate.color }]}>
                <Ionicons name={selectedTemplate.icon} size={24} color="#fff" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={[styles.detailName, { color: colors.text }]}>
                  {selectedTemplate.name}
                </Text>
                <Text style={[styles.detailDescription, { color: colors.textSecondary }]}>
                  {selectedTemplate.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Template Fields */}
          <View style={styles.fieldsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Template Fields
            </Text>
            
            <View style={[styles.fieldCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Title Template
              </Text>
              <Text style={[styles.fieldValue, { color: colors.text }]}>
                {selectedTemplate.fields.title}
              </Text>
            </View>

            <View style={[styles.fieldCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Description Template
              </Text>
              <Text style={[styles.fieldValue, { color: colors.text }]} numberOfLines={10}>
                {selectedTemplate.fields.description}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldCard, { backgroundColor: colors.white, flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Type
                </Text>
                <Text style={[styles.fieldValue, { color: colors.text }]}>
                  {selectedTemplate.fields.type}
                </Text>
              </View>
              
              <View style={[styles.fieldCard, { backgroundColor: colors.white, flex: 1 }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Priority
                </Text>
                <Text style={[styles.fieldValue, { color: colors.text }]}>
                  {selectedTemplate.fields.priority}
                </Text>
              </View>
            </View>

            {selectedTemplate.fields.labels && selectedTemplate.fields.labels.length > 0 && (
              <View style={[styles.fieldCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Labels
                </Text>
                <View style={styles.labelsContainer}>
                  {selectedTemplate.fields.labels.map((label, index) => (
                    <View key={index} style={[styles.labelBadge, { backgroundColor: colors.coral + '20' }]}>
                      <Text style={[styles.labelText, { color: colors.coral }]}>
                        {label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Use Template Button */}
          <TouchableOpacity
            style={[styles.useTemplateButton, { backgroundColor: colors.coral }]}
            onPress={() => handleUseTemplate(selectedTemplate)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.useTemplateButtonText}>
                Use This Template
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderCreateForm = () => (
    <View style={styles.createContainer}>
      <View style={styles.createHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowCreateForm(false)}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.createTitle, { color: colors.text }]}>
          Create Template
        </Text>
      </View>

      <ScrollView style={styles.createContent}>
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Template Information
          </Text>
          
          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Template Name
            </Text>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={newTemplate.name}
              onChangeText={(text) => setNewTemplate({ ...newTemplate, name: text })}
              placeholder="Enter template name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Description
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={newTemplate.description}
              onChangeText={(text) => setNewTemplate({ ...newTemplate, description: text })}
              placeholder="Describe this template"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Default Fields
          </Text>
          
          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Title Template
            </Text>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={newTemplate.fields.title}
              onChangeText={(text) => setNewTemplate({
                ...newTemplate,
                fields: { ...newTemplate.fields, title: text }
              })}
              placeholder="e.g., Bug: [Brief description]"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Description Template
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={newTemplate.fields.description}
              onChangeText={(text) => setNewTemplate({
                ...newTemplate,
                fields: { ...newTemplate.fields, description: text }
              })}
              placeholder="Enter description template with placeholders"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={8}
            />
          </View>

          <View style={styles.fieldRow}>
            <View style={[styles.inputCard, { backgroundColor: colors.white, flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Type
              </Text>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={newTemplate.fields.type}
                onChangeText={(text) => setNewTemplate({
                  ...newTemplate,
                  fields: { ...newTemplate.fields, type: text }
                })}
                placeholder="Task"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={[styles.inputCard, { backgroundColor: colors.white, flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Priority
              </Text>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={newTemplate.fields.priority}
                onChangeText={(text) => setNewTemplate({
                  ...newTemplate,
                  fields: { ...newTemplate.fields, priority: text }
                })}
                placeholder="Medium"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Labels (comma-separated)
            </Text>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={newTemplate.fields.labels}
              onChangeText={(text) => setNewTemplate({
                ...newTemplate,
                fields: { ...newTemplate.fields, labels: text }
              })}
              placeholder="template, custom"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.coral }]}
          onPress={handleSaveTemplate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Template
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (showTemplateDetails) {
    return renderTemplateDetails();
  }

  if (showCreateForm) {
    return renderCreateForm();
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
            Issue Templates
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
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
          
          {activeTab === 'custom' && (
            <TouchableOpacity
              style={[styles.createTabButton, { backgroundColor: colors.blue }]}
              onPress={() => setShowCreateForm(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.createTabButtonText}>Create</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content}>
          {allTemplates.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
              <Ionicons name="document-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No templates available
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {activeTab === 'default' 
                  ? 'Default templates will appear here'
                  : 'Create your first custom template'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={allTemplates}
              renderItem={renderTemplate}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
  createTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  createTabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  templateDescription: {
    fontSize: 14,
  },
  templateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  useButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  useButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  deleteButton: {
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
  detailsContainer: {
    flex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailsContent: {
    flex: 1,
    padding: 20,
  },
  detailCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 14,
  },
  fieldsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  fieldCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  labelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  useTemplateButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  useTemplateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  createContainer: {
    flex: 1,
  },
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  createTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  inputCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  textInput: {
    fontSize: 16,
  },
  textArea: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 