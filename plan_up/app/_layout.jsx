import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';

// Import screens
import HomeScreen from './(tabs)/index.jsx';
import ProjectScreen from './(tabs)/project.jsx';
import DashboardScreen from './(tabs)/dashboard.jsx';
import AllWorkScreen from './(tabs)/allwork.jsx';
import SprintsScreen from './(tabs)/sprints.jsx';
import NotificationScreen from './(tabs)/notification.jsx';
import SettingsScreen from './(tabs)/settings.jsx';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
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
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Projects" component={ProjectScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="All Work" component={AllWorkScreen} />
    </Tab.Navigator>
  );
}

export default function AppLayout() {
  const publishableKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <Drawer.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: true,
          }}
        >
          <Drawer.Screen name="Main" component={MainTabs} options={{ title: 'Main' }} />
          <Drawer.Screen name="Sprints" component={SprintsScreen} />
          <Drawer.Screen name="Notifications" component={NotificationScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
