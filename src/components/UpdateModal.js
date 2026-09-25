import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UpdateModal({
  visible,
  updateData,
  onUpdate,
  onClose,
  isDarkMode,
}) {
  if (!updateData) return null;

  const dynamicStyles = getStyles(isDarkMode);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, dynamicStyles.modalCard]}>
              
              {/* Encabezado con Icono y Tag de Versión */}
              <View style={styles.headerRow}>
                <View style={dynamicStyles.iconBadge}>
                  <Ionicons name="sparkles" size={24} color="#CA8A04" />
                </View>
                <View style={styles.versionBadge}>
                  <Text style={styles.versionText}>v{updateData.versionName}</Text>
                </View>
              </View>

              {/* Título y Subtítulo */}
              <Text style={dynamicStyles.title}>Nueva actualización</Text>
              <Text style={dynamicStyles.subtitle}>
                Hay una versión disponible con mejoras de rendimiento.
              </Text>

              {/* Lista de Novedades */}
              {updateData.notes ? (
                <View style={dynamicStyles.notesContainer}>
                  <Text style={dynamicStyles.notesTitle}>NOVEDADES</Text>
                  <ScrollView style={{ maxHeight: 110 }} showsVerticalScrollIndicator={false}>
                    <Text style={dynamicStyles.notesText}>{updateData.notes}</Text>
                  </ScrollView>
                </View>
              ) : null}

              {/* Acciones */}
              <View style={styles.buttonStack}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onUpdate}
                  activeOpacity={0.85}
                >
                  <Ionicons name="cloud-download-outline" size={18} color="#000000" />
                  <Text style={styles.primaryButtonText}>Actualizar ahora</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={dynamicStyles.secondaryButtonText}>Luego</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    modalCard: {
      backgroundColor: isDarkMode ? '#09090B' : '#FFFFFF',
      borderColor: isDarkMode ? '#27272A' : '#E2E8F0',
    },
    iconBadge: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: isDarkMode ? '#18181B' : '#FEF9C3',
      borderWidth: 1,
      borderColor: isDarkMode ? '#27272A' : '#FEF08A',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: isDarkMode ? '#FAFAFA' : '#0F172A',
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 13,
      color: isDarkMode ? '#A1A1AA' : '#64748B',
      marginTop: 4,
      marginBottom: 16,
    },
    notesContainer: {
      width: '100%',
      backgroundColor: isDarkMode ? '#121215' : '#F8FAFC',
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#18181B' : '#E2E8F0',
    },
    notesTitle: {
      fontSize: 10,
      fontWeight: '800',
      color: '#CA8A04',
      letterSpacing: 1.2,
      marginBottom: 6,
    },
    notesText: {
      fontSize: 13,
      color: isDarkMode ? '#D4D4D8' : '#334155',
      lineHeight: 19,
    },
    secondaryButtonText: {
      color: isDarkMode ? '#71717A' : '#94A3B8',
      fontSize: 13,
      fontWeight: '600',
    },
  });

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  versionBadge: {
    backgroundColor: 'rgba(202, 138, 4, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(202, 138, 4, 0.25)',
  },
  versionText: {
    color: '#CA8A04',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  buttonStack: {
    width: '100%',
    gap: 8,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#CA8A04',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryButton: {
    width: '100%',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
