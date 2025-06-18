import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLogs } from '../context/LogContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { ThreatBadgeCompact } from '../components/ThreatBadge';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility } from '../context/AccessibilityContext';
import DropDownPicker from 'react-native-dropdown-picker';
import type { LogEntry } from '../context/LogContext';

const LogHistoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logs } = useLogs();
  const { settings } = useAccessibility();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [threatFilter, setThreatFilter] = useState('All');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [threatOpen, setThreatOpen] = useState(false);
  
  // Get initial filter from navigation params
  useEffect(() => {
    // @ts-ignore
    const initialThreatFilter = route.params?.threatFilter;
    if (initialThreatFilter) {
      setThreatFilter(initialThreatFilter);
    }
  }, [route.params]);

  const [categoryItems] = useState([
    { label: 'All', value: 'All' },
    { label: 'Mail', value: 'Mail' },
    { label: 'Text', value: 'Text' },
    { label: 'Phone Call', value: 'Phone Call' },
  ]);
  const [threatItems] = useState([
    { label: 'All', value: 'All' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ]);

  const filteredLogs = logs.filter((log: LogEntry) => {
    const matchesSearch =
      log.sender.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    let threatLevel: string;
    if (typeof log.threat === 'object' && log.threat.level) {
      threatLevel = log.threat.level;
    } else if (typeof log.threat === 'string') {
      // fallback for legacy logs: treat as Low if empty
      threatLevel = log.threat || 'Low';
    } else {
      threatLevel = 'Low';
    }
    const matchesThreat = threatFilter === 'All' || threatLevel === threatFilter;
    return matchesSearch && matchesCategory && matchesThreat;
  });

  // Get title based on active filters
  const getTitle = () => {
    if (threatFilter === 'High') return 'High Threat Logs';
    if (threatFilter === 'Low') return 'Safe Messages';
    if (threatFilter === 'Medium') return 'Medium Threat Logs';
    if (categoryFilter !== 'All') return `${categoryFilter} Logs`;
    return 'Logs';
  };

  // Get subtitle based on active filters
  const getSubtitle = () => {
    const activeFilters = [];
    if (threatFilter !== 'All') activeFilters.push(`${threatFilter} Threat`);
    if (categoryFilter !== 'All') activeFilters.push(categoryFilter);
    if (search) activeFilters.push(`"${search}"`);
    
    if (activeFilters.length > 0) {
      return `Filtered by: ${activeFilters.join(', ')}`;
    }
    return `${filteredLogs.length} total logs`;
  };

  const renderItem = ({ item }: { item: LogEntry }) => {
    let threat: { level: 'High' | 'Medium' | 'Low'; score?: number };
    if (typeof item.threat === 'object' && item.threat.level) {
      threat = item.threat as { level: 'High' | 'Medium' | 'Low'; score?: number };
    } else {
      const threatLevel = typeof item.threat === 'string' && item.threat ? item.threat : 'Low';
      threat = { level: threatLevel as 'High' | 'Medium' | 'Low', score: undefined };
    }
    
    const accessibilityLabel = `${item.category} from ${item.sender}, ${threat.level} threat level. ${item.message}`;
    
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.07)' }]}
        onPress={() => (navigation as any).navigate('LogDetail', { log: item })}
        activeOpacity={0.85}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Double tap to view detailed analysis"
        accessibilityRole="button"
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <AccessibleText variant="caption" style={styles.cardDate}>{item.date}</AccessibleText>
            <AccessibleText variant="body" style={styles.cardSender}>{item.sender}</AccessibleText>
          </View>
          <View style={styles.cardRight}>
            <CategoryBadge category={item.category} />
            <ThreatBadgeCompact level={threat.level} score={threat.score} />
          </View>
        </View>
        <AccessibleText variant="body" style={styles.cardMessagePreview} numberOfLines={2}>{item.message}</AccessibleText>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <AccessibleText variant="title" style={styles.title}>{getTitle()}</AccessibleText>
          {(threatFilter !== 'All' || categoryFilter !== 'All' || search) && (
            <View style={styles.filterIndicator}>
              <AccessibleText variant="caption" style={styles.subtitle}>{getSubtitle()}</AccessibleText>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setThreatFilter('All');
                  setCategoryFilter('All');
                  setSearch('');
                }}
                accessible={true}
                accessibilityLabel="Clear all filters"
                accessibilityHint="Tap to remove all active filters"
              >
                <AccessibleText variant="caption" style={styles.clearFiltersText}>Clear Filters</AccessibleText>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.searchBarRow}>
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                color: settings.highContrastMode ? '#000000' : '#fff'
              }]}
              placeholder="Search sender or message..."
              placeholderTextColor={settings.highContrastMode ? '#666666' : "#B0BEC5"}
              value={search}
              onChangeText={setSearch}
              accessible={true}
              accessibilityLabel="Search logs"
              accessibilityHint="Type to search through your security logs"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>
            <View style={{ flex: 1, marginRight: 8, zIndex: categoryOpen ? 100 : 1 }}>
              <DropDownPicker
                open={categoryOpen}
                value={categoryFilter}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={setCategoryFilter}
                setItems={() => {}}
                placeholder="Category"
                style={{ backgroundColor: '#263159', borderColor: '#4A90E2' }}
                dropDownContainerStyle={{ backgroundColor: '#263159', borderColor: '#4A90E2', elevation: 5 }}
                textStyle={{ color: '#fff' }}
                listItemLabelStyle={{ color: '#fff' }}
                placeholderStyle={{ color: '#B0BEC5' }}
                zIndex={categoryOpen ? 100 : 1}
                maxHeight={220}
              />
            </View>
            <View style={{ flex: 1, zIndex: threatOpen ? 99 : 0 }}>
              <DropDownPicker
                open={threatOpen}
                value={threatFilter}
                items={threatItems}
                setOpen={setThreatOpen}
                setValue={setThreatFilter}
                setItems={() => {}}
                placeholder="Threat Level"
                style={{ backgroundColor: '#263159', borderColor: '#FF6B6B' }}
                dropDownContainerStyle={{ backgroundColor: '#263159', borderColor: '#FF6B6B', elevation: 5 }}
                textStyle={{ color: '#fff' }}
                listItemLabelStyle={{ color: '#fff' }}
                placeholderStyle={{ color: '#B0BEC5' }}
                zIndex={threatOpen ? 99 : 0}
                maxHeight={220}
              />
            </View>
          </View>
        </View>
        <FlatList
          data={filteredLogs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 18 }}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 8 }}
          accessible={true}
          accessibilityLabel="Security logs list"
          accessibilityHint="Scroll to view all security logs"
        />
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
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 40,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardDate: {
    color: '#B0BEC5',
    fontSize: 13,
    marginBottom: 2,
  },
  cardSender: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMessagePreview: {
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 2,
    marginBottom: 2,
  },
  simBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'center',
    marginLeft: 8,
  },
  simBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerContainer: { paddingTop: 18, paddingBottom: 8, backgroundColor: 'transparent' },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 13,
    marginBottom: 10,
  },
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  clearFiltersButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  clearFiltersText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LogHistoryScreen; 