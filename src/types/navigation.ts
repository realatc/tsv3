import { NavigatorScreenParams } from '@react-navigation/native';
import { ScamAlert } from '../services/perplexity/perplexityService';

// Defines the parameters for the screens within the bottom tab navigator
export type TabParamList = {
  Home: { openSettings?: boolean } | undefined;
  Browse: undefined;
  Library: undefined;
  Search: undefined;
};

// Defines the parameters for the screens in the main stack navigator
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>; // The nested tab navigator
  Home: undefined;
  Browse: undefined;
  Library: undefined;
  Search: undefined;
  LogHistory: { threatFilter?: string };
  KnowledgeBase: undefined;
  LogDetail: { logId: string };
  SearchResults: { query: string };
  LatestScams: undefined;
  ScamDetail: { scam: ScamAlert };

  // Knowledge Base Articles
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log?: any };
  KnowledgeBaseLogDetailsGeneral: { log?: any };
  KnowledgeBaseLogDetailsSecurity: { log?: any };
  KnowledgeBaseLogDetailsMetadata: { log?: any };
  KnowledgeBaseLogDetailsThreat: { log?: any };
  ThreatAnalysis: undefined;
  AccessibilitySettings: undefined;
  HelpAndSupport: undefined;
};

export type DrawerParamList = {
  Main: undefined;
}; 