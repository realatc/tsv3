/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import LandingScreen from './src/screens/LandingScreen';
import LogHistoryScreen from './src/screens/LogHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import LogDetailScreenWrapper from './src/screens/LogDetailScreenWrapper';
import ThreatDemoScreen from './src/screens/ThreatDemoScreen';
import BlockedSendersScreen from './src/screens/BlockedSendersScreen';
import { LogProvider } from './src/context/LogContext';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';
import KnowledgeBaseThreatLevelArticle from './src/screens/KnowledgeBaseThreatLevelArticle';
import KnowledgeBaseScamsArticle from './src/screens/KnowledgeBaseScamsArticle';
import KnowledgeBaseLogDetailsOverview from './src/screens/KnowledgeBaseLogDetailsOverview';
import KnowledgeBaseLogDetailsGeneral from './src/screens/KnowledgeBaseLogDetailsGeneral';
import KnowledgeBaseLogDetailsSecurity from './src/screens/KnowledgeBaseLogDetailsSecurity';
import KnowledgeBaseLogDetailsMetadata from './src/screens/KnowledgeBaseLogDetailsMetadata';
import KnowledgeBaseLogDetailsThreat from './src/screens/KnowledgeBaseLogDetailsThreat';
import NavigationPanel from './src/components/NavigationPanel';
import CustomHeader from './src/components/CustomHeader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { Text } from 'react-native';
import { RootStackParamList } from './src/types/navigation';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        header: ({ navigation, route }) => (
          <CustomHeader />
        ),
        drawerStyle: { backgroundColor: '#1a1a1a', width: 260 },
        drawerActiveTintColor: '#4A90E2',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: { fontWeight: 'bold', fontSize: 16 },
      }}
      drawerContent={(props: DrawerContentComponentProps) => <NavigationPanel {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="ThreatDemo" component={ThreatDemoScreen} options={{ title: 'Test' }} />
      <Drawer.Screen name="LogHistory" component={LogHistoryScreen} options={{ title: 'Logs' }} />
      <Drawer.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} options={{ title: 'Knowledge Base' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyDa9-UUYEyjqRXjDnD9_J77A-S_R0RZ9zg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: { clientId: 'test', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes: ['MALWARE'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: 'http://malware.testing.google.test/testing/malware/' }]
        }
      })
    })
      .then(res => res.json())
      .then(data => console.log('Test fetch result:', data))
      .catch(err => console.log('Test fetch error:', err));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LogProvider>
        <AccessibilityProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
              <Stack.Screen 
                name="LogDetail" 
                component={LogDetailScreenWrapper} 
                options={({ route }) => ({
                  header: () => (
                    <CustomHeader 
                      title="Details" 
                      onActionMenuPress={() => {
                        const params = route.params as { setActionSheetVisible?: (visible: boolean) => void };
                        params?.setActionSheetVisible?.(true);
                      }}
                    />
                  )
                })}
              />
              <Stack.Screen name="BlockedSenders" component={BlockedSendersScreen} options={{ header: () => <CustomHeader title="Blocked Senders" /> }} />
              <Stack.Screen
                name="KnowledgeBaseThreatLevelArticle"
                component={KnowledgeBaseThreatLevelArticle}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="KnowledgeBaseScamsArticle"
                component={KnowledgeBaseScamsArticle}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="KnowledgeBaseLogDetailsOverview"
                component={KnowledgeBaseLogDetailsOverview}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="KnowledgeBaseLogDetailsGeneral"
                component={KnowledgeBaseLogDetailsGeneral}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="KnowledgeBaseLogDetailsSecurity"
                component={KnowledgeBaseLogDetailsSecurity}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="KnowledgeBaseLogDetailsMetadata"
                component={KnowledgeBaseLogDetailsMetadata}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="KnowledgeBaseLogDetailsThreat"
                component={KnowledgeBaseLogDetailsThreat}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ header: () => <CustomHeader title="Search Results" /> }} />
            </Stack.Navigator>
          </NavigationContainer>
        </AccessibilityProvider>
      </LogProvider>
    </GestureHandlerRootView>
  );
};

export default App;
