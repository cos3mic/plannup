import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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

const searchFields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'key', label: 'Issue Key', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['To Do', 'In Progress', 'Done'] },
  { key: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
  { key: 'type', label: 'Type', type: 'select', options: ['Bug', 'Story', 'Task'] },
  { key: 'assignee', label: 'Assignee', type: 'text' },
  { key: 'reporter', label: 'Reporter', type: 'text' },
  { key: 'project', label: 'Project', type: 'text' },
  { key: 'created', label: 'Created Date', type: 'date' },
  { key: 'updated', label: 'Updated Date', type: 'date' },
  { key: 'dueDate', label: 'Due Date', type: 'date' },
];

const operators = [
  { key: '=', label: 'equals', icon: 'remove' },
  { key: '!=', label: 'not equals', icon: 'close' },
  { key: '~', label: 'contains', icon: 'search' },
  { key: '!~', label: 'not contains', icon: 'search-outline' },
  { key: '>', label: 'greater than', icon: 'arrow-up' },
  { key: '<', label: 'less than', icon: 'arrow-down' },
  { key: '>=', label: 'greater than or equal', icon: 'arrow-up-circle' },
  { key: '<=', label: 'less than or equal', icon: 'arrow-down-circle' },
];

const quickFilters = [
  { name: 'My Issues', query: 'assignee = currentUser()' },
  { name: 'Recently Updated', query: 'updated >= -7d' },
  { name: 'Overdue', query: 'dueDate < now() AND status != Done' },
  { name: 'High Priority', query: 'priority = High' },
  { name: 'Bugs', query: 'type = Bug' },
  { name: 'Unassigned', query: 'assignee = null' },
];

