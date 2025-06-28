import { LogContextType, LogEntry } from '../../context/LogContext';
import { addAuditLogEntry } from '../auditLog';

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

export const addSampleLogs = async (logContext: LogContextType) => {
  const { addLog, clearAllLogs } = logContext;
  clearAllLogs();
  
  // Add sample texts
  for (let i = 0; i < sampleTexts.length; i++) {
    const text = sampleTexts[i];
    const id = `text-${i}-${Date.now()}`;
    await addLog({
      id,
      category: 'Text',
      sender: text.sender,
      message: text.message,
      date: new Date().toISOString(),
      nlpAnalysis: text.message.includes('URGENT') || text.message.includes('prize') ? 'Urgent language detected, possible phishing.' : 'No threat detected.',
      behavioralAnalysis: text.sender.includes('555') ? 'Sender not in contacts. Similar pattern to previous scams.' : 'Sender in contacts, normal behavior.',
      metadata: {
        device: 'iPhone 15 Pro',
        location: 'New York, NY',
        receivedAt: new Date().toISOString(),
        messageLength: text.message.length,
      },
    });
  }

  // Add sample emails
  for (let i = 0; i < sampleEmails.length; i++) {
    const email = sampleEmails[i];
    const id = `email-${i}-${Date.now()}`;
    await addLog({
      id,
      category: 'Mail',
      sender: email.sender,
      message: email.message,
      date: new Date().toISOString(),
      nlpAnalysis: email.message.includes('Security Alert') || email.message.includes('suspicious login') ? 'Urgent language detected, possible phishing.' : 'No threat detected.',
      behavioralAnalysis: email.sender.includes('yourbank') ? 'Sender not in contacts. Similar pattern to previous scams.' : 'Sender in contacts, normal behavior.',
      metadata: {
        device: 'MacBook Pro',
        location: 'San Francisco, CA',
        receivedAt: new Date().toISOString(),
        messageLength: email.message.length,
      },
    });
  }
  
  // Add sample calls
  for (let i = 0; i < sampleCalls.length; i++) {
    const call = sampleCalls[i];
    const id = `call-${i}-${Date.now()}`;
    await addLog({
      id,
      category: 'Phone Call',
      sender: call.sender,
      message: call.message,
      date: new Date().toISOString(),
      nlpAnalysis: call.sender.includes('SCAM') ? 'Possible scam call detected.' : 'No threat detected.',
      behavioralAnalysis: call.sender.includes('SCAM') ? 'Number not in contacts. Matches scam call patterns.' : 'Number in contacts, normal behavior.',
      metadata: {
        device: 'Samsung Galaxy S23',
        location: 'Chicago, IL',
        receivedAt: new Date().toISOString(),
        messageLength: call.message.length,
      },
    });
  }
};

export const addHighThreatLog = async (logContext: LogContextType) => {
  const message = 'FINAL WARNING: Your social security number has been suspended due to fraudulent activity. You must call us immediately at 1-800-FAKE-IRS to avoid legal action. This is your last chance.';
  await logContext.addLog({
    id: `high-threat-${Date.now()}`,
    category: 'Text',
    sender: '1-555-DANGER-NOW',
    message: message,
    date: new Date().toISOString(),
    nlpAnalysis: 'Urgent language detected, possible phishing. Authority impersonation detected.',
    behavioralAnalysis: 'Sender not in contacts. Matches scam patterns.',
    metadata: {
      device: 'iPhone 15 Pro',
      location: 'Miami, FL',
      receivedAt: new Date().toISOString(),
      messageLength: message.length,
    },
  });
};

