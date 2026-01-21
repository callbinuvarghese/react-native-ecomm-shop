# React Native Shopping App

This is a simple shopping app built with React Native and Expo using a Node.js backend with [Neon database](https://neon.tech/).

## Getting Started

### Prerequisites
- Node.js installed
- Expo Go app on your mobile device (iOS/Android)
- Backend server running (see `express-server` directory)

### Installation

1. Clone the repo and navigate to this directory:
   ```bash
   cd myShop-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in this directory:
   ```env
   # For local development on same machine
   EXPO_PUBLIC_API_URL=http://localhost:3000

   # OR for testing on physical device (replace with your computer's IP)
   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
   ```

4. Start the Expo development server:
   ```bash
   npx expo start -c
   ```

### Windows Users - Important! ⚠️

If you encounter this error on Windows:
```
Error: ENOENT: no such file or directory, mkdir 'node:sea'
```

**Quick Fix:**
```powershell
Remove-Item -Recurse -Force .expo
npx expo start -c
```

For more solutions, see **[WINDOWS_FIX.md](./WINDOWS_FIX.md)**

A `metro.config.js` file is included to help prevent this Windows-specific issue.

### Finding Your Computer's IP Address

**Windows (PowerShell):**
```powershell
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**macOS/Linux:**
```bash
ifconfig | grep "inet "
# OR
ip addr show
```

### Running on Device

1. Install **Expo Go** app from:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Make sure your phone and computer are on the **same WiFi network**

3. Scan the QR code shown in the terminal with:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app

4. Make sure the backend server is running and accessible from your phone

## Preview
<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/app.gif" width="30%">
<img src="./screenshots/1.png" width=30%>
<img src="./screenshots/2.png" width=30%>
<img src="./screenshots/3.png" width=30%>
<img src="./screenshots/4.png" width=30%>
</div>

## Features

- Browse products from the backend API
- View product details
- Add products to cart
- Manage shopping cart
- Animated cart experience
- State management with Zustand

## Troubleshooting

### App shows "Network request failed"
- Verify the backend server is running on port 3000
- Check your `.env` file has the correct IP address
- Ensure phone and computer are on the same WiFi network
- Try disabling firewall temporarily

### Can't scan QR code
- Press `w` in the terminal to open in web browser
- Press `a` for Android emulator (if installed)
- Press `i` for iOS simulator (macOS only)

### App crashes on start
```bash
# Clear cache and restart
npx expo start -c --clear
```
