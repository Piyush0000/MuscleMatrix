import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

// Dummy exercise data for demonstration
const dummyExercises = [
  { id: 1, name: 'Push-ups', bodyPart: 'Chest', equipment: 'Bodyweight', location: 'home', description: 'A basic upper body exercise that works the chest, shoulders, and triceps.', instructions: ['Start in a plank position with hands slightly wider than shoulder-width apart', 'Lower your body until chest nearly touches the floor', 'Pause, then push yourself back up', 'Repeat for desired repetitions'], tips: ['Keep your body straight throughout the movement', 'Engage your core to prevent sagging hips', 'Control the descent for maximum benefit'] },
  { id: 2, name: 'Bench Press', bodyPart: 'Chest', equipment: 'Barbell', location: 'gym', description: 'A classic compound exercise for building chest strength and mass.', instructions: ['Lie flat on a bench with feet firmly planted on the ground', 'Grab the barbell with hands slightly wider than shoulder-width', 'Lower the bar to your mid-chest', 'Press the bar back up explosively', 'Lock out at the top without hyperextending elbows'], tips: ['Arch your back slightly for better leverage', 'Keep your shoulder blades retracted', 'Breathe in as you lower, breathe out as you press'] },
  { id: 3, name: 'Pull-ups', bodyPart: 'Back', equipment: 'Pull-up Bar', location: 'home', description: 'An excellent bodyweight exercise for building upper back and arm strength.', instructions: ['Grab the pull-up bar with palms facing away', 'Hang with arms fully extended', 'Pull your body up until chin is above the bar', 'Lower yourself back down with control', 'Repeat for desired repetitions'], tips: ['Engage your lats by pulling your elbows down', 'Avoid swinging or kipping movements', 'Focus on controlled movement throughout'] },
  { id: 4, name: 'Lat Pulldown', bodyPart: 'Back', equipment: 'Machine', location: 'gym', description: 'A machine-based alternative to pull-ups that targets the latissimus dorsi.', instructions: ['Sit with thighs under the pads and grab the bar with wide overhand grip', 'Lean back slightly and pull the bar to your chest', 'Squeeze your shoulder blades together at the bottom', 'Slowly return to starting position', 'Repeat for desired repetitions'], tips: ['Avoid leaning back too far', 'Focus on using your back muscles, not momentum', 'Keep your chest up throughout the movement'] },
  { id: 5, name: 'Bicep Curls', bodyPart: 'Arms', equipment: 'Dumbbells', location: 'gym', description: 'An isolation exercise specifically targeting the biceps brachii muscle.', instructions: ['Stand upright with dumbbells at your sides', 'Keeping elbows stationary, curl weights up toward shoulders', 'Rotate wrists so palms face upward at the top', 'Slowly lower the weights back to starting position', 'Repeat for desired repetitions'], tips: ['Keep your elbows close to your torso', 'Avoid swinging the weights', 'Maintain control throughout the movement'] },
  { id: 6, name: 'Tricep Dips', bodyPart: 'Arms', equipment: 'Parallel Bars', location: 'home', description: 'A bodyweight exercise that primarily targets the triceps muscles.', instructions: ['Position yourself between parallel bars and support your weight', 'Lower your body by bending your elbows to 90 degrees', 'Push yourself back up to starting position', 'Keep your body upright throughout the movement', 'Repeat for desired repetitions'], tips: ['Lean forward slightly to emphasize triceps', 'Keep your shoulders down and back', 'Control the descent to maximize effectiveness'] },
  { id: 7, name: 'Squats', bodyPart: 'Legs', equipment: 'Bodyweight', location: 'home', description: 'A fundamental compound exercise that works the quads, glutes, and hamstrings.', instructions: ['Stand with feet shoulder-width apart', 'Lower your body by bending knees and pushing hips back', 'Descend until thighs are parallel to floor', 'Drive through heels to return to standing position', 'Repeat for desired repetitions'], tips: ['Keep your chest up and back straight', 'Knees should track over toes', 'Descend slowly for better muscle activation'] },
  { id: 8, name: 'Leg Press', bodyPart: 'Legs', equipment: 'Machine', location: 'gym', description: 'A machine-based leg exercise that allows heavy loading while reducing spinal stress.', instructions: ['Sit with back against pad and feet shoulder-width on platform', 'Release safety handles and lower platform by bending knees', 'Stop when knees are at 90-degree angle', 'Press platform back up by extending legs', 'Repeat for desired repetitions'], tips: ['Do not lock out knees at the top', 'Keep feet flat on the platform', 'Control the descent to avoid injury'] },
  { id: 9, name: 'Plank', bodyPart: 'Core', equipment: 'Bodyweight', location: 'home', description: 'An isometric core exercise that strengthens the entire midsection.', instructions: ['Start in a push-up position but rest on forearms', 'Keep body straight from head to heels', 'Engage core and hold position', 'Keep neck neutral by looking at floor', 'Hold for desired time'], tips: ['Squeeze your glutes and engage your core', 'Don\'t let your hips sag or rise', 'Breathe steadily throughout the hold'] },
  { id: 10, name: 'Russian Twists', bodyPart: 'Core', equipment: 'Medicine Ball', location: 'gym', description: 'A rotational core exercise that targets the obliques and transverse abdominis.', instructions: ['Sit on floor with knees bent and lean back slightly', 'Hold medicine ball with both hands', 'Twist torso to right and tap ball on floor', 'Return to center and twist to left side', 'Continue alternating for desired repetitions'], tips: ['Keep your core engaged throughout', 'Move slowly and with control', 'Focus on rotation from the torso, not just the arms'] },
  { id: 11, name: 'Shoulder Press', bodyPart: 'Shoulders', equipment: 'Dumbbells', location: 'gym', description: 'An overhead pressing movement that develops deltoid strength and size.', instructions: ['Sit on bench with back support and dumbbells at shoulder height', 'Press weights upward until arms are fully extended', 'Pause at the top, then slowly lower back to start', 'Keep core tight throughout the movement', 'Repeat for desired repetitions'], tips: ['Avoid arching your back excessively', 'Keep dumbbells aligned with ears', 'Control the weight on the descent'] },
  { id: 12, name: 'Lateral Raises', bodyPart: 'Shoulders', equipment: 'Dumbbells', location: 'home', description: 'An isolation exercise that targets the lateral deltoids for shoulder width.', instructions: ['Stand with dumbbells at sides, palms facing inward', 'Raise arms out to sides until parallel with floor', 'Pause at the top, then slowly lower back to start', 'Keep slight bend in elbows throughout', 'Repeat for desired repetitions'], tips: ['Use lighter weights for better form', 'Avoid swinging or using momentum', 'Focus on squeezing the shoulder muscles at the top'] },
];

