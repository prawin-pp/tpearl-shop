import 'flowbite';
import { initDatePicker } from 'src/utils/datepicker';
import { initDayJs } from './utils/date';

import './app.css';
import App from './App.svelte';

initDatePicker();
initDayJs();

const app = new App({
  target: document.getElementById('app'),
});

export default app;
