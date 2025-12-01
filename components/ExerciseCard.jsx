import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { addFavorite, isFavorite, removeFavorite } from '@/utils/favoriteManager';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Check if exercise is favorited
  useEffect(() => {
    const checkFavorite = async () => {
      if (exercise && exercise.id) {
        const favorited = await isFavorite(exercise.id);
        setIsFavorited(favorited);
      }
    };
    
    checkFavorite();
  }, [exercise]);

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
    router.push({
      pathname: '/exerciseDetail',
      params: { id: exercise.id || exercise.name }
    });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Set playback speed
  const setPlaybackSpeed = (newSpeed) => {
    setSpeed(newSpeed);
  };

  // Toggle loop
  const toggleLoop = () => {
    setLoop(!loop);
  };

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
        
        {/* Exercise GIF or placeholder image with controls */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: exercise.gifUrl || 'https://via.placeholder.com/300/' + getBodyPartColor(exercise.bodyPart).replace('#', '') + '/FFFFFF?text=' + exercise.name.charAt(0) }} 
            style={styles.image}
            onError={(e) => {
              // Fallback to placeholder if GIF fails to load
              e.target.onError = null;
              e.target.source = { uri: 'https://via.placeholder.com/300/' + getBodyPartColor(exercise.bodyPart).replace('#', '') + '/FFFFFF?text=' + exercise.name.charAt(0) };
            }}
          />
          {/* Animation Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, !isPlaying && styles.controlButtonActive]} 
              onPress={togglePlayPause}
            >
              <Text style={styles.controlText}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            
            <View style={styles.speedControls}>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 0.5 && styles.activeSpeedButton]} 
                onPress={() => setPlaybackSpeed(0.5)}
              >
                <Text style={[styles.speedText, speed === 0.5 && styles.activeSpeedText]}>0.5x</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 1 && styles.activeSpeedButton]} 
                onPress={() => setPlaybackSpeed(1)}
              >
                <Text style={[styles.speedText, speed === 1 && styles.activeSpeedText]}>1x</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 2 && styles.activeSpeedButton]} 
                onPress={() => setPlaybackSpeed(2)}
              >
                <Text style={[styles.speedText, speed === 2 && styles.activeSpeedText]}>2x</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.controlButton, loop && styles.controlButtonActive]} 
              onPress={toggleLoop}
            >
              <Text style={[styles.controlText, loop && styles.activeLoop]}>{loop ? '🔁' : '🔂'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{exercise.name}</Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={async () => {
                if (isFavorited) {
                  await removeFavorite(exercise.id);
                } else {
                  await addFavorite(exercise.id);
                }
                setIsFavorited(!isFavorited);
              }}
            >
              <Text style={[styles.favoriteText, isFavorited && styles.favoriteTextActive]}>★</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.subtitle}>{exercise.bodyPart || exercise.target}</Text>
            <View style={styles.dot} />
            <Text style={styles.equipment} numberOfLines={1}>{exercise.equipment || 'Bodyweight'}</Text>
          </View>
          <View style={[styles.locationBadge, { backgroundColor: exercise.location === 'home' ? Colors.success : exercise.location === 'gym' ? Colors.primary : Colors.warning }]}>
            <Text style={styles.locationText}>
              {exercise.location === 'home' ? 'Home' : exercise.location === 'gym' ? 'Gym' : 'Both'}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...Typography.heading6,
    color: Colors.textPrimary,
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteText: {
    fontSize: 20,
    color: Colors.textTertiary,
  },
  favoriteTextActive: {
    color: Colors.warning,
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
  // Animation controls styles
  controlsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonActive: {
    backgroundColor: Colors.primary,
  },
  controlText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  activeLoop: {
    color: Colors.success,
  },
  speedControls: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeSpeedButton: {
    backgroundColor: Colors.primary,
  },
  speedText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  activeSpeedText: {
    fontWeight: 'bold',
  },
});

export default ExerciseCard;