import AnimatedHeader from '@/components/AnimatedHeader';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Statistics() {
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalWorkouts: 12,
    totalExercises: 48,
    totalTime: 3600, // in seconds
    streak: 5,
    favoriteExercises: [
      { name: 'Push-ups', count: 25 },
      { name: 'Squats', count: 20 },
      { name: 'Plank', count: 15 }
    ],
    weeklyProgress: [
      { day: 'Mon', minutes: 45 },
      { day: 'Tue', minutes: 30 },
      { day: 'Wed', minutes: 60 },
      { day: 'Thu', minutes: 40 },
      { day: 'Fri', minutes: 50 },
      { day: 'Sat', minutes: 70 },
      { day: 'Sun', minutes: 35 }
    ]
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Load stats from storage
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // In a real app, you would load stats from AsyncStorage or a database
        // For now, we'll use sample data
        setStats({
          totalWorkouts: 12,
          totalExercises: 48,
          totalTime: 3600,
          streak: 5,
          favoriteExercises: [
            { name: 'Push-ups', count: 25 },
            { name: 'Squats', count: 20 },
            { name: 'Plank', count: 15 }
          ],
          weeklyProgress: [
            { day: 'Mon', minutes: 45 },
            { day: 'Tue', minutes: 30 },
            { day: 'Wed', minutes: 60 },
            { day: 'Thu', minutes: 40 },
            { day: 'Fri', minutes: 50 },
            { day: 'Sat', minutes: 70 },
            { day: 'Sun', minutes: 35 }
          ]
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  // Render progress chart
  const renderProgressChart = () => {
    const maxValue = Math.max(...stats.weeklyProgress.map(item => item.minutes));
    const chartHeight = 150;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Progress</Text>
        <View style={styles.chart}>
          {stats.weeklyProgress.map((item, index) => {
            const barHeight = (item.minutes / maxValue) * chartHeight;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height: barHeight }]}>
                  <Text style={styles.barText}>{item.minutes}</Text>
                </View>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
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
        <Text style={styles.title}>Statistics</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalExercises}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(stats.totalTime)}</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {renderProgressChart()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite Exercises</Text>
          </View>
          
          <View style={styles.favoritesContainer}>
            {stats.favoriteExercises.map((exercise, index) => (
              <View key={index} style={styles.favoriteItem}>
                <Text style={styles.favoriteName}>{exercise.name}</Text>
                <Text style={styles.favoriteCount}>{exercise.count} times</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          
          <View style={styles.achievementsContainer}>
            <View style={[styles.achievement, styles.achievementCompleted]}>
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDate}>Completed on Jan 15</Text>
            </View>
            
            <View style={[styles.achievement, styles.achievementCompleted]}>
              <Text style={styles.achievementTitle}>5 Workouts</Text>
              <Text style={styles.achievementDate}>Completed on Feb 3</Text>
            </View>
            
            <View style={styles.achievement}>
              <Text style={styles.achievementTitle}>10 Workouts</Text>
              <Text style={styles.achievementDescription}>Complete 10 workouts to unlock</Text>
            </View>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
  chartContainer: {
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitle: {
    ...Typography.heading4,
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 30,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },
  barText: {
    ...Typography.labelSmall,
    color: Colors.surface,
    fontWeight: '600',
  },
  dayLabel: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
    marginTop: 10,
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.heading4,
    color: Colors.textPrimary,
  },
  favoritesContainer: {
    padding: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  favoriteName: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  favoriteCount: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  achievementsContainer: {
    padding: 10,
  },
  achievement: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    margin: 10,
  },
  achievementCompleted: {
    backgroundColor: Colors.success + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  achievementTitle: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 5,
  },
  achievementDate: {
    ...Typography.bodySmall,
    color: Colors.success,
  },
  achievementDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
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