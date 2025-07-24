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

const linkTypes = [
  { key: 'blocks', label: 'Blocks', icon: 'stop-circle', color: '#FF6B6B' },
  { key: 'is-blocked-by', label: 'Is Blocked By', icon: 'alert-circle', color: '#FF9800' },
  { key: 'duplicates', label: 'Duplicates', icon: 'copy', color: '#9C27B0' },
  { key: 'is-duplicated-by', label: 'Is Duplicated By', icon: 'copy-outline', color: '#9C27B0' },
  { key: 'relates-to', label: 'Relates To', icon: 'link', color: '#2196F3' },
  { key: 'parent-of', label: 'Parent Of', icon: 'arrow-up-circle', color: '#4CAF50' },
  { key: 'child-of', label: 'Child Of', icon: 'arrow-down-circle', color: '#4CAF50' },
];

export default function IssueLinksModal({ 
  visible, 
  currentIssue, 
  linkedIssues = [], 
  allIssues = [],
  onClose, 
  onAddLink,
  onRemoveLink,
  onSearchIssues
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [selectedLinkType, setSelectedLinkType] = useState('relates-to');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Filter out current issue and already linked issues
      const filteredIssues = allIssues.filter(issue => 
        issue.id !== currentIssue?.id &&
        !linkedIssues.some(link => link.issue.id === issue.id) &&
        (issue.title.toLowerCase().includes(query.toLowerCase()) ||
         issue.key.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(filteredIssues.slice(0, 10)); // Limit results
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async (targetIssue) => {
    try {
      await onAddLink(currentIssue.id, targetIssue.id, selectedLinkType);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add link');
    }
  };

  const handleRemoveLink = (linkId) => {
    Alert.alert(
      'Remove Link',
      'Are you sure you want to remove this link?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => onRemoveLink(currentIssue.id, linkId)
        },
      ]
    );
  };

  const getLinkTypeInfo = (linkType) => {
    return linkTypes.find(type => type.key === linkType) || linkTypes[0];
  };

  const renderLinkType = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.linkTypeButton,
        {
          backgroundColor: selectedLinkType === item.key ? item.color : colors.white,
          borderColor: selectedLinkType === item.key ? item.color : colors.border,
        },
      ]}
      onPress={() => setSelectedLinkType(item.key)}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedLinkType === item.key ? '#fff' : item.color} 
      />
      <Text style={[
        styles.linkTypeText,
        { color: selectedLinkType === item.key ? '#fff' : colors.text }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderLinkedIssue = ({ item }) => {
    const linkTypeInfo = getLinkTypeInfo(item.linkType);
    
    return (
      <View style={[styles.linkedIssueItem, { backgroundColor: colors.white }]}>
        <View style={styles.linkedIssueContent}>
          <View style={[styles.linkTypeBadge, { backgroundColor: linkTypeInfo.color + '20' }]}>
            <Ionicons name={linkTypeInfo.icon} size={16} color={linkTypeInfo.color} />
            <Text style={[styles.linkTypeLabel, { color: linkTypeInfo.color }]}>
              {linkTypeInfo.label}
            </Text>
          </View>
          
          <View style={styles.issueInfo}>
            <Text style={[styles.issueKey, { color: colors.text }]}>
              {item.issue.key}
            </Text>
            <Text style={[styles.issueTitle, { color: colors.text }]} numberOfLines={2}>
              {item.issue.title}
            </Text>
            <View style={styles.issueMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.issue.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.issue.status) }]}>
                  {item.issue.status}
                </Text>
              </View>
              <Text style={[styles.issueType, { color: colors.textSecondary }]}>
                {item.issue.type}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveLink(item.id)}
        >
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={[styles.searchResultItem, { backgroundColor: colors.white }]}
      onPress={() => handleAddLink(item)}
    >
      <View style={styles.searchResultContent}>
        <Text style={[styles.searchResultKey, { color: colors.text }]}>
          {item.key}
        </Text>
        <Text style={[styles.searchResultTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.searchResultMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <Text style={[styles.searchResultType, { color: colors.textSecondary }]}>
            {item.type}
          </Text>
        </View>
      </View>
      <Ionicons name="add-circle" size={20} color={colors.coral} />
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    const statusColors = {
      'To Do': '#E5E5E5',
      'In Progress': '#FF6B6B',
      'Done': '#4ECDC4',
    };
    return statusColors[status] || '#E5E5E5';
  };

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
            Issue Links
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Current Issue Info */}
          <View style={[styles.currentIssueCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.currentIssueTitle, { color: colors.text }]}>
              {currentIssue?.title}
            </Text>
            <Text style={[styles.currentIssueKey, { color: colors.textSecondary }]}>
              {currentIssue?.key}
            </Text>
          </View>

          {/* Link Type Selection */}
          <View style={styles.linkTypeSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Link Type
            </Text>
            <FlatList
              data={linkTypes}
              renderItem={renderLinkType}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.linkTypeList}
            />
          </View>

          {/* Add New Link */}
          <View style={styles.addLinkSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Add Link
            </Text>
            <View style={styles.searchContainer}>
              <View style={[styles.searchInputContainer, { backgroundColor: colors.white, borderColor: colors.border }]}>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    handleSearch(text);
                  }}
                  placeholder="Search issues to link..."
                  placeholderTextColor={colors.textSecondary}
                  onFocus={() => setShowSearch(true)}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}>
                    <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Search Results */}
            {showSearch && searchQuery.length > 0 && (
              <View style={styles.searchResults}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.coral} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                      Searching...
                    </Text>
                  </View>
                ) : searchResults.length > 0 ? (
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={[styles.noResults, { backgroundColor: colors.white }]}>
                    <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                      No issues found
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Existing Links */}
          <View style={styles.existingLinksSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Linked Issues ({linkedIssues.length})
            </Text>
            {linkedIssues.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
                <Ionicons name="link-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No linked issues
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Link this issue to other issues to show relationships
                </Text>
              </View>
            ) : (
              <FlatList
                data={linkedIssues}
                renderItem={renderLinkedIssue}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
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
  currentIssueCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  currentIssueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentIssueKey: {
    fontSize: 14,
  },
  linkTypeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  linkTypeList: {
    gap: 8,
  },
  linkTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  linkTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addLinkSection: {
    marginBottom: 24,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  searchResults: {
    maxHeight: 200,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultKey: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchResultTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  searchResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  searchResultType: {
    fontSize: 12,
  },
  noResults: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  noResultsText: {
    fontSize: 14,
  },
  existingLinksSection: {
    flex: 1,
  },
  linkedIssueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  linkedIssueContent: {
    flex: 1,
  },
  linkTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
    gap: 4,
  },
  linkTypeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  issueInfo: {
    flex: 1,
  },
  issueKey: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  issueTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  issueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  issueType: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
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
}); 