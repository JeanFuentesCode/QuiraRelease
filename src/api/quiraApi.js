import axios from 'axios';

const quiraApi = axios.create({
  baseURL: 'https://quira-backend.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default quiraApi;