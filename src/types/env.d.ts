declare module '@env' {
  export const GOOGLE_SAFE_BROWSING_API_KEY: string;
  export const GEMINI_API_KEY: string;
  export const GOOGLE_CSE_API_KEY: string;
  export const GOOGLE_CSE_ID: string;
}

declare module '*.md' {
  const content: string;
  export default content;
} 