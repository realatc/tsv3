import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useLogs } from '../context/LogContext';

const renderHeader = () => (
  <View style={[styles.row, styles.headerRow]}>
    <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Date</Text>
    <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Category</Text>
    <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Threat Level</Text>
    <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}> </Text>
  </View>
);

const LogHistoryScreen = () => {
  const navigation = useNavigation();
  const { logs } = useLogs();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => (navigation as any).navigate('LogDetail', { log: item })}>
      <View style={styles.row}>
        <Text style={[styles.cell, { flex: 2 }]}>{item.date}</Text>
        <Text style={[styles.cell, { flex: 2 }]}>{item.category}</Text>
        <Text style={[styles.cell, { flex: 1 }]}>{item.threat}</Text>
        <View style={[styles.cell, { flex: 1, alignItems: 'center' }]}> 
          {item.simulated && (
            <View style={styles.simBadge}>
              <Text style={styles.simBadgeText}>Sim</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Log History</Text>
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              {renderHeader()}
              <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
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
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  tableWrapper: {
    flex: 1,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  table: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 8,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    minHeight: 40,
  },
  headerRow: {
    backgroundColor: 'rgba(74,144,226,0.15)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cell: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#4A90E2',
  },
  simBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'center',
  },
  simBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LogHistoryScreen; 