import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowRight, ExternalLink, Heart } from 'lucide-react-native';

const sponsors = [
  {
    id: 'bolt',
    name: 'Bolt.new',
    description: 'AI-powered development platform that made building MediSim possible',
    image: require('../assets/images/white_circle_360x360.png'),
    url: 'https://bolt.new',
    color: '#4FACFE',
    type: 'image',
  },
  {
    id: 'tavus',
    name: 'Tavus',
    description: 'AI video generation platform powering our AI doctor consultations',
    image: require('../assets/images/tavus.svg'),
    url: 'https://tavus.io',
    color: '#FF6B6B',
    type: 'svg',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Advanced AI voice technology for natural doctor conversations',
    image: require('../assets/images/elevenlabs.png'),
    url: 'https://elevenlabs.io',
    color: '#4ECDC4',
    type: 'image',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Backend-as-a-Service providing secure data storage and authentication',
    image: require('../assets/images/supa.png'),
    url: 'https://supabase.com',
    color: '#3ECF8E',
    type: 'image',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Web hosting and deployment platform for our landing page',
    image: require('../assets/images/netlify.svg'),
    url: 'https://netlify.com',
    color: '#00C7B7',
    type: 'svg',
  },
];

export default function SponsorsScreen() {
  const handleContinueToAuth = () => {
    router.push('/auth');
  };

  const handleSponsorPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const renderSponsorImage = (sponsor: any) => {
    return (
      <Image
        source={sponsor.image}
        style={styles.sponsorImage}
        resizeMode="contain"
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.heartContainer}>
            <Heart size={40} color="#FF6B6B" fill="#FF6B6B" />
          </View>
          <Text style={styles.title}>Thank You to Our Sponsors</Text>
          <Text style={styles.subtitle}>
            MediSim was made possible by these incredible technology partners who believe in democratizing healthcare through AI
          </Text>
        </View>

        <View style={styles.sponsorsSection}>
          {sponsors.map((sponsor, index) => (
            <TouchableOpacity
              key={sponsor.id}
              style={styles.sponsorCard}
              onPress={() => handleSponsorPress(sponsor.url)}
              activeOpacity={0.8}
            >
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  <View style={styles.sponsorImageContainer}>
                    <View style={[
                      styles.imageWrapper,
                      { backgroundColor: `${sponsor.color}20` }
                    ]}>
                      {renderSponsorImage(sponsor)}
                    </View>
                  </View>
                  
                  <View style={styles.sponsorInfo}>
                    <View style={styles.sponsorHeader}>
                      <Text style={styles.sponsorName}>{sponsor.name}</Text>
                      <ExternalLink size={20} color="rgba(255, 255, 255, 0.6)" />
                    </View>
                    <Text style={styles.sponsorDescription}>
                      {sponsor.description}
                    </Text>
                    
                    <View style={styles.sponsorBadge}>
                      <View style={[
                        styles.badgeIndicator,
                        { backgroundColor: sponsor.color }
                      ]} />
                      <Text style={styles.badgeText}>Technology Partner</Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerSection}>
          <BlurView intensity={15} tint="dark" style={styles.footerBlur}>
            <Text style={styles.footerTitle}>Built for the Future of Healthcare</Text>
            <Text style={styles.footerText}>
              MediSim represents the convergence of AI, healthcare, and accessibility. 
              We're grateful to our technology partners who share our vision of making 
              medical information more understandable and accessible to everyone.
            </Text>
            
            <View style={styles.hackathonBadge}>
              <Text style={styles.hackathonText}>🏆 Built for Bolt.new Hackathon 2025</Text>
            </View>
          </BlurView>
        </View>

        {/* Continue Button */}
        <View style={styles.continueSection}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueToAuth}>
            <BlurView intensity={30} tint="light" style={styles.continueButtonBlur}>
              <LinearGradient
                colors={['#4FACFE', '#00F2FE']}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue to App</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  heartContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  sponsorsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sponsorCard: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  sponsorImageContainer: {
    marginRight: 20,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sponsorImage: {
    width: 50,
    height: 50,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sponsorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sponsorDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  sponsorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  footerSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  footerBlur: {
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  hackathonBadge: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  hackathonText: {
    fontSize: 16,
    color: '#4FACFE',
    fontWeight: '600',
  },
  continueSection: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    alignItems: 'center',
  },
  continueButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  continueButtonBlur: {
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});