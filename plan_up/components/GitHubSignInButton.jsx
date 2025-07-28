import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export function GitHubSignInButton({ mode = 'sign-in' }) {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_github' });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      }
    } catch (err) {
      console.error('GitHub OAuth error:', err);
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
        <>
          <Image source={{ uri: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }} style={styles.icon} />
          <Text style={styles.buttonText}>
            {mode === 'sign-up' ? 'Sign up with GitHub' : 'Sign in with GitHub'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#24292F',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
}); 