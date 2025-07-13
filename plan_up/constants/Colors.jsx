/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'; // Blue
const tintColorDark = '#fff';
const coralColor = '#FF6B6B'; // Coral color for focused state

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: coralColor, // Use coral for selected state
    coral: coralColor,
    blue: tintColorLight,
    white: '#fff',
    textSecondary: '#687076',
    border: '#E5E5E5',
    error: '#FF3B30',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: coralColor, // Use coral for selected state
    coral: coralColor,
    blue: tintColorLight,
    white: '#fff',
    textSecondary: '#9BA1A6',
    border: '#2C2C2E',
    error: '#FF453A',
  },
};
