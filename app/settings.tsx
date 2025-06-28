import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Shield, Globe, Moon, Volume2, FileText, Trash2, Brain, Mic, CircleHelp as HelpCircle, MessageCircle, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlayTTS, setAutoPlayTTS] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleViewReports = () => {
    Alert.alert('Report History', 'This will show your uploaded medical reports with delete options.');
  };

  const handleClearAIData = () => {
    Alert.alert(
      'Clear AI Data',
      'This will delete all AI-generated explanations and images. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'AI data has been cleared.')
        }
      ]
    );
  };

  const handleLanguageSelection = () => {
    Alert.alert('Language', 'Language selection will be implemented with Lingo integration.');
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'This will open the FAQ section.');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'This will open the contact/feedback form.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'This will open the privacy policy.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'This will open the terms of service.');
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
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Customize your MediSim experience and manage your data
          </Text>
        </View>

        <View style={styles.content}>
          {/* General Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Settings</Text>
            
            <View style={styles.settingsCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelection}>
                  <View style={styles.settingLeft}>
                    <Globe size={24} color="#4FACFE" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Language</Text>
                      <Text style={styles.settingDescription}>English (US)</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
                
                <View style={styles.divider} />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Bell size={24} color="#4FACFE" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Notifications</Text>
                      <Text style={styles.settingDescription}>
                        Receive updates about your health reports
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: '#767577', true: '#4FACFE' }}
                    thumbColor={notifications ? '#FFFFFF' : '#f4f3f4'}
                  />
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Moon size={24} color="#4FACFE" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Dark Mode</Text>
                      <Text style={styles.settingDescription}>
                        Use dark theme for better viewing
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: '#767577', true: '#4FACFE' }}
                    thumbColor={darkMode ? '#FFFFFF' : '#f4f3f4'}
                  />
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Volume2 size={24} color="#4FACFE" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Sound Effects</Text>
                      <Text style={styles.settingDescription}>
                        Enable audio feedback and sounds
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    trackColor={{ false: '#767577', true: '#4FACFE' }}
                    thumbColor={soundEnabled ? '#FFFFFF' : '#f4f3f4'}
                  />
                </View>
              </BlurView>
            </View>
          </View>

          {/* Data & AI Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & AI Settings</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleViewReports}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <FileText size={24} color="#4FACFE" />
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>View Uploaded Reports</Text>
                    <Text style={styles.actionDescription}>
                      Manage your report history and delete files
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleClearAIData}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <Trash2 size={24} color="#FF9A9E" />
                  <View style={styles.actionText}>
                    <Text style={[styles.actionLabel, { color: '#FF9A9E' }]}>
                      Clear AI Explanations & Images
                    </Text>
                    <Text style={styles.actionDescription}>
                      Delete all AI-generated content per report
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* AI Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Preferences</Text>
            
            <View style={styles.settingsCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Mic size={24} color="#4FACFE" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>AI Doctor Voice</Text>
                      <Text style={styles.settingDescription}>Professional Male Voice</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
                
                <View style={styles.divider} />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Brain size={24} color="#4FACFE" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Auto-play TTS</Text>
                      <Text style={styles.settingDescription}>
                        Automatically play voice explanations
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={autoPlayTTS}
                    onValueChange={setAutoPlayTTS}
                    trackColor={{ false: '#767577', true: '#4FACFE' }}
                    thumbColor={autoPlayTTS ? '#FFFFFF' : '#f4f3f4'}
                  />
                </View>
              </BlurView>
            </View>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleFAQ}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <HelpCircle size={24} color="#4FACFE" />
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>FAQ / Help</Text>
                    <Text style={styles.actionDescription}>
                      Find answers to common questions
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleContactSupport}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <MessageCircle size={24} color="#4FACFE" />
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>Contact / Feedback</Text>
                    <Text style={styles.actionDescription}>
                      Get help or share your feedback
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handlePrivacyPolicy}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <Shield size={24} color="#4FACFE" />
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>Privacy Policy</Text>
                    <Text style={styles.actionDescription}>
                      Learn how we protect your data
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleTermsOfService}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <Globe size={24} color="#4FACFE" />
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>Terms of Service</Text>
                    <Text style={styles.actionDescription}>
                      Read our terms and conditions
                    </Text>
                  </View>
                  <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>MediSim v1.0.0</Text>
            <Text style={styles.versionSubtext}>Built with ❤️ for your health</Text>
          </View>
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
  content: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  versionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});