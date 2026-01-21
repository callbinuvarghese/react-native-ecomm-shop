const { neon } = require('@neondatabase/serverless');
const { readFileSync } = require('fs');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: '.env' });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function seedData() {
  try {
    console.log('🌱 Seeding database with test data...');

    const sql = neon(DATABASE_URL);

    // Read the seed SQL file
    const seedPath = path.join(__dirname, 'data_dev.sql');
    const seedSQL = readFileSync(seedPath, 'utf-8');

    console.log('📦 Inserting products...');

    // Execute the seed SQL
    await sql.query(seedSQL);

    console.log('✅ Test data inserted successfully!');

    // Verify products were inserted
    const products = await sql`
      SELECT id, product_name, product_price
      FROM products
      ORDER BY id;
    `;

    console.log(`\n📋 Total products in database: ${products.length}`);
    console.log('\nSample products:');
    products.slice(0, 5).forEach((product) => {
      console.log(`   - [${product.id}] ${product.product_name} ($${product.product_price})`);
    });
    if (products.length > 5) {
      console.log(`   ... and ${products.length - 5} more`);
    }

  } catch (error) {
    if (error.message.includes('duplicate key')) {
      console.log('⚠️  Data already exists in database. Skipping seed.');
      console.log('   To re-seed, first delete existing products or modify the SQL.');
    } else {
      console.error('❌ Error:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  process.exit(0);
}

seedData();
