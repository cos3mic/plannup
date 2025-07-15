import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import CreateIssueModal from '../../components/CreateIssueModal';
import SearchModal from '../../components/SearchModal';
import SprintModal from '../../components/SprintModal';
import ReportsModal from '../../components/ReportsModal';
import { SignOutButton } from '../../components/SignOutButton';
import ActivityItem from '../../components/ActivityItem';
import UpdateActivityModal from '../../components/UpdateActivityModal';
import { useRecentActivities } from '../../hooks/useRecentActivities';
import { Colors } from '../../constants/Colors.jsx';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useUser();
  const [isCreateIssueModalVisible, setIsCreateIssueModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isSprintModalVisible, setIsSprintModalVisible] = useState(false);
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  const [isUpdateActivityModalVisible, setIsUpdateActivityModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const { activities, addActivity, updateActivity, deleteActivity } = useRecentActivities();

  // Get user's first name
  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User';

  const handleIssueCreated = (activity) => {
    addActivity(activity);
  };

  const handleActivityUpdate = (activity) => {
    setSelectedActivity(activity);
    setIsUpdateActivityModalVisible(true);
  };

  const handleActivityDelete = (activityId) => {
    deleteActivity(activityId);
  };

  const handleActivityUpdateSubmit = (activityId, updates) => {
    updateActivity(activityId, updates);
    setIsUpdateActivityModalVisible(false);
    setSelectedActivity(null);
  };

  return (
    <>
      <SignedIn>
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              Welcome to PlanUp, {firstName}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Your project management companion
            </Text>
          </View>

          <View style={styles.quickActions}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: colors.white, borderColor: colors.blue }]}
                onPress={() => setIsCreateIssueModalVisible(true)}
              >
                <Ionicons name="add-circle" size={32} color={colors.coral} />
                <Text style={[styles.actionText, { color: colors.text }]}>Create Issue</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: colors.white, borderColor: colors.blue }]}
                onPress={() => setIsSearchModalVisible(true)}
              >
                <Ionicons name="search" size={32} color={colors.coral} />
                <Text style={[styles.actionText, { color: colors.text }]}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: colors.white, borderColor: colors.blue }]}
                onPress={() => setIsSprintModalVisible(true)}
              >
                <Ionicons name="calendar" size={32} color={colors.coral} />
                <Text style={[styles.actionText, { color: colors.text }]}>Sprint</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: colors.white, borderColor: colors.blue }]}
                onPress={() => setIsReportsModalVisible(true)}
              >
                <Ionicons name="analytics" size={32} color={colors.coral} />
                <Text style={[styles.actionText, { color: colors.text }]}>Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.recentActivity}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Activity
            </Text>
            
            <View style={styles.activitiesContainer}>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onDelete={handleActivityDelete}
                    onUpdate={handleActivityUpdate}
                  />
                ))
              ) : (
                <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
                  <Ionicons name="time-outline" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No recent activities
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Create an issue to see it here
                  </Text>
                </View>
              )}
            </View>
          </View>

          <SignOutButton />
        </ScrollView>

        <CreateIssueModal 
          visible={isCreateIssueModalVisible}
          onClose={() => setIsCreateIssueModalVisible(false)}
          onIssueCreated={handleIssueCreated}
        />
        
        <SearchModal 
          visible={isSearchModalVisible}
          onClose={() => setIsSearchModalVisible(false)}
        />

        <SprintModal
          visible={isSprintModalVisible}
          onClose={() => setIsSprintModalVisible(false)}
        />

        <ReportsModal
          visible={isReportsModalVisible}
          onClose={() => setIsReportsModalVisible(false)}
        />

        <UpdateActivityModal
          visible={isUpdateActivityModalVisible}
          activity={selectedActivity}
          onClose={() => {
            setIsUpdateActivityModalVisible(false);
            setSelectedActivity(null);
          }}
          onUpdate={handleActivityUpdateSubmit}
        />
      </SignedIn>

      <SignedOut>
        <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.welcomeText, { color: colors.text, textAlign: 'center' }]}>
            Welcome to PlanUp
          </Text>
          <Text style={[styles.subtitle, { color: colors.text, textAlign: 'center', marginBottom: 32 }]}>
            Your project management companion
          </Text>
          <View style={styles.authButtons}>
            <Link href="/sign-in" asChild>
              <TouchableOpacity style={[styles.authButton, { backgroundColor: colors.blue }]}>
                <Text style={styles.authButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/sign-up" asChild>
              <TouchableOpacity style={[styles.authButton, { backgroundColor: colors.coral }]}>
                <Text style={styles.authButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </SignedOut>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentActivity: {
    padding: 20,
  },
  activitiesContainer: {
    gap: 8,
  },
  emptyState: {
    borderRadius: 12,
    padding: 32,
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
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  authButtons: {
    width: '100%',
    paddingHorizontal: 20,
  },
  authButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
