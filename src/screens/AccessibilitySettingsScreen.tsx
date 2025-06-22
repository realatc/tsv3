import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAccessibility } from '../context/AccessibilityContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type AccessibilitySettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AccessibilitySettings'
>;

type Props = {
  navigation: AccessibilitySettingsScreenNavigationProp;
};

const SettingItem = ({ 
  title,
  icon,
  value,
  onValueChange
}: {
  title: string;
  icon: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <Icon name={icon} size={22} color="#A070F2" style={styles.settingIcon} />
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    {typeof value === 'boolean' && onValueChange && (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#A070F2' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />
    )}
  </View>
);

const AccessibilitySettingsScreen = ({ navigation }: Props) => {
  const { settings, updateSetting } = useAccessibility();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Text style={{ color: '#A070F2', fontSize: 17, fontWeight: '600' }}>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Visual Accessibility Section */}
        <Text style={styles.sectionTitle}>Visual</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            title="High Contrast Mode"
            icon="contrast-outline"
            value={settings.highContrastMode}
            onValueChange={(value) => updateSetting('highContrastMode', value)}
          />
          <SettingItem
            title="Large Text Mode"
            icon="text-outline"
            value={settings.largeTextMode}
            onValueChange={(value) => updateSetting('largeTextMode', value)}
          />
          <SettingItem
            title="Color Blind Friendly"
            icon="color-palette-outline"
            value={settings.colorBlindFriendly}
            onValueChange={(value) => updateSetting('colorBlindFriendly', value)}
          />
          <SettingItem
            title="Reduced Motion"
            icon="flash-off-outline"
            value={settings.reducedMotion}
            onValueChange={(value) => updateSetting('reducedMotion', value)}
          />
        </View>
        
        {/* Audio Accessibility Section */}
        <Text style={styles.sectionTitle}>Audio & Haptics</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            title="Audio Alerts"
            icon="volume-high-outline"
            value={settings.audioAlerts}
            onValueChange={(value) => updateSetting('audioAlerts', value)}
          />
           <SettingItem
            title="Voice Descriptions"
            icon="mic-outline"
            value={settings.voiceDescriptions}
            onValueChange={(value) => updateSetting('voiceDescriptions', value)}
          />
          <SettingItem
            title="Haptic Feedback"
            icon="keypad-outline"
            value={settings.hapticFeedback}
            onValueChange={(value) => updateSetting('hapticFeedback', value)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    padding: 16,
  },
  sectionTitle: {
    color: '#8A8A8E',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 12,
    marginBottom: 8,
    marginTop: 20,
  },
  settingsGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3A3A3C',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  settingTitle: {
    color: '#fff',
    fontSize: 17,
  },
});

export default AccessibilitySettingsScreen; 