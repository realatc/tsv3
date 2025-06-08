export function calculateThreatLevel({ nlpAnalysis, behavioralAnalysis, sender }: { nlpAnalysis: string; behavioralAnalysis: string; sender: string; }) {
  let score = 0;
  const nlp = nlpAnalysis.toLowerCase();
  const behavior = behavioralAnalysis.toLowerCase();
  const senderLower = sender.toLowerCase();

  if (nlp.includes('urgent') || nlp.includes('suspicious') || nlp.includes('threat')) score += 2;
  if (nlp.includes('impersonation') || nlp.includes('phishing') || nlp.includes('scam')) score += 2;
  if (behavior.includes('not in contacts')) score += 1;
  if (behavior.includes('matches scam') || behavior.includes('matches robocall')) score += 2;
  if (senderLower.endsWith('@fakebank.com') || senderLower.includes('irs') || senderLower.includes('randomsms')) score += 2;

  // Max possible score is 9
  const percentage = Math.min(Math.round((score / 9) * 100), 100);

  let level: 'High' | 'Medium' | 'Low';
  if (score >= 4) level = 'High';
  else if (score >= 2) level = 'Medium';
  else level = 'Low';

  return { level, percentage };
} 