// Perplexity AI API service for threat intelligence
// You'll need to get an API key from https://www.perplexity.ai/settings/api

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERPLEXITY_API_KEY } from '@env';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface PerplexityResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
  };
}

export interface ScamAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  date: string;
  discoveredDate?: string; // When the vulnerability/scam was first discovered
  sources?: string[];
  sourceDates?: string[]; // Dates when each source was published
}

const LATEST_SCAMS_CACHE_KEY = '@latestScams';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function getLatestScams(): Promise<ScamAlert[]> {
  if (!PERPLEXITY_API_KEY) {
    console.warn('[PerplexityService] No API key provided, returning mock data for latest scams.');
    return await getMockScamData();
  }

  // Temporarily disable cache for testing date extraction
  console.log('[getLatestScams] Cache disabled for testing - fetching fresh data.');
  
  // try {
  //   // Check cache first
  //   const cachedData = await AsyncStorage.getItem(LATEST_SCAMS_CACHE_KEY);
  //   if (cachedData) {
  //     const { scams, timestamp } = JSON.parse(cachedData);
  //     if (Date.now() - timestamp < CACHE_DURATION_MS) {
  //       console.log('[getLatestScams] Returning fresh data from cache.');
  //       return scams;
  //     }
  //     console.log('[getLatestScams] Cached data is stale.');
  //   }
  // } catch (e) {
  //   console.error('[getLatestScams] Error reading from cache:', e);
  // }

  try {
    // Step 1: Get a list of trending threat topics
    console.log('[getLatestScams] Step 1: Fetching trending threat topics...');
    const trendingTopicsPrompt = `
      Scan recent articles (last 7 days) from reputable cybersecurity news sources like The Hacker News, Bleeping Computer, and WIRED Security. 
      Identify the top 3-4 most frequently reported, distinct cybersecurity threat topics.
      Return these topics as a JSON array of strings. For example: ["QR Code Phishing", "AI Voice Impersonation Scams"].
      Provide only the JSON array in your response.`;

    const topicsContent = await callPerplexityAPI(trendingTopicsPrompt);
    const topicsMatch = topicsContent.match(/\[[\s\S]*\]/);
    if (!topicsMatch) {
      throw new Error('Could not parse trending topics from API response.');
    }
    const trendingTopics = JSON.parse(topicsMatch[0]);
    console.log(`[getLatestScams] Found trending topics:`, trendingTopics);

    // Step 2: Get a detailed briefing on each topic
    console.log('[getLatestScams] Step 2: Fetching detailed briefings for each topic...');
    const scamPromises = trendingTopics.map(async (topic: string) => {
      const briefingPrompt = `
        You are a cybersecurity expert writing for a general audience. Explain the "${topic}" scam.
        
        IMPORTANT: For each source you find, extract the publication date from the article content, URL, or metadata. If no specific date is found, estimate based on the article's context and recency.
        
        Provide:
        - A simple title
        - A clear description (2-3 sentences)
        - Severity level ('low', 'medium', 'high', 'critical')
        - Category (e.g., 'phishing', 'malware', 'exploitation')
        - Discovery date: When this threat was first identified (YYYY-MM-DD format)
        - 1-2 relevant source URLs with their publication dates (YYYY-MM-DD format)
        
        Respond with only a single, valid JSON object with "title", "description", "severity", "category", "discoveredDate", "sources", and "sourceDates" fields.
        
        Example format:
        {
          "title": "Example Threat",
          "description": "Description here",
          "severity": "high",
          "category": "phishing",
          "discoveredDate": "2024-01-15",
          "sources": ["https://example.com/article1", "https://example.com/article2"],
          "sourceDates": ["2024-01-20", "2024-01-22"]
        }`;
      
      const briefingContent = await callPerplexityAPI(briefingPrompt);
      const briefingMatch = briefingContent.match(/{[\s\S]*}/);
      if (briefingMatch) {
        return JSON.parse(briefingMatch[0]);
      }
      return null; // Return null if parsing fails for one briefing
    });

    const results = await Promise.all(scamPromises);
    const scams = results
      .filter(scam => scam !== null) // Filter out any failed briefings
      .map((scam: any, index: number) => {
        // Extract dates from sources using URL patterns only (faster and more reliable)
        const sourceDates: string[] = [];
        if (scam.sources && scam.sources.length > 0) {
          console.log(`[getLatestScams] Processing sources for scam ${index}:`, scam.sources);
          for (const source of scam.sources) {
            const date = extractDateFromURL(source);
            console.log(`[getLatestScams] Extracted date from ${source}:`, date);
            sourceDates.push(date || new Date().toISOString().split('T')[0]);
          }
        }
        
        return {
          id: `scam-${Date.now()}-${index}`,
          title: scam.title,
          description: scam.description,
          severity: scam.severity || 'medium',
          category: scam.category || 'unknown',
          date: new Date().toISOString(),
          discoveredDate: scam.discoveredDate || new Date().toISOString(),
          sources: scam.sources || [],
          sourceDates: sourceDates,
        };
      });

    if (scams.length === 0) {
      throw new Error('No valid scam briefings were generated.');
    }
      
    console.log('[getLatestScams] Successfully fetched and parsed scam briefings.');
    
    // Cache the new data
    try {
      const dataToCache = JSON.stringify({ scams, timestamp: Date.now() });
      await AsyncStorage.setItem(LATEST_SCAMS_CACHE_KEY, dataToCache);
      console.log('[getLatestScams] New data cached successfully.');
    } catch (e) {
      console.error('[getLatestScams] Error writing to cache:', e);
    }
    
    return scams;

  } catch (error) {
    console.error('[PerplexityService] Error in new getLatestScams flow:', error);
    console.log('[PerplexityService] Falling back to mock data due to API error.');
    
    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes('401')) {
      console.warn('[PerplexityService] API key appears to be invalid or expired.');
    }
    
    return await getMockScamData(); // Fallback to mock data on any error
  }
}

