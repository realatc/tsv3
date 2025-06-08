import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useLogs } from '../context/LogContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { ThreatBadge } from '../components/ThreatBadge';
import DropDownPicker from 'react-native-dropdown-picker';
import type { LogEntry } from '../context/LogContext';

const LogHistoryScreen = () => {
  const navigation = useNavigation();
  const { logs } = useLogs();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [threatFilter, setThreatFilter] = useState('All');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [threatOpen, setThreatOpen] = useState(false);
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

  const renderItem = ({ item }: { item: LogEntry }) => {
    let threat: { level: string; score?: number };
    if (typeof item.threat === 'object' && item.threat.level) {
      threat = item.threat;
    } else {
      threat = { level: typeof item.threat === 'string' && item.threat ? item.threat : 'Low', score: undefined };
    }
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => (navigation as any).navigate('LogDetail', { log: item })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <CategoryBadge category={item.category} />
          <View style={{ marginLeft: 8 }}>
            <ThreatBadge level={threat.level} score={threat.score} />
          </View>
          {item.simulated && (
            <View style={styles.simBadge}><Text style={styles.simBadgeText}>Sim</Text></View>
          )}
        </View>
        <View style={styles.cardSenderRow}>
          <Text style={styles.cardSender}>{item.sender}</Text>
        </View>
        <Text style={styles.cardMessagePreview} numberOfLines={2}>{item.message}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Logs</Text>
          <View style={styles.searchBarRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search sender or message..."
              placeholderTextColor="#B0BEC5"
              value={search}
              onChangeText={setSearch}
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
                style={{ backgroundColor: '#263159', borderColor: '#E53935' }}
                dropDownContainerStyle={{ backgroundColor: '#263159', borderColor: '#E53935', elevation: 5 }}
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
    marginBottom: 6,
  },
  cardDate: {
    color: '#B0BEC5',
    fontSize: 15,
    marginRight: 10,
    fontWeight: 'bold',
  },
  cardSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardSender: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default LogHistoryScreen; 