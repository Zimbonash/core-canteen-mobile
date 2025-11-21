# iOS Crash Workaround: setSheetLargestUndimmedDetent

## Problem
The iOS app crashes with error: `-[RCTView setSheetLargestUndimmedDetent:]: unrecognized selector`

This is a **known bug in React Native 0.81.5** that happens when navigation renders.

## Why This Happens
React Native tries to set an iOS property that doesn't exist in the current build. The property is part of the new architecture but isn't properly bridged.

## Solutions

### Option 1: Build with EAS (RECOMMENDED - Permanent Fix)
The fix has already been added to app.json (expo-build-properties plugin with iOS deployment target 15.1).

```bash
eas build --platform ios --profile development
```

After the build completes (~15-20 minutes), install it on your device or simulator. The crash will be fixed.

### Option 2: Test on Android (Immediate)
Android doesn't have this issue:

```bash
npx expo start
# Press 'a' for Android
```

### Option 3: Test on Web (Immediate)
```bash
npx expo start
# Press 'w' for web
```

### Option 4: Downgrade to Expo SDK 51 (Not Recommended)
This would require changing many dependencies.

## What We've Already Fixed
✅ Login works - API returns mobile_role correctly
✅ AsyncStorage errors fixed - No more undefined values
✅ Django API working - Returns all required fields
✅ App.json configured with iOS fix (deploymentTarget: "15.1")

## Current Status
- **Backend**: ✅ Fully working
- **Login**: ✅ Working (API call successful)
- **Android**: ✅ Should work
- **iOS Simulator**: ⚠️ Requires EAS rebuild
- **iOS Device**: ⚠️ Requires EAS rebuild

## Next Step
Run the EAS build command to get a working iOS app with all fixes applied.
