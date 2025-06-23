import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SentryModeSettings } from '../context/SentryModeContext';

interface ContactPickerProps {
  selectedContact: SentryModeSettings['trustedContact'];
  onContactSelect: (contact: SentryModeSettings['trustedContact']) => void;
}

const ContactPicker: React.FC<ContactPickerProps> = ({ selectedContact, onContactSelect }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleContactPress = () => {
    // For now, we'll use a mock contact picker
    // In a real implementation, you'd integrate with react-native-contacts
    Alert.alert(
      'Select Contact',
      'Choose how to select your trusted contact:',
      [
        {
          text: 'Mock Contact (Demo)',
          onPress: () => {
            const mockContact = {
              name: 'John Doe',
              phoneNumber: '+1 (555) 123-4567'
            };
            onContactSelect(mockContact);
          }
        },
        {
          text: 'Clear Contact',
          style: 'destructive',
          onPress: () => onContactSelect(null)
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const getContactDisplayText = () => {
    if (!selectedContact) {
      return 'Not Set';
    }
    return `${selectedContact.name} (${selectedContact.phoneNumber})`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleContactPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Icon name="person-circle-outline" size={24} color="#A070F2" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Trusted Contact</Text>
            <Text style={styles.value} numberOfLines={1}>
              {getContactDisplayText()}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color="#555" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  value: {
    color: '#8A8A8E',
    fontSize: 15,
    marginTop: 2,
  },
});

export default ContactPicker; 