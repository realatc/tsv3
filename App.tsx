/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { MenuProvider } from 'react-native-popup-menu';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

// Screens
import AboutScreen from './src/screens/AboutScreen';
import AccessibilitySettingsScreen from './src/screens/AccessibilitySettingsScreen';
import BlockedSendersScreen from './src/screens/BlockedSendersScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import HelpAndSupportScreen from './src/screens/HelpAndSupportScreen';
import HomeScreen from './src/screens/HomeScreen';
import KnowledgeBaseLiveTextAnalyzer from './src/screens/KnowledgeBaseLiveTextAnalyzer';
import KnowledgeBaseLogDetailsGeneral from './src/screens/KnowledgeBaseLogDetailsGeneral';
import KnowledgeBaseLogDetailsMetadata from './src/screens/KnowledgeBaseLogDetailsMetadata';
import KnowledgeBaseLogDetailsOverview from './src/screens/KnowledgeBaseLogDetailsOverview';
import KnowledgeBaseLogDetailsSecurity from './src/screens/KnowledgeBaseLogDetailsSecurity';
import KnowledgeBaseLogDetailsThreat from './src/screens/KnowledgeBaseLogDetailsThreat';
import KnowledgeBaseScamsArticle from './src/screens/KnowledgeBaseScamsArticle';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';
import KnowledgeBaseSentryMode from './src/screens/KnowledgeBaseSentryMode';
import KnowledgeBaseThreatLevelArticle from './src/screens/KnowledgeBaseThreatLevelArticle';
import LatestScamsScreen from './src/screens/LatestScamsScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import LogDetailScreen from './src/screens/LogDetailScreen';
import LogHistoryScreen from './src/screens/LogHistoryScreen';
import ScamDetailScreen from './src/screens/ScamDetailScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import SentryModeScreen from './src/screens/SentryModeScreen';
import ThreatAnalysisScreen from './src/screens/ThreatAnalysisScreen';
import SentryModeGuidedDemo from './src/screens/SentryModeGuidedDemo';
import SimpleHomeScreen from './src/screens/SimpleHomeScreen';
import BugReportFormScreen from './src/screens/BugReportFormScreen';

// Components
import SettingsSheet from './src/components/SettingsSheet';

// Context and Providers
import { LogProvider } from './src/context/LogContext';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import { AppProvider, useApp } from './src/context/AppContext';
import { SentryModeProvider } from './src/context/SentryModeContext';
import { navigationRef } from './src/services/navigationService';

import { 
  RootStackParamList, 
  TabParamList,
  HomeStackParamList,
  BrowseStackParamList,
  LibraryStackParamList,
  SearchStackParamList
} from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack = createStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="LatestScams" component={LatestScamsScreen} />
      <HomeStack.Screen name="ScamDetail" component={ScamDetailScreen} />
      <HomeStack.Screen name="LogDetail" component={LogDetailScreen} />
      <HomeStack.Screen name="LogHistory" component={LogHistoryScreen} />
      <HomeStack.Screen name="BlockedSenders" component={BlockedSendersScreen} />
    </HomeStack.Navigator>
  );
}

const BrowseStack = createStackNavigator<BrowseStackParamList>();
function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="Browse" component={BrowseScreen} />
      <BrowseStack.Screen name="LogHistory" component={LogHistoryScreen} />
      <BrowseStack.Screen name="KnowledgeBaseScamsArticle" component={KnowledgeBaseScamsArticle} />
      <BrowseStack.Screen name="KnowledgeBaseThreatLevelArticle" component={KnowledgeBaseThreatLevelArticle} />
      <BrowseStack.Screen name="KnowledgeBaseLogDetailsOverview" component={KnowledgeBaseLogDetailsOverview} />
      <BrowseStack.Screen name="LogDetail" component={LogDetailScreen} />
      <BrowseStack.Screen name="ThreatAnalysis" component={ThreatAnalysisScreen} />
    </BrowseStack.Navigator>
  );
}

