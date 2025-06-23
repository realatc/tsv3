import { LogContextType, LogEntry } from '../../context/LogContext';

const sampleTexts = [
  { sender: '1-555-123-4567', message: 'URGENT: Your account has been compromised. Click here to verify your identity: http://bit.ly/2YtZmF5' },
  { sender: 'Mom', message: 'Hey, running late for dinner. Can you start without me?' },
  { sender: '1-555-987-6543', message: 'You\'ve won a FREE cruise! Claim your prize now: https://short.url/gift' },
];

const sampleEmails = [
  { sender: 'support@yourbank.com', message: 'Subject: Security Alert\n\nWe noticed a suspicious login on your account. Please confirm your details at http://yourbank-security.com/verify' },
  { sender: 'newsletter@techweekly.com', message: 'Subject: Your weekly tech roundup\n\nThis week in tech: AI breakthroughs, new gadgets, and more!' },
];

const sampleCalls = [
  { sender: '1-800-555-SCAM', message: 'Missed call. Duration: 120s' },
  { sender: '1-234-567-8901', message: 'Missed call. Duration: 45s' },
];

export const addSampleLogs = (logContext: LogContextType) => {
  const { addLog, clearAllLogs } = logContext;
  clearAllLogs();
  
  // Add sample texts
  sampleTexts.forEach((text, i) => addLog({
    id: `text-${i}-${Date.now()}`,
    category: 'Text',
    sender: text.sender,
    message: text.message,
    date: new Date().toISOString(),
    nlpAnalysis: text.message.includes('URGENT') || text.message.includes('prize') ? 'Urgent language detected, possible phishing.' : 'No threat detected.',
    behavioralAnalysis: text.sender.includes('555') ? 'Sender not in contacts. Similar pattern to previous scams.' : 'Sender in contacts, normal behavior.',
    metadata: { device: '', location: '', receivedAt: '', messageLength: 0 }
  }));

  // Add sample emails
  sampleEmails.forEach((email, i) => addLog({
    id: `email-${i}-${Date.now()}`,
    category: 'Mail',
    sender: email.sender,
    message: email.message,
    date: new Date().toISOString(),
    nlpAnalysis: email.message.includes('Security Alert') || email.message.includes('suspicious login') ? 'Urgent language detected, possible phishing.' : 'No threat detected.',
    behavioralAnalysis: email.sender.includes('yourbank') ? 'Sender not in contacts. Similar pattern to previous scams.' : 'Sender in contacts, normal behavior.',
    metadata: { device: '', location: '', receivedAt: '', messageLength: 0 }
  }));
  
  // Add sample calls
  sampleCalls.forEach((call, i) => addLog({
    id: `call-${i}-${Date.now()}`,
    category: 'Phone Call',
    sender: call.sender,
    message: call.message,
    date: new Date().toISOString(),
    nlpAnalysis: call.sender.includes('SCAM') ? 'Possible scam call detected.' : 'No threat detected.',
    behavioralAnalysis: call.sender.includes('SCAM') ? 'Number not in contacts. Matches scam call patterns.' : 'Number in contacts, normal behavior.',
    metadata: { device: '', location: '', receivedAt: '', messageLength: 0 }
  }));
};

export const addHighThreatLog = (logContext: LogContextType) => {
  logContext.addLog({
    id: `high-threat-${Date.now()}`,
    category: 'Text',
    sender: '1-555-DANGER-NOW',
    message: 'FINAL WARNING: Your social security number has been suspended due to fraudulent activity. You must call us immediately at 1-800-FAKE-IRS to avoid legal action. This is your last chance.',
    date: new Date().toISOString(),
    nlpAnalysis: 'Urgent language detected, possible phishing. Authority impersonation detected.',
    behavioralAnalysis: 'Sender not in contacts. Matches scam patterns.',
    metadata: { device: '', location: '', receivedAt: '', messageLength: 0 }
  });
};

