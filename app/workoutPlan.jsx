import AnimatedHeader from '@/components/AnimatedHeader';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';

export default function WorkoutPlan() {
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Beginner Full Body',
      duration: '4 weeks',
      level: 'Beginner',
      description: 'Perfect for those new to working out. Builds foundational strength.',
      exercises: 8,
      daysPerWeek: 3,
      isFavorite: false
    },
    {
      id: 2,
      name: 'Intermediate Strength',
      duration: '6 weeks',
      level: 'Intermediate',
      description: 'Focus on building muscle and increasing strength.',
      exercises: 12,
      daysPerWeek: 4,
      isFavorite: true
    },
    {
      id: 3,
      name: 'Advanced Power',
      duration: '8 weeks',
      level: 'Advanced',
      description: 'High intensity program for experienced athletes.',
      exercises: 15,
      daysPerWeek: 5,
      isFavorite: false
    }
  ]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Load plans from storage
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        // In a real app, you would load plans from AsyncStorage or a database
        // For now, we'll use sample data
        setPlans([
          {
            id: 1,
            name: 'Beginner Full Body',
            duration: '4 weeks',
            level: 'Beginner',
            description: 'Perfect for those new to working out. Builds foundational strength.',
            exercises: 8,
            daysPerWeek: 3,
            isFavorite: false
          },
          {
            id: 2,
            name: 'Intermediate Strength',
            duration: '6 weeks',
            level: 'Intermediate',
            description: 'Focus on building muscle and increasing strength.',
            exercises: 12,
            daysPerWeek: 4,
            isFavorite: true
          },
          {
            id: 3,
            name: 'Advanced Power',
            duration: '8 weeks',
            level: 'Advanced',
            description: 'High intensity program for experienced athletes.',
            exercises: 15,
            daysPerWeek: 5,
            isFavorite: false
          }
        ]);
      } catch (err) {
        console.error('Error loading plans:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, isFavorite: !plan.isFavorite } : plan
    ));
  };

  // Get level color
  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return Colors.success;
      case 'Intermediate': return Colors.warning;
      case 'Advanced': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading workout plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedHeader scrollOffset={scrollOffset} />

      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.header}
      >
        <Text style={styles.title}>Workout Plans</Text>
        <Text style={styles.subtitle}>Choose a plan to get started</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {plans.map((plan, index) => (
          <Animated.View 
            key={plan.id}
            entering={FadeInUp.duration(600).delay(300 + index * 100)}
            style={styles.planCard}
          >
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planMeta}>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(plan.level) }]}>
                    <Text style={styles.levelText}>{plan.level}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(plan.id)}
              >
                <Text style={[styles.favoriteText, plan.isFavorite && styles.favoriteTextActive]}>
                  {plan.isFavorite ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.planDescription}>{plan.description}</Text>
            
            <View style={styles.planStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{plan.exercises}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{plan.daysPerWeek}</Text>
                <Text style={styles.statLabel}>Days/Week</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.push('/workout')}
            >
              <Text style={styles.startButtonText}>Start Plan</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        <TouchableOpacity 
          style={styles.createPlanButton}
          onPress={() => console.log('Create custom plan')}
        >
          <Text style={styles.createPlanText}>+ Create Custom Plan</Text>
        </TouchableOpacity>
      </ScrollView>
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
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  planCard: {
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    ...Typography.heading4,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planDuration: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginRight: 15,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  levelText: {
    ...Typography.labelSmall,
    color: Colors.surface,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteText: {
    fontSize: 24,
    color: Colors.textTertiary,
  },
  favoriteTextActive: {
    color: Colors.warning,
  },
  planDescription: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.heading3,
    color: Colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  startButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '600',
  },
  createPlanButton: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  createPlanText: {
    ...Typography.labelLarge,
    color: Colors.primary,
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