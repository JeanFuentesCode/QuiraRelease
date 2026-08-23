import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  // Animaciones de entrada (Translación, Rotación, Escala y Opacidad)
  const moveAnim = useRef(new Animated.ValueXY({ x: -width, y: -height })).current;
  const scaleAnim = useRef(new Animated.Value(0.15)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animación de opacidad para el pie de página
  const textOpacityAnim = useRef(new Animated.Value(0)).current;

  // Animación del brillo interno
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrada rápida y fluida
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
      // 2. Aparición del pie de página y brillo
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
        // 3. Transición al home
        setTimeout(() => {
          onFinish();
        }, 600);
      });
    });
  }, []);

  // Rotación a 720 grados
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
            source={require('../../assets/logo.webp')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Capa de Brillo */}
          <Animated.Image
            source={require('../../assets/logo.webp')}
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
      </View>

      {/* Pie de página: Propiedad Onyx Studio centrada */}
      <Animated.View style={[styles.footerContainer, { opacity: textOpacityAnim }]}>
        <Text style={styles.footerText}>by Onyx Studio</Text>
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
  footerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 1,
  },
});
