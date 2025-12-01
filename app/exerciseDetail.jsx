import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
   BounceIn,
   FadeInDown,
   FadeInUp,
   SlideInLeft,
   SlideInRight,
   useAnimatedStyle,
   useSharedValue,
   withSpring
} from 'react-native-reanimated';
import { SafeAreaView as SafeAreaViewContainer } from 'react-native-safe-area-context';

export default function ExerciseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [workoutSets, setWorkoutSets] = useState([]);
  const timerRef = useRef(null);
  
  // Fetch exercise data
  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        // Try to fetch by ID first
        try {
          const exerciseData = await fetchExerciseById(id);
          setExercise(mapExerciseData(exerciseData));
        } catch (err) {
          // If ID fetch fails, try to find by name
          console.log('Fetching by ID failed, trying by name...');
          const exercises = await fetchAllExercises();
          const foundExercise = exercises.find(ex => ex.id == id || ex.name === id);
          if (foundExercise) {
            setExercise(mapExerciseData(foundExercise));
          } else {
            setError('Exercise not found');
          }
        }
      } catch (err) {
        setError('Failed to load exercise details');
        console.error('Error loading exercise:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchExercise();
    }
  }, [id]);
  
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
  
  // Timer functions
  const startTimer = () => {
    if (!timerRunning) {
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
  };
  
  const pauseTimer = () => {
    if (timerRunning) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    }
  };
  
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerSeconds(0);
  };
  
  const addSet = () => {
    const newSet = {
      id: Date.now(),
      duration: timerSeconds,
      timestamp: new Date().toLocaleTimeString()
    };
    setWorkoutSets([...workoutSets, newSet]);
    resetTimer();
  };
  
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Get color based on body part
  const getBodyPartColor = (bodyPart) => {
    const colors = {
      chest: Colors.chest,
      back: Colors.back,
      arms: Colors.arms,
      legs: Colors.legs,
      core: Colors.core,
      shoulders: Colors.shoulders,
      default: Colors.secondary
    };
    return colors[bodyPart?.toLowerCase()] || colors.default;
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
      tips: ['Proper form is essential for effectiveness and injury prevention', 'Start with lighter weights and progress gradually', 'Maintain controlled movements throughout the exercise']
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading exercise details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Exercise not found</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaViewContainer style={styles.container}>
      <Animated.View 
        entering={FadeInDown.duration(600)}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{exercise.name}</Text>
        <TouchableOpacity 
          onPress={() => {
            // Share functionality would go here
            console.log('Share exercise:', exercise.name);
          }}
          style={styles.shareButton}
        >
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={BounceIn.delay(200)}
          style={styles.imageContainer}
        >
          <Image 
            source={{ uri: exercise.gifUrl || 'https://via.placeholder.com/400/' + getBodyPartColor(exercise.bodyPart || exercise.target).replace('#', '') + '/FFFFFF?text=' + exercise.name.charAt(0) }} 
            style={styles.image}
            onError={(e) => {
              // Fallback to placeholder if GIF fails to load
              e.target.onError = null;
              e.target.source = { uri: 'https://via.placeholder.com/400/' + getBodyPartColor(exercise.bodyPart || exercise.target).replace('#', '') + '/FFFFFF?text=' + exercise.name.charAt(0) };
            }}
          />
          
          {/* Animation Controls */}
          <View style={styles.animationControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => setIsPlaying(!isPlaying)}>
              <Text style={styles.controlText}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            
            <View style={styles.speedControls}>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 0.5 && styles.activeSpeedButton]} 
                onPress={() => setSpeed(0.5)}
              >
                <Text style={[styles.speedText, speed === 0.5 && styles.activeSpeedText]}>0.5x</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 1 && styles.activeSpeedButton]} 
                onPress={() => setSpeed(1)}
              >
                <Text style={[styles.speedText, speed === 1 && styles.activeSpeedText]}>1x</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 2 && styles.activeSpeedButton]} 
                onPress={() => setSpeed(2)}
              >
                <Text style={[styles.speedText, speed === 2 && styles.activeSpeedText]}>2x</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.controlButton} onPress={() => setLoop(!loop)}>
              <Text style={[styles.controlText, loop && styles.activeLoop]}>{loop ? '🔁' : '🔂'}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Timer Controls */}
          <View style={styles.timerContainer}>
            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
            </View>
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.timerButton, timerRunning && styles.timerButtonActive]}
                onPress={timerRunning ? pauseTimer : startTimer}
              >
                <Text style={styles.timerButtonText}>{timerRunning ? '⏸ Pause' : '▶ Start'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, styles.resetButton]}
                onPress={resetTimer}
              >
                <Text style={styles.timerButtonText}>↺ Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timerButton, styles.addButton]}
                onPress={addSet}
              >
                <Text style={styles.timerButtonText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={SlideInLeft.duration(600).delay(300)}
          style={styles.infoContainer}
        >
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.locationBadge, { backgroundColor: exercise.location === 'home' ? Colors.success : exercise.location === 'gym' ? Colors.primary : Colors.warning }]}>
              <Text style={styles.badgeText}>{exercise.location === 'home' ? 'Home' : 'Gym'}</Text>
            </View>
            <View style={[styles.badge, styles.bodyPartBadge, { backgroundColor: getBodyPartColor(exercise.bodyPart || exercise.target) }]}>
              <Text style={styles.badgeText}>{exercise.bodyPart || exercise.target}</Text>
            </View>
            <View style={[styles.badge, styles.equipmentBadge, { backgroundColor: Colors.accent }]}>
              <Text style={styles.badgeText}>{exercise.equipment}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{exercise.description || (exercise.instructions && Array.isArray(exercise.instructions) ? exercise.instructions.join(' ') : exercise.instructions)}</Text>

          {/* Exercise Metadata */}
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Target Muscle:</Text>
              <Text style={styles.metadataValue}>{exercise.target || exercise.bodyPart}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Equipment:</Text>
              <Text style={styles.metadataValue}>{exercise.equipment}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Secondary Muscles:</Text>
              <Text style={styles.metadataValue}>{exercise.secondaryMuscles && Array.isArray(exercise.secondaryMuscles) ? exercise.secondaryMuscles.join(', ') : 'None'}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={SlideInRight.duration(600).delay(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          {(Array.isArray(exercise.instructions) ? exercise.instructions : [exercise.instructions || 'No instructions available']).map((step, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.duration(300).delay(500 + index * 100)}
              style={styles.stepContainer}
            >
              <View style={[styles.stepNumberContainer, { backgroundColor: getBodyPartColor(exercise.bodyPart) }]}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={SlideInLeft.duration(600).delay(500)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Workout Sets</Text>
          </View>
          {workoutSets.length === 0 ? (
            <Text style={styles.noSetsText}>No sets recorded yet. Start the timer to track your workout!</Text>
          ) : (
            workoutSets.map((set, index) => (
              <View key={set.id} style={styles.setContainer}>
                <Text style={styles.setText}>Set {index + 1}</Text>
                <Text style={styles.setTimeText}>{formatTime(set.duration)}</Text>
                <Text style={styles.setTimestamp}>{set.timestamp}</Text>
              </View>
            ))
          )}
        </Animated.View>
        
        <Animated.View 
          entering={SlideInRight.duration(600).delay(600)}
          style={[styles.section, styles.lastSection]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={24} color={Colors.warning} />
            <Text style={styles.sectionTitle}>Tips</Text>
          </View>
          {(exercise.tips && Array.isArray(exercise.tips) ? exercise.tips : ['Proper form is essential for effectiveness and injury prevention', 'Start with lighter weights and progress gradually', 'Maintain controlled movements throughout the exercise']).map((tip, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.duration(300).delay(700 + index * 100)}
              style={styles.tipContainer}
            >
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} style={styles.tipIcon} />
              <Text style={styles.tipText}>{tip}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: Colors.backgroundDark,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
  },
  title: {
    ...Typography.heading4,
    color: Colors.surface,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 220,
    backgroundColor: Colors.surfaceSecondary,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationBadge: {
    backgroundColor: Colors.success,
  },
  bodyPartBadge: {
    backgroundColor: Colors.secondary,
  },
  equipmentBadge: {
    backgroundColor: Colors.accent,
  },
  badgeText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '700',
  },
  description: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  // Metadata styles
  metadataContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metadataLabel: {
    ...Typography.labelLarge,
    color: Colors.textSecondary,
    fontWeight: '600',
    width: 150,
  },
  metadataValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    flex: 1,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  lastSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumber: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '700',
  },
  stepText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    flex: 1,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 15,
    marginTop: 3,
  },
  tipText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    flex: 1,
  },
  // Workout sets styles
  noSetsText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  setContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  setText: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  setTimeText: {
    ...Typography.bodyLarge,
    color: Colors.primary,
    fontWeight: '600',
  },
  setTimestamp: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  // Animation controls styles
  animationControls: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  controlButton: {
    padding: 8,
  },
  controlText: {
    fontSize: 16,
    color: 'white',
  },
  activeLoop: {
    color: Colors.success,
  },
  speedControls: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    gap: 5,
  },
  speedButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  activeSpeedButton: {
    backgroundColor: Colors.primary,
  },
  speedText: {
    fontSize: 12,
    color: 'white',
  },
  activeSpeedText: {
    fontWeight: 'bold',
  },
  // Timer styles
  timerContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 15,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: Colors.success,
  },
  resetButton: {
    backgroundColor: Colors.danger,
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  timerButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 20,
  },
  retryButton: {
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
});