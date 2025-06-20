import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Markdown from 'react-native-markdown-display';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface KnowledgeBaseArticleProps {
  title: string;
  subtitle: string;
  content: string;
  createdDate: string;
  updatedDate: string;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
  yPosition: number;
}

const KnowledgeBaseArticle: React.FC<KnowledgeBaseArticleProps> = ({
  title,
  subtitle,
  content,
  createdDate,
  updatedDate
}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showToc, setShowToc] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<{ index: number; text: string }[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // Parse markdown content to extract headings for TOC
  const parseHeadings = (markdown: string): TocItem[] => {
    const lines = markdown.split('\n');
    const headings: TocItem[] = [];
    let idCounter = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) {
        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const title = trimmedLine.replace(/^#+\s*/, '');
        if (title) {
          headings.push({
            id: `heading-${idCounter++}`,
            title,
            level,
            yPosition: index * 30 // Approximate position
          });
        }
      }
    });

    return headings;
  };

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lines = content.split('\n');
    const results: { index: number; text: string }[] = [];

    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          index,
          text: line.trim().substring(0, 100) + (line.length > 100 ? '...' : '')
        });
      }
    });

    setSearchResults(results);
    setCurrentSearchIndex(0);
  };

  const scrollToSearchResult = (index: number) => {
    scrollViewRef.current?.scrollTo({
      y: index * 30,
      animated: true
    });
  };

  const scrollToTocItem = (yPosition: number) => {
    scrollViewRef.current?.scrollTo({
      y: yPosition,
      animated: true
    });
    setShowToc(false);
  };

  // Initialize TOC items when component mounts
  React.useEffect(() => {
    setTocItems(parseHeadings(content));
  }, [content]);

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with search and TOC buttons */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => setShowSearch(!showSearch)}
              >
                <Icon name="search" size={24} color="#9C27B0" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => setShowToc(!showToc)}
              >
                <Icon name="list" size={24} color="#9C27B0" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>Created: {createdDate}</Text>
            <Text style={styles.metaText}>Updated: {updatedDate}</Text>
          </View>
        </View>

        {/* Search bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search in article..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                performSearch(text);
              }}
            />
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                <Text style={styles.searchResultsHeader}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </Text>
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchResultItem}
                    onPress={() => scrollToSearchResult(result.index)}
                  >
                    <Text style={styles.searchResultText}>{result.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Table of Contents Modal */}
        <Modal
          visible={showToc}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowToc(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.tocModal}>
              <View style={styles.tocHeader}>
                <Text style={styles.tocTitle}>Table of Contents</Text>
                <TouchableOpacity onPress={() => setShowToc(false)}>
                  <Icon name="close" size={24} color="#9C27B0" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tocItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.tocItem, { paddingLeft: (item.level - 1) * 20 }]}
                    onPress={() => scrollToTocItem(item.yPosition)}
                  >
                    <Text style={styles.tocItemText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Main content */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Markdown style={markdownStyles}>
              {content}
            </Markdown>
          </View>
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
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: '#9C27B0',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 16,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    color: '#90CAF9',
    fontSize: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchResults: {
    marginTop: 8,
  },
  searchResultsHeader: {
    color: '#9C27B0',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchResultItem: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    marginBottom: 4,
  },
  searchResultText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  tocModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  tocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tocTitle: {
    color: '#9C27B0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tocItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tocItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
});

const markdownStyles = {
  body: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: '#9C27B0',
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginTop: 20,
    marginBottom: 10,
  },
  heading2: {
    color: '#9C27B0',
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginTop: 18,
    marginBottom: 8,
  },
  heading3: {
    color: '#9C27B0',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 12,
  },
  strong: {
    color: '#4A90E2',
    fontWeight: 'bold' as const,
  },
  em: {
    fontStyle: 'italic' as const,
    color: '#B0BEC5',
  },
  list_item: {
    marginBottom: 6,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  code_block: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 4,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
    paddingLeft: 12,
    marginVertical: 8,
    fontStyle: 'italic' as const,
  },
};

export default KnowledgeBaseArticle; 