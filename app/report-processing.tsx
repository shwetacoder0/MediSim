import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ReportProcessor from '../components/ReportProcessor';

export default function ReportProcessingScreen() {
  const params = useLocalSearchParams();
  const { reportId, fileUri, mimeType, reportType, extractedText } = params;
  const [showExtractedText, setShowExtractedText] = useState(true);
  const [parsedText, setParsedText] = useState<any>(null);

  useEffect(() => {
    if (extractedText) {
      try {
        const parsed = JSON.parse(extractedText as string);
        setParsedText(parsed);
      } catch (error) {
        console.error('Error parsing extracted text:', error);
      }
    }
  }, [extractedText]);

  const handleProcessingComplete = (success: boolean, error?: string) => {
    if (success) {
      // Navigate to the report results page
      router.replace({
        pathname: '/report-results',
        params: { reportId }
      });
    } else {
      Alert.alert(
        'Processing Failed',
        error || 'Failed to process your report. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => router.back()
          },
          {
            text: 'Go Home',
            onPress: () => router.push('/home')
          }
        ]
      );
    }
  };

  if (!reportId || !fileUri || !mimeType || !reportType) {
    Alert.alert('Error', 'Missing required parameters');
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      {showExtractedText && parsedText ? (
        <ScrollView style={styles.extractedTextContainer}>
          <BlurView intensity={15} tint="dark" style={styles.extractedTextBlur}>
            <View style={styles.extractedTextHeader}>
              <Text style={styles.extractedTextTitle}>Extracted Text</Text>
              <Text style={styles.extractedTextSubtitle}>
                Text extracted from your {reportType}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.confidenceText}>
                Confidence: {(parsedText.confidence * 100).toFixed(1)}%
              </Text>

              <Text style={styles.extractedText}>
                {parsedText.text}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Text
                style={styles.continueButton}
                onPress={() => setShowExtractedText(false)}
              >
                Continue to Processing
              </Text>
            </View>
          </BlurView>
        </ScrollView>
      ) : (
      <ReportProcessor
        reportId={reportId as string}
        fileUri={fileUri as string}
        mimeType={mimeType as string}
        reportType={reportType as string}
        onProcessingComplete={handleProcessingComplete}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  extractedTextContainer: {
    flex: 1,
    padding: 20,
  },
  extractedTextBlur: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
  },
  extractedTextHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  extractedTextTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  extractedTextSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  confidenceText: {
    fontSize: 14,
    color: '#4FACFE',
    marginBottom: 12,
    fontWeight: '600',
  },
  extractedText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#4FACFE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    overflow: 'hidden',
  },
});
