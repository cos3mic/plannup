import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors.jsx';
import { useColorScheme } from 'react-native';
import { Animated, View, Text } from 'react-native';
import { useRef, useEffect } from 'react';
import UserAvatar from '../../components/UserAvatar';

function TabBarIcon({ name, color, focused, size = 24 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.25 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={name} size={focused ? size + 6 : size} color={color} />
    </Animated.View>
  );
}

function TabBarLabel({ label, color, focused }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [focused]);
  return (
    <Animated.Text
      style={{
        color: focused ? Colors.light.coral : color,
        fontWeight: focused ? 'bold' : '600',
        fontSize: focused ? 15 : 12,
        transform: [{ scale: scaleAnim }],
        marginBottom: 2,
      }}
    >
      {label}
    </Animated.Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
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
        headerStyle: {
          backgroundColor: colors.blue,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <UserAvatar />,
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'project') iconName = 'folder';
          else if (route.name === 'dashboard') iconName = 'grid';
          else if (route.name === 'allwork') iconName = 'list';
          else if (route.name === 'ideas') iconName = 'bulb';
          return <TabBarIcon name={iconName} color={color} focused={focused} size={24} />;
        },
        tabBarLabel: ({ color, focused }) => (
          <TabBarLabel label={route.name.charAt(0).toUpperCase() + route.name.slice(1)} color={color} focused={focused} />
        ),
      })}
    />
  );
}