export default function ExerciseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Find the exercise by ID
  const exercise = dummyExercises.find(ex => ex.id.toString() === id) || dummyExercises[0];
  
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

  // Get color based on body part
  const getBodyPartColor = (bodyPart) => {
    const colors = {
      Chest: Colors.chest,
      Back: Colors.back,
      Arms: Colors.arms,
      Legs: Colors.legs,
      Core: Colors.core,
      Shoulders: Colors.shoulders,
      default: Colors.secondary
    };
    return colors[bodyPart] || colors.default;
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          entering={BounceIn.delay(200)}
          style={styles.imageContainer}
        >
          <Image 
            source={{ uri: 'https://via.placeholder.com/400/' + getBodyPartColor(exercise.bodyPart).replace('#', '') + '/FFFFFF?text=' + exercise.name.charAt(0) }} 
            style={styles.image}
          />
        </Animated.View>

        <Animated.View 
          entering={SlideInLeft.duration(600).delay(300)}
          style={styles.infoContainer}
        >
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.locationBadge, { backgroundColor: exercise.location === 'home' ? Colors.success : Colors.primary }]}>
              <Text style={styles.badgeText}>{exercise.location === 'home' ? 'HomeAs' : 'Gym'}</Text>
            </View>
            <View style={[styles.badge, styles.bodyPartBadge, { backgroundColor: getBodyPartColor(exercise.bodyPart) }]}>
              <Text style={styles.badgeText}>{exercise.bodyPart}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{exercise.description}</Text>
        </Animated.View>

        <Animated.View 
          entering={SlideInRight.duration(600).delay(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          {exercise.instructions.map((step, index) => (
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
          style={[styles.section, styles.lastSection]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb-outline" size={24} color={Colors.warning} />
            <Text style={styles.sectionTitle}>Tips</Text>
          </View>
          {exercise.tips.map((tip, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.duration(300).delay(600 + index * 100)}
              style={styles.tipContainer}
            >
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} style={styles.tipIcon} />
              <Text style={styles.tipText}>{tip}</Text>
            </Animated.View>
          ))}
        </Animated.View>
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
  headerSpacer: {
    width: 40,
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
  badgeText: {
    ...Typography.labelLarge,
    color: Colors.surface,
    fontWeight: '700',
  },
  description: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
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
});