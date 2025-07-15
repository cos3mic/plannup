# PlanUp - Project Management App

A React Native project management application built with Expo and Clerk authentication.

## Features

- 🔐 Secure authentication with Clerk
- 📱 Cross-platform mobile app (iOS, Android)
- 🎨 Dark/Light mode support
- 📊 Activity tracking and management
- 🔍 Search functionality
- 📋 Issue creation and management
- 🎯 Sprint planning
- 📈 Dashboard and reports

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plan_up
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your Clerk publishable key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on specific platforms**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Project Structure

```
plan_up/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (onboarding)/      # Onboarding flow
│   ├── (tabs)/           # Main app tabs
│   └── _layout.jsx       # Root layout
├── components/            # Reusable components
├── constants/            # App constants (colors, etc.)
├── hooks/               # Custom React hooks
├── assets/              # Images, fonts, etc.
└── package.json         # Dependencies and scripts
```

## Key Components

- **ErrorBoundary**: Handles app crashes gracefully
- **UserAvatar**: User profile component with loading states
- **CreateIssueModal**: Modal for creating new issues
- **SwipeableActivityItem**: Swipeable activity items with actions
- **SignOutButton**: Secure sign-out functionality

## Environment Variables

Make sure to set up the following environment variables:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

## Development

- **Linting**: `npm run lint`
- **TypeScript**: The project uses TypeScript for better type safety
- **ESLint**: Configured with Expo's recommended settings

## Security

- API keys are stored in environment variables
- Authentication handled by Clerk
- No hardcoded sensitive information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
