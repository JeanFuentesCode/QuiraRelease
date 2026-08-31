import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function Calculator({ rates, isDarkMode }) {
  const [selectedRate, setSelectedRate] = useState('bcvUsd');
  const currentRate = rates ? rates[selectedRate] || 1 : 1;
  
  const [foreignAmount, setForeignAmount] = useState('1');
  const [vesAmount, setVesAmount] = useState(currentRate.toFixed(2));

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerAnim = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const parseNumber = (text) => {
    if (!text) return 0;
    let clean = text.replace(/\s/g, '');

    if (clean.includes('.') && clean.includes(',')) {
      const lastDot = clean.lastIndexOf('.');
      const lastComma = clean.lastIndexOf(',');

      if (lastComma > lastDot) {
        clean = clean.replace(/\./g, '').replace(',', '.');
      } else {
        clean = clean.replace(/,/g, '');
      }
    } 
    else if (clean.includes('.')) {
      const parts = clean.split('.');
      if (parts.length > 1 && parts[parts.length - 1].length === 3 && parts.length === 2) {
        clean = clean.replace(/\./g, '');
      } else {
        const lastPart = parts[parts.length - 1];
        if (lastPart.length !== 3) {
          const integerPart = parts.slice(0, -1).join('');
          clean = integerPart + '.' + lastPart;
        } else {
          clean = clean.replace(/\./g, '');
        }
      }
    } 
    else if (clean.includes(',')) {
      const parts = clean.split(',');
      if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
        clean = clean.replace(',', '.');
      } else {
        clean = clean.replace(',', '.');
      }
    }

    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const handleRateChange = (rateKey) => {
    triggerAnim();
    setSelectedRate(rateKey);
    const newRate = rates ? rates[rateKey] || 1 : 1;
    const num = parseNumber(foreignAmount);
    if (num > 0) {
      setVesAmount((num * newRate).toFixed(2).slice(0, 12));
    } else {
      setVesAmount('');
    }
  };

  const handleForeignInput = (text) => {
    // Limitar entrada directa a 12 caracteres
    if (text.length > 12) return;
    
    setForeignAmount(text);
    if (text === '') {
      setVesAmount('');
      return;
    }
    const num = parseNumber(text);
    setVesAmount((num * currentRate).toFixed(2).slice(0, 12));
  };

  const handleVesInput = (text) => {
    // Limitar entrada directa a 12 caracteres
    if (text.length > 12) return;
    
    setVesAmount(text);
    if (text === '') {
      setForeignAmount('');
      return;
    }
    const num = parseNumber(text);
    if (currentRate > 0) {
      setForeignAmount((num / currentRate).toFixed(2).slice(0, 12));
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
          keyboardType="numeric"
          maxLength={12}
          value={foreignAmount}
          onChangeText={handleForeignInput}
          placeholder="0"
          placeholderTextColor={isDarkMode ? '#3F3F46' : '#A1A1AA'}
          selectionColor="#CA8A04"
        />
      </View>

      <View style={dynamicStyles.separator} />

      <View style={styles.outputSection}>
        <Text style={styles.outputLabel}>BOLÍVARES (VES)</Text>
        <View style={styles.inputSection}>
          <Text style={dynamicStyles.outputCurrency}>Bs.</Text>
          <TextInput
            style={dynamicStyles.textInput}
            keyboardType="numeric"
            maxLength={12}
            value={vesAmount}
            onChangeText={handleVesInput}
            placeholder="0.00"
            placeholderTextColor={isDarkMode ? '#3F3F46' : '#A1A1AA'}
            selectionColor="#CA8A04"
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