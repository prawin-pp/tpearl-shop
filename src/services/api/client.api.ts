import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import config from 'src/config';
import { loading } from 'src/stores/loading.store';
import { user } from 'src/stores/user.store';
import { ToastController } from 'src/utils/toast';

const skipAuth = ((config.apiSkipAuth as string) || '').split(',');
const client = axios.create({ baseURL: config.apiBaseUrl, timeout: 10000 });

client.interceptors.request.use(handleRequest, handleError);

client.interceptors.response.use(handleResponse, handleError);

function handleRequest(config: AxiosRequestConfig) {
  const token = localStorage.getItem('tpearl:auth:token');
  if (token && !skipAuth.includes(config.url)) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  loading.increase();
  return config;
}

function handleResponse(response: AxiosResponse) {
  loading.decrease();
  return response;
}

function handleError(error: Error) {
  loading.decrease();

  let errorMessage = 'กรุณาลองใหม่อีกครั้ง';
  if (error instanceof AxiosError && error.response.status === 401) {
    user.logout();
    errorMessage = `กรุณาเข้าสู่ระบบใหม่อีกครั้ง`;
  }
  ToastController.danger('เกิดข้อผิดพลาด', errorMessage);

  return error;
}

export default client;
