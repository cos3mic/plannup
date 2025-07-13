import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
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

export default function BacklogModal({ 
  visible, 
  issues = [], 
  sprints = [],
  onClose,
  onUpdateIssue,
  onAddToSprint,
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);

  const filters = ['All', 'Bugs', 'Stories', 'Tasks', 'Unassigned'];

  const priorityColors = {
    'High': '#FF6B6B',
    'Medium': '#FFA500',
    'Low': '#4ECDC4',
  };

  const typeColors = {
    'Bug': '#FF6B6B',
    'Story': '#4ECDC4',
    'Task': '#45B7D1',
  };

  const statusColors = {
    'To Do': '#E5E5E5',
    'In Progress': '#FF6B6B',
    'Done': '#4ECDC4',
  };

  const filteredIssues = issues.filter(issue => {
    // Filter by status (only show To Do issues in backlog)
    if (issue.status !== 'To Do') return false;
    
    // Filter by type
    if (selectedFilter !== 'All' && issue.type !== selectedFilter) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.key.toLowerCase().includes(query) ||
        issue.assignee.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleIssueSelection = (issueId) => {
    setSelectedIssues(prev => 
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleAddToSprint = () => {
    if (!selectedSprint) {
      Alert.alert('Error', 'Please select a sprint');
      return;
    }

    if (selectedIssues.length === 0) {
      Alert.alert('Error', 'Please select issues to add to sprint');
      return;
    }

    Alert.alert(
      'Add to Sprint',
      `Add ${selectedIssues.length} issue(s) to ${selectedSprint.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            selectedIssues.forEach(issueId => {
              onAddToSprint(selectedSprint.id, issueId);
            });
            setSelectedIssues([]);
            setSelectedSprint(null);
          }
        },
      ]
    );
  };

  const handleUpdatePriority = (issueId, priority) => {
    onUpdateIssue(issueId, { priority });
  };

  const handleUpdateAssignee = (issueId, assignee) => {
    onUpdateIssue(issueId, { assignee });
  };

  const renderIssueItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.issueItem,
        {
          backgroundColor: selectedIssues.includes(item.id) ? colors.coral + '20' : colors.white,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleIssueSelection(item.id)}
    >
      <View style={styles.issueHeader}>
        <View style={styles.issueInfo}>
          <Text style={[styles.issueKey, { color: colors.text }]}>{item.key}</Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColors[item.type] }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '20' }]}>
          <Text style={[styles.priorityText, { color: priorityColors[item.priority] }]}>
            {item.priority}
          </Text>
        </View>
      </View>

      <Text style={[styles.issueTitle, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.issueFooter}>
        <View style={styles.assigneeInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
            <Text style={styles.avatarText}>
              {item.assignee.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={[styles.assigneeName, { color: colors.text }]}>{item.assignee}</Text>
        </View>

        <View style={styles.issueMeta}>
          <Text style={[styles.storyPoints, { color: colors.coral }]}>
            {item.storyPoints || 0} pts
          </Text>
          <Text style={[styles.issueDate, { color: colors.textSecondary }]}>
            {new Date(item.created).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {selectedIssues.includes(item.id) && (
        <View style={styles.selectionOverlay}>
          <Ionicons name="checkmark-circle" size={20} color={colors.coral} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSprintItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.sprintItem,
        {
          backgroundColor: selectedSprint?.id === item.id ? colors.coral : colors.white,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setSelectedSprint(item)}
    >
      <Text style={[
        styles.sprintName, 
        { color: selectedSprint?.id === item.id ? '#fff' : colors.text }
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.sprintStatus, 
        { color: selectedSprint?.id === item.id ? '#fff' : colors.textSecondary }
      ]}>
        {item.status}
      </Text>
    </TouchableOpacity>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Backlog</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.white,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search issues..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                { 
                  backgroundColor: selectedFilter === filter ? colors.coral : 'transparent',
                  borderColor: selectedFilter === filter ? colors.coral : colors.border
                }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text 
                style={[
                  styles.filterText,
                  { color: selectedFilter === filter ? colors.white : colors.text }
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          {/* Sprint Selection */}
          <View style={styles.sprintSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Add to Sprint</Text>
            <FlatList
              data={sprints.filter(s => s.status === 'planned' || s.status === 'active')}
              renderItem={renderSprintItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sprintList}
            />
          </View>

          {/* Issues List */}
          <View style={styles.issuesSection}>
            <View style={styles.issuesHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Issues ({filteredIssues.length})
              </Text>
              {selectedIssues.length > 0 && (
                <TouchableOpacity
                  style={[styles.addToSprintButton, { backgroundColor: colors.coral }]}
                  onPress={handleAddToSprint}
                >
                  <Text style={styles.addToSprintText}>Add to Sprint</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredIssues}
              renderItem={renderIssueItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.issuesList}
            />
          </View>
        </View>
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
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterContent: {
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sprintSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sprintList: {
    gap: 8,
  },
  sprintItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  sprintName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  sprintStatus: {
    fontSize: 12,
  },
  issuesSection: {
    flex: 1,
    padding: 20,
  },
  issuesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addToSprintButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addToSprintText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  issuesList: {
    gap: 8,
  },
  issueItem: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    position: 'relative',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueKey: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  assigneeName: {
    fontSize: 12,
  },
  issueMeta: {
    alignItems: 'flex-end',
  },
  storyPoints: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  issueDate: {
    fontSize: 10,
  },
  selectionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
}); 