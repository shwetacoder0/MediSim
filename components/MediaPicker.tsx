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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

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
            <LinearGradient
              colors={['#4FACFE', '#00F2FE']}
              style={styles.buttonGradient}
            >
              <Camera size={24} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Take a Photo</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={pickDocument}
            disabled={uploading}
          >
            <BlurView intensity={20} tint="dark" style={styles.secondaryBlur}>
              <Upload size={24} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.secondaryButtonText}>Upload from Files</Text>
            </BlurView>
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
                  size={16}
                  color={reportType === type ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
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
            <BlurView intensity={20} tint="dark" style={styles.uploadingBlur}>
              <ActivityIndicator size="large" color="#4FACFE" />
              <Text style={styles.uploadingText}>{getProcessingMessage()}</Text>
            </BlurView>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadSection: {
    marginBottom: 40,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  secondaryButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontWeight: '500',
  },
  reportTypeSection: {
    marginBottom: 40,
  },
  reportTypeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reportTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  reportTypeButtonActive: {
    backgroundColor: 'rgba(79, 172, 254, 0.3)',
    borderColor: '#4FACFE',
  },
  reportTypeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  uploadingBlur: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
