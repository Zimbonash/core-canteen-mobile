import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function EventsScreen() {
  const upcomingEvents = [
    {
      title: 'Wine Tasting Evening',
      date: 'Friday, December 15, 2025',
      time: '7:00 PM - 10:00 PM',
      price: '$45 per person',
      badge: '🍷 Upcoming',
    },
    {
      title: 'Cooking Masterclass',
      date: 'Saturday, December 16, 2025',
      time: '2:00 PM - 5:00 PM',
      price: '$75 per person',
      badge: '⚠️ Limited Seats',
    },
    {
      title: 'Live Jazz Night',
      date: 'Every Friday',
      time: '8:00 PM - 11:00 PM',
      price: 'No cover charge',
      badge: '🎵 Weekly',
    },
  ];

  const packages = [
    {
      name: 'Silver',
      price: '$500',
      features: ['Up to 25 guests', '3-course menu', 'Soft beverages', 'Basic decorations'],
    },
    {
      name: 'Gold',
      price: '$1,200',
      features: ['Up to 50 guests', '4-course menu', 'Open bar', 'Custom decorations', 'DJ service'],
      popular: true,
    },
    {
      name: 'Platinum',
      price: '$2,500',
      features: ['Up to 100 guests', '5-course menu', 'Premium bar', 'Luxury decorations', 'Live band'],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events & Celebrations</Text>
        <Text style={styles.headerSubtitle}>Make your occasion unforgettable</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>

          {upcomingEvents.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>{event.badge}</Text>
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDetail}>📅 {event.date}</Text>
              <Text style={styles.eventDetail}>⏰ {event.time}</Text>
              <Text style={styles.eventPrice}>{event.price}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Event Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Packages</Text>

          {packages.map((pkg, index) => (
            <View
              key={index}
              style={[styles.packageCard, pkg.popular && styles.packageCardPopular]}
            >
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>⭐ Most Popular</Text>
                </View>
              )}
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packagePrice}>{pkg.price}</Text>
              <Text style={styles.packagePriceLabel}>/event</Text>

              {pkg.features.map((feature, idx) => (
                <Text key={idx} style={styles.packageFeature}>
                  ✓ {feature}
                </Text>
              ))}

              <TouchableOpacity
                style={[styles.selectButton, pkg.popular && styles.selectButtonPopular]}
              >
                <Text style={[styles.selectButtonText, pkg.popular && styles.selectButtonTextPopular]}>
                  Select Package
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Event Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Types</Text>

          <View style={styles.eventTypesGrid}>
            {['💒 Weddings', '💼 Corporate', '🎂 Birthdays', '🎁 Special Occasions'].map(
              (type, index) => (
                <View key={index} style={styles.eventTypeCard}>
                  <Text style={styles.eventTypeText}>{type}</Text>
                </View>
              )
            )}
          </View>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  eventCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  eventBadge: {
    backgroundColor: '#1bb4f4',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  eventDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1bb4f4',
    marginTop: 8,
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#1bb4f4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  packageCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  packageCardPopular: {
    borderColor: '#1bb4f4',
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: '#1bb4f4',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1bb4f4',
    textAlign: 'center',
  },
  packagePriceLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  packageFeature: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1bb4f4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  selectButtonPopular: {
    backgroundColor: '#1bb4f4',
  },
  selectButtonText: {
    color: '#1bb4f4',
    fontSize: 16,
    fontWeight: '600',
  },
  selectButtonTextPopular: {
    color: '#fff',
  },
  eventTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  eventTypeCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  eventTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
