import { ENV } from '../config/env';

export const APP_CONSTANTS = {
  // API Configuration
  API_KEY: ENV.EXERCISE_DB_API_KEY,
  API_HOST: ENV.EXERCISE_DB_API_HOST,
  BASE_URL: ENV.EXERCISE_DB_BASE_URL,
  
  // Default body parts (lowercase to match API)
  DEFAULT_BODY_PARTS: [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs', 
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
  ],
  
  // Default equipment
  DEFAULT_EQUIPMENT: [
    'Bodyweight', 'Dumbbells', 'Barbell', 'Resistance Band', 'Kettlebell'
  ],
  
  // Animation speeds
  ANIMATION_SPEEDS: {
    SLOW: 0.5,
    NORMAL: 1,
    FAST: 2
  },
  
  // Storage keys
  STORAGE_KEYS: {
    FAVORITES: 'favorite_exercises',
    RECENT_SEARCHES: 'recent_searches'
  }
};