export const APP_CONSTANTS = {
  // API Configuration
  API_KEY: 'af6d35a6abmsh3befba971df4822p12fe4cjsnf6981e775fd9',
  API_HOST: 'exercisedb.p.rapidapi.com',
  BASE_URL: 'https://exercisedb.p.rapidapi.com',
  
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