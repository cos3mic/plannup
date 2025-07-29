import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import IssueDetailsModal from '../../components/IssueDetailsModal';
import { useIssues } from '../../hooks/useIssues';
import { Colors } from '../../constants/Colors.jsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';

export default function AllWorkScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [isIssueDetailsModalVisible, setIsIssueDetailsModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const params = useLocalSearchParams();
  
  const { issues, updateIssue, addComment, addTimeLog, addAttachment, addDecisionLogToIssue } = useIssues();
  const { user } = useUser();
  const userName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'anonymous';

  // Handle search parameter from dashboard
  useEffect(() => {
    if (params.search) {
      setSearchQuery(params.search);
    }
  }, [params.search]);

  const filters = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'todo', label: 'To Do', icon: 'list' },
    { key: 'in-progress', label: 'In Progress', icon: 'time' },
    { key: 'done', label: 'Done', icon: 'checkmark-circle' },
    { key: 'my', label: 'My Work', icon: 'person' },
  ];

  // Define colors based on current theme
  const statusColors = {
    'To Do': colorScheme === 'dark' ? '#30363D' : '#E5E5E5',
    'In Progress': '#FF6B6B',
    'Done': '#4ECDC4',
  };

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

  // Filter issues based on search query and active filter
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.key.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case 'todo':
        return issue.status === 'To Do';
      case 'in-progress':
        return issue.status === 'In Progress';
      case 'done':
        return issue.status === 'Done';
      case 'my':
        return issue.assignee === userName || issue.assignee.includes(userName.split(' ')[0]);
      default:
        return true;
    }
  });

  const getIssueStats = () => {
    const total = issues.length;
    const todo = issues.filter(issue => issue.status === 'To Do').length;
    const inProgress = issues.filter(issue => issue.status === 'In Progress').length;
    const done = issues.filter(issue => issue.status === 'Done').length;
    const myWork = issues.filter(issue => 
      issue.assignee === userName || issue.assignee.includes(userName.split(' ')[0])
    ).length;

    return { total, todo, inProgress, done, myWork };
  };

  const stats = getIssueStats();

  const renderIssueCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.issueCard, { backgroundColor: colors.white }]}
      onPress={() => {
        setSelectedIssue(item);
        setIsIssueDetailsModalVisible(true);
      }}
    >
      <View style={styles.issueHeader}>
        <View style={styles.issueType}>
          <View style={[styles.typeBadge, { backgroundColor: typeColors[item.type] }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <Text style={[styles.projectKey, { color: colors.text }]}>{item.key}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '20' }]}>
          <Text style={[styles.priorityText, { color: priorityColors[item.priority] }]}>
            {item.priority}
          </Text>
        </View>
      </View>

      <Text style={[styles.issueTitle, { color: colors.text }]}>{item.title}</Text>

      {item.description && (
        <Text style={[styles.issueDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      )}

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

      {item.comments && item.comments.length > 0 && (
        <View style={styles.issueMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="chatbubble" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {item.comments.length}
            </Text>
          </View>
          {item.timeSpent && (
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.timeSpent}h
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: activeFilter === item.key ? colors.blue : colors.white,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setActiveFilter(item.key)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={activeFilter === item.key ? colors.white : colors.textSecondary} 
      />
      <Text style={[
        styles.filterText,
        { color: activeFilter === item.key ? colors.white : colors.text }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {searchQuery ? 'No matching issues' : 'No issues found'}
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Create your first issue to get started'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>All Work</Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: colors.white }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search issues..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            onPress={() => setShowFilters(!showFilters)} 
            style={styles.filterToggle}
          >
            <Ionicons name="filter" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {showFilters && (
          <FlatList
            data={filters}
            renderItem={renderFilterButton}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          />
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="list" size={24} color={colors.coral} />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total Issues</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="time" size={24} color={colors.blue} />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.inProgress}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>In Progress</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.done}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Completed</Text>
        </View>
      </View>

      {/* Issues List */}
      <FlatList
        data={filteredIssues}
        renderItem={renderIssueCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <IssueDetailsModal
        visible={isIssueDetailsModalVisible}
        issue={selectedIssue}
        onClose={() => {
          setIsIssueDetailsModalVisible(false);
          setSelectedIssue(null);
        }}
        onUpdate={updateIssue}
        onAddComment={addComment}
        onAddTimeLog={addTimeLog}
        onAddAttachment={addAttachment}
        addDecisionLogToIssue={addDecisionLogToIssue}
        userName={userName}
      />
    </SafeAreaView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterToggle: {
    padding: 8,
  },
  filtersContainer: {
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  issueCard: {
    borderRadius: 12,
    padding: 16,
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
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  projectKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  issueDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  assigneeName: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  issueMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
}); 