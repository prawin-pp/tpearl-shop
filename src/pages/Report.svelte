<script lang="ts">
  import dayjs from 'dayjs';

  import DateRangePicker, {
    type IDateRangePickerEvent,
  } from 'src/lib/common/DateRangePicker.svelte';
  import ReportSalesByProduct from 'src/lib/report/ReportSalesByProduct.svelte';
  import ReportSalesByTime from 'src/lib/report/ReportSalesByTime.svelte';
  import type { IPayment } from 'src/models/payment.model';
  import type { TPaymentChannel } from 'src/models/price.model';
  import api from 'src/services/api';
  import type { ISearchPaymentCriteria } from 'src/services/api/models/payment.model';
  import { currencyText } from 'src/utils/currency';
  import { paymentChannelText } from 'src/utils/paymentChannel';
  import { onMount } from 'svelte';

  let payments: IPayment[] = [];

  let searchCriteria = {
    startAt: dayjs().format('DD/MM/YYYY'),
    endAt: dayjs().format('DD/MM/YYYY'),
  };

  $: totalAmount = payments.reduce((value, payment) => value + payment.totalAmount, 0);
  $: totalQuantiy = payments.reduce((value, payment) => {
    return value + payment.items.reduce((prev, item) => prev + item.quantity, 0);
  }, 0);

  $: totalAmountGroupByPaymentChannel = payments.reduce((value, payment) => {
    const quantity = payment.items.reduce((value, item) => value + item.quantity, 0);
    const sales = {
      amount: (value[payment.paymentChannel]?.amount || 0) + payment.totalAmount,
      quantity: (value[payment.paymentChannel]?.quantity || 0) + quantity,
    };
    value[payment.paymentChannel] = sales;
    return value;
  }, {} as Record<TPaymentChannel, { amount: number; quantity: number }>);

  function handleChangeDateRange(e: CustomEvent<IDateRangePickerEvent['change']>) {
    searchCriteria = { ...e.detail };
    fetchPayments(searchCriteria);
  }

  function fetchPayments(criteria: ISearchPaymentCriteria) {
    const startAt = dayjs(criteria.startAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const endAt = dayjs(criteria.endAt, 'DD/MM/YYYY').add(1, 'day').format('YYYY-MM-DD');
    api.payment
      .searchPayments({ startAt, endAt }, { page: 1, pageSize: 9999 })
      .then(({ meta, items }) => {
        payments = items;
      });
  }

  onMount(() => {
    fetchPayments(searchCriteria);
  });
</script>

<div
  id="report"
  class="flex h-full w-full select-none flex-col gap-y-5 overflow-auto bg-gray-100 py-6"
>
  <section class="px-5">
    <span class="text-xl font-bold text-gray-700">สรุปยอดขาย</span>
  </section>
  <section class="px-5">
    <DateRangePicker
      bind:startAt={searchCriteria.startAt}
      bind:endAt={searchCriteria.endAt}
      on:change={handleChangeDateRange}
    />
  </section>
  <section class="grid grid-cols-2 gap-x-6 px-5">
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">ยอดขายรวม</span>
      <span class="block whitespace-nowrap text-4xl">{currencyText(totalAmount)}</span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">จำนวนแก้ว</span>
      <span class="block whitespace-nowrap text-4xl">{totalQuantiy}</span>
    </div>
  </section>
  <section class="grid grid-cols-5 gap-x-6 px-5">
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-cash px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['CASH']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {currencyText(totalAmountGroupByPaymentChannel['CASH']?.amount || 0)}
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-promptpay px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['PROMPTPAY']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {currencyText(totalAmountGroupByPaymentChannel['PROMPTPAY']?.amount || 0)}
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-grab px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['GRAB']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {currencyText(totalAmountGroupByPaymentChannel['GRAB']?.amount || 0)}
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-lineman px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['LINEMAN']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {currencyText(totalAmountGroupByPaymentChannel['LINEMAN']?.amount || 0)}
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-robinhood px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['ROBINHOOD']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {currencyText(totalAmountGroupByPaymentChannel['ROBINHOOD']?.amount || 0)}
      </span>
    </div>
  </section>
  <section class="grid grid-cols-5 gap-x-6 px-5">
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-cash px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['CASH']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {totalAmountGroupByPaymentChannel['CASH']?.quantity || 0}
        <span class="text-right text-base">แก้ว</span>
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-promptpay px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['PROMPTPAY']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {totalAmountGroupByPaymentChannel['PROMPTPAY']?.quantity || 0}
        <span class="text-right text-base">แก้ว</span>
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-grab px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['GRAB']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {totalAmountGroupByPaymentChannel['GRAB']?.quantity || 0}
        <span class="text-right text-base">แก้ว</span>
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-lineman px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['LINEMAN']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {totalAmountGroupByPaymentChannel['LINEMAN']?.quantity || 0}
        <span class="text-right text-base">แก้ว</span>
      </span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-robinhood px-6 py-5 text-white">
      <span class="block whitespace-nowrap text-xl">{paymentChannelText['ROBINHOOD']}</span>
      <span class="block whitespace-nowrap text-4xl">
        {totalAmountGroupByPaymentChannel['ROBINHOOD']?.quantity || 0}
        <span class="text-right text-base">แก้ว</span>
      </span>
    </div>
  </section>
  <section class="grid grid-cols-2 gap-x-6 px-5">
    <div class="flex flex-col gap-y-5 rounded-xl bg-white p-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">สินค้าขายดี</span>
      <ReportSalesByProduct payments={payments} />
    </div>
    <div class="flex flex-col gap-y-5 rounded-xl bg-white p-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">ยอดขายตามช่วงเวลา</span>
      <ReportSalesByTime
        payments={payments}
        startAt={searchCriteria.startAt}
        endAt={searchCriteria.endAt}
      />
    </div>
  </section>
</div>
