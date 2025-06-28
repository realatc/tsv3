import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuditLogEntry = {
  id: string;
  eventId: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
};

const getAuditLogKey = (eventId: string) => `auditlog_${eventId}`;

// Simple ID generator that works in React Native
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export async function addAuditLogEntry(eventId: string, entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'eventId'>) {
  try {
    console.log('[AuditLog] Attempting to create entry for eventId:', eventId, 'with entry:', entry);
    const logEntry: AuditLogEntry = {
      id: generateId(),
      eventId,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    const key = getAuditLogKey(eventId);
    console.log('[AuditLog] Using storage key:', key);
    const existing = await AsyncStorage.getItem(key);
    console.log('[AuditLog] Existing data:', existing);
    const logs: AuditLogEntry[] = existing ? JSON.parse(existing) : [];
    logs.push(logEntry);
    await AsyncStorage.setItem(key, JSON.stringify(logs));
    console.log('[AuditLog] Created entry for eventId:', eventId, logEntry);
    console.log('[AuditLog] Total entries for this event:', logs.length);
    return logEntry;
  } catch (error) {
    console.error('[AuditLog] Error creating audit log entry:', error);
    throw error;
  }
}

export async function getAuditLogEntries(eventId: string): Promise<AuditLogEntry[]> {
  try {
    const key = getAuditLogKey(eventId);
    console.log('[AuditLog] Retrieving entries for eventId:', eventId, 'using key:', key);
    const existing = await AsyncStorage.getItem(key);
    console.log('[AuditLog] Retrieved data:', existing);
    const entries = existing ? JSON.parse(existing) : [];
    console.log('[AuditLog] Parsed entries:', entries);
    return entries;
  } catch (error) {
    console.error('[AuditLog] Error retrieving audit log entries:', error);
    return [];
  }
}

export async function clearAuditLog(eventId: string) {
  const key = getAuditLogKey(eventId);
  await AsyncStorage.removeItem(key);
} 