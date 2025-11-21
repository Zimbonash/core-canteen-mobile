# Mobile App Complete Redesign - Customer & Driver Only

## Overview

The Core Canteen mobile app has been completely redesigned to serve **ONLY two user types**:

1. **CUSTOMERS** - Browse menu, place orders, track deliveries
2. **DRIVERS** - Accept deliveries, GPS tracking, complete deliveries

**All other users (Staff, Corporate Admins, Event Organizers) are redirected to the web portal.**

---

## What Was Wrong

### ❌ Old Mobile App (INCORRECT):
```
Bottom Navigation:
- Home (restaurant-style homepage)
- Menu (generic menu)
- Events (NOT NEEDED - events are web portal only)
- Reservations (NOT NEEDED - we're a catering company, not a restaurant)
- Contact (NOT NEEDED)
```

**Problems:**
1. Restaurant-focused instead of catering-focused
2. No login/authentication
3. No role-based navigation
4. Missing driver features (GPS tracking)
5. Missing customer features (order placement, tracking)
6. Events and Reservations screens don't match business model

---

## ✅ New Mobile App (CORRECT):

### Authentication Flow

```
App Launch
    ↓
LoginScreen (email + password)
    ↓
Call GET /api/auth/me/  ← CRITICAL!
    ↓
Check mobile_role
    ↓
    ├── "customer" → Customer Navigation
    ├── "driver" → Driver Navigation
    └── "web_only" → Show "Use Web Portal" Message
```

### Customer Navigation

```
📱 CUSTOMER APP
Bottom Tabs:
├── 🏠 Home (Dashboard with quick stats)
├── 🍽️ Menu (Browse catering menu)
├── 🛒 Cart (Shopping cart)
├── 📦 Orders (Order history + active orders)
└── 👤 Profile (Settings & logout)

Additional Screens (stack navigation):
- OrderTrackingScreen (real-time GPS map)
- CheckoutScreen (place order)
- FeedbackScreen (rate delivery)
```

### Driver Navigation

```
🚗 DRIVER APP
Bottom Tabs:
├── 🏠 Dashboard (Stats + earnings)
├── 📦 Deliveries (Available + Active)
├── 💰 Earnings (Weekly/Monthly)
└── 👤 Profile (Settings & logout)

Additional Screens (stack navigation):
- ActiveDeliveryScreen (GPS map + navigation)
- DeliveryDetailsScreen (order details)
- DeliveryCompletionScreen (proof of delivery)
```

---

## File Structure

### New Directory Structure

```
mobile-app/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js ✅ NEW
│   │   └── RegisterScreen.js ✅ NEW
│   ├── customer/
│   │   ├── CustomerHomeScreen.js ✅ NEW
│   │   ├── MenuScreen.js (Updated)
│   │   ├── CartScreen.js ✅ NEW
│   │   ├── OrdersScreen.js ✅ NEW
│   │   ├── OrderTrackingScreen.js ✅ NEW
│   │   ├── CheckoutScreen.js ✅ NEW
│   │   ├── FeedbackScreen.js ✅ NEW
│   │   └── ProfileScreen.js ✅ NEW
│   └── driver/
│       ├── DriverDashboardScreen.js ✅ NEW
│       ├── DeliveriesScreen.js ✅ NEW
│       ├── ActiveDeliveryScreen.js ✅ NEW (GPS MAP)
│       ├── DeliveryDetailsScreen.js ✅ NEW
│       ├── EarningsScreen.js ✅ NEW
│       └── DriverProfileScreen.js ✅ NEW
├── navigation/
│   ├── CustomerNavigator.js ✅ NEW
│   ├── DriverNavigator.js ✅ NEW
│   └── AuthNavigator.js ✅ NEW
├── components/
│   ├── MenuItem.js
│   ├── OrderCard.js
│   ├── DeliveryCard.js
│   └── MapView.js (for GPS tracking)
└── App.js (Rewritten with role-based navigation)
```

### Deleted Files (OLD - INCORRECT)

```
❌ screens/EventsScreen.js - DELETED (events are web portal only)
❌ screens/ReservationsScreen.js - DELETED (not a restaurant)
❌ screens/ContactScreen.js - DELETED (not needed)
❌ screens/HomeScreen.js - DELETED (replaced with role-specific homes)
```

---

## Key Features Implementation

### 1. Authentication (LoginScreen.js)

**Features:**
- Email + password login
- Calls `POST /api/auth/login/` to get token
- Calls `GET /api/auth/me/` to determine user role
- Blocks "web_only" users with friendly message
- Navigates to appropriate interface based on role

**Code Flow:**
```javascript
// Login
const loginResponse = await fetch('/api/auth/login/', {...});
const { token } = loginResponse.json();

// Get role
const roleResponse = await fetch('/api/auth/me/', {
  headers: { 'Authorization': `Token ${token}` }
});
const { mobile_role, user } = roleResponse.json();

// Navigate
if (mobile_role === 'customer') {
  navigation.navigate('CustomerApp');
} else if (mobile_role === 'driver') {
  navigation.navigate('DriverApp');
} else {
  // Show "Use web portal" message
}
```

### 2. Customer App Features

**MenuScreen:**
- Browse catering menu
- Search and filter
- Add to cart
- View item details

**CartScreen:**
- Review items
- Adjust quantities
- Calculate total
- Proceed to checkout

**OrdersScreen:**
- Active orders (track in real-time)
- Order history
- Order details
- Reorder functionality

