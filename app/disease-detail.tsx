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
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Users, TrendingUp } from 'lucide-react-native';

const diseaseData = {
  cardiology: [
    {
      id: 1,
      title: 'Coronary Artery Disease',
      severity: 'High',
      prevalence: '6.2M adults',
      description: 'Narrowing of coronary arteries that supply blood to the heart muscle.',
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    },
    {
      id: 2,
      title: 'Heart Failure',
      severity: 'High',
      prevalence: '6.5M adults',
      description: 'Condition where the heart cannot pump blood effectively.',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    },
    {
      id: 3,
      title: 'Atrial Fibrillation',
      severity: 'Medium',
      prevalence: '2.7M adults',
      description: 'Irregular and often rapid heart rhythm disorder.',
      image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    },
  ],
  neurology: [
    {
      id: 1,
      title: 'Alzheimer\'s Disease',
      severity: 'High',
      prevalence: '6.5M adults',
      description: 'Progressive brain disorder that affects memory and cognitive function.',
      image: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    },
    {
      id: 2,
      title: 'Parkinson\'s Disease',
      severity: 'High',
      prevalence: '1M adults',
      description: 'Progressive nervous system disorder affecting movement.',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    },
  ],
};

export default function DiseaseDetailScreen() {
  const { category } = useLocalSearchParams();
  const diseases = diseaseData[category as keyof typeof diseaseData] || [];

  const handleBack = () => {
    router.back();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#FF6B6B';
      case 'Medium': return '#FFB347';
      case 'Low': return '#4ECDC4';
      default: return '#4FACFE';
    }
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
          <Text style={styles.title}>
            {category === 'cardiology' ? 'Cardiology' : 
             category === 'neurology' ? 'Neurology' : 
             'Diseases'}
          </Text>
          <Text style={styles.subtitle}>
            Detailed information about conditions and disorders
          </Text>
        </View>

        <View style={styles.diseasesSection}>
          {diseases.map((disease) => (
            <View key={disease.id} style={styles.diseaseCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: disease.image }} style={styles.diseaseImage} />
                    <View style={styles.placeholderOverlay}>
                      <Text style={styles.placeholderText}>Medical Image</Text>
                    </View>
                  </View>
                  
                  <View style={styles.diseaseInfo}>
                    <View style={styles.diseaseHeader}>
                      <Text style={styles.diseaseTitle}>{disease.title}</Text>
                      <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(disease.severity) + '20' }]}>
                        <Text style={[styles.severityText, { color: getSeverityColor(disease.severity) }]}>
                          {disease.severity}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.diseaseDescription}>{disease.description}</Text>
                    
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Users size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.statText}>{disease.prevalence}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <TrendingUp size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.statText}>Learn More</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </BlurView>
            </View>
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
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  diseasesSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  diseaseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  diseaseImage: {
    width: '100%',
    height: '100%',
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});