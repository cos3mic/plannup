import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors.jsx';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { OrganizationProvider } from '../components/OrganizationContext.jsx';
import { useUser } from '@clerk/clerk-expo';
import OrganizationProviderWrapper from './OrganizationProviderWrapper';
import { IdeaProvider } from '../components/IdeaContext.jsx';
import { View } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawerContent';
import PushNotificationService from '../components/PushNotificationService';
import { useTheme, ThemeProvider } from '../hooks/useTheme';

// Import screens
import HomeScreen from './(tabs)/index.jsx';
import ProjectScreen from './(tabs)/project.jsx';
import DashboardScreen from './(tabs)/dashboard.jsx';
import AllWorkScreen from './(tabs)/allwork.jsx';
import SprintsScreen from './(tabs)/sprints.jsx';
import NotificationScreen from './(tabs)/notification.jsx';
import SettingsScreen from './(tabs)/settings.jsx';
import OrganizationManagement from '../components/OrganizationManagement.jsx';
import IdeasScreen from './(tabs)/ideas.jsx';
import { useAuth } from '@clerk/clerk-expo';
import AuthRoutesLayout from './(auth)/_layout.jsx';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Projects') iconName = 'folder';
          else if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'All Work') iconName = 'list';
          else if (route.name === 'Ideas') iconName = 'bulb';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="All Work" component={AllWorkScreen} />
      <Tab.Screen name="Ideas" component={IdeasScreen} />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
          <ThemeProvider>
            <OrganizationProviderWrapper>
              <RootLayoutInner />
            </OrganizationProviderWrapper>
          </ThemeProvider>
        </ClerkProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function RootLayoutInner() {
  const { isSignedIn, isLoaded } = useAuth();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Initialize push notifications
  React.useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await PushNotificationService.registerForPushNotificationsAsync();
        PushNotificationService.setupNotificationListeners();
        
        // Show Expo Go limitations info if running in Expo Go
        if (PushNotificationService.isRunningInExpoGo()) {
          console.log('Running in Expo Go - Local notifications only');
        }
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
        // Don't show error alert for Expo Go - it's expected
        if (!PushNotificationService.isRunningInExpoGo()) {
          console.log('Push notification initialization failed');
        }
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      PushNotificationService.cleanup();
    };
  }, []);

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <AuthRoutesLayout />;
  }

  return (
    <AppProviders>
      {/* Animated background for Drawer */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 320, zIndex: 0 }} pointerEvents="none">
        {/* Optionally add animated shapes or opacity here for more effect */}
      </View>
      <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            backgroundColor: colors.background,
            width: 320,
          },
          drawerActiveTintColor: colors.coral,
          drawerInactiveTintColor: colors.textSecondary,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      >
        <Drawer.Screen name="Main" component={MainTabs} options={{ title: 'Main' }} />
        <Drawer.Screen name="Organization" component={OrganizationManagement} />
        <Drawer.Screen name="Sprints" component={SprintsScreen} />
        <Drawer.Screen name="Notifications" component={NotificationScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </AppProviders>
  );
}

function AppProviders({ children }) {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'anonymous';
  return (
    <OrganizationProvider userEmail={userEmail}>
      <IdeaProvider userEmail={userEmail}>
        {children}
      </IdeaProvider>
    </OrganizationProvider>
  );
}
