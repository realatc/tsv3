// Utility to extract URLs from a string
export function extractUrls(text: string): string[] {
  if (!text) return [];
  // Simple regex for URLs (http, https, www)
  const urlRegex = /\b((https?:\/\/|www\.)[^\s/$.?#].[^ -\s]*)/gi;
  const matches = text.match(urlRegex) || [];
  // Remove trailing punctuation from each URL
  return matches.map(url => url.replace(/[.,!?;:]+$/, ''));
} 