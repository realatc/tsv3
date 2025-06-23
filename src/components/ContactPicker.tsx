import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, TextInput, PermissionsAndroid, Platform, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import { SentryModeSettings } from '../context/SentryModeContext';

interface ContactPickerProps {
  selectedContact: SentryModeSettings['trustedContact'];
  onContactSelect: (contact: SentryModeSettings['trustedContact']) => void;
}

interface Contact {
  recordID: string;
  displayName: string;
  phoneNumbers: Array<{
    number: string;
    label: string;
  }>;
}

const ContactPicker: React.FC<ContactPickerProps> = ({ selectedContact, onContactSelect }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const checkPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contact Permission',
            message: 'ThreatSense needs access to your contacts to select a trusted contact for Sentry Mode.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        // iOS permissions are handled differently - we'll check when loading contacts
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
    }
  };

  const loadContacts = async () => {
    console.log('loadContacts called');
    
    if (!hasPermission) {
      console.log('No permission, requesting...');
      Alert.alert(
        'Permission Required',
        'Please grant contact permissions to select from your contacts.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: checkPermissions }
        ]
      );
      return;
    }

    setIsLoading(true);
    console.log('Loading contacts...');
    
    try {
      // For iOS, we need to check permissions at runtime
      if (Platform.OS === 'ios') {
        console.log('Checking iOS permissions...');
        const authStatus = await Contacts.checkPermission();
        console.log('iOS auth status:', authStatus);
        
        if (authStatus !== 'authorized') {
          console.log('Requesting iOS permission...');
          const newAuthStatus = await Contacts.requestPermission();
          console.log('New iOS auth status:', newAuthStatus);
          
          if (newAuthStatus !== 'authorized') {
            Alert.alert(
              'Permission Denied',
              'Contact access is required to select a trusted contact. Please enable it in Settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() }
              ]
            );
            setIsLoading(false);
            return;
          }
        }
      }

      console.log('Getting all contacts...');
      const allContacts = await Contacts.getAll();
      console.log('Total contacts found:', allContacts.length);
      
      const contactsWithPhones = allContacts
        .filter(contact => 
          contact.phoneNumbers && 
          contact.phoneNumbers.length > 0 &&
          contact.displayName !== null
        )
        .map(contact => ({
          recordID: contact.recordID,
          displayName: contact.displayName || 'Unknown',
          phoneNumbers: contact.phoneNumbers || []
        }));
      
      console.log('Contacts with phones:', contactsWithPhones.length);
      setContacts(contactsWithPhones);
      setFilteredContacts(contactsWithPhones);
      console.log('Contacts loaded successfully');
      
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert(
        'Error Loading Contacts',
        'Failed to load contacts. Please try again or use the mock contact option.',
        [
          { text: 'Use Mock Contact', onPress: () => {
            const mockContact = {
              name: 'John Doe',
              phoneNumber: '+1 (555) 123-4567'
            };
            onContactSelect(mockContact);
          }},
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactPress = () => {
    Alert.alert(
      'Select Contact',
      'Choose how to select your trusted contact:',
      [
        {
          text: 'From Contacts',
          onPress: async () => {
            try {
              console.log('Opening contact picker...');
              if (hasPermission) {
                await loadContacts();
                console.log('Setting modal visible...');
                setIsModalVisible(true);
              } else {
                console.log('Requesting permissions...');
                await checkPermissions();
              }
            } catch (error) {
              console.error('Error opening contact picker:', error);
              Alert.alert(
                'Error',
                'Unable to open contacts. Please try the mock contact option.',
                [
                  { text: 'Use Mock Contact', onPress: () => {
                    const mockContact = {
                      name: 'John Doe',
                      phoneNumber: '+1 (555) 123-4567'
                    };
                    onContactSelect(mockContact);
                  }},
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }
          }
        },
        {
          text: 'Mock Contact (Demo)',
          onPress: () => {
            console.log('Using mock contact');
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
          onPress: () => {
            console.log('Clearing contact');
            onContactSelect(null);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleContactSelect = (contact: Contact) => {
    const phoneNumber = contact.phoneNumbers[0]?.number || '';
    const selectedContactData = {
      name: contact.displayName,
      phoneNumber: phoneNumber
    };
    onContactSelect(selectedContactData);
    setIsModalVisible(false);
    setSearchQuery('');
  };

  const getContactDisplayText = () => {
    if (!selectedContact) {
      return 'Not Set';
    }
    return `${selectedContact.name} (${selectedContact.phoneNumber})`;
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactSelect(item)}
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.displayName}</Text>
        <Text style={styles.contactPhone}>
          {item.phoneNumbers[0]?.number || 'No phone number'}
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#555" />
    </TouchableOpacity>
  );

  return (
    <>
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

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          console.log('Modal closing...');
          setIsModalVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                console.log('Close button pressed');
                setIsModalVisible(false);
                setSearchQuery('');
              }}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Contact</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.recordID}
              style={styles.contactsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No contacts found</Text>
                  <Text style={styles.emptySubtext}>Try using the mock contact option</Text>
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#A070F2',
    fontSize: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    margin: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: {
    color: '#8A8A8E',
    fontSize: 14,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8A8A8E',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#8A8A8E',
    fontSize: 14,
  },
});

export default ContactPicker; 