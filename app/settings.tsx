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
import { router } from 'expo-router';
import { ArrowLeft, Bell, Shield, Globe, Moon, Volume2, FileText, Trash2, Brain, Mic, HelpCircle, MessageCircle, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#6B7280" />
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
              <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelection}>
                <View style={styles.settingLeft}>
                  <Globe size={20} color="#4A90E2" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Language</Text>
                    <Text style={styles.settingDescription}>English (US)</Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Bell size={20} color="#4A90E2" />
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
                  trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                  thumbColor={notifications ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Moon size={20} color="#4A90E2" />
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
                  trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                  thumbColor={darkMode ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Volume2 size={20} color="#4A90E2" />
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
                  trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                  thumbColor={soundEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          </View>

          {/* Data & AI Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & AI Settings</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleViewReports}>
              <View style={styles.actionItem}>
                <FileText size={20} color="#4A90E2" />
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>View Uploaded Reports</Text>
                  <Text style={styles.actionDescription}>
                    Manage your report history and delete files
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleClearAIData}>
              <View style={styles.actionItem}>
                <Trash2 size={20} color="#FF8A65" />
                <View style={styles.actionText}>
                  <Text style={[styles.actionLabel, { color: '#FF8A65' }]}>
                    Clear AI Explanations & Images
                  </Text>
                  <Text style={styles.actionDescription}>
                    Delete all AI-generated content per report
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* AI Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Preferences</Text>
            
            <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Mic size={20} color="#4A90E2" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>AI Doctor Voice</Text>
                    <Text style={styles.settingDescription}>Professional Male Voice</Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Brain size={20} color="#4A90E2" />
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
                  trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
                  thumbColor={autoPlayTTS ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleFAQ}>
              <View style={styles.actionItem}>
                <HelpCircle size={20} color="#4A90E2" />
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>FAQ / Help</Text>
                  <Text style={styles.actionDescription}>
                    Find answers to common questions
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleContactSupport}>
              <View style={styles.actionItem}>
                <MessageCircle size={20} color="#4A90E2" />
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>Contact / Feedback</Text>
                  <Text style={styles.actionDescription}>
                    Get help or share your feedback
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handlePrivacyPolicy}>
              <View style={styles.actionItem}>
                <Shield size={20} color="#4A90E2" />
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>Privacy Policy</Text>
                  <Text style={styles.actionDescription}>
                    Learn how we protect your data
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleTermsOfService}>
              <View style={styles.actionItem}>
                <Globe size={20} color="#4A90E2" />
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>Terms of Service</Text>
                  <Text style={styles.actionDescription}>
                    Read our terms and conditions
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
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
  content: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    marginHorizontal: 16,
  },
  actionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    marginLeft: 12,
    flex: 1,
  },
  actionLabel: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 114, 128, 0.1)',
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});