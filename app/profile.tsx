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
import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Calendar, Crown, Edit3, LogOut, Trash2, Check, X } from 'lucide-react-native';
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
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#6B7280" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#4A90E2" />
          </View>

          <View style={styles.nameContainer}>
            {isEditingName ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.editButton} onPress={handleSaveName}>
                    <Check size={16} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editButton} onPress={handleCancelEdit}>
                    <X size={16} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameDisplay}>
                <Text style={styles.name}>{fullName}</Text>
                <TouchableOpacity style={styles.editNameButton} onPress={handleEditName}>
                  <Edit3 size={16} color="#9CA3AF" />
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
              <View style={styles.infoItem}>
                <Mail size={18} color="#9CA3AF" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                  <Text style={styles.infoNote}>(Cannot be changed)</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <Crown size={18} color={isProUser ? "#FFD700" : "#9CA3AF"} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Subscription Status</Text>
                  <Text style={[
                    styles.infoValue,
                    { color: isProUser ? '#4CAF50' : '#FF8A65' }
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
                <Calendar size={18} color="#9CA3AF" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Join Date</Text>
                  <Text style={styles.infoValue}>{joinDate || 'Unknown'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>

            <TouchableOpacity style={styles.actionCard} onPress={handleManageSubscription}>
              <View style={styles.actionItem}>
                <Crown size={20} color={isProUser ? "#FFD700" : "#9CA3AF"} />
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionText}>Manage Subscription</Text>
                  <Text style={styles.actionDescription}>
                    {isProUser ? 'Update billing, cancel, or change plan' : 'Upgrade to Premium'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleLogout}>
              <View style={styles.actionItem}>
                <LogOut size={20} color="#FF8A65" />
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionText, { color: '#FF8A65' }]}>Sign Out</Text>
                  <Text style={styles.actionDescription}>
                    Sign out of your account
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleDeleteAccount}>
              <View style={styles.actionItem}>
                <Trash2 size={20} color="#FF6B6B" />
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete Account</Text>
                  <Text style={styles.actionDescription}>
                    Permanently delete your account and data
                  </Text>
                </View>
              </View>
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
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 30,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  editNameButton: {
    padding: 6,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 180,
    textAlign: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editButton: {
    padding: 6,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
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
  infoCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 1,
  },
  infoNote: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    marginVertical: 12,
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
  actionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});