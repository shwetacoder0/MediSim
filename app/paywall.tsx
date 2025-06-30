import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#6B7280" />
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
            <View style={styles.cardContent}>
              <View style={styles.pricingHeader}>
                <Text style={styles.planTitle}>Monthly</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$15</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                <View style={styles.subscribeGradient}>
                  <Text style={styles.subscribeText}>Subscribe</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.featuresList}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color="#4A90E2" strokeWidth={2} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
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
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  pricingCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 32,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 28,
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1F2937',
  },
  period: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 3,
    fontWeight: '500',
  },
  subscribeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 24,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresList: {
    width: '100%',
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#1F2937',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 32,
  },
  restoreText: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
});