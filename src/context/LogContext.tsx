import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { calculateThreatLevel } from '../utils/threatLevel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentiment from 'sentiment';

export type LogEntry = {
  id: string;
  date: string;
  category: string;
  threat: string;
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
  simulated?: boolean;
};

const initialLogs: LogEntry[] = [
  {
    id: '1',
    date: '2024-06-01',
    category: 'Mail',
    sender: 'scammer@example.com',
    message: 'You have won a prize! Click here to claim.',
    nlpAnalysis: 'Likely phishing. Contains urgent language and suspicious link.',
    behavioralAnalysis: 'Sender is not in contacts. Similar pattern to previous scams.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-01T10:15:00Z', messageLength: 45 },
    threat: '',
  },
  {
    id: '2',
    date: '2024-06-02',
    category: 'Text',
    sender: 'fraudster@texts.com',
    message: 'Your account is locked. Reply to unlock.',
    nlpAnalysis: 'Urgency and threat detected. Possible scam.',
    behavioralAnalysis: 'Unusual sender. Similar to previous high-risk texts.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-02T11:20:00Z', messageLength: 38 },
    threat: '',
  },
  {
    id: '3',
    date: '2024-06-03',
    category: 'Phone Call',
    sender: '+1234567890',
    message: 'This is the IRS. Call us back immediately.',
    nlpAnalysis: 'Authority impersonation. Urgent callback.',
    behavioralAnalysis: 'Number not in contacts. Matches scam call patterns.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-03T14:05:00Z', messageLength: 36 },
    threat: '',
  },
  {
    id: '4',
    date: '2024-06-04',
    category: 'Mail',
    sender: 'unknown@random.com',
    message: 'Limited time offer just for you!',
    nlpAnalysis: 'Marketing language. Possible spam.',
    behavioralAnalysis: 'Sender not recognized. Similar to previous offers.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-04T09:45:00Z', messageLength: 29 },
    threat: '',
  },
  {
    id: '5',
    date: '2024-06-05',
    category: 'Text',
    sender: 'friend@trusted.com',
    message: 'Hey, are we still on for lunch?',
    nlpAnalysis: 'No threat detected.',
    behavioralAnalysis: 'Sender in contacts. Normal behavior.',
    metadata: { device: 'iPhone 15', location: 'Austin, TX', receivedAt: '2024-06-05T13:30:00Z', messageLength: 28 },
    threat: '',
  },
];

const withThreat = (log: Omit<LogEntry, 'threat'>): LogEntry => ({
  ...log,
  threat: calculateThreatLevel(log),
});

const STORAGE_KEY = '@threatsense/logs';

const LogContext = createContext<{
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'threat'>) => void;
  clearLogs: () => void;
} | undefined>(undefined);

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

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Load logs from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setLogs(JSON.parse(stored));
        } else {
          setLogs(initialLogs.map(withThreat));
        }
      } catch (e) {
        setLogs(initialLogs.map(withThreat));
      }
    })();
  }, []);

  // Save logs to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = (log: Omit<LogEntry, 'threat'>) => {
    // If nlpAnalysis or behavioralAnalysis are missing, generate them
    const nlpAnalysis = log.nlpAnalysis || runNlpAnalysis(log.message);
    const behavioralAnalysis = log.behavioralAnalysis || runBehavioralAnalysis(log.sender, logs);
    setLogs(prev => [withThreat({ ...log, nlpAnalysis, behavioralAnalysis }), ...prev]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) throw new Error('useLogs must be used within a LogProvider');
  return context;
}; 