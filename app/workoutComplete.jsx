import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    BounceIn,
    FadeIn,
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';

export default function WorkoutComplete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [workoutStats, setWorkoutStats] = useState({
    duration: 1800, // 30 minutes in seconds
    exercises: 12,
    calories: 250,
    date: new Date().toLocaleDateString()
  });

  // Load workout stats from storage
  useEffect(() => {
    const loadWorkoutStats = async () => {
      try {
        setLoading(true);
        // In a real app, you would load workout stats from AsyncStorage or a database
        // For now, we'll use sample data
        setWorkoutStats({
          duration: 1800,
          exercises: 12,
          calories: 250,
          date: new Date().toLocaleDateString()
        });
      } catch (err) {
        console.error('Error loading workout stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutStats();
  }, []);

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading completion screen...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.background}
      />

      <Animated.View 
        entering={BounceIn.duration(800)}
        style={styles.checkmarkContainer}
      >
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.duration(600).delay(300)}
        style={styles.content}
      >
        <Text style={styles.title}>Workout Complete!</Text>
        <Text style={styles.subtitle}>Great job on finishing your workout</Text>
        
        <Animated.View 
          entering={FadeInUp.duration(600).delay(500)}
          style={styles.statsContainer}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(workoutStats.duration)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workoutStats.exercises}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workoutStats.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </Animated.View>
        
        <Text style={styles.dateText}>Completed on {workoutStats.date}</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(600).delay(700)}
        style={styles.actions}
      >
        <TouchableOpacity 
          style={[styles.button, styles.homeButton]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.shareButton]}
          onPress={() => console.log('Share workout')}
        >
          <Text style={styles.buttonText}>Share Achievement</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    opacity: 0.1,
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 10,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkmark: {
    fontSize: 60,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  title: {
    ...Typography.heading1,
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.heading5,
    color: Colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.heading2,
    color: Colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  dateText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  homeButton: {
    backgroundColor: Colors.primary,
  },
  shareButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '600',
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