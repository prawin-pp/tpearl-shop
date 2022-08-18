<script lang="ts" context="module">
  export interface ISalesByTime {
    time: string;
    quantity: number;
  }
</script>

<script lang="ts">
  import ApexCharts, { type ApexOptions } from 'apexcharts';
  import dayjs from 'dayjs';
  import type { IPayment } from 'src/models/payment.model';
  import { onMount } from 'svelte';

  export let payments: IPayment[] = [];

  let data: ISalesByTime[] = [];

  $: {
    data = [];
    for (let i = 6; i <= 21; i++) {
      const quantity = payments
        .filter((payment) => {
          const hour = dayjs(payment.createdAt).hour();
          return hour >= i && hour < i + 1;
        })
        .reduce((value, payment) => {
          const count = payment.items.reduce((v, item) => v + item.quantity, 0);
          return value + count;
        }, 0);
      const time = `${i.toString().padStart(2, '0')}:00`;
      data.push({ time: time, quantity: quantity });
    }
    renderChart();
  }

  let chartElement: HTMLElement;
  let chart: ApexCharts;
  let options: ApexOptions = {
    series: [{ name: 'ยอดขายตามช่วงเวลา', data: [] }],
    chart: {
      type: 'bar',
      height: 300,
      fontFamily: `'Sarabun', sans-serif`,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
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
          return `${value} แก้ว`;
        },
      },
    },
  };

  function renderChart() {
    const categories = data.map((item) => item.time);
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
