import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemeAwareViewProps extends ViewProps {
  variant?: 'background' | 'surface' | 'card' | 'surfaceSecondary';
  style?: ViewStyle;
}

export const ThemeAwareView: React.FC<ThemeAwareViewProps> = ({ 
  variant = 'background', 
  style, 
  children, 
  ...props 
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return theme.surface;
      case 'card':
        return theme.card;
      case 'surfaceSecondary':
        return theme.surfaceSecondary;
      default:
        return theme.background;
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default ThemeAwareView; 