import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

// La URL de tu archivo version.json público en GitHub Pages
const VERSION_JSON_URL = 'https://jeanfuentescode.github.io/quiraversion/version.json';

// Obtiene el versionCode interno definido en tu app.json (por defecto 1)
const CURRENT_VERSION_CODE = Constants.expoConfig?.android?.versionCode || 1;

export const checkForUpdates = async () => {
  try {
    const response = await fetch(VERSION_JSON_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Compara si el versionCode en Internet es mayor al de la app instalada
    if (data && data.versionCode > CURRENT_VERSION_CODE) {
      return data; // Devuelve { versionCode, versionName, apkUrl, notes }
    }
    return null;
  } catch (error) {
    console.log('Error al verificar actualización:', error);
    return null;
  }
};

export const downloadAndInstallApk = async (downloadUrl) => {
  try {
    Alert.alert('Descargando', 'Obteniendo la actualización...');

    const fileUri = `${FileSystem.documentDirectory}Quira-update.apk`;
    const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);

    if (downloadRes.status !== 200) {
      Alert.alert('Error', 'No se pudo descargar el archivo.');
      return;
    }

    const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);

    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: contentUri,
      flags: 1,
      type: 'application/vnd.android.package-archive',
    });
  } catch (error) {
    Alert.alert('Error', 'No se pudo iniciar la instalación.');
  }
};
