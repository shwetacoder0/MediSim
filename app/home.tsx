import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  Camera,
  Upload,
  Settings,
  User,
  Stethoscope,
  Activity,
  Microscope,
  MessageCircle,
  X
} from 'lucide-react-native';
import MediaPicker from '../components/MediaPicker';
import AIDoctorChat from '../components/AIDoctorChat';
import { useAuth } from '../lib/auth-context';

export default function HomeScreen() {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showAIDoctor, setShowAIDoctor] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to auth screen if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isLoading, isAuthenticated]);

  const handleTakePhoto = () => {
    setShowMediaPicker(true);
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

  const handleAIDoctorChat = () => {
    setShowAIDoctor(true);
  };

  const handleCloseAIDoctor = () => {
    setShowAIDoctor(false);
  };

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Medisim</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleProfile}>
              <User size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
              <Settings size={20} color="#6B7280" />
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
              <View style={styles.primaryGradient}>
                <Camera size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Upload Report</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Doctor Section */}
        <View style={styles.aiDoctorSection}>
          <Text style={styles.aiDoctorTitle}>24/7 AI Medical Assistant</Text>
          <Text style={styles.aiDoctorSubtitle}>
            Get instant medical guidance and answers to your health questions
          </Text>

          <TouchableOpacity style={styles.aiDoctorButton} onPress={handleAIDoctorChat}>
            <View style={styles.aiDoctorContent}>
              <View style={styles.aiDoctorIconContainer}>
                <MessageCircle size={20} color="#4A90E2" />
              </View>
              <View style={styles.aiDoctorTextContainer}>
                <Text style={styles.aiDoctorButtonTitle}>Start AI Consultation</Text>
                <Text style={styles.aiDoctorButtonSubtitle}>
                  Chat with our AI doctor about your health
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Explore</Text>

          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => handleExploreSection('treatments')}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardLabel}>Explore</Text>
                <Text style={styles.cardTitle}>Treatments</Text>
                <Text style={styles.cardDescription}>
                  Watch animated videos showing how medical treatments work.
                </Text>
              </View>
              <View style={styles.cardIcon}>
                <Stethoscope size={32} color="#4A90E2" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => handleExploreSection('diseases')}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardLabel}>Learn</Text>
                <Text style={styles.cardTitle}>Diseases</Text>
                <Text style={styles.cardDescription}>
                  Understand diseases with detailed explanations and visuals.
                </Text>
              </View>
              <View style={styles.cardIcon}>
                <Activity size={32} color="#6BCF7F" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => handleExploreSection('3d-models')}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardLabel}>View</Text>
                <Text style={styles.cardTitle}>3D Body Models</Text>
                <Text style={styles.cardDescription}>
                  Interact with detailed 3D models of the human body.
                </Text>
              </View>
              <View style={styles.cardIcon}>
                <Microscope size={32} color="#FF8A65" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Media Picker Modal */}
      <Modal
        visible={showMediaPicker}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <MediaPicker />
        <TouchableOpacity
          style={styles.closeModalButton}
          onPress={() => setShowMediaPicker(false)}
        >
          <X size={20} color="#6B7280" />
        </TouchableOpacity>
      </Modal>

      {/* AI Doctor Modal */}
      <Modal
        visible={showAIDoctor}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseAIDoctor}
      >
        <View style={styles.aiDoctorModalContainer}>
          {/* Modal Header */}
          <View style={styles.aiDoctorModalHeader}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={handleCloseAIDoctor}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.aiDoctorModalTitle}>AI Medical Assistant</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* AI Doctor Chat Component */}
          <View style={styles.aiDoctorChatContainer}>
            <AIDoctorChat 
              onClose={handleCloseAIDoctor}
              patientContext="Patient seeking general medical consultation and health guidance"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainSection: {
    paddingHorizontal: 30,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  uploadButtons: {
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
  primaryGradient: {
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
  aiDoctorSection: {
    paddingHorizontal: 30,
    marginBottom: 32,
  },
  aiDoctorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  aiDoctorSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  aiDoctorButton: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  aiDoctorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  aiDoctorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiDoctorTextContainer: {
    flex: 1,
  },
  aiDoctorButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  aiDoctorButtonSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 16,
  },
  exploreSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  exploreTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  exploreCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  cardLeft: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  cardIcon: {
    marginLeft: 16,
  },
  closeModalButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiDoctorModalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  aiDoctorModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 114, 128, 0.1)',
  },
  aiDoctorModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  aiDoctorChatContainer: {
    flex: 1,
  },
});