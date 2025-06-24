import React, { useState, RefObject, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, findNodeHandle, UIManager, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { threatAnalysisService } from '../services/threatAnalysisService';
import { useSentryMode } from '../context/SentryModeContext';

interface SentryModeDemoProps {
  showGuidedDemo: boolean;
  setShowGuidedDemo: (show: boolean) => void;
  highlightCardRefs: RefObject<any>[];
  scrollViewRef: RefObject<any>;
}

const SentryModeDemo: React.FC<SentryModeDemoProps> = ({ showGuidedDemo, setShowGuidedDemo, highlightCardRefs, scrollViewRef }) => {
  const { settings } = useSentryMode();
  const [demoStep, setDemoStep] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState<any>(null);

  const demoSteps = [
    {
      title: 'Welcome to Sentry Mode Demo',
      description: 'This quick walkthrough shows how Sentry Mode keeps you safe in an emergency.',
      icon: 'shield-checkmark-outline',
      color: '#A070F2',
    },
    {
      title: 'Threat Detected & Analyzed',
      description: 'ThreatSense monitors your messages and uses AI to detect and analyze threats.',
      icon: 'analytics-outline',
      color: '#FF9800',
    },
    {
      title: 'Trusted Contact Alerted',
      description: 'If a serious threat is found, your trusted contact is instantly notified and can respond.',
      icon: 'notifications-outline',
      color: '#F44336',
    },
    {
      title: 'You\'re Not Alone',
      description: 'You get confirmation that help is on the way, or the situation is resolved. Ready to see it in action?',
      icon: 'checkmark-circle-outline',
      color: '#4CAF50',
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
  }, [demoStep, showGuidedDemo, highlightCardRefs, scrollViewRef]);

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
              const result = await threatAnalysisService.simulateThreat(level);
              Alert.alert(
                'Threat Simulated',
                `A ${level} level threat has been simulated.\n\nThreat Type: ${result.threatType}\nDescription: ${result.description}\n\nCheck the console for notification details.`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to simulate threat. Please try again.');
            }
          }
        }
      ]
    );
  };

  const startGuidedDemo = () => {
    setShowGuidedDemo(true);
    setDemoStep(0);
    setIsDemoRunning(true);
  };

  const handleNextStep = () => {
    if (demoStep < demoSteps.length - 1) {
      setDemoStep(demoStep + 1);
    } else {
      setShowGuidedDemo(false);
      setDemoStep(0);
      // Start the actual simulation
      handleStartSimulation();
    }
  };

  const skipDemo = () => {
    setShowGuidedDemo(false);
    setIsDemoRunning(false);
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  description: {
    color: '#B0B0B0',
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
    color: '#fff',
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
    backgroundColor: '#4CAF50',
  },
  mediumThreat: {
    backgroundColor: '#FF9800',
  },
  highThreat: {
    backgroundColor: '#F44336',
  },
  criticalThreat: {
    backgroundColor: '#9C27B0',
  },
  threatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 13,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
    color: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoModal: {
    backgroundColor: '#1C1C1E',
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
    color: '#fff',
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
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    color: '#B0B0B0',
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
    color: '#B0B0B0',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  progressText: { color: '#A070F2', fontWeight: '600', fontSize: 15, textAlign: 'center', marginBottom: 8 },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: '#00000015',
    zIndex: 9999,
  },
  demoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#222C',
    padding: 20,
    alignItems: 'center',
    zIndex: 10000,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  stepIconInline: {
    marginVertical: 8,
    backgroundColor: '#fff2',
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
    color: '#B0BEC5',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 24,
    alignSelf: 'center',
  },
});

export default SentryModeDemo;

 