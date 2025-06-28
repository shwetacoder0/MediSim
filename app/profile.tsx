import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Calendar, Crown, CreditCard as Edit3, LogOut, Trash2, Check, X } from 'lucide-react-native';
import { useAuth, UserProfile } from '../lib/auth-context';
import { signOutUser, updateUserProfile } from '../lib/auth';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
  const { user, profile, isLoading, isAuthenticated, refreshUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState('');
  const [tempName, setTempName] = useState('');
  const [email, setEmail] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [isProUser, setIsProUser] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isLoading, isAuthenticated]);

  // Load user data
  useEffect(() => {
    if (user && profile) {
      const userProfile = profile as UserProfile;
      setFullName(userProfile.full_name || '');
      setTempName(userProfile.full_name || '');
      setEmail(user.email || '');

      // Format created_at date if available
      if (user.created_at) {
        const createdAt = new Date(user.created_at);
        setJoinDate(createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
      }

      // Check subscription status
      setIsProUser(userProfile.plan === 'pro' && userProfile.subscription_status === 'active');
      setSubscriptionStatus(userProfile.subscription_status || 'inactive');
    }
  }, [user, profile]);

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
          onPress: async () => {
            try {
              await signOutUser();
              router.push('/');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
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
          onPress: async () => {
            try {
              // Delete user data
              if (user) {
                await supabase.from('users').delete().eq('id', user.id);
                // Delete auth account
                const { error } = await supabase.auth.admin.deleteUser(user.id);
                if (error) throw error;

                Alert.alert('Account Deleted', 'Your account has been deleted.');
                router.push('/');
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleManageSubscription = () => {
    // This would open RevenueCat paywall/settings
    router.push('/paywall');
  };

  const handleEditName = () => {
    setTempName(fullName);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      if (user) {
        await updateUserProfile({ full_name: tempName });
        setFullName(tempName);
        setIsEditingName(false);
        // Refresh user data
        await refreshUser();
      }
    } catch (error) {
      console.error('Error updating name:', error);
      Alert.alert('Error', 'Failed to update name. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setTempName(fullName);
    setIsEditingName(false);
  };

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A2E', '#16213E']}
          style={styles.gradient}
        />
        <ActivityIndicator size="large" color="#4FACFE" />
      </View>
    );
  }

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

          <Text style={styles.email}>{email}</Text>
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
                    <Text style={styles.infoValue}>{email}</Text>
                    <Text style={styles.infoNote}>(Cannot be changed)</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoItem}>
                  <Crown size={20} color={isProUser ? "#FFD700" : "rgba(255, 255, 255, 0.6)"} />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Subscription Status</Text>
                    <Text style={[
                      styles.infoValue,
                      { color: isProUser ? '#4ECDC4' : '#FF9A9E' }
                    ]}>
                      {isProUser ? 'Active' : 'Inactive'}
                    </Text>
                    <Text style={styles.infoNote}>
                      {isProUser
                        ? 'Premium member'
                        : 'Free account - Upgrade for more features'}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoItem}>
                  <Calendar size={20} color="rgba(255, 255, 255, 0.6)" />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Join Date</Text>
                    <Text style={styles.infoValue}>{joinDate || 'Unknown'}</Text>
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
                  <Crown size={24} color={isProUser ? "#FFD700" : "rgba(255, 255, 255, 0.6)"} />
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionText}>Manage Subscription</Text>
                    <Text style={styles.actionDescription}>
                      {isProUser ? 'Update billing, cancel, or change plan' : 'Upgrade to Premium'}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
