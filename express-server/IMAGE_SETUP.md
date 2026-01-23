# Product Image Management

This guide explains how to download product images from GitHub and serve them locally.

## Overview

The seed data originally used image URLs from `https://fakestoreapi.com/`, but those images are no longer available. The actual images are stored in the [fake-store-api GitHub repository](https://github.com/keikaavousi/fake-store-api/tree/master/public/img/).

This solution:
1. Downloads images from GitHub to a local `public/images/` directory
2. Updates the database to use local image paths (e.g., `/images/61pHAEJ4NML._AC_UX679_.jpg`)
3. Serves images via Express static middleware

## Quick Start

Run all steps at once:

```bash
npm run images:setup
```

This will:
1. Update `data_dev.sql` to use local paths
2. Download all images from GitHub
3. Update the database with local image URLs

## Step-by-Step Process

### 1. Update Seed Data File

Update the SQL file to use local paths instead of fakestoreapi.com URLs:

```bash
npm run images:update-seed
```

This creates:
- `data_dev.sql` - Updated with local paths
- `data_dev.sql.backup` - Original file backup

### 2. Download Images

Download all product images from GitHub:

```bash
npm run images:download
```

This will:
- Fetch all products with fakestoreapi.com URLs from the database
- Download images from GitHub to `public/images/`
- Update database records with local paths (e.g., `/images/filename.jpg`)
- Skip images that already exist locally

### 3. Re-seed Database (if needed)

If you want to start fresh with the updated seed data:

```bash
npm run db:seed
```

## How It Works

### Static File Serving

The Express server serves images from `public/images/` at the `/images` route:

```typescript
app.use('/images', express.static(path.join(publicPath, 'images')));
```

### Image URLs

- **Old format**: `https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg`
- **New format**: `/images/61pHAEJ4NML._AC_UX679_.jpg`

### Accessing Images

Once the server is running, images are accessible at:

- Local: `http://localhost:3000/images/61pHAEJ4NML._AC_UX679_.jpg`
- Network: `http://192.168.1.18:3000/images/61pHAEJ4NML._AC_UX679_.jpg`

The React Native app will automatically use these URLs when displaying products.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run images:setup` | Complete setup: update seed data and download images |
| `npm run images:update-seed` | Update `data_dev.sql` to use local paths |
| `npm run images:download` | Download images from GitHub and update database |

## Directory Structure

```
express-server/
├── public/
│   └── images/               # Downloaded product images
│       ├── 61pHAEJ4NML._AC_UX679_.jpg
│       ├── 61mtL65D4cL._AC_SX679_.jpg
│       └── ...
├── data_dev.sql              # Seed data (updated with local paths)
├── data_dev.sql.backup       # Original seed data backup
├── download-images.js        # Script to download images
└── update-seed-data.js       # Script to update SQL file
```

## Troubleshooting

### Images not loading

1. Check that images exist in `public/images/`:
   ```bash
   ls public/images/
   ```

2. Verify the Express server is serving static files:
   - Look for `📁 Serving static images from:` message on startup

3. Test image URL directly:
   ```bash
   curl http://localhost:3000/images/61pHAEJ4NML._AC_UX679_.jpg
   ```

### Download failed

If GitHub downloads fail, you can manually download images from:
https://github.com/keikaavousi/fake-store-api/tree/master/public/img/

Save them to `express-server/public/images/`

### Database still has old URLs

Run the download script again - it will update the database:

```bash
npm run images:download
```
