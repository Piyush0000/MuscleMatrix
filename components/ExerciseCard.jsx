import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const ExerciseCard = ({ exercise }) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
    opacity.value = withTiming(0.9, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    router.push(`/exerciseDetail?id=${exercise.id}`);
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
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.cardContainer}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Body part indicator */}
        <View 
          style={[
            styles.bodyPartIndicator, 
            { backgroundColor: getBodyPartColor(exercise.bodyPart) }
          ]} 
        />
        
        {/* Dummy image - will be replaced with actual images later */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/300/' + getBodyPartColor(exercise.bodyPart).replace('#', '') + '/FFFFFF?text=' + exercise.name.charAt(0) }} 
            style={styles.image}
          />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{exercise.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.subtitle}>{exercise.bodyPart}</Text>
            <View style={styles.dot} />
            <Text style={styles.equipment} numberOfLines={1}>{exercise.equipment || 'Bodyweight'}</Text>
          </View>
          <View style={[styles.locationBadge, { backgroundColor: exercise.location === 'home' ? Colors.success : Colors.primary }]}>
            <Text style={styles.locationText}>
              {exercise.location === 'home' ? 'Home' : 'Gym'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bodyPartIndicator: {
    height: 6,
    width: '100%',
  },
  imageContainer: {
    height: 140,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    ...Typography.heading6,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subtitle: {
    ...Typography.labelLarge,
    color: Colors.primary,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: 8,
  },
  equipment: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    flex: 1,
  },
  locationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  locationText: {
    ...Typography.labelSmall,
    color: Colors.surface,
    fontWeight: '600',
  },
});

export default ExerciseCard;