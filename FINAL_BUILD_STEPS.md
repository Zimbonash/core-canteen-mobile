# CoreCanteen - Final Build Steps

## ✅ What You've Done

You updated the **Display name** to "core canteen" on the EAS website. Great!

---

## ⚠️ Important: Also Update Project Slug

The **Display name** and **Project slug** are different:

- **Display name**: Human-readable name shown on EAS website ✅ (You did this)
- **Project slug**: Technical identifier used in builds ⚠️ (Still needs updating)

---

## 🔧 Step-by-Step Fix

### 1. Go to EAS Project Settings

Visit:
```
https://expo.dev/accounts/zimbonash/projects/mobile-app/settings
```

Or navigate:
1. Go to https://expo.dev
2. Click on your project "mobile-app"
3. Click "Settings" tab

### 2. Find "Project Slug" Section

Look for a setting called **"Project Slug"** or **"Slug"**

Current value: `mobile-app`
Need to change to: `corecanteen`

### 3. Update the Slug

**Option A: If you can edit it directly**
- Change from `mobile-app` to `corecanteen`
- Save

**Option B: If it's read-only**
You may need to create a new project. See "Alternative Solution" below.

---

## 🧪 Test the Build

After updating the slug, test the build:

```bash
cd mobile-app

# Test with just the platform flag first
eas build --platform ios --profile development
```

**Expected Success Output:**
```
✔ Synced project configuration to EAS
✔ Checking for build configuration...
✔ Project uploaded successfully
✔ Build in progress...
```

**If still shows error:**
See "Alternative Solution" below.

---

## 🎯 Alternative Solution: Create New EAS Project

If you can't change the slug, create a new EAS project:

### Step 1: Backup Current Project ID
```json
// Current in app.json:
"extra": {
  "eas": {
    "projectId": "b4dc68b1-8edb-46d2-800c-be0fe81eced7"
  }
}
```

### Step 2: Remove Project ID Temporarily

Edit `app.json` and remove the projectId:
```json
"extra": {
  "eas": {}
}
```

### Step 3: Create New Project
```bash
cd mobile-app
eas build:configure
```

### Step 4: Answer Prompts
- "Create a new project?" → **Yes**
- It will create a new project with slug "corecanteen"
- New projectId will be automatically added to app.json

### Step 5: Build
```bash
eas build --platform ios --profile development
```

---

## 📱 What Happens After Build

### iOS:
When installed, the app will show:
- **Home Screen Name:** CoreCanteen
- **App Switcher:** CoreCanteen
- **Settings:** CoreCanteen

### Android:
When installed, the app will show:
- **App Drawer:** CoreCanteen
- **Home Screen:** CoreCanteen
- **Settings → Apps:** CoreCanteen

---

## ✅ Current Configuration (Already Correct)

```json
{
  "expo": {
    "name": "CoreCanteen",                    // ✅ App name
    "slug": "corecanteen",                    // ✅ Slug
    "ios": {
      "bundleIdentifier": "com.corecanteen.app",     // ✅ iOS bundle
      "infoPlist": {
        "CFBundleDisplayName": "CoreCanteen"  // ✅ iOS display name
      }
    },
    "android": {
      "package": "com.corecanteen.app"        // ✅ Android package
    }
  }
}
```

**All app configuration is correct! ✅**

---

## 🚀 Build Profiles Explained

### Development Profile:
```bash
eas build --platform ios --profile development
```
- For internal testing
- Includes development client
- Can use with Expo Go or development builds
- Faster to build

### Preview Profile:
```bash
eas build --platform ios --profile preview
```
- For internal distribution (TestFlight on iOS)
- Production-like but not submitted to stores
- Good for beta testing

### Production Profile:
```bash
eas build --platform ios --profile production
```
- For App Store submission
- Auto-increments version
- Optimized and stripped

---

## 📋 Build Checklist

Before building:

- [x] App name set to "CoreCanteen" in app.json
- [x] Slug set to "corecanteen" in app.json
- [x] iOS bundleIdentifier: com.corecanteen.app
- [x] iOS CFBundleDisplayName: CoreCanteen
- [x] Android package: com.corecanteen.app
- [x] EAS display name updated on website
- [ ] EAS project slug updated (or new project created)
- [ ] Build command tested successfully

---

## 🎓 Understanding the Names

### 1. Display Name (on EAS website)
**What:** Human-readable name on expo.dev
**Current:** "core canteen" ✅
**Used for:** Just the EAS website UI

### 2. Project Slug (EAS technical ID)
**What:** Technical identifier for EAS
**Current:** "mobile-app" ⚠️ (needs to be "corecanteen")
**Used for:** EAS builds, expo.dev URLs

### 3. App Name (in app.json)
**What:** Default app name
**Current:** "CoreCanteen" ✅
**Used for:** Fallback if CFBundleDisplayName not set

### 4. Bundle Display Name (iOS)
**What:** Name shown on device home screen
**Current:** "CoreCanteen" ✅
**Used for:** iOS device UI (most important for users)

### 5. Package Name (Android)
**What:** Unique app identifier
**Current:** "com.corecanteen.app" ✅
**Used for:** Android system, Google Play

---

## 🐛 Troubleshooting

### Error: "Slug mismatch"
**Solution:** Update project slug on EAS website or create new project (see above)

### Error: "Invalid credentials"
**Solution:** Run `eas login` to authenticate

### Error: "Build failed"
**Solution:** Check build logs:
```bash
eas build:list
eas build:view <BUILD_ID>
```

### Build works but wrong app name on device:
**Solution:** Configuration is already correct! App will show "CoreCanteen"

---

## 🎯 Quick Reference

### Check Current EAS Project:
```bash
eas project:info
```

### View Build History:
```bash
eas build:list
```

### View Specific Build:
```bash
eas build:view <BUILD_ID>
```

### Cancel Running Build:
```bash
eas build:cancel <BUILD_ID>
```

---

## 📞 Next Steps

1. ✅ **You did:** Update display name on EAS website
2. ⚠️ **You need:** Update project slug to "corecanteen" (or create new project)
3. 🚀 **Then run:** `eas build --platform ios --profile development`
4. ✅ **Result:** App will build and show as "CoreCanteen" when installed

---

**Status:** Almost Ready - Just need to update project slug!
**Last Updated:** 2025-11-20
**App Name Configuration:** ✅ Complete
**EAS Project:** ⚠️ Slug needs update
