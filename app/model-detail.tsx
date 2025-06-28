import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw, ZoomIn, Play } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { getReportDetails } from '../lib/reports';

const modelData = {
  cardiovascular: [
    {
      id: 1,
      title: 'Human Heart',
      complexity: 'Advanced',
      interactions: '12 views',
      description: 'Detailed 3D model of the human heart showing chambers, valves, and major vessels.',
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    },
    {
      id: 2,
      title: 'Coronary Arteries',
      complexity: 'Intermediate',
      interactions: '8 views',
      description: 'Interactive model showing the coronary circulation system.',
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    },
  ],
  nervous: [
    {
      id: 1,
      title: 'Human Brain',
      complexity: 'Advanced',
      interactions: '15 views',
      description: 'Complete 3D brain model with detailed anatomical structures.',
      image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    },
    {
      id: 2,
      title: 'Spinal Cord',
      complexity: 'Intermediate',
      interactions: '10 views',
      description: 'Interactive spinal cord model showing nerve pathways.',
      image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    },
  ],
};

export default function ModelDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [showMetrics, setShowMetrics] = useState(false);
  const [generatingExplanation, setGeneratingExplanation] = useState(false);

  useEffect(() => {
    if (id) {
      loadReportData(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadReportData = async (reportId) => {
    try {
      setLoading(true);
      const data = await getReportDetails(reportId);
      setReportData(data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayExplanation = async () => {
    setGeneratingExplanation(true);
    // In a real app, this would trigger the AI doctor video generation
    // For now, we'll just simulate loading
    setTimeout(() => {
      setGeneratingExplanation(false);
      setVideoStatus({ shouldPlay: true });
    }, 2000);
  };

  const handleViewMetrics = () => {
    setShowMetrics(true);
  };

  const handleShare = async () => {
    try {
      if (!reportData) return;

      await Share.share({
        message: `Check out my medical report analysis from MediSim`,
        url: reportData.images[0]?.image_url
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // If there are no images yet, show a placeholder
  const imageUrl = reportData?.images && reportData.images.length > 0
    ? reportData.images[0].image_url
    : 'https://via.placeholder.com/400x300?text=Processing+Image';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Back button and share button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main MRI/Report Image */}
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="contain"
        />

        {/* AI Doctor Section */}
        <View style={styles.doctorCard}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorTextContainer}>
            <Text style={styles.doctorTitle}>Explain This to Me</Text>
            <Text style={styles.doctorSubtitle}>
              Tap to get a personalized AI doctor explanation of your results.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.watchButton}
            onPress={handlePlayExplanation}
            disabled={generatingExplanation}
          >
            {generatingExplanation ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.watchButtonText}>Watch Explanation</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Video Player (shown when explanation is ready) */}
        {videoStatus.shouldPlay && reportData?.analysis && (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }} // Sample video
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={videoStatus.shouldPlay}
              style={styles.video}
              useNativeControls
            />
          </View>
        )}

        {/* Report Metrics Section */}
        <View style={styles.metricsCard}>
          <View style={styles.metricsBackground}>
            <View style={styles.metricsTextContainer}>
              <Text style={styles.metricsTitle}>See Report Metrics</Text>
              <Text style={styles.metricsSubtitle}>
                Explore detailed analysis, visualizations, and interpretation summaries.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.metricsButton}
              onPress={handleViewMetrics}
            >
              <Text style={styles.metricsButtonText}>View Metrics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metrics Modal Content */}
        {showMetrics && reportData?.visualization && (
          <View style={styles.metricsModalContent}>
            <Text style={styles.metricsModalTitle}>Report Analysis</Text>

            {/* Sample metrics visualization */}
            <View style={styles.metricsSection}>
              <Text style={styles.metricsSectionTitle}>Key Measurements</Text>
              {reportData.visualization.metrics && Object.entries(reportData.visualization.metrics).map(([key, value]) => (
                <View key={key} style={styles.metricRow}>
                  <Text style={styles.metricLabel}>{key}:</Text>
                  <Text style={styles.metricValue}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.metricsSection}>
              <Text style={styles.metricsSectionTitle}>Notes</Text>
              <Text style={styles.metricsNotes}>{reportData.visualization.visual_notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#111',
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  doctorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  watchButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  watchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  metricsCard: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  metricsBackground: {
    backgroundColor: '#1E3A5F',
    padding: 20,
    position: 'relative',
  },
  metricsTextContainer: {
    marginBottom: 40,
  },
  metricsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  metricsSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  metricsButton: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  metricsButtonText: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
  metricsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
  },
  metricsModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsSection: {
    marginBottom: 20,
  },
  metricsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsNotes: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
});
