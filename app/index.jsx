import AnimatedHeader from '@/components/AnimatedHeader';
import AnimatedTabBar from '@/components/AnimatedTabBar';
import ExerciseCard from '@/components/ExerciseCard';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import exercises from '@/data/exercises';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function Index() {
  const [locationFilter, setLocationFilter] = useState('both'); // 'home', 'gym', or 'both'
  const scrollOffset = useSharedValue(0);
  
  // Filter exercises based on location
  const filteredExercises = locationFilter === 'both' 
    ? exercises 
    : exercises.filter(exercise => exercise.location === locationFilter);
  
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

      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.filterContainer}
      >
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
      </Animated.View>

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
});