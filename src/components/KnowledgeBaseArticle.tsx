import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Animated,
  Easing,
  TextInput,
  findNodeHandle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Markdown, {
  ASTNode,
  RenderRules,
  MarkdownIt,
  tokensToAST,
  stringToTokens,
} from 'react-native-markdown-display';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { ThreatCategoryBadge } from './ThreatCategoryBadge';

// Interfaces
interface KnowledgeBaseArticleProps {
  title: string;
  subtitle: string;
  content: string;
  createdDate: string;
  updatedDate: string;
}

interface TocItem {
  key: string;
  title: string;
  level: number;
}

// Dimensions
const { width } = Dimensions.get('window');

const KnowledgeBaseArticle: React.FC<KnowledgeBaseArticleProps> = ({
  title,
  subtitle,
  content,
  createdDate,
  updatedDate,
}) => {
  const navigation = useNavigation();
  const [isTocVisible, setTocVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [headingLayouts, setHeadingLayouts] = useState<{ [key: string]: number }>({});

  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const headingRefs = useRef<{ [key: string]: View | null }>({}).current;
  const searchResultRefs = useRef<(Text | null)[]>([]);

  // --- Theme and Styles ---
  const isDark = true; // Forcing dark theme
  const styles = useMemo(() => createStyles(isDark), [isDark]);
  const markdownStyles = useMemo(() => createMarkdownStyles(isDark), [isDark]);
  
  // --- AST Parsing and TOC Extraction ---
  const markdownItInstance = useMemo(() => MarkdownIt({ typographer: true }), []);
  const ast = useMemo(() => tokensToAST(stringToTokens(content, markdownItInstance)), [content, markdownItInstance]);

  useEffect(() => {
    const extractedTocItems: TocItem[] = [];
    const extractTextContent = (node: ASTNode): string => {
      if (Array.isArray(node.children) && node.children.length > 0) {
        return node.children.map(extractTextContent).join('');
      }
      if (typeof node.content === 'string') {
        return node.content;
      }
      return '';
    };
    
    function traverse(nodes: ASTNode[]) {
      nodes.forEach(node => {
        if (node.type.startsWith('heading')) {
          const title = extractTextContent(node);
          const level = parseInt(node.type.replace('heading', ''), 10);
          if (title && !isNaN(level)) {
            extractedTocItems.push({
              key: node.key,
              title: title,
              level: level,
            });
          }
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    }
    traverse(ast);
    setTocItems(extractedTocItems);
  }, [ast]);
  
  // --- Search Logic ---
  const searchResultsCount = useMemo(() => {
    if (!searchTerm.trim()) return 0;
    searchResultRefs.current = [];
    let count = 0;
    const regex = new RegExp(`(${searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    function countMatches(nodes: ASTNode[]) {
      nodes.forEach(node => {
        if (node.type === 'text' && node.content) {
          const matches = node.content.match(regex);
          if (matches) {
            count += matches.length;
          }
        }
        if (node.children) {
          countMatches(node.children);
        }
      });
    }
    countMatches(ast);
    return count;
  }, [ast, searchTerm]);
  
  useEffect(() => {
    setCurrentResultIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (!isSearchVisible || searchResultsCount === 0 || !searchResultRefs.current[currentResultIndex]) return;

    const node = searchResultRefs.current[currentResultIndex];
    const scrollViewNode = findNodeHandle(scrollViewRef.current);

    if (node && scrollViewNode) {
      const timer = setTimeout(() => {
        node.measureLayout(
          scrollViewNode,
          (x, y) => scrollViewRef.current?.scrollTo({ y: y - 100, animated: true }),
          () => {}
        );
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentResultIndex, isSearchVisible, searchResultsCount]);

  // --- Handlers ---
  const showToc = () => {
    setTocVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
  };

  const hideToc = () => {
    Animated.timing(slideAnim, { toValue: -width * 0.75, duration: 300, useNativeDriver: true, easing: Easing.in(Easing.ease) }).start(() => setTocVisible(false));
  };

  const onTocPress = (key: string) => {
    console.log(`[TOC Press] Touched item with key: ${key}`);
    const y = headingLayouts[key];

    if (y !== undefined) {
      console.log(`[TOC Press] Scrolling to y=${y} for key: ${key}`);
      scrollViewRef.current?.scrollTo({ y, animated: true });
      hideToc();
      return;
    }
    
    console.warn(`[TOC Press] Layout for key ${key} not found. Trying measureLayout fallback.`);
    const node = headingRefs[key];
    const scrollViewNode = findNodeHandle(scrollViewRef.current);

    if (node && scrollViewNode) {
      node.measureLayout(
        scrollViewNode,
        (x, y) => {
          console.log(`[TOC Press] Measured layout for ${key}: x=${x}, y=${y}. Scrolling...`);
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        () => {
          console.error(`[TOC Press] Failed to measure layout for TOC key: ${key}`);
        }
      );
    } else {
      console.warn(`[TOC Press] Could not find node or scrollView for key: ${key}`);
    }
    hideToc();
  };

  const handleSearchNav = (direction: 'next' | 'prev') => {
    if (searchResultsCount === 0) return;
    setCurrentResultIndex(prevIndex => {
      const newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;
      return (newIndex + searchResultsCount) % searchResultsCount;
    });
  };
  
  // --- Render Rules ---
  const rules = useMemo<RenderRules>(() => {
    let currentMatchIndex = -1;
    
    return {
      heading1: (node, children) => (
        <View 
          key={node.key}
          ref={ref => {headingRefs[node.key] = ref}}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setHeadingLayouts(prev => ({ ...prev, [node.key]: layout.y }));
          }}
        >
          <Text style={markdownStyles.heading1}>{children}</Text>
        </View>
      ),
      heading2: (node, children) => (
        <View 
          key={node.key} 
          ref={ref => {headingRefs[node.key] = ref}}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setHeadingLayouts(prev => ({ ...prev, [node.key]: layout.y }));
          }}
        >
          <Text style={markdownStyles.heading2}>{children}</Text>
        </View>
      ),
      heading3: (node, children) => (
        <View
          key={node.key}
          ref={ref => {headingRefs[node.key] = ref}}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setHeadingLayouts(prev => ({...prev, [node.key]: layout.y}));
          }}>
          <Text style={markdownStyles.heading3}>{children}</Text>
        </View>
      ),
      heading4: (node, children) => (
        <View
          key={node.key}
          ref={ref => {headingRefs[node.key] = ref}}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setHeadingLayouts(prev => ({...prev, [node.key]: layout.y}));
          }}>
          <Text style={markdownStyles.heading4}>{children}</Text>
        </View>
      ),
      heading5: (node, children) => (
        <View
          key={node.key}
          ref={ref => {headingRefs[node.key] = ref}}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setHeadingLayouts(prev => ({...prev, [node.key]: layout.y}));
          }}>
          <Text style={markdownStyles.heading5}>{children}</Text>
        </View>
      ),
      heading6: (node, children) => (
        <View
          key={node.key}
          ref={ref => {headingRefs[node.key] = ref}}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setHeadingLayouts(prev => ({...prev, [node.key]: layout.y}));
          }}>
          <Text style={markdownStyles.heading6}>{children}</Text>
        </View>
      ),
      text: (node) => {
        if (!searchTerm.trim()) {
          return <Text key={node.key} style={markdownStyles.body}>{node.content}</Text>;
        }
        const regex = new RegExp(`(${searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = node.content.split(regex);
        
        return (
          <Text key={node.key} style={markdownStyles.body}>
            {parts.map((part, index) => {
              if (part.toLowerCase() === searchTerm.toLowerCase()) {
                currentMatchIndex++;
                const isCurrent = currentMatchIndex === currentResultIndex;
                const refIndex = currentMatchIndex;
                return (
                  <Text
                    key={`${node.key}-${index}`}
                    ref={ref => {searchResultRefs.current[refIndex] = ref}}
                    style={isCurrent ? markdownStyles.searchHighlightCurrent : markdownStyles.searchHighlight}
                  >
                    {part}
                  </Text>
                );
              }
              return <Text key={`${node.key}-${index}`}>{part}</Text>;
            })}
          </Text>
        );
      },
      image: (node) => {
        const { src } = node.attributes;
        if (src?.startsWith('threat://')) {
          return <View key={node.key} style={{ width: 42, marginRight: 8, marginTop: 4 }}><ThreatCategoryBadge category={src.replace('threat://', '')} /></View>;
        }
        return null;
      },
      code_inline: (node) => <Text key={node.key} style={markdownStyles.code_inline}>{node.content}</Text>,
      fence: (node) => <View key={node.key} style={markdownStyles.fence}><Text style={markdownStyles.code_inline}>{node.content}</Text></View>,
    };
  }, [searchTerm, currentResultIndex, markdownStyles]);

  return (
    <LinearGradient colors={isDark ? ['#1a1a1a', '#0a0a0a'] : ['#F5F5F5', '#EAEAEA']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
           <View style={styles.headerTopRow}>
             <TouchableOpacity style={styles.backButton} onPress={() => isSearchVisible ? setSearchVisible(false) : navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={styles.headerIcon.color} />
            </TouchableOpacity>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => setSearchVisible(!isSearchVisible)}>
                <Icon name={isSearchVisible ? 'close' : 'search'} size={24} color={styles.headerIcon.color} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={showToc}>
                <Icon name="list" size={24} color={styles.headerIcon.color} />
              </TouchableOpacity>
            </View>
          </View>
          {isSearchVisible && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search article..."
                placeholderTextColor={(styles.searchInput as TextStyle).color}
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoFocus
              />
              {searchTerm.trim() && (
                <View style={styles.searchNavContainer}>
                  <Text style={styles.searchNavText}>
                    {searchResultsCount > 0 ? `${(currentResultIndex % searchResultsCount) + 1} of ${searchResultsCount}` : 'No results'}
                  </Text>
                   <TouchableOpacity onPress={() => handleSearchNav('prev')} disabled={searchResultsCount === 0}>
                    <Icon name="keyboard-arrow-up" size={24} color={searchResultsCount > 0 ? styles.searchNavText.color : '#555'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSearchNav('next')} disabled={searchResultsCount === 0}>
                    <Icon name="keyboard-arrow-down" size={24} color={searchResultsCount > 0 ? styles.searchNavText.color : '#555'} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Scrollable Content */}
        <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>Created: {createdDate}</Text>
            <Text style={styles.metaText}>Updated: {updatedDate}</Text>
          </View>
          <Markdown style={markdownStyles} rules={rules}>
            {ast as any}
          </Markdown>
        </ScrollView>
        
        {/* TOC Modal */}
        {isTocVisible && (
            <Modal transparent visible={isTocVisible} onRequestClose={hideToc} animationType="none">
                 <TouchableOpacity style={StyleSheet.absoluteFill} onPress={hideToc} activeOpacity={1}>
                    <Animated.View style={[styles.tocContainer, { transform: [{ translateX: slideAnim }] }]}>
                        <Text style={styles.tocTitle}>Table of Contents</Text>
                        <FlatList
                            data={tocItems}
                            keyExtractor={(item) => item.key}
                            renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onTocPress(item.key)} style={[styles.tocItem, { marginLeft: (item.level - 1) * 15 }]}>
                                <Text style={styles.tocText}>{item.title}</Text>
                            </TouchableOpacity>
                            )}
                        />
                    </Animated.View>
                 </TouchableOpacity>
            </Modal>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- Styles ---

const getColors = (isDark: boolean) => ({
    background: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#E0E0E0' : '#121212',
    subtleText: isDark ? '#B0B0B0' : '#555555',
    primary: '#9C27B0',
    card: isDark ? '#1a1a1a' : '#F5F5F5',
    border: isDark ? '#2a2a2a' : '#EAEAEA',
    highlight: '#FFD700',
    highlightText: '#000000',
});

const createMarkdownStyles = (isDark: boolean) => {
    const colors = getColors(isDark);
    return {
        heading1: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginTop: 24, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.primary, paddingBottom: 8 } as TextStyle,
        heading2: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 10 } as TextStyle,
        heading3: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 8 } as TextStyle,
        heading4: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 12, marginBottom: 6 } as TextStyle,
        heading5: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginTop: 8, marginBottom: 4 } as TextStyle,
        heading6: { fontSize: 12, fontWeight: 'bold', color: colors.text, marginTop: 4, marginBottom: 2 } as TextStyle,
        code_inline: { backgroundColor: colors.border, color: colors.subtleText, fontFamily: 'monospace', paddingVertical: 2, paddingHorizontal: 4, borderRadius: 4, overflow: 'hidden' } as TextStyle,
        fence: { backgroundColor: colors.border, padding: 15, borderRadius: 4, marginVertical: 10 } as ViewStyle,
        searchHighlight: { backgroundColor: colors.primary, color: colors.highlightText } as TextStyle,
        searchHighlightCurrent: { backgroundColor: colors.highlight, color: colors.highlightText, borderRadius: 3, overflow: 'hidden' } as TextStyle,
        
        body: { color: colors.text, fontSize: 16, lineHeight: 26 } as TextStyle,
        bullet_list: { marginBottom: 16 } as ViewStyle,
        ordered_list: { marginBottom: 16 } as ViewStyle,
        list_item: { flexDirection: 'row' as 'row', alignItems: 'flex-start' as 'flex-start', marginBottom: 8 } as ViewStyle,
        bullet_list_icon: { color: colors.primary, marginRight: 8, fontSize: 16, lineHeight: 24 } as TextStyle,
        list_item_text: { color: colors.text, fontSize: 16, lineHeight: 24, flex: 1 } as TextStyle,
        strong: { fontWeight: 'bold' as 'bold', color: colors.text } as TextStyle,
        em: { fontStyle: 'italic' as 'italic' } as TextStyle,
        link: { color: colors.primary, textDecorationLine: 'underline' as 'underline' } as TextStyle,
        hr: { backgroundColor: colors.border, height: 1, marginVertical: 16 } as ViewStyle,
        blockquote: { backgroundColor: colors.card, padding: 10, marginVertical: 10, borderLeftColor: colors.primary, borderLeftWidth: 3 } as ViewStyle,
    };
}


const createStyles = (isDark: boolean) => {
    const colors = getColors(isDark);

    return StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: 'transparent' },
        header: { padding: 15, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        backButton: { padding: 5 },
        headerIcon: { color: colors.primary },
        headerButtons: { flexDirection: 'row' },
        headerButton: { paddingHorizontal: 10 },
        searchContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, borderRadius: 8, backgroundColor: colors.border },
        searchInput: { flex: 1, height: 40, paddingHorizontal: 10, color: colors.text },
        searchNavContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
        searchNavText: { color: colors.text, marginHorizontal: 10 },
        scrollView: { flex: 1 },
        contentContainer: { padding: 20 },
        title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 5 },
        subtitle: { fontSize: 18, color: colors.subtleText, marginBottom: 15 },
        metaContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 },
        metaText: { fontSize: 12, color: colors.subtleText },
        
        tocContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, width: width * 0.75, backgroundColor: colors.card, padding: 20, paddingTop: 60, borderRightWidth: 1, borderRightColor: colors.border },
        tocTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
        tocItem: { paddingVertical: 10 },
        tocText: { fontSize: 16, color: colors.text },
    });
};

export default KnowledgeBaseArticle;
