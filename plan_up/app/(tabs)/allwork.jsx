import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import IssueDetailsModal from '../../components/IssueDetailsModal';
import { useIssues } from '../../hooks/useIssues';
import { Colors } from '../../constants/Colors.jsx';

// Remove the static issueData as we'll use the hook

const statusColors = {
  'To Do': '#E5E5E5',
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

export default function AllWorkScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isIssueDetailsModalVisible, setIsIssueDetailsModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  const { issues, updateIssue, addComment, addTimeLog, addAttachment } = useIssues();

  const filters = ['All', 'My Work', 'Recent', 'Overdue'];

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>All Work</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.coral }]}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
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
              numberOfLines={1}
              adjustsFontSizeToFit={false}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="list" size={24} color={colors.coral} />
          <Text style={[styles.statValue, { color: colors.text }]}>156</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Total Issues</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="time" size={24} color={colors.blue} />
          <Text style={[styles.statValue, { color: colors.text }]}>23</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>In Progress</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
          <Text style={[styles.statValue, { color: colors.text }]}>89</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Completed</Text>
        </View>
      </View>

      {/* Issues List */}
      <FlatList
        data={issues}
        renderItem={renderIssueCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 0,
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
    marginBottom: 12,
    lineHeight: 22,
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
}); 