import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

// Test delivery data for map navigation testing
const TEST_DELIVERIES = [
  {
    id: 9999,
    status: 'ASSIGNED',
    status_display: 'Assigned',
    order: {
      id: 1001,
      order_number: 'TEST-001',
      delivery_address_line1: '14 Pendennis Road, Borrowdale',
      delivery_city: 'Harare',
      delivery_postal_code: '',
      customer_name: 'Test Customer',
      guest_name: null,
      contact_phone: '+263 77 123 4567',
      total_amount: '25.00',
      payment_method_display: 'Cash on Delivery',
    },
    pickup_address: 'Core Canteen, Sam Nujoma Street, Harare CBD',
    destination_coords: {
      latitude: -17.7578,
      longitude: 31.0856,
    },
    pickup_coords: {
      latitude: -17.8292,
      longitude: 31.0522,
    },
  },
  {
    id: 9998,
    status: 'IN_TRANSIT',
    status_display: 'In Transit',
    order: {
      id: 1002,
      order_number: 'TEST-002',
      delivery_address_line1: '25 Crowhill Road, Borrowdale Brook',
      delivery_city: 'Harare',
      delivery_postal_code: '',
      customer_name: 'Jane Moyo',
      guest_name: null,
      contact_phone: '+263 71 987 6543',
      total_amount: '45.50',
      payment_method_display: 'EcoCash',
    },
    pickup_address: 'Core Canteen, Julius Nyerere Way, Harare CBD',
    destination_coords: {
      latitude: -17.7612,
      longitude: 31.0934,
    },
    pickup_coords: {
      latitude: -17.8317,
      longitude: 31.0478,
    },
  },
];

export default function DeliveriesListScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('active'); // active, completed, all
  const [useTestData, setUseTestData] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, [filter, useTestData]);

  const loadDeliveries = async () => {
    // Use test data for driver@test.com or when useTestData is enabled
    if (useTestData) {
      let filteredTestData = TEST_DELIVERIES;
      if (filter === 'active') {
        filteredTestData = TEST_DELIVERIES.filter(d =>
          ['ASSIGNED', 'ACCEPTED', 'IN_TRANSIT'].includes(d.status)
        );
      } else if (filter === 'completed') {
        filteredTestData = TEST_DELIVERIES.filter(d =>
          ['DELIVERED', 'CANCELLED'].includes(d.status)
        );
      }
      setDeliveries(filteredTestData);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const userEmail = await AsyncStorage.getItem('userEmail');

      // Auto-enable test data for driver@test.com
      if (userEmail === 'driver@test.com') {
        setUseTestData(true);
        return;
      }

      const response = await fetch(`${config.apiUrl}/driver/deliveries/?filter=${filter}`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveries(data.deliveries || data);
      } else {
        console.error('Failed to load deliveries: HTTP', response.status);
        setDeliveries([]);
      }
    } catch (error) {
      console.error('Failed to load deliveries:', error);
      setDeliveries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const getStatusColor = (status) => {
    const colors = {
      ASSIGNED: '#f39c12',
      ACCEPTED: '#3498db',
      IN_TRANSIT: '#9b59b6',
      DELIVERED: '#27ae60',
      CANCELLED: '#e74c3c',
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ASSIGNED: 'list-circle',
      ACCEPTED: 'checkmark-circle',
      IN_TRANSIT: 'car',
      DELIVERED: 'checkmark-done-circle',
      CANCELLED: 'close-circle',
    };
    return icons[status] || 'help-circle';
  };

  const renderDeliveryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deliveryCard}
      onPress={() => {
        if (item.status !== 'DELIVERED' && item.status !== 'CANCELLED') {
          navigation.navigate('ActiveDelivery', { delivery: item });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{item.status_display || item.status}</Text>
        </View>
        <Text style={styles.orderNumber}>#{item.order.order_number}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={18} color="#e74c3c" />
          <Text style={styles.infoText} numberOfLines={2}>
            {item.order.delivery_address_line1}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person" size={18} color="#3498db" />
          <Text style={styles.infoText}>
            {item.order.customer_name || item.order.guest_name}
          </Text>
        </View>

        {item.order.contact_phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#0c1697" />
            <Text style={styles.infoText}>{item.order.contact_phone}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="cash" size={18} color="#f39c12" />
          <Text style={styles.infoText}>
            ${item.order.total_amount} - {item.order.payment_method_display}
          </Text>
        </View>
      </View>

      {item.status !== 'DELIVERED' && item.status !== 'CANCELLED' && (
        <View style={styles.cardFooter}>
          <Ionicons name="chevron-forward" size={20} color="#0c1697" />
          <Text style={styles.viewDetailsText}>View Details</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const FilterButton = ({ label, value, icon }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={filter === value ? '#fff' : '#0c1697'}
      />
      <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0c1697" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Test Mode Toggle */}
      <TouchableOpacity
        style={[styles.testModeToggle, useTestData && styles.testModeActive]}
        onPress={() => setUseTestData(!useTestData)}
      >
        <Ionicons
          name={useTestData ? 'flask' : 'flask-outline'}
          size={18}
          color={useTestData ? '#fff' : '#f39c12'}
        />
        <Text style={[styles.testModeText, useTestData && styles.testModeTextActive]}>
          {useTestData ? 'Test Mode ON' : 'Enable Test Mode'}
        </Text>
      </TouchableOpacity>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterButton label="Active" value="active" icon="flash" />
        <FilterButton label="Completed" value="completed" icon="checkmark-circle" />
        <FilterButton label="All" value="all" icon="list" />
      </View>

      {/* Deliveries List */}
      <FlatList
        data={deliveries}
        renderItem={renderDeliveryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No deliveries found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'active'
                ? 'You have no active deliveries'
                : 'No deliveries in this category'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  testModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f39c12',
  },
  testModeActive: {
    backgroundColor: '#f39c12',
  },
  testModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginLeft: 8,
  },
  testModeTextActive: {
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0c1697',
  },
  filterButtonActive: {
    backgroundColor: '#0c1697',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0c1697',
    marginLeft: 4,
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c1697',
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
