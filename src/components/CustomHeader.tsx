import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, NavigationProp, DrawerActions } from '@react-navigation/native';

const navItems = [
  { title: 'Test', icon: 'flask', screen: 'ThreatDemo' },
  { title: 'Logs', icon: 'time', screen: 'LogHistory' },
  { title: 'Knowledge Base', icon: 'book', screen: 'KnowledgeBase' },
  { title: 'Settings', icon: 'settings', screen: 'Settings' },
  { title: 'About', icon: 'information-circle', screen: 'About' },
];

const mainDrawerScreens = [
  'Home',
  'ThreatDemo',
  'LogHistory',
  'KnowledgeBase',
  'Settings',
  'About',
];

const CustomHeader = ({ title, onActionMenuPress }: { title?: string, onActionMenuPress?: () => void }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();
  const isDrawerScreen = mainDrawerScreens.includes(route.name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {isDrawerScreen ? (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              activeOpacity={0.7}
              accessibilityLabel="Open navigation menu"
            >
              <Icon name="menu" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            canGoBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                accessibilityLabel="Go back"
              >
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )
          )}
        </View>
        {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
        <View style={styles.rightPlaceholder}>
          {onActionMenuPress && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onActionMenuPress}
              activeOpacity={0.7}
              accessibilityLabel="Show actions menu"
            >
              <Icon name="ellipsis-horizontal" size={28} color="#FFFFFF" />
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.5,
    marginHorizontal: 44,
  },
});

export default CustomHeader; 