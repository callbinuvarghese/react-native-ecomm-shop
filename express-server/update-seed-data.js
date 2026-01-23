import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_FILE = path.join(__dirname, 'data_dev.sql');

/**
 * Extract filename from fakestoreapi URL
 */
function extractFilename(url) {
  const match = url.match(/\/img\/([^/]+)$/);
  return match ? match[1] : null;
}

/**
 * Update seed data file to use local image paths
 */
function main() {
  console.log('📝 Updating seed data file...\n');

  // Read the seed data file
  let content = fs.readFileSync(SEED_FILE, 'utf-8');
  console.log(`Reading: ${SEED_FILE}`);

  // Find all fakestoreapi.com URLs
  const urlPattern = /https:\/\/fakestoreapi\.com\/img\/([^']+)/g;
  let matches = [...content.matchAll(urlPattern)];

  console.log(`Found ${matches.length} fakestoreapi.com URLs\n`);

  if (matches.length === 0) {
    console.log('✓ No URLs to update. Seed data is already using local paths.');
    return;
  }

  // Replace URLs with local paths
  let updatedCount = 0;
  content = content.replace(urlPattern, (match, filename) => {
    updatedCount++;
    const newPath = `/images/${filename}`;
    console.log(`  ${match} → ${newPath}`);
    return newPath;
  });

  // Backup original file
  const backupFile = SEED_FILE + '.backup';
  fs.copyFileSync(SEED_FILE, backupFile);
  console.log(`\n💾 Backup saved: ${backupFile}`);

  // Write updated content
  fs.writeFileSync(SEED_FILE, content, 'utf-8');
  console.log(`✅ Updated ${updatedCount} URLs in ${SEED_FILE}`);
  console.log('\nNext steps:');
  console.log('  1. Run: npm run db:seed');
  console.log('  2. This will update the database with local image paths');
}

main();
