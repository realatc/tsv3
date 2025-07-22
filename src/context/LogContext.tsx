import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { calculateThreatLevel } from '../utils/threatLevel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentiment from 'sentiment';
import { addAuditLogEntry } from '../utils/auditLog';
import { threatAnalysisService } from '../services/threatAnalysisService';

export type LogEntry = {
  id: string;
  date: string;
  category: string;
  threat: string | { level: 'High' | 'Medium' | 'Low'; percentage: number; score: number; breakdown?: { label: string; points: number }[] };
  sender: string;
  message: string;
  nlpAnalysis: string;
  behavioralAnalysis: string;
  metadata: {
    device: string;
    location: string;
    receivedAt: string;
    messageLength: number;
  };
  // Sentry Demo support
  demoType?: 'sentry';
  sentryDemoJohnResponse?: string;
  sentryDemoThreatType?: string;
  forceThreatLevel?: 'High' | 'Critical' | 'Medium' | 'Low';
};

export type BlockedSender = {
  sender: string;
  blockedAt: string;
  reason: string;
  category: string;
};

const initialLogs: LogEntry[] = [
  {
    id: '1',
    date: '2025-07-22',
    category: 'Mail',
    sender: 'scammer@example.com',
    message: 'You have won a prize! Click here to claim.',
    nlpAnalysis: 'Likely phishing. Contains urgent language and suspicious link.',
    behavioralAnalysis: 'Sender is not in contacts. Similar pattern to previous scams.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2025-07-22T10:15:00Z', messageLength: 45 },
    threat: '',
  },
  {
    id: '2',
    date: '2025-07-22',
    category: 'Text',
    sender: '+15551234567',
    message: 'Your account is locked. Reply to unlock.',
    nlpAnalysis: 'Urgency and threat detected. Possible scam.',
    behavioralAnalysis: 'Unusual sender. Similar to previous high-risk texts.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2025-07-22T11:20:00Z', messageLength: 38 },
    threat: '',
  },
  {
    id: '3',
    date: '2025-07-22',
    category: 'Phone Call',
    sender: '+1234567890',
    message: 'This is the IRS. Call us back immediately.',
    nlpAnalysis: 'Authority impersonation. Urgent callback.',
    behavioralAnalysis: 'Number not in contacts. Matches scam call patterns.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2025-07-22T14:05:00Z', messageLength: 36 },
    threat: '',
  },
  {
    id: '4',
    date: '2025-07-21',
    category: 'Mail',
    sender: 'unknown@random.com',
    message: 'Limited time offer just for you!',
    nlpAnalysis: 'Marketing language. Possible spam.',
    behavioralAnalysis: 'Sender not recognized. Similar to previous offers.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2025-07-21T09:45:00Z', messageLength: 29 },
    threat: '',
  },
  {
    id: '5',
    date: '2025-07-21',
    category: 'Text',
    sender: '+15557654321',
    message: 'Hey, are we still on for lunch?',
    nlpAnalysis: 'No threat detected.',
    behavioralAnalysis: 'Sender in contacts. Normal behavior.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2025-07-21T13:30:00Z', messageLength: 28 },
    threat: '',
  },
];

const withThreat = (log: Omit<LogEntry, 'threat'>): LogEntry => ({
  ...log,
  threat: (log as any).forceThreatLevel || calculateThreatLevel(log),
});

const STORAGE_KEY = '@threatsense/logs';
const BLOCKED_SENDERS_KEY = '@threatsense/blocked_senders';

