import AnimatedHeader from '@/components/AnimatedHeader';
import AnimatedTabBar from '@/components/AnimatedTabBar';
import ExerciseCard from '@/components/ExerciseCard';
import { APP_CONSTANTS } from '@/constants/AppConstants';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { fetchBodyParts, fetchEquipmentList, fetchExercisesByBodyPart } from '@/services/exerciseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
   FadeInUp,
   useAnimatedScrollHandler,
   useAnimatedStyle,
   useSharedValue,
   withSpring
} from 'react-native-reanimated';

// Group exercises by body part
const groupExercisesByBodyPart = (exercises) => {
  return exercises.reduce((groups, exercise) => {
    const bodyPart = exercise.bodyPart;
    if (!groups[bodyPart]) {
      groups[bodyPart] = [];
    }
    groups[bodyPart].push(exercise);
    return groups;
  }, {});
};

// Map API exercise data to our expected format
const mapExerciseData = (apiExercise) => {
  return {
    id: apiExercise.id,
    name: apiExercise.name,
    bodyPart: apiExercise.bodyPart,
    target: apiExercise.target,
    equipment: apiExercise.equipment,
    gifUrl: apiExercise.gifUrl,
    secondaryMuscles: apiExercise.secondaryMuscles,
    instructions: apiExercise.instructions,
    description: apiExercise.instructions?.join(' ') || 'No description available',
    tips: ['Proper form is essential for effectiveness and injury prevention', 'Start with lighter weights and progress gradually', 'Maintain controlled movements throughout the exercise'],
    location: apiExercise.equipment?.toLowerCase().includes('bodyweight') ? 'home' : 'gym'
  };
};

