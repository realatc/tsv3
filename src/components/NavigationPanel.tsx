import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const AVATAR_SIZE = 72;

const navItems = [
  { title: 'Home', icon: 'home', screen: 'Home' },
  { title: 'Logs', icon: 'time', screen: 'LogHistory' },
  { title: 'Test', icon: 'flask', screen: 'ThreatDemo' },
  { title: 'Knowledge Base', icon: 'book', screen: 'KnowledgeBase' },
  { title: 'Settings', icon: 'settings', screen: 'Settings' },
  { title: 'About', icon: 'information-circle', screen: 'About' },
];

const NavigationPanel: React.FC<DrawerContentComponentProps> = ({ navigation, state }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  // Animate avatar scale on drawer open
  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withSpring(state?.history?.length > 1 ? 1.1 : 1);
  }, [state?.history?.length]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  const [tosVisible, setTosVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Animated.View style={[styles.avatar, avatarStyle]}>
          <Image
            source={require('../../assets/avatar_placeholder.png')}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
            resizeMode="cover"
          />
        </Animated.View>
        <Text style={styles.avatarName}>Alex Crandall</Text>
        <Text style={styles.avatarEmail}>atcran3549@ung.edu</Text>
      </View>
      <View style={styles.menuContainer}>
        {navItems.map((item) => {
          const focused = state.routeNames[state.index] === item.screen;
          return (
            <TouchableOpacity
              key={item.title}
              style={[styles.navButton, focused && styles.activeNavButton]}
              onPress={() => handleNavigation(item.screen)}
            >
              <Icon
                name={item.icon}
                size={24}
                color={focused ? theme.primary : theme.text}
              />
              <Text style={[styles.buttonText, focused && styles.activeButtonText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.contactContainer}>
        <Text style={styles.contactLabel}>Contact Us</Text>
        <Text style={styles.contactText}>Alex Crandall</Text>
        <Text style={styles.contactText}>atcran3549@ung.edu</Text>
      </View>
      {/* Terms of Service Link */}
      <TouchableOpacity style={styles.tosLinkContainer} onPress={() => setTosVisible(true)} activeOpacity={0.7}>
        <Text style={styles.tosLink}>Terms of Service</Text>
      </TouchableOpacity>
      {/* TOS Modal */}
      <Modal
        visible={tosVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setTosVisible(false)}
      >
        <View style={styles.tosModalOverlay}>
          <View style={styles.tosModalContent}>
            <Text style={styles.tosModalTitle}>Terms of Service</Text>
            <Text style={styles.tosModalText}>
              By using this app, you agree to our totally serious Terms of Service: Don't hack the planet, don't feed the trolls, and always use strong passwords. ThreatSense is not responsible for any sudden urges to become a cybersecurity superhero. 🦸‍♂️
            </Text>
            <TouchableOpacity style={styles.tosModalButton} onPress={() => setTosVisible(false)}>
              <Text style={styles.tosModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: theme.background,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: theme.primary,
    backgroundColor: theme.surface,
  },
  avatarName: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  avatarEmail: {
    color: theme.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.border,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeNavButton: {
    backgroundColor: theme.primaryLight,
    borderColor: theme.primary,
  },
  buttonText: {
    color: theme.text,
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  activeButtonText: {
    color: theme.primary,
  },
  contactContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    alignItems: 'center',
  },
  contactLabel: {
    color: theme.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  contactText: {
    color: theme.text,
    fontSize: 13,
  },
  tosLinkContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  tosLink: {
    color: theme.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
  tosModalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tosModalContent: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    maxWidth: '85%',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tosModalTitle: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  tosModalText: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 18,
    textAlign: 'center',
  },
  tosModalButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  tosModalButtonText: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default NavigationPanel; 