import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Core Canteen</Text>
            <Text style={styles.heroSubtitle}>Experience culinary excellence</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.buttonText}>View Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureTitle}>Premium Quality</Text>
              <Text style={styles.featureText}>
                Finest ingredients from local suppliers
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>👨‍🍳</Text>
              <Text style={styles.featureTitle}>Expert Team</Text>
              <Text style={styles.featureText}>
                Experienced chefs and dedicated staff
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🎉</Text>
              <Text style={styles.featureTitle}>Perfect Events</Text>
              <Text style={styles.featureText}>
                Unforgettable experiences for any occasion
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Reservations')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Make a Reservation</Text>
              <Text style={styles.actionText}>Book your table now</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Events')}
          >
            <Text style={styles.actionIcon}>🎊</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Events</Text>
              <Text style={styles.actionText}>Check upcoming events</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.actionIcon}>📞</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Contact Us</Text>
              <Text style={styles.actionText}>Get in touch with us</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Visit Us</Text>
          <Text style={styles.infoText}>📍 123 Restaurant Street</Text>
          <Text style={styles.infoText}>📞 +1 234 567 8900</Text>
          <Text style={styles.infoText}>⏰ Mon-Sun: 10:00 AM - 11:00 PM</Text>
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
  hero: {
    height: 300,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1bb4f4',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#1bb4f4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  featuresGrid: {
    gap: 15,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  actionArrow: {
    fontSize: 24,
    color: '#1bb4f4',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1bb4f4',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
});
