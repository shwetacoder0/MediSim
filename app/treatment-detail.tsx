import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { EducationService, EducationSection } from '../lib/educationService';

const { width } = Dimensions.get('window');

export default function TreatmentDetailScreen() {
  const { category } = useLocalSearchParams();
  const [treatments, setTreatments] = useState<EducationSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreatments();
  }, [category]);

  const loadTreatments = async () => {
    try {
      setLoading(true);
      const data = await EducationService.getEducationSectionsByCategory('treatments', category as string);
      setTreatments(data);
    } catch (error) {
      console.error('Error loading treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      '#4FACFE', // Blue
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#FFB347', // Orange
      '#A8E6CF', // Green
    ];
    return colors[index % colors.length];
  };

  const getCategoryName = (index: number) => {
    const categories = [
      'Cardiovascular',
      'Surgical',
      'Interventional',
      'Therapeutic',
      'Advanced'
    ];
    return categories[index % categories.length];
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        />
        <ActivityIndicator size="large" color="#4FACFE" />
        <Text style={styles.loadingText}>Loading treatment information...</Text>
      </View>
    );
  }

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
        <View style={styles.header}>
          <Text style={styles.title}>
            {category === 'medications' ? 'Medications' : 'Surgical Procedures'}
          </Text>
          <Text style={styles.subtitle}>
            Watch detailed animations showing how these treatments work
          </Text>
        </View>

        <View style={styles.treatmentsSection}>
          {treatments.map((treatment, index) => (
            <View key={treatment.id} style={styles.treatmentCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  {/* YouTube Video Embed */}
                  <View style={styles.videoContainer}>
                    <WebView
                      source={{ uri: EducationService.getYouTubeEmbedUrl(treatment.content_url || '') }}
                      style={styles.webView}
                      allowsInlineMediaPlayback={true}
                      mediaPlaybackRequiresUserAction={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                      renderLoading={() => (
                        <View style={styles.videoPlaceholder}>
                          <Play size={40} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.loadingVideoText}>Loading video...</Text>
                        </View>
                      )}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>Educational</Text>
                    </View>
                  </View>
                  
                  <View style={styles.treatmentInfo}>
                    <View style={styles.treatmentHeader}>
                      <Text style={styles.treatmentTitle}>{treatment.title}</Text>
                      <View style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(index) + '20' }
                      ]}>
                        <Text style={[
                          styles.categoryText,
                          { color: getCategoryColor(index) }
                        ]}>
                          {getCategoryName(index)}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.treatmentDescription}>{treatment.description}</Text>
                  </View>
                </View>
              </BlurView>
            </View>
          ))}

          {treatments.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No treatment information available for this category yet.</Text>
              <Text style={styles.emptySubtext}>More content coming soon!</Text>
            </View>
          )}
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
  header: {
    paddingTop: 120,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  treatmentsSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  treatmentCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'column',
  },
  videoContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingVideoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  treatmentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  treatmentDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});