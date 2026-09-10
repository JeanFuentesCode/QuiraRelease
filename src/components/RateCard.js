import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RateCard({ title, rate, subtitle, isDarkMode }) {
  const dynamicStyles = getStyles(isDarkMode);

  return (
    <View style={dynamicStyles.marketItem}>
      <View style={dynamicStyles.marketLeft}>
        <View>
          <Text style={dynamicStyles.marketName}>{title}</Text>
          <Text style={dynamicStyles.marketCode}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.marketRight}>
        <Text style={dynamicStyles.marketPrice}>
          {rate ? rate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        </Text>
        <Text style={styles.marketUnit}>Bs.</Text>
      </View>
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    marketItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#121215' : '#F1F5F9',
      backgroundColor: isDarkMode ? '#050505' : '#FFFFFF',
    },
    marketLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    marketName: {
      color: isDarkMode ? '#FFFFFF' : '#09090B',
      fontSize: 14,
      fontWeight: '700',
    },
    marketCode: {
      color: '#71717A',
      fontSize: 11,
      fontWeight: '500',
      marginTop: 1,
    },
    marketPrice: {
      color: isDarkMode ? '#FFFFFF' : '#09090B',
      fontSize: 15,
      fontWeight: '800',
      letterSpacing: -0.5,
      marginRight: 4,
    },
    marketUnit: {
      color: '#71717A',
      fontSize: 12,
      fontWeight: '600',
    },
  });

const styles = StyleSheet.create({
  marketRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  marketUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
});