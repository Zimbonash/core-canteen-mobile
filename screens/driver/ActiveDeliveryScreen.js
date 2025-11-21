import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import config from '../../config';

const { height } = Dimensions.get('window');

// Harare coordinates
const HARARE_CBD = { latitude: -17.8292, longitude: 31.0522 };
const BORROWDALE = { latitude: -17.7578, longitude: 31.0856 };

export default function ActiveDeliveryScreen({ route, navigation }) {
  const { delivery: initialDelivery } = route.params;
  const [delivery, setDelivery] = useState(initialDelivery);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const webViewRef = useRef(null);
  const locationSubscription = useRef(null);

  const pickupCoords = delivery.pickup_coords || HARARE_CBD;
  const destinationCoords = delivery.destination_coords || BORROWDALE;

  useEffect(() => {
    requestLocationPermission();
    loadDeliveryDetails();
    fetchRoute();

    return () => {
      stopTracking();
    };
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (currentLocation && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof updateDriverLocation === 'function') {
          updateDriverLocation(${currentLocation.latitude}, ${currentLocation.longitude});
        }
        true;
      `);
    }
  }, [currentLocation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
        startTracking();
      } else {
        setCurrentLocation(pickupCoords);
      }
    } catch (error) {
      console.error('Location permission error:', error);
      setCurrentLocation(pickupCoords);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Get location error:', error);
      setCurrentLocation(pickupCoords);
    }
  };

  const startTracking = async () => {
    if (locationSubscription.current) return;

    setIsTracking(true);
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(newLocation);
        sendLocationUpdate(location.coords);
      }
    );
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      setIsTracking(false);
    }
  };

  const sendLocationUpdate = async (coords) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await fetch(`${config.apiUrl}/driver/update-location/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_id: delivery.id,
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed || 0,
          heading: coords.heading || 0,
          accuracy: coords.accuracy || 0,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to send location update:', error);
    }
  };

  const fetchRoute = async () => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.longitude},${pickupCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRouteCoordinates(coordinates);
      } else {
        setRouteCoordinates([
          [pickupCoords.latitude, pickupCoords.longitude],
          [destinationCoords.latitude, destinationCoords.longitude],
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch route:', error);
      setRouteCoordinates([
        [pickupCoords.latitude, pickupCoords.longitude],
        [destinationCoords.latitude, destinationCoords.longitude],
      ]);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const loadDeliveryDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiUrl}/deliveries/${delivery.id}/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDelivery(data);
      }
    } catch (error) {
      console.error('Failed to load delivery details:', error);
    }
  };

  const updateDeliveryStatus = async (newStatus) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${config.apiUrl}/deliveries/${delivery.id}/update-status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setDelivery(prev => ({ ...prev, status: newStatus, status_display: data.status_display || newStatus }));

        if (newStatus === 'DELIVERED') {
          stopTracking();
          Alert.alert('Success', 'Delivery marked as completed!', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update delivery status');
    }
  };

  const handleAcceptDelivery = () => {
    Alert.alert('Accept Delivery', 'Are you ready to pick up this order?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => updateDeliveryStatus('ACCEPTED') },
    ]);
  };

  const handleStartDelivery = () => {
    Alert.alert('Start Delivery', 'Have you collected the order and ready to depart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start', onPress: () => updateDeliveryStatus('IN_TRANSIT') },
    ]);
  };

  const handleCompleteDelivery = () => {
    Alert.alert('Complete Delivery', 'Have you delivered the order to the customer?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: () => updateDeliveryStatus('DELIVERED') },
    ]);
  };

  const openNavigation = () => {
    const destLat = destinationCoords.latitude;
    const destLng = destinationCoords.longitude;

    const url = Platform.select({
      ios: `maps://app?daddr=${destLat},${destLng}`,
      android: `google.navigation:q=${destLat},${destLng}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
        Linking.openURL(webUrl);
      }
    });
  };

  const callCustomer = () => {
    const phone = delivery.order.contact_phone || delivery.order.customer_phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
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

  const getMapHTML = () => {
    const driverLat = currentLocation?.latitude || pickupCoords.latitude;
    const driverLng = currentLocation?.longitude || pickupCoords.longitude;
    const routeJSON = JSON.stringify(routeCoordinates);
    const pickupAddress = (delivery.pickup_address || 'Core Canteen, Harare CBD').replace(/'/g, "\\'");
    const deliveryAddress = (delivery.order.delivery_address_line1 || '').replace(/'/g, "\\'");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      font-size: 18px;
    }
    .pickup-marker { background: #27ae60; width: 40px; height: 40px; }
    .destination-marker { background: #e74c3c; width: 40px; height: 40px; }
    .driver-marker {
      background: #0c1697;
      width: 44px;
      height: 44px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(12, 22, 151, 0.5); }
      70% { box-shadow: 0 0 0 20px rgba(12, 22, 151, 0); }
      100% { box-shadow: 0 0 0 0 rgba(12, 22, 151, 0); }
    }
    .leaflet-popup-content-wrapper {
      border-radius: 10px;
    }
    .popup-title {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 4px;
    }
    .popup-address {
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Custom icon creators
    function createIcon(className, emoji) {
      return L.divIcon({
        className: 'custom-div-icon',
        html: '<div class="custom-marker ' + className + '">' + emoji + '</div>',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22]
      });
    }

    var pickupIcon = createIcon('pickup-marker', '🍽️');
    var destinationIcon = createIcon('destination-marker', '📍');
    var driverIcon = createIcon('driver-marker', '🚗');

    // Markers
    var pickupMarker = L.marker([${pickupCoords.latitude}, ${pickupCoords.longitude}], { icon: pickupIcon })
      .addTo(map)
      .bindPopup('<div class="popup-title">Pickup Location</div><div class="popup-address">${pickupAddress}</div>');

    var destinationMarker = L.marker([${destinationCoords.latitude}, ${destinationCoords.longitude}], { icon: destinationIcon })
      .addTo(map)
      .bindPopup('<div class="popup-title">Delivery Location</div><div class="popup-address">${deliveryAddress}</div>');

    var driverMarker = L.marker([${driverLat}, ${driverLng}], { icon: driverIcon })
      .addTo(map)
      .bindPopup('<div class="popup-title">Your Location</div><div class="popup-address">Driver</div>');

    // Route polyline
    var routeCoords = ${routeJSON};
    var polyline = null;
    if (routeCoords && routeCoords.length > 0) {
      polyline = L.polyline(routeCoords, {
        color: '#0c1697',
        weight: 5,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map);
    }

    // Fit bounds
    var bounds = L.latLngBounds([
      [${pickupCoords.latitude}, ${pickupCoords.longitude}],
      [${destinationCoords.latitude}, ${destinationCoords.longitude}],
      [${driverLat}, ${driverLng}]
    ]);
    map.fitBounds(bounds, { padding: [40, 40] });

    // Functions callable from React Native
    function updateDriverLocation(lat, lng) {
      driverMarker.setLatLng([lat, lng]);
    }

    function centerOnDriver() {
      var pos = driverMarker.getLatLng();
      map.setView(pos, 16, { animate: true });
    }

    function fitAllMarkers() {
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  </script>
</body>
</html>
    `;
  };

  const StatusButton = () => {
    if (delivery.status === 'ASSIGNED') {
      return (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745' }]} onPress={handleAcceptDelivery}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Accept Delivery</Text>
        </TouchableOpacity>
      );
    } else if (delivery.status === 'ACCEPTED') {
      return (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#0c1697' }]} onPress={handleStartDelivery}>
          <Ionicons name="play-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Start Delivery</Text>
        </TouchableOpacity>
      );
    } else if (delivery.status === 'IN_TRANSIT') {
      return (
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#27ae60' }]} onPress={handleCompleteDelivery}>
          <Ionicons name="checkmark-done-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Mark as Delivered</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {isLoadingRoute ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#0c1697" />
            <Text style={styles.loadingText}>Loading route...</Text>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: getMapHTML() }}
            style={styles.map}
            scrollEnabled={false}
            onError={(e) => console.error('WebView error:', e.nativeEvent)}
          />
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => webViewRef.current?.injectJavaScript('centerOnDriver(); true;')}
          >
            <Ionicons name="locate" size={22} color="#0c1697" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => webViewRef.current?.injectJavaScript('fitAllMarkers(); true;')}
          >
            <Ionicons name="expand" size={22} color="#0c1697" />
          </TouchableOpacity>
        </View>

        {/* Tracking Badge */}
        {isTracking && (
          <View style={styles.trackingBadge}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingBadgeText}>Live Tracking</Text>
          </View>
        )}
      </View>

      {/* Delivery Info Panel */}
      <ScrollView style={styles.infoPanel} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
            <Text style={styles.statusText}>{delivery.status_display || delivery.status}</Text>
          </View>
          <Text style={styles.orderNumber}>#{delivery.order.order_number}</Text>
        </View>

        {/* Route Info */}
        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#27ae60' }]} />
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>PICKUP</Text>
              <Text style={styles.routeAddress}>{delivery.pickup_address || 'Core Canteen, Harare CBD'}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: '#e74c3c' }]} />
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>DELIVERY</Text>
              <Text style={styles.routeAddress}>{delivery.order.delivery_address_line1}</Text>
              <Text style={styles.routeCity}>{delivery.order.delivery_city}</Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerInfo}>
          <View style={styles.customerRow}>
            <Ionicons name="person" size={20} color="#0c1697" />
            <Text style={styles.customerName}>
              {delivery.order.customer_name || delivery.order.guest_name}
            </Text>
          </View>
          {delivery.order.contact_phone && (
            <TouchableOpacity style={styles.customerRow} onPress={callCustomer}>
              <Ionicons name="call" size={20} color="#27ae60" />
              <Text style={styles.customerPhone}>{delivery.order.contact_phone}</Text>
            </TouchableOpacity>
          )}
          <View style={styles.customerRow}>
            <Ionicons name="cash" size={20} color="#f39c12" />
            <Text style={styles.paymentText}>
              ${delivery.order.total_amount} - {delivery.order.payment_method_display}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <StatusButton />

          <View style={styles.secondaryButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={openNavigation}>
              <Ionicons name="navigate" size={24} color="#0c1697" />
              <Text style={styles.secondaryButtonText}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={callCustomer}>
              <Ionicons name="call" size={24} color="#27ae60" />
              <Text style={styles.secondaryButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: height * 0.42,
    position: 'relative',
  },
  map: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  mapLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  mapControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  mapButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 8,
  },
  trackingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1697',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  trackingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  routeInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 10,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 4,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.5,
  },
  routeAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  routeCity: {
    fontSize: 12,
    color: '#666',
  },
  customerInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  customerPhone: {
    fontSize: 15,
    color: '#27ae60',
    marginLeft: 10,
    fontWeight: '500',
  },
  paymentText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  actionButtonsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
});
