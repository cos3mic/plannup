import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { useColorScheme } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (isLoaded && !isRedirecting) {
      setIsRedirecting(true);
      
      if (isSignedIn) {
        // User is signed in, go to main app
        router.replace('/(tabs)');
      } else {
        // User is not signed in, show onboarding first
        router.replace('/(onboarding)');
      }
    }
  }, [isSignedIn, isLoaded, isRedirecting]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: colors.background 
    }}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text style={{ marginTop: 16, color: colors.text, fontSize: 16 }}>
        Loading PlanUp...
      </Text>
    </View>
  );
}
