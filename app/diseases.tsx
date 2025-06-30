import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Heart, Brain, Settings as Lungs, Bone, Eye, Ear, Lock } from 'lucide-react-native';

const diseaseCategories = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    subtitle: 'Heart and cardiovascular diseases',
    icon: Heart,
    color: '#FF8A65',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    count: 1,
    isActive: true,
  },
  {
    id: 'neurology',
    title: 'Neurology',
    subtitle: 'Brain and nervous system disorders',
    icon: Brain,
    color: '#BA68C8',
    image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    count: 0,
    isActive: false,
  },
  {
    id: 'pulmonology',
    title: 'Pulmonology',
    subtitle: 'Lung and respiratory conditions',
    icon: Lungs,
    color: '#4DB6AC',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    count: 16,
    isActive: false,
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    subtitle: 'Bone and joint disorders',
    icon: Bone,
    color: '#FFB74D',
    image: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg',
    count: 22,
    isActive: false,
  },
  {
    id: 'ophthalmology',
    title: 'Ophthalmology',
    subtitle: 'Eye and vision disorders',
    icon: Eye,
    color: '#4A90E2',
    image: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg',
    count: 12,
    isActive: false,
  },
  {
    id: 'otolaryngology',
    title: 'ENT',
    subtitle: 'Ear, nose, and throat conditions',
    icon: Ear,
    color: '#6BCF7F',
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg',
    count: 14,
    isActive: false,
  },
];

export default function DiseasesScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleCategoryPress = (categoryId: string, isActive: boolean) => {
    if (!isActive) {
      return; // Do nothing for locked categories
    }
    router.push(`/disease-detail?category=${categoryId}` as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#6B7280" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Disease Encyclopedia</Text>
          <Text style={styles.subtitle}>
            Explore comprehensive information about various medical conditions
          </Text>
        </View>

        <View style={styles.categoriesSection}>
          {diseaseCategories.map((category) => (
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
                        {category.count}
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