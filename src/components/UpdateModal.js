import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
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
      {/* Fondo semitransparente */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, dynamicStyles.modalCard]}>
              
              {/* Icono superior */}
              <View style={dynamicStyles.iconBadge}>
                <Ionicons name="rocket-outline" size={28} color="#CA8A04" />
              </View>

              {/* Título y Versión */}
              <Text style={dynamicStyles.title}>¡Nueva versión disponible!</Text>
              <View style={styles.versionTag}>
                <Text style={styles.versionText}>v{updateData.versionName}</Text>
              </View>

              {/* Notas de la versión */}
              {updateData.notes ? (
                <View style={dynamicStyles.notesContainer}>
                  <Text style={dynamicStyles.notesTitle}>Novedades:</Text>
                  <Text style={dynamicStyles.notesText}>{updateData.notes}</Text>
                </View>
              ) : null}

              {/* Botones de Acción */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, dynamicStyles.cancelButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={dynamicStyles.cancelButtonText}>Más tarde</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={onUpdate}
                  activeOpacity={0.8}
                >
                  <Ionicons name="download-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.updateButtonText}>Actualizar</Text>
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
      backgroundColor: isDarkMode ? '#050505' : '#FFFFFF',
      borderColor: isDarkMode ? '#1F1F23' : '#CBD5E1',
    },
    iconBadge: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDarkMode ? '#18181B' : '#FEF9C3',
      borderWidth: 1,
      borderColor: '#CA8A04',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '800',
      color: isDarkMode ? '#FFFFFF' : '#0F172A',
      textAlign: 'center',
    },
    notesContainer: {
      width: '100%',
      backgroundColor: isDarkMode ? '#111113' : '#F8FAFC',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDarkMode ? '#1F1F23' : '#E2E8F0',
    },
    notesTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: '#CA8A04',
      marginBottom: 4,
    },
    notesText: {
      fontSize: 13,
      color: isDarkMode ? '#A1A1AA' : '#475569',
      lineHeight: 18,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#18181B' : '#F1F5F9',
      borderWidth: 1,
      borderColor: isDarkMode ? '#27272A' : '#CBD5E1',
    },
    cancelButtonText: {
      color: isDarkMode ? '#A1A1AA' : '#64748B',
      fontWeight: '700',
      fontSize: 14,
    },
  });

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  versionTag: {
    backgroundColor: 'rgba(202, 138, 4, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  versionText: {
    color: '#CA8A04',
    fontWeight: '800',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  updateButton: {
    backgroundColor: '#CA8A04',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
