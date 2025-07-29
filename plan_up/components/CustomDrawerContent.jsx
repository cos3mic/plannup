import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Colors } from '../constants/Colors.jsx';
import { useTheme } from '../hooks/useTheme';

export default function CustomDrawerContent(props) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient or shape background */}
      {/* <LinearGradient colors={["#f8fafc", "#ffe0e9", "#e0f7fa", "#fffbe0"]} style={StyleSheet.absoluteFill} /> */}
      {/* Fallback: colored shapes */}
      <View style={[styles.bgShape1, { backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#ffe0e9' }]} />
      <View style={[styles.bgShape2, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#e0f7fa' }]} />
      <View style={[styles.bgShape3, { backgroundColor: colorScheme === 'dark' ? '#4B5563' : '#fffbe0' }]} />
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: 'transparent' }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  bgShape1: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.5,
    zIndex: 0,
  },
  bgShape2: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.5,
    zIndex: 0,
  },
  bgShape3: {
    position: 'absolute',
    top: 120,
    left: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.4,
    zIndex: 0,
  },
}); 