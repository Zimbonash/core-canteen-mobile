import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
// import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

export default function TrackOrderScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const pollingInterval = useRef(null);

  useEffect(() => {
    loadOrderDetails();
    startPolling();

    return () => {
      stopPolling();
    };
  }, []);

  const startPolling = () => {
    // Poll every 10 seconds for real-time updates
    pollingInterval.current = setInterval(() => {
      loadOrderDetails();
    }, 10000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const loadOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      // Get order details
      const orderResponse = await fetch(`${config.apiUrl}/orders/${orderId}/`, {
        headers: { 'Authorization': `Token ${token}` },
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrder(orderData);

        // If order has delivery, get delivery details with driver location
        if (orderData.has_delivery) {
          const deliveryResponse = await fetch(
            `${config.apiUrl}/orders/${orderId}/delivery/`,
            { headers: { 'Authorization': `Token ${token}` } }
          );

          if (deliveryResponse.ok) {
            const deliveryData = await deliveryResponse.json();
            setDelivery(deliveryData);

            // Get driver's current location
            if (deliveryData.driver && deliveryData.status === 'IN_TRANSIT') {
              setDriverLocation({
                latitude: deliveryData.driver.current_latitude || -17.8252,
                longitude: deliveryData.driver.current_longitude || 31.0335,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusStep = (status) => {
    const steps = {
      PENDING: 0,
      CONFIRMED: 1,
      PROCESSING: 2,
      READY: 3,
      DISPATCHED: 4,
      DELIVERED: 5,
    };
    return steps[status] || 0;
  };

  const callDriver = () => {
    if (delivery?.driver?.driver_phone) {
      Linking.openURL(`tel:${delivery.driver.driver_phone}`);
    }
  };

  const callRestaurant = () => {
    // Replace with actual restaurant phone from config
    Linking.openURL(`tel:+263771234567`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1bb4f4" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Order not found</Text>
      </View>
    );
  }

  const currentStep = getOrderStatusStep(order.status);
  const destination = { latitude: -17.8252, longitude: 31.0335 }; // Parse from address in production

  return (
    <ScrollView style={styles.container}>
      {/* Order Status Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.cardTitle}>Order Status</Text>

        <View style={styles.timeline}>
          {['Confirmed', 'Processing', 'Ready', 'Dispatched', 'Delivered'].map((step, index) => (
            <View key={step} style={styles.timelineStep}>
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIcon,
                    index <= currentStep - 1 && styles.timelineIconActive,
                  ]}
                >
                  {index < currentStep - 1 ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <View style={styles.timelineDot} />
                  )}
                </View>
                {index < 4 && (
                  <View
                    style={[
                      styles.timelineLine,
                      index < currentStep - 1 && styles.timelineLineActive,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.timelineLabel,
                  index <= currentStep - 1 && styles.timelineLabelActive,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Live Tracking (shown when driver is in transit) */}
      {delivery && delivery.status === 'IN_TRANSIT' && driverLocation && (
        <View style={styles.mapCard}>
          <Text style={styles.cardTitle}>Live Tracking</Text>
          <View style={styles.trackingInfo}>
            <View style={styles.trackingHeader}>
              <Ionicons name="car" size={40} color="#0c1697" />
              <Text style={styles.trackingStatus}>Driver is on the way!</Text>
            </View>
            <View style={styles.etaCardAlt}>
              <Ionicons name="time" size={24} color="#0c1697" />
              <View>
                <Text style={styles.etaLabel}>Estimated Arrival</Text>
                <Text style={styles.etaText}>
                  {delivery.estimated_delivery_time || '15-20 min'}
                </Text>
              </View>
            </View>
            <View style={styles.locationCard}>
              <Ionicons name="location" size={20} color="#0c1697" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Driver Location</Text>
                <Text style={styles.coordText}>
                  {driverLocation.latitude.toFixed(6)}, {driverLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
            <Text style={styles.mapNote}>
              Map view available in native build. Use EAS Build for full map features.
            </Text>
          </View>
        </View>
      )}

      {/* Driver Info (when assigned) */}
      {delivery && delivery.driver && (
        <View style={styles.driverCard}>
          <Text style={styles.cardTitle}>Your Driver</Text>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={32} color="#1bb4f4" />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{delivery.driver.driver_name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#f39c12" />
                <Text style={styles.ratingText}>
                  {delivery.driver.average_rating?.toFixed(1) || '5.0'}
                </Text>
                <Text style={styles.deliveryCount}>
                  ({delivery.driver.total_deliveries} deliveries)
                </Text>
              </View>
              {delivery.driver.vehicle_make_model && (
                <Text style={styles.vehicleText}>
                  <Ionicons name="car-outline" size={14} />
                  {' '}{delivery.driver.vehicle_make_model} - {delivery.driver.vehicle_registration}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.callButton} onPress={callDriver}>
              <Ionicons name="call" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Order Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Order Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Number:</Text>
          <Text style={styles.detailValue}>#{order.order_number}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Type:</Text>
          <Text style={styles.detailValue}>{order.order_type_display}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.detailValue}>${order.total_amount}</Text>
        </View>

        {order.order_type === 'DELIVERY' && (
          <>
            <View style={styles.divider} />
            <Text style={styles.subTitle}>Delivery Address</Text>
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={20} color="#e74c3c" />
              <View style={styles.addressText}>
                <Text style={styles.addressLine}>{order.delivery_address_line1}</Text>
                {order.delivery_address_line2 && (
                  <Text style={styles.addressLine}>{order.delivery_address_line2}</Text>
                )}
                <Text style={styles.addressLine}>
                  {order.delivery_city}, {order.delivery_postal_code}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.divider} />
        <Text style={styles.subTitle}>Items</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.menu_item_name}</Text>
            <Text style={styles.itemPrice}>${item.subtotal}</Text>
          </View>
        ))}
      </View>

      {/* Contact Support */}
      <View style={styles.supportCard}>
        <TouchableOpacity style={styles.supportButton} onPress={callRestaurant}>
          <Ionicons name="call-outline" size={24} color="#1bb4f4" />
          <Text style={styles.supportText}>Contact Restaurant</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  timeline: {
    paddingLeft: 10,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  timelineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconActive: {
    backgroundColor: '#1bb4f4',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginTop: 2,
  },
  timelineLineActive: {
    backgroundColor: '#1bb4f4',
  },
  timelineLabel: {
    fontSize: 16,
    color: '#999',
    paddingTop: 4,
  },
  timelineLabelActive: {
    color: '#333',
    fontWeight: '600',
  },
  mapCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  trackingInfo: {
    paddingVertical: 10,
  },
  trackingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trackingStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  etaCardAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  etaLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  etaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
  },
  locationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  coordText: {
    fontSize: 12,
    color: '#666',
  },
  mapNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  driverCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  deliveryCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  vehicleText: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1bb4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    marginLeft: 10,
    flex: 1,
  },
  addressLine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  supportCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 30,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  supportText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1bb4f4',
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
});
