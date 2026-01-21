# Windows Expo Start Error Fix

## Problem
When running `npx expo start` on Windows, you get:
```
Error: ENOENT: no such file or directory, mkdir 'node:sea'
```

This happens because Windows doesn't allow colons (`:`) in file/directory names.

## Solutions (Try in order)

### Solution 1: Update Expo CLI (Quickest)

Run these commands in PowerShell from the `myShop-app` directory:

```powershell
# Update Expo CLI globally
npm install -g expo-cli@latest

# Update local Expo packages
npx expo install --fix

# Clear cache and start
npx expo start -c
```

### Solution 2: Upgrade to Latest Expo SDK (Recommended for long-term)

```powershell
# Backup your current package.json first!

# Upgrade Expo SDK to latest (currently 52)
npx expo install expo@latest

# Upgrade all Expo dependencies
npx expo install --fix

# Clear all caches
npx expo start -c --clear
```

### Solution 3: Use Metro Config Workaround

If updating doesn't work, create a `metro.config.js` file in the `myShop-app` directory:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for Windows path issue
config.resolver.platforms = ['ios', 'android', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
```

Then run:
```powershell
npx expo start -c
```

### Solution 4: Delete .expo folder and restart

```powershell
# Delete the .expo folder
Remove-Item -Recurse -Force .expo

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Start fresh
npx expo start -c
```

### Solution 5: Use Tunnel mode (Temporary workaround)

```powershell
npx expo start --tunnel
```

## After fixing, update your .env file

Make sure your `.env` file points to the correct API:

```env
# For local development on the same machine
EXPO_PUBLIC_API_URL=http://localhost:3000

# For testing on physical device (replace with your PC's IP)
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
```

## Verify it's working

Once Expo starts successfully, you should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

Then you can:
1. Scan QR code with Expo Go app on your phone
2. Press `w` to open in web browser
3. Press `a` for Android emulator
4. Press `i` for iOS simulator (Mac only)
