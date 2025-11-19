import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Auth Screens
import LoginScreen from './screens/LoginScreen';

// Customer Screens (temporarily using existing HomeScreen and MenuScreen)
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Customer Tab Navigator
function CustomerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1bb4f4',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1bb4f4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{ title: 'Browse Menu' }}
      />
      <Tab.Screen
        name="Cart"
        component={PlaceholderScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen
        name="Orders"
        component={PlaceholderScreen}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={PlaceholderScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Driver Tab Navigator
function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'Deliveries') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#28a745',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={PlaceholderScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Deliveries"
        component={PlaceholderScreen}
        options={{ title: 'Deliveries' }}
      />
      <Tab.Screen
        name="Earnings"
        component={PlaceholderScreen}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen
        name="Profile"
        component={PlaceholderScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Placeholder screen for screens not yet implemented
function PlaceholderScreen({ route }) {
  return (
    <View style={styles.placeholderContainer}>
      <Ionicons name="construct-outline" size={80} color="#ccc" />
      <text style={styles.placeholderText}>
        {route.name} Screen
      </text>
      <text style={styles.placeholderSubtext}>
        Coming soon...
      </text>
    </View>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check authentication on app launch
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      const userData = await AsyncStorage.getItem('userData');

      if (token && role && userData) {
        setUserRole(role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoginSuccess(role, user) {
    setUserRole(role);
    setIsAuthenticated(true);
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1bb4f4" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // Authentication Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // Role-based Navigation
        userRole === 'customer' ? (
          <CustomerNavigator />
        ) : userRole === 'driver' ? (
          <DriverNavigator />
        ) : (
          // Fallback to login if role is unknown
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
          </Stack.Navigator>
        )
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});
