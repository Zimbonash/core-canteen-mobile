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

export default function OrdersListScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('active'); // active, completed, all

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiUrl}/orders/?filter=${filter}`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      CONFIRMED: '#3498db',
      PROCESSING: '#9b59b6',
      READY: '#27ae60',
      DISPATCHED: '#1bb4f4',
      DELIVERED: '#27ae60',
      CANCELLED: '#e74c3c',
    };
    return colors[status] || '#666';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: 'time',
      CONFIRMED: 'checkmark-circle',
      PROCESSING: 'restaurant',
      READY: 'checkmark-done-circle',
      DISPATCHED: 'car',
      DELIVERED: 'checkmark-done-circle',
      CANCELLED: 'close-circle',
    };
    return icons[status] || 'help-circle';
  };

  const canTrackOrder = (order) => {
    return (
      order.order_type === 'DELIVERY' &&
      ['CONFIRMED', 'PROCESSING', 'READY', 'DISPATCHED'].includes(order.status)
    );
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        if (canTrackOrder(item)) {
          navigation.navigate('TrackOrder', { orderId: item.id });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{item.status_display || item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons
            name={item.order_type === 'DELIVERY' ? 'bicycle' : 'bag-handle'}
            size={18}
            color="#1bb4f4"
          />
          <Text style={styles.infoText}>{item.order_type_display}</Text>
        </View>

        {item.items && item.items.length > 0 && (
          <View style={styles.itemsList}>
            {item.items.slice(0, 2).map((orderItem, index) => (
              <Text key={index} style={styles.itemText}>
                {orderItem.quantity}x {orderItem.menu_item_name}
              </Text>
            ))}
            {item.items.length > 2 && (
              <Text style={styles.moreItemsText}>
                +{item.items.length - 2} more items
              </Text>
            )}
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${item.total_amount}</Text>
        </View>
      </View>

      {canTrackOrder(item) && (
        <View style={styles.cardFooter}>
          <Ionicons name="location" size={20} color="#1bb4f4" />
          <Text style={styles.trackText}>Track Order</Text>
          <Ionicons name="chevron-forward" size={20} color="#1bb4f4" />
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
        size={18}
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
        <ActivityIndicator size="large" color="#1bb4f4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterButton label="Active" value="active" icon="flash" />
        <FilterButton label="Past" value="completed" icon="checkmark-circle" />
        <FilterButton label="All" value="all" icon="list" />
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'active'
                ? "You don't have any active orders"
                : 'No orders in this category'}
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.browseButtonText}>Browse Menu</Text>
            </TouchableOpacity>
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
  orderCard: {
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  cardContent: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  itemsList: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  moreItemsText: {
    fontSize: 12,
    color: '#1bb4f4',
    fontStyle: 'italic',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  trackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1bb4f4',
    marginLeft: 8,
    marginRight: 4,
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
  browseButton: {
    marginTop: 20,
    backgroundColor: '#1bb4f4',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
