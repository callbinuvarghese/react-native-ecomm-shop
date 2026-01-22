import Constants from 'expo-constants';

// Get API URL from environment or use default
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  'http://localhost:3000';

// Validate API URL on startup
if (!API_URL) {
  console.warn('⚠️ API_URL is not configured. Please set EXPO_PUBLIC_API_URL in your .env file');
}

export const config = {
  apiUrl: API_URL,
  apiTimeout: 10000, // 10 seconds
} as const;