**OrderTrackingScreen (CRITICAL):**
- Real-time GPS map
- Driver location (updates every 10 seconds)
- Estimated delivery time
- Contact driver button
- Order status timeline

```javascript
// Poll driver location every 10 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch(`/api/tracking/${deliveryId}/`, {
      headers: { 'Authorization': `Token ${token}` }
    });
    const delivery = await response.json();

    // Update map with new driver location
    setDriverLocation({
      latitude: delivery.current_latitude,
      longitude: delivery.current_longitude,
    });
  }, 10000); // Every 10 seconds

  return () => clearInterval(interval);
}, [deliveryId]);
```

### 3. Driver App Features

**DriverDashboardScreen:**
- Today's deliveries count
- Today's earnings
- Active deliveries
- Average rating
- Quick access to available deliveries

**DeliveriesScreen:**
- List of available deliveries
- Accept/reject deliveries
- View delivery details
- Filter by status (available, active, completed)

**ActiveDeliveryScreen (CRITICAL - GPS TRACKING):**
- Real-time navigation map
- Send GPS updates every 10-30 seconds
- Destination marker
- Current location marker
- Distance remaining
- Estimated arrival time
- "Mark as Picked Up" button
- "Complete Delivery" button

```javascript
// Send GPS updates continuously
useEffect(() => {
  const watchId = Geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, speed, heading } = position.coords;

      // Send to backend
      await fetch('/api/driver/location/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude,
          longitude,
          speed,
          heading,
          accuracy: position.coords.accuracy
        })
      });
    },
    (error) => console.error(error),
    {
      enableHighAccuracy: true,
      distanceFilter: 10,  // Update every 10 meters
      interval: 15000       // Or every 15 seconds
    }
  );

  return () => Geolocation.clearWatch(watchId);
}, []);
```

**EarningsScreen:**
- Weekly earnings
- Monthly earnings
- Earnings breakdown by delivery
- Payment history

---

## App.js Redesign

### Old App.js (WRONG)
```javascript
<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Menu" component={MenuScreen} />
  <Tab.Screen name="Events" component={EventsScreen} />  // ❌ WRONG
  <Tab.Screen name="Reservations" component={ReservationsScreen} />  // ❌ WRONG
  <Tab.Screen name="Contact" component={ContactScreen} />  // ❌ WRONG
</Tab.Navigator>
```

### New App.js (CORRECT)
```javascript
const [userRole, setUserRole] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Check authentication on app launch
useEffect(() => {
  checkAuth();
}, []);

async function checkAuth() {
  const token = await AsyncStorage.getItem('userToken');
  const role = await AsyncStorage.getItem('userRole');

  if (token && role) {
    setUserRole(role);
    setIsAuthenticated(true);
  }
}

return (
  <NavigationContainer>
    {!isAuthenticated ? (
      // Show Login/Register
      <AuthNavigator />
    ) : (
      // Show role-based navigation
      userRole === 'customer' ? <CustomerNavigator /> : <DriverNavigator />
    )}
  </NavigationContainer>
);
```

---

## Required NPM Packages

Add these to `package.json`:

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install react-native-maps
npm install react-native-geolocation-service
npm install axios
```

**For Expo:**
```bash
expo install react-native-maps expo-location
```

---

## Testing the Mobile App

### 1. Test Customer Login

```
1. Open app
2. Enter customer email: customer@test.com
3. Enter password
4. Login
5. Should see Customer Navigation (Home, Menu, Cart, Orders, Profile)
```

### 2. Test Driver Login

```
1. Open app
2. Enter driver email: driver@test.com
3. Enter password
4. Login
5. Should see Driver Navigation (Dashboard, Deliveries, Earnings, Profile)
```

### 3. Test Staff/Event Organizer Login

```
1. Open app
2. Enter staff email: staff@test.com
3. Enter password
4. Login
5. Should see message: "Please use the web portal"
6. App remains on login screen
```

### 4. Test GPS Tracking (Driver)

```
1. Login as driver
2. Accept a delivery
3. Navigate to Active Delivery screen
4. Check that GPS location is being sent (check network tab or backend logs)
5. Move device/emulator location
6. Verify location updates are sent
```

### 5. Test Order Tracking (Customer)

```
1. Login as customer
2. Place an order
3. Navigate to Order Tracking screen
4. Verify driver location marker appears on map
5. Wait 10 seconds
6. Verify driver location updates
```

---

## Environment Configuration

Update `API_URL` in each screen:

**Development:**
```javascript
const API_URL = 'http://localhost:8000/api';  // For iOS Simulator
const API_URL = 'http://10.0.2.2:8000/api';   // For Android Emulator
const API_URL = 'http://192.168.1.100:8000/api';  // For physical device
```

**Production:**
```javascript
const API_URL = 'https://api.corecanteen.com/api';
```

---

## Next Steps

1. ✅ Complete all customer screens
2. ✅ Complete all driver screens
3. ✅ Implement GPS tracking
4. ✅ Implement real-time order tracking
5. ✅ Add push notifications
6. ✅ Add offline mode
7. ✅ Add payment integration
8. ✅ Test on physical devices
9. ✅ Deploy to App Store / Play Store

---

## Summary

The mobile app is now correctly designed for **customers** and **drivers** only, with:

✅ **Authentication with role detection**
✅ **Customer app for ordering and tracking**
✅ **Driver app for GPS tracking and delivery management**
✅ **Web portal redirection for staff/corporate/event users**
✅ **No more restaurant-style features (events, reservations, contact)**
✅ **Catering company business model alignment**

The app now matches the business requirements perfectly! 🎉
