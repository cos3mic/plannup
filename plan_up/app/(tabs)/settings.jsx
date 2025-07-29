import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors.jsx';
import { useTheme } from '../../hooks/useTheme';

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { colorScheme, userTheme, setTheme, isSystemTheme } = useTheme();
  const colors = Colors[colorScheme];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleThemeChange = async (isDarkMode) => {
    const newTheme = isDarkMode ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/onboarding');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const handleProfileEdit = () => {
    Alert.alert(
      'Profile Settings',
      'Profile editing is available through your Clerk dashboard.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = ({ icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange, showArrow = true }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.white, borderColor: colors.border }]}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: colorScheme === 'dark' ? colors.blue + '30' : colors.blue + '20' }]}>
          <Ionicons name={icon} size={20} color={colors.blue} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colorScheme === 'dark' ? colors.blue + '40' : colors.blue + '40' }}
          thumbColor={switchValue ? colors.blue : colors.textSecondary}
        />
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          {renderSectionHeader('Profile')}
          <View style={[styles.profileCard, { backgroundColor: colors.white }]}>
            <View style={[styles.avatar, { backgroundColor: colors.blue }]}>
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0) || user?.primaryEmailAddress?.emailAddress?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.fullName || user?.firstName || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleProfileEdit}>
              <Ionicons name="pencil" size={20} color={colors.blue} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          {renderSectionHeader('Preferences')}
          {renderSettingItem({
            icon: 'notifications',
            title: 'Push Notifications',
            subtitle: 'Receive notifications for updates',
            showSwitch: true,
            switchValue: notificationsEnabled,
            onSwitchChange: setNotificationsEnabled,
            showArrow: false,
          })}
          {renderSettingItem({
            icon: 'mail',
            title: 'Email Notifications',
            subtitle: 'Receive email updates',
            showSwitch: true,
            switchValue: emailNotifications,
            onSwitchChange: setEmailNotifications,
            showArrow: false,
          })}
          {renderSettingItem({
            icon: 'moon',
            title: 'Dark Mode',
            subtitle: isSystemTheme ? 'Follow system theme' : (userTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'),
            showSwitch: true,
            switchValue: colorScheme === 'dark',
            onSwitchChange: handleThemeChange,
            showArrow: false,
          })}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          {renderSectionHeader('Account')}
          {renderSettingItem({
            icon: 'shield-checkmark',
            title: 'Privacy & Security',
            subtitle: 'Manage your privacy settings',
            onPress: () => Alert.alert('Privacy', 'Privacy settings will be available soon.'),
          })}
          {renderSettingItem({
            icon: 'help-circle',
            title: 'Help & Support',
            subtitle: 'Get help and contact support',
            onPress: () => Alert.alert('Support', 'Support features will be available soon.'),
          })}
          {renderSettingItem({
            icon: 'information-circle',
            title: 'About',
            subtitle: 'App version and information',
            onPress: () => Alert.alert('About', 'PlanUp v1.0.0\nYour project management companion'),
          })}
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: colors.error }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out" size={20} color={colors.white} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 