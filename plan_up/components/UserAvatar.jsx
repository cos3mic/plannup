import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors.jsx';
import { useColorScheme } from 'react-native';

export default function UserAvatar() {
  const { user } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    router.push('/(tabs)/settings');
  };

  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <TouchableOpacity
      style={[styles.avatar, { backgroundColor: colors.coral }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.avatarText, { color: colors.white }]}>
        {getInitials()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 