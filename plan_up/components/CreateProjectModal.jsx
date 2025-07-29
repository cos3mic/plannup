import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { useTheme } from '../hooks/useTheme';

const projectTemplates = [
  {
    id: 'software',
    name: 'Software Development',
    description: 'Agile software development project',
    icon: 'code',
    color: '#FF6B6B',
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Digital marketing and campaign management',
    icon: 'megaphone',
    color: '#4ECDC4',
  },
  {
    id: 'design',
    name: 'Design Project',
    description: 'UI/UX design and creative projects',
    icon: 'brush',
    color: '#45B7D1',
  },
  {
    id: 'research',
    name: 'Research & Analysis',
    description: 'Data analysis and research projects',
    icon: 'analytics',
    color: '#96CEB4',
  },
  {
    id: 'custom',
    name: 'Custom Project',
    description: 'Create your own project structure',
    icon: 'settings',
    color: '#FFA726',
  },
];

const projectLeads = [
  { id: '1', name: 'Franklin George', email: 'franklin@company.com', avatar: 'FG' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', avatar: 'JS' },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', avatar: 'MJ' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com', avatar: 'SW' },
  { id: '5', name: 'David Brown', email: 'david@company.com', avatar: 'DB' },
  { id: '6', name: 'Robert Chen', email: 'robert@company.com', avatar: 'RC' },
  { id: '7', name: 'Emily Davis', email: 'emily@company.com', avatar: 'ED' },
  { id: '8', name: 'Michael Wong', email: 'michael@company.com', avatar: 'MW' },
  { id: '9', name: 'Lisa Garcia', email: 'lisa@company.com', avatar: 'LG' },
];

export default function CreateProjectModal({ visible, onClose, onProjectCreated }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const generateProjectKey = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
  };

  const handleProjectNameChange = (name) => {
    setProjectName(name);
    if (!projectKey) {
      setProjectKey(generateProjectKey(name));
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    if (!projectKey.trim()) {
      Alert.alert('Error', 'Please enter a project key');
      return;
    }

    if (!selectedLead) {
      Alert.alert('Error', 'Please select a project lead');
      return;
    }

    setIsLoading(true);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new project object
      const newProject = {
        id: Date.now().toString(), // Generate unique ID
        name: projectName.trim(),
        key: projectKey.trim(),
        progress: 0,
        issues: 0,
        color: selectedTemplate?.color || '#FF6B6B',
        description: description.trim(),
        lead: selectedLead,
        template: selectedTemplate,
      };
      
      // Call the callback to update the project list
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
      
      Alert.alert(
        'Success',
        `Project "${projectName}" created successfully!`,
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setProjectName('');
    setProjectKey('');
    setDescription('');
    setSelectedTemplate(null);
    setSelectedLead(null);
    setCurrentStep(1);
    onClose();
  };

  const renderTemplateCard = (template) => (
    <TouchableOpacity
      key={template.id}
      style={[
        styles.templateCard,
        {
          backgroundColor: selectedTemplate?.id === template.id ? colors.coral : colors.white,
          borderColor: selectedTemplate?.id === template.id ? colors.coral : colors.border,
        },
      ]}
      onPress={() => setSelectedTemplate(template)}
    >
      <View style={[styles.templateIcon, { backgroundColor: template.color }]}>
        <Ionicons name={template.icon} size={24} color="#fff" />
      </View>
      <View style={styles.templateInfo}>
        <Text
          style={[
            styles.templateName,
            { color: selectedTemplate?.id === template.id ? '#fff' : colors.text },
          ]}
        >
          {template.name}
        </Text>
        <Text
          style={[
            styles.templateDescription,
            { color: selectedTemplate?.id === template.id ? '#fff' : colors.textSecondary },
          ]}
        >
          {template.description}
        </Text>
      </View>
      {selectedTemplate?.id === template.id && (
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );

  const renderLeadCard = (lead) => (
    <TouchableOpacity
      key={lead.id}
      style={[
        styles.leadCard,
        {
          backgroundColor: selectedLead?.id === lead.id ? colors.coral : colors.white,
          borderColor: selectedLead?.id === lead.id ? colors.coral : colors.border,
        },
      ]}
      onPress={() => setSelectedLead(lead)}
    >
      <View style={[styles.leadAvatar, { backgroundColor: colors.blue }]}>
        <Text style={styles.leadAvatarText}>{lead.avatar}</Text>
      </View>
      <View style={styles.leadInfo}>
        <Text
          style={[
            styles.leadName,
            { color: selectedLead?.id === lead.id ? '#fff' : colors.text },
          ]}
        >
          {lead.name}
        </Text>
        <Text
          style={[
            styles.leadEmail,
            { color: selectedLead?.id === lead.id ? '#fff' : colors.textSecondary },
          ]}
        >
          {lead.email}
        </Text>
      </View>
      {selectedLead?.id === lead.id && (
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      )}
    </TouchableOpacity>
  );

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
            Create New Project
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Project Details
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Project Name *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.white, borderColor: colors.border, color: colors.text },
                  ]}
                  value={projectName}
                  onChangeText={handleProjectNameChange}
                  placeholder="Enter project name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Project Key *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.white, borderColor: colors.border, color: colors.text },
                  ]}
                  value={projectKey}
                  onChangeText={setProjectKey}
                  placeholder="Enter project key (e.g., MAD)"
                  placeholderTextColor={colors.textSecondary}
                  maxLength={10}
                />
                <Text style={[styles.inputHint, { color: colors.textSecondary }]}>
                  Used for issue keys (e.g., MAD-123)
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Description
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    { backgroundColor: colors.white, borderColor: colors.border, color: colors.text },
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter project description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.coral }]}
                onPress={() => setCurrentStep(2)}
              >
                <Text style={styles.nextButtonText}>Next: Choose Template</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Project Template */}
          {currentStep === 2 && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Choose Project Template
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Select a template to get started quickly with predefined workflows
              </Text>

              {projectTemplates.map(renderTemplateCard)}

              <View style={styles.stepButtons}>
                <TouchableOpacity
                  style={[styles.backButton, { borderColor: colors.border }]}
                  onPress={() => setCurrentStep(1)}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.text} />
                  <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: colors.coral }]}
                  onPress={() => setCurrentStep(3)}
                >
                  <Text style={styles.nextButtonText}>Next: Assign Lead</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 3: Project Lead */}
          {currentStep === 3 && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Assign Project Lead
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Choose who will be responsible for this project
              </Text>

              {projectLeads.map(renderLeadCard)}

              <View style={styles.stepButtons}>
                <TouchableOpacity
                  style={[styles.backButton, { borderColor: colors.border }]}
                  onPress={() => setCurrentStep(2)}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.text} />
                  <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.createButton,
                    { backgroundColor: isLoading ? colors.textSecondary : colors.coral },
                  ]}
                  onPress={handleCreateProject}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.createButtonText}>Create Project</Text>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputHint: {
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
  },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  leadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leadAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  leadEmail: {
    fontSize: 14,
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
}); 