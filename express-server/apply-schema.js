import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: '.env' });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function main() {
  try {
    console.log('🔗 Connecting to Neon database...');

    const sql = neon(DATABASE_URL);

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'src/db/migrations/0000_military_ma_gnuci.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📦 Creating tables...');

    // Split the migration SQL into individual statements
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`   Found ${statements.length} SQL statements to execute`);

    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);
        try {
          await sql.query(statement);
        } catch (error) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists')) {
            throw error;
          } else {
            console.log(`   (Table/constraint already exists, skipping)`);
          }
        }
      }
    }

    console.log('✅ Tables created successfully!');

    // Verify tables were created
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('\n📋 Created tables:');
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
