import { Platform } from 'react-native';
// import { GOOGLE_CSE_API_KEY, GOOGLE_CSE_ID, GEMINI_API_KEY } from '@env';

// Debug logging to check if env vars are loaded
// console.log('[RelatedSearch] Environment variables loaded:');
// console.log('GOOGLE_CSE_API_KEY:', GOOGLE_CSE_API_KEY ? 'LOADED' : 'MISSING');
// console.log('GOOGLE_CSE_ID:', GOOGLE_CSE_ID ? 'LOADED' : 'MISSING');
// console.log('GEMINI_API_KEY:', GEMINI_API_KEY ? 'LOADED' : 'MISSING');

// Temporary hardcoded values for testing
const GOOGLE_CSE_API_KEY = 'AIzaSyD5CUSa_RCtmrLK-URfE8bALk-HYpsI5EI';
const GOOGLE_CSE_ID = 'b72483909a30a4338';
const GEMINI_API_KEY = 'AIzaSyBFXu9_GHQVWyTZkuRaIandwJCHnw_rg9I';

// Test basic network connectivity
async function testNetworkConnectivity() {
  try {
    console.log('[Network Test] Testing basic connectivity...');
    const response = await fetch('https://httpbin.org/get');
    console.log('[Network Test] Response status:', response.status);
    const data = await response.json();
    console.log('[Network Test] Success! Response:', data);
    return true;
  } catch (error: any) {
    console.log('[Network Test] Failed:', error.message);
    return false;
  }
}

// 1. Use Gemini to generate a search query from the log message
export async function getGeminiSearchQuery(logMessage: string): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Given this scam message: "${logMessage}", generate a concise Google search query to find news or articles about similar scams.`;

  console.log('[Gemini] Making request to:', endpoint);
  console.log('[Gemini] Request body:', JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  }));

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ThreatSense/1.0',
      },
      mode: 'cors',
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });
    
    console.log('[Gemini] Response status:', response.status);
    console.log('[Gemini] Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[Gemini] Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[Gemini] Response data:', JSON.stringify(data, null, 2));
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/^["']|["']$/g, '').trim();
    console.log('[Gemini] Generated search query:', cleaned);
    return cleaned;
  } catch (error: any) {
    console.log('[Gemini] Detailed error:', error);
    console.log('[Gemini] Error message:', error.message);
    console.log('[Gemini] Error stack:', error.stack);
    throw error;
  }
}

// 2. Use Google Custom Search API to fetch articles
export async function getRelatedArticles(query: string): Promise<{ title: string, url: string, snippet: string }[]> {
  const endpoint = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}`;
  
  console.log('[Google CSE] Making request to:', endpoint);
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'ThreatSense/1.0',
      },
      mode: 'cors',
    });
    
    console.log('[Google CSE] Response status:', response.status);
    console.log('[Google CSE] Response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[Google CSE] Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[Google CSE] API response:', JSON.stringify(data, null, 2));
    
    if (!data.items) {
      console.log('[Google CSE] No items found in response');
      return [];
    }
    
    return data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
    }));
  } catch (error: any) {
    console.log('[Google CSE] Detailed error:', error);
    console.log('[Google CSE] Error message:', error.message);
    console.log('[Google CSE] Error stack:', error.stack);
    throw error;
  }
}

// Mock data for fallback when APIs fail
const MOCK_ARTICLES = [
  {
    title: "Fake Text Scams | Georgia Department of Driver Services",
    url: "https://dds.georgia.gov/fake-text-scams",
    snippet: "Scammers are sending fake text messages pretending to be from the Georgia DDS, alleging an upcoming license suspension due to unpaid fines."
  },
  {
    title: "Americans are warned as latest DMV phishing scam targets phones",
    url: "https://www.npr.org/2025/05/24/nx-s1-5410454/dmv-phishing-smishing-scam-phones-texts",
    snippet: "Your state DMV probably won't text you about unpaid fees — but scammers will."
  },
  {
    title: "Text Message Scam | Georgia Department of Driver Services",
    url: "https://dds.georgia.gov/press-releases/2022-06-09/text-message-scam",
    snippet: "Moore says such text messages are a fraud and likely an attempt by scammers to get your personal information."
  }
];

// 3. Main function to get related articles for a log message
export async function getRelatedSearchResults(logMessage: string) {
  try {
    // Test network connectivity first
    const networkWorks = await testNetworkConnectivity();
    if (!networkWorks) {
      console.log('[RelatedSearch] Network connectivity test failed, using mock data');
      return MOCK_ARTICLES;
    }
    
    // Temporarily bypass Gemini and use a hardcoded query for testing
    console.log('[RelatedSearch] Bypassing Gemini API for testing...');
    const query = 'DMV scam text message fraud';
    
    console.log('[RelatedSearch] Using hardcoded query:', query);
    
    try {
      const articles = await getRelatedArticles(query);
      if (articles && articles.length > 0) {
        return articles;
      }
    } catch (apiError) {
      console.log('[RelatedSearch] API call failed, using mock data:', apiError);
    }
    
    // Fallback to mock data if API fails
    console.log('[RelatedSearch] Using mock data as fallback');
    return MOCK_ARTICLES;
    
  } catch (e) {
    console.log('[RelatedSearch] Error:', e);
    return MOCK_ARTICLES;
  }
} 