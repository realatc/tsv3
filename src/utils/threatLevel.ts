export function calculateThreatLevel({
  nlpAnalysis,
  behavioralAnalysis,
  sender,
}: {
  nlpAnalysis: string;
  behavioralAnalysis: string;
  sender: string;
}) {
  let score = 0;
  const nlp = nlpAnalysis.toLowerCase();
  const behavior = behavioralAnalysis.toLowerCase();
  const senderLower = sender.toLowerCase();

  const breakdown: { label: string; points: number }[] = [];
  const categories: string[] = [];
  let summary = 'No significant threat indicators found.';
  const findings: string[] = [];

  // NLP Analysis
  if (nlp.includes('urgent') || nlp.includes('suspicious') || nlp.includes('threat')) {
    score += 2;
    breakdown.push({ label: 'NLP: urgent/suspicious/threat', points: 2 });
    findings.push('urgent or threatening language');
    if (!categories.includes('Urgent')) categories.push('Urgent');
  }
  if (nlp.includes('impersonation') || nlp.includes('phishing') || nlp.includes('scam')) {
    score += 3;
    breakdown.push({ label: 'NLP: impersonation/phishing/scam', points: 3 });
    findings.push('signs of impersonation or phishing');
    if (!categories.includes('Impersonation')) categories.push('Impersonation');
    if (!categories.includes('Phishing')) categories.push('Phishing');
    if (!categories.includes('Scam')) categories.push('Scam');
  }

  // Behavioral Analysis
  if (behavior.includes('unusual for sender')) {
    score += 1;
    breakdown.push({ label: 'Behavior: unusual for sender', points: 1 });
    findings.push('behavior unusual for the sender');
    if (!categories.includes('Suspicious')) categories.push('Suspicious');
  }
  if (behavior.includes('matches scam') || behavior.includes('matches phishing')) {
    score += 3;
    breakdown.push({ label: 'Behavior: matches scam/phishing pattern', points: 3 });
    findings.push('behavior matching known scam patterns');
    if (!categories.includes('Scam')) categories.push('Scam');
    if (!categories.includes('Phishing')) categories.push('Phishing');
  }
  if (behavior.includes('unsolicited')) {
    score += 1;
    breakdown.push({ label: 'Behavior: unsolicited communication', points: 1 });
    findings.push('it appears to be an unsolicited message');
    if (!categories.includes('Unsolicited')) categories.push('Unsolicited');
  }

  // Sender Analysis
  if (senderLower.includes('support') && !senderLower.includes('official')) {
    score += 1;
    breakdown.push({ label: 'Sender: unofficial support email', points: 1 });
    findings.push('an unofficial support email address');
    if (!categories.includes('Unofficial')) categories.push('Unofficial');
  }
  if (senderLower.match(/paypal.*support|support.*paypal/)) {
     score += 2;
     breakdown.push({ label: 'Sender: impersonates PayPal', points: 2 });
     findings.push('a sender address impersonating PayPal');
     if (!categories.includes('Impersonation')) categories.push('Impersonation');
  }

  // Max possible score is now 13
  const percentage = Math.min(Math.round((score / 13) * 100) + 10, 100);

  let level: 'High' | 'Medium' | 'Low';
  if (score >= 5) level = 'High';
  else if (score >= 2) level = 'Medium';
  else level = 'Low';

  if (findings.length > 0) {
    summary = `This message was flagged for ${findings.join(', ')}.`;
  }

  return { level, percentage, score, breakdown, categories, summary };
}

// Standardized severity colors for consistency across the app
export const SEVERITY_COLORS = {
  critical: '#FF4444', // Bright red
  high: '#FF8800',     // Orange
  medium: '#FFAA00',   // Yellow
  low: '#44AA44',      // Green
  default: '#888888'   // Gray
} as const;

// Standardized severity icons for consistency
export const SEVERITY_ICONS = {
  critical: 'alert-octagon',
  high: 'alert-circle',
  medium: 'alert',
  low: 'information',
  default: 'help-circle'
} as const;

// Helper function to get consistent severity color
export const getSeverityColor = (severity: string): string => {
  const lowerSeverity = severity.toLowerCase() as keyof typeof SEVERITY_COLORS;
  return SEVERITY_COLORS[lowerSeverity] || SEVERITY_COLORS.default;
};

// Helper function to get consistent severity icon
export const getSeverityIcon = (severity: string): string => {
  const lowerSeverity = severity.toLowerCase() as keyof typeof SEVERITY_ICONS;
  return SEVERITY_ICONS[lowerSeverity] || SEVERITY_ICONS.default;
};