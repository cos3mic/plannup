import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export const SignOutButton = () => {
  const { signOut } = useClerk();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to sign-in page
      Linking.openURL(Linking.createURL('/sign-in'));
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };
  
  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.buttonText}>Sign out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 