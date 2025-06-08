import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const navItems = [
  { title: 'Test', icon: 'flask', screen: 'ThreatDemo' },
  { title: 'Logs', icon: 'time', screen: 'LogHistory' },
  { title: 'Knowledge Base', icon: 'book', screen: 'KnowledgeBase' },
  { title: 'Settings', icon: 'settings', screen: 'Settings' },
  { title: 'About', icon: 'information-circle', screen: 'About' },
];

const CustomHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack() && route.name !== 'Home';

  const handleNav = (screen: string) => {
    if (route.name !== screen) {
      // @ts-ignore
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {route.name === 'Home' ? (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
              accessibilityLabel="Open navigation menu"
            >
              <Icon name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            canGoBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back"
              >
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )
          )}
        </View>
        {/* Centered logo as a go home button, hidden on Home screen */}
        {route.name !== 'Home' && (
          <TouchableOpacity
            style={styles.centerLogoContainer}
            onPress={() => handleNav('Home')}
            accessibilityLabel="Go to Home"
          >
            <View style={styles.iconContainer}>
              <View style={{ position: 'relative' }}>
                <Icon name="shield" size={30} color="#4A90E2" style={styles.logoIcon} />
                <Icon
                  name="lock-closed"
                  size={15}
                  color="#FFFFFF"
                  style={{ position: 'absolute', top: 7.5, left: 7.5 }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.rightPlaceholder}>
          {route.name !== 'Home' && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
              accessibilityLabel="Open navigation menu"
            >
              <Icon name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'rgba(26, 35, 126, 0.95)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(26, 35, 126, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  menuButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  centerLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 8,
    elevation: 5,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoIcon: {
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },
  rightPlaceholder: {
    width: 44,
  },
  settingsButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(26, 35, 126, 0.98)',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeNavButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#4A90E2',
  },
  contactUsContainer: { marginTop: 32, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 18, alignItems: 'center' },
  contactUsTitle: { color: '#4A90E2', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  contactUsName: { color: '#fff', fontSize: 14, marginBottom: 2 },
  contactUsEmail: { color: '#B0BEC5', fontSize: 13 },
});

export default CustomHeader; 