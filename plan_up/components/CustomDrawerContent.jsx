import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// If you have react-native-linear-gradient, you can use it. Otherwise, use a View with colored shapes.
// import LinearGradient from 'react-native-linear-gradient';

export default function CustomDrawerContent(props) {
  return (
    <View style={styles.container}>
      {/* Gradient or shape background */}
      {/* <LinearGradient colors={["#f8fafc", "#ffe0e9", "#e0f7fa", "#fffbe0"]} style={StyleSheet.absoluteFill} /> */}
      {/* Fallback: colored shapes */}
      <View style={styles.bgShape1} />
      <View style={styles.bgShape2} />
      <View style={styles.bgShape3} />
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  bgShape1: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 180,
    height: 180,
    backgroundColor: '#ffe0e9',
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
    backgroundColor: '#e0f7fa',
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
    backgroundColor: '#fffbe0',
    borderRadius: 50,
    opacity: 0.4,
    zIndex: 0,
  },
}); 