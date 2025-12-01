import { APP_CONSTANTS } from '@/constants/AppConstants';
import axios from 'axios';

// API Configuration
const API_KEY = APP_CONSTANTS.API_KEY;
const API_HOST = APP_CONSTANTS.API_HOST;
const BASE_URL = APP_CONSTANTS.BASE_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
});

// Fetch all exercises
export const fetchAllExercises = async () => {
  try {
    const response = await apiClient.get('/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

// Fetch exercises by body part
export const fetchExercisesByBodyPart = async (bodyPart) => {
  try {
    const response = await apiClient.get(`/exercises/bodyPart/${bodyPart}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for ${bodyPart}:`, error);
    throw error;
  }
};

// Fetch exercises by equipment
export const fetchExercisesByEquipment = async (equipment) => {
  try {
    const response = await apiClient.get(`/exercises/equipment/${equipment}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for ${equipment}:`, error);
    throw error;
  }
};

// Fetch exercises by target muscle
export const fetchExercisesByTarget = async (target) => {
  try {
    const response = await apiClient.get(`/exercises/target/${target}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for ${target}:`, error);
    throw error;
  }
};

// Fetch exercises by name
export const fetchExercisesByName = async (name) => {
  try {
    const response = await apiClient.get(`/exercises/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for ${name}:`, error);
    throw error;
  }
};

// Fetch exercise by ID
export const fetchExerciseById = async (id) => {
  try {
    const response = await apiClient.get(`/exercises/exercise/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${id}:`, error);
    throw error;
  }
};

// Fetch all body parts
export const fetchBodyParts = async () => {
  try {
    const response = await apiClient.get('/exercises/bodyPartList');
    return response.data;
  } catch (error) {
    console.error('Error fetching body parts:', error);
    throw error;
  }
};

// Fetch all equipment
export const fetchEquipmentList = async () => {
  try {
    const response = await apiClient.get('/exercises/equipmentList');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment list:', error);
    throw error;
  }
};