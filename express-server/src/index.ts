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
app.use(express.json());

import shopRouter from './shop';
app.use(shopRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
