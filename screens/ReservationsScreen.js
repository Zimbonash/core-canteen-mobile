import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function ReservationsScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
  });

  const handleSubmit = () => {
    if (!formData.firstName || !formData.email || !formData.phone || !formData.date || !formData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Reservation Submitted',
      `Thank you, ${formData.firstName}! We'll send you a confirmation email shortly.`,
      [{ text: 'OK', onPress: () => setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
      })}]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Make a Reservation</Text>
        <Text style={styles.headerSubtitle}>Reserve your table</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>📅 Book Your Table</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="John"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Doe"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholder="MM/DD/YYYY"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <TextInput
              style={styles.input}
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
              placeholder="7:00 PM"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Guests *</Text>
            <TextInput
              style={styles.input}
              value={formData.guests}
              onChangeText={(text) => setFormData({ ...formData, guests: text })}
              placeholder="2"
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Complete Reservation</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Restaurant Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoText}>123 Restaurant Street</Text>
            <Text style={styles.infoText}>City Center, Downtown</Text>
            <Text style={styles.infoText}>State, ZIP 12345</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoLink}>+1 234 567 8900</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Hours</Text>
            <Text style={styles.infoText}>Mon - Thu: 11:00 AM - 10:00 PM</Text>
            <Text style={styles.infoText}>Fri - Sat: 11:00 AM - 11:00 PM</Text>
            <Text style={styles.infoText}>Sunday: 10:00 AM - 9:00 PM</Text>
          </View>
        </View>

        {/* Policies */}
        <View style={styles.policiesSection}>
          <Text style={styles.policiesTitle}>🛡️ Reservation Policies</Text>
          <Text style={styles.policyItem}>✓ Reservations up to 30 days in advance</Text>
          <Text style={styles.policyItem}>✓ We hold reservations for 15 minutes</Text>
          <Text style={styles.policyItem}>✓ Cancel 24 hours in advance</Text>
          <Text style={styles.policyItem}>✓ For 9+ guests, please call us</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ccc',
  },
  content: {
    flex: 1,
  },
  formSection: {
    padding: 20,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1bb4f4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoLink: {
    fontSize: 14,
    color: '#1bb4f4',
    lineHeight: 20,
  },
  policiesSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 30,
  },
  policiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  policyItem: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 20,
  },
});
