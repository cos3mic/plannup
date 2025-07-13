import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
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

export default function UpdateActivityModal({ visible, activity, onClose, onUpdate }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || '');
      setDescription(activity.description || '');
    }
  }, [activity]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the activity');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdate(activity.id, {
        title: title.trim(),
        description: description.trim(),
      });
      
      Alert.alert(
        'Success',
        'Activity updated successfully!',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!activity) return null;

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
            Update Activity
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Activity Title */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Activity Title *
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
              placeholder="Enter activity title"
              placeholderTextColor={colors.textSecondary}
            />
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
              placeholder="Enter activity description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Activity Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Activity Information
            </Text>
            <View style={[styles.infoCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{activity.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Created:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {activity.timestamp.toLocaleDateString()}
                </Text>
              </View>
            </View>
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
              styles.updateButton,
              {
                backgroundColor: isLoading ? colors.textSecondary : colors.coral,
              },
            ]}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.updateButtonText}>Update Activity</Text>
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
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
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
  updateButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 