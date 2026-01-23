import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/keikaavousi/fake-store-api/master/public/img/';
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Image filenames from data_dev.sql
const imageFiles = [
  '61pHAEJ4NML._AC_UX679_.jpg',
  '61mtL65D4cL._AC_SX679_.jpg',
  '81XH0e8fefL._AC_UL640_QL65_ML3_.jpg',
  '61U7T1koQqL._AC_SX679_.jpg',
  '61IBBVJvSDL._AC_SY879_.jpg',
  '51Y5NI-I5jL._AC_UX679_.jpg',
  '81Zt42ioCgL._AC_SX679_.jpg',
  '81fPKd-2AYL._AC_SL1500_.jpg'
];

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`📁 Created directory: ${IMAGES_DIR}\n`);
}

/**
 * Download a file from URL to local path
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        file.close();
        fs.unlink(destPath, () => {});
        if (response.headers.location) {
          https.get(response.headers.location, (redirectResponse) => {
            const redirectFile = fs.createWriteStream(destPath);
            redirectResponse.pipe(redirectFile);
            redirectFile.on('finish', () => {
              redirectFile.close();
              resolve();
            });
          }).on('error', (err) => {
            reject(err);
          });
        } else {
          reject(new Error(`Redirect without location header`));
        }
      } else {
        file.close();
        fs.unlink(destPath, () => {});
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Main function to download all product images
 */
async function main() {
  console.log('🖼️  Downloading product images from GitHub...\n');
  console.log(`Source: ${GITHUB_BASE_URL}`);
  console.log(`Destination: ${IMAGES_DIR}\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of imageFiles) {
    const url = `${GITHUB_BASE_URL}${filename}`;
    const destPath = path.join(IMAGES_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      console.log(`⏭️  ${filename} - already exists`);
      skipped++;
      continue;
    }

    try {
      console.log(`⬇️  ${filename} - downloading...`);
      await downloadFile(url, destPath);
      console.log(`✅ ${filename} - downloaded successfully`);
      downloaded++;
    } catch (error) {
      console.error(`❌ ${filename} - failed: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Downloaded: ${downloaded}`);
  console.log(`   ⏭️  Skipped (already exist): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('='.repeat(50));

  if (downloaded > 0 || skipped > 0) {
    console.log('\n✨ Images are now available at:');
    console.log(`   Local: http://localhost:3000/images/`);
    console.log(`   Example: http://localhost:3000/images/${imageFiles[0]}`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
