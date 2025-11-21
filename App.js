import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

// Auth Screens
import LoginScreen from './screens/LoginScreen';

// Customer Screens
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/customer/CartScreen';
import OrdersListScreen from './screens/customer/OrdersListScreen';
import ProfileScreen from './screens/ProfileScreen';

// Driver Screens
import DriverDashboardScreen from './screens/driver/DriverDashboardScreen';
import DeliveriesListScreen from './screens/driver/DeliveriesListScreen';
import EarningsScreen from './screens/driver/EarningsScreen';
import ActiveDeliveryScreen from './screens/driver/ActiveDeliveryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Customer Tab Navigator (Blue Theme)
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
        tabBarActiveTintColor: '#0c1697',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0c1697',
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
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersListScreen}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Driver Tabs (Inner Navigator)
function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'Deliveries') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0c1697',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0c1697',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DriverDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesListScreen}
        options={{ title: 'Deliveries' }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Driver Stack Navigator (Outer Navigator with ActiveDelivery)
function DriverNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0c1697',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DriverTabs"
        component={DriverTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActiveDelivery"
        component={ActiveDeliveryScreen}
        options={{ title: 'Active Delivery' }}
      />
    </Stack.Navigator>
  );
}


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');

      if (token && role) {
        setUserRole(role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1bb4f4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : userRole === 'customer' ? (
        <CustomerNavigator />
      ) : userRole === 'driver' ? (
        <DriverNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
