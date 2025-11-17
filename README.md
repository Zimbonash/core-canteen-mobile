# core-canteen-mobile

Core Canteen - Restaurant and Events Management System Mobile Application

A mobile application built with Expo React Native for managing restaurant operations and events on the go.

## Features

### Customer Features
- Browse restaurant menu
- Make table reservations
- View and book events
- Order food online
- Track order status
- View event details

### Staff Features
- Manage orders
- Update order status
- View reservations
- Check event attendance
- Manage inventory

### Admin Features
- Dashboard overview
- Manage restaurant operations
- Event management
- User management
- Reports and analytics

## Tech Stack

- **Framework**: Expo React Native
- **Language**: JavaScript/React
- **Platform**: Cross-platform (iOS & Android)
- **API**: RESTful API integration with Core Canteen Web backend

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on physical device)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Zimbonash/core-canteen-mobile.git
cd core-canteen-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

### On Physical Device
1. Install Expo Go app from App Store (iOS) or Play Store (Android)
2. Scan the QR code from the terminal with your device camera
3. The app will open in Expo Go

### On Emulator/Simulator

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Web
```bash
npm run web
```

## API Configuration

The mobile app connects to the Core Canteen Web API. Update the API base URL in your configuration file:

```javascript
// config/api.js
export const API_BASE_URL = 'http://your-domain.com/api/';
```

## Project Structure

```
mobile-app/
├── App.js              # Main app component
├── app.json            # Expo configuration
├── assets/             # Images, fonts, etc.
├── components/         # Reusable components (to be added)
├── screens/            # App screens (to be added)
├── navigation/         # Navigation setup (to be added)
├── services/           # API services (to be added)
├── utils/              # Utility functions (to be added)
└── package.json        # Dependencies
```

## Development

This is an Expo-based React Native app. Key commands:

- `npm start` - Start development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Repository

GitHub: https://github.com/Zimbonash/core-canteen-mobile

## License

This project is part of the Core Canteen system.
