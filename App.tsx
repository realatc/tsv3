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

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LatestScamsScreen from './src/screens/LatestScamsScreen';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';
import ThreatAnalysisScreen from './src/screens/ThreatAnalysisScreen';
import AccessibilitySettingsScreen from './src/screens/AccessibilitySettingsScreen';
import ScamDetailScreen from './src/screens/ScamDetailScreen';
import LogDetailScreenWrapper from './src/screens/LogDetailScreenWrapper';
import BrowseScreen from './src/screens/BrowseScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import LogHistoryScreen from './src/screens/LogHistoryScreen';
import HelpAndSupportScreen from './src/screens/HelpAndSupportScreen';
import KnowledgeBaseThreatLevelArticle from './src/screens/KnowledgeBaseThreatLevelArticle';
import KnowledgeBaseScamsArticle from './src/screens/KnowledgeBaseScamsArticle';
import KnowledgeBaseLogDetailsOverview from './src/screens/KnowledgeBaseLogDetailsOverview';
import KnowledgeBaseLogDetailsGeneral from './src/screens/KnowledgeBaseLogDetailsGeneral';
import KnowledgeBaseLogDetailsSecurity from './src/screens/KnowledgeBaseLogDetailsSecurity';
import KnowledgeBaseLogDetailsMetadata from './src/screens/KnowledgeBaseLogDetailsMetadata';
import KnowledgeBaseLogDetailsThreat from './src/screens/KnowledgeBaseLogDetailsThreat';

// Components
import SettingsSheet from './src/components/SettingsSheet';

// Context and Providers
import { LogProvider } from './src/context/LogContext';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import { AppProvider, useApp } from './src/context/AppContext';
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
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="LatestScams" component={LatestScamsScreen} />
      <HomeStack.Screen name="ScamDetail" component={ScamDetailScreen} />
      <HomeStack.Screen name="LogDetail" component={LogDetailScreenWrapper} />
      <HomeStack.Screen name="LogHistory" component={LogHistoryScreen} />
    </HomeStack.Navigator>
  );
}

const BrowseStack = createStackNavigator<BrowseStackParamList>();
function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="Browse" component={BrowseScreen} />
    </BrowseStack.Navigator>
  );
}

const LibraryStack = createStackNavigator<LibraryStackParamList>();
function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="Library" component={LibraryScreen} />
      <LibraryStack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
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
      <SearchStack.Screen name="Search" component={ThreatAnalysisScreen} />
    </SearchStack.Navigator>
  );
}

function TabNavigator() {
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
        component={HomeStackNavigator}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Home', { screen: 'Home' });
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
  const { settingsSheetRef } = useApp();
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
        </Stack.Navigator>
      </NavigationContainer>
      <SettingsSheet ref={settingsSheetRef} />
    </>
  );
}

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LogProvider>
        <AccessibilityProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AccessibilityProvider>
      </LogProvider>
    </GestureHandlerRootView>
  );
};

export default App;
