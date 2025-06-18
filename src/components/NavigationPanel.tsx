import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

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
                color={focused ? '#4A90E2' : '#FFFFFF'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#1a1a1a',
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
    borderColor: '#4A90E2',
    backgroundColor: '#222',
  },
  avatarName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  avatarEmail: {
    color: '#aaa',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeNavButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.18)',
    borderColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#4A90E2',
  },
  contactContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  contactLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 2,
  },
  contactText: {
    color: '#fff',
    fontSize: 13,
  },
});

export default NavigationPanel; 