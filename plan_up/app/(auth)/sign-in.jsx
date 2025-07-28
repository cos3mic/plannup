import { View, StyleSheet, Dimensions, Text } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { GitHubSignInButton } from '../../components/GitHubSignInButton';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  return (
    <LinearGradient
      colors={["#a18cd1", "#fbc2eb"]}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.centered}>
        <View style={styles.card}>
          <Text style={styles.headline}>Join PlanUp today for better project management</Text>
          <Text style={styles.subheadline}>Sign in with your account</Text>
          <GoogleSignInButton mode="sign-in" />
          <GitHubSignInButton mode="sign-in" />
        </View>
      </View>
    </LinearGradient>
  );
}

SignInScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C47B6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
  },
}); 