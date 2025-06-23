import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLogs } from '../context/LogContext';
import { useApp } from '../context/AppContext';
import { analyzeText, getRelatedThreatIntel, RelatedIntel } from '../services/perplexity/perplexityService';
import { getThreatColor, getThreatIcon } from '../utils/threatLevel';
import { CategoryBadge } from '../components/CategoryBadge';
import { ThreatBadgeCompact } from '../components/ThreatBadge';
import { AccessibleText } from '../components/AccessibleText';
import type { LogEntry } from '../context/LogContext';

type SearchResult = {
  type: 'log' | 'knowledge' | 'sender';
  data: any;
  relevance: number;
};

const SearchResultsScreen = () => {
  const navigation = useNavigation();
  const { logs } = useLogs();
  const { settingsSheetRef } = useApp();
  
  // General search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Text analyzer state
  const [analyzerText, setAnalyzerText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [relatedIntel, setRelatedIntel] = useState<RelatedIntel[]>([]);
  const [isFetchingIntel, setIsFetchingIntel] = useState(false);

  const handleGeneralSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    
    // Search logs
    logs.forEach((log) => {
      let relevance = 0;
      if (log.sender.toLowerCase().includes(query)) relevance += 3;
      if (log.message.toLowerCase().includes(query)) relevance += 2;
      if (log.category.toLowerCase().includes(query)) relevance += 1;
      if (log.nlpAnalysis?.toLowerCase().includes(query)) relevance += 1;
      
      if (relevance > 0) {
        results.push({
          type: 'log',
          data: log,
          relevance
        });
      }
    });
    
    // Search knowledge base (placeholder for now)
    if (query.includes('scam') || query.includes('threat') || query.includes('security')) {
      results.push({
        type: 'knowledge',
        data: { title: 'Common Digital Scams', screen: 'KnowledgeBaseScamsArticle' },
        relevance: 2
      });
    }
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleTextAnalysis = async () => {
    if (!analyzerText.trim()) return;
    
    Keyboard.dismiss();
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setRelatedIntel([]);
    
    try {
      const result = await analyzeText(analyzerText);
      setAnalysisResult(result);
      
      if (result) {
        setIsFetchingIntel(true);
        const intelResults = await getRelatedThreatIntel(result.summary);
        setRelatedIntel(intelResults);
        setIsFetchingIntel(false);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({
        threatLevel: 'unknown',
        summary: 'An error occurred during analysis.',
        recommendation: 'Please try again later.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'log') {
      const log = item.data as LogEntry;
      let threat: { level: 'High' | 'Medium' | 'Low'; score?: number };
      if (typeof log.threat === 'object' && log.threat.level) {
        threat = log.threat as { level: 'High' | 'Medium' | 'Low'; score?: number };
      } else {
        const threatLevel = typeof log.threat === 'string' && log.threat ? log.threat : 'Low';
        threat = { level: threatLevel as 'High' | 'Medium' | 'Low', score: undefined };
      }
      
      return (
        <TouchableOpacity
          style={styles.searchResultCard}
          onPress={() => (navigation as any).navigate('LogDetail', { log })}
        >
          <View style={styles.searchResultHeader}>
            <View style={styles.searchResultLeft}>
              <Text style={styles.searchResultDate}>{log.date}</Text>
              <Text style={styles.searchResultSender}>{log.sender}</Text>
            </View>
            <View style={styles.searchResultRight}>
              <CategoryBadge category={log.category} />
              <ThreatBadgeCompact level={threat.level} score={threat.score} />
            </View>
          </View>
          <Text style={styles.searchResultMessage} numberOfLines={2}>{log.message}</Text>
        </TouchableOpacity>
      );
    }
    
    if (item.type === 'knowledge') {
      return (
        <TouchableOpacity
          style={styles.searchResultCard}
          onPress={() => (navigation as any).navigate(item.data.screen)}
        >
          <View style={styles.searchResultHeader}>
            <Icon name="document-text-outline" size={20} color="#4A90E2" />
            <Text style={styles.searchResultTitle}>{item.data.title}</Text>
          </View>
          <Text style={styles.searchResultSubtitle}>Knowledge Base Article</Text>
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  const renderAnalysisResult = () => {
    if (isAnalyzing) {
      return (
        <View style={styles.analysisLoading}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.analysisLoadingText}>Analyzing text for threats...</Text>
        </View>
      );
    }
    
    if (!analysisResult) {
      return (
        <View style={styles.analysisPlaceholder}>
          <Icon name="chatbox-ellipses-outline" size={60} color="#444" />
          <Text style={styles.analysisPlaceholderText}>
            Enter text above and tap 'Analyze' to check for threats
          </Text>
        </View>
      );
    }
    
    return (
      <View style={[styles.analysisResultCard, { borderColor: getThreatColor(analysisResult.threatLevel) }]}>
        <View style={styles.analysisResultHeader}>
          <Icon 
            name={getThreatIcon(analysisResult.threatLevel)} 
            size={24} 
            color={getThreatColor(analysisResult.threatLevel)} 
          />
          <Text style={[styles.analysisResultTitle, { color: getThreatColor(analysisResult.threatLevel) }]}>
            {analysisResult.threatLevel.toUpperCase()} THREAT
          </Text>
        </View>
        
        <View style={styles.analysisSection}>
          <Text style={styles.analysisSectionTitle}>Summary</Text>
          <Text style={styles.analysisSectionContent}>{analysisResult.summary}</Text>
        </View>
        
        <View style={styles.analysisSection}>
          <Text style={styles.analysisSectionTitle}>Recommendation</Text>
          <Text style={styles.analysisSectionContent}>{analysisResult.recommendation}</Text>
        </View>
      </View>
    );
  };

  const searchTools = [
    {
      title: 'Live Text Analyzer',
      subtitle: 'Analyze any text for potential threats',
      icon: 'shield-checkmark-outline',
      color: '#4A90E2',
      screen: 'ThreatAnalysis'
    },
    // Future tools can be added here
  ];

  const renderSearchTool = ({ item }: { item: typeof searchTools[0] }) => (
    <TouchableOpacity
      style={styles.searchToolCard}
      onPress={() => (navigation as any).navigate(item.screen)}
    >
      <View style={styles.searchToolHeader}>
        <View style={[styles.searchToolIconContainer, { backgroundColor: `${item.color}20` }]}>
          <Icon name={item.icon} size={28} color={item.color} />
        </View>
        <View style={styles.searchToolContent}>
          <Text style={styles.searchToolTitle}>{item.title}</Text>
          <Text style={styles.searchToolSubtitle}>{item.subtitle}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={22} color="#555" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.pageTitle}>Search</Text>
              <TouchableOpacity
                onPress={() => settingsSheetRef.current?.expand()}
                style={styles.profileButton}
              >
                <Icon name="person-circle-outline" size={34} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* General Search Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Everything</Text>
              <Text style={styles.sectionSubtitle}>Search logs, articles, and more</Text>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search logs, senders, articles..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleGeneralSearch}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  style={[styles.searchButton, !searchQuery.trim() && styles.searchButtonDisabled]}
                  onPress={handleGeneralSearch}
                  disabled={!searchQuery.trim()}
                >
                  <Icon name="search" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {isSearching && (
                <View style={styles.searchLoading}>
                  <ActivityIndicator size="small" color="#4A90E2" />
                  <Text style={styles.searchLoadingText}>Searching...</Text>
                </View>
              )}
              
              {searchResults.length > 0 && (
                <View style={styles.searchResultsContainer}>
                  <Text style={styles.searchResultsTitle}>
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </Text>
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item, index) => `${item.type}-${index}`}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
            </View>

            {/* Search Tools Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Tools</Text>
              <Text style={styles.sectionSubtitle}>Specialized search and analysis tools</Text>
              
              <View style={styles.searchToolsContainer}>
                {searchTools.map((tool, index) => renderSearchTool({ item: tool }))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 5,
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
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  searchButtonDisabled: {
    backgroundColor: '#333',
  },
  searchLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  searchLoadingText: {
    color: '#666',
    marginLeft: 10,
    fontSize: 14,
  },
  searchResultsContainer: {
    marginHorizontal: 20,
  },
  searchResultsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  searchResultCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  searchResultLeft: {
    flex: 1,
  },
  searchResultDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  searchResultSender: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultRight: {
    flexDirection: 'row',
    gap: 8,
  },
  searchResultMessage: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  searchResultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchResultSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  searchToolsContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  searchToolCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  searchToolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchToolIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  searchToolContent: {
    flex: 1,
  },
  searchToolTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchToolSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  analysisLoading: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analysisLoadingText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  analysisPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analysisPlaceholderText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  analysisResultCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
  },
  analysisResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  analysisResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisSection: {
    marginBottom: 15,
  },
  analysisSectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  analysisSectionContent: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SearchResultsScreen; 