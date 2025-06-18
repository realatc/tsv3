import React from 'react';
import { Text, TextProps } from 'react-native';
import { useAccessibility, getAccessibleFontSize, getAccessibleColors } from '../context/AccessibilityContext';

interface AccessibleTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'button';
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  variant = 'body',
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  style,
  children,
  ...props
}) => {
  const { settings } = useAccessibility();
  
  // Get accessible colors based on settings
  const colors = getAccessibleColors(settings);
  
  // Calculate font size with large text mode
  let baseFontSize = getAccessibleFontSize(settings);
  if (settings.largeTextMode) {
    baseFontSize *= 1.2; // Additional 20% increase for large text mode
  }
  
  const variantStyles = {
    title: {
      fontSize: baseFontSize * 1.75,
      fontWeight: 'bold' as const,
    },
    subtitle: {
      fontSize: baseFontSize * 1.25,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: baseFontSize,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontSize: baseFontSize * 0.875,
      fontWeight: 'normal' as const,
    },
    button: {
      fontSize: baseFontSize * 1.125,
      fontWeight: '600' as const,
    },
  };

  const accessibleProps = accessible ? {
    accessible: true,
    accessibilityLabel: accessibilityLabel || (typeof children === 'string' ? children : undefined),
    accessibilityHint,
    accessibilityRole: 'text' as const,
  } : {};

  // Determine text color based on accessibility settings
  let textColor = colors.text;
  if (settings.highContrastMode) {
    textColor = '#FFFFFF';
  } else if (settings.colorBlindFriendly) {
    textColor = colors.text;
  }

  return (
    <Text
      style={[
        variantStyles[variant],
        { color: textColor },
        style,
      ]}
      {...accessibleProps}
      {...props}
    >
      {children}
    </Text>
  );
}; 