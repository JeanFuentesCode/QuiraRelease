import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import quiraApi from '../api/quiraApi';

export default function HistoryList({ isDarkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await quiraApi.get('/rates/history?limit=5');
        if (response.data.success) {
          setHistory(response.data.history);
        }
      } catch (error) {
        // Manejo silencioso
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const dynamicStyles = getStyles(isDarkMode);

  if (loading) {
    return <ActivityIndicator color="#CA8A04" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.sectionTitle}>Historial de Variaciones</Text>
      {history.map((item, index) => {
        const dateObj = new Date(item.created_at);
        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <View key={item.id || index} style={dynamicStyles.itemCard}>
            <View style={styles.rowTop}>
              <View style={styles.dateContainer}>
                <Ionicons name="time-outline" size={13} color="#71717A" />
                <Text style={dynamicStyles.dateText}>
                  {formattedDate} • <Text style={styles.timeHighlight}>{formattedTime}</Text>
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Ref</Text>
              </View>
            </View>
            
            <View style={styles.rowRates}>
              <View style={styles.rateColumn}>
                <Text style={styles.rateLabel}>BCV USD</Text>
                <Text style={dynamicStyles.rateValue}>Bs. {item.bcv_usd}</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateColumn}>
                <Text style={styles.rateLabel}>Binance P2P</Text>
                <Text style={dynamicStyles.rateValue}>Bs. {item.usdt_p2p}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      marginTop: 4,
    },
    sectionTitle: {
      color: isDarkMode ? '#FFFFFF' : '#0F172A',
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 16,
      letterSpacing: 0.5,
    },
    itemCard: {
      backgroundColor: isDarkMode ? '#050505' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#1F1F23' : '#CBD5E1',
    },
    dateText: {
      color: '#71717A',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
    },
    rateValue: {
      color: isDarkMode ? '#FFFFFF' : '#0F172A',
      fontSize: 15,
      fontWeight: '800',
      marginTop: 2,
    },
  });

const styles = StyleSheet.create({
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeHighlight: {
    color: '#CA8A04',
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#CA8A0420',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#CA8A04',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rowRates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateColumn: {
    flex: 1,
  },
  rateLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rateDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
});