import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

export default function EarningsScreen() {
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
    deliveries_today: 0,
    deliveries_week: 0,
    deliveries_month: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiUrl}/driver/earnings/`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
      }
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEarnings();
  };

  const EarningCard = ({ title, amount, deliveries, icon, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={32} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
      <Text style={styles.deliveries}>{deliveries} deliveries</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Ionicons name="wallet" size={60} color="#0c1697" />
        <Text style={styles.headerTitle}>Your Earnings</Text>
        <Text style={styles.headerSubtitle}>Track your income</Text>
      </View>

      <EarningCard
        title="Today"
        amount={earnings.today}
        deliveries={earnings.deliveries_today}
        icon="calendar-outline"
        color="#3498db"
      />

      <EarningCard
        title="This Week"
        amount={earnings.week}
        deliveries={earnings.deliveries_week}
        icon="calendar"
        color="#9b59b6"
      />

      <EarningCard
        title="This Month"
        amount={earnings.month}
        deliveries={earnings.deliveries_month}
        icon="calendar-sharp"
        color="#e67e22"
      />

      <EarningCard
        title="Total Earnings"
        amount={earnings.total}
        deliveries={earnings.deliveries_today + earnings.deliveries_week + earnings.deliveries_month}
        icon="trophy"
        color="#0c1697"
      />

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={24} color="#0c1697" />
        <Text style={styles.infoText}>
          Earnings are updated in real-time after each completed delivery. Payment is processed weekly.
        </Text>
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
    padding: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0c1697',
    marginBottom: 5,
  },
  deliveries: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    lineHeight: 20,
  },
});
