/**
 * CoreCanteen Mobile App Configuration
 *
 * IMPORTANT: Update API_BASE_URL based on your environment
 */

// ========================================
// API Configuration
// ========================================

/**
 * For iOS Simulator: Use your computer's local IP address
 * For Android Emulator: Use 10.0.2.2
 * For Physical Devices: Use your computer's local network IP
 *
 * How to find your IP:
 * - Windows: Run "ipconfig" in Command Prompt, look for IPv4 Address
 * - Mac/Linux: Run "ifconfig" in Terminal, look for inet address
 *
 * Examples:
 * - Local development: 'http://192.168.1.5:8000'
 * - Android emulator: 'http://10.0.2.2:8000'
 * - iOS Simulator: 'http://YOUR_LOCAL_IP:8000'
 * - Production: 'https://api.corecanteen.co.zw'
 */

// CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS
// Your current IP: 172.16.80.45 (found via ipconfig)
const API_BASE_URL = 'http://172.16.80.45:8000';

// ========================================
// Exports
// ========================================

export const config = {
  apiUrl: `${API_BASE_URL}/api`,
  apiBaseUrl: API_BASE_URL,

  // App Information
  appName: 'CoreCanteen',
  appVersion: '1.0.0',

  // Feature Flags
  features: {
    realTimeTracking: true,
    gpsTracking: true,
    pushNotifications: false, // Coming soon
  },

  // Map Configuration (Zimbabwe)
  map: {
    defaultRegion: {
      latitude: -19.0154,
      longitude: 29.1549,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    },
    boundaries: {
      southwest: { latitude: -22.4, longitude: 25.2 },
      northeast: { latitude: -15.6, longitude: 33.1 },
    },
  },

  // Polling Intervals (milliseconds)
  polling: {
    badges: 30000,        // 30 seconds
    driverLocation: 10000, // 10 seconds
    orderStatus: 15000,    // 15 seconds
  },
};

export default config;
