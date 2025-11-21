# EAS Project Slug Update - Step by Step

## 🎯 Goal
Update the EAS project slug from `mobile-app` to `core-canteen` to match app.json

---

## ✅ Current Status

### app.json (Local - Correct ✅)
```json
{
  "expo": {
    "name": "CoreCanteen",           // ✅
    "slug": "core-canteen",          // ✅ Changed to match EAS
  }
}
```

### EAS Project (Website - Needs Update ⚠️)
```
Current slug: mobile-app
Needs to be: core-canteen
```

---

## 📝 Step-by-Step Instructions

### Step 1: Go to EAS Project Settings

**URL:**
```
https://expo.dev/accounts/zimbonash/projects/mobile-app/settings
```

**Or navigate manually:**
1. Go to https://expo.dev
2. Login if needed
3. Click on "zimbonash" account
4. Click on "mobile-app" project
5. Click "Settings" tab on the left

### Step 2: Find the Slug Setting

Look for a section called:
- **"Project Slug"** or
- **"Slug"** or
- **"Project Identifier"**

It should show: `mobile-app`

### Step 3: Change the Slug

**Change from:** `mobile-app`
**Change to:** `core-canteen`

⚠️ **Important:** Use `core-canteen` (with hyphen, lowercase, no spaces)

### Step 4: Save Changes

Click **"Save"** or **"Update"** button

---

## 🧪 Step 5: Test the Build

After updating on the website:

```bash
cd mobile-app

# Try building again
eas build --platform ios --profile development
```

**Expected Output (Success):**
```
✔ Synced project configuration to EAS
✔ Checking for build configuration...
✔ Project uploaded successfully
✔ Build in progress...
```

---

## ❓ Can't Find the Slug Setting?

### Option A: Slug Might Be Read-Only

If you can't edit the slug on the website, you have two options:

#### Option 1: Match app.json to EAS (Quick Fix)
Edit `app.json` back to:
```json
{
  "expo": {
    "slug": "mobile-app"  // Match what EAS has
  }
}
```

Then build will work, but URLs will have "mobile-app" in them.

#### Option 2: Create New EAS Project (Better)
See "Alternative: Create New Project" section below.

---

## 🔄 Alternative: Create New EAS Project

If you can't change the slug on EAS website:

### Step 1: Backup Current Configuration
```bash
# Save current app.json
cp app.json app.json.backup
```

### Step 2: Remove Project ID

Edit `app.json` - Remove the projectId temporarily:
```json
"extra": {
  "eas": {
    // Remove or comment out projectId
  }
}
```

### Step 3: Create New Project
```bash
cd mobile-app
eas build:configure
```

Answer prompts:
- **"Create a new project?"** → Type `y` and press Enter
- It will use slug `core-canteen` from your app.json
- New projectId will be added automatically

### Step 4: Build
```bash
eas build --platform ios --profile development
```

Should work now! ✅

---

## 📊 What Each Name Means

### 1. Display Name (EAS Website)
**You set this:** "core canteen" ✅
**Used for:** Just the EAS website UI for humans to read
**File:** Not in code, only on website

### 2. Project Slug (EAS Technical ID)
**Current:** "mobile-app" ⚠️
**Needs to be:** "core-canteen" ⚠️
**Used for:** EAS builds, expo URLs like exp://192.168.1.5/core-canteen
**File:** app.json → `"slug": "core-canteen"`

### 3. App Name (On Device)
**Current:** "CoreCanteen" ✅
**Used for:** Device home screen, app switcher
**File:** app.json → `"name": "CoreCanteen"` and iOS `CFBundleDisplayName`

---

## ✅ Verification

After updating the slug, verify:

### 1. Check app.json:
```json
{
  "expo": {
    "slug": "core-canteen"  // ✅ Lowercase, with hyphen
  }
}
```

### 2. Build succeeds:
```bash
eas build --platform ios --profile development

# Should NOT show: "Slug mismatch error"
# Should show: "Build in progress..."
```

### 3. App name on device:
When installed: **"CoreCanteen"** (no space, one word) ✅

---

## 🎯 Quick Summary

**What you need to do:**
1. Go to https://expo.dev/accounts/zimbonash/projects/mobile-app/settings
2. Find "Project Slug" or "Slug" setting
3. Change from `mobile-app` to `core-canteen`
4. Save changes
5. Run `eas build --platform ios --profile development`

**If you can't find or change the slug:**
- Create a new EAS project (see Alternative section above)

**Result:**
- App builds successfully ✅
- App shows as "CoreCanteen" on device ✅
- EAS and app.json match ✅

---

## 🆘 Still Having Issues?

### Error: "Slug mismatch"
**Cause:** EAS project slug doesn't match app.json
**Solution:** Follow steps above to update EAS website or create new project

### Error: "Invalid slug format"
**Cause:** Slug has spaces or capitals
**Solution:** Use `core-canteen` (lowercase, hyphen, no spaces) ✅ Already done!

### Error: "Authentication failed"
**Solution:** Run `eas login` first

### Build starts but fails:
**Solution:** Check build logs: `eas build:view <BUILD_ID>`

---

**Status:** app.json is correct ✅
**Action Needed:** Update EAS project slug on website ⚠️
**Expected Result:** App will build and show as "CoreCanteen" ✅
