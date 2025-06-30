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
    const colors = ['#FF6B6B', '#FFB347', '#4ECDC4'];
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
        <LinearGradient
          colors={['#0A0A0A', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        />
        <ActivityIndicator size="large" color="#4FACFE" />
        <Text style={styles.loadingText}>Loading disease information...</Text>
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
            {category === 'cardiology' ? 'Cardiology' : 'Neurology'}
          </Text>
          <Text style={styles.subtitle}>
            Watch detailed animations explaining how these conditions develop and progress
          </Text>
        </View>

        <View style={styles.diseasesSection}>
          {diseases.map((disease, index) => (
            <View key={disease.id} style={styles.diseaseCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
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
                          <Play size={40} color="rgba(255, 255, 255, 0.8)" />
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
                        { backgroundColor: getSeverityColor(index) + '20' }
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
                        <Users size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.statText}>{getPrevalenceText(index)}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <TrendingUp size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.statText}>Learn More</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </BlurView>
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
  diseasesSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  diseaseCard: {
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
  diseaseInfo: {
    flex: 1,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
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