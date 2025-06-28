import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import ReportProcessor from '../components/ReportProcessor';

export default function ReportProcessingScreen() {
  const params = useLocalSearchParams();
  const { reportId, fileUri, mimeType, reportType } = params;

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
      <ReportProcessor
        reportId={reportId as string}
        fileUri={fileUri as string}
        mimeType={mimeType as string}
        reportType={reportType as string}
        onProcessingComplete={handleProcessingComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});