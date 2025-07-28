import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import SprintModal from '../../components/SprintModal';
import { useSprints } from '../../hooks/useSprints';
import { useIssues } from '../../hooks/useIssues';
import { Colors } from '../../constants/Colors.jsx';

export default function SprintsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isSprintModalVisible, setIsSprintModalVisible] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const { sprints, addSprint, updateSprint, deleteSprint } = useSprints();
  const { issues } = useIssues();

  const teamMembers = [
    'John Doe',
    'Alice Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown',
    'Jane Smith',
    'Robert Chen',
    'Emily Davis',
    'Michael Wong',
    'Lisa Garcia',
  ];

  const getSprintIssues = (sprintId) => {
    return issues.filter(issue => issue.sprint === sprintId);
  };

  const getSprintProgress = (sprint) => {
    const sprintIssues = getSprintIssues(sprint.id);
    if (sprintIssues.length === 0) return 0;
    
    const completedIssues = sprintIssues.filter(issue => issue.status === 'Done').length;
    return Math.round((completedIssues / sprintIssues.length) * 100);
  };

  const getSprintVelocity = (sprint) => {
    const sprintIssues = getSprintIssues(sprint.id);
    return sprintIssues.reduce((total, issue) => total + (issue.storyPoints || 0), 0);
  };

  const getDaysRemaining = (sprint) => {
    const today = new Date();
    const endDate = new Date(sprint.endDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return colors.coral;
      case 'completed': return '#4ECDC4';
      case 'planned': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'planned': return 'Planned';
      default: return status;
    }
  };

  const renderSprintCard = ({ item }) => {
    const progress = getSprintProgress(item);
    const velocity = getSprintVelocity(item);
    const daysRemaining = getDaysRemaining(item);
    const sprintIssues = getSprintIssues(item.id);

    return (
      <TouchableOpacity 
        style={[styles.sprintCard, { backgroundColor: colors.white }]}
        onPress={() => {
          setSelectedSprint(item);
          setIsSprintModalVisible(true);
        }}
      >
        <View style={styles.sprintHeader}>
          <View style={styles.sprintInfo}>
            <Text style={[styles.sprintName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.icon} />
        </View>

        <Text style={[styles.sprintGoal, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.goal}
        </Text>

        <View style={styles.sprintStats}>
          <View style={styles.statItem}>
            <Ionicons name="list" size={16} color={colors.coral} />
            <Text style={[styles.statText, { color: colors.text }]}>
              {sprintIssues.length} issues
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="analytics" size={16} color={colors.blue} />
            <Text style={[styles.statText, { color: colors.text }]}>
              {velocity} pts
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.text }]}>
              {daysRemaining}d left
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? '#4ECDC4' : colors.coral 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.text }]}>{progress}%</Text>
        </View>

        <View style={styles.sprintDates}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSaveSprint = async (sprintData) => {
    if (selectedSprint) {
      await updateSprint(selectedSprint.id, sprintData);
    } else {
      await addSprint(sprintData);
    }
    setIsSprintModalVisible(false);
    setSelectedSprint(null);
  };

  const handleDeleteSprint = async (sprintId) => {
    await deleteSprint(sprintId);
  };



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Sprints</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.coral }]}
          onPress={() => {
            setSelectedSprint(null);
            setIsSprintModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>



      {/* Sprint Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="play-circle" size={24} color={colors.coral} />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {sprints.filter(s => s.status === 'active').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Active Sprints</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {sprints.filter(s => s.status === 'completed').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Completed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.white }]}>
          <Ionicons name="calendar" size={24} color={colors.blue} />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {sprints.filter(s => s.status === 'planned').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>Planned</Text>
        </View>
      </View>

      {/* Sprints List */}
      <FlatList
        data={sprints}
        renderItem={renderSprintCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <SprintModal 
        visible={isSprintModalVisible}
        sprint={selectedSprint}
        onClose={() => {
          setIsSprintModalVisible(false);
          setSelectedSprint(null);
        }}
        onSave={handleSaveSprint}
        onDelete={handleDeleteSprint}
        issues={issues}
        teamMembers={teamMembers}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  sprintCard: {
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
  sprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sprintInfo: {
    flex: 1,
    marginRight: 8,
  },
  sprintName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    flexShrink: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sprintGoal: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
    flexShrink: 1,
  },
  sprintStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    flexShrink: 1,
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
    minWidth: 30,
  },
  sprintDates: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    flexShrink: 1,
  },
}); 