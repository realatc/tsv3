import React, { useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

type LibraryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Library'>;
type NavigableLibraryScreen =
  | 'KnowledgeBaseThreatLevelArticle'
  | 'KnowledgeBaseScamsArticle'
  | 'KnowledgeBaseLogDetailsOverview'
  | 'KnowledgeBaseLogDetailsGeneral'
  | 'KnowledgeBaseLogDetailsSecurity'
  | 'KnowledgeBaseLogDetailsMetadata'
  | 'KnowledgeBaseLogDetailsThreat'
  | 'KnowledgeBaseLiveTextAnalyzer'
  | 'KnowledgeBaseSentryMode';

const LibraryScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<LibraryScreenNavigationProp>();
  const { settingsSheetRef } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    {
      title: 'Live Text Analyzer',
      subtitle: 'How our AI-powered threat detection works',
      icon: 'scan-outline',
      screen: 'KnowledgeBaseLiveTextAnalyzer',
    },
    {
      title: 'Sentry Mode: Emergency Notifications',
      subtitle: 'Learn how Sentry Mode automatically notifies trusted contacts',
      icon: 'shield-checkmark-outline',
      screen: 'KnowledgeBaseSentryMode',
    },
    {
      title: 'How Threat Levels Work',
      subtitle: 'Understand our rating system',
      icon: 'analytics-outline',
      screen: 'KnowledgeBaseThreatLevelArticle',
    },
    {
      title: 'Common Digital Scams',
      subtitle: 'Learn to identify frequent threats',
      icon: 'alert-circle-outline',
      screen: 'KnowledgeBaseScamsArticle',
    },
    {
      title: 'Log Details: Overview',
      subtitle: 'The threat analysis dashboard',
      icon: 'document-text-outline',
      screen: 'KnowledgeBaseLogDetailsOverview',
    },
    {
      title: 'Log Details: General',
      subtitle: 'Essential facts about a threat',
      icon: 'information-circle-outline',
      screen: 'KnowledgeBaseLogDetailsGeneral',
    },
    {
      title: 'Log Details: Security',
      subtitle: 'Technical analysis results',
      icon: 'shield-checkmark-outline',
      screen: 'KnowledgeBaseLogDetailsSecurity',
    },
    {
      title: 'Log Details: Metadata',
      subtitle: 'Context and detection details',
      icon: 'code-slash-outline',
      screen: 'KnowledgeBaseLogDetailsMetadata',
    },
    {
      title: 'Log Details: Threat',
      subtitle: 'Overall risk assessment',
      icon: 'warning-outline',
      screen: 'KnowledgeBaseLogDetailsThreat',
    },
  ];

  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems;
    }
    
    const query = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  const handlePress = (screen: string) => {
    navigation.navigate(screen as any);
  };

  const handleOpenSettings = () => {
    if (settingsSheetRef.current) {
      settingsSheetRef.current.snapToIndex(2);
    }
  };

  return (
    <LinearGradient colors={[theme.background, theme.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Library</Text>
            <TouchableOpacity
              onPress={handleOpenSettings}
              style={styles.profileButton}
              accessibilityLabel="Open Settings"
            >
              <Icon name="person-circle-outline" size={34} color={theme.text} style={styles.profileImage} />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerSubtitle}>
            Your hub for learning about digital security.
          </Text>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon name="search-outline" size={20} color={theme.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search articles..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                  accessibilityLabel="Clear search"
                >
                  <Icon name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Results count */}
          {searchQuery.length > 0 && (
            <Text style={styles.resultsCount}>
              {filteredMenuItems.length} result{filteredMenuItems.length !== 1 ? 's' : ''} found
            </Text>
          )}

          {filteredMenuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => handlePress(item.screen as string)}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={28} color={theme.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}

          {/* No results message */}
          {searchQuery.length > 0 && filteredMenuItems.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Icon name="search-outline" size={48} color={theme.textSecondary} />
              <Text style={styles.noResultsText}>No articles found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
    color: theme.text,
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
    color: theme.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: theme.primaryLight,
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
    color: theme.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },
  viewAllButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.primary,
    marginRight: 8,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 5,
  },
  resultsCount: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  noResultsSubtext: {
    color: theme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LibraryScreen; 