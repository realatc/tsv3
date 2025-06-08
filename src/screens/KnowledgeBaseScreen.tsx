import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const articles = [
  {
    title: 'How Threat Levels Are Calculated',
    screen: 'KnowledgeBaseThreatLevelArticle',
    description: 'Learn how the app determines the risk of each log.'
  },
  // Add more articles here as you expand the knowledge base
];

const KnowledgeBaseScreen = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Knowledge Base</Text>
          {articles.map(article => (
            <TouchableOpacity
              key={article.title}
              style={styles.articleCard}
              onPress={() => navigation.navigate(article.screen)}
            >
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDescription}>{article.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  articleCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  articleTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  articleDescription: {
    color: '#B0BEC5',
    fontSize: 15,
    lineHeight: 22,
  },
});

export default KnowledgeBaseScreen; 