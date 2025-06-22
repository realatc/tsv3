import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { threatCategoryDetails } from '../utils/threatCategories';

interface KnowledgeBaseArticleProps {
  title: string;
  subtitle: string;
  content: string;
}

const KnowledgeBaseArticle: React.FC<KnowledgeBaseArticleProps> = ({ title, subtitle, content }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [tocItems, setTocItems] = useState<{ title: string; level: number; index: number }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const lineLayouts = useRef<{ [key: number]: number }>({}).current;

  // Approximate line height for calculations
  const LINE_HEIGHT = 24;
  const HEADER_HEIGHT = 80;

  useEffect(() => {
    const lines = content.split('\n');
    const items: { title: string; level: number; index: number }[] = [];
    lines.forEach((line, index) => {
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const heading = line.replace(/^#+\s*/, '').trim();
        if (heading) {
          items.push({ title: heading, level, index });
        }
      }
    });
    setTocItems(items);
  }, [content]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }
    const lines = content.split('\n');
    const results = lines
      .map((line, index) => (line.toLowerCase().includes(query.toLowerCase()) ? index : -1))
      .filter(index => index !== -1);
    setSearchResults(results);
    setCurrentSearchIndex(0);
    if (results.length > 0) {
      scrollToLine(results[0]);
    }
  };

  const navigateToSearchResult = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    setCurrentSearchIndex(newIndex);
    scrollToLine(searchResults[newIndex]);
  };

  const scrollToLine = (lineIndex: number) => {
    if (scrollViewRef.current && lineLayouts[lineIndex] !== undefined) {
      const yPosition = lineLayouts[lineIndex];
      scrollViewRef.current.scrollTo({ y: Math.max(0, yPosition - HEADER_HEIGHT), animated: true });
    }
  };

  const scrollToTOCItem = (index: number) => {
    scrollToLine(index);
    setShowTOC(false);
  };

  const renderStyledText = (text: string, style: any) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **bolded** text
    return (
      <Text style={style}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={index} style={{ fontWeight: 'bold' }}>
                {part.slice(2, -2)}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  const ThreatCategoriesSection = () => (
    <View style={{ marginTop: 10 }}>
      {Object.entries(threatCategoryDetails).map(([name, details]) => {
        if (name === 'Default') return null;
        return (
          <View key={name} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name={details.icon} size={24} color={details.color} />
              <Text style={[styles.h3, { marginLeft: 10, marginTop: 0, marginBottom: 0 }]}>{name}</Text>
            </View>
            <Text style={[styles.contentLine, { marginLeft: 34 }]}>{details.description}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderContent = () => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const isSearchResult = searchResults.includes(index);
      const isCurrentSearchResult = searchResults[currentSearchIndex] === index;
      const style: any[] = [styles.contentLine];
      if (isSearchResult) style.push(styles.searchResult);
      if (isCurrentSearchResult) style.push(styles.currentSearchResult);

      const getLineContent = () => {
        if (line.trim() === '::threat_categories::') {
          return <ThreatCategoriesSection />;
        }
        if (line.startsWith('# '))
          return renderStyledText(line.replace('# ', ''), [...style, styles.h1]);
        if (line.startsWith('## '))
          return renderStyledText(line.replace('## ', ''), [...style, styles.h2]);
        if (line.startsWith('### '))
          return renderStyledText(line.replace('### ', ''), [...style, styles.h3]);
        if (line.startsWith('- '))
          return (
            <View style={{ flexDirection: 'row' }}>
              <Text style={[...style, styles.bulletPoint]}>• </Text>
              {renderStyledText(line.replace('- ', ''), style)}
            </View>
          );
        if (line.trim() === '') return <View style={styles.emptyLine} />;
        return renderStyledText(line, style);
      };

      return (
        <View 
          key={index}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            lineLayouts[index] = y;
          }}
        >
          {getLineContent()}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowSearch(true)} style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTOC(true)} style={styles.headerButton}>
            <Ionicons name="list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search content..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                performSearch(text);
              }}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); setCurrentSearchIndex(0); }}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          {searchQuery.length > 0 && (
            <View style={styles.searchResults}>
              <Text style={styles.searchCount}>
                {searchResults.length > 0 ? `${currentSearchIndex + 1} of ${searchResults.length}` : 'No results'}
              </Text>
              <View style={styles.searchNav}>
                <TouchableOpacity onPress={() => navigateToSearchResult('prev')} disabled={searchResults.length === 0} style={styles.searchButton}>
                  <Ionicons name="arrow-up" size={22} color={searchResults.length > 0 ? '#fff' : '#555'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToSearchResult('next')} disabled={searchResults.length === 0} style={styles.searchButton}>
                  <Ionicons name="arrow-down" size={22} color={searchResults.length > 0 ? '#fff' : '#555'} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      <ScrollView ref={scrollViewRef} style={styles.contentScrollView}>
        {renderContent()}
      </ScrollView>

      {/* Search Modal - Small overlay at top */}
      <Modal visible={false} transparent animationType="fade">
        <View style={styles.searchModalOverlay}>
          <View style={styles.searchModal}>
            <View style={styles.searchModalHeader}>
              <Text style={styles.searchModalTitle}>Search</Text>
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search content..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={text => {
                  setSearchQuery(text);
                  performSearch(text);
                }}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); setCurrentSearchIndex(0); }}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            {searchQuery.length > 0 && (
              <View style={styles.searchResults}>
                <View style={styles.searchNav}>
                  <TouchableOpacity onPress={() => navigateToSearchResult('prev')} disabled={searchResults.length === 0} style={styles.searchButton}>
                    <Ionicons name="arrow-up" size={22} color={searchResults.length > 0 ? '#fff' : '#555'} />
                  </TouchableOpacity>
                  <Text style={styles.searchCount}>
                    {searchResults.length > 0 ? `${currentSearchIndex + 1} of ${searchResults.length}` : 'No results'}
                  </Text>
                  <TouchableOpacity onPress={() => navigateToSearchResult('next')} disabled={searchResults.length === 0} style={styles.searchButton}>
                    <Ionicons name="arrow-down" size={22} color={searchResults.length > 0 ? '#fff' : '#555'} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* TOC Modal */}
      <Modal visible={showTOC} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.tocModal}>
            <View style={styles.tocModalHeader}>
              <Text style={styles.tocModalTitle}>Table of Contents</Text>
              <TouchableOpacity onPress={() => setShowTOC(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.tocList}>
              {tocItems.map(item => (
                <TouchableOpacity 
                  key={item.index} 
                  style={[styles.tocItem, { paddingLeft: (item.level - 1) * 20 + 10 }]} 
                  onPress={() => scrollToTOCItem(item.index)}
                >
                  <Text style={styles.tocItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  header: { 
    padding: 15, 
    paddingTop: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333', 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backButton: { 
    marginRight: 15 
  },
  headerTitleContainer: { 
    flex: 1 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#aaa', 
    marginTop: 2 
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  contentScrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentLine: { 
    fontSize: 16, 
    color: '#ddd', 
    lineHeight: 24 
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E5E5E7',
    marginBottom: 15,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E5E5E7',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E5E5E7',
    marginTop: 15,
    marginBottom: 5,
    lineHeight: 24,
  },
  bulletPoint: { 
    marginLeft: 10, 
    lineHeight: 24, 
    color: '#ddd' 
  },
  emptyLine: { 
    height: 10 
  },
  searchResult: { 
    backgroundColor: 'rgba(255, 255, 0, 0.3)', 
    borderRadius: 3 
  },
  currentSearchResult: { 
    backgroundColor: 'rgba(255, 255, 0, 0.6)' 
  },
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  searchModal: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginHorizontal: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  searchModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    height: 40,
  },
  searchResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  searchNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchCount: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  searchButton: {
    padding: 5,
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  tocModal: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  tocModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  tocModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tocList: {
    maxHeight: 400,
  },
  tocItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tocItemText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default KnowledgeBaseArticle; 