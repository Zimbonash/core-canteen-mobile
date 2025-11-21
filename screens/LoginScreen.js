import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import config from '../config';

const API_URL = config.apiUrl;

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    console.log('Starting login...', { email: email.toLowerCase().trim(), apiUrl: API_URL });

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      console.log('Sending login request to:', `${API_URL}/auth/login/`);

      // Login API call
      const loginResponse = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Login response status:', loginResponse.status);

      const loginData = await loginResponse.json();
      console.log('Login response data:', loginData);

      if (!loginResponse.ok) {
        Alert.alert('Login Failed', loginData.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Save token
      await AsyncStorage.setItem('userToken', loginData.token);

      // Get user role
      const roleResponse = await fetch(`${API_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${loginData.token}`,
        },
      });

      const roleData = await roleResponse.json();

      console.log('Role data received:', roleData);
      console.log('Mobile role:', roleData.mobile_role);

      // Check if mobile_role exists, if not default to 'customer'
      const userRole = roleData.mobile_role || 'customer';

      // Save user data and role
      await AsyncStorage.setItem('userData', JSON.stringify(roleData.user));
      await AsyncStorage.setItem('userRole', userRole);

      // Check if user can access mobile app
      if (userRole === 'web_only') {
        Alert.alert(
          'Web Portal Required',
          'Your account type requires access through the web portal. Please visit our website.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Navigate based on role
      onLoginSuccess(userRole, roleData.user);

    } catch (error) {
      console.error('Login error:', error.name, error.message);

      if (error.name === 'AbortError') {
        Alert.alert(
          'Request Timeout',
          'The server took too long to respond.\n\n' +
          'Please check:\n' +
          '1. Django server is running\n' +
          '2. Your device is on the same network\n' +
          `3. API URL is correct: ${API_URL}`
        );
      } else {
        Alert.alert(
          'Connection Error',
          `Failed to connect: ${error.message}\n\n` +
          'Check that:\n' +
          '1. Django server is running\n' +
          '2. IP address is correct in config.js\n' +
          `Current API: ${API_URL}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>CoreCanteen</Text>
        <Text style={styles.subtitle}>Professional Catering Services</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => Alert.alert('Register', 'Please contact your organization administrator or visit our website to create an account.')}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerTextBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>For staff and corporate admins:</Text>
        <Text style={styles.footerLink}>Please use the web portal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  form: {
    padding: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#1bb4f4',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#1bb4f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerTextBold: {
    color: '#1bb4f4',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  footerLink: {
    fontSize: 12,
    color: '#1bb4f4',
    marginTop: 5,
  },
});
