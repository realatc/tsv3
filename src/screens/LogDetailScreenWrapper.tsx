import React, { useState, useEffect } from 'react';
import { LogDetailScreen } from './LogDetailScreen';
import { RouteProp, useNavigation } from '@react-navigation/native';

type WrapperProps = {
  route: RouteProp<any>;
  navigation: any;
};

const LogDetailScreenWrapper = (props: WrapperProps) => {
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const navigation = useNavigation();

  // Always set setActionSheetVisible in navigation params for the header
  useEffect(() => {
    // @ts-ignore
    navigation.setParams({ setActionSheetVisible });
  }, [setActionSheetVisible, navigation]);

  return (
    <LogDetailScreen
      {...props}
      actionSheetVisible={actionSheetVisible}
      setActionSheetVisible={setActionSheetVisible}
    />
  );
};

export default LogDetailScreenWrapper; 