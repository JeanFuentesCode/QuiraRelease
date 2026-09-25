import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const VERSION_JSON_URL = 'https://jeanfuentescode.github.io/quiraversion/version.json';
const CURRENT_VERSION_CODE = Constants.expoConfig?.android?.versionCode || 1;

export const checkForUpdates = async () => {
  try {
    const response = await fetch(VERSION_JSON_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data && data.versionCode > CURRENT_VERSION_CODE) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error al verificar actualización:', error);
    return null;
  }
};

export const downloadAndInstallApk = async (downloadUrl) => {
  if (!downloadUrl) {
    Alert.alert('Error', 'La URL de descarga no es válida.');
    return;
  }

  try {
    const fileUri = `${FileSystem.documentDirectory}Quira-update.apk`;

    // Descarga del archivo APK desde GitHub Releases
    const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);

    if (downloadRes.status !== 200) {
      Alert.alert(
        'Error de descarga', 
        `El servidor devolvió el código HTTP ${downloadRes.status}. Verifica que el enlace del APK en GitHub Releases sea público y correcto.`
      );
      return;
    }

    // Convertir a URI de contenido seguro para el FileProvider de Android
    const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);

    // Lanzar el paquete de instalación nativo
    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
      type: 'application/vnd.android.package-archive',
    });
  } catch (error) {
    console.error('Error durante la instalación:', error);
    Alert.alert('Error de Instalación', error.message || 'No se pudo iniciar la instalación.');
  }
};
