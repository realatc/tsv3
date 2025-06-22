import * as React from 'react';
import { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useLogs } from '../context/LogContext';

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { logs } = useLogs();
  const query = (route.params as { query: string }).query;

  const filteredLogs = useMemo(() => {
    const q = query.toLowerCase();
    return logs.filter((log) => {
      return (
        log.sender.toLowerCase().includes(q) ||
        log.message.toLowerCase().includes(q) ||
        (log.nlpAnalysis && log.nlpAnalysis.toLowerCase().includes(q)) ||
        (log.behavioralAnalysis && log.behavioralAnalysis.toLowerCase().includes(q))
      );
    });
  }, [query, logs]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => (navigation as any).navigate('LogDetail', { log: item })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
      <View style={styles.cardSenderRow}>
        <Text style={styles.cardSender}>{item.sender}</Text>
      </View>
      <Text style={styles.cardMessagePreview} numberOfLines={2}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Search Results</Text>
          {filteredLogs.length === 0 ? (
            <Text style={styles.noResults}>No results found for “{query}”</Text>
          ) : (
            <FlatList
              data={filteredLogs}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, padding: 18 },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  noResults: {
    color: '#B0BEC5',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardDate: {
    color: '#90CAF9',
    fontSize: 13,
    marginRight: 10,
  },
  cardSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardSender: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1,
  },
  cardMessagePreview: {
    color: '#B0BEC5',
    fontSize: 15,
    marginLeft: 2,
    marginTop: 2,
  },
});

export default SearchResultsScreen; 