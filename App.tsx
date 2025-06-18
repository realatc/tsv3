/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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
import NavigationPanel from './src/components/NavigationPanel';
import CustomHeader from './src/components/CustomHeader';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
  return (
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
                    title="Log Details" 
                    onActionMenuPress={() => {
                      const params = route.params as { setActionSheetVisible?: (visible: boolean) => void };
                      params?.setActionSheetVisible?.(true);
                    }}
                  />
                )
              })}
            />
            <Stack.Screen name="BlockedSenders" component={BlockedSendersScreen} options={{ header: () => <CustomHeader title="Blocked Senders" /> }} />
            <Stack.Screen name="KnowledgeBaseThreatLevelArticle" component={KnowledgeBaseThreatLevelArticle} options={{ header: () => <CustomHeader title="How Threat Levels Are Calculated" /> }} />
            <Stack.Screen name="KnowledgeBaseScamsArticle" component={KnowledgeBaseScamsArticle} options={{ header: () => <CustomHeader title="Common Digital Scams" /> }} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ header: () => <CustomHeader title="Search Results" /> }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AccessibilityProvider>
    </LogProvider>
  );
};

export default App;
