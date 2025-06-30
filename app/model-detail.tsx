import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Eye, X, Maximize } from 'lucide-react-native';
import { EducationService, EducationSection } from '../lib/educationService';
import GLBViewer from '../components/GLBViewer';

const { width, height } = Dimensions.get('window');

export default function ModelDetailScreen() {
  const { category } = useLocalSearchParams();
  const [models, setModels] = useState<EducationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<EducationSection | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    loadModels();
  }, [category]);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await EducationService.getEducationSectionsByCategory('3d-models', category as string);
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleModelPress = (model: EducationSection) => {
    setSelectedModel(model);
  };

  const handleFullscreen = () => {
    setShowFullscreen(true);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'nervous': return 'Brain Models';
      case 'digestive': return 'Intestine Models';
      default: return '3D Models';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading 3D models...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#6B7280" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{getCategoryTitle()}</Text>
          <Text style={styles.subtitle}>
            Interactive 3D models for detailed anatomical study
          </Text>
        </View>

        <View style={styles.modelsSection}>
          {models.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={styles.modelCard}
              onPress={() => handleModelPress(model)}
            >
              <View style={styles.cardContent}>
                {/* 3D Model Preview */}
                <View style={styles.modelPreviewContainer}>
                  <GLBViewer
                    modelUrl={EducationService.get3DModelUrl(model.glb_file_url || '')}
                    style={styles.modelPreview}
                  />
                  <View style={styles.previewOverlay}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleModelPress(model)}
                    >
                      <Eye size={16} color="#FFFFFF" />
                      <Text style={styles.viewButtonText}>View 3D</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modelInfo}>
                  <Text style={styles.modelTitle}>{model.title}</Text>
                  <Text style={styles.modelDescription}>{model.description}</Text>

                  <View style={styles.modelFeatures}>
                    <View style={styles.featureTag}>
                      <Text style={styles.featureText}>Interactive</Text>
                    </View>
                    <View style={styles.featureTag}>
                      <Text style={styles.featureText}>3D</Text>
                    </View>
                    <View style={styles.featureTag}>
                      <Text style={styles.featureText}>Detailed</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {models.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No 3D models available for this category yet.</Text>
              <Text style={styles.emptySubtext}>More models coming soon!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 3D Model Viewer Modal */}
      <Modal
        visible={!!selectedModel}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedModel(null)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedModel(null)}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedModel?.title}</Text>
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={handleFullscreen}
            >
              <Maximize size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 3D Viewer */}
          <View style={styles.modalViewer}>
            {selectedModel && (
              <GLBViewer
                modelUrl={EducationService.get3DModelUrl(selectedModel.glb_file_url || '')}
                style={styles.fullViewer}
              />
            )}
          </View>

          {/* Model Info */}
          <View style={styles.modalInfo}>
            <Text style={styles.modalDescription}>
              {selectedModel?.description}
            </Text>
            <Text style={styles.instructionText}>
              Use the controls below to rotate, zoom, and explore the 3D model
            </Text>
          </View>
        </View>
      </Modal>

      {/* Fullscreen 3D Viewer */}
      <Modal
        visible={showFullscreen}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowFullscreen(false)}
      >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.fullscreenCloseButton}
            onPress={() => setShowFullscreen(false)}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>

          {selectedModel && (
            <GLBViewer
              modelUrl={EducationService.get3DModelUrl(selectedModel.glb_file_url || '')}
              style={styles.fullscreenViewer}
            />
          )}
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 120,
    paddingHorizontal: 30,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 12,
  },
  modelsSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  modelCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
    padding: 16,
  },
  modelPreviewContainer: {
    position: 'relative',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },
  modelPreview: {
    flex: 1,
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(31, 41, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modelInfo: {
    flex: 1,
  },
  modelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  modelDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  modelFeatures: {
    flexDirection: 'row',
    gap: 6,
  },
  featureTag: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featureText: {
    color: '#4A90E2',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  fullscreenButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  modalViewer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullViewer: {
    flex: 1,
  },
  modalInfo: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  modalDescription: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 16,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fullscreenViewer: {
    flex: 1,
  },
});