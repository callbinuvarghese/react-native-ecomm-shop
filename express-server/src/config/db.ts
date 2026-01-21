import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
// @ts-ignore - env.js is a JavaScript file
import { ENV } from "./env.js";
import * as schema from "../db/schema";
import ws from 'ws';

console.log('Connecting to database...');
console.log('Database URL exists:', !!ENV.DATABASE_URL);

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: ENV.DATABASE_URL });

export const db = drizzle(pool, { schema });

console.log('Database connection initialized');
