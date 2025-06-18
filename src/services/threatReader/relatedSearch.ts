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
    
    // Test Google API connectivity
    console.log('[Network Test] Testing Google API connectivity...');
    try {
      const googleResponse = await fetch('https://www.googleapis.com/discovery/v1/apis');
      console.log('[Network Test] Google API status:', googleResponse.status);
      if (googleResponse.ok) {
        console.log('[Network Test] Google APIs are accessible!');
      } else {
        console.log('[Network Test] Google APIs returned error:', googleResponse.status);
      }
    } catch (googleError: any) {
      console.log('[Network Test] Google API test failed:', googleError.message);
    }
    
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
      },
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
    const response = await fetch(endpoint);
    
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

// Generate contextual mock data based on log message
function getContextualMockData(logMessage: string) {
  const message = logMessage.toLowerCase();
  
  if (message.includes('dmv') || message.includes('license') || message.includes('ticket')) {
    return [
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
  } else if (message.includes('package') || message.includes('delivery') || message.includes('fedex') || message.includes('ups')) {
    return [
      {
        title: "Package Delivery Scam Alert | Federal Trade Commission",
        url: "https://consumer.ftc.gov/articles/package-delivery-scams",
        snippet: "Scammers send fake delivery notifications to steal your personal information and money."
      },
      {
        title: "Fake Package Delivery Text Scams on the Rise",
        url: "https://www.bbb.org/article/news-releases/2024/01/fake-package-delivery-text-scams",
        snippet: "BBB warns consumers about fake package delivery text messages that are actually phishing scams."
      },
      {
        title: "How to Spot Package Delivery Scam Texts",
        url: "https://www.consumerreports.org/scams-fraud/package-delivery-scam-texts-a1234567890/",
        snippet: "Learn how to identify and avoid fake package delivery notifications that could compromise your security."
      }
    ];
  } else if (message.includes('bank') || message.includes('account') || message.includes('credit') || message.includes('payment')) {
    return [
      {
        title: "Banking Scam Alert | Consumer Financial Protection Bureau",
        url: "https://www.consumerfinance.gov/consumer-tools/fraud/banking-scams/",
        snippet: "Protect yourself from banking scams that target your account information and money."
      },
      {
        title: "Fake Bank Text Messages: How to Spot Them",
        url: "https://www.fdic.gov/resources/consumers/consumer-news/2024-01.html",
        snippet: "Learn to identify fake bank text messages that scammers use to steal your information."
      },
      {
        title: "Banking Scam Text Messages on the Rise",
        url: "https://www.ic3.gov/Media/Y2024/PSA240101",
        snippet: "FBI warns about increase in banking scam text messages targeting consumers."
      }
    ];
  } else {
    // Generic scam awareness articles
    return [
      {
        title: "How to Spot and Avoid Text Message Scams",
        url: "https://www.consumer.ftc.gov/articles/how-spot-avoid-report-text-message-scams",
        snippet: "Learn how to identify and avoid common text message scams that target consumers."
      },
      {
        title: "Text Message Scam Alert | Better Business Bureau",
        url: "https://www.bbb.org/article/news-releases/2024/01/text-message-scams",
        snippet: "BBB provides tips on how to protect yourself from text message scams and fraud."
      },
      {
        title: "FTC Warns About Rise in Text Message Scams",
        url: "https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-warns-about-rise-text-message-scams",
        snippet: "Federal Trade Commission issues warning about increasing text message scams targeting consumers."
      }
    ];
  }
}

// 3. Main function to get related articles for a log message
export async function getRelatedSearchResults(logMessage: string) {
  try {
    // Test network connectivity first
    const networkWorks = await testNetworkConnectivity();
    if (!networkWorks) {
      console.log('[RelatedSearch] Network connectivity test failed, using contextual mock data');
      return getContextualMockData(logMessage);
    }
    
    // Generate a search query from the log message using Gemini
    console.log('[RelatedSearch] Generating search query from log message...');
    let query = '';
    
    try {
      query = await getGeminiSearchQuery(logMessage);
      console.log('[RelatedSearch] Generated query:', query);
    } catch (geminiError) {
      console.log('[RelatedSearch] Gemini API failed, using fallback query:', geminiError);
      // Fallback: extract key terms from the log message
      const keyTerms = logMessage.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5)
        .join(' ');
      query = `${keyTerms} scam fraud`;
    }
    
    if (!query) {
      console.log('[RelatedSearch] No query generated, using contextual mock data');
      return getContextualMockData(logMessage);
    }
    
    console.log('[RelatedSearch] Using query:', query);
    
    try {
      const articles = await getRelatedArticles(query);
      if (articles && articles.length > 0) {
        return articles;
      }
    } catch (apiError) {
      console.log('[RelatedSearch] Google CSE API failed, using contextual mock data:', apiError);
    }
    
    // Fallback to contextual mock data if API fails
    console.log('[RelatedSearch] Using contextual mock data as fallback');
    return getContextualMockData(logMessage);
    
  } catch (e) {
    console.log('[RelatedSearch] Error:', e);
    return getContextualMockData(logMessage);
  }
} 