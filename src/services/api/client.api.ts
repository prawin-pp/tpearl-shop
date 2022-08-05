import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import config from 'src/config';
import { loading } from 'src/stores/loading.store';

const skipAuth = ((config.apiSkipAuth as string) || '').split(',');
const client = axios.create({ baseURL: config.apiBaseUrl, timeout: 10000 });

client.interceptors.request.use(handleRequest, handleError);

client.interceptors.response.use(handleResponse, handleError);

function handleRequest(config: AxiosRequestConfig) {
  const token = localStorage.getItem('tpearl:auth:token');
  if (token && !skipAuth.includes(config.url)) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  loading.update((value) => value + 1);
  return config;
}

function handleResponse(response: AxiosResponse) {
  loading.update((value) => value - 1);
  return response;
}

function handleError(error: Error) {
  loading.update((value) => value - 1);
  return error;
}

export default client;
