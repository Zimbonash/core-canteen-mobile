# CoreCanteen Mobile App - Setup Guide

## 🚨 Fixing "Network Request Failed" Error

If you're seeing `[TypeError: Network request failed]` when trying to login, follow these steps:

---

## Step 1: Find Your Computer's IP Address

### Windows:
1. Open Command Prompt
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. Example: `192.168.1.5`

### Mac/Linux:
1. Open Terminal
2. Run: `ifconfig` or `ip addr`
3. Look for "inet" address
4. Example: `192.168.1.5`

---

## Step 2: Update the API URL

### Option A: Edit config.js (Recommended)

Open `mobile-app/config.js` and update line 24:

```javascript
// CHANGE THIS LINE:
const API_BASE_URL = 'http://127.0.0.1:8000';

// TO YOUR COMPUTER'S IP:
const API_BASE_URL = 'http://192.168.1.5:8000';  // Replace with YOUR IP
```

### Option B: Quick Test URLs

**For iOS Simulator:**
```javascript
const API_BASE_URL = 'http://YOUR_LOCAL_IP:8000';  // e.g., http://192.168.1.5:8000
```

**For Android Emulator:**
```javascript
const API_BASE_URL = 'http://10.0.2.2:8000';  // Special Android emulator IP
```

**For Physical Devices:**
```javascript
const API_BASE_URL = 'http://YOUR_LOCAL_IP:8000';  // e.g., http://192.168.1.5:8000
```

---

## Step 3: Make Sure Django Server is Running

1. Open a terminal
2. Navigate to Django project:
   ```bash
   cd C:\Users\Admin\Documents\NayimwePrivateLimited\CODESIGN\CoreCanteen\django-web
   ```
3. Start the server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   **Note:** `0.0.0.0:8000` allows connections from other devices on your network

4. You should see:
   ```
   Starting development server at http://0.0.0.0:8000/
   ```

---

## Step 4: Test the Connection

### Test in Browser:
Visit `http://YOUR_LOCAL_IP:8000/api/` from your phone's browser

If you see JSON data, the connection works!

### Test in Mobile App:
1. Restart the mobile app (close and reopen)
2. Try logging in with test credentials
3. Check the error message - it will show the current API_URL

---

## Step 5: Common Issues

### Issue 1: "Connection refused"
**Solution:** Make sure Django server is running with `0.0.0.0:8000`

### Issue 2: "Network timeout"
**Solution:**
- Check firewall settings (allow port 8000)
- Make sure phone and computer are on same WiFi network
- Try disabling Windows Firewall temporarily to test

### Issue 3: Still can't connect
**Solution:**
1. Verify IP address is correct (run `ipconfig` again)
2. Test Django API in browser: `http://YOUR_IP:8000/api/`
3. Check Django console for errors
4. Make sure both devices are on same network

---

## ✅ Quick Checklist

- [ ] Found computer's IP address
- [ ] Updated `config.js` with correct IP
- [ ] Django server running with `0.0.0.0:8000`
- [ ] Both devices on same WiFi network
- [ ] Firewall allows port 8000
- [ ] Tested API in browser
- [ ] Restarted mobile app

---

## 📱 Test Credentials

### Customer Account:
- Email: `customer@example.com`
- Password: `password123`

### Driver Account:
- Email: `driver@corecanteen.co.zw`
- Password: `password123`

### Staff Account (Web Only):
- Email: `staff@corecanteen.co.zw`
- Password: `password123`

---

## 🎨 App Features

### App Name: **CoreCanteen**
- Updated in `app.json`
- Will show as "CoreCanteen" on device

### Logo:
- Located: `mobile-app/assets/logo.png`
- Displays on login screen (120x120)
- Copied from Django static files

### Colors:
- **Customer/Corporate:** Blue (#3498db)
- **Driver:** Red (#e74c3c)
- **Staff:** Blue (#3498db)

---

## 🔧 Development Commands

### Start Metro Bundler:
```bash
cd mobile-app
npx expo start
```

### Run on iOS Simulator:
```bash
npx expo start --ios
```

### Run on Android Emulator:
```bash
npx expo start --android
```

### Clear Cache:
```bash
npx expo start --clear
```

---

## 🌐 Network Configuration Examples

### Home WiFi:
```javascript
const API_BASE_URL = 'http://192.168.1.5:8000';
```

### Office Network:
```javascript
const API_BASE_URL = 'http://10.0.1.15:8000';
```

### Android Emulator:
```javascript
const API_BASE_URL = 'http://10.0.2.2:8000';
```

### Production:
```javascript
const API_BASE_URL = 'https://api.corecanteen.co.zw';
```

---

## 🚀 Next Steps

1. **Fix Network Connection** (this guide)
2. **Test Login** with customer account
3. **Explore Dynamic Navigation**
4. **Test Real-Time Tracking** (for customers)
5. **Test GPS Updates** (for drivers)

---

## 📚 Related Documentation

- [MOBILE_APP_DYNAMIC_NAVIGATION.md](../django-web/MOBILE_APP_DYNAMIC_NAVIGATION.md) - Dynamic navigation guide
- [MOBILE_APP_QUICK_START.md](../django-web/MOBILE_APP_QUICK_START.md) - Quick start guide
- [config.js](config.js) - Configuration file

---

## 🆘 Still Need Help?

### Check Django Logs:
Look at the Django terminal for any errors when you try to login

### Check Mobile App Console:
Press `Cmd+D` (iOS) or `Cmd+M` (Android) → "Debug JS Remotely"

### Verbose Error Messages:
The app now shows detailed connection info in error alerts

---

**Last Updated:** 2025-11-20
**Version:** 1.0.0
**Status:** ✅ Ready to Test
