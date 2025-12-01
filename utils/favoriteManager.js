import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorite_exercises';

// Add exercise to favorites
export const addFavorite = async (exerciseId) => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(exerciseId)) {
      favorites.push(exerciseId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

// Remove exercise from favorites
export const removeFavorite = async (exerciseId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== exerciseId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

// Get all favorite exercise IDs
export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Check if exercise is favorited
export const isFavorite = async (exerciseId) => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(exerciseId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};