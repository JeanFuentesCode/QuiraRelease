import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ObserveRoot } from 'expo-observe';
import quiraApi from './src/api/quiraApi';
import Calculator from './src/components/Calculator';
import RateCard from './src/components/RateCard';
import HistoryList from './src/components/HistoryList';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('tasas');
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Animación de fundido (fade) para el cambio de modo
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleTheme = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.6, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setIsDarkMode(!isDarkMode);
  };

  const fetchRates = async () => {
    try {
      const response = await quiraApi.get('/rates');
      if (response.data.success) {
        setRates(response.data.rates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRates();
  };

  if (showSplash) {
    return (
      <ObserveRoot>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#000000" : "#F1F5F9"} />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </ObserveRoot>
    );
  }

  const dynamicStyles = getStyles(isDarkMode);

  return (
    <ObserveRoot>
      <Animated.View style={[dynamicStyles.container, { opacity: fadeAnim }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#000000" : "#F1F5F9"} />
          
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={dynamicStyles.themeButton}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={isDarkMode ? '#CA8A04' : '#0F172A'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDarkMode ? "#FFFFFF" : "#09090B"} />
            }
          >
            {/* Pestañas Principales */}
            <View style={dynamicStyles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'tasas' && dynamicStyles.activeTabButton]}
                onPress={() => setActiveTab('tasas')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'tasas' && dynamicStyles.activeTabText]}>
                  Mercado
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'historial' && dynamicStyles.activeTabButton]}
                onPress={() => setActiveTab('historial')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'historial' && dynamicStyles.activeTabText]}>
                  Historial
                </Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#CA8A04" />
              </View>
            ) : (
              <View style={styles.content}>
                {activeTab === 'tasas' ? (
                  <View>
                    <Calculator rates={rates} isDarkMode={isDarkMode} />

                    <View style={styles.sectionHeaderRow}>
                      <Text style={dynamicStyles.sectionTitle}>Tasas Actuales</Text>
                      <Text style={styles.sectionSub}>Ref. Oficiales</Text>
                    </View>

                    <View style={dynamicStyles.marketList}>
                      <RateCard
                        title="Dólar Oficial"
                        subtitle="BCV / VES"
                        rate={rates?.bcvUsd}
                        isDarkMode={isDarkMode}
                      />
                      <RateCard
                        title="USDT P2P"
                        subtitle="Binance / VES"
                        rate={rates?.usdtP2p}
                        isDarkMode={isDarkMode}
                      />
                      <RateCard
                        title="Euro Oficial"
                        subtitle="BCV / VES"
                        rate={rates?.bcvEur}
                        isDarkMode={isDarkMode}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <HistoryList isDarkMode={isDarkMode} />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </ObserveRoot>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#F1F5F9',
    },
    themeButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: isDarkMode ? '#050505' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDarkMode ? '#1F1F23' : '#CBD5E1',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0 : 0.05,
      shadowRadius: 2,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#18181B' : '#E2E8F0',
    },
    activeTabButton: {
      borderBottomColor: '#CA8A04',
    },
    activeTabText: {
      color: isDarkMode ? '#FFFFFF' : '#0F172A',
      fontWeight: '800',
    },
    sectionTitle: {
      color: isDarkMode ? '#FFFFFF' : '#0F172A',
      fontSize: 15,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    marketList: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: isDarkMode ? '#1F1F23' : '#CBD5E1',
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#050505' : '#FFFFFF',
    },
  });

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  logo: {
    width: 52,
    height: 52,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionSub: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    marginTop: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
