/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Jira-inspired blue palette
const primaryBlue = '#0052CC'; // Jira blue
const primaryBlueDark = '#4A9EFF'; // Lighter blue for dark mode
const accentBlue = '#2684FF'; // Atlassian accent
const lightBlue = '#E6F0FF';
const backgroundLight = '#F4F5F7';
const backgroundDark = '#0D1117'; // Darker background for better contrast
const borderLight = '#DFE1E6';
const borderDark = '#30363D'; // Lighter border for visibility
const textLight = '#172B4D';
const textDark = '#F0F6FC'; // Brighter text for dark mode
const textSecondaryLight = '#5E6C84';
const textSecondaryDark = '#C9D1D9'; // Brighter secondary text
const errorRed = '#DE350B';
const successGreen = '#36B37E';
const warningYellow = '#FFAB00';

export const Colors = {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primaryBlue,
    icon: accentBlue,
    tabIconDefault: textSecondaryLight,
    tabIconSelected: accentBlue,
    coral: accentBlue, // Use blue for focus/active
    blue: primaryBlue,
    blueAccent: accentBlue,
    blueLight: lightBlue,
    white: '#fff',
    textSecondary: textSecondaryLight,
    border: borderLight,
    error: errorRed,
    success: successGreen,
    warning: warningYellow,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: primaryBlueDark,
    icon: primaryBlueDark,
    tabIconDefault: textSecondaryDark,
    tabIconSelected: primaryBlueDark,
    coral: primaryBlueDark, // Use lighter blue for focus/active
    blue: primaryBlueDark,
    blueAccent: accentBlue,
    blueLight: '#1F2937', // Darker blue background
    white: '#161B22', // Darker white for cards
    textSecondary: textSecondaryDark,
    border: borderDark,
    error: '#FF6B6B', // Brighter error color
    success: '#4ECDC4', // Brighter success color
    warning: '#FFD93D', // Brighter warning color
  },
};
