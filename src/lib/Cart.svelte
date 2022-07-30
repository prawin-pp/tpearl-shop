<script lang="ts">
  import { currencyText } from 'src/directives/currency.directive';

  import Button from './Button.svelte';
</script>

<div id="cart" class="flex h-full flex-col gap-y-5 p-3">
  <section class="">
    <div class="flex w-full items-center">
      <span class="text-xl font-bold">ออเดอร์</span>
      <div
        class="ml-auto rounded-full border border-gray-200 bg-transparent p-3 text-gray-500 transition-all hover:cursor-pointer hover:bg-gray-200 hover:text-gray-700"
      />
    </div>
  </section>
  <section />
  <section class="mt-auto flex flex-col gap-y-4">
    <div class="h-0 border-t-2 border-dashed border-gray-200" />
    <div class="flex justify-between font-bold">
      <span>ยอดรวม</span>
      <span use:currencyText>0</span>
    </div>
  </section>
  <section class="flex flex-col gap-y-4">
    <Button
      class="bg-blue-500 text-white transition-all focus:bg-blue-600 focus:ring focus:ring-blue-300"
    >
      ช่องทางจ่ายเงิน
    </Button>
    <Button
      class="bg-teal-500 text-white transition-all focus:bg-teal-600 focus:ring focus:ring-teal-300"
    >
      ชำระเงิน
    </Button>
  </section>
</div>
