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
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type KnowledgeBaseLiveTextAnalyzerNavigationProp = StackNavigationProp<
  RootStackParamList,
  'KnowledgeBaseLiveTextAnalyzer'
>;

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

const KnowledgeBaseLiveTextAnalyzer = () => {
  const navigation = useNavigation<KnowledgeBaseLiveTextAnalyzerNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Section refs for scrolling
  const sectionRefs = useRef<{ [key: string]: any }>({});

  const tableOfContents: TableOfContentsItem[] = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'how-it-works', title: 'How It Works', level: 1 },
    { id: 'text-input', title: 'Text Input Processing', level: 2 },
    { id: 'ai-analysis', title: 'AI-Powered Analysis', level: 2 },
    { id: 'threat-intelligence', title: 'Threat Intelligence Integration', level: 2 },
    { id: 'grading-system', title: 'Threat Level Grading System', level: 1 },
    { id: 'what-it-looks-for', title: 'What the Analyzer Looks For', level: 1 },
    { id: 'red-flags', title: 'Red Flags & Indicators', level: 2 },
    { id: 'technical-analysis', title: 'Technical Analysis', level: 2 },
    { id: 'data-sources', title: 'Data Sources & Privacy', level: 1 },
    { id: 'privacy', title: 'Privacy & Data Handling', level: 2 },
    { id: 'limitations', title: 'Limitations & Considerations', level: 1 },
    { id: 'best-practices', title: 'Best Practices', level: 1 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: 'The Live Text Analyzer is a powerful AI-powered tool that scans text content in real-time to identify potential security threats, scams, and malicious content. It provides instant threat assessments with actionable recommendations to help you stay safe online.'
    },
    'how-it-works': {
      title: 'How It Works',
      content: 'The analyzer processes text through multiple stages of analysis to provide comprehensive threat assessment.'
    },
    'text-input': {
      title: 'Text Input Processing',
      content: 'When you paste text into the analyzer, the system processes your input through advanced natural language processing, analyzes the content for suspicious patterns, keywords, and contextual clues, and uses multiple threat detection algorithms simultaneously.'
    },
    'ai-analysis': {
      title: 'AI-Powered Analysis',
      content: 'The analyzer uses Perplexity AI with the llama-3.1-sonar-small-128k-online model to evaluate text for phishing attempts, scams, and malicious content, identify social engineering tactics, detect suspicious URLs, and analyze language patterns associated with fraud.'
    },
    'threat-intelligence': {
      title: 'Threat Intelligence Integration',
      content: 'The system leverages real-time threat intelligence from Perplexity AI\'s Knowledge Base, cybersecurity databases, real-time web search, and pattern recognition models trained on millions of scam examples.'
    },
    'grading-system': {
      title: 'Threat Level Grading System',
      content: 'The analyzer uses a 5-tier threat assessment system: Critical (Red), High (Orange), Medium (Yellow), Low (Green), and None (White).'
    },
    'what-it-looks-for': {
      title: 'What the Analyzer Looks For',
      content: 'The analyzer examines text for various red flags and indicators of malicious content.'
    },
    'red-flags': {
      title: 'Red Flags & Indicators',
      content: 'Key indicators include urgency tactics, authority impersonation, sensitive data requests, suspicious URLs, unusual language, too-good-to-be-true offers, and pressure tactics.'
    },
    'technical-analysis': {
      title: 'Technical Analysis',
      content: 'Technical analysis includes URL analysis, pattern recognition, context analysis, temporal analysis, and cross-referencing against threat intelligence databases.'
    },
    'data-sources': {
      title: 'Data Sources & Privacy',
      content: 'Information about the data sources used and privacy considerations.'
    },
    'privacy': {
      title: 'Privacy & Data Handling',
      content: 'Your privacy is paramount. The Live Text Analyzer is designed with privacy-first principles.'
    },
    'limitations': {
      title: 'Limitations & Considerations',
      content: 'While powerful, the analyzer has limitations and should be used as part of a comprehensive security strategy.'
    },
    'best-practices': {
      title: 'Best Practices',
      content: 'Guidelines for using the analyzer effectively and maintaining good security practices.'
    },
    'conclusion': {
      title: 'Conclusion',
      content: 'The Live Text Analyzer is a valuable tool for identifying potential threats, but should be used alongside other security measures.'
    }
  };

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
      const content = section.content;
      const title = section.title;
      const combinedText = `${title}. ${content}`;
      const lowerCombinedText = combinedText.toLowerCase();
      const matchIndex = lowerCombinedText.indexOf(searchTerm);

      if (matchIndex !== -1 && !addedSections.has(sectionId)) {
        const startIndex = Math.max(0, matchIndex - snippetPadding);
        const endIndex = Math.min(
          combinedText.length,
          matchIndex + searchTerm.length + snippetPadding
        );

        let snippet = combinedText.substring(startIndex, endIndex);
        if (startIndex > 0) snippet = '...' + snippet;
        if (endIndex < combinedText.length) snippet = snippet + '...';

        results.push({
          sectionId,
          sectionTitle: title,
          snippet,
          index: results.length,
        });
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
        scrollViewRef.current,
        (x: number, y: number) => {
          scrollViewRef.current?.scrollTo({
            y: y - 100, // Offset for header
            animated: true,
          });
        },
        () => {
          // Fallback if measureLayout fails
          console.log('Could not measure section position');
        }
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
    
    // Highlight the section briefly
    setHighlightedSection(result.sectionId);
    setTimeout(() => setHighlightedSection(null), 2000);
    
    // Scroll to the section
    scrollToSection(result.sectionId);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(0);
      setHighlightedSection(null);
    }
  };

  const toggleTableOfContents = () => {
    setShowTableOfContents(!showTableOfContents);
  };

  const getSectionStyle = (sectionId: string) => {
    if (highlightedSection === sectionId) {
      return [styles.section, styles.highlightedSection];
    }
    return styles.section;
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Text Analyzer</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleSearch}
            >
              <Icon name={showSearch ? "close" : "search"} size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleTableOfContents}
            >
              <Icon name="list" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search article content..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleSearch('')}
                  style={styles.clearButton}
                >
                  <Icon name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                <View style={styles.searchResultsHeader}>
                  <Text style={styles.searchResultsTitle}>
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </Text>
                  <View style={styles.searchNavigation}>
                    <TouchableOpacity
                      onPress={() => navigateToSearchResult('prev')}
                      style={styles.navButton}
                    >
                      <Icon name="chevron-up" size={16} color="#00BCD4" />
                    </TouchableOpacity>
                    <Text style={styles.navText}>
                      {currentSearchIndex + 1} of {searchResults.length}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigateToSearchResult('next')}
                      style={styles.navButton}
                    >
                      <Icon name="chevron-down" size={16} color="#00BCD4" />
                    </TouchableOpacity>
                  </View>
                </View>
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.searchResultItem,
                      index === currentSearchIndex && styles.activeSearchResult
                    ]}
                    onPress={() => {
                      setCurrentSearchIndex(index);
                      setHighlightedSection(result.sectionId);
                      setTimeout(() => setHighlightedSection(null), 2000);
                      scrollToSection(result.sectionId);
                    }}
                  >
                    <Icon name="document-text-outline" size={20} color="#00BCD4" style={{marginRight: 8}}/>
                    <View>
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
              </View>
            )}
          </View>
        )}
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Icon name="scan-outline" size={32} color="#00BCD4" />
              </View>
              <Text style={styles.title}>Live Text Analyzer: How It Works</Text>
            </View>

            <View style={getSectionStyle('overview')} ref={(ref) => { sectionRefs.current['overview'] = ref; }}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <HighlightText 
                text="The Live Text Analyzer is a powerful AI-powered tool that scans text content in real-time to identify potential security threats, scams, and malicious content. It provides instant threat assessments with actionable recommendations to help you stay safe online."
                highlight={searchQuery}
                style={styles.bodyText}
                highlightStyle={styles.highlightedWord}
              />
            </View>

            <View style={getSectionStyle('how-it-works')} ref={(ref) => { sectionRefs.current['how-it-works'] = ref; }}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              
              <View style={getSectionStyle('text-input')} ref={(ref) => { sectionRefs.current['text-input'] = ref; }}>
                <Text style={styles.subsectionTitle}>1. Text Input Processing</Text>
                <HighlightText 
                  text="When you paste text into the analyzer:"
                  highlight={searchQuery}
                  style={styles.bodyText}
                  highlightStyle={styles.highlightedWord}
                />
                <View style={styles.bulletList}>
                  <HighlightText text="• The system processes your input through advanced natural language processing" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  <HighlightText text="• It analyzes the content for suspicious patterns, keywords, and contextual clues" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  <HighlightText text="• Multiple threat detection algorithms work simultaneously to assess risk" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                </View>
              </View>

              <View style={getSectionStyle('ai-analysis')} ref={(ref) => { sectionRefs.current['ai-analysis'] = ref; }}>
                <Text style={styles.subsectionTitle}>2. AI-Powered Analysis</Text>
                <Text style={styles.bodyText}>
                  <HighlightText text="The analyzer uses " highlight={searchQuery} style={styles.bodyText} highlightStyle={styles.highlightedWord} />
                  <Text style={styles.highlight}>Perplexity AI</Text>
                  <HighlightText text=" with the " highlight={searchQuery} style={styles.bodyText} highlightStyle={styles.highlightedWord} />
                  <Text style={styles.code}>llama-3.1-sonar-small-128k-online</Text>
                  <HighlightText text=" model to:" highlight={searchQuery} style={styles.bodyText} highlightStyle={styles.highlightedWord} />
                </Text>
                <View style={styles.bulletList}>
                  <HighlightText text="• Evaluate text for phishing attempts, scams, and malicious content" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  <HighlightText text="• Identify social engineering tactics and urgency indicators" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  <HighlightText text="• Detect suspicious URLs, phone numbers, and contact information" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  <HighlightText text="• Analyze language patterns associated with fraud and deception" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                </View>
              </View>

              <View style={getSectionStyle('threat-intelligence')} ref={(ref) => { sectionRefs.current['threat-intelligence'] = ref; }}>
                <Text style={styles.subsectionTitle}>3. Threat Intelligence Integration</Text>
                <HighlightText 
                  text="The system leverages real-time threat intelligence from:"
                  highlight={searchQuery}
                  style={styles.bodyText}
                  highlightStyle={styles.highlightedWord}
                />
                <View style={styles.bulletList}>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Perplexity AI's Knowledge Base</Text>: <HighlightText text="Access to current threat data and scam patterns" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Cybersecurity Databases</Text>: <HighlightText text="Information about known malicious entities" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Real-time Web Search</Text>: <HighlightText text="Latest information about emerging threats" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pattern Recognition</Text>: <HighlightText text="AI models trained on millions of scam examples" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                </View>
              </View>
            </View>

            <View style={getSectionStyle('grading-system')} ref={(ref) => { sectionRefs.current['grading-system'] = ref; }}>
              <Text style={styles.sectionTitle}>Threat Level Grading System</Text>
              <HighlightText 
                text="The analyzer uses a 5-tier threat assessment system:"
                highlight={searchQuery}
                style={styles.bodyText}
                highlightStyle={styles.highlightedWord}
              />

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#F44336' }]}>
                  <Icon name="warning" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#F44336' }]}>CRITICAL (Red)</Text>
                  <HighlightText text="Immediate action required" highlight={searchQuery} style={styles.threatDescription} highlightStyle={styles.highlightedWord}/>
                  <View style={styles.bulletList}>
                    <HighlightText text="• Confirmed phishing attempts" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Known scam patterns" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Requests for sensitive information" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Suspicious payment requests" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#FF9800' }]}>
                  <Icon name="alert" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#FF9800' }]}>HIGH (Orange)</Text>
                  <HighlightText text="High risk - proceed with extreme caution" highlight={searchQuery} style={styles.threatDescription} highlightStyle={styles.highlightedWord}/>
                  <View style={styles.bulletList}>
                    <HighlightText text="• Strong indicators of malicious intent" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Urgency tactics and pressure techniques" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Suspicious URLs or attachments" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Offers that seem too good to be true" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#FFC107' }]}>
                  <Icon name="help-circle" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#FFC107' }]}>MEDIUM (Yellow)</Text>
                  <HighlightText text="Moderate risk - exercise caution" highlight={searchQuery} style={styles.threatDescription} highlightStyle={styles.highlightedWord}/>
                  <View style={styles.bulletList}>
                    <HighlightText text="• Some suspicious elements present" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Unusual language or formatting" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Requests for personal information" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Links to unfamiliar websites" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#4CAF50' }]}>
                  <Icon name="checkmark-circle" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#4CAF50' }]}>LOW (Green)</Text>
                  <HighlightText text="Minimal risk - standard precautions" highlight={searchQuery} style={styles.threatDescription} highlightStyle={styles.highlightedWord}/>
                  <View style={styles.bulletList}>
                    <HighlightText text="• No obvious threats detected" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Standard communication patterns" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Familiar senders and contexts" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• No suspicious requests or links" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#9E9E9E' }]}>
                  <Icon name="shield-checkmark" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#9E9E9E' }]}>NONE (White)</Text>
                  <HighlightText text="No threats detected" highlight={searchQuery} style={styles.threatDescription} highlightStyle={styles.highlightedWord}/>
                  <View style={styles.bulletList}>
                    <HighlightText text="• Clean, legitimate content" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• Normal communication patterns" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                    <HighlightText text="• No suspicious elements identified" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/>
                  </View>
                </View>
              </View>
            </View>

            <View style={getSectionStyle('what-it-looks-for')} ref={(ref) => { sectionRefs.current['what-it-looks-for'] = ref; }}>
              <Text style={styles.sectionTitle}>What the Analyzer Looks For</Text>
              
              <View style={getSectionStyle('red-flags')} ref={(ref) => { sectionRefs.current['red-flags'] = ref; }}>
                <Text style={styles.subsectionTitle}>Red Flags & Indicators</Text>
                <View style={styles.bulletList}>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Urgency Tactics</Text>: <HighlightText text='"Act now," "Limited time," "Immediate action required"' highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Authority Impersonation</Text>: <HighlightText text="Claims to be from banks, government agencies, tech support" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Sensitive Data Requests</Text>: <HighlightText text="Passwords, credit card numbers, Social Security numbers" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Suspicious URLs</Text>: <HighlightText text="Slightly misspelled domains, unusual TLDs, redirect chains" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Unusual Language</Text>: <HighlightText text="Grammatical errors, inconsistent formatting, foreign language mixed in" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Too-Good-to-Be-True Offers</Text>: <HighlightText text="Free money, prizes, unexpected refunds" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pressure Tactics</Text>: <HighlightText text="Threats, deadlines, emotional manipulation" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                </View>
              </View>

              <View style={getSectionStyle('technical-analysis')} ref={(ref) => { sectionRefs.current['technical-analysis'] = ref; }}>
                <Text style={styles.subsectionTitle}>Technical Analysis</Text>
                <View style={styles.bulletList}>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>URL Analysis</Text>: <HighlightText text="Checks against known malicious domains and phishing databases" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pattern Recognition</Text>: <HighlightText text="Identifies common scam templates and social engineering techniques" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Context Analysis</Text>: <HighlightText text="Evaluates the relationship between sender and recipient" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Temporal Analysis</Text>: <HighlightText text="Considers timing and frequency of communications" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Cross-Reference</Text>: <HighlightText text="Compares against known threat intelligence databases" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                </View>
              </View>
            </View>

            <View style={getSectionStyle('data-sources')} ref={(ref) => { sectionRefs.current['data-sources'] = ref; }}>
              <Text style={styles.sectionTitle}>Data Sources & Privacy</Text>
              
              <View style={getSectionStyle('privacy')} ref={(ref) => { sectionRefs.current['privacy'] = ref; }}>
                <Text style={styles.subsectionTitle}>Privacy & Data Handling</Text>
                <HighlightText 
                  text="Your privacy is paramount. The Live Text Analyzer is designed with privacy-first principles:"
                  highlight={searchQuery}
                  style={styles.bodyText}
                  highlightStyle={styles.highlightedWord}
                />
                <View style={styles.bulletList}>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>No Data Storage</Text>: <HighlightText text="Your text is not stored or saved anywhere" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Secure Processing</Text>: <HighlightText text="Analysis is performed through encrypted connections" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>No Third-Party Sharing</Text>: <HighlightText text="Your data is never shared with external parties" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                  <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Temporary Processing</Text>: <HighlightText text="Text is only processed for the duration of analysis" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                </View>
              </View>
            </View>

            <View style={getSectionStyle('limitations')} ref={(ref) => { sectionRefs.current['limitations'] = ref; }}>
              <Text style={styles.sectionTitle}>Limitations & Considerations</Text>
              <HighlightText 
                text="While the Live Text Analyzer is a powerful tool, it has certain limitations:"
                highlight={searchQuery}
                style={styles.bodyText}
                highlightStyle={styles.highlightedWord}
              />
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>AI Limitations</Text>: <HighlightText text="May occasionally miss sophisticated or novel threats" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Context Dependency</Text>: <HighlightText text="Analysis quality depends on the clarity and completeness of input text" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>False Positives</Text>: <HighlightText text="Legitimate content may sometimes be flagged as suspicious" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Language Support</Text>: <HighlightText text="Currently optimized for English-language content" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Not a Replacement</Text>: <HighlightText text="Should be used alongside other security measures, not as a sole defense" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
              </View>
            </View>

            <View style={getSectionStyle('best-practices')} ref={(ref) => { sectionRefs.current['best-practices'] = ref; }}>
              <Text style={styles.sectionTitle}>Best Practices</Text>
              <HighlightText 
                text="To get the most out of the Live Text Analyzer:"
                highlight={searchQuery}
                style={styles.bodyText}
                highlightStyle={styles.highlightedWord}
              />
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Use Regularly</Text>: <HighlightText text="Scan suspicious messages, emails, and social media posts" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Provide Context</Text>: <HighlightText text="Include relevant details like sender information and context" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Verify Results</Text>: <HighlightText text="Don't rely solely on the analyzer - use your judgment" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Stay Updated</Text>: <HighlightText text="Keep the app updated for the latest threat detection capabilities" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Report Issues</Text>: <HighlightText text="Help improve the system by reporting false positives or missed threats" highlight={searchQuery} style={styles.bulletPoint} highlightStyle={styles.highlightedWord}/></Text>
              </View>
            </View>

            <View style={getSectionStyle('conclusion')} ref={(ref) => { sectionRefs.current['conclusion'] = ref; }}>
              <Text style={styles.sectionTitle}>Conclusion</Text>
              <HighlightText 
                text="The Live Text Analyzer is a valuable tool in your digital security toolkit. By combining AI-powered analysis with your own judgment and other security measures, you can significantly reduce your risk of falling victim to online scams and threats."
                highlight={searchQuery}
                style={styles.bodyText}
                highlightStyle={styles.highlightedWord}
              />
              <HighlightText 
                text="Remember: The best defense is a layered approach. Use the analyzer as part of a comprehensive security strategy that includes strong passwords, two-factor authentication, regular software updates, and healthy skepticism about unsolicited communications."
                highlight={searchQuery}
                style={styles.bodyText}
                highlightStyle={styles.highlightedWord}
              />
            </View>
          </View>
        </ScrollView>

        {/* Table of Contents Modal */}
        <Modal
          visible={showTableOfContents}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTableOfContents(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.tableOfContentsContainer}>
              <View style={styles.tocHeader}>
                <Text style={styles.tocTitle}>Table of Contents</Text>
                <TouchableOpacity
                  onPress={() => setShowTableOfContents(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.tocContent}>
                {tableOfContents.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tocItem,
                      { paddingLeft: 16 + (item.level - 1) * 20 }
                    ]}
                    onPress={() => scrollToSection(item.id)}
                  >
                    <Text style={[
                      styles.tocItemText,
                      item.level === 1 ? styles.tocMainItem : styles.tocSubItem
                    ]}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchResults: {
    marginTop: 15,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchResultsTitle: {
    color: '#00BCD4',
    fontSize: 14,
    fontWeight: '600',
  },
  searchNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  navText: {
    color: '#00BCD4',
    fontSize: 12,
    marginHorizontal: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    marginBottom: 8,
  },
  activeSearchResult: {
    backgroundColor: '#00BCD422',
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  searchResultTitleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultSnippet: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  searchResultHighlight: {
    color: '#00BCD4',
    fontWeight: 'bold',
  },
  searchResultText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
  },
  section: {
    marginBottom: 30,
  },
  highlightedSection: {
    backgroundColor: '#00BCD422',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  highlightedWord: {
    backgroundColor: 'rgba(255, 235, 59, 0.3)',
    color: '#FFF2A8'
  },
  subsection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00BCD4',
    marginBottom: 10,
    marginTop: 15,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E0E0E0',
    marginBottom: 15,
  },
  bulletList: {
    marginLeft: 10,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: '#E0E0E0',
    marginBottom: 8,
  },
  highlight: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#00BCD4',
  },
  threatLevel: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  threatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  threatContent: {
    flex: 1,
  },
  threatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  threatDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  tableOfContentsContainer: {
    backgroundColor: '#1E1E1E',
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
    borderBottomColor: '#333',
  },
  tocTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  tocContent: {
    padding: 20,
  },
  tocItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tocItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  tocMainItem: {
    fontWeight: '600',
  },
  tocSubItem: {
    fontWeight: '400',
    color: '#B0B0B0',
  },
});

export default KnowledgeBaseLiveTextAnalyzer; 