import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrowseStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';

type BrowseScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Browse'>;

const BrowseScreen = () => {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const { settingsSheetRef } = useApp();

  const logViews = [
    { title: 'All Logs', filter: 'All', icon: 'archive-outline' },
    { title: 'High Threats', filter: 'High', icon: 'alert-circle-outline', color: '#FF6B6B' },
    { title: 'Medium Threats', filter: 'Medium', icon: 'alert-outline', color: '#FFD166' },
    { title: 'Safe Messages', filter: 'Low', icon: 'shield-checkmark-outline', color: '#06D6A0' },
  ];
  
  const knowledgeBaseItems = [
    { title: 'Common Scams', screen: 'KnowledgeBaseScamsArticle', icon: 'document-text-outline', color: '#4A90E2' },
    { title: 'Threat Levels Explained', screen: 'KnowledgeBaseThreatLevelArticle', icon: 'analytics-outline', color: '#A070F2' },
    { title: 'Understanding Log Details', screen: 'KnowledgeBaseLogDetailsOverview', icon: 'book-outline', color: '#50E3C2' }
  ];

  const handleOpenSettings = () => {
    settingsSheetRef.current?.expand();
  };

  const renderLogViewCard = ({ item }: { item: typeof logViews[0] }) => (
    <TouchableOpacity 
      style={styles.logCard}
      onPress={() => navigation.navigate('LogHistory', { threatFilter: item.filter !== 'All' ? item.filter : undefined })}
    >
      <Icon name={item.icon} size={28} color={item.color || '#fff'} />
      <Text style={styles.logCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
  
  const renderKnowledgeBaseItem = ({ item }: { item: typeof knowledgeBaseItems[0] }) => (
    <TouchableOpacity
      style={styles.kbItem}
      onPress={() => navigation.navigate(item.screen as any)}
    >
      <View style={[styles.kbIconContainer, { backgroundColor: `${item.color}20` }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.kbItemTitle}>{item.title}</Text>
      <Icon name="chevron-forward-outline" size={22} color="#555" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Browse</Text>
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.profileButton}
            accessibilityLabel="Open Settings"
          >
            <Icon name="person-circle-outline" size={34} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log History</Text>
          <Text style={styles.sectionSubtitle}>Quick access to filtered log views.</Text>
          <FlatList
            horizontal
            data={logViews}
            renderItem={renderLogViewCard}
            keyExtractor={(item) => item.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
            style={{ marginHorizontal: -20 }}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Knowledge Base</Text>
          <Text style={styles.sectionSubtitle}>Learn more about digital threats.</Text>
          <View style={styles.kbContainer}>
            {knowledgeBaseItems.map((item) => renderKnowledgeBaseItem({ item }))}
          </View>
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
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 5
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  logCard: {
    width: 140,
    height: 120,
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  logCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  kbContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  kbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  kbIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  kbItemTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});

export default BrowseScreen; 