import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Brain, Zap, Image as ImageIcon, CircleCheck as CheckCircle } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { TextExtractionService } from '../lib/textExtraction';
import { GeminiService } from '../lib/geminiService';
import { ImageGenerationService } from '../lib/imageGeneration';
import { ReportProcessingService } from '../lib/reportProcessing';
import { STORAGE_BUCKETS } from '../config/constants';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

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

// Mock data for the report analysis
const MOCK_ANALYSIS = {
  detailedAnalysis: `Patient Findings - Kidney and Urinary Tract Overview

Right Kidney:

Size: 11.3 x 4.5 x 5.2 cm

No signs of hydronephrosis (swelling due to urine buildup).

No kidney stones or opaque densities.

Identified anatomical variation: extra renal type of renal pelvis.

Left Kidney:

Size: 10.6 x 4.5 x 5.4 cm

No hydronephrosis.

A tiny 0.2 cm opaque density (HU +150) is noted in the interpolar region, indicating non-obstructive nephrolithiasis (a small kidney stone).

Ureters:

Both are not dilated and show no stones or blockage.

Urinary Bladder:

Adequate filling.

No filling defects or abnormal masses.

Other Observations:

Liver, gallbladder, pancreas, spleen, and adrenal glands appear normal.

Segmental wall calcification of abdominal aorta and right iliofemoral arteries (likely vascular aging).

Pelvic phleboliths present — benign small calcifications.

Marginal osteophytes (bony spurs) in the dorsal spine.

Visualized iliac bones are unremarkable.

Clinical Impression:

Likely diagnosis: Tiny non-obstructing left nephrolithiasis

Noted variation: Extrarenal pelvis (right kidney)`,
  visualizationData: {
    chartData: {
      "kidney_sizes_cm": {
        "right_kidney": [11.3, 4.5, 5.2],
        "left_kidney": [10.6, 4.5, 5.4],
        "normal_range": [10.0, 4.0, 5.0]
      },
      "stone_presence": {
        "right_kidney": false,
        "left_kidney": {
          "present": true,
          "size_cm": 0.2,
          "location": "interpolar",
          "type": "non-obstructing"
        }
      },
      "hydronephrosis": {
        "right_kidney": false,
        "left_kidney": false
      },
      "ureter_status": {
        "right": "normal",
        "left": "normal"
      },
      "vascular_findings": {
        "aorta_calcification": true,
        "right_iliofemoral_calcification": true
      },
      "skeletal_findings": {
        "dorsal_spine_osteophytes": true
      },
      "bladder": {
        "filling": "adequate",
        "defects": false
      }
    },
    metrics: {
      "renal_stone_size_mm": 2,
      "stone_density_HU": 150,
      "hydronephrosis": false,
      "ureter_dilation": false,
      "vascular_calcification_detected": 2,
      "skeletal_anomalies": 1,
      "organs_visualized": 6,
      "abnormal_findings_count": 4
    },
    visualNotes: `- Mark left kidney interpolar zone with a 2mm calcification (stone).
- Highlight extrarenal renal pelvis on right kidney.
- Overlay a label on aorta and right iliofemoral artery showing calcified segments.
- Tag dorsal spine with "marginal osteophytes".
- Label urinary bladder as "adequately filled, no defect".
- Optionally annotate surrounding organs as "grossly unremarkable".`
  },
  doctorScript: "Hello! I've reviewed your CT Stonogram results. The good news is that your kidneys are functioning well overall. I did notice a tiny 2mm stone in your left kidney, but it's not causing any blockage, which is good. Your right kidney has a normal variation called an 'extrarenal pelvis,' which is just an anatomical difference and nothing to worry about. Your ureters and bladder look completely normal. I also noticed some minor calcifications in your blood vessels and some small bone spurs in your spine, which are common findings as we age. These findings explain your symptoms of right lower quadrant pain and blood in your urine. I'd recommend increasing your water intake to help pass the small stone naturally, and we can discuss pain management options if needed. Any questions about your results?"
};

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
  const [extractedText, setExtractedText] = useState('');

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

  // Add a simulated delay for better UX
  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Upload the kidney visualization image to Supabase storage
  const uploadKidneyVisualizationToStorage = async () => {
    try {
      // In a real app, this would be the path to the generated image
      // For this demo, we'll use the asset from our project
      const imagePath = Platform.OS === 'ios'
        ? `${FileSystem.documentDirectory}kidney-visualization.png`
        : `${FileSystem.cacheDirectory}kidney-visualization.png`;

      // Copy the asset to a temporary file
      await FileSystem.copyAsync({
        from: require('../assets/images/kidney-visualization.png'),
        to: imagePath
      });

      // Read the file as base64
      const base64Image = await FileSystem.readAsStringAsync(imagePath, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Generate a unique filename
      const filename = `kidney_${reportId}_${Date.now()}.png`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.AI_IMAGES)
        .upload(filename, decode(base64Image), {
          contentType: 'image/png'
        });

      if (error) {
        console.error('Error uploading image to storage:', error);
        return null;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKETS.AI_IMAGES)
        .getPublicUrl(filename);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadKidneyVisualizationToStorage:', error);
      return null;
    }
  };

  const processReport = async () => {
    try {
      // Step 1: Text Extraction
      setCurrentStep(0);
      updateStep(0, false, true);

      // Simulate text extraction
      await simulateDelay(2000);

      updateStep(0, true, false);

      // Step 2: AI Analysis
      setCurrentStep(1);
      updateStep(1, false, true);

      // Simulate AI analysis
      await simulateDelay(3000);

      updateStep(1, true, false);

      // Step 3: Visual Generation
      setCurrentStep(2);
      updateStep(2, false, true);

      // Simulate visual generation
      await simulateDelay(2500);

      // Upload the kidney visualization to Supabase storage
      const imageUrl = await uploadKidneyVisualizationToStorage() || 'kidney_visualization.png';

      // Save the mock analysis to the database
      try {
        const { data, error } = await supabase
          .from('report_analysis')
          .upsert({
            report_id: reportId,
            ai_summary: MOCK_ANALYSIS.detailedAnalysis,
            ai_doctor_explanation: MOCK_ANALYSIS.doctorScript,
            analysis_date: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error('Error saving analysis to database:', error);
        }

        // Also save visualization data
        const { data: vizData, error: vizError } = await supabase
          .from('visualization_data')
          .upsert({
            report_id: reportId,
            chart_data: MOCK_ANALYSIS.visualizationData.chartData,
            metrics: MOCK_ANALYSIS.visualizationData.metrics,
            visual_notes: MOCK_ANALYSIS.visualizationData.visualNotes
          })
          .select();

        if (vizError) {
          console.error('Error saving visualization data to database:', vizError);
        }

        // Create an AI image record with the storage URL
        const { data: imageData, error: imageError } = await supabase
          .from('ai_images')
          .upsert({
            report_id: reportId,
            image_url: imageUrl,
            model_used: 'demo_model',
            generated_at: new Date().toISOString()
          })
          .select();

        if (imageError) {
          console.error('Error creating AI image record:', imageError);
        }
      } catch (error) {
        console.error('Error in database operation:', error);
      }

      updateStep(2, true, false);
      setProcessing(false);

      // All steps completed
      setSteps(prev => prev.map(step => ({ ...step, completed: true, active: false })));

      // Add a small delay before completing
      await simulateDelay(1000);

      onProcessingComplete(true);

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
