import axios from 'axios';
import config from 'src/config';

const client = axios.create({ baseURL: config.apiBaseUrl, timeout: 10000 });

export default client;
