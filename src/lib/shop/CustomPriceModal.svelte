<script lang="ts" context="module">
  export interface ICustomPriceModalEvent {
    submit: number;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Button from 'src/lib/common/Button.svelte';
  import Modal from 'src/lib/common/Modal.svelte';

  const dispatch = createEventDispatcher<ICustomPriceModalEvent>();

  let modalElement: Modal;
  let price: number = 0;

  export function show() {
    modalElement?.show();
  }

  export function hide() {
    modalElement?.hide();
  }

  function handleCancel() {
    modalElement?.hide();
  }

  function handleConfirm() {
    if (price === 0) return;
    dispatch('submit', price);
  }
</script>

<Modal bind:this={modalElement} title="อื่นๆ (กำหนดราคาเอง)">
  <div slot="body" class="flex flex-col">
    <div>
      <label for="price" class="mb-2 block font-medium text-gray-900">ราคา</label>
      <input
        type="number"
        id="price"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder="ราคา"
        required
        bind:value={price}
      />
    </div>
  </div>
  <div slot="footer" class="flex w-full justify-between">
    <Button
      class="border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-100 hover:text-rose-600 focus:ring-2 focus:ring-rose-600"
      type="button"
      on:click={handleCancel}
    >
      ยกเลิก
    </Button>
    <Button
      class="{price === 0
        ? `cursor-default bg-gray-200`
        : `bg-rose-600 text-white focus:bg-rose-600 focus:ring focus:ring-rose-300`} transition-all"
      type="button"
      disabled={price === 0}
      on:click={handleConfirm}
    >
      ยืนยัน
    </Button>
  </div>
</Modal>
