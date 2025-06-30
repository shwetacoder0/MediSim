import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Heart, Brain, Settings as Lungs, Bone, Eye, Ear, Lock } from 'lucide-react-native';

const diseaseCategories = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    subtitle: 'Heart and cardiovascular diseases',
    icon: Heart,
    color: '#FF6B6B',
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    count: 1, // Updated count - only diabetes video
    isActive: true,
  },
  {
    id: 'neurology',
    title: 'Neurology',
    subtitle: 'Brain and nervous system disorders',
    icon: Brain,
    color: '#A8E6CF',
    image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    count: 0, // No neurology videos yet
    isActive: false,
  },
  {
    id: 'pulmonology',
    title: 'Pulmonology',
    subtitle: 'Lung and respiratory conditions',
    icon: Lungs,
    color: '#4ECDC4',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    count: 16,
    isActive: false,
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    subtitle: 'Bone and joint disorders',
    icon: Bone,
    color: '#FFB347',
    image: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg',
    count: 22,
    isActive: false,
  },
  {
    id: 'ophthalmology',
    title: 'Ophthalmology',
    subtitle: 'Eye and vision disorders',
    icon: Eye,
    color: '#B19CD9',
    image: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg',
    count: 12,
    isActive: false,
  },
  {
    id: 'otolaryngology',
    title: 'ENT',
    subtitle: 'Ear, nose, and throat conditions',
    icon: Ear,
    color: '#FF9A9E',
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
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color="#FFFFFF" />
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
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: category.image }} style={styles.categoryImage} />
                    <View style={[
                      styles.imageOverlay,
                      !category.isActive && styles.lockedOverlay
                    ]}>
                      {category.isActive ? (
                        <category.icon size={32} color={category.color} />
                      ) : (
                        <Lock size={32} color="rgba(255, 255, 255, 0.5)" />
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
                    <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                  ) : (
                    <Lock size={20} color="rgba(255, 255, 255, 0.3)" />
                  )}
                </View>
              </BlurView>
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
    backgroundColor: '#000',
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
  categoriesSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  categoryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedCard: {
    opacity: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardBlur: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  countBadge: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  countText: {
    color: '#4FACFE',
    fontSize: 12,
    fontWeight: '600',
  },
  lockedCountText: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  categorySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#FFB347',
    fontWeight: '600',
    marginTop: 4,
  },
});