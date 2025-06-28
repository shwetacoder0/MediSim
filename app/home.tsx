import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import {
  Camera,
  Upload,
  Settings,
  User,
  Stethoscope,
  Activity,
  Microscope
} from 'lucide-react-native';
import MediaPicker from '../components/MediaPicker';

// Define types for file and report
interface FileData {
  uri: string;
  name: string;
  type: string;
  mimeType: string;
}

export default function HomeScreen() {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleTakePhoto = () => {
    setShowMediaPicker(true);
  };

  const handleUploadFile = () => {
    setShowMediaPicker(true);
  };

  const handleFileSelected = (file: FileData, reportType: string) => {
    // Navigate to the report screen with the file data
    router.push({
      pathname: '/report-screen' as any,
      params: { fileUri: file.uri, fileName: file.name, fileType: file.type, reportType }
    });
    setShowMediaPicker(false);
  };

  const handleExploreSection = (section: string) => {
    router.push(`/${section}` as any);
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Medisim</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleProfile}>
              <User size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
              <Settings size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainSection}>
          <Text style={styles.sectionTitle}>Visualize your health</Text>
          <Text style={styles.sectionSubtitle}>
            Upload your medical reports to get personalized illustrations and insights.
          </Text>

          <View style={styles.uploadButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleTakePhoto}>
              <LinearGradient
                colors={['#4FACFE', '#00F2FE']}
                style={styles.primaryGradient}
              >
                <Camera size={24} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Take a Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleUploadFile}>
              <BlurView intensity={20} tint="dark" style={styles.secondaryBlur}>
                <Upload size={24} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.secondaryButtonText}>Upload from Files</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Explore</Text>

          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => handleExploreSection('treatments')}
          >
            <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardLabel}>Explore</Text>
                  <Text style={styles.cardTitle}>Treatments</Text>
                  <Text style={styles.cardDescription}>
                    Discover the latest treatments for various conditions.
                  </Text>
                </View>
                <View style={styles.cardIcon}>
                  <Stethoscope size={40} color="#4FACFE" />
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => handleExploreSection('diseases')}
          >
            <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardLabel}>Learn</Text>
                  <Text style={styles.cardTitle}>Diseases</Text>
                  <Text style={styles.cardDescription}>
                    Understand diseases with detailed explanations and visuals.
                  </Text>
                </View>
                <View style={styles.cardIcon}>
                  <Activity size={40} color="#FF6B6B" />
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => handleExploreSection('3d-models')}
          >
            <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardLabel}>View</Text>
                  <Text style={styles.cardTitle}>3D Body Models</Text>
                  <Text style={styles.cardDescription}>
                    Interact with detailed 3D models of the human body.
                  </Text>
                </View>
                <View style={styles.cardIcon}>
                  <Microscope size={40} color="#4ECDC4" />
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Media Picker Modal */}
      <Modal
        visible={showMediaPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMediaPicker(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <MediaPicker onFileSelected={handleFileSelected} />
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 10,
  },
  mainSection: {
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  uploadButtons: {
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
  primaryGradient: {
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
  exploreSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  exploreCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    padding: 24,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  cardIcon: {
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 15,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
