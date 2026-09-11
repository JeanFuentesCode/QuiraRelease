import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';

const GITHUB_REPO = 'JeanFuentesCode/QuiraRelease';
const CURRENT_VERSION = Constants.expoConfig?.version || '1.0.0';

export const checkForUpdates = async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    
    if (!response.ok) return;

    const data = await response.json();
    if (!data || !data.tag_name) return;

    const latestVersion = data.tag_name.replace(/^v/, '').trim();

    if (isNewerVersion(CURRENT_VERSION, latestVersion)) {
      const apkAsset = data.assets?.find((asset) => asset.name.endsWith('.apk'));

      if (!apkAsset) return;

      Alert.alert(
        'Actualización disponible',
        `Nueva versión ${latestVersion} disponible. ¿Deseas instalarla ahora?`,
        [
          { text: 'Luego', style: 'cancel' },
          { 
            text: 'Actualizar', 
            onPress: () => downloadAndInstallApk(apkAsset.browser_download_url) 
          }
        ]
      );
    }
  } catch (error) {
    console.log('Error al verificar actualización:', error);
  }
};

const isNewerVersion = (current, latest) => {
  const cParts = current.split('.').map(Number);
  const lParts = latest.split('.').map(Number);

  for (let i = 0; i < Math.max(cParts.length, lParts.length); i++) {
    const cVal = cParts[i] || 0;
    const lVal = lParts[i] || 0;
    if (lVal > cVal) return true;
    if (lVal < cVal) return false;
  }
  return false;
};

const downloadAndInstallApk = async (downloadUrl) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}Quira-update.apk`;
    const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);

    if (downloadRes.status !== 200) return;

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