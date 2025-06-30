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
import { WebView } from 'react-native-webview';
import { Phone, PhoneOff, User, Video, VideoOff } from 'lucide-react-native';
import { TavusService, ConversationSession } from '../lib/tavusService';
import { TAVUS_CONFIG } from '../config/constants';

interface AIDoctorChatProps {
  onClose?: () => void;
  patientContext?: string;
}

export default function AIDoctorChat({ onClose, patientContext }: AIDoctorChatProps) {
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const tavusService = useRef(new TavusService(TAVUS_CONFIG));

  useEffect(() => {
    return () => {
      // Cleanup: end conversation when component unmounts
      if (session?.conversationId && isCallActive) {
        tavusService.current.endConversation(session.conversationId);
      }
    };
  }, [session, isCallActive]);

  const startConversation = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const newSession = await tavusService.current.startConversation(patientContext);
      setSession(newSession);
      setIsCallActive(true);

      // Poll for connection status
      pollConnectionStatus(newSession.conversationId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to connect to AI Doctor. Please try again.');
      Alert.alert('Connection Error', 'Failed to connect to AI Doctor. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    if (!session) return;

    try {
      await tavusService.current.endConversation(session.conversationId);
      setSession(null);
      setIsCallActive(false);
      onClose?.();
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const pollConnectionStatus = async (conversationId: string) => {
    try {
      const status = await tavusService.current.getConversationStatus(conversationId);
      setSession(status);

      if (status.status === 'connected') {
        console.log('AI Doctor connected');
      } else if (status.status === 'error') {
        setError('Connection failed');
        setIsCallActive(false);
      } else if (status.status === 'connecting') {
        // Continue polling
        setTimeout(() => pollConnectionStatus(conversationId), 2000);
      }
    } catch (error) {
      console.error('Error polling status:', error);
      setError('Connection error');
    }
  };

  if (!isCallActive && !isConnecting) {
    return (
      <View style={styles.startContainer}>
        <BlurView intensity={20} tint="dark" style={styles.startBlur}>
          <View style={styles.doctorInfo}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#4FACFE" />
            </View>
            <Text style={styles.doctorTitle}>24/7 AI Medical Assistant</Text>
            <Text style={styles.doctorDescription}>
              Get instant medical guidance and answers to your health questions from our AI doctor
            </Text>
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
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
                  <Video size={20} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start Video Consultation</Text>
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
      {/* WebView Container for Tavus Conversation */}
      <View style={styles.videoContainer}>
        {session?.conversationUrl ? (
          <WebView
            ref={webViewRef}
            source={{ uri: session.conversationUrl }}
            style={styles.webView}
            mediaPlaybackRequiresUserAction={Platform.OS === 'ios' ? false : undefined}
            allowsInlineMediaPlayback={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingVideo}>
                <ActivityIndicator size="large" color="#4FACFE" />
                <Text style={styles.loadingText}>Connecting to AI Doctor...</Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
              setError('Failed to load video consultation');
            }}
            onLoadEnd={() => {
              console.log('WebView loaded successfully');
            }}
          />
        ) : (
          <View style={styles.loadingVideo}>
            <ActivityIndicator size="large" color="#4FACFE" />
            <Text style={styles.loadingText}>Preparing consultation...</Text>
          </View>
        )}
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <BlurView intensity={30} tint="dark" style={styles.controlsBlur}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.endCallButton}
              onPress={endConversation}
            >
              <PhoneOff size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.statusText}>
            {session?.status === 'connecting' ? 'Connecting to AI Doctor...' :
             session?.status === 'connected' ? 'AI Doctor is ready to help' :
             'Consultation ended'}
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
    textAlign: 'center',
  },
  doctorDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 12,
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
  webView: {
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
    marginBottom: 12,
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
