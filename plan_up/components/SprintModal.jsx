import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
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

export default function SprintModal({ 
  visible, 
  sprint, 
  onClose, 
  onSave,
  onDelete,
  issues = [],
  teamMembers = [],
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('planned');
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { key: 'planned', label: 'Planned', color: '#E5E5E5' },
    { key: 'active', label: 'Active', color: '#FF6B6B' },
    { key: 'completed', label: 'Completed', color: '#4ECDC4' },
  ];

  useEffect(() => {
    if (sprint) {
      setName(sprint.name || '');
      setGoal(sprint.goal || '');
      setStartDate(sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '');
      setEndDate(sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '');
      setStatus(sprint.status || 'planned');
      setSelectedIssues(sprint.issues || []);
      setSelectedTeamMembers(sprint.teamMembers || []);
    }
  }, [sprint]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a sprint name');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select start and end dates');
      return;
    }

    setIsLoading(true);
    try {
      const sprintData = {
        name: name.trim(),
        goal: goal.trim(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        issues: selectedIssues,
        teamMembers: selectedTeamMembers,
      };

      if (sprint?.id) {
        await onSave(sprint.id, sprintData);
      } else {
        await onSave(sprintData);
      }
      
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save sprint');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Sprint',
      'Are you sure you want to delete this sprint? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await onDelete(sprint.id);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete sprint');
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  const toggleIssueSelection = (issueId) => {
    setSelectedIssues(prev => 
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const toggleTeamMemberSelection = (member) => {
    setSelectedTeamMembers(prev => 
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const getSprintProgress = () => {
    if (!sprint) return 0;
    const totalIssues = sprint.issues?.length || 0;
    if (totalIssues === 0) return 0;
    
    const completedIssues = issues.filter(issue => 
      sprint.issues.includes(issue.id) && issue.status === 'Done'
    ).length;
    
    return Math.round((completedIssues / totalIssues) * 100);
  };

  const getSprintVelocity = () => {
    if (!sprint) return 0;
    const sprintIssues = issues.filter(issue => sprint.issues.includes(issue.id));
    return sprintIssues.reduce((total, issue) => total + (issue.storyPoints || 0), 0);
  };

  const renderSprintInfo = () => (
    <ScrollView style={styles.content}>
      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sprint Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Sprint Name *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.white,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter sprint name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Sprint Goal</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.white,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={goal}
            onChangeText={setGoal}
            placeholder="Enter sprint goal"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateInput}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Start Date *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.dateInput}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>End Date *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Status</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.statusButton,
                  {
                    backgroundColor: status === option.key ? option.color : colors.white,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setStatus(option.key)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    { color: status === option.key ? '#000' : colors.text },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Sprint Stats */}
      {sprint && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sprint Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.statValue, { color: colors.coral }]}>
                {sprint.issues?.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Issues</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.statValue, { color: colors.blue }]}>
                {getSprintVelocity()}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Story Points</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.statValue, { color: '#4ECDC4' }]}>
                {getSprintProgress()}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Progress</Text>
            </View>
          </View>
        </View>
      )}

      {/* Team Members */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Members</Text>
        <View style={styles.membersContainer}>
          {teamMembers.map((member) => (
            <TouchableOpacity
              key={member}
              style={[
                styles.memberItem,
                {
                  backgroundColor: selectedTeamMembers.includes(member) ? colors.coral : colors.white,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => toggleTeamMemberSelection(member)}
            >
              <Text
                style={[
                  styles.memberText,
                  { color: selectedTeamMembers.includes(member) ? '#fff' : colors.text },
                ]}
              >
                {member}
              </Text>
              {selectedTeamMembers.includes(member) && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Issues Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sprint Issues</Text>
        <FlatList
          data={issues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.issueItem,
                {
                  backgroundColor: selectedIssues.includes(item.id) ? colors.coral + '20' : colors.white,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => toggleIssueSelection(item.id)}
            >
              <View style={styles.issueInfo}>
                <Text style={[styles.issueKey, { color: colors.text }]}>{item.key}</Text>
                <Text style={[styles.issueTitle, { color: colors.text }]}>{item.title}</Text>
                <View style={styles.issueMeta}>
                  <Text style={[styles.issueType, { color: colors.textSecondary }]}>{item.type}</Text>
                  <Text style={[styles.issuePoints, { color: colors.coral }]}>
                    {item.storyPoints || 0} pts
                  </Text>
                </View>
              </View>
              {selectedIssues.includes(item.id) && (
                <Ionicons name="checkmark-circle" size={20} color={colors.coral} />
              )}
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
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
            {sprint ? 'Edit Sprint' : 'Create Sprint'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {renderSprintInfo()}

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          {sprint && (
            <TouchableOpacity
              style={[styles.deleteButton, { borderColor: '#FF6B6B' }]}
              onPress={handleDelete}
            >
              <Text style={[styles.deleteButtonText, { color: '#FF6B6B' }]}>Delete</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: isLoading ? colors.textSecondary : colors.coral,
              },
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save Sprint</Text>
            )}
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  memberText: {
    fontSize: 14,
    fontWeight: '500',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  issueInfo: {
    flex: 1,
  },
  issueKey: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  issueTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  issueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  issueType: {
    fontSize: 12,
  },
  issuePoints: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  deleteButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 