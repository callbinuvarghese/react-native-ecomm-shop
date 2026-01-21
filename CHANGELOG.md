# Changelog

## [2.0.0] - 2026-01-21

### Backend (Express Server)

#### Added
- ✅ GET `/orders` endpoint - Fetch all orders
- ✅ GET `/orders/:id` endpoint - Fetch order by ID with items and product details
- ✅ Database migration system using Drizzle ORM
- ✅ Seed data system with `npm run db:seed`
- ✅ Database setup script `npm run db:setup`
- ✅ Created `apply-schema.js` for reliable schema migrations
- ✅ Created `seed-data.js` for populating test data
- ✅ Switched to Neon WebSocket driver for better compatibility

#### Updated
- Drizzle ORM: 0.27.2 → 0.44.2
- Drizzle Kit: 0.19.0 → 0.29.1
- Express: 4.18.2 → 5.1.0
- Database driver from `pg` to `@neondatabase/serverless` Pool
- Updated database configuration for AURA Coding Space environment

#### Fixed
- Database connection timeout issues
- SSL configuration for Neon PostgreSQL
- `.env` file now properly ignored in git
- Removed obsolete migration files

#### Removed
- ❌ `migrate.ts` - replaced with `apply-schema.js`
- ❌ `push-schema.ts` - not needed
- ❌ `test-connection.js` - debugging file

---

### Frontend (React Native App)

#### Added
- ✅ Windows compatibility fix with `metro.config.js`
- ✅ `WINDOWS_FIX.md` troubleshooting guide
- ✅ `.env.example` with detailed configuration
- ✅ `itemCount` property in cart store
- ✅ Custom `ApiError` class for better error handling
- ✅ `fetchOrders()` API function
- ✅ Strict TypeScript mode enabled

#### Updated
- Expo SDK: 49.0.5 → 52.0.11
- React: 18.2.0 → 18.3.1
- React Native: 0.72.3 → 0.76.5
- React Navigation: Updated all packages to latest
- Zustand: 4.3.9 → 5.0.2
- TypeScript: 5.1.3 → 5.7.2
- @babel/core: 7.20.0 → 7.25.0

#### Improved
- API layer completely refactored with type-safe error handling
- Cart store now uses immutable state updates (no mutations)
- Better code organization and modern React patterns
- Comprehensive README with setup instructions
- TypeScript configuration with strict mode

#### Fixed
- State mutation bug in Zustand cart store
- Negative cart total bug
- Windows `node:sea` directory creation error
- API error messages now more descriptive

---

## [1.0.0] - Initial Release

### Features
- Express API server with PostgreSQL
- React Native mobile app with Expo
- Product listing and detail views
- Shopping cart with Zustand state management
- Order creation functionality
- Integration with Neon PostgreSQL database

---

## Migration Guide

### For Backend Developers

**Old workflow:**
```bash
npm install
npm run generate
npm run migrate  # This used to fail
```

**New workflow:**
```bash
npm install
npm run db:setup  # Creates tables and seeds data
npm run dev       # Start server
```

### For Frontend Developers (Windows)

**If you get the `node:sea` error:**
```powershell
Remove-Item -Recurse -Force .expo
npx expo start -c
```

**Update your `.env` file:**
```env
# Use your computer's IP for physical device testing
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000

# Or use AURA public URL
EXPO_PUBLIC_API_URL=https://3000-your-space.aura.com
```

---

## API Endpoints

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details

### Orders
- `GET /orders` - List all orders
- `GET /orders/:id` - Get order with items
- `POST /orders` - Create new order

---

## Database Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate migrations from schema |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Load test data |
| `npm run db:setup` | Full setup (tables + data) |
| `node apply-schema.js` | Apply migrations manually |

---

## Tech Stack

### Backend
- Node.js + Express
- Drizzle ORM
- Neon PostgreSQL (serverless)
- TypeScript

### Frontend
- React Native 0.76.5
- Expo SDK 52
- React Navigation 6
- Zustand 5 (state management)
- TypeScript (strict mode)
