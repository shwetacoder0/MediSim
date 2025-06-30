import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
  FlatList,
  Dimensions,
  TextInput
} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, Play, ChartBar as BarChart3, Eye, ChevronLeft, Download, Zap, MessageSquare, FileText, User, ChevronRight, Circle, X, Mic, Send, Pause } from 'lucide-react-native';
import { ReportProcessingService } from '../lib/reportProcessing';
import { supabase } from '../lib/supabase';
import ReportDetail from '../components/ReportDetail';
import { STORAGE_BUCKETS } from '../config/constants';
import { Video, ResizeMode } from 'expo-av';
import ConversationalAI from '../components/ConversationalAI';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const videoRef = useRef<Video>(null);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // AI Doctor modal states
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hardcoded kidney images for now
  const kidneyImages = [
    require('../assets/images/kidney-visualization.png'),
    require('../assets/images/u9.png'),
    require('../assets/images/o9.png'),
  ];

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

      // Check if we have AI images already
      const { data: imageData, error: imageError } = await supabase
        .from('ai_images')
        .select('*')
        .eq('report_id', reportId);

      if (imageError) {
        console.error('Error fetching image data:', imageError);
        // Upload the kidney images to Supabase storage
        await uploadKidneyImage();
      } else if (imageData && imageData.length > 0) {
        // Set the first image URL as the main one
        setImageUrl(imageData[0].image_url);
        setReportData(prevData => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            images: imageData
          };
        });
      } else {
        // Upload the kidney images to Supabase storage
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
      // For demo purposes, we'll create records in the ai_images table for all three images
      // In a real app, you would upload the actual image files to Supabase storage

      const imageNames = ['kidney_visualization.png', 'urinary_tract_analysis.png', 'organ_interaction_model.png'];
      const modelTypes = ['kidney_3d_model', 'urinary_tract_model', 'organ_interaction_model'];

      const imagePromises = imageNames.map((imageName, index) => {
        return supabase
          .from('ai_images')
          .insert({
            report_id: reportId,
            image_url: imageName, // This would normally be a URL to the stored image
            model_used: modelTypes[index],
            generated_at: new Date().toISOString()
          })
          .select();
      });

      const results = await Promise.all(imagePromises);

      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Error uploading kidney images:', errors);
      } else {
        console.log('Kidney image records created:', results.map(r => r.data));

        // Set the first image URL as the main one
        if (results[0].data && results[0].data.length > 0) {
          setImageUrl(results[0].data[0].image_url);
        }

        // Update report data with all images
        setReportData(prevData => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            images: results.map(r => r.data && r.data[0]).filter(Boolean)
          };
        });
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

    // Simulate video preparation
    setTimeout(() => {
      setGeneratingVideo(false);
      setShowDoctorModal(true);
    }, 1000);
  };

  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
    setIsVideoPlaying(false);
    setIsCallActive(false);
    setShowDoctorModal(false);
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // ElevenLabs conversation status is now managed by the ConversationalAI component
  // via the onStatusChange callback

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

  const handleImageChange = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleNextImage = () => {
    const nextIndex = (activeImageIndex + 1) % kidneyImages.length;
    setActiveImageIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = activeImageIndex === 0 ? kidneyImages.length - 1 : activeImageIndex - 1;
    setActiveImageIndex(prevIndex);
  };

    // Get image source based on index and available data
  const getImageSource = (index: number) => {
    // If we have images from the database, use those URLs
    if (reportData?.images && reportData.images.length > index) {
      // In a real app, this would be a full URL from Supabase storage
      const imageUrl = reportData.images[index].image_url;

      // For demo purposes, we'll map the image names to local assets
      if (imageUrl.includes('kidney_visualization')) {
        return kidneyImages[0];
      } else if (imageUrl.includes('urinary_tract')) {
        return kidneyImages[1];
      } else if (imageUrl.includes('organ_interaction')) {
        return kidneyImages[2];
      }
    }
    // Otherwise use local assets
    return kidneyImages[index];
  };

  // Sample visualization data for charts
  const sampleChartData = {
    "kidney_sizes_cm": {
      "left_kidney": [10.6, 4.5, 5.4],
      "normal_range": [10.0, 4.0, 5.0],
      "right_kidney": [11.3, 4.5, 5.2]
    },
    "stone_presence": {
      "left_kidney": {
        "present": true,
        "size_cm": 0.2,
        "location": "interpolar",
        "type": "non-obstructing"
      },
      "right_kidney": false
    },
    "hydronephrosis": {
      "left_kidney": false,
      "right_kidney": false
    },
    "ureter_status": {
      "left": "normal",
      "right": "normal"
    },
    "vascular_findings": {
      "aorta_calcification": true,
      "right_iliofemoral_calcification": true
    },
    "skeletal_findings": {
      "dorsal_spine_osteophytes": true
    },
    "bladder": {
      "filling": "adequate",
      "defects": false
    }
  };

  const sampleMetrics = {
    "renal_stone_size_mm": 2,
    "stone_density_HU": 150,
    "hydronephrosis": false,
    "ureter_dilation": false,
    "vascular_calcification_detected": 2,
    "skeletal_anomalies": 1,
    "organs_visualized": 6,
    "abnormal_findings_count": 4
  };

  // Get chart data from report or use sample data
  const getChartData = () => {
    if (reportData?.visualization?.chart_data) {
      return reportData.visualization.chart_data;
    }
    return sampleChartData;
  };

  // Get metrics from report or use sample data
  const getMetrics = () => {
    if (reportData?.visualization?.metrics) {
      return reportData.visualization.metrics;
    }
    return sampleMetrics;
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {/* Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          {/* Main Image */}
          <View style={styles.mainImageContainer}>
            <Image
              source={getImageSource(activeImageIndex)}
              style={styles.mainImage}
              resizeMode="contain"
            />

            {/* Navigation Arrows */}
            <TouchableOpacity
              style={[styles.imageNavButton, styles.imageNavButtonLeft]}
              onPress={handlePrevImage}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageNavButton, styles.imageNavButtonRight]}
              onPress={handleNextImage}
            >
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

                        {/* Image Dots Indicator */}
        <View style={styles.imageDotContainer}>
          {kidneyImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageChange(index)}
              style={styles.dotButton}
            >
              <View style={[
                styles.dot,
                activeImageIndex === index ? styles.activeDot : {}
              ]} />
            </TouchableOpacity>
          ))}
        </View>
        </View>

                        {/* Image Description */}
        <View style={styles.imageDescriptionContainer}>
          <BlurView intensity={15} tint="dark" style={styles.descriptionBlur}>
            <Text style={styles.imageTitle}>
              {activeImageIndex === 0 ? 'Kidney 3D Visualization' :
               activeImageIndex === 1 ? 'Urinary Tract Analysis' :
               'Organ Interaction Model'}
            </Text>
            <Text style={styles.imageDescription}>
              {activeImageIndex === 0 ?
                'AI-generated 3D visualization of your kidney scan showing detailed internal structures and highlighting areas of interest from your medical report.' :
               activeImageIndex === 1 ?
                'Comprehensive view of your urinary tract system with highlighted areas showing the flow and potential blockage points identified in your scan.' :
                'Interactive model showing how your kidneys interact with surrounding organs, helping to understand the full context of your medical condition.'}
            </Text>
          </BlurView>
        </View>

        {/* AI Doctor Card - Horizontal */}
        <View style={styles.aiDoctorCardContainer}>
          <BlurView intensity={20} tint="dark" style={styles.aiDoctorCardBlur}>
            <TouchableOpacity
              style={styles.aiDoctorCardContent}
              onPress={handleWatchExplanation}
              disabled={generatingVideo}
            >
              <View style={styles.aiDoctorIconSection}>
                <View style={styles.aiDoctorIconContainer}>
                  <User size={24} color="#4FACFE" />
                </View>
              </View>
              <View style={styles.aiDoctorTextSection}>
                <Text style={styles.aiDoctorTitle}>AI Doctor Explanation</Text>
                <Text style={styles.aiDoctorDescription}>
                  Get a personalized explanation of your results from our AI doctor
                </Text>
              </View>
              <View style={styles.aiDoctorActionSection}>
                {generatingVideo ? (
                  <ActivityIndicator color="#4FACFE" size="small" />
                ) : (
                  <View style={styles.aiDoctorPlayButton}>
                    <Play size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Data Visualization Section */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Data Visualization</Text>
          <Text style={styles.sectionSubtitle}>
            Key metrics and measurements from your scan
          </Text>
        </View>

        {/* Charts Section */}
        <View style={styles.chartsContainer}>
          {/* Kidney Size Comparison Chart */}
          <View style={styles.chartCard}>
            <BlurView intensity={15} tint="dark" style={styles.chartBlur}>
              <Text style={styles.chartTitle}>Kidney Size Comparison</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={{
                    labels: ['Length', 'Width', 'Depth'],
                    datasets: [
                      {
                        data: getChartData().kidney_sizes_cm.left_kidney,
                        color: (opacity = 1) => `rgba(79, 172, 254, ${opacity})`,
                        strokeWidth: 2,
                      },
                      {
                        data: getChartData().kidney_sizes_cm.right_kidney,
                        color: (opacity = 1) => `rgba(0, 242, 254, ${opacity})`,
                        strokeWidth: 2,
                      },
                      {
                        data: getChartData().kidney_sizes_cm.normal_range,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.5})`,
                        strokeWidth: 2,
                      },
                    ]
                  }}
                  withHorizontalLabels={true}
                  fromZero={true}
                  showBarTops={true}
                  segments={5}
                  yAxisLabel=""
                  yAxisSuffix="cm"
                  width={Dimensions.get('window').width - 60}
                  height={220}
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: 'rgba(30, 58, 95, 0.4)',
                    backgroundGradientTo: 'rgba(42, 74, 107, 0.4)',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
                              <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(79, 172, 254, 1)' }]} />
                    <Text style={styles.legendText}>Left Kidney</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 242, 254, 1)' }]} />
                    <Text style={styles.legendText}>Right Kidney</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]} />
                    <Text style={styles.legendText}>Normal Range</Text>
                  </View>
                </View>
                <Text style={styles.chartDescription}>
                  Comparison of your kidney dimensions (cm) against normal range
                </Text>
            </BlurView>
          </View>

          {/* Health Metrics Chart */}
          <View style={styles.chartCard}>
            <BlurView intensity={15} tint="dark" style={styles.chartBlur}>
              <Text style={styles.chartTitle}>Key Health Metrics</Text>
              <View style={styles.metricsGrid}>
                {Object.entries(getMetrics()).map(([key, value], index) => (
                  <View key={index} style={styles.metricItem}>
                    <View style={[
                      styles.metricIcon,
                      typeof value === 'boolean' ?
                        (value ? styles.metricIconWarning : styles.metricIconGood) :
                        (typeof value === 'number' && value > 0 ? styles.metricIconInfo : styles.metricIconGood)
                    ]}>
                      <Text style={styles.metricIconText}>
                        {typeof value === 'boolean' ? (value ? '!' : '✓') :
                         typeof value === 'number' ? value : '?'}
                      </Text>
                    </View>
                    <Text style={styles.metricItemLabel}>
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </BlurView>
          </View>

          {/* Stone Analysis Chart */}
          {getChartData().stone_presence.left_kidney && (
            <View style={styles.chartCard}>
              <BlurView intensity={15} tint="dark" style={styles.chartBlur}>
                <Text style={styles.chartTitle}>Stone Analysis</Text>
                <View style={styles.stoneAnalysisContainer}>
                  <View style={styles.stoneVisual}>
                    <View style={[styles.stoneCircle, {
                      width: Math.max(getChartData().stone_presence.left_kidney.size_cm * 100, 20),
                      height: Math.max(getChartData().stone_presence.left_kidney.size_cm * 100, 20),
                    }]} />
                    <Text style={styles.stoneSize}>
                      {getChartData().stone_presence.left_kidney.size_cm} cm
                    </Text>
                  </View>
                  <View style={styles.stoneDetails}>
                    <View style={styles.stoneDetailRow}>
                      <Text style={styles.stoneDetailLabel}>Location:</Text>
                      <Text style={styles.stoneDetailValue}>
                        {getChartData().stone_presence.left_kidney.location}
                      </Text>
                    </View>
                    <View style={styles.stoneDetailRow}>
                      <Text style={styles.stoneDetailLabel}>Type:</Text>
                      <Text style={styles.stoneDetailValue}>
                        {getChartData().stone_presence.left_kidney.type}
                      </Text>
                    </View>
                    <View style={styles.stoneDetailRow}>
                      <Text style={styles.stoneDetailLabel}>Density:</Text>
                      <Text style={styles.stoneDetailValue}>
                        {getMetrics().stone_density_HU} HU
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </View>
          )}
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Interactive Analysis</Text>
          <Text style={styles.sectionSubtitle}>
            Explore your medical data through these interactive tools
          </Text>
        </View>

                {/* Cards Container */}
        <View style={styles.singleCardContainer}>
          {/* Visualization Card */}
          <TouchableOpacity
            style={styles.fullWidthCard}
            onPress={handleViewMetrics}
          >
            <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
              <LinearGradient
                colors={['rgba(30, 58, 95, 0.2)', 'rgba(42, 74, 107, 0.2)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIconContainer}>
                    <BarChart3 size={28} color="#E0F2FE" />
                  </View>
                  <Text style={styles.cardTitle}>Advanced Metrics</Text>
                  <Text style={styles.cardDescription}>
                    Explore detailed analysis and comprehensive report metrics
                  </Text>
                  <View style={[styles.cardButton, styles.vizButton]}>
                    <Eye size={16} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfoContainer}>
          <BlurView intensity={15} tint="dark" style={styles.additionalInfoBlur}>
            <Text style={styles.additionalInfoTitle}>About Your 3D Models</Text>
            <Text style={styles.additionalInfoText}>
              These 3D visualizations are generated using advanced AI algorithms that process your medical scan data.
              Each image highlights different aspects of your kidney health, providing a comprehensive view of your condition.
              You can explore all three visualizations to better understand your medical report.
            </Text>
            <TouchableOpacity
              style={styles.learnMoreButton}
              onPress={() => router.push('/3d-models')}
            >
              <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
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

      {/* AI Doctor Modal */}
      <Modal
        visible={showDoctorModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.doctorModalContainer}>
          <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.gradient}
          />

          {/* Modal Header */}
          <View style={styles.doctorModalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.doctorModalTitle}>AI Doctor Consultation</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Video Player */}
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={require('../assets/images/ea44bdb309.mp4')}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              style={styles.video}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  setIsVideoPlaying(status.isPlaying);
                }
              }}
            />
            <TouchableOpacity
              style={styles.videoControlButton}
              onPress={handlePlayPause}
            >
              {isVideoPlaying ? (
                <Pause size={24} color="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* ElevenLabs Voice Conversation Section */}
          <View style={styles.conversationContainer}>
            <View style={styles.conversationStatus}>
              {isProcessing ? (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#4FACFE" />
                  <Text style={styles.processingText}>Connecting to AI Doctor...</Text>
                </View>
              ) : isCallActive ? (
                <View style={styles.activeCallContainer}>
                  <View style={styles.waveformContainer}>
                    <View style={[styles.waveBar, styles.waveBar1]} />
                    <View style={[styles.waveBar, styles.waveBar2]} />
                    <View style={[styles.waveBar, styles.waveBar3]} />
                    <View style={[styles.waveBar, styles.waveBar4]} />
                    <View style={[styles.waveBar, styles.waveBar5]} />
                  </View>
                  <Text style={styles.callActiveText}>AI Doctor is listening...</Text>
                  <Text style={styles.callInstructionText}>Speak clearly and ask questions about your report</Text>
                </View>
              ) : (
                <View style={styles.startCallContainer}>
                  <Text style={styles.startCallText}>Start a voice conversation with the AI doctor</Text>
                  <Text style={styles.callDescriptionText}>
                    The AI will listen to your questions and respond with information about your kidney scan
                  </Text>
                </View>
              )}
            </View>

            {/* ElevenLabs Conversational AI Component */}
            <View style={styles.elevenlabsContainer}>
              <ConversationalAI
                dom={{ style: styles.conversationalAI }}
                reportId={reportId as string}
                onStatusChange={(status) => {
                  if (status === 'connected') {
                    setIsCallActive(true);
                    setIsProcessing(false);
                  } else if (status === 'disconnected') {
                    setIsCallActive(false);
                    setIsProcessing(false);
                  } else if (status === 'error') {
                    setIsCallActive(false);
                    setIsProcessing(false);
                    alert('Error connecting to AI Doctor. Please try again.');
                  }
                }}
              />
            </View>
          </View>
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
  chartsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  chartCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chartBlur: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 15,
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiDoctorCardContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiDoctorCardBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  aiDoctorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  aiDoctorIconSection: {
    marginRight: 16,
  },
  aiDoctorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiDoctorTextSection: {
    flex: 1,
    paddingRight: 10,
  },
  aiDoctorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiDoctorDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  aiDoctorActionSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiDoctorPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4FACFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  metricIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricIconGood: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  metricIconWarning: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  metricIconInfo: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
  },
  metricIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricItemLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  stoneAnalysisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  stoneVisual: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stoneCircle: {
    backgroundColor: 'rgba(255, 107, 107, 0.6)',
    borderRadius: 100,
    marginBottom: 8,
  },
  stoneSize: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stoneDetails: {
    width: '58%',
  },
  stoneDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stoneDetailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stoneDetailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
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
  imageGalleryContainer: {
    width: '100%',
    height: 350,
    marginBottom: 10,
  },
  mainImageContainer: {
    width: '100%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '90%',
    height: '90%',
    borderRadius: 16,
  },
  imageNavButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageNavButtonLeft: {
    left: 20,
  },
  imageNavButtonRight: {
    right: 20,
  },
  imageDotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  dotButton: {
    padding: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4FACFE',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  imageDescriptionContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
  },
  descriptionBlur: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  imageDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  singleCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  fullWidthCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4FACFE',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  vizButton: {
    backgroundColor: '#1E3A5F',
  },
  additionalInfoContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  additionalInfoBlur: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  additionalInfoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  learnMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: '#4FACFE',
    fontWeight: '600',
    fontSize: 14,
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
  // AI Doctor Modal styles
  doctorModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  doctorModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  doctorModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControlButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationStatus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 20,
  },
  activeCallContainer: {
    alignItems: 'center',
    padding: 20,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginBottom: 20,
  },
  waveBar: {
    width: 4,
    marginHorizontal: 3,
    backgroundColor: '#4FACFE',
    borderRadius: 2,
  },
  waveBar1: {
    height: 15,
  },
  waveBar2: {
    height: 30,
  },
  waveBar3: {
    height: 45,
  },
  waveBar4: {
    height: 30,
  },
  waveBar5: {
    height: 15,
  },
  callActiveText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  callInstructionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  startCallContainer: {
    alignItems: 'center',
    padding: 20,
  },
  startCallText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  callDescriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  callControls: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  startCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4FACFE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  endCallButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  callButtonIcon: {
    marginRight: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  elevenlabsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  conversationalAI: {
    width: 120,
    height: 60,
  },
});
