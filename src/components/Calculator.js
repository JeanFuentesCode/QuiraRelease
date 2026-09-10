import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';

// Formatea el texto ingresado con puntos de millar y coma decimal
const formatCurrencyInput = (text, maxIntegerDigits = 12) => {
  if (!text) return '';

  let normalized = text.replace('.', ',');
  const parts = normalized.split(',');

  if (parts.length > 2) return text.slice(0, -1);

  const integerRaw = parts[0].replace(/\D/g, '');
  if (integerRaw.length > maxIntegerDigits) return text.slice(0, -1);

  const integerFormatted = integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (parts.length === 2) {
    const decimalRaw = parts[1].replace(/\D/g, '').slice(0, 2);
    return `${integerFormatted},${decimalRaw}`;
  }

  return integerFormatted;
};

// Convierte el texto formateado (ej. "1.000,50") a Float para cálculos
const parseFormattedToFloat = (formattedText) => {
  if (!formattedText) return 0;
  const clean = formattedText.replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

export default function Calculator({ rates, isDarkMode }) {
  const [selectedRate, setSelectedRate] = useState('bcvUsd');
  const currentRate = rates ? rates[selectedRate] || 1 : 1;
  
  // Inicialización con formato correcto
  const [foreignAmount, setForeignAmount] = useState('1');
  const [vesAmount, setVesAmount] = useState(formatCurrencyInput(currentRate.toFixed(2)));

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerAnim = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleRateChange = (rateKey) => {
    triggerAnim();
    setSelectedRate(rateKey);
    const newRate = rates ? rates[rateKey] || 1 : 1;
    const numForeign = parseFormattedToFloat(foreignAmount);
    setVesAmount(formatCurrencyInput((numForeign * newRate).toFixed(2)));
  };

  const handleForeignInput = (text) => {
    const formatted = formatCurrencyInput(text);
    setForeignAmount(formatted);
    const num = parseFormattedToFloat(formatted);
    setVesAmount(formatCurrencyInput((num * currentRate).toFixed(2)));
  };

  const handleVesInput = (text) => {
    const formatted = formatCurrencyInput(text);
    setVesAmount(formatted);
    const num = parseFormattedToFloat(formatted);
    if (currentRate > 0) {
      setForeignAmount(formatCurrencyInput((num / currentRate).toFixed(2)));
    }
  };

  const dynamicStyles = getStyles(isDarkMode);

  return (
    <Animated.View style={[dynamicStyles.calcCard, { transform: [{ scale: scaleAnim }] }]}>
      <View style={dynamicStyles.pillContainer}>
        {['bcvUsd', 'bcvEur', 'usdtP2p'].map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.pill, selectedRate === key && dynamicStyles.activePill]}
            onPress={() => handleRateChange(key)}
          >
            <Text style={[dynamicStyles.pillText, selectedRate === key && dynamicStyles.activePillText]}>
              {key === 'bcvUsd' ? 'BCV $' : key === 'bcvEur' ? 'BCV €' : 'USDT'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputSection}>
        <Text style={dynamicStyles.symbol}>
          {selectedRate === 'bcvEur' ? '€' : selectedRate === 'usdtP2p' ? '₮' : '$'}
        </Text>
        <TextInput
          style={dynamicStyles.textInput}
          keyboardType="decimal-pad"
          value={foreignAmount}
          onChangeText={handleForeignInput}
          placeholder="0"
          placeholderTextColor={isDarkMode ? '#3F3F46' : '#A1A1AA'}
          selectionColor="#CA8A04"
          maxLength={18}
        />
      </View>

      <View style={dynamicStyles.separator} />

      <View style={styles.outputSection}>
        <Text style={styles.outputLabel}>BOLÍVARES (VES)</Text>
        <View style={styles.inputSection}>
          <Text style={dynamicStyles.outputCurrency}>Bs.</Text>
          <TextInput
            style={dynamicStyles.textInput}
            keyboardType="decimal-pad"
            value={vesAmount}
            onChangeText={handleVesInput}
            placeholder="0,00"
            placeholderTextColor={isDarkMode ? '#3F3F46' : '#A1A1AA'}
            selectionColor="#CA8A04"
            maxLength={18}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const getStyles = (isDarkMode) => StyleSheet.create({
  calcCard: {
    backgroundColor: isDarkMode ? '#050505' : '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? '#1F1F23' : '#CBD5E1',
  },
  pillContainer: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#18181B' : '#E2E8F0' },
  activePill: { borderBottomColor: '#CA8A04' },
  pillText: { color: isDarkMode ? '#A1A1AA' : '#64748B', fontSize: 12, fontWeight: '700' },
  activePillText: { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
  symbol: { color: isDarkMode ? '#FFFFFF' : '#0F172A', fontSize: 34, fontWeight: '800', marginRight: 8 },
  textInput: { flex: 1, color: isDarkMode ? '#FFFFFF' : '#0F172A', fontSize: 34, fontWeight: '800', backgroundColor: 'transparent' },
  separator: { height: 1, backgroundColor: isDarkMode ? '#18181B' : '#E2E8F0', marginVertical: 16 },
  outputCurrency: { color: '#CA8A04', fontSize: 28, fontWeight: '700', marginRight: 6 }
});

const styles = StyleSheet.create({
  pill: { flex: 1, paddingBottom: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  inputSection: { flexDirection: 'row', alignItems: 'center' },
  outputLabel: { color: '#64748B', fontSize: 10, fontWeight: '800', marginBottom: 4 }
});
