import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  // Animaciones de entrada (Translación, Rotación, Escala y Opacidad)
  const moveAnim = useRef(new Animated.ValueXY({ x: -width, y: -height })).current;
  const scaleAnim = useRef(new Animated.Value(0.15)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animación de opacidad para el texto
  const textOpacityAnim = useRef(new Animated.Value(0)).current;

  // Animación del brillo interno
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrada RÁPIDA y FLUIDA (1.2 segundos)
    Animated.parallel([
      Animated.timing(moveAnim, {
        toValue: { x: 0, y: 0 },
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Aparición del texto + Brillo exprés (0.4 segundos)
      Animated.parallel([
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.85,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // 3. Breve descanso imperceptible antes de pasar al home (0.6 segundos)
        setTimeout(() => {
          onFinish();
        }, 600);
      });
    });
  }, []);

  // Mapear la rotación a 720 grados (2 vueltas rápidas)
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <View style={styles.container}>
      {/* Contenido Central */}
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: opacityAnim,
              transform: [
                { translateX: moveAnim.x },
                { translateY: moveAnim.y },
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          {/* Logo Base */}
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Capa de Brillo */}
          <Animated.Image
            source={require('../../assets/logo.png')}
            style={[
              styles.logo,
              styles.glowLayer,
              {
                opacity: glowAnim,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Nombre de la App */}
        <Animated.View style={{ opacity: textOpacityAnim }}>
          <Text style={styles.brandTitle}>QUIRA</Text>
        </Animated.View>
      </View>

      {/* Versión */}
      <Animated.View style={[styles.versionContainer, { opacity: textOpacityAnim }]}>
        <Text style={styles.versionText}>v1.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  glowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: '#FFFFFF',
  },
  brandTitle: {
    marginTop: 8,
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 1,
  },
});