function parseTextResponse(content: string): ScamAlert[] {
  // Simple parsing fallback if JSON parsing fails
  const scams: ScamAlert[] = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentScam: Partial<ScamAlert> = {};
  
  for (const line of lines) {
    if (line.match(/^\d+\./)) {
      if (currentScam.title) {
        scams.push({
          id: `scam-${Date.now()}-${scams.length}`,
          title: currentScam.title || 'Unknown Scam',
          description: currentScam.description || 'No description available',
          severity: currentScam.severity || 'medium',
          category: currentScam.category || 'unknown',
          date: new Date().toISOString(),
          sources: currentScam.sources || [],
        });
      }
      currentScam = { title: line.replace(/^\d+\.\s*/, '') };
    } else if (line.includes(':')) {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key.toLowerCase().includes('description')) {
        currentScam.description = value;
      } else if (key.toLowerCase().includes('severity')) {
        currentScam.severity = value.toLowerCase() as any;
      } else if (key.toLowerCase().includes('category')) {
        currentScam.category = value;
      }
    }
  }
  
  // Add the last scam
  if (currentScam.title) {
    scams.push({
      id: `scam-${Date.now()}-${scams.length}`,
      title: currentScam.title,
      description: currentScam.description || 'No description available',
      severity: currentScam.severity || 'medium',
      category: currentScam.category || 'unknown',
      date: new Date().toISOString(),
      sources: currentScam.sources || [],
    });
  }
  
  return scams.slice(0, 5); // Limit to 5 scams
}

async function getMockScamData(): Promise<ScamAlert[]> {
  return [
    {
      id: 'mock-1',
      title: 'Fake Delivery Notification Scams',
      description: 'Scammers are sending fake delivery notifications claiming packages are waiting. Victims click links that steal personal information or install malware.',
      severity: 'high',
      category: 'phishing',
      date: new Date().toISOString(),
      discoveredDate: '2024-01-15',
      sources: ['https://www.ftc.gov/news-events/topics/identity-theft-scams'],
      sourceDates: ['2024-01-20'],
    },
    {
      id: 'mock-2',
      title: 'AI Voice Cloning Attacks',
      description: 'Criminals are using AI to clone voices of family members, calling victims and claiming to be in emergency situations requiring immediate money transfers.',
      severity: 'critical',
      category: 'impersonation',
      date: new Date().toISOString(),
      discoveredDate: '2024-02-10',
      sources: ['https://www.fbi.gov/news/press-releases/fbi-warns-public-of-ai-voice-cloning-scams'],
      sourceDates: ['2024-02-15'],
    },
    {
      id: 'mock-3',
      title: 'Fake Job Offer Scams',
      description: 'Scammers post fake job listings on legitimate sites, then ask for personal information or request payment for "training materials" or "background checks."',
      severity: 'medium',
      category: 'scam',
      date: new Date().toISOString(),
      discoveredDate: '2024-03-05',
      sources: ['https://www.consumer.ftc.gov/articles/job-scams'],
      sourceDates: ['2024-03-10'],
    },
  ];
}

