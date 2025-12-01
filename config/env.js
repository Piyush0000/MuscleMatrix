// config/env.js
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

// Export environment variables
export const ENV = {
  EXERCISE_DB_API_KEY: process.env.EXERCISE_DB_API_KEY || 'af6d35a6abmsh3befba971df4822p12fe4cjsnf6981e775fd9',
  EXERCISE_DB_API_HOST: process.env.EXERCISE_DB_API_HOST || 'exercisedb.p.rapidapi.com',
  EXERCISE_DB_BASE_URL: process.env.EXERCISE_DB_BASE_URL || 'https://exercisedb.p.rapidapi.com',
};