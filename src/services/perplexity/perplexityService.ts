// Perplexity AI API service for threat intelligence
// You'll need to get an API key from https://www.perplexity.ai/settings/api

const PERPLEXITY_API_KEY = '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'; // Replace 'YOUR_API_KEY_HERE' with your actual API key from Perplexity
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
  sources?: string[];
}

export async function getLatestScams(): Promise<ScamAlert[]> {
  if (!PERPLEXITY_API_KEY) {
    console.warn('[PerplexityService] No API key provided, returning mock data for latest scams.');
    return getMockScamData();
  }

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
        Provide a simple title, a clear description of how it works (2-3 sentences), a severity level ('low', 'medium', 'high', 'critical'), a category (e.g., 'phishing', 'malware'), and an array of 1-2 relevant source URLs.
        Respond with only a single, valid JSON object with "title", "description", "severity", "category", and "sources" fields.`;
      
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
      .map((scam: any, index: number) => ({
        id: `scam-${Date.now()}-${index}`,
        title: scam.title,
        description: scam.description,
        severity: scam.severity || 'medium',
        category: scam.category || 'unknown',
        date: new Date().toISOString(),
        sources: scam.sources || [],
      }));

    if (scams.length === 0) {
      throw new Error('No valid scam briefings were generated.');
    }
      
    console.log('[getLatestScams] Successfully fetched and parsed scam briefings.');
    return scams;

  } catch (error) {
    console.error('[PerplexityService] Error in new getLatestScams flow:', error);
    console.log('[PerplexityService] Falling back to mock data.');
    return getMockScamData(); // Fallback to mock data on any error
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

function getMockScamData(): ScamAlert[] {
  return [
    {
      id: 'mock-1',
      title: 'Fake Delivery Notification Scams',
      description: 'Scammers are sending fake delivery notifications claiming packages are waiting. Victims click links that steal personal information or install malware.',
      severity: 'high',
      category: 'phishing',
      date: new Date().toISOString(),
      sources: ['https://example.com/news1'],
    },
    {
      id: 'mock-2',
      title: 'AI Voice Cloning Attacks',
      description: 'Criminals are using AI to clone voices of family members, calling victims and claiming to be in emergency situations requiring immediate money transfers.',
      severity: 'critical',
      category: 'impersonation',
      date: new Date().toISOString(),
      sources: ['https://example.com/news2'],
    },
    {
      id: 'mock-3',
      title: 'Fake Job Offer Scams',
      description: 'Scammers post fake job listings on legitimate sites, then ask for personal information or request payment for "training materials" or "background checks."',
      severity: 'medium',
      category: 'scam',
      date: new Date().toISOString(),
      sources: ['https://example.com/news3'],
    },
  ];
}

async function callPerplexityAPI(prompt: string, model: string = 'llama-3.1-sonar-small-128k-online') {
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
      temperature: 0.2,
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

  return content;
}

export async function analyzeText(text: string): Promise<any> {
  if (!PERPLEXITY_API_KEY) {
    console.warn('[analyzeText] No Perplexity API key found. Falling back to mock data.');
    return mockAnalyzeText(text); // Keep mock function for fallback
  }

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
    
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (jsonMatch && jsonMatch[0]) {
      console.log(`[analyzeText] Received JSON response.`);
      return JSON.parse(jsonMatch[0]);
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
      threatLevel: 'critical',
      summary: 'This is a phishing attempt impersonating the Georgia Motor Vehicle Division (DMV/DDS). The URL is fraudulent.',
      recommendation: 'Do not click the link or provide any information. This is a known scam targeting Georgia residents. Block the sender immediately.',
    };
  }

  if (text.toLowerCase().includes('password') || text.toLowerCase().includes('bank')) {
    return {
      threatLevel: 'critical',
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