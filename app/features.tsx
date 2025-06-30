import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { FileText, Bot, Microscope, ChartBar as BarChart3, Shield, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const features = [
  {
    id: 1,
    title: 'Visual Report Conversion',
    description: 'Transform complex medical reports into easy-to-understand visual summaries.',
    icon: FileText,
    gradient: ['#FF6B6B', '#FFE66D'],
  },
  {
    id: 2,
    title: 'AI Doctor',
    description: 'Get instant AI-powered explanations of your medical reports.',
    icon: Bot,
    gradient: ['#4ECDC4', '#44A08D'],
  },
  {
    id: 3,
    title: '3D Disease Models',
    description: 'Explore interactive 3D models of various health conditions.',
    icon: Microscope,
    gradient: ['#A8E6CF', '#7FCDCD'],
  },
  {
    id: 4,
    title: 'Health Metric Visualization',
    description: 'Track and visualize your health metrics over time.',
    icon: BarChart3,
    gradient: ['#FFB347', '#FFCC5C'],
  },
  {
    id: 5,
    title: 'App Privacy and AI Capabilities',
    description: 'Learn about our commitment to your privacy and the power of our AI.',
    icon: Shield,
    gradient: ['#B19CD9', '#C299DC'],
  },
];

export default function FeaturesScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffset / width);
    setCurrentPage(page);
  };

  const handleContinue = () => {
    router.push('/auth');
  };

  const handleSponsors = () => {
    router.push('/sponsors');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medisim</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {features.map((feature, index) => (
          <View key={feature.id} style={styles.slide}>
            <View style={styles.slideContent}>
              <View style={styles.iconContainer}>
                <BlurView intensity={20} tint="light" style={styles.iconBlur}>
                  <LinearGradient
                    colors={feature.gradient}
                    style={styles.iconGradient}
                  >
                    <feature.icon size={60} color="#FFFFFF" strokeWidth={1.5} />
                  </LinearGradient>
                </BlurView>
              </View>

              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {currentPage === features.length - 1 && (
          <View style={styles.finalPageButtons}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <BlurView intensity={30} tint="light" style={styles.buttonBlur}>
                <LinearGradient
                  colors={['#4FACFE', '#00F2FE']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sponsorsButton} onPress={handleSponsors}>
              <Text style={styles.sponsorsText}>Thank Our Sponsors</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconBlur: {
    padding: 40,
  },
  iconGradient: {
    padding: 40,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  featureDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4FACFE',
  },
  finalPageButtons: {
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginBottom: 20,
  },
  buttonBlur: {
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  sponsorsButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sponsorsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});