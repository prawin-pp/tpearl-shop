<script lang="ts" context="module">
  export interface ISalesByTime {
    time: number;
    quantity: number;
  }
</script>

<script lang="ts">
  import ApexCharts, { type ApexOptions } from 'apexcharts';
  import dayjs from 'dayjs';
  import type { IPayment } from 'src/models/payment.model';
  import { onMount } from 'svelte';

  export let startAt: string;
  export let endAt: string;
  export let payments: IPayment[] = [];

  let data: ISalesByTime[] = [];

  $: {
    let start = dayjs(startAt, 'DD/MM/YYYY').startOf('day').valueOf();
    const end = dayjs(endAt, 'DD/MM/YYYY').endOf('day').valueOf();
    const diff = dayjs(end).diff(start, 'hour').valueOf();

    data = [];
    for (let i = 0; i <= diff; i++) {
      const quantity = payments
        .filter((payment) => {
          const createdAt = payment.createdAt.getTime();
          return createdAt >= start && createdAt < start + 3600000;
        })
        .reduce((value, payment) => {
          const count = payment.items.reduce((v, item) => v + item.quantity, 0);
          return value + count;
        }, 0);
      data.push({ time: start, quantity: quantity });
      start += 3600000;
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
      min: dayjs(startAt, 'DD/MM/YYYY').startOf('day').valueOf(),
      max: dayjs(endAt, 'DD/MM/YYYY').endOf('day').valueOf(),
      tickAmount:
        dayjs(endAt, 'DD/MM/YYYY')
          .endOf('day')
          .diff(dayjs(startAt, 'DD/MM/YYYY').startOf('day'), 'hour') / 5,
      labels: {
        style: {
          fontFamily: `'Sarabun', sans-serif`,
          fontSize: '16px',
        },
        datetimeUTC: false,
        formatter: (value) => {
          return dayjs(value).format('HH:mm');
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
      x: {
        formatter: function (value) {
          return dayjs(value).format('DD/MM/YYYY HH:mm');
        },
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
