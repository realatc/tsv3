export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  ThreatDemo: undefined;
  LogHistory: undefined;
  KnowledgeBase: undefined;
  Settings: undefined;
  About: undefined;
  LogDetail: { logId: string };
  BlockedSenders: undefined;
  SearchResults: { query: string };

  // Knowledge Base Articles
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseLogDetailsOverview: undefined;
  KnowledgeBaseLogDetailsGeneral: undefined;
  KnowledgeBaseLogDetailsSecurity: undefined;
  KnowledgeBaseLogDetailsMetadata: undefined;
  KnowledgeBaseLogDetailsThreat: undefined;
}; 