const LibraryStack = createStackNavigator<LibraryStackParamList>();
function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="Library" component={LibraryScreen} />
      <LibraryStack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
      <LibraryStack.Screen name="KnowledgeBaseLiveTextAnalyzer" component={KnowledgeBaseLiveTextAnalyzer} />
      <LibraryStack.Screen name="KnowledgeBaseSentryMode" component={KnowledgeBaseSentryMode} />
      <LibraryStack.Screen name="KnowledgeBaseThreatLevelArticle" component={KnowledgeBaseThreatLevelArticle} />
      <LibraryStack.Screen name="KnowledgeBaseScamsArticle" component={KnowledgeBaseScamsArticle} />
      <LibraryStack.Screen name="KnowledgeBaseLogDetailsOverview" component={KnowledgeBaseLogDetailsOverview} />
      <LibraryStack.Screen name="KnowledgeBaseLogDetailsGeneral" component={KnowledgeBaseLogDetailsGeneral} />
      <LibraryStack.Screen name="KnowledgeBaseLogDetailsSecurity" component={KnowledgeBaseLogDetailsSecurity} />
      <LibraryStack.Screen name="KnowledgeBaseLogDetailsMetadata" component={KnowledgeBaseLogDetailsMetadata} />
      <LibraryStack.Screen name="KnowledgeBaseLogDetailsThreat" component={KnowledgeBaseLogDetailsThreat} />
    </LibraryStack.Navigator>
  );
}

const SearchStack = createStackNavigator<SearchStackParamList>();
function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="Search" component={SearchResultsScreen} />
      <SearchStack.Screen name="ThreatAnalysis" component={ThreatAnalysisScreen} />
    </SearchStack.Navigator>
  );
}

function TabNavigator() {
  const { ezModeEnabled } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        unmountOnBlur: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Browse') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }

          return <Icon name={iconName || 'alert-circle-outline'} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#A070F2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={ezModeEnabled ? SimpleHomeScreen : HomeStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'HomeScreen' });
          },
        })}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseStackNavigator}
      />
      <Tab.Screen
        name="Library"
        component={LibraryStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Library', { screen: 'Library' });
          },
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Search', { screen: 'Search' });
          },
        })}
      />
    </Tab.Navigator>
  );
}

