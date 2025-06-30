import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FileText, Bot, Microscope, ChartBar as BarChart3, Shield, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const features = [
  {
    id: 1,
    title: 'Visual Report Conversion',
    description: 'Transform complex medical reports into easy-to-understand visual summaries.',
    icon: FileText,
    gradient: ['#4A90E2', '#5BA0F2'],
  },
  {
    id: 2,
    title: 'AI Doctor',
    description: 'Get instant AI-powered explanations of your medical reports.',
    icon: Bot,
    gradient: ['#6BCF7F', '#4CAF50'],
  },
  {
    id: 3,
    title: '3D Disease Models',
    description: 'Explore interactive 3D models of various health conditions.',
    icon: Microscope,
    gradient: ['#FF8A65', '#FF7043'],
  },
  {
    id: 4,
    title: 'Health Metric Visualization',
    description: 'Track and visualize your health metrics over time.',
    icon: BarChart3,
    gradient: ['#FFB74D', '#FFA726'],
  },
  {
    id: 5,
    title: 'App Privacy and AI Capabilities',
    description: 'Learn about our commitment to your privacy and the power of our AI.',
    icon: Shield,
    gradient: ['#BA68C8', '#AB47BC'],
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
    router.push('/sponsors');
  };

  return (
    <View style={styles.container}>
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
                <View style={styles.iconBlur}>
                  <View style={[styles.iconGradient, { backgroundColor: feature.gradient[0] }]}>
                    <feature.icon size={48} color="#FFFFFF" strokeWidth={1.5} />
                  </View>
                </View>
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
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Continue</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
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
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  iconBlur: {
    padding: 30,
  },
  iconGradient: {
    padding: 30,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  featureDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#4A90E2',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
});