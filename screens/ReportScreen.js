import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Share, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MediaPicker from '../components/MediaPicker';
import ReportDetail from '../components/ReportDetail';
import { uploadReport, getReportDetails } from '../lib/reports';
import { saveAIImage, saveReportAnalysis, saveVisualizationData } from '../lib/reports';
import { isProUser } from '../lib/auth';
import { FREE_TIER_LIMITS } from '../config/constants';

/**
 * @typedef {Object} FileData
 * @property {string} uri - The URI of the file
 * @property {string} name - The name of the file
 * @property {string} type - The MIME type of the file
 * @property {string} mimeType - The MIME type of the file (duplicate for compatibility)
 */

/**
 * @param {Object} props
 * @param {FileData} [props.initialFileData] - Initial file data passed from navigation
 * @param {string} [props.initialReportType] - Initial report type passed from navigation
 */
const ReportScreen = ({ initialFileData, initialReportType }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [processingReport, setProcessingReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [usageCount, setUsageCount] = useState({
    images: 0,
    videos: 0
  });

  // Check if we're viewing an existing report
  const reportId = route.params?.reportId;

  useEffect(() => {
    // Check user's subscription status
    const checkSubscription = async () => {
      const proStatus = await isProUser();
      setIsPro(proStatus);
    };

    checkSubscription();

    // If we have a reportId, load the report data
    if (reportId) {
      loadReportData(reportId);
    }

    // If we have initialFileData, process it
    if (initialFileData && initialReportType) {
      handleFileSelected(initialFileData, initialReportType);
    }
  }, [reportId, initialFileData, initialReportType]);

  const loadReportData = async (id) => {
    try {
      setLoading(true);
      const data = await getReportDetails(id);
      setReportData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load report data');
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = async (file, reportType) => {
    try {
      // Check usage limits for free tier
      if (!isPro && usageCount.images >= FREE_TIER_LIMITS.AI_IMAGES) {
        navigation.navigate('Paywall');
        return;
      }

      // File already selected in MediaPicker, now we're processing
      setProcessingReport(true);

      // 1. Upload the report file
      const report = await uploadReport(file, reportType);

      // 2. Simulate AI processing
      // In a real app, this would call your backend to process the report

      // 3. Save a sample AI image
      const imageUrl = 'https://via.placeholder.com/400x300?text=AI+Generated+Image';
      const image = await saveAIImage(report.id, imageUrl, 'OpenAI');

      // 4. Save sample analysis
      const analysis = await saveReportAnalysis(
        report.id,
        'This is a sample AI summary of the report.',
        'This is a detailed explanation that would be used for the AI doctor video.'
      );

      // 5. Save sample visualization data
      const visualization = await saveVisualizationData(
        report.id,
        { chartData: [{ x: 1, y: 2 }, { x: 2, y: 3 }] }, // Sample chart data
        { 'Disc Height': '4.2mm', 'Compression': 'Mild' }, // Sample metrics
        'The analysis shows normal disc height with mild compression.'
      );

      // 6. Load the complete report data
      await loadReportData(report.id);

      // 7. Update usage count
      setUsageCount(prev => ({
        ...prev,
        images: prev.images + 1
      }));

    } catch (error) {
      Alert.alert('Error', 'Failed to process report');
      console.error('Error processing report:', error);
    } finally {
      setProcessingReport(false);
    }
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

  // Show loading indicator when initial data is loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reportData ? (
        <ReportDetail
          report={reportData.report}
          analysis={reportData.analysis}
          visualization={reportData.visualization}
          images={reportData.images}
          onShare={handleShare}
        />
      ) : (
        <MediaPicker onFileSelected={handleFileSelected} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportScreen;
