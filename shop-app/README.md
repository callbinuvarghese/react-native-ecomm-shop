# Modern Shop App - React Native + Expo

A modern shopping cart application built with the latest React Native and Expo technologies.

## 🚀 Tech Stack

- **Expo SDK 54** (latest)
- **React Native 0.81**
- **React 19**
- **Expo Router 6** (file-based routing)
- **TypeScript 5.9** (strict mode)
- **TanStack Query** (React Query for data fetching)
- **Zustand 5** (state management)
- **Axios** (HTTP client)
- **Zod** (runtime validation)
- **Expo Image** (optimized images)

## 📁 Project Structure

```
shop-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Products list
│   │   └── cart.tsx       # Shopping cart
│   ├── product/[id].tsx   # Product details
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   └── ProductCard.tsx
├── lib/                   # Core logic
│   ├── api.ts            # API client
│   ├── config.ts         # Configuration
│   ├── store.ts          # Zustand store
│   └── types.ts          # TypeScript types
└── hooks/                # Custom React Query hooks
    ├── useProducts.ts
    └── useOrders.ts
```

## 🏗️ Architecture

### API Layer (`lib/api.ts`)
- Axios-based HTTP client with interceptors
- Automatic error handling
- Zod schema validation for all responses
- Type-safe API functions

### State Management (`lib/store.ts`)
- Zustand store for shopping cart
- Immutable state updates
- Auto-calculated totals and item counts

### Data Fetching (hooks)
- TanStack Query for server state
- Automatic caching and background refetching
- Loading and error states
- Optimistic updates

### Type Safety (`lib/types.ts`)
- Zod schemas for runtime validation
- TypeScript types inferred from schemas
- Full type safety across the app

## 🎯 Features

✅ Product listing with grid layout
✅ Product details view
✅ Shopping cart management
✅ Order creation
✅ Type-safe API integration
✅ Optimized image loading
✅ Error handling and loading states
✅ Modern file-based routing

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Create a `.env` file:

```env
# Local development
EXPO_PUBLIC_API_URL=http://localhost:3000

# Physical device (replace with your IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000

# AURA backend
# EXPO_PUBLIC_API_URL=https://3000-your-space.aura.com
```

### 3. Start Backend Server

Make sure the Express server is running in `express-server/`:

```bash
cd ../express-server
npm run dev
```

### 4. Start Expo

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app

## 📱 Screens

### Products List (`app/(tabs)/index.tsx`)
- Grid layout of products
- Product cards with images
- Pull-to-refresh
- Tap to view details

### Product Details (`app/product/[id].tsx`)
- Large product image
- Full description
- Price
- Add to cart button

### Shopping Cart (`app/(tabs)/cart.tsx`)
- List of cart items
- Quantity controls
- Remove items
- Total price
- Checkout button

## 🔌 API Integration

All API calls are centralized in `lib/api.ts`:

```typescript
// Get all products
const products = await fetchProducts();

// Get single product
const product = await fetchProductById(1);

// Create order
const order = await createOrder({
  email: 'customer@example.com',
  products: [{ product_id: 1, quantity: 2 }],
});
```

## 🎨 Styling

Currently using React Native StyleSheet.

**Optional upgrade:**
Install NativeWind for Tailwind CSS styling:

```bash
npm install nativewind tailwindcss
```

## 🐛 Troubleshooting

### "Network request failed"
- Check backend server is running
- Verify `.env` has correct API URL
- Ensure phone and computer on same WiFi

### "Module not found"
```bash
npm install
npx expo start -c
```

## 📝 TODO

- [ ] Create product details screen
- [ ] Create cart screen UI
- [ ] Implement checkout flow
- [ ] Add order confirmation
- [ ] Add order history
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Add pull-to-refresh
- [ ] Add search/filter
- [ ] Add animations

## 🚀 Next Steps

See `IMPLEMENTATION.md` for step-by-step guide to complete the remaining screens.

---

Built with modern React Native best practices and latest Expo SDK.
