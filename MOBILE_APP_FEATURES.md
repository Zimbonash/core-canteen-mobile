# CoreCanteen Mobile App - Feature Summary

## Overview
The CoreCanteen mobile app now includes comprehensive features for both customers and drivers with real-time GPS tracking, live order monitoring, and seamless synchronization with the Django backend.

## Features Implemented

### 1. Driver Features
#### Driver Dashboard ([DriverDashboardScreen.js](screens/driver/DriverDashboardScreen.js))
- Real-time statistics dashboard
  - Pending deliveries count
  - In-transit deliveries
  - Completed deliveries today
  - Today's earnings
  - Average rating
- Active delivery banner with quick access
- Auto-refreshing every 30 seconds
- Quick action buttons to navigate to deliveries and earnings

#### Active Delivery with Live GPS ([ActiveDeliveryScreen.js](screens/driver/ActiveDeliveryScreen.js))
- **Real-time GPS tracking**
  - Updates driver location every 10 seconds
  - Sends location updates to backend automatically
  - Shows driver's current position on map
  - Route visualization from driver to customer
- **Delivery management**
  - Accept delivery button
  - Start delivery button (marks as collected)
  - Complete delivery button
  - Call customer directly
  - Navigate using device's maps app
- **Map features**
  - OpenStreetMap integration via React Native Maps
  - Driver marker with custom icon
  - Destination marker
  - Route polyline
  - GPS tracking indicator
- **Order information**
  - Order number
  - Delivery address
  - Customer contact
  - Real-time status updates

#### Deliveries List ([DeliveriesListScreen.js](screens/driver/DeliveriesListScreen.js))
- Filter deliveries by:
  - Active (assigned, accepted, in-transit)
  - Completed
  - All
- Color-coded status badges
- Pull-to-refresh functionality
- Delivery details:
  - Order number
  - Customer name and phone
  - Delivery address
  - Payment amount and method
- Tap to view active delivery on map

### 2. Customer Features
#### Live Order Tracking ([TrackOrderScreen.js](screens/customer/TrackOrderScreen.js))
- **Real-time tracking**
  - Live driver location on map (updates every 10 seconds)
  - Route visualization from driver to customer
  - ETA display
- **Order status timeline**
  - Visual progress indicator
  - Status steps: Confirmed → Processing → Ready → Dispatched → Delivered
  - Color-coded completion
- **Driver information**
  - Driver name
  - Driver rating and total deliveries
  - Vehicle information
  - Call driver button
- **Order details**
  - Order number and type
  - Items list
  - Total amount
  - Delivery address

#### Orders List ([OrdersListScreen.js](screens/customer/OrdersListScreen.js))
- Filter orders by:
  - Active (confirmed, processing, ready, dispatched)
  - Past (delivered, cancelled)
  - All
- Order cards showing:
  - Order number and date
  - Status badge with icon
  - Order type (delivery/pickup)
  - Items preview (first 2 items)
  - Total amount
  - Track order button (for active deliveries)
- Pull-to-refresh
- Empty state with browse menu button

#### Shopping Cart ([CartScreen.js](screens/customer/CartScreen.js))
- Add/remove items
- Quantity controls
- Order type selection (Delivery/Pickup)
- Delivery address input
- Price breakdown:
  - Subtotal
  - Delivery fee (if applicable)
  - Total
- Checkout with order creation
- Persistent cart (saved to AsyncStorage)

### 3. Navigation Structure
#### Customer Navigation
- **Bottom Tabs:**
  - Home - Dashboard
  - Menu - Browse menu
  - Cart - Shopping cart
  - Orders - Order history
  - Profile - User profile
- **Stack Screens:**
  - TrackOrder - Live order tracking with map

#### Driver Navigation
- **Bottom Tabs:**
  - Dashboard - Stats and active delivery
  - Deliveries - Delivery list
  - Earnings - Earnings history
  - Profile - Driver profile
- **Stack Screens:**
  - ActiveDelivery - Live GPS tracking and delivery management

## Real-Time Features

### GPS Tracking System
1. **Driver Side:**
   - Requests location permissions on mount
   - Uses `expo-location` for high-accuracy GPS
   - Watches position with 10-second interval
   - Sends location updates to backend API
   - Tracking indicator shows active status

2. **Customer Side:**
   - Polls backend every 10 seconds for driver location
   - Updates map markers in real-time
   - Shows route polyline
   - Displays ETA

### API Integration
All screens integrate with Django backend:

#### Driver Endpoints:
- `GET /api/driver/stats/` - Dashboard statistics
- `GET /api/driver/active-delivery/` - Current active delivery
- `GET /api/driver/deliveries/?filter={active|completed|all}` - Delivery list
- `GET /api/deliveries/{id}/` - Delivery details
- `POST /api/deliveries/{id}/update-status/` - Update delivery status
- `POST /api/driver/update-location/` - Send GPS coordinates

#### Customer Endpoints:
- `GET /api/orders/` - Order list with filters
- `GET /api/orders/{id}/` - Order details
- `GET /api/orders/{id}/delivery/` - Delivery with driver info
- `POST /api/orders/create/` - Create new order

## Location Permissions
Configured in [app.json](app.json):

### iOS:
- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription`

### Android:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION`

## Technology Stack
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
  - Bottom Tabs Navigator
  - Stack Navigator
- **React Native Maps** - Map display (supports OpenStreetMap)
- **Expo Location** - GPS tracking and geolocation
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons (Ionicons)** - Icon library

## File Structure
```
mobile-app/
├── screens/
│   ├── customer/
│   │   ├── CartScreen.js
│   │   ├── OrdersListScreen.js
│   │   └── TrackOrderScreen.js
│   ├── driver/
│   │   ├── DriverDashboardScreen.js
│   │   ├── DeliveriesListScreen.js
│   │   └── ActiveDeliveryScreen.js
│   ├── HomeScreen.js
│   ├── MenuScreen.js
│   └── LoginScreen.js
├── config.js (API configuration)
├── App.js (Navigation setup)
├── app.json (Expo configuration)
└── package.json (Dependencies)
```

## Next Steps (Not Yet Implemented)
- Staff/Kitchen dashboard
- Profile screen with user settings
- Earnings history screen
- Push notifications
- Offline mode support
- Order cancellation
- Feedback/rating system UI

## Building the App
To build with all features:

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Build for iOS
eas build --platform ios --profile development

# Build for Android
eas build --platform android --profile development
```

## Testing GPS Features
1. **iOS Simulator:** Go to Features → Location → Custom Location to simulate movement
2. **Android Emulator:** Use extended controls to set GPS coordinates
3. **Physical Device:** Best for real GPS tracking testing

## Notes
- Real-time updates occur every 10-30 seconds
- GPS tracking only active during deliveries
- Maps work with OpenStreetMap tiles (no API key needed)
- All location data syncs with Django backend
- Delivery tracking works cross-platform (customer on iOS can track driver on Android)
