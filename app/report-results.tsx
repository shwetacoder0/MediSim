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
  Modal,
  useWindowDimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, Play, ChartBar as BarChart3, Eye, ChevronLeft, Download, Zap, MessageSquare, FileText, User } from 'lucide-react-native';
import { ReportProcessingService } from '../lib/reportProcessing';
import { supabase } from '../lib/supabase';
import ReportDetail from '../components/ReportDetail';
import { STORAGE_BUCKETS } from '../config/constants';

interface ReportData {
  report: any;
  analysis: any;
  visualization: any;
  images: any[];
}

export default function ReportResultsScreen() {
  const params = useLocalSearchParams();
  const { reportId } = params;
  const { width } = useWindowDimensions();

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      router.back();
      return;
    }

    fetchReportData();
  }, [reportId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch report data from Supabase
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) {
        console.error('Error fetching report:', reportError);
        throw new Error('Failed to fetch report data');
      }

      // Fetch analysis data
      const { data: analysisData, error: analysisError } = await supabase
        .from('report_analysis')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (analysisError) {
        console.error('Error fetching analysis:', analysisError);
      }

      // Fetch visualization data
      const { data: vizData, error: vizError } = await supabase
        .from('visualization_data')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (vizError) {
        console.error('Error fetching visualization data:', vizError);
      }

      setReportData({
        report: reportData,
        analysis: analysisData,
        visualization: vizData,
        images: reportData.images
      });

      // Check if we have an AI image already
      const { data: imageData, error: imageError } = await supabase
        .from('ai_images')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (imageError) {
        console.error('Error fetching image data:', imageError);
        // Upload the kidney image to Supabase storage
        await uploadKidneyImage();
      } else if (imageData) {
        setImageUrl(imageData.image_url);
        setReportData(prevData => ({
          ...prevData,
          images: [imageData]
        }));
      } else {
        // Upload the kidney image to Supabase storage
        await uploadKidneyImage();
      }

      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const uploadKidneyImage = async () => {
    try {
      // For demo purposes, we'll just create a record in the ai_images table
      // In a real app, you would upload the actual image file to Supabase storage

      const { data, error } = await supabase
        .from('ai_images')
        .insert({
          report_id: reportId,
          image_url: 'kidney_visualization.png', // This would normally be a URL to the stored image
          model_used: 'demo_model',
          generated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error uploading kidney image:', error);
      } else {
        console.log('Kidney image record created:', data);
        setImageUrl(data.image_url);
        setReportData(prevData => ({
          ...prevData,
          images: [data]
        }));
      }
    } catch (error) {
      console.error('Error in uploadKidneyImage:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      if (!imageUrl) return;

      await Share.share({
        message: 'Check out my medical report analysis from MediSim',
        url: imageUrl
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleWatchExplanation = async () => {
    setGeneratingVideo(true);

    // Simulate video generation
    setTimeout(() => {
      setGeneratingVideo(false);
      // In production, this would play the actual AI doctor video
      alert('AI Doctor video would play here with the explanation');
    }, 3000);
  };

  const handleViewMetrics = () => {
    setShowMetrics(true);
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Download report:', reportId);
  };

  const handleAskAI = () => {
    // Navigate to AI chat
    router.push({
      pathname: '/home',
      params: { reportId }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        />
        <ActivityIndicator size="large" color="#4FACFE" />
        <Text style={styles.loadingText}>Loading your results...</Text>
      </View>
    );
  }

  if (!reportData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load report data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* AI Generated Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/kidney-visualization.png')}
            style={[styles.visualImage, { width: width * 0.9, height: width * 0.9 }]}
            resizeMode="contain"
          />
        </View>

        {/* AI Doctor Section */}
        <View style={styles.doctorSection}>
          <BlurView intensity={20} tint="dark" style={styles.doctorCard}>
            <View style={styles.doctorContent}>
              <View style={styles.doctorInfo}>
                <View style={styles.doctorAvatar}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg' }}
                    style={styles.avatarImage}
                  />
                </View>
                <View style={styles.doctorText}>
                  <Text style={styles.doctorTitle}>Explain This to Me</Text>
                  <Text style={styles.doctorSubtitle}>
                    Tap to get a personalized AI doctor explanation of your results.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.watchButton}
                onPress={handleWatchExplanation}
                disabled={generatingVideo}
              >
                <LinearGradient
                  colors={['#4FACFE', '#00F2FE']}
                  style={styles.watchButtonGradient}
                >
                  {generatingVideo ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Play size={16} color="#FFFFFF" />
                      <Text style={styles.watchButtonText}>Watch Explanation</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Metrics Section */}
        <View style={styles.metricsSection}>
          <BlurView intensity={20} tint="dark" style={styles.metricsCard}>
            <LinearGradient
              colors={['#1E3A5F', '#2A4A6B']}
              style={styles.metricsGradient}
            >
              <View style={styles.metricsContent}>
                <View style={styles.metricsInfo}>
                  <Text style={styles.metricsTitle}>See Report Metrics</Text>
                  <Text style={styles.metricsSubtitle}>
                    Explore detailed analysis, visualizations, and interpretation summaries.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.metricsButton}
                  onPress={handleViewMetrics}
                >
                  <View style={styles.metricsButtonContent}>
                    <BarChart3 size={16} color="#1E3A5F" />
                    <Text style={styles.metricsButtonText}>View Metrics</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </ScrollView>

      {/* Metrics Modal */}
      <Modal
        visible={showMetrics}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMetrics(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.gradient}
          />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Analysis</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMetrics(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {reportData.visualization && (
              <>
                <View style={styles.metricsModalSection}>
                  <Text style={styles.sectionTitle}>Key Measurements</Text>
                  {reportData.visualization.metrics &&
                    Object.entries(reportData.visualization.metrics).map(([key, value]) => (
                      <View key={key} style={styles.metricRow}>
                        <Text style={styles.metricLabel}>{key}:</Text>
                        <Text style={styles.metricValue}>{String(value)}</Text>
                      </View>
                    ))
                  }
                </View>

                {reportData.visualization.visual_notes && (
                  <View style={styles.metricsModalSection}>
                    <Text style={styles.sectionTitle}>Analysis Notes</Text>
                    <Text style={styles.notesText}>
                      {reportData.visualization.visual_notes}
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  reportImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  doctorCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  doctorContent: {
    padding: 24,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  doctorText: {
    flex: 1,
  },
  doctorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  doctorSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  watchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  watchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  metricsSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  metricsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricsGradient: {
    padding: 24,
  },
  metricsContent: {
    flexDirection: 'column',
  },
  metricsInfo: {
    marginBottom: 20,
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metricsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  metricsButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  metricsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  metricsButtonText: {
    color: '#1E3A5F',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  metricsModalSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notesText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  visualImage: {
    width: '100%',
    height: '100%',
  },
});
