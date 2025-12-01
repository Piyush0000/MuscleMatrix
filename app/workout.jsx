import AnimatedHeader from '@/components/AnimatedHeader';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView as SafeAreaViewContainer } from 'react-native-safe-area-context';

export default function Workout() {
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [workoutName, setWorkoutName] = useState('My Workout');
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const timerRef = useRef(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Timer functions
  const startWorkout = () => {
    if (!isWorkoutActive) {
      setIsWorkoutActive(true);
      timerRef.current = setInterval(() => {
        setWorkoutDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const pauseWorkout = () => {
    if (isWorkoutActive) {
      clearInterval(timerRef.current);
      setIsWorkoutActive(false);
    }
  };

  const resetWorkout = () => {
    clearInterval(timerRef.current);
    setIsWorkoutActive(false);
    setWorkoutDuration(0);
    setWorkoutExercises([]);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add exercise to workout
  const addExercise = () => {
    router.push('/');
  };

  // Remove exercise from workout
  const removeExercise = (id) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== id));
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaViewContainer style={styles.container}>
      <AnimatedHeader scrollOffset={scrollOffset} />

      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.header}
      >
        <Text style={styles.title}>{workoutName}</Text>
        <Text style={styles.timer}>{formatTime(workoutDuration)}</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, isWorkoutActive ? styles.pauseButton : styles.startButton]}
            onPress={isWorkoutActive ? pauseWorkout : startWorkout}
          >
            <Text style={styles.controlButtonText}>
              {isWorkoutActive ? '⏸ Pause Workout' : '▶ Start Workout'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetWorkout}
          >
            <Text style={styles.controlButtonText}>↺ Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addExercise}
            >
              <Text style={styles.addButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>
          
          {workoutExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No exercises added yet</Text>
              <Text style={styles.emptySubtext}>Add exercises to start your workout</Text>
            </View>
          ) : (
            workoutExercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeExercise(exercise.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
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
  title: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  timer: {
    ...Typography.heading4,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  controlButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: Colors.success,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  resetButton: {
    backgroundColor: Colors.danger,
  },
  controlButtonText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.heading4,
    color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    ...Typography.labelMedium,
    color: Colors.surface,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.heading5,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  emptySubtext: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 5,
  },
  exerciseDetails: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    fontSize: 18,
    color: Colors.danger,
    fontWeight: 'bold',
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
});