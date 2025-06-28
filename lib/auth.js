import { supabase } from './supabase';
import { SUBSCRIPTION_PLANS } from '../config/constants';

/**
 * Sign up a new user with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @param {string} fullName User's full name (optional)
 * @returns {Promise} Authentication data
 */
export async function signUpUser(email, password, fullName = '') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    // After successful signup, create a record in the users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          plan: SUBSCRIPTION_PLANS.FREE,
          subscription_status: 'inactive'
        });

      if (profileError) throw profileError;
    }

    return data;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
}

/**
 * Sign in a user with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise} Authentication data
 */
export async function signInUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns {Promise} Void
 */
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
}

/**
 * Get the current authenticated user
 * @returns {Promise} User object or null
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }
}

/**
 * Get the current user's profile data
 * @returns {Promise} User profile data
 */
export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    throw error;
  }
}

/**
 * Update the current user's profile
 * @param {Object} updates Fields to update
 * @returns {Promise} Updated user profile
 */
export async function updateUserProfile(updates) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
}

/**
 * Reset password for a user
 * @param {string} email User email
 * @returns {Promise} Void
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch (error) {
    console.error('Error resetting password:', error.message);
    throw error;
  }
}

/**
 * Update user password
 * @param {string} newPassword New password
 * @returns {Promise} User data
 */
export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating password:', error.message);
    throw error;
  }
}

/**
 * Check if user has pro subscription
 * @returns {Promise<boolean>} True if user has pro subscription
 */
export async function isProUser() {
  try {
    const profile = await getUserProfile();
    return profile.plan === SUBSCRIPTION_PLANS.PRO && profile.subscription_status === 'active';
  } catch (error) {
    console.error('Error checking pro status:', error.message);
    return false;
  }
}
