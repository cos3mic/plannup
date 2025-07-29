import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
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

// Mock data for search results
const mockSearchData = [
  {
    id: '1',
    type: 'issue',
    title: 'Fix login bug',
    description: 'Users unable to login with correct credentials',
    status: 'In Progress',
    priority: 'High',
    project: 'Mobile App Development',
  },
  {
    id: '2',
    type: 'project',
    title: 'Website Redesign',
    description: 'Complete redesign of company website',
    status: 'Active',
    progress: 45,
  },
  {
    id: '3',
    type: 'issue',
    title: 'Dashboard redesign',
    description: 'Redesign the main dashboard interface',
    status: 'To Do',
    priority: 'Medium',
    project: 'Website Redesign',
  },
  {
    id: '4',
    type: 'issue',
    title: 'Mobile app testing',
    description: 'Comprehensive testing of mobile application',
    status: 'Done',
    priority: 'Low',
    project: 'Mobile App Development',
  },
];

export default function SearchModal({ visible, onClose }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'issues', label: 'Issues', icon: 'bug' },
    { key: 'projects', label: 'Projects', icon: 'folder' },
    { key: 'users', label: 'Users', icon: 'people' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedFilter]);

  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredData = mockSearchData.filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.project?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
      
      return matchesQuery && matchesFilter;
    });
    
    setSearchResults(filteredData);
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return '#4CAF50';
      case 'In Progress': return '#FF9800';
      case 'To Do': return '#2196F3';
      case 'Active': return '#4CAF50';
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#F44336';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return colors.textSecondary;
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={[styles.resultCard, { backgroundColor: colors.white }]}>
      <View style={styles.resultHeader}>
        <View style={styles.resultType}>
          <Ionicons 
            name={item.type === 'issue' ? 'bug' : 'folder'} 
            size={16} 
            color={colors.coral} 
          />
          <Text style={[styles.resultTypeText, { color: colors.textSecondary }]}>
            {item.type === 'issue' ? 'Issue' : 'Project'}
          </Text>
        </View>
        
        {item.type === 'issue' && (
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.resultTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.resultDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.resultFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        
        {item.project && (
          <Text style={[styles.projectText, { color: colors.textSecondary }]}>
            {item.project}
          </Text>
        )}
        
        {item.progress !== undefined && (
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {item.progress}% complete
          </Text>
        )}
      </View>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Search
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search issues, projects, users..."
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedFilter === filter.key ? colors.coral : colors.white,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Ionicons
                  name={filter.icon}
                  size={16}
                  color={selectedFilter === filter.key ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.filterText,
                    { color: selectedFilter === filter.key ? '#fff' : colors.text },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.resultsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="search" size={48} color={colors.textSecondary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Searching...
              </Text>
            </View>
          ) : searchQuery.trim() ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="search" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No results found for "{searchQuery}"
                  </Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Start typing to search
              </Text>
            </View>
          )}
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    padding: 20,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultTypeText: {
    marginLeft: 4,
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  projectText: {
    fontSize: 12,
  },
  progressText: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
}); 