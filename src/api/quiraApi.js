import axios from 'axios';
import { getOrCreateDeviceId } from '../utils/deviceId';

const quiraApi = axios.create({
  baseURL: 'https://quira-backend.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar x-device-id automáticamente en cada petición
quiraApi.interceptors.request.use(
  async (config) => {
    try {
      const deviceId = await getOrCreateDeviceId();
      if (deviceId) {
        config.headers['x-device-id'] = deviceId;
      }
    } catch (error) {
      console.log('Error inyectando x-device-id:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default quiraApi;