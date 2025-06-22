import { NavigatorScreenParams } from '@react-navigation/native';
import { ScamAlert } from '../services/perplexity/perplexityService';

export type HomeStackParamList = {
  Home: undefined;
  LatestScams: undefined;
  ScamDetail: { scam: ScamAlert };
  LogDetail: { logId: string };
  LogHistory: { threatFilter?: string };
  BlockedSenders: undefined;
};

export type BrowseStackParamList = {
  Browse: undefined;
  LogHistory: { threatFilter?: string };
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log?: any };
};

export type LibraryStackParamList = {
  Library: undefined;
  KnowledgeBase: undefined;
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log?: any };
  KnowledgeBaseLogDetailsGeneral: { log?: any };
  KnowledgeBaseLogDetailsSecurity: { log?: any };
  KnowledgeBaseLogDetailsMetadata: { log?: any };
  KnowledgeBaseLogDetailsThreat: { log?: any };
};

export type SearchStackParamList = {
  Search: undefined;
};

// Defines the parameters for the screens within the bottom tab navigator
export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Browse: NavigatorScreenParams<BrowseStackParamList>;
  Library: NavigatorScreenParams<LibraryStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
};

// Defines the parameters for the screens in the main stack navigator
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>; // The nested tab navigator
  AccessibilitySettings: undefined;
  HelpAndSupport: undefined;
  SearchResults: { query: string }; // Assuming search results might be global
  Browse: undefined;
  Library: undefined;
  ScamDetail: { scam: ScamAlert };
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log?: any };
  KnowledgeBaseLogDetailsGeneral: { log?: any };
  KnowledgeBaseLogDetailsSecurity: { log?: any };
  KnowledgeBaseLogDetailsMetadata: { log?: any };
  KnowledgeBaseLogDetailsThreat: { log?: any };
};

export type DrawerParamList = {
  Main: undefined;
}; 