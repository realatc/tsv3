import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useApp } from '../context/AppContext';

type BrowseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Browse'>;

const BrowseScreen = () => {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const { settingsSheetRef } = useApp();

  const menuItems = [
    {
      title: 'Threat Log',
      subtitle: 'Review your past analyses',
      icon: 'shield-checkmark-outline',
      screen: 'LogHistory',
    },
  ];

  const handleOpenSettings = () => {
    if (settingsSheetRef.current) {
      settingsSheetRef.current.snapToIndex(1);
    }
  };

  return (
    <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Browse</Text>
            <TouchableOpacity
              onPress={handleOpenSettings}
              style={styles.profileButton}
              accessibilityLabel="Open Settings"
            >
              <Icon name="person-circle-outline" size={34} color="#fff" style={styles.profileImage} />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerSubtitle}>
            Explore your personal threat data and analysis history.
          </Text>
          
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem} 
                onPress={() => navigation.navigate(item.screen as any)}
              >
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={28} color="#A070F2" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={22} color="#555" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 34,
    height: 34,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: 'rgba(160, 112, 242, 0.15)',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});

export default BrowseScreen; 