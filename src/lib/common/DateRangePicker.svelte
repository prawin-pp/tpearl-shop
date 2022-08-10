<script lang="ts" context="module">
  export interface IDateRangePickerEvent {
    change: { startAt: string; endAt: string };
  }
</script>

<script lang="ts">
  import { DateRangePicker } from 'flowbite-datepicker';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import dayjs from 'dayjs';

  const dispatch = createEventDispatcher<IDateRangePickerEvent>();

  export let startAt = '';
  export let endAt = '';

  let element: HTMLElement;
  let dateRangePicker: DateRangePicker;

  function handleChangeDate(e: CustomEvent<IDatePickerChangeEvent>) {
    const date = e.detail.date;
    const name = e.detail.datepicker.element.getAttribute('name');
    if (name === 'startAt') {
      startAt = dayjs(date).format('DD/MM/YYYY');
    } else if (name === 'endAt') {
      endAt = dayjs(date).format('DD/MM/YYYY');
    }
    dispatch('change', { startAt, endAt });
  }

  onMount(() => {
    dateRangePicker = new DateRangePicker(element, {
      format: 'dd/mm/yyyy',
      maxDate: 'today',
      language: 'th',
      autohide: true,
    });
  });

  onDestroy(() => {
    dateRangePicker?.destroy();
  });
</script>

<div bind:this={element} date-rangepicker="" class="flex items-center">
  <div class="relative">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon class="text-[20px] text-gray-500">date_range</Icon>
    </div>
    <input
      name="startAt"
      type="text"
      class="datepicker-input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      placeholder="เลือกวันที่เริ่มต้น"
      bind:value={startAt}
      on:changeDate={handleChangeDate}
    />
  </div>
  <span class="mx-4 text-gray-500">ถึง</span>
  <div class="relative">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon class="text-[20px] text-gray-500">date_range</Icon>
    </div>
    <input
      name="endAt"
      type="text"
      class="datepicker-input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      placeholder="เลือกวันที่สิ้นสุด"
      bind:value={endAt}
      on:changeDate={handleChangeDate}
    />
  </div>
</div>
