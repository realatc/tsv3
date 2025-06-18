import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Animated, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [tosVisible, setTosVisible] = useState(false);
  const logoScale = React.useRef(new Animated.Value(1)).current;

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
  }, [logoScale]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      (navigation as any).navigate('SearchResults', { query: searchQuery.trim() });
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search (e.g. phone, email, sender, etc.)"
              placeholderTextColor="#B0BEC5"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Icon name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* (other home content) */}
        </View>
        <View style={styles.tosContainer}>
          <Text style={styles.tosLink} onPress={() => setTosVisible(true)}>
            Terms of Service
          </Text>
        </View>
        <Modal
          visible={tosVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setTosVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <Text style={styles.modalText}>
                By using this app, you agree to our totally serious Terms of Service: Don't hack the planet, don't feed the trolls, and always use strong passwords. ThreatSense is not responsible for any sudden urges to become a cybersecurity superhero. 🦸‍♂️
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setTosVisible(false)}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, padding: 18 },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tosContainer: { alignItems: 'center', marginBottom: 10, paddingHorizontal: 18 },
  tosLink: { color: '#4A90E2', fontSize: 13, textAlign: 'center', opacity: 0.9, textDecorationLine: 'underline', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(26, 35, 126, 0.98)',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    color: '#B0BEC5',
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen; 