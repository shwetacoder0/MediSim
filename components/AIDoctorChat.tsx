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
import { Phone, PhoneOff, User, Video, VideoOff, Mic, MicOff } from 'lucide-react-native';
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
  const [isMuted, setIsMuted] = useState(false);
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

      // For demo purposes, we'll simulate the Tavus connection
      // In production, this would call the actual Tavus API
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockSession: ConversationSession = {
        conversationId: 'demo-conversation-' + Date.now(),
        conversationUrl: 'https://tavus.io/conversations/demo', // This would be the real Tavus URL
        status: 'connected'
      };

      setSession(mockSession);
      setIsCallActive(true);
      setIsConnecting(false);

      // Show success message
      Alert.alert(
        'AI Doctor Connected',
        'You are now connected to the AI Medical Assistant. You can start speaking about your health concerns.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to connect to AI Doctor. Please try again.');
      setIsConnecting(false);
      Alert.alert('Connection Error', 'Failed to connect to AI Doctor. Please try again.');
    }
  };

  const endConversation = async () => {
    if (!session) return;

    try {
      // In production, this would call the Tavus API to end the conversation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSession(null);
      setIsCallActive(false);
      setIsMuted(false);
      
      Alert.alert(
        'Consultation Ended',
        'Your AI doctor consultation has ended. Thank you for using MediSim.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      console.error('Failed to end conversation:', error);
      // Still close the session even if API call fails
      setSession(null);
      setIsCallActive(false);
      onClose?.();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In production, this would control the microphone
  };

  if (!isCallActive && !isConnecting) {
    return (
      <View style={styles.startContainer}>
        <View style={styles.startContent}>
          <BlurView intensity={20} tint="dark" style={styles.startBlur}>
            <View style={styles.doctorInfo}>
              <View style={styles.avatarContainer}>
                <User size={60} color="#4FACFE" />
              </View>
              <Text style={styles.doctorTitle}>AI Medical Assistant</Text>
              <Text style={styles.doctorDescription}>
                Get instant medical guidance and answers to your health questions from our AI doctor. 
                The AI can help explain medical terms, discuss symptoms, and provide general health advice.
              </Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Video size={20} color="#4FACFE" />
                  <Text style={styles.featureText}>Video consultation</Text>
                </View>
                <View style={styles.featureItem}>
                  <Mic size={20} color="#4FACFE" />
                  <Text style={styles.featureText}>Voice interaction</Text>
                </View>
                <View style={styles.featureItem}>
                  <User size={20} color="#4FACFE" />
                  <Text style={styles.featureText}>Personalized advice</Text>
                </View>
              </View>

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
                  <>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.startButtonText}>Connecting...</Text>
                  </>
                ) : (
                  <>
                    <Video size={20} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>Start Consultation</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.disclaimerText}>
              This AI assistant provides general health information only and should not replace professional medical advice.
            </Text>
          </BlurView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.chatContainer}>
      {/* Video Container */}
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
                <Text style={styles.loadingText}>Loading AI Doctor...</Text>
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
          <View style={styles.demoVideoContainer}>
            <View style={styles.demoAvatar}>
              <User size={80} color="#4FACFE" />
            </View>
            <Text style={styles.demoText}>AI Doctor</Text>
            <Text style={styles.demoSubtext}>Connected and ready to help</Text>
            
            {/* Simulated speaking indicator */}
            <View style={styles.speakingIndicator}>
              <View style={[styles.waveBar, styles.waveBar1]} />
              <View style={[styles.waveBar, styles.waveBar2]} />
              <View style={[styles.waveBar, styles.waveBar3]} />
              <View style={[styles.waveBar, styles.waveBar4]} />
              <View style={[styles.waveBar, styles.waveBar5]} />
            </View>
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
            {session?.status === 'connecting' ? 'Connecting to AI Doctor...' :
             session?.status === 'connected' ? 'AI Doctor is listening' :
             'Consultation active'}
          </Text>
          
          <Text style={styles.instructionText}>
            Speak clearly about your health concerns. The AI doctor will respond with helpful information.
          </Text>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startContent: {
    width: '100%',
    maxWidth: 400,
  },
  startBlur: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  doctorInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  doctorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  doctorDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 12,
    fontWeight: '500',
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
    marginBottom: 20,
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
  disclaimerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
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
  demoVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
  },
  demoAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(79, 172, 254, 0.4)',
  },
  demoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  demoSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  waveBar: {
    width: 4,
    marginHorizontal: 2,
    backgroundColor: '#4FACFE',
    borderRadius: 2,
  },
  waveBar1: {
    height: 15,
  },
  waveBar2: {
    height: 25,
  },
  waveBar3: {
    height: 35,
  },
  waveBar4: {
    height: 25,
  },
  waveBar5: {
    height: 15,
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
    marginBottom: 16,
    gap: 20,
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
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
});