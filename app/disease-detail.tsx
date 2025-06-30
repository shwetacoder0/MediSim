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
import { ArrowLeft, Play, Users, TrendingUp } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { EducationService, EducationSection } from '../lib/educationService';

const { width } = Dimensions.get('window');

export default function DiseaseDetailScreen() {
  const { category } = useLocalSearchParams();
  const [diseases, setDiseases] = useState<EducationSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiseases();
  }, [category]);

  const loadDiseases = async () => {
    try {
      setLoading(true);
      const data = await EducationService.getEducationSectionsByCategory('diseases', category as string);
      setDiseases(data);
    } catch (error) {
      console.error('Error loading diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getSeverityColor = (index: number) => {
    const colors = ['#FF8A65', '#FFB74D', '#6BCF7F'];
    return colors[index % colors.length];
  };

  const getPrevalenceText = (index: number) => {
    const prevalences = [
      '116 million Americans',
      '6.5 million Americans',
      '39 million Americans',
      '795,000 Americans yearly'
    ];
    return prevalences[index % prevalences.length];
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading disease information...</Text>
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
            {category === 'cardiology' ? 'Cardiology' : 'Neurology'}
          </Text>
          <Text style={styles.subtitle}>
            Watch detailed animations explaining how these conditions develop and progress
          </Text>
        </View>

        <View style={styles.diseasesSection}>
          {diseases.map((disease, index) => (
            <View key={disease.id} style={styles.diseaseCard}>
              <View style={styles.cardContent}>
                {/* YouTube Video Embed */}
                <View style={styles.videoContainer}>
                  <WebView
                    source={{ uri: EducationService.getYouTubeEmbedUrl(disease.content_url || '') }}
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
                
                <View style={styles.diseaseInfo}>
                  <View style={styles.diseaseHeader}>
                    <Text style={styles.diseaseTitle}>{disease.title}</Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(index) + '15' }
                    ]}>
                      <Text style={[
                        styles.severityText,
                        { color: getSeverityColor(index) }
                      ]}>
                        Important
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.diseaseDescription}>{disease.description}</Text>
                  
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Users size={14} color="#9CA3AF" />
                      <Text style={styles.statText}>{getPrevalenceText(index)}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <TrendingUp size={14} color="#9CA3AF" />
                      <Text style={styles.statText}>Learn More</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {diseases.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No disease information available for this category yet.</Text>
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
  diseasesSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  diseaseCard: {
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
  diseaseInfo: {
    flex: 1,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 10,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
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