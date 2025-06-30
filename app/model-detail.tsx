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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
      
      // Get sample models for the category
      const sampleModels = getSampleModelsForCategory(category as string);
      setModels(sampleModels);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSampleModelsForCategory = (cat: string): EducationSection[] => {
    const baseModels: Record<string, EducationSection[]> = {
      nervous: [
        {
          id: '1',
          section_type: '3d-models',
          internal_section: 'nervous',
          title: 'Human Brain - Male',
          description: 'Detailed 3D brain model showing cerebral cortex, cerebellum, and brain stem. Perfect for studying neuroanatomy and understanding brain structure.',
          content_type: '3d',
          glb_file_url: 'brain_male.glb',
          image_url: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'
        },
        {
          id: '2',
          section_type: '3d-models',
          internal_section: 'nervous',
          title: 'Human Brain - Female',
          description: 'Detailed 3D brain model showing cerebral cortex, cerebellum, and brain stem with female anatomical variations for comprehensive study.',
          content_type: '3d',
          glb_file_url: 'brain_female.glb',
          image_url: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'
        }
      ],
      digestive: [
        {
          id: '3',
          section_type: '3d-models',
          internal_section: 'digestive',
          title: 'Human Intestine System',
          description: 'Complete 3D model of the human digestive tract including small and large intestines, showing detailed internal structure and anatomy.',
          content_type: '3d',
          glb_file_url: 'intestine_system.glb',
          image_url: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg'
        }
      ]
    };

    return baseModels[cat] || [];
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
        <LinearGradient
          colors={['#0A0A0A', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        />
        <ActivityIndicator size="large" color="#4FACFE" />
        <Text style={styles.loadingText}>Loading 3D models...</Text>
      </View>
    );
  }

  const displayModels = models;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{getCategoryTitle()}</Text>
          <Text style={styles.subtitle}>
            Interactive 3D models for detailed anatomical study
          </Text>
        </View>

        <View style={styles.modelsSection}>
          {displayModels.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={styles.modelCard}
              onPress={() => handleModelPress(model)}
            >
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
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
                        <Eye size={20} color="#FFFFFF" />
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
              </BlurView>
            </TouchableOpacity>
          ))}
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
          <LinearGradient
            colors={['#0A0A0A', '#1A1A2E', '#16213E']}
            style={styles.gradient}
          />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedModel(null)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedModel?.title}</Text>
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={handleFullscreen}
            >
              <Maximize size={24} color="#FFFFFF" />
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
            <BlurView intensity={20} tint="dark" style={styles.infoBlur}>
              <Text style={styles.modalDescription}>
                {selectedModel?.description}
              </Text>
              <Text style={styles.instructionText}>
                Use the controls below to rotate, zoom, and explore the 3D model
              </Text>
            </BlurView>
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
            <X size={28} color="#FFFFFF" />
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
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 120,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  modelsSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  modelCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'column',
  },
  modelPreviewContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modelInfo: {
    flex: 1,
  },
  modelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modelDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  modelFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    color: '#4FACFE',
    fontSize: 12,
    fontWeight: '600',
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  fullscreenButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullViewer: {
    flex: 1,
  },
  modalInfo: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoBlur: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenViewer: {
    flex: 1,
  },
});