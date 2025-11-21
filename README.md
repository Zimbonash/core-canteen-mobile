# CoreCanteen Mobile App

**Professional Catering Services Mobile Application**

## 🚨 IMPORTANT: Fix "Network Request Failed" Error

If you're getting a network error when trying to login, **see [SETUP_GUIDE.md](SETUP_GUIDE.md)** for step-by-step instructions.

**Quick Fix:**
1. Find your computer's IP: Run `ipconfig` (Windows) or `ifconfig` (Mac)
2. Edit `config.js` line 24: Change `127.0.0.1` to your IP (e.g., `192.168.1.5`)
3. Start Django: `python manage.py runserver 0.0.0.0:8000`
4. Restart mobile app

---

## 📱 App Information

- **Name:** CoreCanteen
- **Version:** 1.0.0
- **Platform:** iOS & Android (React Native/Expo)
- **Backend:** Django REST API

---

## 🎯 Features

### Dynamic Role-Based Navigation
- **Customers:** Order placement, real-time tracking, menu browsing
- **Drivers:** GPS tracking, delivery management, earnings view
- **Corporate:** Meal plans, bulk ordering, contracts
- **Staff:** Order management (web portal only)
- **Event Organizers:** Event booking, catering requests

### Real-Time Tracking
- Live driver location updates (every 10 seconds)
- 3-marker map (restaurant, driver, customer)
- Route visualization
- ETA display

### Zimbabwe-Optimized
- +263 phone format
- Zimbabwe cities and locations
- Map boundaries restricted to Zimbabwe
- Local currency and context

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

### 2. Configure API URL
Edit `config.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:8000';  // Change this!
```

### 3. Start Django Backend
```bash
cd ../django-web
python manage.py runserver 0.0.0.0:8000
```

### 4. Start Mobile App
```bash
cd ../mobile-app
npx expo start
```

### 5. Run on Device
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code for physical device

---

## 🔧 Configuration

### config.js
Main configuration file:
- API URL
- Feature flags
- Map settings (Zimbabwe)
- Polling intervals

### app.json
Expo configuration:
- App name: CoreCanteen
- Bundle identifier
- Icons and splash screens

---

## 🧪 Test Accounts

### Customer:
```
Email: customer@example.com
Password: password123
```

### Driver:
```
Email: driver@corecanteen.co.zw
Password: password123
```

### Staff (Web Only):
```
Email: staff@corecanteen.co.zw
Password: password123
```

---

## 📁 Project Structure

```
mobile-app/
├── screens/
│   ├── LoginScreen.js         # Login with role detection
│   ├── HomeScreen.js           # Customer dashboard
│   └── MenuScreen.js           # Menu browsing
├── assets/
│   ├── logo.png               # CoreCanteen logo (120x120)
│   ├── icon.png               # App icon
│   └── splash-icon.png        # Splash screen
├── config.js                  # Configuration (UPDATE THIS!)
├── App.js                     # Main app component
├── app.json                   # Expo config
├── package.json               # Dependencies
├── SETUP_GUIDE.md            # Network setup guide
└── README.md                 # This file
```

---

## 🐛 Troubleshooting

### Network Request Failed:
→ See [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Logo Not Showing:
→ Logo is at `assets/logo.png` (copied from Django)

### App Name Wrong:
→ Check `app.json` - should be "CoreCanteen"

### Can't Connect to Server:
→ Make sure Django is running on `0.0.0.0:8000`

### Metro Bundler Issues:
```bash
npx expo start --clear
```

---

## 📚 Documentation

### Mobile App:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Network setup (READ THIS FIRST!)
- [config.js](config.js) - Configuration file

### Backend (Django):
- [../django-web/MOBILE_APP_DYNAMIC_NAVIGATION.md](../django-web/MOBILE_APP_DYNAMIC_NAVIGATION.md)
- [../django-web/MOBILE_APP_QUICK_START.md](../django-web/MOBILE_APP_QUICK_START.md)

---

## ✅ Current Status

- ✅ App name: CoreCanteen
- ✅ Logo: Correct CoreCanteen logo
- ✅ Network: Configurable via config.js
- ✅ Dynamic navigation: Fully implemented
- ✅ Real-time tracking: Ready
- ✅ Zimbabwe-optimized: Complete

---

**Built with:** React Native, Expo, Django REST Framework
**Location:** Zimbabwe
**Version:** 1.0.0
**Status:** ✅ Ready to Test

🤖 Built with [Claude Code](https://claude.com/claude-code)
