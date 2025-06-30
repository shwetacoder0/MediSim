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
import { router } from 'expo-router';
import { ArrowRight, ExternalLink, Heart, Zap, Database, Globe, Mic } from 'lucide-react-native';

const sponsors = [
  {
    id: 'bolt',
    name: 'Bolt.new',
    description: 'AI-powered development platform that made building MediSim possible',
    image: require('../assets/images/white_circle_360x360.png'),
    url: 'https://bolt.new',
    color: '#4A90E2',
    type: 'image',
    icon: Zap,
  },
  {
    id: 'tavus',
    name: 'Tavus',
    description: 'AI video generation platform powering our AI doctor consultations',
    url: 'https://tavus.io',
    color: '#6BCF7F',
    type: 'icon',
    icon: Mic,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Advanced AI voice technology for natural doctor conversations',
    image: require('../assets/images/elevenlabs.png'),
    url: 'https://elevenlabs.io',
    color: '#FF8A65',
    type: 'image',
    icon: Mic,
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Backend-as-a-Service providing secure data storage and authentication',
    image: require('../assets/images/supa.png'),
    url: 'https://supabase.com',
    color: '#4CAF50',
    type: 'image',
    icon: Database,
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Web hosting and deployment platform for our landing page',
    url: 'https://netlify.com',
    color: '#00C7B7',
    type: 'icon',
    icon: Globe,
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
    if (sponsor.type === 'image' && sponsor.image) {
      return (
        <Image
          source={sponsor.image}
          style={styles.sponsorImage}
          resizeMode="contain"
        />
      );
    } else {
      // Use icon for sponsors without images or SVG sponsors
      const IconComponent = sponsor.icon;
      return (
        <IconComponent size={32} color={sponsor.color} />
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.heartContainer}>
            <Heart size={32} color="#FF8A65" fill="#FF8A65" />
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
              <View style={styles.cardContent}>
                <View style={styles.sponsorImageContainer}>
                  <View style={[
                    styles.imageWrapper,
                    { backgroundColor: `${sponsor.color}15` }
                  ]}>
                    {renderSponsorImage(sponsor)}
                  </View>
                </View>
                
                <View style={styles.sponsorInfo}>
                  <View style={styles.sponsorHeader}>
                    <Text style={styles.sponsorName}>{sponsor.name}</Text>
                    <ExternalLink size={16} color="#9CA3AF" />
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
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>Built for the Future of Healthcare</Text>
          <Text style={styles.footerText}>
            MediSim represents the convergence of AI, healthcare, and accessibility. 
            We're grateful to our technology partners who share our vision of making 
            medical information more understandable and accessible to everyone.
          </Text>
          
          <View style={styles.hackathonBadge}>
            <Text style={styles.hackathonText}>🏆 Built for Bolt.new Hackathon 2025</Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.continueSection}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueToAuth}>
            <View style={styles.continueButtonGradient}>
              <Text style={styles.continueButtonText}>Continue to App</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  sponsorsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sponsorCard: {
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
  sponsorImageContainer: {
    marginRight: 16,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.1)',
  },
  sponsorImage: {
    width: 36,
    height: 36,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sponsorDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  sponsorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  footerSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  hackathonBadge: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  hackathonText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  continueSection: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    alignItems: 'center',
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
});