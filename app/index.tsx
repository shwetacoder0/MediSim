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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
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
        <LinearGradient
          colors={['#0A0A0A', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        />
        <ActivityIndicator size="large" color="#4FACFE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      {/* Bolt Icon at the top - now clickable */}
      <TouchableOpacity style={styles.boltIconContainer} onPress={handleBoltClick}>
        <Image
          source={require('../assets/images/white_circle_360x360.png')}
          style={styles.boltIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Animated Background Orbs */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orb, animatedOrb]}>
          <LinearGradient
            colors={['#4FACFE', '#00F2FE', '#43E97B']}
            style={styles.orbGradient}
          />
        </Animated.View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.glassOrb}>
            <BlurView intensity={20} tint="light" style={styles.blurOrb}>
              <View style={styles.innerOrb}>
                <LinearGradient
                  colors={['#4FACFE', '#00F2FE']}
                  style={styles.innerGradient}
                />
              </View>
            </BlurView>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Medisim</Text>
          <Text style={styles.subtitle}>A Mirror to Your Health</Text>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <BlurView intensity={30} tint="light" style={styles.buttonBlur}>
            <LinearGradient
              colors={['#4FACFE', '#00F2FE']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  boltIconContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 10,
    padding: 5, // Add padding for better touch target
  },
  boltIcon: {
    width: 50,
    height: 50,
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
    opacity: 0.1,
  },
  orbGradient: {
    flex: 1,
    borderRadius: width * 0.75,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 80,
  },
  glassOrb: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurOrb: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerOrb: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
  innerGradient: {
    flex: 1,
    opacity: 0.8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  getStartedButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginBottom: 30,
  },
  buttonBlur: {
    paddingHorizontal: 50,
    paddingVertical: 18,
  },
  buttonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});