import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || isLoading) return;
    
    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        // Small delay to ensure session is properly set
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        style={styles.input}
        editable={!isLoading}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
        style={styles.input}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={onSignInPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
      <GoogleSignInButton mode="sign-in" />
      <View style={styles.row}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#0a7ea4', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 12 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  row: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  link: { color: '#0a7ea4', marginLeft: 4, fontWeight: 'bold' },
}); 