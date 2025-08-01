import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type KnowledgeBaseScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type KnowledgeBaseArticle = {
  title: string;
  screen: keyof RootStackParamList;
  description: string;
  icon: string;
  color: string;
  created: string;
  updated: string;
};

const KnowledgeBaseScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<KnowledgeBaseScreenNavigationProp>();
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<null | KnowledgeBaseArticle>(null);

  const articles: KnowledgeBaseArticle[] = [
    {
      title: 'Live Text Analyzer: How It Works',
      screen: 'KnowledgeBaseLiveTextAnalyzer',
      description: 'Complete guide to how the live text analyzer works, its grading system, and data sources.',
      icon: 'scan-outline',
      color: theme.info,
      created: '2024-12-22',
      updated: '2024-12-22',
    },
    {
      title: 'Sentry Mode: Emergency Notifications',
      screen: 'KnowledgeBaseSentryMode',
      description: 'Learn how Sentry Mode automatically notifies trusted contacts when threats are detected.',
      icon: 'shield-checkmark-outline',
      color: theme.primary,
      created: '2024-12-22',
      updated: '2024-12-22',
    },
    {
      title: 'How Threat Levels Are Calculated',
      screen: 'KnowledgeBaseThreatLevelArticle',
      description: 'Learn how the app determines the risk of each log.',
      icon: 'analytics-outline',
      color: theme.primary,
      created: '2024-05-01',
      updated: '2024-06-07',
    },
    {
      title: 'Common Digital Scams',
      screen: 'KnowledgeBaseScamsArticle',
      description: 'Examples and tips for avoiding common digital scams.',
      icon: 'alert-circle-outline',
      color: theme.error,
      created: '2024-06-01',
      updated: '2024-06-07',
    },
    {
      title: 'Understanding the Log Details Screen',
      screen: 'KnowledgeBaseLogDetailsOverview',
      description: 'Complete guide to the Log Details Screen and how all tabs work together.',
      icon: 'document-text-outline',
      color: theme.success,
      created: '2024-12-15',
      updated: '2024-12-15',
    },
    {
      title: 'Log Details: General Tab',
      screen: 'KnowledgeBaseLogDetailsGeneral',
      description: 'Learn about the basic information displayed in the General tab.',
      icon: 'information-circle-outline',
      color: theme.primary,
      created: '2024-12-15',
      updated: '2024-12-15',
    },
    {
      title: 'Log Details: Security Tab',
      screen: 'KnowledgeBaseLogDetailsSecurity',
      description: 'Understanding AI analysis, behavioral patterns, and URL safety checks.',
      icon: 'shield-checkmark-outline',
      color: theme.warning,
      created: '2024-12-15',
      updated: '2024-12-15',
    },
    {
      title: 'Log Details: Metadata Tab',
      screen: 'KnowledgeBaseLogDetailsMetadata',
      description: 'Technical details about threat detection and context information.',
      icon: 'settings-outline',
      color: theme.primary,
      created: '2024-12-15',
      updated: '2024-12-15',
    },
    {
      title: 'Log Details: Threat Tab',
      screen: 'KnowledgeBaseLogDetailsThreat',
      description: 'How threat scoring works and making informed security decisions.',
      icon: 'warning-outline',
      color: theme.error,
      created: '2024-12-15',
      updated: '2024-12-15',
    },
    // Add more articles here as you expand the knowledge base
  ];

  const filteredArticles = articles.filter(
    a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient colors={[theme.background, theme.surface]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Knowledge Base</Text>
          <View style={styles.searchBarRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <View style={styles.grid}>
            {filteredArticles.map(article => (
              <TouchableOpacity
                key={article.title}
                style={styles.articleCard}
                onPress={() => setPreview(article)}
                activeOpacity={0.85}
              >
                <View style={styles.iconRow}>
                  <View style={[styles.iconCircle, { backgroundColor: article.color + '22' }]}> 
                    <Icon name={article.icon} size={28} color={article.color} />
                  </View>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                </View>
                <Text style={styles.articleMeta}>
                  Created: {article.created}  |  Updated: {article.updated}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Modal
            visible={!!preview}
            animationType="fade"
            transparent
            onRequestClose={() => setPreview(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.previewModal}>
                {preview && (
                  <>
                    <View style={styles.iconRow}>
                      <View style={[styles.iconCircle, { backgroundColor: preview.color + '22' }]}> 
                        <Icon name={preview.icon} size={28} color={preview.color} />
                      </View>
                      <Text style={styles.articleTitle}>{preview.title}</Text>
                    </View>
                    <Text style={styles.articleDescription}>{preview.description}</Text>
                    <Text style={styles.articleMeta}>
                      Created: {preview.created}  |  Updated: {preview.updated}
                    </Text>
                    <View style={styles.previewActions}>
                      <TouchableOpacity
                        style={styles.readMoreButton}
                        onPress={() => {
                          if (preview) {
                            navigation.navigate(preview.screen as any);
                            setPreview(null);
                          }
                        }}
                      >
                        <Text style={styles.readMoreText}>Read More</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setPreview(null)}
                      >
                        <Text style={styles.closeText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  title: {
    color: theme.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: theme.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  articleCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    width: '100%',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    marginRight: 0,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  articleTitle: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 18,
    flexShrink: 1,
  },
  articleDescription: {
    color: theme.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginLeft: 2,
    marginBottom: 8,
  },
  articleMeta: {
    color: theme.primaryLight,
    fontSize: 12,
    marginLeft: 2,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModal: {
    backgroundColor: theme.surface,
    borderRadius: 18,
    padding: 28,
    minWidth: 270,
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  previewActions: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
    width: '100%',
  },
  readMoreButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  readMoreText: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  closeText: {
    color: theme.textSecondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default KnowledgeBaseScreen; 