import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors.jsx';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserAvatar() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const handlePress = () => {
    setIsSettingsModalVisible(true);
  };

  const handleSettingsPress = () => {
    setIsSettingsModalVisible(false);
    router.push('/(tabs)/settings');
  };

  const handleProfilePress = () => {
    setIsSettingsModalVisible(false);
    Alert.alert('Profile', 'Profile editing coming soon');
  };

  const getInitials = () => {
    if (!user) return 'U';
    
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    } else {
      return user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || 'U';
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isSettingsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSettingsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSettingsModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={handleProfilePress}
            >
              <Ionicons name="person" size={20} color={colors.text} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={handleSettingsPress}
            >
              <Ionicons name="settings" size={20} color={colors.text} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
}); 