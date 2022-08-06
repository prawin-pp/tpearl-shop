import 'flowbite';
import './app.css';

import App from './App.svelte';
import { initDatePicker } from 'src/utils/datepicker';
import { initDayJs } from './utils/date';

initDatePicker();
initDayJs();

const app = new App({
  target: document.getElementById('app'),
});

export default app;