async function callPerplexityAPI(prompt: string, model: string = 'sonar-pro') {
  console.log(`[callPerplexityAPI] Making API call with model: ${model}`);
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are a helpful and concise cybersecurity assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.0,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Perplexity API Error] Status: ${response.status}, Body: ${errorBody}`);
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data: PerplexityResponse = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from Perplexity API');
  }

  console.log(`[callPerplexityAPI] Received response length: ${content.length} characters`);
  return content;
}

export async function analyzeText(text: string): Promise<any> {
  if (!PERPLEXITY_API_KEY) {
    console.warn('[analyzeText] No Perplexity API key found. Falling back to mock data.');
    return mockAnalyzeText(text); // Keep mock function for fallback
  }

  console.log(`[analyzeText] Starting analysis for text: "${text.substring(0, 100)}..."`);
  
  const prompt = `Analyze the following text for security threats. Respond with a JSON object containing three fields: 
1. "threatLevel": A string, one of 'critical', 'high', 'medium', 'low', or 'none'.
2. "summary": A concise, one-sentence summary of the potential threat.
3. "recommendation": A clear, actionable recommendation for the user.

Do not include any text outside of the JSON object.

Text to analyze:
---
${text}
---`;

  try {
    console.log(`[analyzeText] Sending text to Perplexity for analysis...`);
    const content = await callPerplexityAPI(prompt);
    
    console.log(`[analyzeText] Raw API response: ${content.substring(0, 200)}...`);
    
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (jsonMatch && jsonMatch[0]) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      console.log(`[analyzeText] Successfully parsed result:`, parsedResult);
      return parsedResult;
    } else {
      console.error('[analyzeText] Failed to extract JSON from response:', content);
      throw new Error('Invalid response format from API.');
    }
  } catch (error) {
    console.error('Error analyzing text with Perplexity:', error);
    throw new Error('Failed to analyze text. Please try again.');
  }
}

// Renamed original analyzeText to be a mock fallback
async function mockAnalyzeText(text: string): Promise<any> {
  console.log(`[mockAnalyzeText] Analyzing text: "${text.substring(0, 50)}..."`);
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (text.toLowerCase().includes('dds.gov-faciav.works')) {
    return {
      threatLevel: 'high',
      summary: 'This is a phishing attempt impersonating the Georgia Motor Vehicle Division (DMV/DDS). The URL is fraudulent.',
      recommendation: 'Do not click the link or provide any information. This is a known scam targeting Georgia residents. Block the sender immediately.',
    };
  }

  if (text.toLowerCase().includes('password') || text.toLowerCase().includes('bank')) {
    return {
      threatLevel: 'high',
      summary: 'The message contains highly sensitive keywords like "password" or "bank" and appears to be a targeted phishing attempt.',
      recommendation: 'Do not reply, click any links, or provide any information. Block the sender immediately and delete the message.',
    };
  }

  if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('action required')) {
    return {
      threatLevel: 'high',
      summary: 'The message uses urgent language to create a sense of panic, a common tactic in phishing and malware scams.',
      recommendation: 'Be cautious. Verify the sender through a separate, trusted channel before taking any action. Do not click links directly.',
    };
  }
  
  if (text.includes('https://') || text.includes('http://')) {
    return {
      threatLevel: 'medium',
      summary: 'The message contains a URL. While not inherently malicious, it could lead to a phishing site or malware download.',
      recommendation: 'Do not click the link unless you are absolutely certain of the sender and the destination. You can use a URL checker for safety.',
    };
  }

  return {
    threatLevel: 'low',
    summary: 'The message does not contain obvious signs of a threat, but caution is always advised.',
    recommendation: 'No immediate action is required, but remain vigilant for any unusual requests or language.',
  };
}

export interface RelatedIntel {
  title: string;
  source: string;
  url: string;
  snippet: string;
}

export async function getRelatedThreatIntel(query: string): Promise<RelatedIntel[]> {
  if (!PERPLEXITY_API_KEY || !query) {
    console.warn('[getRelatedThreatIntel] No API key or query. Falling back to mock data.');
    return mockGetRelatedThreatIntel(query);
  }

  const prompt = `As a threat intelligence analyst, find 3 relevant, recent online articles, news reports, or official warnings about the following threat. For each, provide the title, source (e.g., 'Forbes', 'FTC'), a direct URL, and a brief snippet. Respond with only a valid JSON array of objects, where each object has "title", "source", "url", and "snippet" fields.

