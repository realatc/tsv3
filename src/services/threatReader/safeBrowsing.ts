import { Platform } from 'react-native';

const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

export async function checkUrlSafety(url: string): Promise<'safe' | 'malware' | 'phishing' | 'uncommon' | 'unknown'> {
  if (!API_KEY) return 'unknown';
  try {
    const body = {
      client: {
        clientId: 'threatsense-app',
        clientVersion: '1.0.0',
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data && data.matches && data.matches.length > 0) {
      const threatType = data.matches[0].threatType;
      if (threatType === 'MALWARE' || threatType === 'POTENTIALLY_HARMFUL_APPLICATION') return 'malware';
      if (threatType === 'SOCIAL_ENGINEERING') return 'phishing';
      if (threatType === 'UNWANTED_SOFTWARE') return 'uncommon';
      return 'unknown';
    }
    return 'safe';
  } catch (e) {
    return 'unknown';
  }
} 