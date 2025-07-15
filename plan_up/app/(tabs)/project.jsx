import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import CreateProjectModal from '../../components/CreateProjectModal';
import BacklogModal from '../../components/BacklogModal';
import { useSprints } from '../../hooks/useSprints';
import { useIssues } from '../../hooks/useIssues';
import { Colors } from '../../constants/Colors.jsx';

const initialProjectData = [
  {
    id: '1',
    name: 'Mobile App Development',
    key: 'MAD',
    progress: 75,
    issues: 24,
    color: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Website Redesign',
    key: 'WRD',
    progress: 45,
    issues: 18,
    color: '#4ECDC4',
  },
  {
    id: '3',
    name: 'API Integration',
    key: 'API',
    progress: 90,
    issues: 12,
    color: '#45B7D1',
  },
  {
    id: '4',
    name: 'Database Migration',
    key: 'DBM',
    progress: 30,
    issues: 8,
    color: '#96CEB4',
  },
];

export default function ProjectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isCreateProjectModalVisible, setIsCreateProjectModalVisible] = useState(false);
  const [isBacklogModalVisible, setIsBacklogModalVisible] = useState(false);
  const [projects, setProjects] = useState(initialProjectData);
  
  const { sprints, addIssueToSprint } = useSprints();
  const { issues, updateIssue } = useIssues();

  const handleProjectCreated = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const renderProjectCard = ({ item }) => (
    <TouchableOpacity style={[styles.projectCard, { backgroundColor: colors.white }]}>
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
}); 