export const addPhishingEmail = async (logContext: LogContextType) => {
  const message = 'Subject: Account Hold Notification\n\nDear Customer,\n\nWe have detected unusual activity on your PayPal account. For your safety, we have placed a temporary hold on it. Please log in at your earliest convenience to verify your identity and restore access.\n\nClick here: http://pay-pal-services-login.com/auth\n\nThank you,\nPayPal Support Team';
  await logContext.addLog({
    id: `phishing-email-${Date.now()}`,
    category: 'Mail',
    sender: 'customer-support@pay-pal-services.com',
    message: message,
    date: new Date().toISOString(),
    nlpAnalysis: 'Urgent language detected, possible phishing. Authority impersonation detected.',
    behavioralAnalysis: 'Sender not in contacts. Matches phishing patterns.',
    metadata: {
      device: 'Windows PC',
      location: 'Los Angeles, CA',
      receivedAt: new Date().toISOString(),
      messageLength: message.length,
    },
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
    metadata: {
      device: 'iPhone 14',
      location: 'Houston, TX',
      receivedAt: new Date().toISOString(),
      messageLength: text.message.length,
    },
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

export const addSentryDemoLogs = async (logContext: LogContextType) => {
  // Low-risk log
  await logContext.addLog({
    id: `demo-low-${Date.now()}`,
    category: 'Text',
    sender: 'Friend',
    message: 'Hey! Are we still on for lunch tomorrow?',
    date: new Date().toISOString(),
    nlpAnalysis: 'No threat detected.',
    behavioralAnalysis: 'Sender in contacts, normal behavior.',
    metadata: {
      device: 'iPhone 15 Pro',
      location: 'New York, NY',
      receivedAt: new Date().toISOString(),
      messageLength: 32,
    },
    demoType: 'sentry',
  });
  await new Promise(res => setTimeout(res, 1000));

  // Medium-risk log
  await logContext.addLog({
    id: `demo-medium-${Date.now()}`,
    category: 'Mail',
    sender: 'unknown@randommail.com',
    message: 'Hi, I have a business proposal for you. Please reply with your phone number.',
    date: new Date().toISOString(),
    nlpAnalysis: 'Suspicious request detected.',
    behavioralAnalysis: 'Sender not in contacts. Unusual request.',
    metadata: {
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      receivedAt: new Date().toISOString(),
      messageLength: 68,
    },
    demoType: 'sentry',
  });
  await new Promise(res => setTimeout(res, 1000));

  // High-risk log (randomized, always triggers High)
  const highRiskScenarios = [
    {
      threatType: 'Bank Fraud',
      message: 'ALERT: Your bank account is locked. Visit http://fakebank-login.com to unlock.',
      nlpAnalysis: 'Urgent language detected, possible phishing. Authority impersonation detected.',
      behavioralAnalysis: 'Sender not in contacts. Matches scam patterns.',
      johnResponses: [
        "This doesn't look legitimate. Be cautious and don't interact.",
        "Definitely a scam. Don't click any links.",
        "Looks like a phishing attempt. Ignore and delete it.",
      ]
    },
    {
      threatType: 'Identity Theft Attempt',
      message: 'URGENT: Suspicious activity detected. Please verify your identity at http://id-verify-now.com.',
      nlpAnalysis: 'Urgent language detected, possible identity theft.',
      behavioralAnalysis: 'Sender not in contacts. Unusual request for sensitive info.',
      johnResponses: [
        "Don't provide any info. This is a classic identity theft scam.",
        "Ignore this message. It's not from a real company.",
        "Be careful, this is a common scam technique.",
      ]
    },
    {
      threatType: 'Account Takeover',
      message: 'Your account password was reset. If this wasn\'t you, secure your account now: http://secure-now.com',
      nlpAnalysis: 'Account security warning, possible takeover attempt.',
      behavioralAnalysis: 'Sender not in contacts. Matches account takeover patterns.',
      johnResponses: [
        "Change your password immediately if you haven't already.",
        "Don't click the link, go directly to your account website.",
        "This could be a takeover attempt. Stay alert!",
      ]
    },
  ];
  const scenario = highRiskScenarios[Math.floor(Math.random() * highRiskScenarios.length)];
  const johnResponse = scenario.johnResponses[Math.floor(Math.random() * scenario.johnResponses.length)];
  const highLogId = `demo-high-${Date.now()}`;
  await logContext.addLog({
    id: highLogId,
    category: 'Text',
    sender: '1-800-ALERT',
    message: scenario.message,
    date: new Date().toISOString(),
    nlpAnalysis: scenario.nlpAnalysis,
    behavioralAnalysis: scenario.behavioralAnalysis,
    metadata: {
      device: 'iPhone 15 Pro',
      location: 'Miami, FL',
      receivedAt: new Date().toISOString(),
      messageLength: scenario.message.length,
    },
    demoType: 'sentry',
    sentryDemoJohnResponse: johnResponse,
    sentryDemoThreatType: scenario.threatType,
    forceThreatLevel: 'High',
  });
};
