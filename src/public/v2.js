import axios from 'axios';

const baseURL = 'http://localhost:9000/api/v2';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
    // 'Authorization': 'B12333'
  },
});

export const fetchData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const fetchStatus = async () => {
  try {
    const response = await apiClient.get('/info/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching status:', error);
    throw error;s
  }
};

export const fetchCounter = async (key) => {
  try {
    const response = await apiClient.get('/info/counter/' + key);
    return response.data;
  } catch (error) {
    console.error('Error fetching counter:', error);
    throw error;
  }
};

export const fetchCPUUsage = async () => {
  try {
    const response = await apiClient.get('/info/cpu');
    return response.data;
  } catch (error) {
    console.error('Error fetching CPU usage:', error);
    throw error;
  }
};

export const fetchConfig = async (type) => {
  try {
    const response = await apiClient.get(`/config/get/${type}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
};

export const saveConfig = async (type, data) => {
  try {
    const response = await apiClient.post(`/config/save/${type}`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
};

export const fetchPlugins = async () => {
  try {
    const response = await apiClient.get('/plugins/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching plugins:', error);
    throw error;
  }
};

export const fetchPluginCommandsList = async (id) => {
  try {
    const response = await apiClient.get(`/plugins/list/commands/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plugin commands list:', error);
    throw error;
  }
}