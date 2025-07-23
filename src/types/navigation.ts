import { NavigatorScreenParams } from '@react-navigation/native';
import { ScamAlert } from '../services/perplexity/perplexityService';
import type { LogEntry } from '../context/LogContext';

export type HomeStackParamList = {
  HomeScreen: undefined;
  LatestScams: undefined;
  ScamDetail: { scam: ScamAlert };
  LogDetail: { log: LogEntry };
  LogHistory: { threatFilter?: string; categoryFilter?: string };
  BlockedSenders: undefined;
};

export type BrowseStackParamList = {
  Browse: undefined;
  LogHistory: { threatFilter?: string; categoryFilter?: string };
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log?: any };
  LogDetail: { log: LogEntry };
  ThreatAnalysis: { initialText?: string };
};

export type LibraryStackParamList = {
  Library: undefined;
  KnowledgeBase: undefined;
  KnowledgeBaseLiveTextAnalyzer: undefined;
  KnowledgeBaseSentryMode: undefined;
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
  ThreatAnalysis: { initialText?: string };
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
  Settings: undefined;
  SentryMode: undefined;
  About: undefined;
  AccessibilitySettings: undefined;
  HelpAndSupport: undefined;
  BlockedSenders: undefined;
  SearchResults: { query: string }; // Assuming search results might be global
  Browse: undefined;
  Library: NavigatorScreenParams<LibraryStackParamList>;
  ScamDetail: { scam: ScamAlert };
  LogDetail: { log: LogEntry };
  LogHistory: { threatFilter?: string; categoryFilter?: string };
  KnowledgeBaseLiveTextAnalyzer: undefined;
  KnowledgeBaseSentryMode: undefined;
  KnowledgeBaseThreatLevelArticle: undefined;
  KnowledgeBaseScamsArticle: undefined;
  KnowledgeBaseLogDetailsOverview: { log?: any };
  KnowledgeBaseLogDetailsGeneral: { log?: any };
  KnowledgeBaseLogDetailsSecurity: { log?: any };
  KnowledgeBaseLogDetailsMetadata: { log?: any };
  KnowledgeBaseLogDetailsThreat: { log?: any };
  SentryModeGuidedDemo: undefined;
  BugReportForm: undefined;
};

export type DrawerParamList = {
  Main: undefined;
}; 