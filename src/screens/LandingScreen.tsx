import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const LandingScreen = () => {
  const logoScale = new Animated.Value(1);
  
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulseAnimation).start();
  }, []);

  const renderNavigationButton = (title: string, iconName: string) => (
    <TouchableOpacity style={styles.navButton}>
      <Icon name={iconName} size={24} color="#FFFFFF" />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1a237e', '#000000']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: logoScale }] }]}>
            <View style={{ position: 'relative' }}>
              <Icon name="shield" size={100} color="#4A90E2" style={styles.logoIcon} />
              <Icon name="lock-closed" size={50} color="#FFFFFF" style={{ position: 'absolute', top: 25, left: 25 }} />
            </View>
          </Animated.View>
          <Text style={styles.logoText}>ThreatSense</Text>
          <Text style={styles.tagline}>Securing Your Digital World</Text>
        </View>
        <View style={styles.navigationContainer}>
          {renderNavigationButton('Home', 'home')}
          {renderNavigationButton('Log History', 'time')}
          {renderNavigationButton('Settings', 'settings')}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    padding: 20,
    elevation: 5,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoIcon: {
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
  tagline: {
    color: '#B0BEC5',
    fontSize: 18,
    marginTop: 10,
    fontStyle: 'italic',
  },
  navigationContainer: {
    width: '100%',
    paddingHorizontal: 20,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default LandingScreen; 