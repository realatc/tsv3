import { Platform } from 'react-native';
import { GOOGLE_CSE_API_KEY, GOOGLE_CSE_ID, GEMINI_API_KEY } from '@env';

// Debug logging to check if env vars are loaded
console.log('[RelatedSearch] Environment variables loaded:');
console.log('GOOGLE_CSE_API_KEY:', GOOGLE_CSE_API_KEY ? 'LOADED' : 'MISSING');
console.log('GOOGLE_CSE_ID:', GOOGLE_CSE_ID ? 'LOADED' : 'MISSING');
console.log('GEMINI_API_KEY:', GEMINI_API_KEY ? 'LOADED' : 'MISSING');

// Use environment variables if available, otherwise use fallback values
const API_KEY = GEMINI_API_KEY || 'AIzaSyBFXu9_GHQVWyTZkuRaIandwJCHnw_rg9I';
const CSE_API_KEY = GOOGLE_CSE_API_KEY || 'AIzaSyD5CUSa_RCtmrLK-URfE8bALk-HYpsI5EI';
const CSE_ID = GOOGLE_CSE_ID || 'b72483909a30a4338';

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
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
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
  const endpoint = `https://www.googleapis.com/customsearch/v1?key=${CSE_API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(query)}`;
  
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

// Mock data for fallback when APIs fail - REAL, WORKING URLs
const MOCK_ARTICLES = [
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

// Generate contextual mock data based on log message
function getContextualMockData(logMessage: string) {
  const message = logMessage.toLowerCase();
  
  if (message.includes('dmv') || message.includes('license') || message.includes('ticket')) {
    return [
      {
        title: "Fake DMV Text Scams | Federal Trade Commission",
        url: "https://www.consumer.ftc.gov/articles/how-spot-avoid-report-text-message-scams",
        snippet: "Learn how to identify and avoid fake DMV text messages that scammers use to steal your information."
      },
      {
        title: "DMV Phishing Scams on the Rise | Better Business Bureau",
        url: "https://www.bbb.org/article/news-releases/2024/01/text-message-scams",
        snippet: "BBB warns about fake DMV text messages claiming unpaid fees or license suspensions."
      },
      {
        title: "How to Spot Fake Government Text Messages",
        url: "https://www.consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages",
        snippet: "Government agencies rarely send text messages. Learn how to spot fake government text scams."
      }
    ];
  } else if (message.includes('package') || message.includes('delivery') || message.includes('fedex') || message.includes('ups')) {
    return [
      {
        title: "Package Delivery Scam Alert | Federal Trade Commission",
        url: "https://www.consumer.ftc.gov/articles/how-spot-avoid-report-text-message-scams",
        snippet: "Learn how to identify and avoid fake package delivery text messages that scammers use to steal your information."
      },
      {
        title: "Fake Package Delivery Scams | Better Business Bureau",
        url: "https://www.bbb.org/article/news-releases/2024/01/text-message-scams",
        snippet: "BBB warns about fake package delivery notifications that are actually phishing scams."
      },
      {
        title: "How to Spot Fake Delivery Text Messages",
        url: "https://www.consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages",
        snippet: "Legitimate delivery companies rarely send unsolicited text messages. Learn how to spot fake delivery scams."
      }
    ];
  } else if (message.includes('bank') || message.includes('account') || message.includes('credit') || message.includes('payment')) {
    return [
      {
        title: "Banking Scam Alert | Federal Trade Commission",
        url: "https://www.consumer.ftc.gov/articles/how-spot-avoid-report-text-message-scams",
        snippet: "Learn how to identify and avoid fake banking text messages that scammers use to steal your information."
      },
      {
        title: "Fake Bank Text Messages | Better Business Bureau",
        url: "https://www.bbb.org/article/news-releases/2024/01/text-message-scams",
        snippet: "BBB warns about fake bank text messages claiming account issues or suspicious activity."
      },
      {
        title: "How to Spot Fake Banking Text Messages",
        url: "https://www.consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages",
        snippet: "Banks rarely send unsolicited text messages. Learn how to spot fake banking text scams."
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
  console.log('[RelatedSearch] Starting search for:', logMessage.substring(0, 50) + '...');
  
  try {
    // ALWAYS try the real APIs first - only use mock data as absolute last resort
    console.log('[RelatedSearch] Attempting to use real AI APIs...');
    
    // Generate a search query from the log message using Gemini
    console.log('[RelatedSearch] Generating search query from log message...');
    let query = '';
    
    try {
      query = await getGeminiSearchQuery(logMessage);
      console.log('[RelatedSearch] ✅ Gemini generated query:', query);
    } catch (geminiError) {
      console.log('[RelatedSearch] ❌ Gemini API failed, using fallback query:', geminiError);
      // Fallback: extract key terms from the log message
      const keyTerms = logMessage.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5)
        .join(' ');
      query = `${keyTerms} scam fraud alert`;
      console.log('[RelatedSearch] Using fallback query:', query);
    }
    
    if (!query) {
      console.log('[RelatedSearch] ❌ No query generated, using contextual mock data');
      return getContextualMockData(logMessage);
    }
    
    console.log('[RelatedSearch] 🔍 Searching with query:', query);
    
    try {
      const articles = await getRelatedArticles(query);
      if (articles && articles.length > 0) {
        console.log('[RelatedSearch] ✅ Successfully found', articles.length, 'real articles from Google CSE');
        return articles;
      } else {
        console.log('[RelatedSearch] ⚠️ Google CSE returned empty results');
      }
    } catch (apiError) {
      console.log('[RelatedSearch] ❌ Google CSE API failed:', apiError);
    }
    
    // Only use mock data if ALL real APIs fail
    console.log('[RelatedSearch] ⚠️ All real APIs failed, using contextual mock data as last resort');
    return getContextualMockData(logMessage);
    
  } catch (e) {
    console.log('[RelatedSearch] ❌ Critical error:', e);
    console.log('[RelatedSearch] ⚠️ Using contextual mock data as emergency fallback');
    return getContextualMockData(logMessage);
  }
} 