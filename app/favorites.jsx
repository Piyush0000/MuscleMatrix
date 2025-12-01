import AnimatedHeader from '@/components/AnimatedHeader';
import ExerciseCard from '@/components/ExerciseCard';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { fetchAllExercises } from '@/services/exerciseService';
import { getFavorites } from '@/utils/favoriteManager';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedScrollHandler,
    useSharedValue
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

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollOffset = useSharedValue(0);
  
  // Load favorites from storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        // Get favorite exercise IDs from storage
        const favoriteIds = await getFavorites();
        
        if (favoriteIds.length > 0) {
          // Fetch all exercises and filter by favorite IDs
          const allExercises = await fetchAllExercises();
          const favoriteExercises = allExercises.filter(ex => 
            favoriteIds.includes(ex.id)
          );
          setFavorites(favoriteExercises);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, []);
  
  const groupedExercises = groupExercisesByBodyPart(favorites);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedHeader scrollOffset={scrollOffset} />

      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.header}
      >
        <Text style={styles.title}>Favorite Exercises</Text>
        <Text style={styles.subtitle}>{favorites.length} saved exercises</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite exercises yet</Text>
          <Text style={styles.emptySubtext}>Start adding exercises to your favorites!</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>Browse Exercises</Text>
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
    </SafeAreaView>
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
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    ...Typography.heading4,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '600',
  },
});