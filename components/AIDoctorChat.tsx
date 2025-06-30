import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Video, ResizeMode } from 'expo-av';
import { Mic, MicOff, Phone, PhoneOff, User } from 'lucide-react-native';
import { TavusService, ConversationSession } from '../lib/tavusService';
import { TAVUS_CONFIG } from '../config/constants';

interface AIDoctorChatProps {
  onClose?: () => void;
}

export default function AIDoctorChat({ onClose }: AIDoctorChatProps) {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const videoRef = useRef<Video>(null);
  const tavusService = useRef(new TavusService(TAVUS_CONFIG));

  useEffect(() => {
    return () => {
      // Cleanup: end conversation when component unmounts
      if (session?.sessionId && isCallActive) {
        tavusService.current.endConversation(session.sessionId);
      }
    };
  }, [session, isCallActive]);

  const startConversation = async () => {
    try {
      setIsConnecting(true);
      
      // Request microphone permissions
      if (Platform.OS !== 'web') {
        // Handle native permissions here
      }

      const newSession = await tavusService.current.startConversation();
      setSession(newSession);
      setIsCallActive(true);
      
      // Poll for connection status
      pollConnectionStatus(newSession.sessionId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      Alert.alert('Error', 'Failed to connect to AI Doctor. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    if (!session) return;

    try {
      await tavusService.current.endConversation(session.sessionId);
      setSession(null);
      setIsCallActive(false);
      onClose?.();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const pollConnectionStatus = async (sessionId: string) => {
    try {
      const status = await tavusService.current.getConversationStatus(sessionId);
      setSession(status);

      if (status.status === 'connected') {
        // Connection established
        console.log('AI Doctor connected');
      } else if (status.status === 'error') {
        Alert.alert('Connection Error', 'Failed to connect to AI Doctor');
        setIsCallActive(false);
      } else if (status.status === 'connecting') {
        // Continue polling
        setTimeout(() => pollConnectionStatus(sessionId), 2000);
      }
    } catch (error) {
      console.error('Error polling status:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute functionality with Tavus API
  };

  if (!isCallActive && !isConnecting) {
    return (
      <View style={styles.startContainer}>
        <BlurView intensity={20} tint="dark" style={styles.startBlur}>
          <View style={styles.doctorInfo}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#4FACFE" />
            </View>
            <Text style={styles.doctorTitle}>AI Medical Assistant</Text>
            <Text style={styles.doctorDescription}>
              Available 24/7 to answer your health questions and provide medical guidance
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={startConversation}
            disabled={isConnecting}
          >
            <LinearGradient
              colors={['#4FACFE', '#00F2FE']}
              style={styles.startGradient}
            >
              {isConnecting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start Consultation</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={styles.chatContainer}>
      {/* Video Container */}
      <View style={styles.videoContainer}>
        {session?.videoUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: session.videoUrl }}
            rate={1.0}
            volume={1.0}
            isMuted={isMuted}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isCallActive}
            style={styles.video}
          />
        ) : (
          <View style={styles.loadingVideo}>
            <ActivityIndicator size="large" color="#4FACFE" />
            <Text style={styles.loadingText}>Connecting to AI Doctor...</Text>
          </View>
        )}
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.mutedButton]}
              onPress={toggleMute}
            >
              {isMuted ? (
                <MicOff size={24} color="#FFFFFF" />
              ) : (
                <Mic size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endCallButton}
              onPress={endConversation}
            >
              <PhoneOff size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.statusText}>
            {session?.status === 'connecting' ? 'Connecting...' : 
             session?.status === 'connected' ? 'AI Doctor is listening' : 
             'Disconnected'}
          </Text>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  startBlur: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  doctorInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  doctorDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  loadingVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  controlsBlur: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 12,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
});