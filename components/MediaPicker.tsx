import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Camera, Upload, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { REPORT_TYPES, STORAGE_BUCKETS } from '../config/constants';

interface FileData {
  uri: string;
  name: string;
  type: string;
  mimeType: string;
}

interface MediaPickerProps {
  onFileSelected?: (file: FileData, reportType: string) => void;
}

export default function MediaPicker({ onFileSelected }: MediaPickerProps) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [uploading, setUploading] = useState(false);
  const [processingStep, setProcessingStep] = useState<'idle' | 'uploading' | 'complete'>('idle');
  const [processingMessage, setProcessingMessage] = useState('');

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera and media library permissions to use this feature.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  const uploadFileToSupabase = async (file: FileData): Promise<string> => {
    try {
      setProcessingStep('uploading');
      setProcessingMessage('Uploading your file...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // For React Native, we need to use a different approach
      // Read file as base64 and upload directly
      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload to Supabase storage using base64
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.REPORTS)
        .upload(fileName, fileContent, {
          contentType: file.mimeType,
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKETS.REPORTS)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const createReportRecord = async (fileUrl: string, fileName: string): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          file_url: fileUrl,
          report_type: reportType,
          original_filename: fileName
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating report record:', error);
      throw error;
    }
  };

  const handleFileUpload = async (file: FileData) => {
    try {
      setUploading(true);

      // Step 1: Upload file to Supabase
      const fileUrl = await uploadFileToSupabase(file);

      // Step 2: Create report record
      const reportId = await createReportRecord(fileUrl, file.name);

      setProcessingStep('complete');

      // Step 3: Navigate to processing screen
      router.push({
        pathname: '/report-processing',
        params: {
          reportId,
          fileUri: file.uri,
          mimeType: file.mimeType,
          reportType
        }
      });

      // Call callback if provided
      if (onFileSelected) {
        onFileSelected(file, reportType);
      }

    } catch (error) {
      console.error('Error handling file upload:', error);
      Alert.alert('Upload Failed', `Failed to upload your file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      setProcessingStep('idle');
    }
  };

  const takePicture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const file: FileData = {
          uri: result.assets[0].uri,
          name: `camera_${Date.now()}.jpg`,
          type: 'image/jpeg',
          mimeType: 'image/jpeg',
        };

        await handleFileUpload(file);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file: FileData = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'application/octet-stream',
          mimeType: result.assets[0].mimeType || 'application/octet-stream',
        };

        await handleFileUpload(file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const getProcessingMessage = () => {
    switch (processingStep) {
      case 'uploading':
        return 'Uploading your report...';
      case 'complete':
        return 'Upload complete!';
      default:
        return 'Processing your report...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Medical Report</Text>
          <Text style={styles.subtitle}>
            We'll convert your medical report into a visual experience
          </Text>
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={takePicture}
            disabled={uploading}
          >
            <View style={styles.buttonGradient}>
              <Camera size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Take a Photo</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={pickDocument}
            disabled={uploading}
          >
            <Upload size={20} color="#6B7280" />
            <Text style={styles.secondaryButtonText}>Upload from Files</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportTypeSection}>
          <Text style={styles.reportTypeLabel}>Report Type:</Text>
          <View style={styles.reportTypeGrid}>
            {REPORT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.reportTypeButton,
                  reportType === type && styles.reportTypeButtonActive,
                ]}
                onPress={() => setReportType(type)}
                disabled={uploading}
              >
                <FileText
                  size={14}
                  color={reportType === type ? '#FFFFFF' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.reportTypeText,
                    reportType === type && styles.reportTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {uploading && (
          <View style={styles.uploadingContainer}>
            <View style={styles.uploadingContent}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.uploadingText}>{getProcessingMessage()}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadSection: {
    marginBottom: 32,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
    backgroundColor: '#4A90E2',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  reportTypeSection: {
    marginBottom: 32,
  },
  reportTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reportTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  reportTypeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  reportTypeText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  reportTypeTextActive: {
    color: '#FFFFFF',
  },
  uploadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
  },
  uploadingContent: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  uploadingText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '500',
  },
});