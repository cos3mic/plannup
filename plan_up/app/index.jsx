import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../constants/Colors.jsx';
import { useColorScheme } from 'react-native';
