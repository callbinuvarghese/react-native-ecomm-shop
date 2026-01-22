import express from 'express';
// @ts-ignore - env.js is a JavaScript file
import { ENV } from "./config/env.js";

const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === 'production') {
  console.log('Running in production mode.');
} else {
  console.log('Running in development mode.');
}


const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log request body for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && Object.keys(req.body || {}).length > 0) {
    console.log('  Body:', JSON.stringify(req.body, null, 2));
  }

  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log('  Query:', req.query);
  }

  // Log response time and status code
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    console.log(`  ${statusColor}${res.statusCode}${resetColor} - ${duration}ms`);
  });

  next();
});

app.use(express.json());

import shopRouter from './shop';
app.use(shopRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
