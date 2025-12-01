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

export default function Profile() {
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 15, 2023',
    level: 'Intermediate',
    goals: ['Build muscle', 'Improve flexibility'],
    achievements: 12,
    workouts: 48,
    favoriteWorkout: 'Upper Body Strength'
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Load profile from storage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // In a real app, you would load profile from AsyncStorage or a database
        // For now, we'll use sample data
        setProfile({
          name: 'John Doe',
          email: 'john.doe@example.com',
          joinDate: 'January 15, 2023',
          level: 'Intermediate',
          goals: ['Build muscle', 'Improve flexibility'],
          achievements: 12,
          workouts: 48,
          favoriteWorkout: 'Upper Body Strength'
        });
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
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
        <Text style={styles.title}>Profile</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <Text style={styles.memberSince}>Member since {profile.joinDate}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fitness Level</Text>
          </View>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>{profile.level}</Text>
            <View style={styles.levelProgress}>
              <View style={[styles.progressBar, styles.progressIntermediate]} />
            </View>
            <Text style={styles.levelDescription}>You're making great progress!</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Goals</Text>
          </View>
          <View style={styles.goalsContainer}>
            {profile.goals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalIcon}>
                  <Text style={styles.goalIconText}>✓</Text>
                </View>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite Workout</Text>
          </View>
          <View style={styles.favoriteWorkoutContainer}>
            <Text style={styles.favoriteWorkoutText}>{profile.favoriteWorkout}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>
          <View style={styles.settingsContainer}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.settingText}>App Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={[styles.settingText, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.heading2,
    color: Colors.surface,
    fontWeight: 'bold',
  },
  profileName: {
    ...Typography.heading4,
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  profileEmail: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  memberSince: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
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
  levelContainer: {
    padding: 20,
    alignItems: 'center',
  },
  levelText: {
    ...Typography.heading5,
    color: Colors.primary,
    marginBottom: 10,
  },
  levelProgress: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressIntermediate: {
    width: '65%',
    backgroundColor: Colors.primary,
  },
  levelDescription: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  goalsContainer: {
    padding: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  goalIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  goalIconText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalText: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
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
  favoriteWorkoutContainer: {
    padding: 20,
  },
  favoriteWorkoutText: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  settingsContainer: {
    padding: 10,
  },
  settingItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingText: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  logoutText: {
    color: Colors.danger,
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