import { Platform } from 'react-native';
// import { GOOGLE_SAFE_BROWSING_API_KEY } from '@env';

const API_KEY = 'AIzaSyDmEYqzlb-NIAfdEmGgVJW7mUc2xjCTg80';
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

export async function checkUrlSafety(url: string): Promise<'safe' | 'malware' | 'phishing' | 'uncommon' | 'unknown'> {
  if (!API_KEY) {
    console.warn('[checkUrlSafety] No API key provided');
    return 'unknown';
  }
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
    console.log('[checkUrlSafety] Sending request to Safe Browsing API:', API_URL);
    console.log('[checkUrlSafety] Request body:', JSON.stringify(body));
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log('[checkUrlSafety] Response status:', response.status);
    const data = await response.json();
    console.log('[checkUrlSafety] Response data:', data);
    if (data && data.matches && data.matches.length > 0) {
      const threatType = data.matches[0].threatType;
      if (threatType === 'MALWARE' || threatType === 'POTENTIALLY_HARMFUL_APPLICATION') return 'malware';
      if (threatType === 'SOCIAL_ENGINEERING') return 'phishing';
      if (threatType === 'UNWANTED_SOFTWARE') return 'uncommon';
      return 'unknown';
    }
    return 'safe';
  } catch (e) {
    console.error('[checkUrlSafety] Error:', e);
    return 'unknown';
  }
} 