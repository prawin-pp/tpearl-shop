<script lang="ts">
  import DateRangePicker, {
    type IDateRangePickerEvent,
  } from 'src/lib/common/DateRangePicker.svelte';
  import type { IPagination } from 'src/models/pagination.model';
  import type { IPayment } from 'src/models/payment.model';
  import dayjs from 'dayjs';
  import api from 'src/services/api';

  import { onMount } from 'svelte';
  import { paymentChannelText } from 'src/utils/paymentChannel';
  import { priceText } from 'src/utils/currency';
  import Pagination from 'src/lib/common/Pagination.svelte';
  import type { IPaginationRequest } from 'src/services/api/models/request.model';
  import type { ISearchPaymentCriteria } from 'src/services/api/models/payment.model';
  import ConfirmModal from 'src/lib/common/ConfirmModal.svelte';
  import { ToastController } from 'src/utils/toast';

  let confirmDeletePaymentModal: ConfirmModal;
  let selectedPayment: IPayment;

  let payments: IPayment[] = [];
  let pagination: IPagination = {
    page: 1,
    pageSize: 25,
    pageCount: 0,
    total: 0,
  };
  let searchCriteria = {
    startAt: dayjs().format('DD/MM/YYYY'),
    endAt: dayjs().format('DD/MM/YYYY'),
  };

  function handleChangeDateRange(e: CustomEvent<IDateRangePickerEvent['change']>) {
    searchCriteria = { ...e.detail };
    fetchPayments(searchCriteria, pagination);
  }

  function handlePageChanges(e: CustomEvent<IPaginationRequest>) {
    fetchPayments(searchCriteria, pagination);
  }

  function fetchPayments(criteria: ISearchPaymentCriteria, paginationRequest: IPaginationRequest) {
    const startAt = dayjs(criteria.startAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const endAt = dayjs(criteria.endAt, 'DD/MM/YYYY').add(1, 'day').format('YYYY-MM-DD');
    api.payment.searchPayments({ startAt, endAt }, paginationRequest).then(({ meta, items }) => {
      pagination = meta.pagination;
      payments = items;
    });
  }

  function handleOpenConfirmDeletePaymentModal(payment: IPayment) {
    selectedPayment = payment;
    confirmDeletePaymentModal.show();
  }

  async function handleDeletePayment() {
    await api.payment.deletePayment(selectedPayment.id);

    fetchPayments(searchCriteria, pagination);

    ToastController.success(`ลบรายการขายสำเร็จ`, ``);
    confirmDeletePaymentModal.hide();
  }

  onMount(() => {
    fetchPayments(searchCriteria, { page: pagination.page, pageSize: pagination.pageSize });
  });
</script>

<div id="transaction" class="flex h-full w-full select-none flex-col gap-y-5 bg-gray-100 py-5">
  <section class="px-5">
    <span class="text-xl font-bold text-gray-700">รายการชำระเงิน</span>
  </section>
  <section class="px-5">
    <DateRangePicker
      bind:startAt={searchCriteria.startAt}
      bind:endAt={searchCriteria.endAt}
      on:change={handleChangeDateRange}
    />
  </section>
  <section class="flex flex-1 flex-col overflow-hidden px-5">
    <div class="relative overflow-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 uppercase text-gray-700">
          <th scope="col" class="w-0 whitespace-nowrap rounded-tl-xl py-3 px-6">วันที่</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">เวลา</th>
          <th scope="col" class="whitespace-nowrap py-3 px-6">รายการสินค้า</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">ช่องทางชำระเงิน</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6 text-right">ราคารวม</th>
          <th scope="col" class="w-0 whitespace-nowrap rounded-tr-xl py-3 px-6">
            <span class="sr-only">ลบ</span>
          </th>
        </thead>
        <tbody>
          {#each payments as payment}
            <tr class="group border-b bg-white align-top last:border-b-0 hover:bg-gray-50">
              <td class="whitespace-nowrap py-4 px-6 text-gray-900 group-last:rounded-bl-xl">
                {dayjs(payment.createdAt).format('DD/MM/YYYY')}
              </td>
              <td class="whitespace-nowrap py-4 px-6 text-gray-900">
                {dayjs(payment.createdAt).format('HH:mm')}
              </td>
              <td class="py-4 px-6">
                {#each payment.items as item}
                  <div class="mb-1 last:mb-0">
                    <div class="whitespace-nowrap">
                      <span>{item.product.name}</span>
                      {#if item.quantity > 1}
                        <span class="text-gray-500">x {item.quantity}</span>
                      {/if}
                    </div>
                    <div class="ml-2 text-gray-500">- หวาน {item.sweetness}%</div>
                    {#each item.addons as addon}
                      <div class="ml-2 text-gray-500">
                        <span>- {addon.product.name}</span>
                        {#if addon.quantity > 1}
                          <span class="text-gray-500">x {addon.quantity}</span>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/each}
              </td>
              <td class="py-4 px-6">
                <span
                  class:text-cash={payment.paymentChannel === 'CASH'}
                  class:text-promptpay={payment.paymentChannel === 'PROMPTPAY'}
                  class:text-grab={payment.paymentChannel === 'GRAB'}
                  class:text-lineman={payment.paymentChannel === 'LINEMAN'}
                  class:text-robinhood={payment.paymentChannel === 'ROBINHOOD'}
                >
                  {paymentChannelText[payment.paymentChannel]}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                {priceText(payment.totalAmount)}
              </td>
              <td class="py-4 px-6 group-last:rounded-br-xl">
                <div
                  class="text-rose-600 hover:underline"
                  on:click={() => handleOpenConfirmDeletePaymentModal(payment)}
                >
                  ลบ
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <nav class="flex items-center justify-between pt-4" aria-label="Table navigation">
      <span class="text-gray-500">
        แสดงผล
        <span class="text-gray-900">
          {(pagination.page - 1) * pagination.pageSize + 1}-{pagination.page * pagination.pageSize}
        </span>
        จากทั้งหมด
        <span class="text-gray-900">{pagination.total}</span>
        รายการ
      </span>
      <Pagination pagination={pagination} on:change={handlePageChanges} />
    </nav>
  </section>
</div>

<ConfirmModal
  title="คุณต้องการที่จะลบการขายนี้ใช่หรือไม่?"
  bind:this={confirmDeletePaymentModal}
  onConfirm={handleDeletePayment}
/>
