/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import LandingScreen from './src/screens/LandingScreen';
import LogHistoryScreen from './src/screens/LogHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import LogDetailScreen from './src/screens/LogDetailScreen';
import ThreatDemoScreen from './src/screens/ThreatDemoScreen';
import { LogProvider } from './src/context/LogContext';
import KnowledgeBaseScreen from './src/screens/KnowledgeBaseScreen';
import KnowledgeBaseThreatLevelArticle from './src/screens/KnowledgeBaseThreatLevelArticle';
import KnowledgeBaseScamsArticle from './src/screens/KnowledgeBaseScamsArticle';
import NavigationPanel from './src/components/NavigationPanel';
import CustomHeader from './src/components/CustomHeader';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <LogProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            header: () => <CustomHeader />,
            drawerStyle: { backgroundColor: '#151a3c', width: 260 },
            drawerActiveTintColor: '#4A90E2',
            drawerInactiveTintColor: '#fff',
            drawerLabelStyle: { fontWeight: 'bold', fontSize: 16 },
          }}
          drawerContent={(props: DrawerContentComponentProps) => <NavigationPanel {...props} />}
        >
          <Drawer.Screen name="Home" component={LandingScreen} />
          <Drawer.Screen name="ThreatDemo" component={ThreatDemoScreen} options={{ title: 'Test' }} />
          <Drawer.Screen name="LogHistory" component={LogHistoryScreen} options={{ title: 'Logs' }} />
          <Drawer.Screen name="LogDetail" component={LogDetailScreen} options={{ drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} options={{ title: 'Knowledge Base' }} />
          <Drawer.Screen name="KnowledgeBaseThreatLevelArticle" component={KnowledgeBaseThreatLevelArticle} options={{ drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="KnowledgeBaseScamsArticle" component={KnowledgeBaseScamsArticle} options={{ drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="About" component={AboutScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </LogProvider>
  );
};

export default App;
