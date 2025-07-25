import React, { useState, RefObject, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, findNodeHandle, UIManager, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { threatAnalysisService } from '../services/threatAnalysisService';
import { useSentryMode } from '../context/SentryModeContext';
import { useTheme } from '../context/ThemeContext';

interface SentryModeDemoProps {
  showGuidedDemo: boolean;
  setShowGuidedDemo: (show: boolean) => void;
  highlightCardRefs: RefObject<any>[];
  scrollViewRef: RefObject<any>;
}

const SentryModeDemo: React.FC<SentryModeDemoProps> = ({ showGuidedDemo, setShowGuidedDemo, highlightCardRefs, scrollViewRef }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { settings } = useSentryMode();
  const [demoStep, setDemoStep] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState<any>(null);

  const demoSteps = [
    {
      title: 'Welcome to Sentry Mode Demo',
      description: 'This quick walkthrough shows how Sentry Mode keeps you safe in an emergency.',
      icon: 'shield-checkmark-outline',
      color: theme.primary,
    },
    {
      title: 'Threat Detected & Analyzed',
      description: 'ThreatSense monitors your messages and uses AI to detect and analyze threats.',
      icon: 'analytics-outline',
      color: theme.warning,
    },
    {
      title: 'Trusted Contact Alerted',
      description: 'If a serious threat is found, your trusted contact is instantly notified and can respond.',
      icon: 'notifications-outline',
      color: theme.error,
    },
    {
      title: 'You\'re Not Alone',
      description: 'You get confirmation that help is on the way, or the situation is resolved. Ready to see it in action?',
      icon: 'checkmark-circle-outline',
      color: theme.success,
    },
  ];

  useEffect(() => {
    if (!showGuidedDemo || demoStep === 0) {
      setHighlightStyle(null);
      return;
    }
    const ref = highlightCardRefs[demoStep - 1];
    if (ref && ref.current && scrollViewRef && scrollViewRef.current) {
      ref.current.measureLayout(
        scrollViewRef.current,
        (x: number, y: number, width: number, height: number) => {
          // Scroll to the element
          scrollViewRef.current.scrollTo({ y: y - 40, animated: true });
          // After a short delay, measure in window for highlight
          setTimeout(() => {
            ref.current.measureInWindow((wx: number, wy: number, wwidth: number, wheight: number) => {
              setHighlightStyle({
                position: 'absolute',
                left: wx,
                top: wy,
                width: wwidth,
                height: wheight,
                borderWidth: 3,
                borderColor: demoSteps[demoStep].color,
                borderRadius: 12,
                backgroundColor: demoSteps[demoStep].color + '15',
                zIndex: 9999,
              });
            });
          }, 350);
        },
        () => setHighlightStyle(null)
      );
    } else {
      setHighlightStyle(null);
    }
  }, [demoStep, showGuidedDemo, highlightCardRefs, scrollViewRef, demoSteps]);

  const simulateThreat = async (level: 'Low' | 'Medium' | 'High' | 'Critical') => {
    if (!settings.isEnabled) {
      Alert.alert('Sentry Mode Disabled', 'Please enable Sentry Mode first to test threat simulation.');
      return;
    }

    if (!settings.trustedContact) {
      Alert.alert('No Trusted Contact', 'Please select a trusted contact first to test threat simulation.');
      return;
    }

    Alert.alert(
      `Simulate ${level} Threat`,
      `This will simulate a ${level} level threat and trigger Sentry Mode notification if enabled. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate', 
          onPress: async () => {
            try {
              const mockThreat = {
                id: `demo-${Date.now()}`,
                message: `Demo ${level} threat simulation`,
                sender: 'demo@threatsense.app',
                timestamp: new Date().toISOString(),
                threatLevel: level,
                category: 'Demo',
                confidence: 0.95,
                analysis: `This is a simulated ${level.toLowerCase()} threat for demonstration purposes.`,
                recommendations: ['This is a demo - no action needed'],
              };

              await threatAnalysisService.analyzeText(mockThreat.message);
              Alert.alert('Simulation Complete', `A ${level} threat has been simulated and processed.`);
            } catch (error) {
              console.error('Simulation error:', error);
              Alert.alert('Simulation Error', 'Failed to simulate threat. Please try again.');
            }
          }
        }
      ]
    );
  };

  const startGuidedDemo = () => {
    setDemoStep(0);
    setShowGuidedDemo(true);
  };

  const handleNextStep = () => {
    if (demoStep === demoSteps.length - 1) {
      handleStartSimulation();
    } else {
      setDemoStep(demoStep + 1);
    }
  };

  const skipDemo = () => {
    setShowGuidedDemo(false);
    setDemoStep(0);
  };

  const handleStartSimulation = () => {
    // Start the actual simulation
    simulateThreat('High');
  };

  if (!settings.isEnabled) {
    return null;
  }

  // Remove Modal and render inline overlay at the bottom
  if (!showGuidedDemo) return null;

  return (
    <>
      {/* Highlight overlay */}
      {highlightStyle && (
        <View pointerEvents="none" style={highlightStyle} />
      )}
      {/* Bottom overlay for demo controls */}
      <View style={styles.demoOverlay}>
        <Text style={styles.progressText}>Step {demoStep + 1} of {demoSteps.length}</Text>
        <View style={styles.stepIconInline}>
          <Icon name={demoSteps[demoStep].icon} size={32} color={demoSteps[demoStep].color} />
        </View>
        <Text style={styles.stepTitle}>{demoSteps[demoStep].title}</Text>
        <Text style={styles.stepDescription}>{demoSteps[demoStep].description}</Text>
        <View style={styles.demoButtonRow}>
          <TouchableOpacity onPress={() => { setShowGuidedDemo(false); setDemoStep(0); }}>
            <Text style={styles.skipDemoText}>Skip Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: demoSteps[demoStep].color }]} 
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>
              {demoStep === demoSteps.length - 1 ? 'Start Simulation' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  description: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  guidedDemoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  guidedDemoText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  threatButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  threatButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  lowThreat: {
    backgroundColor: theme.success,
  },
  mediumThreat: {
    backgroundColor: theme.warning,
  },
  highThreat: {
    backgroundColor: theme.error,
  },
  criticalThreat: {
    backgroundColor: theme.primary,
  },
  threatButtonText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    color: theme.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
    color: theme.text,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoModal: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  demoTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  demoContent: {
    flex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  demoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: theme.textSecondary,
    fontSize: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  progressText: { color: theme.primary, fontWeight: '600', fontSize: 15, textAlign: 'center', marginBottom: 8 },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height,
    borderWidth: 3,
    borderColor: theme.text,
    borderRadius: 12,
    backgroundColor: theme.overlay,
    zIndex: 9999,
  },
  demoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.surface,
    padding: 20,
    alignItems: 'center',
    zIndex: 10000,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  stepIconInline: {
    marginVertical: 8,
    backgroundColor: theme.border,
    borderRadius: 20,
    padding: 8,
  },
  demoButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
  },
  skipDemoText: {
    color: theme.textSecondary,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 24,
    alignSelf: 'center',
  },
});

export default SentryModeDemo;

 