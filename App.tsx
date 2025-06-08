/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/screens/LandingScreen';
import LogHistoryScreen from './src/screens/LogHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import LogDetailScreen from './src/screens/LogDetailScreen';
import ThreatDemoScreen from './src/screens/ThreatDemoScreen';
import CustomHeader from './src/components/CustomHeader';
import { LogProvider } from './src/context/LogContext';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';
import KnowledgeBaseThreatLevelArticle from './src/screens/KnowledgeBaseThreatLevelArticle';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <LogProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: () => <CustomHeader />,
            contentStyle: { backgroundColor: 'transparent' },
          }}>
          <Stack.Screen name="Home" component={LandingScreen} />
          <Stack.Screen name="ThreatDemo" component={ThreatDemoScreen} />
          <Stack.Screen name="LogHistory" component={LogHistoryScreen} />
          <Stack.Screen name="LogDetail" component={LogDetailScreen} />
          <Stack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
          <Stack.Screen name="KnowledgeBaseThreatLevelArticle" component={KnowledgeBaseThreatLevelArticle} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LogProvider>
  );
};

export default App;
