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

const defaultComponents = [
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'User interface and client-side functionality',
    icon: 'phone-portrait',
    color: '#4ECDC4',
    lead: 'John Doe',
    issueCount: 12,
  },
  {
    id: 'backend',
    name: 'Backend',
    description: 'Server-side logic and API development',
    icon: 'server',
    color: '#FF6B6B',
    lead: 'Jane Smith',
    issueCount: 8,
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Data storage and management',
    icon: 'library',
    color: '#45B7D1',
    lead: 'Mike Johnson',
    issueCount: 5,
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'Mobile application development',
    icon: 'phone-portrait',
    color: '#9C27B0',
    lead: 'Sarah Wilson',
    issueCount: 15,
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Quality assurance and testing',
    icon: 'bug',
    color: '#FF9800',
    lead: 'Alex Brown',
    issueCount: 6,
  },
];

export default function ProjectComponentsModal({ 
  visible, 
  onClose, 
  onSaveComponent,
  onDeleteComponent,
  onAssignLead,
  projectMembers = [],
  customComponents = []
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [activeTab, setActiveTab] = useState('components');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showComponentDetails, setShowComponentDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create component form state
  const [newComponent, setNewComponent] = useState({
    name: '',
    description: '',
    icon: 'cube',
    color: '#4CAF50',
    lead: '',
  });

  const tabs = [
    { key: 'components', label: 'Components', icon: 'cube' },
    { key: 'assignments', label: 'Assignments', icon: 'people' },
  ];

  const allComponents = [...defaultComponents, ...customComponents];

  const handleSaveComponent = async () => {
    if (!newComponent.name.trim()) {
      Alert.alert('Error', 'Please enter a component name');
      return;
    }

    setIsLoading(true);
    try {
      const componentToSave = {
        ...newComponent,
        id: Date.now().toString(),
        issueCount: 0,
      };
      
      await onSaveComponent(componentToSave);
      setShowCreateForm(false);
      setNewComponent({
        name: '',
        description: '',
        icon: 'cube',
        color: '#4CAF50',
        lead: '',
      });
      Alert.alert('Success', 'Component saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save component');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComponent = (component) => {
    if (defaultComponents.find(c => c.id === component.id)) {
      Alert.alert('Error', 'Cannot delete default components');
      return;
    }

    Alert.alert(
      'Delete Component',
      `Are you sure you want to delete "${component.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteComponent(component.id)
        },
      ]
    );
  };

  const handleAssignLead = async (componentId, leadId) => {
    setIsLoading(true);
    try {
      await onAssignLead(componentId, leadId);
      Alert.alert('Success', 'Lead assigned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to assign lead');
    } finally {
      setIsLoading(false);
    }
  };

  const renderComponent = ({ item }) => (
    <TouchableOpacity
      style={[styles.componentCard, { backgroundColor: colors.white }]}
      onPress={() => {
        setSelectedComponent(item);
        setShowComponentDetails(true);
      }}
    >
      <View style={styles.componentHeader}>
        <View style={[styles.componentIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={20} color="#fff" />
        </View>
        <View style={styles.componentInfo}>
          <Text style={[styles.componentName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.componentDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <View style={styles.componentMeta}>
            <Text style={[styles.componentLead, { color: colors.textSecondary }]}>
              Lead: {item.lead}
            </Text>
            <Text style={[styles.componentIssues, { color: colors.coral }]}>
              {item.issueCount} issues
            </Text>
          </View>
        </View>
        <View style={styles.componentActions}>
          {!defaultComponents.find(c => c.id === item.id) && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteComponent(item)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderComponentDetails = () => {
    if (!selectedComponent) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowComponentDetails(false)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.detailsTitle, { color: colors.text }]}>
            Component Details
          </Text>
        </View>

        <ScrollView style={styles.detailsContent}>
          {/* Component Info */}
          <View style={[styles.detailCard, { backgroundColor: colors.white }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailIcon, { backgroundColor: selectedComponent.color }]}>
                <Ionicons name={selectedComponent.icon} size={24} color="#fff" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={[styles.detailName, { color: colors.text }]}>
                  {selectedComponent.name}
                </Text>
                <Text style={[styles.detailDescription, { color: colors.textSecondary }]}>
                  {selectedComponent.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Component Stats */}
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Component Statistics
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.statValue, { color: colors.coral }]}>
                  {selectedComponent.issueCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Issues
                </Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: colors.white }]}>
                <Text style={[styles.statValue, { color: colors.blue }]}>
                  {selectedComponent.lead}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Component Lead
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Issues */}
          <View style={styles.issuesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Issues
            </Text>
            
            <View style={[styles.emptyIssues, { backgroundColor: colors.white }]}>
              <Ionicons name="document-outline" size={32} color={colors.textSecondary} />
              <Text style={[styles.emptyIssuesText, { color: colors.textSecondary }]}>
                No recent issues
              </Text>
              <Text style={[styles.emptyIssuesSubtext, { color: colors.textSecondary }]}>
                Issues assigned to this component will appear here
              </Text>
            </View>
          </View>

          {/* Assign Lead */}
          <View style={styles.assignSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Assign Lead
            </Text>
            
            <TouchableOpacity
              style={[styles.assignLeadButton, { backgroundColor: colors.coral }]}
              onPress={() => {
                Alert.alert(
                  'Assign Lead',
                  'Select a team member to lead this component:',
                  projectMembers.map(member => ({
                    text: member.name,
                    onPress: () => handleAssignLead(selectedComponent.id, member.id)
                  }))
                );
              }}
            >
              <Text style={styles.assignLeadButtonText}>
                Change Lead
              </Text>
            </TouchableOpacity>
          </View>
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
          Create Component
        </Text>
      </View>

      <ScrollView style={styles.createContent}>
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Component Information
          </Text>
          
          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Component Name
            </Text>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={newComponent.name}
              onChangeText={(text) => setNewComponent({ ...newComponent, name: text })}
              placeholder="Enter component name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Description
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={newComponent.description}
              onChangeText={(text) => setNewComponent({ ...newComponent, description: text })}
              placeholder="Describe this component"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Component Lead
            </Text>
            <TouchableOpacity
              style={[styles.leadSelector, { backgroundColor: colors.white, borderColor: colors.border }]}
              onPress={() => {
                Alert.alert(
                  'Select Lead',
                  'Choose a team member to lead this component:',
                  projectMembers.map(member => ({
                    text: member.name,
                    onPress: () => setNewComponent({ ...newComponent, lead: member.name })
                  }))
                );
              }}
            >
              <Text style={[styles.leadSelectorText, { color: newComponent.lead ? colors.text : colors.textSecondary }]}>
                {newComponent.lead || 'Select a team member'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.coral }]}
          onPress={handleSaveComponent}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Component
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (showComponentDetails) {
    return renderComponentDetails();
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
            Project Components
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
          
          {activeTab === 'components' && (
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
          {activeTab === 'components' ? (
            <FlatList
              data={allComponents}
              renderItem={renderComponent}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.assignmentsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Component Assignments
              </Text>
              <Text style={[styles.assignmentsDescription, { color: colors.textSecondary }]}>
                Manage which components team members are assigned to
              </Text>
              
              <View style={[styles.emptyAssignments, { backgroundColor: colors.white }]}>
                <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyAssignmentsText, { color: colors.textSecondary }]}>
                  No assignments yet
                </Text>
                <Text style={[styles.emptyAssignmentsSubtext, { color: colors.textSecondary }]}>
                  Assign team members to components to organize work
                </Text>
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
  componentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  componentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  componentDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  componentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentLead: {
    fontSize: 12,
  },
  componentIssues: {
    fontSize: 12,
    fontWeight: '500',
  },
  componentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
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
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  issuesSection: {
    marginBottom: 20,
  },
  emptyIssues: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  emptyIssuesText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  emptyIssuesSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  assignSection: {
    marginBottom: 20,
  },
  assignLeadButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignLeadButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
  leadSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  leadSelectorText: {
    fontSize: 16,
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
  assignmentsSection: {
    flex: 1,
  },
  assignmentsDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  emptyAssignments: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  emptyAssignmentsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyAssignmentsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 