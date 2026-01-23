import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { products } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Neon
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema: { products } });

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/keikaavousi/fake-store-api/master/public/img/';
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Download a file from URL to local path
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`  Downloading: ${url}`);
    const file = fs.createWriteStream(destPath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`  ✓ Saved to: ${path.basename(destPath)}`);
          resolve();
        });
      } else {
        fs.unlink(destPath, () => {});
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Extract filename from fakestoreapi URL
 */
function extractFilename(url) {
  const match = url.match(/\/img\/([^/]+)$/);
  return match ? match[1] : null;
}

/**
 * Main function to download images and update database
 */
async function main() {
  try {
    console.log('🔍 Fetching products from database...\n');

    // Get all products with fakestoreapi image URLs
    const allProducts = await db.select().from(products);
    const productsToUpdate = allProducts.filter(p =>
      p.productImage && p.productImage.includes('fakestoreapi.com')
    );

    console.log(`Found ${productsToUpdate.length} products with fakestoreapi.com images\n`);

    for (const product of productsToUpdate) {
      console.log(`📦 Processing: ${product.productName}`);
      console.log(`  Old URL: ${product.productImage}`);

      const filename = extractFilename(product.productImage);
      if (!filename) {
        console.log(`  ⚠️  Could not extract filename, skipping\n`);
        continue;
      }

      const githubUrl = `${GITHUB_BASE_URL}${filename}`;
      const localPath = path.join(IMAGES_DIR, filename);
      const newImageUrl = `/images/${filename}`;

      // Download image if it doesn't exist locally
      if (!fs.existsSync(localPath)) {
        try {
          await downloadFile(githubUrl, localPath);
        } catch (error) {
          console.log(`  ❌ Download failed: ${error.message}`);
          console.log(`  Skipping this product\n`);
          continue;
        }
      } else {
        console.log(`  ℹ️  Image already exists locally`);
      }

      // Update database
      console.log(`  Updating database with: ${newImageUrl}`);
      await db
        .update(products)
        .set({ productImage: newImageUrl })
        .where(eq(products.productId, product.productId));

      console.log(`  ✓ Updated successfully\n`);
    }

    console.log('✅ All images downloaded and database updated!');
    console.log(`📁 Images saved to: ${IMAGES_DIR}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