export type LogContextType = {
  logs: LogEntry[];
  blockedSenders: BlockedSender[];
  addLog: (log: Omit<LogEntry, 'threat'>) => void;
  deleteLog: (id: string) => void;
  clearAllLogs: () => void;
  blockSender: (sender: string, reason: string, category: string) => void;
  unblockSender: (sender: string) => void;
  isSenderBlocked: (sender: string) => boolean;
  getBlockedSendersCount: () => number;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

// Mock contacts list (replace with real contacts integration as needed)
const contacts = [
  'friend@trusted.com',
  '+1234567890',
];

function runNlpAnalysis(message: string): string {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(message);
  const msg = message.toLowerCase();
  if (msg.includes('urgent') || msg.includes('click here') || msg.includes('reset your password')) {
    return 'Urgent language detected, possible phishing.';
  }
  if (msg.includes('prize') || msg.includes('winner') || msg.includes('claim')) {
    return 'Possible scam or spam detected.';
  }
  if (result.score < -2) {
    return 'Negative sentiment, possible threat.';
  }
  if (result.score > 2) {
    return 'Positive sentiment, likely safe.';
  }
  return 'No threat detected.';
}

function runBehavioralAnalysis(sender: string, logs: LogEntry[]): string {
  const isInContacts = contacts.includes(sender);
  const senderLogs = logs.filter(log => log.sender === sender);
  if (!isInContacts) {
    if (senderLogs.length > 2) {
      return 'Sender not in contacts, repeated suspicious activity.';
    }
    return 'Sender not in contacts.';
  }
  return 'Sender in contacts, normal behavior.';
}

function normalizeSender(category: string, sender: string): string {
  if (category === 'Mail') {
    // If not an email, fake one
    if (!sender.includes('@')) return sender + '@example.com';
    return sender;
  }
  if (category === 'Text' || category === 'Phone Call') {
    // If not a phone number, fake one
    if (!sender.match(/^\+?\d{10,15}$/)) return '+1' + Math.floor(Math.random() * 9000000000 + 1000000000);
    return sender;
  }
  return sender;
}

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [blockedSenders, setBlockedSenders] = useState<BlockedSender[]>([]);

  // Load logs and blocked senders from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const [storedLogs, storedBlockedSenders] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(BLOCKED_SENDERS_KEY)
        ]);
        
        // Force use of new initialLogs for now to ensure updated dates
        setLogs(initialLogs.map(withThreat));
        
        if (storedBlockedSenders) {
          setBlockedSenders(JSON.parse(storedBlockedSenders));
        }
      } catch (e) {
        setLogs(initialLogs.map(withThreat));
        setBlockedSenders([]);
      }
    })();
  }, []);

  // Save logs to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // Save blocked senders to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(BLOCKED_SENDERS_KEY, JSON.stringify(blockedSenders));
  }, [blockedSenders]);

  const addLog = async (log: Omit<LogEntry, 'threat'>) => {
    // If nlpAnalysis or behavioralAnalysis are missing, generate them
    const nlpAnalysis = log.nlpAnalysis || runNlpAnalysis(log.message);
    const behavioralAnalysis = log.behavioralAnalysis || runBehavioralAnalysis(log.sender, logs);
    const normalizedSender = (log as any).demoType === 'sentry' ? log.sender : normalizeSender(log.category, log.sender);
    const newLog = withThreat({ ...log, nlpAnalysis, behavioralAnalysis, sender: normalizedSender });
    console.log('[addLog] Created log:', { id: newLog.id, threat: newLog.threat, forceThreatLevel: newLog.forceThreatLevel });
    
    // Add log to state and persist to AsyncStorage before analysis
    let updatedLogs: LogEntry[] = [];
    setLogs(prev => {
      updatedLogs = [newLog, ...prev];
      return updatedLogs;
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newLog, ...logs]));
    
    // Add audit log entry for creation
    try {
      await addAuditLogEntry(newLog.id, {
        action: 'created',
        actor: 'system',
        details: `Event created: ${newLog.category} from ${newLog.sender}`
      });
    } catch (error) {
      console.error('[LogContext] Error creating audit log entry:', error);
    }

    // Trigger threat analysis for Sentry Mode notifications
    try {
      await threatAnalysisService.analyzeText(newLog.message, newLog.sender, newLog.id, newLog);
    } catch (error) {
      console.error('[LogContext] Error in threat analysis:', error);
    }
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const clearAllLogs = () => setLogs([]);

  const blockSender = (sender: string, reason: string, category: string) => {
    const newBlockedSender: BlockedSender = {
      sender,
      blockedAt: new Date().toISOString(),
      reason,
      category
    };
    setBlockedSenders(prev => {
      // Remove if already exists and add new one
      const filtered = prev.filter(blocked => blocked.sender !== sender);
      return [...filtered, newBlockedSender];
    });
  };

  const unblockSender = (sender: string) => {
    setBlockedSenders(prev => prev.filter(blocked => blocked.sender !== sender));
  };

  const isSenderBlocked = (sender: string): boolean => {
    return blockedSenders.some(blocked => blocked.sender === sender);
  };

  const getBlockedSendersCount = (): number => {
    return blockedSenders.length;
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        blockedSenders,
        addLog,
        deleteLog,
        clearAllLogs,
        blockSender,
        unblockSender,
        isSenderBlocked,
        getBlockedSendersCount,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}; 