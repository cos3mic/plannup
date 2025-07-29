import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/Colors.jsx';
import { Ionicons } from '@expo/vector-icons';
import ReportsModal from '../../components/ReportsModal';
import { useIssues } from '../../hooks/useIssues';
import { useSprints } from '../../hooks/useSprints';
import { useUser } from '@clerk/clerk-expo';
import { RetrospectiveProvider, useRetrospective } from '../../components/RetrospectiveContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export default function DashboardScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  
  const { issues } = useIssues();
  const { sprints } = useSprints();
  const { user } = useUser();
  const userName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'anonymous';

  const metrics = [
    { title: 'Total Issues', value: '156', icon: 'list', color: colors.blue, change: '+12%' },
    { title: 'In Progress', value: '23', icon: 'time', color: colors.blueAccent, change: '+5%' },
    { title: 'Completed', value: '89', icon: 'checkmark-circle', color: colors.success, change: '+18%' },
    { title: 'Overdue', value: '5', icon: 'warning', color: colors.error, change: '-2%' },
  ];

  const filters = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'recent', label: 'Recent', icon: 'time' },
    { key: 'priority', label: 'Priority', icon: 'flag' },
    { key: 'status', label: 'Status', icon: 'list' },
  ];

  const recentSprints = sprints.slice(0, 3);

  const teamAnalytics = [
    {
      name: 'Franklin George',
      avatar: 'FG',
      color: colors.blue,
      issuesCompleted: 12,
      issuesInProgress: 3,
      productivity: 85,
      lastActive: '2h ago'
    },
    {
      name: 'Alice Smith',
      avatar: 'AS',
      color: colors.blueAccent,
      issuesCompleted: 8,
      issuesInProgress: 2,
      productivity: 92,
      lastActive: '1h ago'
    },
    {
      name: 'Mike Johnson',
      avatar: 'MJ',
      color: colors.success,
      issuesCompleted: 15,
      issuesInProgress: 1,
      productivity: 78,
      lastActive: '30m ago'
    },
  ];

  // Filter issues based on search query and active filter
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(issue.createdAt || Date.now()) > oneWeekAgo;
      case 'priority':
        return issue.priority === 'high';
      case 'status':
        return issue.status === 'in-progress';
      default:
        return true;
    }
  });

  const handleViewAllSprints = () => {
    router.push('/sprints');
  };

  const handleViewMoreResults = () => {
    // Navigate to allwork screen with current search query
    router.push({
      pathname: '/allwork',
      params: { search: searchQuery }
    });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
  };

  const renderMetricCard = ({ item }) => (
    <View style={[styles.metricCard, { backgroundColor: colors.white }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={[styles.metricChange, { color: item.change.startsWith('+') ? colors.success : colors.error }]}>
          {item.change}
        </Text>
            </View>
      <Text style={[styles.metricValue, { color: colors.text }]}>{item.value}</Text>
      <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>{item.title}</Text>
      </View>
    );

  const renderSprintCard = ({ item }) => (
    <TouchableOpacity style={[styles.sprintCard, { backgroundColor: colors.white }]}>
      <View style={styles.sprintHeader}>
        <Text style={[styles.sprintName, { color: colors.text }]}>{item.name}</Text>
        <View style={[
          styles.statusBadge, 
          { 
            backgroundColor: item.status === 'active' 
              ? (colorScheme === 'dark' ? colors.blue + '30' : colors.blue + '20')
              : (colorScheme === 'dark' ? colors.success + '30' : colors.success + '20')
          }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: item.status === 'active' ? colors.blue : colors.success }
          ]}>
            {item.status}
          </Text>
          </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                width: `${item.velocity}%`,
                backgroundColor: item.velocity === 100 ? colors.success : colors.blue 
                    }
                  ]} 
                />
              </View>
        <Text style={[styles.progressText, { color: colors.text }]}>{item.velocity}%</Text>
      </View>
      <Text style={[styles.sprintDays, { color: colors.textSecondary }]}>
        {item.issues.length} issues
      </Text>
          </TouchableOpacity>
  );

  const renderTeamMember = ({ item }) => (
    <View style={[styles.teamCard, { backgroundColor: colors.white }]}>
      <View style={styles.teamHeader}>
        <View style={[styles.avatar, { backgroundColor: item.color }]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.teamInfo}>
          <Text style={[styles.teamName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.teamStatus, { color: colors.textSecondary }]}>
            Last active {item.lastActive}
          </Text>
                </View>
        <View style={styles.productivityBadge}>
          <Text style={[styles.productivityText, { color: colors.blue }]}>
            {item.productivity}%
                  </Text>
                </View>
              </View>
      <View style={styles.teamStats}>
                <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>{item.issuesCompleted}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
                </View>
                <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.blue }]}>{item.issuesInProgress}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
                </View>
                </View>
              </View>
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
      onPress={() => handleFilterChange(item.key)}
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

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={[styles.searchResultCard, { backgroundColor: colors.white }]}>
      <View style={styles.searchResultHeader}>
        <Text style={[styles.searchResultTitle, { color: colors.text }]}>{item.title}</Text>
        <View style={[styles.searchResultStatus, { backgroundColor: colorScheme === 'dark' ? colors.blue + '30' : colors.blue + '20' }]}>
          <Text style={[styles.searchResultStatusText, { color: colors.blue }]}>
            {item.status || 'Open'}
          </Text>
        </View>
      </View>
      <Text style={[styles.searchResultDescription, { color: colors.textSecondary }]} numberOfLines={2}>
        {item.description || 'No description available'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome back, {userName}!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Here's your project overview
          </Text>
            </View>
        <TouchableOpacity 
          style={[styles.reportsButton, { backgroundColor: colors.blue }]}
          onPress={() => setIsReportsModalVisible(true)}
        >
          <Ionicons name="analytics" size={20} color={colors.white} />
        </TouchableOpacity>
            </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: colors.white }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search issues, sprints..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
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

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Search Results ({filteredIssues.length})
            </Text>
            <FlatList
              data={filteredIssues.slice(0, 3)}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
            {filteredIssues.length > 3 && (
              <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMoreResults}>
                <Text style={[styles.viewMoreText, { color: colors.blue }]}>
                  View {filteredIssues.length - 3} more results
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Metrics */}
      <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Metrics</Text>
          <FlatList
            data={metrics}
            renderItem={renderMetricCard}
            keyExtractor={(item) => item.title}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metricsContainer}
          />
        </View>

        {/* Recent Sprints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Sprints</Text>
            <TouchableOpacity onPress={handleViewAllSprints} style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.blue }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentSprints}
            renderItem={renderSprintCard}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sprintsContainer}
          />
              </View>

        {/* Team Performance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Performance</Text>
          </View>
          <FlatList
            data={teamAnalytics}
            renderItem={renderTeamMember}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
      </View>
      </ScrollView>

      <ReportsModal
        visible={isReportsModalVisible}
        onClose={() => setIsReportsModalVisible(false)}
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  reportsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggle: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    width: 120,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
  },
  sprintsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  sprintCard: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sprintName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sprintDays: {
    fontSize: 12,
  },
  teamCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  teamStatus: {
    fontSize: 12,
  },
  productivityBadge: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productivityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  teamStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  searchResultCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  searchResultStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchResultStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchResultDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 