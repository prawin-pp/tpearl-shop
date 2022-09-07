<script lang="ts" context="module">
  interface ISalesProfitByProduct {
    [productId: string]: {
      quantity: number;
      totalAmount: number;
      profit: number;
    };
  }
  interface IProfitData {
    cost: number;
    quantity: number;
    totalAmount: number;
    profit: number;
    productName: string;
  }
  interface ISummaryData {
    cost: number;
    productQuantity: number;
    productAddonQuantity: number;
    totalAmount: number;
    profit: number;
  }
</script>

<script lang="ts">
  import dayjs from 'dayjs';
  import numeral from 'numeral';
  import DateRangePicker, {
    type IDateRangePickerEvent,
  } from 'src/lib/common/DateRangePicker.svelte';
  import type { IPayment, IPaymentAddonItems, IPaymentItem } from 'src/models/payment.model';
  import type { TPaymentChannel } from 'src/models/price.model';
  import type { IProduct } from 'src/models/product.model';
  import type { IProductAddon } from 'src/models/productAddon.model';
  import api from 'src/services/api';
  import type { ISearchPaymentCriteria } from 'src/services/api/models/payment.model';
  import { priceText } from 'src/utils/currency';
  import { onMount } from 'svelte';

  let searchCriteria = {
    startAt: dayjs().format('DD/MM/YYYY'),
    endAt: dayjs().format('DD/MM/YYYY'),
  };

  let products: IProduct[] = [];
  let productAddons: IProductAddon[] = [];
  let grossProfits: Record<TPaymentChannel, number> = {
    CASH: 0,
    PROMPTPAY: 0,
    GRAB: 0,
    LINEMAN: 0,
    ROBINHOOD: 0,
  };

  let profitOfProducts: IProfitData[] = [];
  let profitOfProductAddons: IProfitData[] = [];

  let summaryData: ISummaryData = {
    profit: 0,
    cost: 0,
    productQuantity: 0,
    productAddonQuantity: 0,
    totalAmount: 0,
  };

  function handleChangeDateRange(e: CustomEvent<IDateRangePickerEvent['change']>) {
    searchCriteria = { ...e.detail };
    fetchPayments(searchCriteria);
  }

  function fetchProducts() {
    api.product.getProducts().then((items) => (products = items.sort((a, b) => a.id - b.id)));
  }

  function fetchProductAddons() {
    api.productAddon
      .getProductAddons()
      .then((items) => (productAddons = items.sort((a, b) => a.id - b.id)));
  }

  function fetchPaymentChannels() {
    api.paymentChannel.getPaymentChannels().then((items) => {
      items.forEach((item) => (grossProfits[item.name] = item.grossProfit));
    });
  }

  function fetchPayments(criteria: ISearchPaymentCriteria) {
    const startAt = dayjs(criteria.startAt, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const endAt = dayjs(criteria.endAt, 'DD/MM/YYYY').add(1, 'day').format('YYYY-MM-DD');
    api.payment
      .searchPayments({ startAt, endAt }, { page: 1, pageSize: 9999 })
      .then(({ items }) => assembleProfitData(items));
  }

  function assembleProfitData(payments: IPayment[]) {
    const salesByProduct = assembleSalesByProduct(payments);
    const salesByProductAddon = assembleSalesByProductAddon(payments);

    const productData = populateProfitAndSummaryData(products, salesByProduct);
    const productAddonData = populateProfitAndSummaryData(productAddons, salesByProductAddon);

    profitOfProducts = productData.profitDataList;
    profitOfProductAddons = productAddonData.profitDataList;
    summaryData = {
      cost: productData.summaryData.cost + productAddonData.summaryData.cost,
      profit: productData.summaryData.profit + productAddonData.summaryData.profit,
      productQuantity: productData.summaryData.quantity,
      productAddonQuantity: productAddonData.summaryData.quantity,
      totalAmount: productData.summaryData.totalAmount + productAddonData.summaryData.totalAmount,
    };
  }

  function populateProfitAndSummaryData(
    products: IProduct[] | IProductAddon[],
    sales: ISalesProfitByProduct
  ) {
    const profitDataList = Object.entries(sales)
      .map<IProfitData>(([productId, item]) => {
        const product = products.find((product) => product.id + '' === productId);
        return {
          productName: product?.name || '',
          cost: product?.cost || 0,
          quantity: item.quantity,
          totalAmount: item.totalAmount,
          profit: item.profit,
        };
      })
      .sort((a, b) => b.profit - a.profit);
    const summaryData = {
      profit: profitDataList.reduce((value, { profit }) => numeral(value).add(profit).value(), 0),
      cost: profitDataList.reduce((value, { cost }) => numeral(value).add(cost).value(), 0),
      quantity: profitDataList.reduce(
        (value, { quantity }) => numeral(value).add(quantity).value(),
        0
      ),
      totalAmount: profitDataList.reduce(
        (value, { totalAmount }) => numeral(value).add(totalAmount).value(),
        0
      ),
    };
    return { profitDataList, summaryData };
  }

  function assembleSalesByProductAddon(payments: IPayment[]) {
    const result: ISalesProfitByProduct = {};

    payments.forEach(({ items, paymentChannel }) => {
      items
        .flatMap((item) => item.addons)
        .forEach((item) => {
          const productId = item.product.id;
          if (!result[productId]) {
            result[productId] = { quantity: 0, totalAmount: 0, profit: 0 };
          }
          const sales = calculateSalesProfitOfProductAddon(item, paymentChannel);
          result[item.product.id].quantity += sales.quantity;
          result[item.product.id].totalAmount += sales.totalAmount;
          result[item.product.id].profit += sales.profit;
        });
    });

    return result;
  }

  function calculateSalesProfitOfProductAddon(
    item: IPaymentAddonItems,
    paymentChannel: TPaymentChannel
  ) {
    const grossProfit = grossProfits[paymentChannel];
    const product = productAddons.find((addon) => addon.id === item.product.id);
    const { price } = product.prices.find((price) => price.paymentChannel.name === paymentChannel);
    const amount = numeral(price).multiply(item.quantity).value();
    const deductGP = numeral(amount).multiply(grossProfit).divide(100).value();
    const totalAmount = numeral(amount).subtract(deductGP).value();
    const totalCost = numeral(product.cost).multiply(item.quantity).value();
    const totalProfit = numeral(totalAmount).subtract(totalCost).value();
    return {
      quantity: item.quantity,
      totalAmount: totalAmount,
      profit: totalProfit,
    };
  }

  function assembleSalesByProduct(payments: IPayment[]) {
    const result: ISalesProfitByProduct = {};

    payments.forEach(({ items, paymentChannel }) => {
      items.forEach((item) => {
        const productId = item.product.id;
        if (!result[productId]) {
          result[productId] = { quantity: 0, totalAmount: 0, profit: 0 };
        }
        const sales = calculateSalesProfitOfProduct(item, paymentChannel);
        result[item.product.id].quantity += sales.quantity;
        result[item.product.id].totalAmount += sales.totalAmount;
        result[item.product.id].profit += sales.profit;
      });
    });

    return result;
  }

  function calculateSalesProfitOfProduct(item: IPaymentItem, paymentChannel: TPaymentChannel) {
    const grossProfit = grossProfits[paymentChannel];
    const product = products.find((product) => product.id === item.product.id);
    const { price } = product.prices.find((price) => price.paymentChannel.name === paymentChannel);
    const amount = numeral(price).multiply(item.quantity).value();
    const deductGP = numeral(amount).multiply(grossProfit).divide(100).value();
    const totalAmount = numeral(amount).subtract(deductGP).value();
    const totalCost = numeral(product.cost).multiply(item.quantity).value();
    const totalProfit = numeral(totalAmount).subtract(totalCost).value();
    return {
      quantity: item.quantity,
      totalAmount: totalAmount,
      profit: totalProfit,
    };
  }

  onMount(async () => {
    await Promise.all([fetchProducts(), fetchProductAddons(), fetchPaymentChannels()]);
    fetchPayments(searchCriteria);
  });
</script>

<div
  id="profit"
  class="flex h-full w-full select-none flex-col gap-y-5 overflow-auto bg-gray-100 py-6"
>
  <section class="px-5">
    <span class="text-xl font-bold text-gray-700">คำนวณกำไร/ขาดทุน</span>
  </section>
  <section class="px-5">
    <DateRangePicker
      bind:startAt={searchCriteria.startAt}
      bind:endAt={searchCriteria.endAt}
      on:change={handleChangeDateRange}
    />
  </section>
  <section class="grid grid-cols-5 gap-x-6 px-5">
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">กำไร/ขาดทุน</span>
      <span class="block whitespace-nowrap text-4xl">{priceText(summaryData.profit)}</span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">จำนวนแก้ว</span>
      <span class="block whitespace-nowrap text-4xl">{summaryData.productQuantity}</span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">จำนวนท็อปปิ๊ง</span>
      <span class="block whitespace-nowrap text-4xl">{summaryData.productAddonQuantity}</span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">ต้นทุน</span>
      <span class="block whitespace-nowrap text-4xl">{priceText(summaryData.cost)}</span>
    </div>
    <div class="flex flex-col gap-y-1 overflow-hidden rounded-xl bg-white px-6 py-5">
      <span class="block whitespace-nowrap text-xl text-gray-500">ยอดขายรวม</span>
      <span class="block whitespace-nowrap text-4xl">
        {priceText(summaryData.totalAmount)}
      </span>
    </div>
  </section>
  <section class="flex flex-col overflow-hidden px-5">
    <div class="relative overflow-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 uppercase text-gray-700">
          <th scope="col" class="w-0 rounded-tl-xl py-3 px-6" />
          <th scope="col" class="whitespace-nowrap py-3 px-6">สินค้า</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">ต้นทุน</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">จำนวน</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">ต้นทุนรวม</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6 text-right">
            ยอดขายรวม (หลังหัก GP)
          </th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6 text-right">กำไร/ขาดทุน</th>
        </thead>
        <tbody>
          {#each profitOfProducts as item, i}
            <tr class="group border-b bg-white align-top last:border-b-0 hover:bg-gray-50">
              <td class="w-0 py-4 px-6 text-gray-400 group-last:rounded-bl-xl">
                {i + 1}
              </td>
              <td class="whitespace-nowrap py-4 px-6">{item.productName}</td>
              <td class="whitespace-nowrap py-4 px-6 text-right">{priceText(item.cost)}</td>
              <td class="whitespace-nowrap py-4 px-6 text-right">
                {item.quantity}
              </td>
              <td class="whitespace-nowrap py-4 px-6 text-right">
                {priceText(item.cost * item.quantity)}
              </td>
              <td class="whitespace-nowrap py-4 px-6 text-right">
                {priceText(item.totalAmount)}
              </td>
              <td
                class:text-green-500={item.profit > 0}
                class:text-rose-500={item.profit < 0}
                class="whitespace-nowrap py-4 px-6 text-right group-last:rounded-br-xl"
              >
                {priceText(item.profit)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
  <section class="flex flex-col overflow-hidden px-5">
    <div class="relative overflow-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 uppercase text-gray-700">
          <th scope="col" class="w-0 rounded-tl-xl py-3 px-6" />
          <th scope="col" class="whitespace-nowrap py-3 px-6">ท็อปปิ้ง</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">ต้นทุน</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">จำนวน</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6">ต้นทุนรวม</th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6 text-right">
            ยอดขายรวม (หลังหัก GP)
          </th>
          <th scope="col" class="w-0 whitespace-nowrap py-3 px-6 text-right">กำไร/ขาดทุน</th>
        </thead>
        <tbody>
          {#each profitOfProductAddons as item, i}
            <tr class="group border-b bg-white align-top last:border-b-0 hover:bg-gray-50">
              <td class="w-0 py-4 px-6 text-gray-400 group-last:rounded-bl-xl">
                {i + 1}
              </td>
              <td class="whitespace-nowrap py-4 px-6">{item.productName}</td>
              <td class="whitespace-nowrap py-4 px-6 text-right">{priceText(item.cost)}</td>
              <td class="whitespace-nowrap py-4 px-6 text-right">
                {item.quantity}
              </td>
              <td class="whitespace-nowrap py-4 px-6 text-right">
                {priceText(item.cost * item.quantity)}
              </td>
              <td class="whitespace-nowrap py-4 px-6 text-right">
                {priceText(item.totalAmount)}
              </td>
              <td
                class:text-green-500={item.profit > 0}
                class:text-rose-500={item.profit < 0}
                class="whitespace-nowrap py-4 px-6 text-right group-last:rounded-br-xl"
              >
                {priceText(item.profit)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
