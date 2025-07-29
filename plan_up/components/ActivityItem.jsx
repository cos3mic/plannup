import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors.jsx';
import { useTheme } from '../hooks/useTheme';

export default function ActivityItem({ activity, onDelete, onUpdate }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [showActions, setShowActions] = useState(false);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLongPress = () => {
    setShowActions(true);
  };

  const handleDelete = () => {
    setShowActions(false);
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(activity.id)
        },
      ]
    );
  };

  const handleUpdate = () => {
    setShowActions(false);
    onUpdate(activity);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(activity);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.activityItem,
          { backgroundColor: colors.white }
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        <View style={styles.activityHeader}>
          <View style={styles.activityIcon}>
            <Ionicons 
              name={activity.icon} 
              size={20} 
              color={activity.color || colors.coral} 
            />
          </View>
          <View style={styles.activityInfo}>
            <Text style={[styles.activityTitle, { color: colors.text }]}>
              {activity.title}
            </Text>
            <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
              {activity.description}
            </Text>
            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
              {formatTimeAgo(activity.timestamp)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowActions(true)}
          >
            <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Action Modal */}
      <Modal
        visible={showActions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={[styles.actionModal, { backgroundColor: colors.white }]}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleUpdate}
            >
              <Ionicons name="create" size={20} color={colors.blue} />
              <Text style={[styles.actionText, { color: colors.blue }]}>Update</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color={colors.coral} />
              <Text style={[styles.actionText, { color: colors.coral }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  moreButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModal: {
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
}); 