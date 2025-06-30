'use dom';
import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';
import { View, Pressable, StyleSheet, Text, Platform } from 'react-native';
import tools from '../lib/elevenlabsTools';

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.log(error);
    console.error('Microphone permission denied');
    return false;
  }
}

export default function ConversationalAI({
  reportId,
  onStatusChange,
}: {
  dom?: import('expo/dom').DOMProps;
  reportId: string | null;
  onStatusChange?: (status: string) => void;
}) {
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      onStatusChange && onStatusChange('connected');
    },
    onDisconnect: () => {
      console.log('Disconnected');
      onStatusChange && onStatusChange('disconnected');
    },
    onMessage: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error('Error:', error);
      onStatusChange && onStatusChange('error');
    },
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert('Microphone permission denied. Please enable microphone access to use the AI Doctor feature.');
        return;
      }

      // Start the conversation with the agent
      await conversation.startSession({
        agentId: 'agent_01jyytb1z9fjmrrf87m6pn6vmh', // Replace with your ElevenLabs agent ID
        dynamicVariables: {
          reportId: reportId || '',
          platform: Platform.OS,
        },
        clientTools: {
          getReportData: async () => {
            const result = await tools.getReportData(reportId);
            return JSON.stringify(result);
          },
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      onStatusChange && onStatusChange('error');
    }
  }, [conversation, reportId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <Pressable
      style={[styles.callButton, conversation.status === 'connected' && styles.callButtonActive]}
      onPress={conversation.status === 'disconnected' ? startConversation : stopConversation}
    >
      <View
        style={[
          styles.buttonInner,
          conversation.status === 'connected' && styles.buttonInnerActive,
        ]}
      >
        <Text style={styles.buttonText}>
          {conversation.status === 'connected' ? 'End Call' : 'Start Call'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  callButton: {
    width: 120,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  callButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  buttonInner: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonInnerActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
