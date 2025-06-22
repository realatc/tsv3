import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from '@gorhom/bottom-sheet';

import { useLogs } from '../context/LogContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { ThreatBadgeCompact } from '../components/ThreatBadge';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility } from '../context/AccessibilityContext';
import { useApp } from '../context/AppContext';
import type { LogEntry } from '../context/LogContext';

const LogHistoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logs } = useLogs();
  const { settings } = useAccessibility();
  const { settingsSheetRef } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [threatFilter, setThreatFilter] = useState('All');
  const filterSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    // @ts-ignore
    const initialThreatFilter = route.params?.threatFilter;
    // @ts-ignore
    const initialCategoryFilter = route.params?.categoryFilter;
    
    if (initialThreatFilter) {
      setThreatFilter(initialThreatFilter);
    }
    if (initialCategoryFilter) {
      setCategoryFilter(initialCategoryFilter);
    }
  }, [route.params]);

  const categoryItems = ['All', 'Mail', 'Text', 'Phone Call'];
  const threatItems = ['All', 'High', 'Medium', 'Low'];

  const filteredLogs = logs.filter((log: LogEntry) => {
    const matchesSearch =
      log.sender.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    let threatLevel: string;
    if (typeof log.threat === 'object' && log.threat.level) {
      threatLevel = log.threat.level;
    } else if (typeof log.threat === 'string') {
      threatLevel = log.threat || 'Low';
    } else {
      threatLevel = 'Low';
    }
    const matchesThreat = threatFilter === 'All' || threatLevel === threatFilter;
    return matchesSearch && matchesCategory && matchesThreat;
  });

  const getTitle = () => {
    if (threatFilter === 'High') return 'High Threat Logs';
    if (threatFilter === 'Low') return 'Safe Messages';
    if (threatFilter === 'Medium') return 'Medium Threat Logs';
    if (categoryFilter !== 'All') return `${categoryFilter} Logs`;
    return 'Log History';
  };

  const getSubtitle = () => {
    const activeFilters = [];
    if (threatFilter !== 'All') activeFilters.push(`${threatFilter} Threat`);
    if (categoryFilter !== 'All') activeFilters.push(categoryFilter);
    if (search) activeFilters.push(`"${search}"`);
    
    if (activeFilters.length > 0) {
      return `Filtered by: ${activeFilters.join(', ')}`;
    }
    return `${filteredLogs.length} total logs found`;
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
        style={styles.card}
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

  const renderFilterSheet = () => (
    <BottomSheet
      ref={filterSheetRef}
      index={-1}
      snapPoints={['50%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#1E1E1E' }}
      handleIndicatorStyle={{ backgroundColor: '#444' }}
    >
      <View style={styles.filterSheetContainer}>
        <Text style={styles.filterSheetTitle}>Filter Logs</Text>

        <Text style={styles.filterSectionTitle}>Category</Text>
        <View style={styles.filterOptionGroup}>
          {categoryItems.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, categoryFilter === category && styles.activeFilterChip]}
              onPress={() => setCategoryFilter(category)}
            >
              <Text style={[styles.filterChipText, categoryFilter === category && styles.activeFilterChipText]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterSectionTitle}>Threat Level</Text>
        <View style={styles.filterOptionGroup}>
          {threatItems.map((threat) => (
            <TouchableOpacity
              key={threat}
              style={[
                styles.filterChip,
                threatFilter === threat && styles.activeFilterChip,
                threatFilter === threat && threat === 'High' && styles.highThreat,
                threatFilter === threat && threat === 'Medium' && styles.mediumThreat,
                threatFilter === threat && threat === 'Low' && styles.lowThreat,
              ]}
              onPress={() => setThreatFilter(threat)}
            >
              <Text style={[styles.filterChipText, threatFilter === threat && styles.activeFilterChipText]}>{threat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={() => filterSheetRef.current?.close()}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <AccessibleText variant="title" style={styles.title}>{getTitle()}</AccessibleText>
        <TouchableOpacity onPress={() => settingsSheetRef.current?.expand()} style={styles.profileIcon}>
          <Icon name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
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
              <AccessibleText variant="caption" style={styles.clearFiltersText}>Clear</AccessibleText>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.searchAndFilterRow}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
              color: settings.highContrastMode ? '#000000' : '#fff'
            }]}
            placeholder="Search logs..."
            placeholderTextColor={settings.highContrastMode ? '#666666' : "#B0BEC5"}
            value={search}
            onChangeText={setSearch}
            accessible={true}
            accessibilityLabel="Search logs"
            accessibilityHint="Type to search through your security logs"
          />
          <TouchableOpacity style={styles.filterIcon} onPress={() => filterSheetRef.current?.expand()}>
            <Icon name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
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
      {renderFilterSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileIcon: {
    padding: 5,
  },
  headerContainer: {
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 10,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  clearFiltersText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  searchAndFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
  },
  filterIcon: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  cardSender: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  cardMessagePreview: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  filterSheetContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E'
  },
  filterSheetTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSectionTitle: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10,
  },
  filterOptionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterChip: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  highThreat: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B'
  },
  mediumThreat: {
    backgroundColor: 'rgba(255, 204, 102, 0.2)',
    borderColor: '#FFCC66'
  },
  lowThreat: {
    backgroundColor: 'rgba(102, 204, 153, 0.2)',
    borderColor: '#66CC99'
  },
  filterChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default LogHistoryScreen; 