const AppContent = () => {
  const { settingsSheetRef, contactResponseModal, setContactResponseModal, sentryAlertModal, setSentryAlertModal } = useApp();
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 300,
                  easing: require('react-native').Easing.out(require('react-native').Easing.cubic),
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 300,
                  easing: require('react-native').Easing.in(require('react-native').Easing.cubic),
                },
              },
            },
          }}
        >
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          {/* Add screens that should appear over the tabs here */}
          <Stack.Screen name="AccessibilitySettings" component={AccessibilitySettingsScreen} />
          <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="SentryMode" component={SentryModeScreen} />
          <Stack.Screen name="SentryModeGuidedDemo" component={SentryModeGuidedDemo} />
          <Stack.Screen name="LogDetail" component={LogDetailScreen} />
          <Stack.Screen name="LogHistory" component={LogHistoryScreen} />
          <Stack.Screen name="BugReportForm" component={BugReportFormScreen} />
        </Stack.Navigator>
        <SettingsSheet ref={settingsSheetRef} />
      </NavigationContainer>
      {/* Global Modals - Only render one at a time */}
      {(() => {
        if (contactResponseModal) {
          console.log('[ContactResponseModal] rendering');
          return (
            <Modal
              visible={true}
              transparent
              animationType="fade"
              onRequestClose={() => setContactResponseModal(null)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#23232A', borderRadius: 16, padding: 28, minWidth: 270, maxWidth: 340, alignItems: 'center' }}>
                  <Icon name="chatbubble-ellipses-outline" size={40} color="#A070F2" style={{ marginBottom: 12 }} />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Contact Response</Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 16, marginBottom: 16, textAlign: 'center' }}>{contactResponseModal?.message}</Text>
                  {contactResponseModal?.threatType && (
                    <Text style={{ color: '#FFD700', fontSize: 15, marginBottom: 8 }}>Threat Type: {contactResponseModal.threatType}</Text>
                  )}
                  {contactResponseModal?.timestamp && (
                    <Text style={{ color: '#8A8A8E', fontSize: 13, marginBottom: 8 }}>Received: {new Date(contactResponseModal.timestamp).toLocaleTimeString()}</Text>
                  )}
                  <TouchableOpacity 
                    style={{ backgroundColor: '#A070F2', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 10 }} 
                    onPress={() => {
                      console.log('[ContactResponseModal] closing');
                      setContactResponseModal(null);
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          );
        } else if (sentryAlertModal) {
          console.log('[SentryAlertModal] rendering');
          return (
            <Modal
              visible={true}
              transparent
              animationType="fade"
              onRequestClose={() => setSentryAlertModal(null)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#23232A', borderRadius: 16, padding: 28, minWidth: 270, maxWidth: 340, alignItems: 'center' }}>
                  <Icon name="shield-checkmark-outline" size={40} color="#A070F2" style={{ marginBottom: 12 }} />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Sentry Mode: High Threat Detected</Text>
                  <Text style={{ color: '#FFD700', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>SENTRY MODE ALERT TRIGGERED</Text>
                  <Text style={{ color: '#B0BEC5', fontSize: 16, marginBottom: 16, textAlign: 'center' }}>{sentryAlertModal?.message}</Text>
                  {sentryAlertModal?.details && (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>THREAT DETAILS:</Text>
                      <Text style={{ color: '#fff', fontSize: 14 }}>• Level: {sentryAlertModal.details.level}</Text>
                      <Text style={{ color: '#fff', fontSize: 14 }}>• Type: {sentryAlertModal.details.type}</Text>
                      <Text style={{ color: '#fff', fontSize: 14 }}>• Description: {sentryAlertModal.details.description}</Text>
                      <Text style={{ color: '#fff', fontSize: 14 }}>• Time: {sentryAlertModal.details.time}</Text>
                      <Text style={{ color: '#fff', fontSize: 14 }}>• Location: {sentryAlertModal.details.location}</Text>
                    </View>
                  )}
                  {sentryAlertModal?.notification && (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>NOTIFICATION SENT:</Text>
                      {sentryAlertModal.notification.map((n: string, i: number) => (
                        <Text key={i} style={{ color: '#fff', fontSize: 14 }}>• {n}</Text>
                      ))}
                    </View>
                  )}
                  {sentryAlertModal?.responses && (
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>EXPECTED RESPONSES:</Text>
                      {sentryAlertModal.responses.map((r: string, i: number) => (
                        <Text key={i} style={{ color: '#fff', fontSize: 14 }}>• {r}</Text>
                      ))}
                    </View>
                  )}
                  <Text style={{ color: '#B0BEC5', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>{sentryAlertModal?.footer}</Text>
                  <TouchableOpacity 
                    style={{ backgroundColor: '#A070F2', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 10, marginBottom: 6 }} 
                    onPress={() => {
                      if (!sentryAlertModal) return;
                      const alertId = sentryAlertModal.details?.alertId || sentryAlertModal.alertId || sentryAlertModal.id || Date.now().toString();
                      setSentryAlertModal(null);
                      if (sentryAlertModal?.onOk) {
                        setTimeout(() => {
                          // Only set if not already open for this alertId
                          if (!contactResponseModal || contactResponseModal.alertId !== alertId) {
                            sentryAlertModal.onOk(alertId);
                          }
                        }, 10000);
                      }
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
                  </TouchableOpacity>
                  {sentryAlertModal?.onCall && (
                    <TouchableOpacity 
                      style={{ backgroundColor: '#23232A', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 6, borderWidth: 1, borderColor: '#A070F2' }} 
                      onPress={() => { 
                        console.log('[SentryAlertModal] closing via call button');
                        setSentryAlertModal(null); 
                        sentryAlertModal.onCall(); 
                      }}
                    >
                      <Text style={{ color: '#A070F2', fontWeight: 'bold', fontSize: 16 }}>Call Contact</Text>
                    </TouchableOpacity>
                  )}
                  {sentryAlertModal?.onText && (
                    <TouchableOpacity 
                      style={{ backgroundColor: '#23232A', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 6, borderWidth: 1, borderColor: '#A070F2' }} 
                      onPress={() => { 
                        console.log('[SentryAlertModal] closing via text button');
                        setSentryAlertModal(null); 
                        sentryAlertModal.onText(); 
                      }}
                    >
                      <Text style={{ color: '#A070F2', fontWeight: 'bold', fontSize: 16 }}>Text Contact</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>
          );
        }
        return null;
      })()}
    </>
  );
}

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <LogProvider>
          <AccessibilityProvider>
            <AppProvider>
              <SentryModeProvider>
                <AppContent />
              </SentryModeProvider>
            </AppProvider>
          </AccessibilityProvider>
        </LogProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
};

export default App;
