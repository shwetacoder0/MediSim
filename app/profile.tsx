import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Calendar, Crown, CreditCard as Edit3, LogOut, Trash2, Check, X } from 'lucide-react-native';

export default function ProfileScreen() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState('John Doe');
  const [tempName, setTempName] = useState(fullName);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => router.push('/')
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            router.push('/');
          }
        }
      ]
    );
  };

  const handleManageSubscription = () => {
    // This would open RevenueCat paywall/settings
    Alert.alert('Manage Subscription', 'This will open RevenueCat subscription management.');
  };

  const handleEditName = () => {
    setTempName(fullName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setFullName(tempName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(fullName);
    setIsEditingName(false);
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
          <View style={styles.avatarContainer}>
            <BlurView intensity={20} tint="dark" style={styles.avatarBlur}>
              <User size={60} color="#4FACFE" />
            </BlurView>
          </View>
          
          <View style={styles.nameContainer}>
            {isEditingName ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.editButton} onPress={handleSaveName}>
                    <Check size={20} color="#4ECDC4" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editButton} onPress={handleCancelEdit}>
                    <X size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameDisplay}>
                <Text style={styles.name}>{fullName}</Text>
                <TouchableOpacity style={styles.editNameButton} onPress={handleEditName}>
                  <Edit3 size={20} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoCard}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.infoItem}>
                  <Mail size={20} color="rgba(255, 255, 255, 0.6)" />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>john.doe@example.com</Text>
                    <Text style={styles.infoNote}>(Cannot be changed)</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.infoItem}>
                  <Crown size={20} color="#FFD700" />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Subscription Status</Text>
                    <Text style={[styles.infoValue, { color: '#4ECDC4' }]}>Active</Text>
                    <Text style={styles.infoNote}>Premium member since Jan 2024</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.infoItem}>
                  <Calendar size={20} color="rgba(255, 255, 255, 0.6)" />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Join Date</Text>
                    <Text style={styles.infoValue}>January 15, 2024</Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleManageSubscription}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <Crown size={24} color="#FFD700" />
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionText}>Manage Subscription</Text>
                    <Text style={styles.actionDescription}>
                      Update billing, cancel, or change plan
                    </Text>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleLogout}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <LogOut size={24} color="#FF9A9E" />
                  <View style={styles.actionTextContainer}>
                    <Text style={[styles.actionText, { color: '#FF9A9E' }]}>Sign Out</Text>
                    <Text style={styles.actionDescription}>
                      Sign out of your account
                    </Text>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleDeleteAccount}>
              <BlurView intensity={15} tint="dark" style={styles.cardBlur}>
                <View style={styles.actionItem}>
                  <Trash2 size={24} color="#FF6B6B" />
                  <View style={styles.actionTextContainer}>
                    <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete Account</Text>
                    <Text style={styles.actionDescription}>
                      Permanently delete your account and data
                    </Text>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editNameButton: {
    padding: 8,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameInput: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#4FACFE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 200,
    textAlign: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
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
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBlur: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
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
  actionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  actionText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
});