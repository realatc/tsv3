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
  const confidence = Math.min(Math.round((score / 13) * 100) + 10, 100);

  let level: 'High' | 'Medium' | 'Low';
  if (score >= 5) level = 'High';
  else if (score >= 2) level = 'Medium';
  else level = 'Low';

  if (findings.length > 0) {
    summary = `This message was flagged for ${findings.join(', ')}.`;
  }

  return { level, confidence, score, breakdown, categories, summary };
}

export const getThreatColor = (level: string) => {
  const lowerLevel = level.toLowerCase();
  switch (lowerLevel) {
    case 'critical':
      return '#ff4d4d';
    case 'high':
      return '#ff8c00';
    case 'medium':
      return '#ffd700';
    case 'low':
      return '#32cd32';
    case 'none':
    case 'unknown':
      return '#888';
    default:
      return '#888';
  }
};

export const getThreatIcon = (level: string) => {
  const lowerLevel = level.toLowerCase();
  switch (lowerLevel) {
    case 'critical':
      return 'skull';
    case 'high':
      return 'flame';
    case 'medium':
      return 'alert-circle';
    case 'low':
      return 'shield-checkmark';
    case 'none':
    case 'unknown':
      return 'help-circle';
    default:
      return 'help-circle';
  }
};