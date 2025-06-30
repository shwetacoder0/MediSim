import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAuth, UserProfile } from '../lib/auth-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const { isAuthenticated, isLoading, profile } = useAuth();

  useEffect(() => {
    rotateValue.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
    scaleValue.value = withRepeat(
      withTiming(1.1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // If user is authenticated, check subscription status
      const userProfile = profile as UserProfile | null;
      if (userProfile && userProfile.plan === 'pro' && userProfile.subscription_status === 'active') {
        router.replace('/home');
      } else {
        router.replace('/paywall');
      }
    }
  }, [isLoading, isAuthenticated, profile]);

  const animatedOrb = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateValue.value}deg` },
      { scale: scaleValue.value },
    ],
  }));

  const handleGetStarted = () => {
    router.push('/features');
  };

  const handleBoltClick = async () => {
    try {
      const supported = await Linking.canOpenURL('https://bolt.new');
      if (supported) {
        await Linking.openURL('https://bolt.new');
      }
    } catch (error) {
      console.error('Error opening Bolt.new:', error);
    }
  };

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bolt Icon at the top - now clickable */}
      <TouchableOpacity style={styles.boltIconContainer} onPress={handleBoltClick}>
        <Image
          source={require('../assets/images/black_circle_360x360.png')}
          style={styles.boltIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Animated Background Orbs */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orb, animatedOrb]}>
          <View style={styles.orbGradient} />
        </Animated.View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.glassOrb}>
            <View style={styles.blurOrb}>
              <View style={styles.innerOrb}>
                <View style={styles.innerGradient} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Medisim</Text>
          <Text style={styles.subtitle}>A Mirror to Your Health</Text>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boltIconContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 10,
    padding: 5,
  },
  boltIcon: {
    width: 40,
    height: 40,
    tintColor: '#6B7280',
  },
  orbContainer: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    opacity: 0.03,
  },
  orbGradient: {
    flex: 1,
    borderRadius: width * 0.75,
    backgroundColor: '#4A90E2',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 60,
  },
  glassOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  blurOrb: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerOrb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  innerGradient: {
    flex: 1,
    backgroundColor: '#4A90E2',
    opacity: 0.6,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});