import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAccessibility } from '../context/AccessibilityContext';

const SettingsScreen = () => {
  const { settings, updateSetting, resetToDefaults } = useAccessibility();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all accessibility settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetToDefaults }
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    description, 
    value, 
    onValueChange, 
    type = 'switch',
    icon 
  }: {
    title: string;
    description: string;
    value: any;
    onValueChange: (value: any) => void;
    type?: 'switch' | 'select';
    icon: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#4A90E2" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: '#4A90E2' }}
            thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
            ios_backgroundColor="#767577"
          />
        ) : (
          <TouchableOpacity style={styles.selectButton} onPress={() => onValueChange(!value)}>
            <Text style={styles.selectButtonText}>{value}</Text>
            <Icon name="chevron-down" size={16} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Icon name="accessibility" size={32} color="#4A90E2" />
            <Text style={styles.title}>Accessibility Settings</Text>
            <Text style={styles.subtitle}>Customize your ThreatSense experience</Text>
          </View>

          {/* Visual Accessibility Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="eye" size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Visual Accessibility</Text>
            </View>
            
            <View style={styles.sectionContent}>
              <SettingItem
                title="High Contrast Mode"
                description="Enhance contrast for better visibility"
                value={settings.highContrastMode}
                onValueChange={(value) => updateSetting('highContrastMode', value)}
                icon="contrast"
              />
              
              <SettingItem
                title="Large Text Mode"
                description="Increase text size throughout the app (20% larger)"
                value={settings.largeTextMode}
                onValueChange={(value) => updateSetting('largeTextMode', value)}
                icon="text"
              />
              
              <SettingItem
                title="Color Blind Friendly"
                description="Add patterns and symbols to distinguish threat levels"
                value={settings.colorBlindFriendly}
                onValueChange={(value) => updateSetting('colorBlindFriendly', value)}
                icon="color-palette"
              />
              
              <SettingItem
                title="Reduced Motion"
                description="Disable animations for vestibular disorders"
                value={settings.reducedMotion}
                onValueChange={(value) => updateSetting('reducedMotion', value)}
                icon="pause-circle"
              />
            </View>
          </View>

          {/* Audio Accessibility Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="volume-high" size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Audio Accessibility</Text>
            </View>
            
            <View style={styles.sectionContent}>
              <SettingItem
                title="Audio Alerts"
                description="Play sounds for threat notifications"
                value={settings.audioAlerts}
                onValueChange={(value) => updateSetting('audioAlerts', value)}
                icon="notifications"
              />
              
              <SettingItem
                title="Voice Descriptions"
                description="Audio descriptions of threat analysis"
                value={settings.voiceDescriptions}
                onValueChange={(value) => updateSetting('voiceDescriptions', value)}
                icon="mic"
              />
              
              <SettingItem
                title="Screen Reader Mode"
                description="Enhanced support for screen readers"
                value={settings.screenReaderMode}
                onValueChange={(value) => updateSetting('screenReaderMode', value)}
                icon="ear"
              />
            </View>
          </View>

          {/* Haptic Feedback Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="phone-portrait" size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Haptic Feedback</Text>
            </View>
            
            <View style={styles.sectionContent}>
              <SettingItem
                title="Haptic Feedback"
                description="Vibration feedback for interactions"
                value={settings.hapticFeedback}
                onValueChange={(value) => updateSetting('hapticFeedback', value)}
                icon="phone-portrait"
              />
              
              <SettingItem
                title="Threat Haptics"
                description="Special vibration patterns for threats"
                value={settings.threatHaptics}
                onValueChange={(value) => updateSetting('threatHaptics', value)}
                icon="warning"
              />
            </View>
          </View>

          {/* Customization Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="settings" size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Customization</Text>
            </View>
            
            <View style={styles.sectionContent}>
              <SettingItem
                title="Font Size"
                description={`Current: ${settings.fontSize}`}
                value={settings.fontSize}
                onValueChange={(value) => {
                  const sizes: Array<'small' | 'medium' | 'large' | 'extra-large'> = ['small', 'medium', 'large', 'extra-large'];
                  const currentIndex = sizes.indexOf(settings.fontSize);
                  const nextIndex = (currentIndex + 1) % sizes.length;
                  updateSetting('fontSize', sizes[nextIndex]);
                }}
                type="select"
                icon="text"
              />
              
              <SettingItem
                title="Contrast Level"
                description={`Current: ${settings.contrastLevel}`}
                value={settings.contrastLevel}
                onValueChange={(value) => {
                  const levels: Array<'normal' | 'high' | 'maximum'> = ['normal', 'high', 'maximum'];
                  const currentIndex = levels.indexOf(settings.contrastLevel);
                  const nextIndex = (currentIndex + 1) % levels.length;
                  updateSetting('contrastLevel', levels[nextIndex]);
                }}
                type="select"
                icon="contrast"
              />
            </View>
          </View>

          {/* Accessibility Demo Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="eye" size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Accessibility Preview</Text>
            </View>
            
            <View style={styles.sectionContent}>
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Threat Level Examples:</Text>
                <View style={styles.demoThreats}>
                  <View style={styles.demoThreat}>
                    <Text style={styles.demoLabel}>High Threat</Text>
                    <View style={[styles.demoBadge, { borderColor: '#FF6B6B' }]}>
                      <Icon name="warning" size={16} color="#FF6B6B" />
                      <Text style={[styles.demoText, { color: '#FF6B6B' }]}>High (7/9)</Text>
                      {settings.colorBlindFriendly && <Text style={styles.demoPattern}>⚠️</Text>}
                    </View>
                  </View>
                  <View style={styles.demoThreat}>
                    <Text style={styles.demoLabel}>Medium Threat</Text>
                    <View style={[styles.demoBadge, { borderColor: '#FFB300' }]}>
                      <Icon name="alert-circle" size={16} color="#FFB300" />
                      <Text style={[styles.demoText, { color: '#FFB300' }]}>Medium (3/9)</Text>
                      {settings.colorBlindFriendly && <Text style={styles.demoPattern}>⚡</Text>}
                    </View>
                  </View>
                  <View style={styles.demoThreat}>
                    <Text style={styles.demoLabel}>Low Threat</Text>
                    <View style={[styles.demoBadge, { borderColor: '#43A047' }]}>
                      <Icon name="shield-checkmark" size={16} color="#43A047" />
                      <Text style={[styles.demoText, { color: '#43A047' }]}>Low (1/9)</Text>
                      {settings.colorBlindFriendly && <Text style={styles.demoPattern}>✅</Text>}
                    </View>
                  </View>
                </View>
                
                <Text style={styles.demoNote}>
                  {settings.largeTextMode ? '📏 Large text mode is active - text is 20% larger' : '📏 Large text mode is off'}
                </Text>
                <Text style={styles.demoNote}>
                  {settings.colorBlindFriendly ? '🎨 Colorblind-friendly mode is active - patterns added' : '🎨 Colorblind-friendly mode is off'}
                </Text>
                <Text style={styles.demoNote}>
                  {settings.highContrastMode ? '⚫ High contrast mode is active - enhanced contrast' : '⚫ High contrast mode is off'}
                </Text>
              </View>
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
            <Icon name="refresh" size={20} color="#FF6B6B" />
            <Text style={styles.resetButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>

          {/* Accessibility Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>About Accessibility</Text>
            <Text style={styles.infoText}>
              These settings help make ThreatSense accessible to users with different needs. 
              Changes are applied immediately and saved automatically.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#4A90E2',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  settingRight: {
    marginLeft: 10,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  selectButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    marginTop: 20,
    marginBottom: 30,
  },
  resetButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  infoTitle: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#B0BEC5',
    fontSize: 14,
    lineHeight: 20,
  },
  demoContainer: {
    padding: 20,
  },
  demoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  demoThreats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoThreat: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
  },
  demoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  demoText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  demoPattern: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
  },
  demoNote: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 10,
  },
});

export default SettingsScreen; 