export default function AdvancedSearchModal({ 
  visible, 
  issues = [],
  onClose, 
  onSearch,
  onSaveFilter
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState('');

  // Query builder state
  const [queryConditions, setQueryConditions] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [conditionValue, setConditionValue] = useState('');

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, issues]);

  const performSearch = async (query) => {
    setIsLoading(true);
    try {
      // Parse and execute the search query
      const results = parseAndExecuteQuery(query, issues);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseAndExecuteQuery = (query, issues) => {
    // Simple query parser - in a real implementation, this would be more sophisticated
    const conditions = query.split(' AND ');
    
    return issues.filter(issue => {
      return conditions.every(condition => {
        return evaluateCondition(condition.trim(), issue);
      });
    });
  };

  const evaluateCondition = (condition, issue) => {
    // Parse condition like "status = In Progress"
    const parts = condition.split(/\s*(=|!=|~|!~|>|<|>=|<=)\s*/);
    if (parts.length < 3) return true;

    const [field, operator, value] = parts;
    const fieldValue = getFieldValue(issue, field);
    const searchValue = value.replace(/['"]/g, ''); // Remove quotes

    switch (operator) {
      case '=':
        return fieldValue === searchValue;
      case '!=':
        return fieldValue !== searchValue;
      case '~':
        return String(fieldValue).toLowerCase().includes(searchValue.toLowerCase());
      case '!~':
        return !String(fieldValue).toLowerCase().includes(searchValue.toLowerCase());
      case '>':
        return fieldValue > searchValue;
      case '<':
        return fieldValue < searchValue;
      case '>=':
        return fieldValue >= searchValue;
      case '<=':
        return fieldValue <= searchValue;
      default:
        return true;
    }
  };

  const getFieldValue = (issue, field) => {
    switch (field) {
      case 'title':
        return issue.title;
      case 'description':
        return issue.description;
      case 'key':
        return issue.key;
      case 'status':
        return issue.status;
      case 'priority':
        return issue.priority;
      case 'type':
        return issue.type;
      case 'assignee':
        return issue.assignee;
      case 'reporter':
        return issue.reporter;
      case 'project':
        return issue.project;
      case 'created':
        return issue.created;
      case 'updated':
        return issue.updated;
      case 'dueDate':
        return issue.dueDate;
      default:
        return '';
    }
  };

  const handleQuickFilter = (filter) => {
    setSearchQuery(filter.query);
  };

  const handleAddCondition = () => {
    if (!selectedField || !selectedOperator || !conditionValue) {
      return;
    }

    const condition = `${selectedField} ${selectedOperator} "${conditionValue}"`;
    setQueryConditions([...queryConditions, condition]);
    setSelectedField('');
    setSelectedOperator('');
    setConditionValue('');
  };

  const handleRemoveCondition = (index) => {
    setQueryConditions(queryConditions.filter((_, i) => i !== index));
  };

  const handleBuildQuery = () => {
    const query = queryConditions.join(' AND ');
    setSearchQuery(query);
    setShowQueryBuilder(false);
  };

  const handleSaveFilter = () => {
    if (!filterName.trim() || !searchQuery.trim()) {
      return;
    }

    const newFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      query: searchQuery,
    };

    setSavedFilters([...savedFilters, newFilter]);
    setFilterName('');
  };

  const renderQuickFilter = ({ item }) => (
    <TouchableOpacity
      style={[styles.quickFilterButton, { backgroundColor: colors.white, borderColor: colors.border }]}
      onPress={() => handleQuickFilter(item)}
    >
      <Text style={[styles.quickFilterText, { color: colors.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={[styles.searchResultItem, { backgroundColor: colors.white }]}
      onPress={() => {
        if (onSearch) {
          onSearch(item);
        }
      }}
    >
      <View style={styles.resultHeader}>
        <Text style={[styles.resultKey, { color: colors.text }]}>
          {item.key}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>
      
      <View style={styles.resultMeta}>
        <Text style={[styles.resultAssignee, { color: colors.textSecondary }]}>
          {item.assignee}
        </Text>
        <Text style={[styles.resultType, { color: colors.textSecondary }]}>
          {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCondition = ({ item, index }) => (
    <View style={[styles.conditionItem, { backgroundColor: colors.white }]}>
      <Text style={[styles.conditionText, { color: colors.text }]}>
        {item}
      </Text>
      <TouchableOpacity
        style={styles.removeConditionButton}
        onPress={() => handleRemoveCondition(index)}
      >
        <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
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
            Advanced Search
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Search Input */}
          <View style={styles.searchSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Search Query
            </Text>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Enter JQL query (e.g., status = 'In Progress' AND priority = High)"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Quick Filters */}
          <View style={styles.quickFiltersSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Filters
            </Text>
            <FlatList
              data={quickFilters}
              renderItem={renderQuickFilter}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickFiltersList}
            />
          </View>

          {/* Query Builder */}
          <View style={styles.queryBuilderSection}>
            <View style={styles.queryBuilderHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Query Builder
              </Text>
              <TouchableOpacity
                style={[styles.toggleButton, { backgroundColor: colors.coral }]}
                onPress={() => setShowQueryBuilder(!showQueryBuilder)}
              >
                <Text style={styles.toggleButtonText}>
                  {showQueryBuilder ? 'Hide' : 'Show'} Builder
                </Text>
              </TouchableOpacity>
            </View>

            {showQueryBuilder && (
              <View style={[styles.queryBuilder, { backgroundColor: colors.white }]}>
                {/* Field Selection */}
                <View style={styles.builderRow}>
                  <Text style={[styles.builderLabel, { color: colors.text }]}>Field:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.fieldButtons}>
                      {searchFields.map(field => (
                        <TouchableOpacity
                          key={field.key}
                          style={[
                            styles.fieldButton,
                            {
                              backgroundColor: selectedField === field.key ? colors.coral : colors.white,
                              borderColor: colors.border,
                            },
                          ]}
                          onPress={() => setSelectedField(field.key)}
                        >
                          <Text style={[
                            styles.fieldButtonText,
                            { color: selectedField === field.key ? '#fff' : colors.text }
                          ]}>
                            {field.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Operator Selection */}
                <View style={styles.builderRow}>
                  <Text style={[styles.builderLabel, { color: colors.text }]}>Operator:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.operatorButtons}>
                      {operators.map(operator => (
                        <TouchableOpacity
                          key={operator.key}
                          style={[
                            styles.operatorButton,
                            {
                              backgroundColor: selectedOperator === operator.key ? colors.coral : colors.white,
                              borderColor: colors.border,
                            },
                          ]}
                          onPress={() => setSelectedOperator(operator.key)}
                        >
                          <Ionicons 
                            name={operator.icon} 
                            size={16} 
                            color={selectedOperator === operator.key ? '#fff' : colors.textSecondary} 
                          />
                          <Text style={[
                            styles.operatorButtonText,
                            { color: selectedOperator === operator.key ? '#fff' : colors.text }
                          ]}>
                            {operator.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Value Input */}
                <View style={styles.builderRow}>
                  <Text style={[styles.builderLabel, { color: colors.text }]}>Value:</Text>
                  <TextInput
                    style={[
                      styles.valueInput,
                      {
                        backgroundColor: colors.white,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={conditionValue}
                    onChangeText={setConditionValue}
                    placeholder="Enter value"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <TouchableOpacity
                    style={[styles.addConditionButton, { backgroundColor: colors.coral }]}
                    onPress={handleAddCondition}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Conditions List */}
                {queryConditions.length > 0 && (
                  <View style={styles.conditionsSection}>
                    <Text style={[styles.conditionsTitle, { color: colors.text }]}>
                      Conditions:
                    </Text>
                    <FlatList
                      data={queryConditions}
                      renderItem={renderCondition}
                      keyExtractor={(item, index) => index.toString()}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity
                      style={[styles.buildQueryButton, { backgroundColor: colors.blue }]}
                      onPress={handleBuildQuery}
                    >
                      <Text style={styles.buildQueryButtonText}>
                        Build Query
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Save Filter */}
          <View style={styles.saveFilterSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Save Filter
            </Text>
            <View style={styles.saveFilterRow}>
              <TextInput
                style={[
                  styles.filterNameInput,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={filterName}
                onChangeText={setFilterName}
                placeholder="Filter name"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={[styles.saveFilterButton, { backgroundColor: colors.coral }]}
                onPress={handleSaveFilter}
              >
                <Text style={styles.saveFilterButtonText}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Results */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Results ({searchResults.length})
              </Text>
              {isLoading && (
                <ActivityIndicator size="small" color={colors.coral} />
              )}
            </View>
            
            {searchResults.length === 0 && !isLoading && searchQuery && (
              <View style={[styles.noResults, { backgroundColor: colors.white }]}>
                <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                  No results found
                </Text>
                <Text style={[styles.noResultsSubtext, { color: colors.textSecondary }]}>
                  Try adjusting your search criteria
                </Text>
              </View>
            )}

            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
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
  searchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    textAlignVertical: 'top',
  },
  quickFiltersSection: {
    marginBottom: 24,
  },
  quickFiltersList: {
    gap: 8,
  },
  quickFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  queryBuilderSection: {
    marginBottom: 24,
  },
  queryBuilderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  queryBuilder: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  builderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  builderLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 60,
  },
  fieldButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  fieldButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  fieldButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  operatorButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  operatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  operatorButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
  },
  addConditionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionsSection: {
    marginTop: 12,
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  conditionText: {
    fontSize: 12,
    flex: 1,
  },
  removeConditionButton: {
    padding: 4,
  },
  buildQueryButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buildQueryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  saveFilterSection: {
    marginBottom: 24,
  },
  saveFilterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterNameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveFilterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchResultItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultKey: {
    fontSize: 14,
    fontWeight: '600',
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
  resultTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultAssignee: {
    fontSize: 12,
  },
  resultType: {
    fontSize: 12,
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 