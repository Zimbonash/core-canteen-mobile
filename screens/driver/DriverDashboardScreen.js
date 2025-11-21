import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

export default function DriverDashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    pending_deliveries: 0,
    in_transit: 0,
    completed_today: 0,
    total_earnings_today: 0,
    average_rating: 0,
  });
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      // Get driver stats
      const statsResponse = await fetch(`${config.apiUrl}/driver/stats/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Get active delivery
      const activeResponse = await fetch(`${config.apiUrl}/driver/active-delivery/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setActiveDelivery(activeData.delivery);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const updateDeliveryStatus = async (deliveryId, newStatus, successMessage) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiUrl}/deliveries/${deliveryId}/update-status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        Alert.alert('Success', successMessage);
        loadDashboardData();
      } else {
        Alert.alert('Error', 'Failed to update delivery status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      Alert.alert('Error', 'Failed to update delivery status');
    }
  };

  const handleAcceptDelivery = (delivery) => {
    Alert.alert(
      'Accept Delivery',
      `Accept delivery for order #${delivery.order.order_number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => updateDeliveryStatus(delivery.id, 'ACCEPTED', 'Delivery accepted!'),
        },
      ]
    );
  };

  const handleStartDelivery = (delivery) => {
    Alert.alert(
      'Start Delivery',
      'Have you collected the order and ready to depart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            await updateDeliveryStatus(delivery.id, 'IN_TRANSIT', 'Delivery started!');
            navigation.navigate('ActiveDelivery', { delivery });
          },
        },
      ]
    );
  };

  const handleCompleteDelivery = (delivery) => {
    Alert.alert(
      'Complete Delivery',
      'Have you delivered the order to the customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => updateDeliveryStatus(delivery.id, 'DELIVERED', 'Delivery completed!'),
        },
      ]
    );
  };

  const handleCancelDelivery = (delivery) => {
    Alert.alert(
      'Cancel Delivery',
      'Are you sure you want to cancel this delivery? Please provide a reason.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => updateDeliveryStatus(delivery.id, 'CANCELLED', 'Delivery cancelled'),
        },
      ]
    );
  };

  const StatCard = ({ icon, label, value, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Ionicons name={icon} size={32} color={color} />
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Active Delivery Alert */}
      {activeDelivery && (
        <TouchableOpacity
          style={styles.activeDeliveryCard}
          onPress={() => {
            if (activeDelivery.status === 'IN_TRANSIT') {
              navigation.navigate('ActiveDelivery', { delivery: activeDelivery });
            }
          }}
          activeOpacity={activeDelivery.status === 'IN_TRANSIT' ? 0.7 : 1}
        >
          <View style={styles.deliveryHeader}>
            <View style={styles.bannerIcon}>
              <Ionicons name="navigate-circle" size={40} color="#0c1697" />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.deliveryTitle}>
                {activeDelivery.status === 'ASSIGNED' && 'New Delivery'}
                {activeDelivery.status === 'ACCEPTED' && 'Accepted Delivery'}
                {activeDelivery.status === 'IN_TRANSIT' && 'Active Delivery'}
              </Text>
              <Text style={styles.deliveryText}>
                Order #{activeDelivery.order.order_number}
              </Text>
              <Text style={styles.deliveryText} numberOfLines={1}>
                {activeDelivery.order.delivery_address_line1}
              </Text>
              <Text style={styles.deliveryAmount}>
                ${activeDelivery.order.total_amount}
              </Text>
            </View>
            {activeDelivery.status === 'IN_TRANSIT' && (
              <Ionicons name="chevron-forward" size={24} color="#0c1697" />
            )}
          </View>

          {/* Action Buttons Based on Status */}
          <View style={styles.deliveryActions}>
            {activeDelivery.status === 'ASSIGNED' && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
                  onPress={() => handleAcceptDelivery(activeDelivery)}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => handleCancelDelivery(activeDelivery)}
                >
                  <Ionicons name="close-circle" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Decline</Text>
                </TouchableOpacity>
              </>
            )}

            {activeDelivery.status === 'ACCEPTED' && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.startBtn]}
                  onPress={() => handleStartDelivery(activeDelivery)}
                >
                  <Ionicons name="play-circle" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Start Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => handleCancelDelivery(activeDelivery)}
                >
                  <Ionicons name="close-circle" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {activeDelivery.status === 'IN_TRANSIT' && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.viewMapBtn]}
                  onPress={() => navigation.navigate('ActiveDelivery', { delivery: activeDelivery })}
                >
                  <Ionicons name="map" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>View Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.completeBtn]}
                  onPress={() => handleCompleteDelivery(activeDelivery)}
                >
                  <Ionicons name="checkmark-done-circle" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Complete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="list-outline"
          label="Pending"
          value={stats.pending_deliveries}
          color="#f39c12"
          onPress={() => navigation.navigate('Deliveries')}
        />
        <StatCard
          icon="car-outline"
          label="In Transit"
          value={stats.in_transit}
          color="#0c1697"
          onPress={() => navigation.navigate('Deliveries')}
        />
        <StatCard
          icon="checkmark-circle-outline"
          label="Completed Today"
          value={stats.completed_today}
          color="#0c1697"
          onPress={() => navigation.navigate('Deliveries')}
        />
        <StatCard
          icon="cash-outline"
          label="Today's Earnings"
          value={`$${stats.total_earnings_today?.toFixed(2) || '0.00'}`}
          color="#0c1697"
          onPress={() => navigation.navigate('Earnings')}
        />
      </View>

      {/* Performance Card */}
      <View style={styles.performanceCard}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.performanceRow}>
          <Text style={styles.performanceLabel}>Average Rating</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#f39c12" />
            <Text style={styles.ratingText}>
              {stats.average_rating?.toFixed(1) || '0.0'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Deliveries')}
        >
          <Ionicons name="list" size={24} color="#0c1697" />
          <Text style={styles.actionText}>View All Deliveries</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Earnings')}
        >
          <Ionicons name="stats-chart" size={24} color="#0c1697" />
          <Text style={styles.actionText}>View Earnings</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  activeDeliveryCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bannerContent: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  deliveryText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  deliveryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c1697',
    marginTop: 4,
  },
  deliveryActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  acceptBtn: {
    backgroundColor: '#28a745',
  },
  startBtn: {
    backgroundColor: '#0c1697',
  },
  viewMapBtn: {
    backgroundColor: '#0c1697',
  },
  completeBtn: {
    backgroundColor: '#27ae60',
  },
  cancelBtn: {
    backgroundColor: '#e74c3c',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsGrid: {
    padding: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statContent: {
    marginLeft: 15,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  performanceCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  actionsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});
