import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface NavigationPanelProps {
  currentScreen?: string;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ currentScreen }) => {
  const navigation = useNavigation();

  const navItems = [
    { title: 'Home', icon: 'home', screen: 'Home' },
    { title: 'Log History', icon: 'time', screen: 'LogHistory' },
  ];

  const handleNavigation = (screen: string) => {
    // @ts-ignore - navigation type will be properly set up when we add navigation
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={[
            styles.navButton,
            currentScreen === item.screen && styles.activeNavButton,
          ]}
          onPress={() => handleNavigation(item.screen)}>
          <Icon
            name={item.icon}
            size={24}
            color={currentScreen === item.screen ? '#4A90E2' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.buttonText,
              currentScreen === item.screen && styles.activeButtonText,
            ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeNavButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
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
});

export default NavigationPanel; 