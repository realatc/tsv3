import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export type ThreatLevel = 'Low' | 'Medium' | 'High';

interface ThreatLevelPickerProps {
  selectedLevel: ThreatLevel;
  onLevelSelect: (level: ThreatLevel) => void;
}

const threatLevels: { level: ThreatLevel; label: string; color: string; icon: string; description: string }[] = [
  {
    level: 'Low',
    label: 'Low',
    color: '#4CAF50',
    icon: 'shield-outline',
    description: 'Minor threats only'
  },
  {
    level: 'Medium',
    label: 'Medium',
    color: '#FF9800',
    icon: 'shield-half',
    description: 'Moderate threats'
  },
  {
    level: 'High',
    label: 'High',
    color: '#F44336',
    icon: 'shield',
    description: 'Significant threats'
  }
];

const ThreatLevelPicker: React.FC<ThreatLevelPickerProps> = ({ selectedLevel, onLevelSelect }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedThreatLevel = threatLevels.find(tl => tl.level === selectedLevel);

  const handleLevelPress = (level: ThreatLevel) => {
    onLevelSelect(level);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setIsModalVisible(true)}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={[styles.levelIndicator, { backgroundColor: selectedThreatLevel?.color }]}>
              <Icon name={selectedThreatLevel?.icon as any} size={16} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Notify on Threat Level</Text>
              <Text style={styles.value}>{selectedLevel}</Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={20} color="#555" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Threat Level</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {threatLevels.map((threatLevel) => (
                <TouchableOpacity
                  key={threatLevel.level}
                  style={[
                    styles.option,
                    selectedLevel === threatLevel.level && styles.selectedOption
                  ]}
                  onPress={() => handleLevelPress(threatLevel.level)}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.optionIcon, { backgroundColor: threatLevel.color }]}>
                      <Icon name={threatLevel.icon as any} size={20} color="#fff" />
                    </View>
                    <View style={styles.optionText}>
                      <Text style={styles.optionLabel}>{threatLevel.label}</Text>
                      <Text style={styles.optionDescription}>{threatLevel.description}</Text>
                    </View>
                    {selectedLevel === threatLevel.level && (
                      <Icon name="checkmark-circle" size={24} color="#A070F2" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  levelIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    padding: 20,
  },
  option: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#2C2C2E',
  },
  selectedOption: {
    backgroundColor: '#3A3A3C',
    borderWidth: 1,
    borderColor: '#A070F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  optionDescription: {
    color: '#8A8A8E',
    fontSize: 14,
    marginTop: 2,
  },
});

export default ThreatLevelPicker; 