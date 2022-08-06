import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export function initDayJs() {
  dayjs.extend(utc);
  dayjs.extend(tz);
  dayjs.extend(customParseFormat);

  dayjs.tz.setDefault('Asia/Bangkok');
}
