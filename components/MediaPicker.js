import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { REPORT_TYPES } from '../config/constants';

const MediaPicker = ({ onFileSelected }) => {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [loading, setLoading] = useState(false);

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

  const takePicture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: `camera_${Date.now()}.jpg`,
          type: 'image/jpeg',
          mimeType: 'image/jpeg',
        };

        onFileSelected(file, reportType);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          mimeType: result.assets[0].mimeType,
        };

        onFileSelected(file, reportType);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Medical Report</Text>
      <Text style={styles.subtitle}>
        We'll convert your medical report into a visual experience
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={takePicture}
          disabled={loading}
        >
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={pickDocument}
          disabled={loading}
        >
          <Ionicons name="document-text" size={32} color="#fff" />
          <Text style={styles.buttonText}>Upload from Files</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportTypeContainer}>
        <Text style={styles.reportTypeLabel}>Report Type:</Text>
        <View style={styles.reportTypeOptions}>
          {REPORT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.reportTypeButton,
                reportType === type && styles.reportTypeButtonActive,
              ]}
              onPress={() => setReportType(type)}
            >
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

      {/* Loading Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
  },
  reportTypeContainer: {
    width: '100%',
    marginTop: 20,
  },
  reportTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  reportTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  reportTypeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  reportTypeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  reportTypeText: {
    color: '#333',
  },
  reportTypeTextActive: {
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MediaPicker;