Threat summary: "${query}"`;

  try {
    console.log(`[getRelatedThreatIntel] Fetching intel from Perplexity for query: "${query}"`);
    const content = await callPerplexityAPI(prompt);
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch && jsonMatch[0]) {
      console.log(`[getRelatedThreatIntel] Received JSON response.`);
      return JSON.parse(jsonMatch[0]);
    } else {
      console.error('[getRelatedThreatIntel] Failed to extract JSON array from response:', content);
      return []; // Return empty array on format error
    }
  } catch (error) {
    console.error('[getRelatedThreatIntel] Error fetching intel with Perplexity:', error);
    return []; // Return empty array on API error
  }
}

async function mockGetRelatedThreatIntel(query: string): Promise<RelatedIntel[]> {
  console.log(`[mockGetRelatedThreatIntel] Fetching intel for query: "${query}"`);

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 1200)); 

  // In a real implementation, this would make an API call to Perplexity
  if (query.toLowerCase().includes('georgia motor vehicle')) {
    return [
      {
        title: 'Public Warning: Fake DMV Texts Target Georgians',
        source: 'Georgia Attorney General\'s Office',
        url: 'https://law.georgia.gov/press-releases/2023-11-09/consumer-alert-carr-warns-georgians-scam-text-messages-claiming-be-motor',
        snippet: 'The Georgia Attorney General\'s Office has issued a consumer alert regarding a widespread SMS phishing campaign where fraudsters impersonate the Department of Motor Vehicles to steal personal information...'
      },
      {
        title: 'How to Spot and Avoid SMS Phishing (Smishing) Scams',
        source: 'Federal Trade Commission (FTC)',
        url: 'https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages',
        snippet: 'Smishing attacks are on the rise. Scammers use text messages to try to trick you into giving them your personal information - things like your password, account number, or Social Security number. Here\'s what to look out for.'
      },
      {
        title: 'Security Researchers Track "PeachState-Phish" Campaign',
        source: 'ThreatWire Security News',
        url: 'https://www.threatwire.com/articles/peachstate-phish-deep-dive',
        snippet: 'A new phishing operation, dubbed "PeachState-Phish," has been actively targeting residents of Georgia with sophisticated text message lures themed around official state services...'
      },
    ];
  }

  return [];
} 

// Add date extraction utilities
function extractDateFromURL(url: string): string | null {
  // Common date patterns in URLs
  const datePatterns = [
    /(\d{4})\/(\d{1,2})\/(\d{1,2})/, // 2024/01/15
    /(\d{4})-(\d{1,2})-(\d{1,2})/,   // 2024-01-15
    /(\d{4})\.(\d{1,2})\.(\d{1,2})/, // 2024.01.15
  ];
  
  for (const pattern of datePatterns) {
    const match = url.match(pattern);
    if (match) {
      const [_, year, month, day] = match;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  return null;
}

async function extractDateFromArticle(url: string): Promise<string | null> {
  try {
    // Try to fetch the article and extract meta tags
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ThreatSense/1.0)',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Look for common meta tag patterns
    const metaPatterns = [
      /<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i,
      /<meta[^>]*name="publish_date"[^>]*content="([^"]*)"/i,
      /<meta[^>]*name="date"[^>]*content="([^"]*)"/i,
      /<time[^>]*datetime="([^"]*)"/i,
    ];
    
    for (const pattern of metaPatterns) {
      const match = html.match(pattern);
      if (match) {
        const dateStr = match[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn(`[extractDateFromArticle] Failed to extract date from ${url}:`, error);
    return null;
  }
} 