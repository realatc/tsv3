import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  index: number;
}

interface ArticleContent {
  [key: string]: {
    title: string;
    content: string;
  };
}

interface KnowledgeBaseArticleTemplateProps {
  pageTitle: string;
  articleTitle: string;
  IconComponent: React.ReactNode;
  tableOfContents: TableOfContentsItem[];
  articleContent: ArticleContent;
  themeColor: string;
  demoCard?: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const HighlightText = ({ text, highlight, style, highlightStyle }: { text: string, highlight: string, style: any, highlightStyle: any }) => {
  if (!highlight.trim() || !text) {
    return <Text style={style}>{text}</Text>;
  }
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={index} style={highlightStyle}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

const KnowledgeBaseArticleTemplate: React.FC<KnowledgeBaseArticleTemplateProps> = ({
  pageTitle,
  articleTitle,
  IconComponent,
  tableOfContents,
  articleContent,
  themeColor,
  demoCard,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: any }>({});

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();
    const snippetPadding = 40;
    const addedSections = new Set<string>();

    Object.entries(articleContent).forEach(([sectionId, section]) => {
      const combinedText = `${section.title}. ${section.content}`;
      const lowerCombinedText = combinedText.toLowerCase();
      const matchIndex = lowerCombinedText.indexOf(searchTerm);

      if (matchIndex !== -1 && !addedSections.has(sectionId)) {
        const startIndex = Math.max(0, matchIndex - snippetPadding);
        const endIndex = Math.min(combinedText.length, matchIndex + searchTerm.length + snippetPadding);
        let snippet = combinedText.substring(startIndex, endIndex);
        if (startIndex > 0) snippet = '...' + snippet;
        if (endIndex < combinedText.length) snippet = snippet + '...';

        results.push({ sectionId, sectionTitle: section.title, snippet, index: results.length });
        addedSections.add(sectionId);
      }
    });
    setSearchResults(results);
    setCurrentSearchIndex(0);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    performSearch(text);
  };

  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId].measureLayout(
        scrollViewRef.current as any,
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
        },
        () => console.log('Could not measure section position')
      );
    }
    setShowTableOfContents(false);
  }, []);

  const navigateToSearchResult = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    setCurrentSearchIndex(newIndex);
    const result = searchResults[newIndex];
    setHighlightedSection(result.sectionId);
    setTimeout(() => setHighlightedSection(null), 2000);
    scrollToSection(result.sectionId);
  };
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(0);
      setHighlightedSection(null);
    }
  };

  const toggleTableOfContents = () => setShowTableOfContents(!showTableOfContents);

  const getSectionStyle = (sectionId: string) => {
    return highlightedSection === sectionId ? [styles.section, { ...styles.highlightedSection, borderColor: theme.primary, backgroundColor: `${theme.primary}22` }] : styles.section;
  };

  const scrollToSearchResult = (sectionId: string) => {
    if (sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId].measureLayout(
        scrollViewRef.current as any,
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
        },
        () => console.log('Could not measure section position')
      );
    }
    setShowSearch(false);
  };

  return (
    <LinearGradient colors={[theme.background, theme.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{pageTitle}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleSearch} style={styles.headerButton}>
              <Icon name="search" size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTableOfContents} style={styles.headerButton}>
              <Icon name="list" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search article content..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                  <Icon name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                <View style={styles.searchResultsHeader}>
                  <Text style={styles.searchResultsTitle}>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </Text>
                  <View style={styles.searchNavigation}>
                    <TouchableOpacity onPress={() => navigateToSearchResult('prev')} style={styles.navButton}>
                      <Icon name="chevron-up" size={16} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={styles.navText}>
                      {currentSearchIndex + 1} of {searchResults.length}
                    </Text>
                    <TouchableOpacity onPress={() => navigateToSearchResult('next')} style={styles.navButton}>
                      <Icon name="chevron-down" size={16} color={theme.text} />
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView style={styles.searchResultsScroll}>
                  {searchResults.map((result, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.searchResultItem,
                        index === currentSearchIndex && styles.activeSearchResult,
                        index === currentSearchIndex && { borderColor: theme.primary }
                      ]}
                      onPress={() => scrollToSearchResult(result.sectionId)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.searchResultTitleText}>{result.sectionTitle}</Text>
                        <HighlightText
                          text={result.snippet}
                          highlight={searchQuery}
                          style={styles.searchResultSnippet}
                          highlightStyle={styles.searchResultHighlight}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={[styles.iconContainer, { backgroundColor: `${themeColor}1A` }]}>
                {IconComponent}
              </View>
              <Text style={styles.title}>{articleTitle}</Text>
            </View>
            {demoCard}

            {Object.entries(articleContent).map(([id, section]) => (
              <View key={id} style={getSectionStyle(id)} ref={(ref) => { sectionRefs.current[id] = ref; }}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <HighlightText 
                  text={section.content}
                  highlight={searchQuery}
                  style={styles.bodyText}
                  highlightStyle={styles.highlightedWord}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <Modal visible={showTableOfContents} transparent animationType="slide" onRequestClose={toggleTableOfContents}>
          <View style={styles.modalOverlay}>
            <View style={styles.tableOfContentsContainer}>
              <View style={styles.tocHeader}>
                <Text style={styles.tocTitle}>Table of Contents</Text>
                <TouchableOpacity onPress={toggleTableOfContents} style={styles.closeButton}>
                  <Icon name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.tocContent}>
                {tableOfContents.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tocItem, { paddingLeft: 16 + (item.level - 1) * 20 }]}
                    onPress={() => scrollToSection(item.id)}
                  >
                    <Text style={[styles.tocItemText, item.level === 1 ? styles.tocMainItem : styles.tocSubItem]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: theme.text, flex: 1, textAlign: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { padding: 8, marginLeft: 8 },
  searchContainer: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: theme.text, fontSize: 16 },
  clearButton: { padding: 4 },
  searchResults: { marginTop: 15 },
  searchResultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  searchResultsTitle: { fontSize: 14, fontWeight: '600', color: theme.text },
  searchNavigation: { flexDirection: 'row', alignItems: 'center' },
  navButton: { padding: 4, marginHorizontal: 4 },
  navText: { fontSize: 12, marginHorizontal: 8, color: theme.text },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: theme.surface, borderRadius: 8, marginBottom: 8 },
  activeSearchResult: { borderWidth: 1 },
  searchResultTitleText: { color: theme.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  searchResultSnippet: { color: theme.textSecondary, fontSize: 12 },
  searchResultHighlight: { fontWeight: 'bold', color: theme.warning },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  titleSection: { alignItems: 'center', marginBottom: 30 },
  iconContainer: { borderRadius: 20, padding: 20, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.text, textAlign: 'center', lineHeight: 36 },
  section: { marginBottom: 30 },
  highlightedSection: { borderRadius: 8, padding: 10, borderWidth: 1, borderColor: theme.primary },
  highlightedWord: { backgroundColor: theme.warning, color: theme.text },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 15 },
  bodyText: { fontSize: 16, lineHeight: 24, color: theme.text, marginBottom: 15 },
  modalOverlay: { flex: 1, backgroundColor: theme.overlay, justifyContent: 'flex-end' },
  tableOfContentsContainer: { backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  tocHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border },
  tocTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text },
  closeButton: { padding: 4 },
  tocContent: { padding: 20 },
  tocItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  tocItemText: { fontSize: 16, color: theme.text },
  tocMainItem: { fontWeight: '600' },
  tocSubItem: { fontWeight: '400', color: theme.textSecondary },
  searchResultsScroll: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
});

export default KnowledgeBaseArticleTemplate; 