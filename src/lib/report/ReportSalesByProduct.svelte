<script lang="ts" context="module">
  export interface ISalesByProduct {
    productId: number;
    productName: string;
    quantity: number;
  }
</script>

<script lang="ts">
  import type { IPayment } from 'src/models/payment.model';
  import ApexCharts, { type ApexOptions } from 'apexcharts';
  import { onMount } from 'svelte';

  export let payments: IPayment[] = [];

  let data: ISalesByProduct[] = [];

  $: {
    data = payments
      .reduce((value, payment) => {
        payment.items.forEach((item) => {
          const index = value.findIndex((data) => data.productId === item.product.id);
          if (index >= 0) {
            value[index].quantity += item.quantity;
          } else {
            value.push({
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.quantity,
            });
          }
        });
        return value;
      }, [] as ISalesByProduct[])
      .sort((a, b) => {
        if (a.quantity > b.quantity) return -1;
        else if (a.quantity < b.quantity) return 1;
        return a.productName.localeCompare(b.productName);
      });

    renderChart();
  }

  let chartElement: HTMLElement;
  let chart: ApexCharts;
  let options: ApexOptions = {
    series: [{ name: 'ยอดขายตามสินค้า', data: [] }],
    chart: {
      type: 'bar',
      height: 300,
      fontFamily: `'Sarabun', sans-serif`,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {},
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      labels: {
        style: {
          fontFamily: `'Sarabun', sans-serif`,
          fontSize: '16px',
        },
      },
      categories: [],
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: `'Sarabun', sans-serif`,
          fontSize: '16px',
        },
        formatter: (value) => {
          return `${value}`;
        },
      },
      title: {
        text: '',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      style: {
        fontFamily: `'Sarabun', sans-serif`,
        fontSize: '16px',
      },
      y: {
        formatter: function (value) {
          return `${value} ชิ้น`;
        },
      },
    },
  };

  function renderChart() {
    const categories = data.map((item) => item.productName);
    const seriesData = data.map((item) => item.quantity);
    options.xaxis.categories = categories || [];
    options.series = [{ name: 'สินค้า', data: seriesData || [] }];
    chart?.updateOptions(options);
  }

  onMount(() => {
    chart = new ApexCharts(chartElement, options);
    chart.render();
  });
</script>

<div bind:this={chartElement} id="chart-sales-by-product" />
