# Fixing EAS Build - CoreCanteen App Name

## 🚨 Problem

The error `Slug for project identified by "extra.eas.projectId" (mobile-app) does not match the "slug" field (corecanteen)` occurs because:

1. EAS project was created with slug "mobile-app"
2. We changed app.json slug to "corecanteen"
3. EAS expects them to match

---

## ✅ Solution: Update EAS Project Slug

### Option 1: Update via Expo Website (Recommended)

1. **Go to Expo Dashboard:**
   ```
   https://expo.dev/accounts/zimbonash/projects/mobile-app/settings
   ```

2. **Update Project Settings:**
   - Find "Project Slug" setting
   - Change from `mobile-app` to `corecanteen`
   - Save changes

3. **Build Again:**
   ```bash
   eas build --platform ios --profile development
   ```

### Option 2: Create New EAS Project

If you can't change the slug, create a new project:

1. **Remove EAS Project ID from app.json:**
   ```bash
   # Temporarily remove the projectId
   ```

2. **Create New Project:**
   ```bash
   cd mobile-app
   eas build:configure
   ```

3. **Answer prompts:**
   - Select "Create a new project"
   - It will use slug "corecanteen" from app.json

### Option 3: Revert Slug (Not Recommended)

Change slug back to match EAS project:

Edit `app.json`:
```json
{
  "expo": {
    "name": "CoreCanteen",
    "slug": "mobile-app",  // Change back to mobile-app
    ...
  }
}
```

**But this means the URL will be:**
```
exp://YOUR_IP/mobile-app
```

Instead of:
```
exp://YOUR_IP/corecanteen
```

---

## 📱 App Name on Device

The app name shown on the device is controlled by these settings (already configured ✅):

### iOS:
```json
"ios": {
  "bundleIdentifier": "com.corecanteen.app",
  "infoPlist": {
    "CFBundleDisplayName": "CoreCanteen",  // ← This is what appears on home screen
    "CFBundleName": "CoreCanteen"
  }
}
```

### Android:
```json
"android": {
  "package": "com.corecanteen.app"
}
```

And in app.json root:
```json
{
  "expo": {
    "name": "CoreCanteen",  // ← This is used as fallback
    ...
  }
}
```

**✅ These are already configured correctly!**

---

## 🔧 What We've Fixed

### ✅ Bundle Identifiers:
- **iOS:** Changed from `com.corepay.corecanteen` to `com.corecanteen.app`
- **Android:** Added `com.corecanteen.app`

### ✅ Display Names:
- **iOS:** Added `CFBundleDisplayName: "CoreCanteen"`
- **iOS:** Added `CFBundleName: "CoreCanteen"`
- **App name:** Already set to "CoreCanteen"

### ✅ Version Numbers:
- **iOS:** Added `buildNumber: "1"`
- **Android:** Added `versionCode: 1`

---

## 🚀 Build Commands

### Development Build (Testing):
```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### Production Build:
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### Preview Build (Internal Testing):
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

---

## 📋 Current Configuration

### app.json:
```json
{
  "expo": {
    "name": "CoreCanteen",           // ✅ App name
    "slug": "corecanteen",            // ⚠️ Needs to match EAS project
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.corecanteen.app",
      "buildNumber": "1",
      "infoPlist": {
        "CFBundleDisplayName": "CoreCanteen",  // ✅ iOS home screen name
        "CFBundleName": "CoreCanteen"
      }
    },
    "android": {
      "package": "com.corecanteen.app",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "b4dc68b1-8edb-46d2-800c-be0fe81eced7"
      }
    },
    "owner": "zimbonash"
  }
}
```

---

## ✅ Verification

After fixing the slug mismatch, verify:

### 1. Build Starts:
```bash
eas build --platform ios --profile development
```

Should show:
```
✔ Synced project configuration to EAS
✔ Build started...
```

### 2. App Name on Device:
When installed, the app should display as:
- **Home Screen:** "CoreCanteen"
- **Settings:** "CoreCanteen"

### 3. Bundle Identifier:
- **iOS:** `com.corecanteen.app`
- **Android:** `com.corecanteen.app`

---

## 🐛 Troubleshooting

### Error: "Slug mismatch"
**Solution:** Update EAS project slug on Expo website or create new project

### Error: "Invalid bundle identifier"
**Solution:** Already fixed - now using `com.corecanteen.app`

### Error: "Build failed"
**Solution:** Check EAS build logs:
```bash
eas build:list
eas build:view BUILD_ID
```

### App shows wrong name:
**Solution:** Already fixed with `CFBundleDisplayName`

---

## 📚 Related Documentation

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [App Config](https://docs.expo.dev/workflow/configuration/)
- [iOS App Name](https://docs.expo.dev/versions/latest/config/app/#name)

---

## 🎯 Summary

**To fix the slug mismatch:**
1. Go to https://expo.dev/accounts/zimbonash/projects/mobile-app/settings
2. Change project slug from `mobile-app` to `corecanteen`
3. Run build command again

**App name configuration:**
✅ Already done - app will show as "CoreCanteen" on device

**Bundle identifiers:**
✅ Already updated to `com.corecanteen.app`

---

**Status:** Configuration Fixed ✅
**Remaining:** Update EAS project slug via Expo website
**Last Updated:** 2025-11-20
