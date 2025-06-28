import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

const features = [
  'Personalized Illustrations',
  'AI Doctor Explanations',
  'Advanced Visualizations',
  'Full Educational Content Access',
];

export default function PaywallScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleSubscribe = () => {
    // Placeholder for RevenueCat subscription logic
    console.log('Subscribe button pressed');
    // Navigate to main app after subscription
    router.push('/home');
  };

  const handleRestore = () => {
    // Placeholder for restore purchase logic
    console.log('Restore purchase pressed');
    // If restore is successful, navigate to home
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Unlock Your Health Mirror</Text>
            <Text style={styles.subtitle}>
              Get personalized illustrations, AI Doctor explanations, advanced visualizations, and full educational content access.
            </Text>
          </View>

          <View style={styles.pricingCard}>
            <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <View style={styles.pricingHeader}>
                  <Text style={styles.planTitle}>Monthly</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>$15</Text>
                    <Text style={styles.period}>/month</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                  <LinearGradient
                    colors={['#4FACFE', '#00F2FE']}
                    style={styles.subscribeGradient}
                  >
                    <Text style={styles.subscribeText}>Subscribe</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.featuresList}>
                  {features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Check size={20} color="#4FACFE" strokeWidth={2} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </BlurView>
          </View>

          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Terms of Service | Privacy Policy</Text>
          </View>
        </View>
      </ScrollView>
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  pricingCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
    marginBottom: 40,
    elevation: 20,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  cardBlur: {
    padding: 30,
  },
  cardContent: {
    alignItems: 'center',
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  planTitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
    fontWeight: '500',
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  subscribeGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresList: {
    width: '100%',
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 40,
  },
  restoreText: {
    color: '#4FACFE',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
});