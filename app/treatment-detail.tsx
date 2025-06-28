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
import { ArrowLeft, Clock, DollarSign, Activity } from 'lucide-react-native';

const treatmentData = {
  medications: [
    {
      id: 1,
      title: 'ACE Inhibitors',
      type: 'Cardiovascular',
      duration: '6-12 months',
      description: 'Medications that help relax blood vessels and reduce blood pressure.',
      image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
    },
    {
      id: 2,
      title: 'Statins',
      type: 'Cholesterol',
      duration: 'Long-term',
      description: 'Drugs that lower cholesterol levels in the blood.',
      image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
    },
  ],
  surgery: [
    {
      id: 1,
      title: 'Laparoscopic Surgery',
      type: 'Minimally Invasive',
      duration: '2-4 hours',
      description: 'Surgical technique using small incisions and specialized instruments.',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    },
    {
      id: 2,
      title: 'Cardiac Bypass',
      type: 'Open Surgery',
      duration: '4-6 hours',
      description: 'Surgery to create new routes around blocked coronary arteries.',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    },
  ],
};

export default function TreatmentDetailScreen() {
  const { category } = useLocalSearchParams();
  const treatments = treatmentData[category as keyof typeof treatmentData] || [];

  const handleBack = () => {
    router.back();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cardiovascular': return '#FF6B6B';
      case 'Cholesterol': return '#FFB347';
      case 'Minimally Invasive': return '#4ECDC4';
      case 'Open Surgery': return '#B19CD9';
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
            {category === 'medications' ? 'Medications' : 
             category === 'surgery' ? 'Surgical Procedures' : 
             'Treatments'}
          </Text>
          <Text style={styles.subtitle}>
            Comprehensive treatment options and procedures
          </Text>
        </View>

        <View style={styles.treatmentsSection}>
          {treatments.map((treatment) => (
            <View key={treatment.id} style={styles.treatmentCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: treatment.image }} style={styles.treatmentImage} />
                    <View style={styles.placeholderOverlay}>
                      <Text style={styles.placeholderText}>Treatment Image</Text>
                    </View>
                  </View>
                  
                  <View style={styles.treatmentInfo}>
                    <View style={styles.treatmentHeader}>
                      <Text style={styles.treatmentTitle}>{treatment.title}</Text>
                      <View style={[styles.typeBadge, { backgroundColor: getTypeColor(treatment.type) + '20' }]}>
                        <Text style={[styles.typeText, { color: getTypeColor(treatment.type) }]}>
                          {treatment.type}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.treatmentDescription}>{treatment.description}</Text>
                    
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Clock size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Text style={styles.statText}>{treatment.duration}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Activity size={16} color="rgba(255, 255, 255, 0.6)" />
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
  treatmentsSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  treatmentCard: {
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
  treatmentImage: {
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
  treatmentInfo: {
    flex: 1,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  treatmentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  treatmentDescription: {
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