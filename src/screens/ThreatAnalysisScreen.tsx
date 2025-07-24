import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { analyzeText, getRelatedThreatIntel, RelatedIntel } from '../services/perplexity/perplexityService';
import { checkUrlSafety, UrlAnalysisResult } from '../services/threatReader/safeBrowsing';
import { getSeverityColor, getSeverityIcon } from '../utils/threatLevel';

type AnalysisResult = {
  threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  recommendation: string;
};

type UrlCheckResult = {
  url: string;
  analysis: UrlAnalysisResult;
  checked: boolean;
};

type ThreatAnalysisRouteProp = RouteProp<{ ThreatAnalysis: { initialText?: string } }, 'ThreatAnalysis'>;

const ThreatAnalysisScreen = () => {
  const route = useRoute<ThreatAnalysisRouteProp>();
  const [text, setText] = useState(route.params?.initialText || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [relatedIntel, setRelatedIntel] = useState<RelatedIntel[]>([]);
  const [isFetchingIntel, setIsFetchingIntel] = useState(false);
  const [urlResults, setUrlResults] = useState<UrlCheckResult[]>([]);

  // Auto-analyze when initial text is provided
  useEffect(() => {
    if (route.params?.initialText && route.params.initialText.trim()) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        handleAnalysis();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [route.params?.initialText]);

  // Function to extract URLs from text
  const extractUrls = (text: string): string[] => {
    // First try to find URLs with protocols
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlsWithProtocol = text.match(urlRegex) || [];
    
    // Then find URLs without protocols (like www.amazon.com)
    const domainRegex = /\b(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,})\b/g;
    const domainsWithoutProtocol = text.match(domainRegex) || [];
    
    // Combine and deduplicate
    const allUrls = [...urlsWithProtocol, ...domainsWithoutProtocol];
    return [...new Set(allUrls)];
  };

  const handleAnalysis = async () => {
    if (!text.trim()) {
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setResult(null);
    setRelatedIntel([]);
    setUrlResults([]);

    try {
      // Extract URLs from the text
      const urls = extractUrls(text);
      console.log(`[ThreatAnalysis] Found ${urls.length} URLs in text`);

      // Check URLs for safety
      const urlChecks: UrlCheckResult[] = [];
      for (const url of urls) {
        try {
          // Normalize URL format and add protocol if missing
          let urlToCheck = url.toLowerCase();
          if (!urlToCheck.startsWith('http')) {
            urlToCheck = `https://${urlToCheck}`;
          }
          const analysis = await checkUrlSafety(urlToCheck);
          urlChecks.push({ url, analysis, checked: true });
          console.log(`[ThreatAnalysis] URL ${url} status: ${analysis.status}`);
        } catch (error) {
          console.error(`[ThreatAnalysis] Error checking URL ${url}:`, error);
          urlChecks.push({ 
            url, 
            analysis: {
              status: 'error',
              details: { domain: url, confidence: 'low' },
              recommendations: ['Analysis failed due to technical error']
            }, 
            checked: false 
          });
        }
      }
      setUrlResults(urlChecks);

      // Analyze the text content
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
      
      if (analysisResult) {
        setIsFetchingIntel(true);
        const intelResults = await getRelatedThreatIntel(analysisResult.summary);
        setRelatedIntel(intelResults);
        setIsFetchingIntel(false);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setResult({
        threatLevel: 'unknown',
        summary: 'An error occurred during analysis.',
        recommendation: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrlStatusColor = (status: string) => {
    switch (status) {
      case 'malware': return '#FF4444';
      case 'phishing': return '#FF8800';
      case 'uncommon': return '#FFAA00';
      case 'safe': return '#44AA44';
      default: return '#888888';
    }
  };

  const getUrlStatusIcon = (status: string) => {
    switch (status) {
      case 'malware': return 'warning';
      case 'phishing': return 'shield-outline';
      case 'uncommon': return 'alert-circle';
      case 'safe': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const getUrlStatusText = (status: string) => {
    switch (status) {
      case 'malware': return 'MALWARE DETECTED';
      case 'phishing': return 'PHISHING SITE';
      case 'uncommon': return 'SUSPICIOUS';
      case 'safe': return 'SAFE';
      default: return 'UNKNOWN';
    }
  };

  const renderUrlResults = () => {
    if (urlResults.length === 0) return null;

    return (
      <View style={styles.urlResultsContainer}>
        <Text style={styles.urlResultsTitle}>URL Safety Check</Text>
        {urlResults.map((urlResult, index) => (
          <View key={index} style={styles.urlResultItem}>
            <View style={styles.urlResultHeader}>
              <Icon 
                name={getUrlStatusIcon(urlResult.analysis.status)} 
                size={20} 
                color={getUrlStatusColor(urlResult.analysis.status)} 
              />
              <Text style={[styles.urlStatusText, { color: getUrlStatusColor(urlResult.analysis.status) }]}>
                {getUrlStatusText(urlResult.analysis.status)}
              </Text>
            </View>
            <Text style={styles.urlText} numberOfLines={2}>
              {urlResult.url}
            </Text>
            <Text style={styles.urlDomainText}>
              Domain: {urlResult.analysis.details.domain}
            </Text>
            {urlResult.analysis.details.ipAddress && (
              <Text style={styles.urlDetailText}>
                IP: {urlResult.analysis.details.ipAddress}
              </Text>
            )}
            {urlResult.analysis.details.sslValid !== undefined && (
              <Text style={styles.urlDetailText}>
                SSL: {urlResult.analysis.details.sslValid ? 'Valid' : 'Invalid'}
              </Text>
            )}
            {urlResult.analysis.details.reputation && (
              <Text style={styles.urlDetailText}>
                Reputation: {urlResult.analysis.details.reputation}
              </Text>
            )}
            {urlResult.analysis.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                {urlResult.analysis.recommendations.map((rec, recIndex) => (
                  <Text key={recIndex} style={styles.recommendationText}>
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
            {!urlResult.checked && (
              <Text style={styles.urlErrorText}>Failed to check URL</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderResult = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#4A90E2" style={styles.centered} />;
    }
    if (!result) {
      return (
        <View style={styles.placeholderContainer}>
          <Icon name="chatbox-ellipses-outline" size={80} color="#444" />
          <Text style={styles.placeholderText}>
            Enter text above and tap 'Analyze' to check for threats.
          </Text>
          <Text style={styles.placeholderSubtext}>
            You can analyze any text, including URLs, emails, or messages.
          </Text>
        </View>
      );
    }
    return (
      <View>
        {renderUrlResults()}
        <View style={[styles.resultCard, { borderColor: getSeverityColor(result.threatLevel) }]}>
          <View style={styles.resultHeader}>
            <Icon name={getSeverityIcon(result.threatLevel)} size={24} color={getSeverityColor(result.threatLevel)} style={styles.resultIcon} />
            <Text style={[styles.resultTitle, { color: getSeverityColor(result.threatLevel) }]}>
              {result.threatLevel.toUpperCase()}
            </Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.sectionContent}>{result.summary}</Text>
          </View>
          
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <Text style={styles.sectionContent}>{result.recommendation}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRelatedIntel = () => {
    if (isFetchingIntel) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#4A90E2" />
          <Text style={styles.loadingText}>Finding related threats...</Text>
        </View>
      );
    }
    if (relatedIntel.length === 0) return null;

    return (
      <View style={styles.relatedIntelContainer}>
        <Text style={styles.relatedIntelTitle}>Related Threat Intelligence</Text>
        {relatedIntel.map((intel, index) => (
          <TouchableOpacity
            key={index}
            style={styles.intelItem}
            onPress={() => Linking.openURL(intel.url)}
          >
            <Text style={styles.intelTitle}>{intel.title}</Text>
            <Text style={styles.intelSource}>{intel.source}</Text>
            <Text style={styles.intelSnippet}>{intel.snippet}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Text Analyzer</Text>
        <Text style={styles.headerSubtitle}>Check URLs, emails, messages, or any suspicious text</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a URL, paste an email, message, or any text you want to check for threats..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.analyzeButton, !text.trim() && styles.analyzeButtonDisabled]}
            onPress={handleAnalysis}
            disabled={!text.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="shield-checkmark" size={20} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analyze</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.inputHint}>
            Examples: https://example.com, suspicious emails, text messages, social media posts
          </Text>
        </View>

        <View style={styles.resultsContainer}>
          {renderResult()}
          {renderRelatedIntel()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181C',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    padding: 20,
  },
  textInput: {
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 16,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A070F2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#444',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    padding: 20,
  },
  urlResultsContainer: {
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  urlResultsTitle: {
    color: '#A070F2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  urlResultItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  urlResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urlStatusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  urlText: {
    color: '#B0B0B0',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  urlErrorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
  },
  urlDomainText: {
    color: '#A070F2',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  urlDetailText: {
    color: '#B0B0B0',
    fontSize: 11,
    marginTop: 2,
  },
  recommendationsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  recommendationText: {
    color: '#FFAA00',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  resultCard: {
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#A070F2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  relatedIntelContainer: {
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  relatedIntelTitle: {
    color: '#A070F2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  intelItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  intelTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  intelSource: {
    color: '#A070F2',
    fontSize: 12,
    marginBottom: 4,
  },
  intelSnippet: {
    color: '#B0B0B0',
    fontSize: 12,
    lineHeight: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  placeholderSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 8,
  },
  inputHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ThreatAnalysisScreen; 