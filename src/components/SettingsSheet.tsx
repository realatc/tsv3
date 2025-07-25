import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, Switch } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAccessibility } from '../context/AccessibilityContext';
import { useTheme } from '../context/ThemeContext';
import { navigate } from '../services/navigationService';
import { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

type SettingsSheetProps = {};

type Ref = BottomSheet;

const SettingsSheet = forwardRef<Ref, SettingsSheetProps>((props, ref) => {
  const { resetToDefaults } = useAccessibility();
  const { ezModeEnabled, setEzModeEnabled } = useApp();
  const { isLightMode, toggleTheme, theme } = useTheme();

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

  const handleNavigation = (routeName: keyof RootStackParamList) => {
    navigate(routeName, undefined);
    if (ref && 'current' in ref && ref.current) {
        ref.current.close();
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    sheetContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    settingsGroup: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 12,
      flex: 1,
    },
    settingValue: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: '500',
    },
  });

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['40%', '75%', '100%']}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: theme.background }}
      handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
      detached={true}
      bottomInset={-400}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Accessibility Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibility</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={[styles.settingItem, {borderBottomWidth: 0}]} onPress={() => handleNavigation('AccessibilitySettings')}>
                  <View style={styles.settingLeft}>
                    <Icon name="accessibility" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Accessibility</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Security Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={[styles.settingItem, {borderBottomWidth: 0}]} onPress={() => handleNavigation('SentryMode')}>
                  <View style={styles.settingLeft}>
                    <Icon name="shield-checkmark-outline" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Sentry Mode</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* App Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              <View style={styles.settingsGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Icon name="flash" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Enable EZ-Mode (Simple Mode)</Text>
                  </View>
                  <Switch
                    value={ezModeEnabled}
                    onValueChange={setEzModeEnabled}
                    thumbColor="#fff"
                    trackColor={{ false: theme.surfaceSecondary, true: theme.success }}
                    ios_backgroundColor={theme.surfaceSecondary}
                  />
                </View>
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Icon name="sunny" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Light Mode</Text>
                  </View>
                  <Switch
                    value={isLightMode}
                    onValueChange={toggleTheme}
                    thumbColor="#fff"
                    trackColor={{ false: theme.surfaceSecondary, true: theme.success }}
                    ios_backgroundColor={theme.surfaceSecondary}
                  />
                </View>
                <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigation('HelpAndSupport')}>
                  <View style={styles.settingLeft}>
                    <Icon name="help-circle-outline" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Help & Support</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, {borderBottomWidth: 0}]} onPress={handleResetSettings}>
                  <View style={styles.settingLeft}>
                    <Icon name="refresh" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Reset to Defaults</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.settingsGroup}>
                <View style={[styles.settingItem, {borderBottomWidth: 0}]}>
                  <View style={styles.settingLeft}>
                    <Icon name="information-circle" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Version</Text>
                  </View>
                  <Text style={styles.settingValue}>1.0.0</Text>
                </View>
              </View>
            </View>

            {/* Legal & Support Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Legal & Support</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert(
                  'Terms of Service',
                  "By using ThreatSense, you agree to the following terms:\\n\\n1. You will not use this app for any nefarious purposes, like trying to frame your annoying neighbor, Kevin.\\n\\n2. You acknowledge that our AI, while brilliant, might occasionally mistake a cat photo for a phishing attempt. No AI is purr-fect.\\n\\n3. You will not hold us liable if the app advises you that a message from a Nigerian prince is, in fact, a scam. We're just the messengers.\\n\\n4. You agree to use your newfound threat-spotting powers for good, not for becoming the most paranoid person at the family BBQ.\\n\\n5. If you successfully prevent a scam, you are morally obligated to do a small celebratory dance. We don't make the rules. (We do.)"
                )}>
                  <View style={styles.settingLeft}>
                    <Icon name="document-text-outline" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Terms of Service</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Privacy Policy', 'Coming soon!')}>
                  <View style={styles.settingLeft}>
                    <Icon name="shield-checkmark-outline" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Privacy Policy</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={() => Alert.alert('Contact Us', 'For support, please email support@threatsense.app')}>
                  <View style={styles.settingLeft}>
                    <Icon name="mail-outline" size={20} color={theme.primary} />
                    <Text style={styles.settingText}>Contact Us</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </BottomSheet>
  );
});

export default SettingsSheet; 