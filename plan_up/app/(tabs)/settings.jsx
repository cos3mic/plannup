import React from 'react';
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
import { useUser, useAuth, useOrganizationList } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors.jsx';
import { useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { organizationList, setActive } = useOrganizationList();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);

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
              router.replace('/(onboarding)');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = ({ icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange, showArrow = true }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.blue }]}>
          <Ionicons name={icon} size={20} color={colors.white} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.coral }}
            thumbColor={colors.white}
          />
        ) : showArrow ? (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Section */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: colors.coral }]}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.emailAddresses?.[0]?.emailAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        {renderSectionHeader('Account')}
        {renderSettingItem({
          icon: 'person',
          title: 'Profile',
          subtitle: 'Edit your profile information',
          onPress: () => Alert.alert('Profile', 'Profile editing coming soon'),
        })}
        {renderSettingItem({
          icon: 'shield-checkmark',
          title: 'Security',
          subtitle: 'Password and security settings',
          onPress: () => Alert.alert('Security', 'Security settings coming soon'),
        })}
        {renderSettingItem({
          icon: 'card',
          title: 'Billing',
          subtitle: 'Manage your subscription',
          onPress: () => Alert.alert('Billing', 'Billing settings coming soon'),
        })}
      </View>

      {/* Preferences */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
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
          subtitle: 'Use dark theme',
          showSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled,
          showArrow: false,
        })}
      </View>

      {/* Workspace */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        {renderSectionHeader('Workspace')}
        {renderSettingItem({
          icon: 'people',
          title: 'Team Members',
          subtitle: 'Manage team access',
          onPress: () => Alert.alert('Team Members', 'Team management coming soon'),
        })}
        {renderSettingItem({
          icon: 'settings',
          title: 'Workspace Settings',
          subtitle: 'Configure workspace preferences',
          onPress: () => Alert.alert('Workspace Settings', 'Workspace settings coming soon'),
        })}
        {renderSettingItem({
          icon: 'download',
          title: 'Export Data',
          subtitle: 'Download your data',
          onPress: () => Alert.alert('Export Data', 'Data export coming soon'),
        })}
      </View>

      {/* Manage Organization (Jira/ClickUp style) */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        {renderSectionHeader('Manage Organization')}
        {renderSettingItem({
          icon: 'add-circle',
          title: 'Create Organization',
          subtitle: 'Start a new organization/workspace',
          onPress: () => setActive({ createOrganization: true }),
        })}
        {renderSettingItem({
          icon: 'log-in',
          title: 'Join Organization',
          subtitle: 'Join with an invite link or code',
          onPress: () => setActive({ joinOrganization: true }),
        })}
        {Array.isArray(organizationList) && organizationList.length > 0 && renderSettingItem({
          icon: 'swap-horizontal',
          title: 'Switch Organization',
          subtitle: 'Change your active organization',
          onPress: () => Alert.alert('Switch Organization', 'Go to Organization Management to switch.'),
        })}
        {Array.isArray(organizationList) && organizationList.length > 0 && renderSettingItem({
          icon: 'settings-outline',
          title: 'Organization Management',
          subtitle: 'Manage members, roles, and settings',
          onPress: () => router.push('/Organization'),
        })}
      </View>

      {/* Support */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        {renderSectionHeader('Support')}
        {renderSettingItem({
          icon: 'help-circle',
          title: 'Help & Documentation',
          subtitle: 'Get help and learn more',
          onPress: () => Alert.alert('Help', 'Help documentation coming soon'),
        })}
        {renderSettingItem({
          icon: 'chatbubble',
          title: 'Contact Support',
          subtitle: 'Get in touch with our team',
          onPress: () => Alert.alert('Support', 'Contact support coming soon'),
        })}
        {renderSettingItem({
          icon: 'information-circle',
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => Alert.alert('About', 'PlanUp v1.0.0\nA Jira clone built with React Native'),
        })}
      </View>

      {/* Sign Out */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.error }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color={colors.white} />
          <Text style={[styles.signOutText, { color: colors.white }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
  settingItemRight: {
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 