export default function Index() {
  const [locationFilter, setLocationFilter] = useState('both'); // 'home', 'gym', or 'both'
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedBodyPartTemp, setSelectedBodyPartTemp] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [bodyPartsList, setBodyPartsList] = useState(APP_CONSTANTS.DEFAULT_BODY_PARTS);
  const [equipmentList, setEquipmentList] = useState(APP_CONSTANTS.DEFAULT_EQUIPMENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollOffset = useSharedValue(0);
  
  // Fetch body parts and equipment lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch body parts
        const bodyPartsData = await fetchBodyParts();
        if (bodyPartsData && bodyPartsData.length > 0) {
          setBodyPartsList(bodyPartsData);
        }
        
        // Fetch equipment list
        const equipmentData = await fetchEquipmentList();
        if (equipmentData && equipmentData.length > 0) {
          setEquipmentList(equipmentData);
        }
        
        // Load recent searches
        const recent = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.RECENT_SEARCHES);
        if (recent) {
          setRecentSearches(JSON.parse(recent));
        }
      } catch (err) {
        console.log('Failed to fetch body parts or equipment list, using defaults');
      }
    };
    
    fetchData();
  }, []);
  
  // Save search query to recent searches
  const saveSearchQuery = async (query) => {
    if (!query.trim()) return;
    
    try {
      const updatedSearches = [query, ...recentSearches.filter(search => search !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updatedSearches));
    } catch (err) {
      console.log('Failed to save recent search');
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveSearchQuery(searchQuery);
      // Perform search logic here
    }
  };
  
  // Handle recent search selection
  const handleRecentSearchSelect = (query) => {
    setSearchQuery(query);
    setShowRecentSearches(false);
    // Perform search logic here
  };
  
  // Clear recent searches
  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.RECENT_SEARCHES);
    } catch (err) {
      console.log('Failed to clear recent searches');
    }
  };
  
  // Define body parts
  const bodyParts = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs', 
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
  ];
  
  // Fetch exercises for a specific body part
  const loadExercises = async (bodyPart) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExercisesByBodyPart(bodyPart);
      // Map API data to our expected format
      const mappedData = data.map(exercise => mapExerciseData(exercise));
      setExercises(mappedData);
    } catch (err) {
      setError('Failed to load exercises. Please check your internet connection and try again.');
      console.error('Error loading exercises:', err);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle body part selection
  const handleBodyPartSelect = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    loadExercises(bodyPart);
  };
  
  // Reset selection
  const handleReset = () => {
    setSelectedBodyPart(null);
    setExercises([]);
    setError(null);
  };
  
  // Filter exercises based on location, equipment, and search query
  const filteredExercises = exercises.filter(exercise => {
    // Location filter
    const locationMatch = locationFilter === 'both' || exercise.location === locationFilter;
    
    // Equipment filter
    const equipmentMatch = !equipmentFilter || 
      exercise.equipment.toLowerCase().includes(equipmentFilter.toLowerCase());
    
    // Search filter
    const searchMatch = !searchQuery || 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return locationMatch && equipmentMatch && searchMatch;
  });
  
  const groupedExercises = groupExercisesByBodyPart(filteredExercises);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const handleLocationFilterChange = (filter) => {
    setLocationFilter(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedHeader scrollOffset={scrollOffset} />

      {!selectedBodyPart ? (
        // Body part selection view
        <Animated.View 
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.bodyPartSelection}
        >
          <Text style={styles.filterLabel}>Select Body Part</Text>
          <Animated.ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.bodyPartGrid}
          >
            {bodyPartsList.map((bodyPart, index) => (
              <Animated.View 
                key={bodyPart}
                entering={FadeInUp.duration(600).delay(200 + index * 50)}
                style={styles.bodyPartCard}
              >
                <TouchableOpacity 
                  style={[styles.bodyPartButton, selectedBodyPartTemp === bodyPart && styles.bodyPartButtonSelected]}
                  onPress={() => {
                    setSelectedBodyPartTemp(bodyPart);
                    setTimeout(() => {
                      handleBodyPartSelect(bodyPart);
                    }, 300);
                  }}
                >
                  <Text style={[styles.bodyPartText, selectedBodyPartTemp === bodyPart && styles.bodyPartTextSelected]}>{bodyPart}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.ScrollView>
        </Animated.View>
      ) : (
        // Exercises view
        <>
          <Animated.View 
            entering={FadeInUp.duration(600).delay(200)}
            style={styles.filterContainer}
          >
            <View style={styles.filterHeader}>
              <TouchableOpacity onPress={handleReset} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.selectedBodyPart}>{selectedBodyPart}</Text>
            </View>
            
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search exercises..."
                  placeholderTextColor={Colors.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setShowRecentSearches(true)}
                  onBlur={() => setTimeout(() => setShowRecentSearches(false), 150)}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setSearchQuery('')}
                  >
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {showRecentSearches && recentSearches.length > 0 && (
                <View style={styles.recentSearchesContainer}>
                  <View style={styles.recentSearchesHeader}>
                    <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearRecentSearches}>
                      <Text style={styles.clearRecentText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.recentSearchItem}
                      onPress={() => handleRecentSearchSelect(search)}
                    >
                      <Text style={styles.recentSearchText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text style={styles.resultCount}>{filteredExercises.length} exercises found</Text>
            </View>
            
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Workout Location</Text>
                <View style={styles.filterButtons}>
                  <FilterButton 
                    title="Home" 
                    active={locationFilter === 'home'} 
                    onPress={() => handleLocationFilterChange('home')} 
                  />
                  <FilterButton 
                    title="Gym" 
                    active={locationFilter === 'gym'} 
                    onPress={() => handleLocationFilterChange('gym')} 
                  />
                  <FilterButton 
                    title="Both" 
                    active={locationFilter === 'both'} 
                    onPress={() => handleLocationFilterChange('both')} 
                  />
                </View>
              </View>
              
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Equipment</Text>
                <View style={styles.equipmentFilterContainer}>
                  <TouchableOpacity 
                    style={[styles.equipmentOption, !equipmentFilter && styles.activeEquipmentOption]}
                    onPress={() => setEquipmentFilter('')}
                  >
                    <Text style={[styles.equipmentText, !equipmentFilter && styles.activeEquipmentText]}>All</Text>
                  </TouchableOpacity>
                  {equipmentList.map((equipment) => (
                    <TouchableOpacity 
                      key={equipment}
                      style={[styles.equipmentOption, equipmentFilter === equipment && styles.activeEquipmentOption]}
                      onPress={() => setEquipmentFilter(equipment)}
                    >
                      <Text style={[styles.equipmentText, equipmentFilter === equipment && styles.activeEquipmentText]}>
                        {equipment === 'Bodyweight' ? 'Body Weight' : equipment}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                onPress={handleReset}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.ScrollView 
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {Object.keys(groupedExercises).map((bodyPart, index) => (
                <Animated.View 
                  key={bodyPart}
                  entering={FadeInUp.duration(600).delay(300 + index * 100)}
                  style={styles.section}
                >
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{bodyPart}</Text>
                    <Text style={styles.exerciseCount}>{groupedExercises[bodyPart].length} exercises</Text>
                  </View>
                  <View style={styles.cardsContainer}>
                    {groupedExercises[bodyPart].map((exercise) => (
                      <ExerciseCard 
                        key={exercise.id} 
                        exercise={exercise} 
                      />
                    ))}
                  </View>
                </Animated.View>
              ))}
            </Animated.ScrollView>
          )}
        </>
      )}
      
      <AnimatedTabBar />
    </SafeAreaView>
  );
}

const FilterButton = ({ title, active, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.filterButton, active && styles.activeFilterButton]}
      >
        <Text style={[styles.filterButtonText, active && styles.activeFilterButtonText]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  filterLabel: {
    ...Typography.heading5,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    ...Typography.labelLarge,
    color: Colors.textSecondary,
  },
  activeFilterButtonText: {
    color: Colors.surface,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for the tab bar
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
  },
  exerciseCount: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    ...Typography.bodyLarge,
    color: Colors.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '600',
  },
  // Body part selection styles
  bodyPartSelection: {
    flex: 1,
    padding: 20,
  },
  bodyPartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bodyPartCard: {
    width: '48%',
    marginBottom: 15,
  },
  bodyPartButton: {
    backgroundColor: Colors.surface,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bodyPartButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  bodyPartText: {
    ...Typography.heading5,
    color: Colors.textPrimary,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  bodyPartTextSelected: {
    color: Colors.primary,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    ...Typography.labelLarge,
    color: Colors.primary,
  },
  selectedBodyPart: {
    ...Typography.heading5,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  // Equipment filter styles
  filterRow: {
    flexDirection: 'row',
    gap: 20,
  },
  filterGroup: {
    flex: 1,
  },
  equipmentFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipmentOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary,
  },
  activeEquipmentOption: {
    backgroundColor: Colors.primary,
  },
  equipmentText: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
  },
  activeEquipmentText: {
    color: Colors.surface,
    fontWeight: '600',
  },
  // Search styles
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    position: 'relative',
  },
  searchInput: {
    ...Typography.bodyLarge,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 15,
    paddingLeft: 20,
    paddingRight: 50,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Recent searches styles
  recentSearchesContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 200,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentSearchesTitle: {
    ...Typography.labelLarge,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  clearRecentText: {
    ...Typography.labelMedium,
    color: Colors.danger,
  },
  recentSearchItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentSearchText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  resultCount: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 5,
  },
});