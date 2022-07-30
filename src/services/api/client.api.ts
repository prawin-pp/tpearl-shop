import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import config from 'src/config';
import { loading } from 'src/stores/loading.store';

const client = axios.create({ baseURL: config.apiBaseUrl, timeout: 10000 });

client.interceptors.request.use(handleRequest, handleError);

client.interceptors.response.use(handleResponse, handleError);

function handleRequest(config: AxiosRequestConfig) {
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
