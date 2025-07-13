import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

export default function CreateIssueModal({ visible, onClose, onIssueCreated }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  const priorities = [
    { key: 'low', label: 'Low', color: '#4CAF50' },
    { key: 'medium', label: 'Medium', color: '#FF9800' },
    { key: 'high', label: 'High', color: '#F44336' },
  ];



  const handleCreateIssue = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the issue');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would integrate with Jira/ClickUp APIs
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create activity for the new issue
      const activity = {
        type: 'issue_created',
        title: `New issue "${title}" created`,
        description: `Issue created with ${priority} priority${description ? `: ${description}` : ''}`,
        icon: 'create',
        color: '#FF6B6B',
      };
      
      if (onIssueCreated) {
        onIssueCreated(activity);
      }
      
      Alert.alert(
        'Success',
        'Issue created successfully!',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Create New Issue
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Issue Title */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Issue Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter issue title"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Priority
            </Text>
            <View style={styles.priorityContainer}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor: priority === p.key ? p.color : colors.white,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setPriority(p.key)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: priority === p.key ? '#fff' : colors.text },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter issue description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={handleClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.createButton,
              {
                backgroundColor: isLoading ? colors.textSecondary : colors.coral,
              },
            ]}
            onPress={handleCreateIssue}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.createButtonText}>Create Issue</Text>
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
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
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
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 