export const addPhishingEmail = (logContext: LogContextType) => {
  logContext.addLog({
    id: `phishing-email-${Date.now()}`,
    category: 'Mail',
    sender: 'customer-support@pay-pal-services.com',
    message: 'Subject: Account Hold Notification\n\nDear Customer,\n\nWe have detected unusual activity on your PayPal account. For your safety, we have placed a temporary hold on it. Please log in at your earliest convenience to verify your identity and restore access.\n\nClick here: http://pay-pal-services-login.com/auth\n\nThank you,\nPayPal Support Team',
    date: new Date().toISOString(),
    nlpAnalysis: 'Urgent language detected, possible phishing. Authority impersonation detected.',
    behavioralAnalysis: 'Sender not in contacts. Matches phishing patterns.',
    metadata: { device: '', location: '', receivedAt: '', messageLength: 0 }
  });
};

export const addScamTexts = (logContext: LogContextType) => {
  const scamTexts = [
    { sender: '1-555-GIFT-CARD', message: 'You have been selected for a $1000 gift card from Amazon. To claim, please provide your personal information here: http://amazn-gifts.net/claim' },
    { sender: '1-555-TAX-FRAUD', message: 'IRS Notice: We have found a miscalculation in your tax return from 2022. A warrant has been issued for your arrest. Contact us immediately at 1-888-FAKE-TAX to resolve this.' },
    { sender: 'Netflix', message: 'Your Netflix subscription has been suspended due to a payment issue. Please update your payment details here to continue watching: https://netflx-billing-update.io' },
  ];

  scamTexts.forEach((text, i) => logContext.addLog({
    id: `scam-text-${i}-${Date.now()}`,
    category: 'Text',
    sender: text.sender,
    message: text.message,
    date: new Date().toISOString(),
    nlpAnalysis: 'Urgent language detected, possible phishing. Authority impersonation detected.',
    behavioralAnalysis: 'Sender not in contacts. Matches scam patterns.',
    metadata: { device: '', location: '', receivedAt: '', messageLength: 0 }
  }));
};

export const clearAllLogs = (logContext: LogContextType) => {
  logContext.clearAllLogs();
};

export const addGeorgiaMVCFraud = (logContext: LogContextType) => {
  const message = `Georgia Motor Vehicle Commission (MVC) Final Notice: Enforcement Begins June 21st.
Our records show that as of today, you still have an outstanding traffic ticket.
Per Georgia Traffic Code 163-11-24, if you do not pay by June 20, 2025, we will take the following actions:
1. Report to the MVC Violation Database
2. Suspend your vehicle registration effective June 20th
3. Suspend driving privileges for 30 days
4. If you pay at a toll booth, a 35% service fee will be charged
5. You may be prosecuted and your credit score will be affected
Pay Now:
https://dds.gov-faciav.works/pay

Please pay now, before enforcement, to avoid a license suspension and other legal consequences.
(Reply Y and reopen this message to click the link, or copy it to your browser.)`;

  logContext.addLog({
    id: `georgia-mvc-fraud-${Date.now()}`,
    category: 'Text',
    sender: '+63 910 942 9787',
    message,
    date: new Date().toISOString(),
    nlpAnalysis: '{"sentiment":"negative","keywords":["outstanding traffic ticket","suspend","prosecuted","license suspension","pay now"],"entities":{"organizations":["Georgia Motor Vehicle Commission","MVC"],"locations":["Georgia"]},"summary":"A fraudulent message claiming to be from the Georgia MVC about an outstanding traffic ticket, threatening legal action and license suspension to pressure the recipient into paying through a suspicious link."}',
    behavioralAnalysis: '{"urgency":true,"pressureTactics":true,"unusualRequest":true,"grammarErrors":false,"impersonation":"government","suspiciousLink":"https://dds.gov-faciav.works/pay"}',
    metadata: { device: 'iPhone 15 Pro', location: 'Atlanta, GA', receivedAt: new Date().toISOString(), messageLength: message.length }
  });
};
