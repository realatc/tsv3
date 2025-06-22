import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HeaderTitle = () => (
    <View style={styles.logoContainer}>
        <Icon name="shield-outline" size={24} color="#A070F2" />
        <Text style={styles.headerTitle}>ThreatSense</Text>
    </View>
);

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default HeaderTitle; 