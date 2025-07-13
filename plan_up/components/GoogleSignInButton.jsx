import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export function GoogleSignInButton({ mode = 'sign-in' }) {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        // Small delay to ensure session is properly set
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      }
    } catch (err) {
      console.error('Google OAuth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, isLoading && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          {mode === 'sign-up' ? 'Sign up with Google' : 'Sign in with Google'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 