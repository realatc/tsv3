import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSentryMode } from '../context/SentryModeContext';
import { navigate } from '../services/navigationService';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SentryModeShowcase: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { settings } = useSentryMode();
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const features = [
    {
      icon: 'shield-checkmark-outline',
      title: '24/7 Protection',
      description: 'Continuous monitoring of your messages and communications',
      color: theme.success
    },
    {
      icon: 'notifications-outline',
      title: 'Instant Alerts',
      description: 'Immediate notification to trusted contacts when threats are detected',
      color: theme.error
    },
    {
      icon: 'people-outline',
      title: 'Trusted Network',
      description: 'Keep your loved ones informed and ready to help',
      color: theme.primary
    },
    {
      icon: 'analytics-outline',
      title: 'AI-Powered Analysis',
      description: 'Advanced threat detection using machine learning',
      color: theme.warning
    },
    {
      icon: 'location-outline',
      title: 'Location Sharing',
      description: 'Share your location with trusted contacts during emergencies',
      color: theme.info
    },
    {
      icon: 'settings-outline',
      title: 'Customizable Thresholds',
      description: 'Set your own threat level sensitivity',
      color: theme.textSecondary
    }
  ];

  const benefits = [
    'Peace of mind knowing help is just one alert away',
    'Protection for vulnerable family members',
    'Professional-grade security monitoring',
    'Privacy-focused design with local data storage',
    'Easy setup and configuration',
    'Works with existing contacts and messaging'
  ];

  const handleSetupSentryMode = () => {
    setShowFeatureModal(false);
    navigate('Settings');
  };

  const handleLearnMore = () => {
    setShowFeatureModal(false);
    navigate('KnowledgeBaseSentryMode');
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Icon name="shield-checkmark-outline" size={48} color={theme.primary} />
        </View>
        <Text style={styles.heroTitle}>Sentry Mode</Text>
        <Text style={styles.heroSubtitle}>Your Personal Security Guardian</Text>
        <Text style={styles.heroDescription}>
          Automatically notify trusted contacts when threats are detected, ensuring you're never alone in an emergency.
        </Text>
        
        <View style={styles.heroStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Monitoring</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Instant</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Trusted</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '22' }]}>
                <Icon name={feature.icon} size={24} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={styles.sectionTitle}>Why Choose Sentry Mode?</Text>
        <View style={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Icon name="checkmark-circle" size={16} color={theme.success} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Icon name="shield-checkmark" size={16} color={settings.isEnabled ? theme.success : theme.textSecondary} />
            <Text style={styles.statusLabel}>Sentry Mode</Text>
            <Text style={styles.statusValue}>{settings.isEnabled ? 'Enabled' : 'Disabled'}</Text>
          </View>
          <View style={styles.statusRow}>
            <Icon name="person" size={16} color={settings.trustedContact ? theme.success : theme.textSecondary} />
            <Text style={styles.statusLabel}>Trusted Contact</Text>
            <Text style={styles.statusValue}>{settings.trustedContact ? 'Set' : 'Not Set'}</Text>
          </View>
        </View>
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={() => setShowFeatureModal(true)}
        >
          <Icon name="information-circle" size={20} color={theme.text} />
          <Text style={styles.primaryButtonText}>Learn More About Sentry Mode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]} 
          onPress={() => navigate('Settings')}
        >
          <Icon name="settings" size={20} color={theme.primary} />
          <Text style={styles.secondaryButtonText}>Configure Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Modal */}
      <Modal
        visible={showFeatureModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFeatureModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="shield-checkmark-outline" size={24} color={theme.primary} />
              <Text style={styles.modalTitle}>Sentry Mode Features</Text>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalDescription}>
                Sentry Mode provides comprehensive protection through advanced monitoring and instant alerting capabilities.
              </Text>

              <View style={styles.modalFeatures}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.modalFeature}>
                    <View style={[styles.modalFeatureIcon, { backgroundColor: feature.color + '22' }]}>
                      <Icon name={feature.icon} size={20} color={feature.color} />
                    </View>
                    <View style={styles.modalFeatureText}>
                      <Text style={styles.modalFeatureTitle}>{feature.title}</Text>
                      <Text style={styles.modalFeatureDesc}>{feature.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleLearnMore}>
                <Text style={styles.modalButtonText}>Learn More</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.primary }]} 
                onPress={handleSetupSentryMode}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>Setup Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    color: theme.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  heroDescription: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.border,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    color: theme.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsList: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    color: theme.textSecondary,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  statusSection: {
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    color: theme.textSecondary,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  statusValue: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
  },
  actionSection: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: theme.primary,
  },
  primaryButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  modalBody: {
    flex: 1,
  },
  modalDescription: {
    color: theme.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalFeatures: {
    gap: 16,
  },
  modalFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalFeatureText: {
    flex: 1,
  },
  modalFeatureTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalFeatureDesc: {
    color: theme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.primary,
    alignItems: 'center',
  },
  modalButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SentryModeShowcase; 