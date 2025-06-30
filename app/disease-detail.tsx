import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Users, TrendingUp } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const diseaseData = {
  cardiology: [
    {
      id: 1,
      title: 'Heart Attack: What Happens Inside',
      description: 'Detailed animation showing how coronary arteries become blocked and the cascade of events during a heart attack.',
      youtubeId: 'dQw4w9WgXcQ', // Replace with actual medical video IDs
      duration: '6:45',
      prevalence: '805,000 Americans yearly',
      severity: 'High',
    },
    {
      id: 2,
      title: 'Atrial Fibrillation Explained',
      description: 'See how irregular heart rhythms affect blood flow and why AFib increases stroke risk.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '5:20',
      prevalence: '6.1 million Americans',
      severity: 'Medium',
    },
    {
      id: 3,
      title: 'Heart Failure Progression',
      description: 'Understanding how the heart weakens over time and compensatory mechanisms that develop.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '7:15',
      prevalence: '6.5 million Americans',
      severity: 'High',
    },
    {
      id: 4,
      title: 'Hypertension: The Silent Killer',
      description: 'Animated explanation of how high blood pressure damages arteries and organs over time.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '4:50',
      prevalence: '116 million Americans',
      severity: 'Medium',
    },
  ],
  neurology: [
    {
      id: 1,
      title: 'Stroke: Brain Under Attack',
      description: 'See what happens when blood flow to the brain is interrupted and how brain cells are affected.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '8:30',
      prevalence: '795,000 Americans yearly',
      severity: 'High',
    },
    {
      id: 2,
      title: 'Alzheimer\'s Disease Progression',
      description: 'Detailed animation of how amyloid plaques and tau tangles destroy brain connections.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '9:15',
      prevalence: '6.5 million Americans',
      severity: 'High',
    },
    {
      id: 3,
      title: 'Parkinson\'s Disease Mechanism',
      description: 'Understanding how dopamine-producing neurons die and affect movement control.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '6:40',
      prevalence: '1 million Americans',
      severity: 'High',
    },
    {
      id: 4,
      title: 'Migraine: More Than Just Pain',
      description: 'Explore the complex neurological changes that occur during a migraine episode.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '5:25',
      prevalence: '39 million Americans',
      severity: 'Medium',
    },
  ],
};

export default function DiseaseDetailScreen() {
  const { category } = useLocalSearchParams();
  const diseases = diseaseData[category as keyof typeof diseaseData] || [];

  const handleBack = () => {
    router.back();
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#FF6B6B';
      case 'Medium': return '#FFB347';
      case 'Low': return '#4ECDC4';
      default: return '#4FACFE';
    }
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
        <View style={styles.header}>
          <Text style={styles.title}>
            {category === 'cardiology' ? 'Cardiology' : 'Neurology'}
          </Text>
          <Text style={styles.subtitle}>
            Watch detailed animations explaining how these conditions develop and progress
          </Text>
        </View>

        <View style={styles.diseasesSection}>
          {diseases.map((disease) => (
            <View key={disease.id} style={styles.diseaseCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  {/* YouTube Video Embed */}
                  <View style={styles.videoContainer}>
                    <WebView
                      source={{ uri: getYouTubeEmbedUrl(disease.youtubeId) }}
                      style={styles.webView}
                      allowsInlineMediaPlayback={true}
                      mediaPlaybackRequiresUserAction={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                      renderLoading={() => (
                        <View style={styles.videoPlaceholder}>
                          <Play size={40} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.loadingText}>Loading video...</Text>
                        </View>
                      )}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{disease.duration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.diseaseInfo}>
                    <View style={styles.diseaseHeader}>
                      <Text style={styles.diseaseTitle}>{disease.title}</Text>
                      <View style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(disease.severity) + '20' }
                      ]}>
                        <Text style={[
                          styles.severityText,
                          { color: getSeverityColor(disease.severity) }
                        ]}>
                          {disease.severity}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.diseaseDescription}>{disease.description}</Text>
                    
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Users size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.statText}>{disease.prevalence}</Text>
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
  loadingText: {
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
});