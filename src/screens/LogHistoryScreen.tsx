import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const mockData = [
  { id: '1', date: '2024-06-01', category: 'Mail', threat: 'Low', sender: 'scammer@example.com', message: 'You have won a prize! Click here to claim.', nlpAnalysis: 'Likely phishing. Contains urgent language and suspicious link.', behavioralAnalysis: 'Sender is not in contacts. Similar pattern to previous scams.', metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-01T10:15:00Z', messageLength: 45 } },
  { id: '2', date: '2024-06-02', category: 'Text', threat: 'High', sender: 'fraudster@texts.com', message: 'Your account is locked. Reply to unlock.', nlpAnalysis: 'Urgency and threat detected. Possible scam.', behavioralAnalysis: 'Unusual sender. Similar to previous high-risk texts.', metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-02T11:20:00Z', messageLength: 38 } },
  { id: '3', date: '2024-06-03', category: 'Phone Call', threat: 'Medium', sender: '+1234567890', message: 'This is the IRS. Call us back immediately.', nlpAnalysis: 'Authority impersonation. Urgent callback.', behavioralAnalysis: 'Number not in contacts. Matches scam call patterns.', metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-03T14:05:00Z', messageLength: 36 } },
  { id: '4', date: '2024-06-04', category: 'Mail', threat: 'Medium', sender: 'unknown@random.com', message: 'Limited time offer just for you!', nlpAnalysis: 'Marketing language. Possible spam.', behavioralAnalysis: 'Sender not recognized. Similar to previous offers.', metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-04T09:45:00Z', messageLength: 29 } },
  { id: '5', date: '2024-06-05', category: 'Text', threat: 'Low', sender: 'friend@trusted.com', message: 'Hey, are we still on for lunch?', nlpAnalysis: 'No threat detected.', behavioralAnalysis: 'Sender in contacts. Normal behavior.', metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-05T13:30:00Z', messageLength: 28 } },
];

const renderHeader = () => (
  <View style={[styles.row, styles.headerRow]}>
    <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Date</Text>
    <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Category</Text>
    <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Threat Level</Text>
  </View>
);

const LogHistoryScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: typeof mockData[0] }) => (
    <TouchableOpacity onPress={() => (navigation as any).navigate('LogDetail', { log: item })}>
      <View style={styles.row}>
        <Text style={[styles.cell, { flex: 2 }]}>{item.date}</Text>
        <Text style={[styles.cell, { flex: 2 }]}>{item.category}</Text>
        <Text style={[styles.cell, { flex: 1 }]}>{item.threat}</Text>
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
                data={mockData}
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
});

export default LogHistoryScreen; 