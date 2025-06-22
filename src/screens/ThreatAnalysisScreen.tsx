import React, { useState } from 'react';
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
import { analyzeText, getRelatedThreatIntel, RelatedIntel } from '../services/perplexity/perplexityService';
import { getThreatColor, getThreatIcon } from '../utils/threatLevel';

type AnalysisResult = {
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  recommendation: string;
};

const ThreatAnalysisScreen = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [relatedIntel, setRelatedIntel] = useState<RelatedIntel[]>([]);
  const [isFetchingIntel, setIsFetchingIntel] = useState(false);

  const handleAnalysis = async () => {
    if (!text.trim()) {
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setResult(null);
    setRelatedIntel([]);
    try {
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
        </View>
      );
    }
    return (
      <View style={[styles.resultCard, { borderColor: getThreatColor(result.threatLevel) }]}>
        <View style={styles.resultHeader}>
           <Icon name={getThreatIcon(result.threatLevel)} size={24} color={getThreatColor(result.threatLevel)} style={styles.resultIcon} />
          <Text style={[styles.resultTitle, { color: getThreatColor(result.threatLevel) }]}>
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
    );
  };

  const renderRelatedIntel = () => {
    if (isFetchingIntel) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.intelLoadingText}>Searching for related intelligence...</Text>
        </View>
      );
    }

    if (relatedIntel.length === 0) {
      return null;
    }

    return (
      <View style={styles.intelContainer}>
        <Text style={styles.intelTitle}>Related Threat Intelligence</Text>
        {relatedIntel.map((item, index) => (
          <TouchableOpacity key={index} style={styles.intelCard} onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.intelCardTitle}>{item.title}</Text>
            <Text style={styles.intelCardSource}>{item.source}</Text>
            <Text style={styles.intelCardSnippet}>{item.snippet}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Paste text, a URL, or a message here..."
                placeholderTextColor="#666"
                multiline
                value={text}
                onChangeText={setText}
              />
              <TouchableOpacity
                style={[styles.button, (loading || !text.trim()) && styles.buttonDisabled]}
                onPress={handleAnalysis}
                disabled={loading || !text.trim()}
              >
                <Text style={styles.buttonText}>Analyze</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultContainer}>{renderResult()}</View>
            {renderRelatedIntel()}
          </>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  textInput: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  placeholderText: {
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  resultCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
    marginBottom: 15,
  },
  resultIcon: {
    marginRight: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 24,
  },
  intelContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  intelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  intelLoadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#aaa',
  },
  intelCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  intelCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginBottom: 5,
  },
  intelCardSource: {
    fontSize: 12,
    color: '#8A8A8E',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  intelCardSnippet: {
    fontSize: 14,
    color: '#E5E5EA',
    lineHeight: 20,
  },
});

export default ThreatAnalysisScreen; 