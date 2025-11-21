import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);
            // App will automatically redirect to login screen
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, showChevron = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#0c1697" />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={24} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#0c1697" />
          </View>
        </View>
        <Text style={styles.name}>{user?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.user_type_display || 'Customer'}</Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <MenuItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="location-outline"
            title="Saved Addresses"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <MenuItem
            icon="card-outline"
            title="Payment Methods"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <MenuItem
            icon="language-outline"
            title="Language"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <MenuItem
            icon="chatbubble-outline"
            title="Contact Us"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <MenuItem
            icon="document-text-outline"
            title="Terms & Conditions"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#0c1697',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
