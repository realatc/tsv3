import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import ContactPicker from './ContactPicker';

const ContactPickerTest = () => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#8A8A8E',
    fontSize: 16,
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultText: {
    color: '#8A8A8E',
    fontSize: 16,
  },
});

export default ContactPickerTest; 