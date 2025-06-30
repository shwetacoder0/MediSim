import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Heart, Brain, User, Lock, Activity } from 'lucide-react-native';
import { EducationService, EducationSection } from '../lib/educationService';

const modelCategories = [
  {
    id: 'nervous',
    title: 'Brain Models',
    subtitle: 'Brain, spinal cord, and nervous system',
    icon: Brain,
    color: '#BA68C8',
    image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    isActive: true,
  },
  {
    id: 'digestive',
    title: 'Intestine Models',
    subtitle: 'Digestive system and intestinal anatomy',
    icon: Activity,
    color: '#FFB74D',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    isActive: true,
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular System',
    subtitle: 'Heart, blood vessels, and circulation',
    icon: Heart,
    color: '#FF8A65',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    isActive: false,
  },
  {
    id: 'full-body',
    title: 'Full Body Models',
    subtitle: 'Complete anatomical systems',
    icon: User,
    color: '#4DB6AC',
    image: 'https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg',
    isActive: false,
  },
  {
    id: 'respiratory',
    title: 'Respiratory System',
    subtitle: 'Lungs, airways, and breathing',
    icon: Heart,
    color: '#6BCF7F',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    isActive: false,
  },
];

export default function ModelsScreen() {
  const [modelCounts, setModelCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModelCounts();
  }, []);

  const loadModelCounts = async () => {
    try {
      setLoading(true);
      const counts: Record<string, number> = {};

      // Set specific counts for active categories
      counts['nervous'] = 2; // Brain male and female
      counts['digestive'] = 1; // Intestine model

      // Random counts for locked categories
      counts['cardiovascular'] = 3;
      counts['full-body'] = 2;
      counts['respiratory'] = 4;

      setModelCounts(counts);
    } catch (error) {
      console.error('Error loading model counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCategoryPress = (categoryId: string, isActive: boolean) => {
    if (!isActive) {
      return; // Do nothing for locked categories
    }
    router.push(`/model-detail?category=${categoryId}` as any);
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
          <Text style={styles.title}>3D Body Models</Text>
          <Text style={styles.subtitle}>
            Explore interactive 3D models of human anatomy and physiology
          </Text>
        </View>

        <View style={styles.categoriesSection}>
          {modelCategories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[
                styles.categoryCard,
                !category.isActive && styles.lockedCard
              ]}
              onPress={() => handleCategoryPress(category.id, category.isActive)}
              disabled={!category.isActive}
            >
              <View style={styles.cardContent}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                  <View style={[
                    styles.imageOverlay,
                    !category.isActive && styles.lockedOverlay
                  ]}>
                    {category.isActive ? (
                      <category.icon size={24} color={category.color} />
                    ) : (
                      <Lock size={24} color="#9CA3AF" />
                    )}
                  </View>
                </View>
                
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeader}>
                    <Text style={[
                      styles.categoryTitle,
                      !category.isActive && styles.lockedText
                    ]}>
                      {category.title}
                    </Text>
                    <View style={[
                      styles.countBadge,
                      !category.isActive && styles.lockedBadge
                    ]}>
                      <Text style={[
                        styles.countText,
                        !category.isActive && styles.lockedCountText
                      ]}>
                        {modelCounts[category.id] || 0}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.categorySubtitle,
                    !category.isActive && styles.lockedText
                  ]}>
                    {category.subtitle}
                  </Text>
                  {!category.isActive && (
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  )}
                </View>
                
                {category.isActive ? (
                  <ChevronRight size={16} color="#9CA3AF" />
                ) : (
                  <Lock size={16} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  categoriesSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  categoryCard: {
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
  lockedCard: {
    opacity: 0.6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  categoryImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedOverlay: {
    backgroundColor: 'rgba(156, 163, 175, 0.8)',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  countBadge: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  lockedBadge: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  countText: {
    color: '#4A90E2',
    fontSize: 11,
    fontWeight: '600',
  },
  lockedCountText: {
    color: '#9CA3AF',
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#FFB74D',
    fontWeight: '600',
    marginTop: 2,
  },
});