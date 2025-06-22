import { ScamAlert } from "../services/perplexity/perplexityService";

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  ThreatDemo: undefined;
  LogHistory: { threatFilter?: string };
  KnowledgeBase: undefined;
  Settings: undefined;
  About: undefined;
  LogDetail: { log: any };
  BlockedSenders: undefined;
  SearchResults: { query: string };
  LatestScams: undefined;
  ScamDetail: { scam: ScamAlert };

  // Knowledge Base Articles
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log: any };
  KnowledgeBaseLogDetailsGeneral: { log: any };
  KnowledgeBaseLogDetailsSecurity: { log: any };
  KnowledgeBaseLogDetailsMetadata: { log: any };
  KnowledgeBaseLogDetailsThreat: { log: any };
  ThreatAnalysis: undefined;
};

export type DrawerParamList = {
  Main: undefined;
}; 