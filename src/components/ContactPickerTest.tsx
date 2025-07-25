import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import ContactPicker from './ContactPicker';
import { useTheme } from '../context/ThemeContext';

const ContactPickerTest = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const handleContactSelect = (contact: any) => {
    console.log('Contact selected:', contact);
    setSelectedContact(contact);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Contact Picker Test</Text>
        <Text style={styles.subtitle}>Test the contact picker functionality</Text>
        
        <ContactPicker
          selectedContact={selectedContact}
          onContactSelect={handleContactSelect}
        />
        
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Selected Contact:</Text>
          <Text style={styles.resultText}>
            {selectedContact 
              ? `${selectedContact.name} (${selectedContact.phoneNumber})`
              : 'None selected'
            }
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: theme.textSecondary,
    fontSize: 16,
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  resultTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultText: {
    color: theme.textSecondary,
    fontSize: 16,
  },
});

export default ContactPickerTest; 