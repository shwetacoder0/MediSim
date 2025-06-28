import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, Zap, Image as ImageIcon, CheckCircle } from 'lucide-react-native';
import { ReportProcessingService } from '../lib/reportProcessing';

interface ReportProcessorProps {
  reportId: string;
  fileUri: string;
  mimeType: string;
  reportType: string;
  onProcessingComplete: (success: boolean, error?: string) => void;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  active: boolean;
}

export default function ReportProcessor({
  reportId,
  fileUri,
  mimeType,
  reportType,
  onProcessingComplete
}: ReportProcessorProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'extract',
      title: 'Extracting Text',
      description: 'Reading your medical report...',
      icon: Brain,
      completed: false,
      active: true
    },
    {
      id: 'analyze',
      title: 'AI Analysis',
      description: 'Analyzing with medical AI...',
      icon: Zap,
      completed: false,
      active: false
    },
    {
      id: 'visualize',
      title: 'Creating Visuals',
      description: 'Generating personalized illustrations...',
      icon: ImageIcon,
      completed: false,
      active: false
    }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    processReport();
  }, []);

  const updateStep = (stepIndex: number, completed: boolean, active: boolean) => {
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      completed: index < stepIndex ? true : completed && index === stepIndex,
      active: index === stepIndex ? active : false
    })));
  };

  const processReport = async () => {
    try {
      // Step 1: Text Extraction
      setCurrentStep(0);
      updateStep(0, false, true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      updateStep(0, true, false);

      // Step 2: AI Analysis
      setCurrentStep(1);
      updateStep(1, false, true);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time
      updateStep(1, true, false);

      // Step 3: Visual Generation
      setCurrentStep(2);
      updateStep(2, false, true);

      // Process the report
      const result = await ReportProcessingService.processReport(
        reportId,
        fileUri,
        mimeType,
        reportType
      );

      updateStep(2, true, false);
      setProcessing(false);

      if (result.success) {
        // All steps completed
        setSteps(prev => prev.map(step => ({ ...step, completed: true, active: false })));
        onProcessingComplete(true);
      } else {
        onProcessingComplete(false, result.error);
      }

    } catch (error) {
      console.error('Error processing report:', error);
      setProcessing(false);
      onProcessingComplete(false, error instanceof Error ? error.message : 'Processing failed');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Processing Your Report</Text>
          <Text style={styles.subtitle}>
            Our AI is analyzing your medical report to create personalized insights
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <BlurView intensity={15} tint="dark" style={styles.stepBlur}>
                <View style={styles.stepContent}>
                  <View style={styles.stepIcon}>
                    <View style={[
                      styles.iconContainer,
                      step.completed && styles.iconCompleted,
                      step.active && styles.iconActive
                    ]}>
                      {step.completed ? (
                        <CheckCircle size={24} color="#4ECDC4" />
                      ) : (
                        <step.icon 
                          size={24} 
                          color={step.active ? "#4FACFE" : "rgba(255, 255, 255, 0.5)"} 
                        />
                      )}
                    </View>
                  </View>

                  <View style={styles.stepInfo}>
                    <Text style={[
                      styles.stepTitle,
                      step.completed && styles.stepTitleCompleted,
                      step.active && styles.stepTitleActive
                    ]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>

                  {step.active && processing && (
                    <ActivityIndicator 
                      size="small" 
                      color="#4FACFE" 
                      style={styles.stepLoader}
                    />
                  )}
                </View>
              </BlurView>

              {index < steps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  step.completed && styles.stepConnectorCompleted
                ]} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    marginBottom: 40,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  stepIcon: {
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: {
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
  },
  iconCompleted: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  stepTitleActive: {
    color: '#4FACFE',
  },
  stepTitleCompleted: {
    color: '#4ECDC4',
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  stepLoader: {
    marginLeft: 16,
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 54,
  },
  stepConnectorCompleted: {
    backgroundColor: '#4ECDC4',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4FACFE',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});