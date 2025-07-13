import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors.jsx';

const SWIPE_THRESHOLD = 80;

export default function SwipeableActivityItem({ 
  activity, 
  onDelete, 
  onUpdate,
  onPress 
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const translateX = useSharedValue(0);
  const [isSwiped, setIsSwiped] = React.useState(false);

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

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      setIsSwiped(false);
    },
    onActive: (event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SWIPE_THRESHOLD);
        runOnJS(setIsSwiped)(true);
      } else {
        translateX.value = withSpring(0);
        runOnJS(setIsSwiped)(false);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleDelete = () => {
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
    onUpdate(activity);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(activity);
    }
  };

  return (
    <View style={styles.container}>
      {/* Swipe Actions */}
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.updateButton]}
          onPress={handleUpdate}
        >
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.actionText}>Update</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Item */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.activityItem, animatedStyle]}>
          <TouchableOpacity
            style={[
              styles.activityContent,
              { backgroundColor: colors.white }
            ]}
            onPress={handlePress}
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
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  swipeActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  activityItem: {
    backgroundColor: 'transparent',
  },
  activityContent: {
    borderRadius: 12,
    padding: 16,
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
}); 