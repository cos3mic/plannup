import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View, Modal, ScrollView, TextInput } from 'react-native';
import CreateProjectModal from '../../components/CreateProjectModal';
import BacklogModal from '../../components/BacklogModal';
import { useSprints } from '../../hooks/useSprints';
import { useIssues } from '../../hooks/useIssues';
import { Colors } from '../../constants/Colors.jsx';
import { useOrganizationCustom } from '../../components/OrganizationContext';
import { useUser } from '@clerk/clerk-expo';

const initialProjectData = [
  {
    id: '1',
    name: 'Mobile App Development',
    key: 'MAD',
    progress: 75,
    issues: 24,
    color: '#FF6B6B',
    decisionLog: [], // Add decisionLog
  },
  {
    id: '2',
    name: 'Website Redesign',
    key: 'WRD',
    progress: 45,
    issues: 18,
    color: '#4ECDC4',
    decisionLog: [],
  },
  {
    id: '3',
    name: 'API Integration',
    key: 'API',
    progress: 90,
    issues: 12,
    color: '#45B7D1',
    decisionLog: [],
  },
  {
    id: '4',
    name: 'Database Migration',
    key: 'DBM',
    progress: 30,
    issues: 8,
    color: '#96CEB4',
    decisionLog: [],
  },
];

export default function ProjectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isCreateProjectModalVisible, setIsCreateProjectModalVisible] = useState(false);
  const [isBacklogModalVisible, setIsBacklogModalVisible] = useState(false);
  const [projects, setProjects] = useState(initialProjectData);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [decisionLogEntry, setDecisionLogEntry] = useState('');
  const [decisionLogError, setDecisionLogError] = useState('');
  
  const { sprints, addIssueToSprint } = useSprints();
  const { issues, updateIssue } = useIssues();
  const { currentOrg } = useOrganizationCustom();
  const isAdmin = true; // fallback: treat all users as admin for now
  const { user } = useUser();
  const userName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'anonymous';

  const handleProjectCreated = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const handleAddDecisionLog = (projectId) => {
    if (!decisionLogEntry.trim()) {
      setDecisionLogError('Please enter a decision/context.');
      return;
    }
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? {
            ...p,
            decisionLog: [
              ...p.decisionLog,
              {
                id: `log-${Date.now()}`,
                author: userName,
                content: decisionLogEntry.trim(),
                createdAt: Date.now(),
              },
            ],
          }
        : p
    ));
    setDecisionLogEntry('');
    setDecisionLogError('');
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  const renderProjectCard = ({ item }) => (
    <TouchableOpacity style={[styles.projectCard, { backgroundColor: colors.white }]} onPress={() => setSelectedProjectId(item.id)}>
      <View style={styles.projectHeader}>
        <View style={[styles.projectAvatar, { backgroundColor: item.color }]}>
          <Text style={styles.projectKey}>{item.key}</Text>
        </View>
        <View style={styles.projectInfo}>
          <Text style={[styles.projectName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.projectKey, { color: colors.text, opacity: 0.6 }]}>
            {item.key}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      </View>
      
      <View style={styles.projectStats}>
        <View style={styles.statItem}>
          <Ionicons name="list" size={16} color={colors.coral} />
          <Text style={[styles.statText, { color: colors.text }]}>{item.issues} issues</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${item.progress}%`,
                  backgroundColor: colors.coral 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text }]}>{item.progress}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Projects</Text>
        {isAdmin && (
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.headerButton, { borderColor: colors.coral }]}
              onPress={() => setIsBacklogModalVisible(true)}
            >
              <Ionicons name="list" size={20} color={colors.coral} />
              <Text style={[styles.headerButtonText, { color: colors.coral }]}>Backlog</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.coral }]}
              onPress={() => setIsCreateProjectModalVisible(true)}
            >
              <Ionicons name="add" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={projects}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <CreateProjectModal 
        visible={isCreateProjectModalVisible}
        onClose={() => setIsCreateProjectModalVisible(false)}
        onProjectCreated={handleProjectCreated}
      />

      <BacklogModal
        visible={isBacklogModalVisible}
        issues={issues}
        sprints={sprints}
        onClose={() => setIsBacklogModalVisible(false)}
        onUpdateIssue={updateIssue}
        onAddToSprint={addIssueToSprint}
      />

      {/* Project Details Modal */}
      <Modal visible={!!selectedProject} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}> 
            <ScrollView>
              {selectedProject ? (
                <>
                  <Text style={styles.modalTitle}>{selectedProject.name}</Text>
                  <Text style={styles.ideaDesc}>Key: {selectedProject.key}</Text>
                  <Text style={styles.ideaStatus}>Progress: {selectedProject.progress}%</Text>
                  <Text style={styles.sectionTitle}>Context & Decision Log</Text>
                  {selectedProject.decisionLog.length ? (
                    selectedProject.decisionLog.map(entry => (
                      <View key={entry.id} style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>{entry.author}:</Text>
                        <Text>{entry.content}</Text>
                        <Text style={{ fontSize: 12, color: '#888' }}>{new Date(entry.createdAt).toLocaleString()}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ color: '#aaa', fontStyle: 'italic', marginBottom: 8 }}>No context or decisions yet.</Text>
                  )}
                  <TextInput
                    placeholder="Add context, rationale, or decision..."
                    value={decisionLogEntry}
                    onChangeText={setDecisionLogEntry}
                    style={styles.input}
                  />
                  {decisionLogError ? <Text style={{ color: 'red' }}>{decisionLogError}</Text> : null}
                  <TouchableOpacity onPress={() => handleAddDecisionLog(selectedProject.id)} style={styles.submitBtn}>
                    <Text style={styles.submitText}>Add Entry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedProjectId(null)} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingTop: 40,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  projectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectKey: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  ideaDesc: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  ideaStatus: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 