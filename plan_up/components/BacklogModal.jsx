
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
    View,
    SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { useTheme } from '../hooks/useTheme';

export default function BacklogModal({ 
  visible, 
  issues = [], 
  sprints = [],
  onClose,
  onUpdateIssue,
  onAddToSprint,
}) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
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
    'To Do': colorScheme === 'dark' ? '#30363D' : '#E5E5E5',
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
            onClose();
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
          backgroundColor: colors.white,
          borderColor: selectedIssues.includes(item.id) ? colors.blue : colors.border 
        }
      ]}
      onPress={() => handleIssueSelection(item.id)}
    >
      <View style={styles.issueHeader}>
        <View style={styles.issueType}>
          <View style={[styles.typeBadge, { backgroundColor: typeColors[item.type] }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <Text style={[styles.issueKey, { color: colors.text }]}>{item.key}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '20' }]}>
          <Text style={[styles.priorityText, { color: priorityColors[item.priority] }]}>
            {item.priority}
          </Text>
        </View>
      </View>

      <Text style={[styles.issueTitle, { color: colors.text }]}>{item.title}</Text>

      <View style={styles.issueFooter}>
        <View style={styles.assigneeInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
            <Text style={styles.avatarText}>
              {item.assignee.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={[styles.assigneeName, { color: colors.text }]}>{item.assignee}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSprintItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.sprintItem, 
        { 
          backgroundColor: selectedSprint?.id === item.id ? colors.blue : colors.white,
          borderColor: colors.border 
        }
      ]}
      onPress={() => setSelectedSprint(item)}
    >
      <Text style={[styles.sprintName, { color: selectedSprint?.id === item.id ? colors.white : colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.sprintDates, { color: selectedSprint?.id === item.id ? colors.white : colors.textSecondary }]}>
        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Backlog</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Search */}
          <View style={[styles.searchContainer, { backgroundColor: colors.white }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search issues..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedFilter === filter ? colors.blue : colors.white,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  { color: selectedFilter === filter ? colors.white : colors.text }
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Issues List */}
          <View style={styles.issuesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Issues ({filteredIssues.length})
            </Text>
            <FlatList
              data={filteredIssues}
              renderItem={renderIssueItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.issuesList}
            />
          </View>

          {/* Sprint Selection */}
          <View style={styles.sprintSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Add to Sprint</Text>
            <FlatList
              data={sprints.filter(s => s.status === 'planned')}
              renderItem={renderSprintItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sprintList}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.addToSprintButton,
                { 
                  backgroundColor: selectedIssues.length > 0 && selectedSprint ? colors.blue : colors.textSecondary 
                }
              ]}
              onPress={handleAddToSprint}
              disabled={selectedIssues.length === 0 || !selectedSprint}
            >
              <Text style={styles.addToSprintText}>
                Add {selectedIssues.length} Issue{selectedIssues.length !== 1 ? 's' : ''} to Sprint
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    letterSpacing: 0.2,
  },
  closeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sprintSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  sprintList: {
    gap: 12,
  },
  sprintItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 120,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sprintName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  sprintDates: {
    fontSize: 12,
    opacity: 0.7,
  },
  issuesSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 0,
  },
  issuesList: {
    gap: 16,
    paddingBottom: 32,
  },
  issueItem: {
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'relative',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueKey: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    color: '#888',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginLeft: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  issueTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
    color: '#222',
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assigneeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  addToSprintButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    flexDirection: 'row',
    gap: 4,
  },
  addToSprintText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
}); 