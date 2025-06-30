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
      '#4A90E2', // Blue
      '#6BCF7F', // Green
      '#FF8A65', // Orange
      '#FFB74D', // Amber
      '#BA68C8', // Purple
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
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading treatment information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#6B7280" />
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
                        <Play size={32} color="#6B7280" />
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
                      { backgroundColor: getCategoryColor(index) + '15' }
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
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    paddingTop: 120,
    paddingHorizontal: 30,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 12,
  },
  treatmentsSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  treatmentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
    padding: 16,
  },
  videoContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },
  webView: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingVideoText: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 6,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  treatmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  treatmentDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});