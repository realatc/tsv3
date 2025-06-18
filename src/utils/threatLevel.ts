export function calculateThreatLevel({ nlpAnalysis, behavioralAnalysis, sender }: { nlpAnalysis: string; behavioralAnalysis: string; sender: string; }) {
  let score = 0;
  const nlp = nlpAnalysis.toLowerCase();
  const behavior = behavioralAnalysis.toLowerCase();
  const senderLower = sender.toLowerCase();

  const breakdown: { label: string; points: number }[] = [];

  if (nlp.includes('urgent') || nlp.includes('suspicious') || nlp.includes('threat')) {
    score += 2;
    breakdown.push({ label: 'NLP: urgent/suspicious/threat', points: 2 });
  }
  if (nlp.includes('impersonation') || nlp.includes('phishing') || nlp.includes('scam')) {
    score += 2;
    breakdown.push({ label: 'NLP: impersonation/phishing/scam', points: 2 });
  }
  if (behavior.includes('not in contacts')) {
    score += 1;
    breakdown.push({ label: 'Behavior: not in contacts', points: 1 });
  }
  if (behavior.includes('matches scam') || behavior.includes('matches robocall')) {
    score += 2;
    breakdown.push({ label: 'Behavior: matches scam/robocall', points: 2 });
  }
  if (senderLower.endsWith('@fakebank.com') || senderLower.includes('irs') || senderLower.includes('randomsms')) {
    score += 2;
    breakdown.push({ label: 'Sender: scam domain/irs/randomsms', points: 2 });
  }

  // Max possible score is 9
  const percentage = Math.round((score / 9) * 100);

  let level: 'High' | 'Medium' | 'Low';
  if (score >= 4) level = 'High';
  else if (score >= 2) level = 'Medium';
  else level = 'Low';

  return { level, percentage, score, breakdown };
} 