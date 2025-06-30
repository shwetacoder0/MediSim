import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const treatmentData = {
  medications: [
    {
      id: 1,
      title: 'How Blood Pressure Medications Work',
      description: 'Understanding ACE inhibitors and how they help reduce blood pressure by relaxing blood vessels.',
      youtubeId: 'dQw4w9WgXcQ', // Replace with actual medical video IDs
      duration: '4:32',
      category: 'Cardiovascular',
    },
    {
      id: 2,
      title: 'Statin Therapy Animation',
      description: 'See how statins work to lower cholesterol and prevent heart disease at the cellular level.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '3:45',
      category: 'Cholesterol Management',
    },
    {
      id: 3,
      title: 'Insulin Mechanism of Action',
      description: 'Animated explanation of how insulin regulates blood sugar levels in diabetes patients.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '5:12',
      category: 'Diabetes',
    },
    {
      id: 4,
      title: 'Antibiotic Resistance Prevention',
      description: 'Learn how antibiotics work and why proper usage is crucial to prevent resistance.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '6:20',
      category: 'Infectious Disease',
    },
    {
      id: 5,
      title: 'Pain Relief Medications',
      description: 'Understanding NSAIDs vs opioids and how different pain medications affect the body.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '4:55',
      category: 'Pain Management',
    },
  ],
  surgery: [
    {
      id: 1,
      title: 'Laparoscopic Surgery Technique',
      description: 'Step-by-step animation of minimally invasive laparoscopic procedures and their benefits.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '7:30',
      category: 'Minimally Invasive',
    },
    {
      id: 2,
      title: 'Heart Bypass Surgery Animation',
      description: 'Detailed 3D animation showing how coronary artery bypass surgery restores blood flow.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '8:45',
      category: 'Cardiac Surgery',
    },
    {
      id: 3,
      title: 'Knee Replacement Procedure',
      description: 'Complete animation of total knee replacement surgery from incision to recovery.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '6:15',
      category: 'Orthopedic',
    },
    {
      id: 4,
      title: 'Cataract Surgery Process',
      description: 'See how modern cataract surgery removes clouded lenses and restores vision.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '4:20',
      category: 'Ophthalmology',
    },
    {
      id: 5,
      title: 'Robotic Surgery Advantages',
      description: 'Learn about robotic-assisted surgery and its precision benefits for complex procedures.',
      youtubeId: 'dQw4w9WgXcQ',
      duration: '5:40',
      category: 'Advanced Technology',
    },
  ],
};

export default function TreatmentDetailScreen() {
  const { category } = useLocalSearchParams();
  const treatments = treatmentData[category as keyof typeof treatmentData] || [];

  const handleBack = () => {
    router.back();
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0`;
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      'Cardiovascular': '#FF6B6B',
      'Cholesterol Management': '#FFB347',
      'Diabetes': '#4ECDC4',
      'Infectious Disease': '#B19CD9',
      'Pain Management': '#FF9A9E',
      'Minimally Invasive': '#4FACFE',
      'Cardiac Surgery': '#FF6B6B',
      'Orthopedic': '#FFB347',
      'Ophthalmology': '#A8E6CF',
      'Advanced Technology': '#4ECDC4',
    };
    return colors[cat as keyof typeof colors] || '#4FACFE';
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
            {category === 'medications' ? 'Medications' : 'Surgical Procedures'}
          </Text>
          <Text style={styles.subtitle}>
            Watch detailed animations showing how these treatments work
          </Text>
        </View>

        <View style={styles.treatmentsSection}>
          {treatments.map((treatment) => (
            <View key={treatment.id} style={styles.treatmentCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  {/* YouTube Video Embed */}
                  <View style={styles.videoContainer}>
                    <WebView
                      source={{ uri: getYouTubeEmbedUrl(treatment.youtubeId) }}
                      style={styles.webView}
                      allowsInlineMediaPlayback={true}
                      mediaPlaybackRequiresUserAction={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      startInLoadingState={true}
                      renderLoading={() => (
                        <View style={styles.videoPlaceholder}>
                          <Play size={40} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.loadingText}>Loading video...</Text>
                        </View>
                      )}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{treatment.duration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.treatmentInfo}>
                    <View style={styles.treatmentHeader}>
                      <Text style={styles.treatmentTitle}>{treatment.title}</Text>
                      <View style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(treatment.category) + '20' }
                      ]}>
                        <Text style={[
                          styles.categoryText,
                          { color: getCategoryColor(treatment.category) }
                        ]}>
                          {treatment.category}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.treatmentDescription}>{treatment.description}</Text>
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
  videoContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  treatmentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  treatmentDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});