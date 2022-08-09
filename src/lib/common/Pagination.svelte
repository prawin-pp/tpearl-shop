<script lang="ts" context="module">
  export interface IPaginationEvent {
    change: IPaginationRequest;
  }
</script>

<script lang="ts">
  import type { IPagination } from 'src/models/pagination.model';
  import type { IPaginationRequest } from 'src/services/api/models/request.model';
  import { createEventDispatcher } from 'svelte';

  import Icon from './Icon.svelte';

  const dispatch = createEventDispatcher<IPaginationEvent>();

  export let pagination: IPagination;

  function handlePreviousPage() {
    if (pagination.page > 1) {
      handleGoToPage(pagination.page - 1);
    }
  }

  function handleNextPage() {
    if (pagination.page < pagination.pageCount) {
      handleGoToPage(pagination.page + 1);
    }
  }

  function handleGoToPage(page: number) {
    if (page === pagination.page) return;
    dispatch('change', { page, pageSize: pagination.pageSize });
  }
</script>

<ul class="inline-flex items-center -space-x-px">
  <li>
    <div
      class="flex h-10 w-10 items-center justify-center rounded-l-xl border border-gray-300 bg-white leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      on:click={() => handleGoToPage(1)}
    >
      <span class="sr-only">First Page</span>
      <Icon>first_page</Icon>
    </div>
  </li>
  <li>
    <div
      class="flex h-10 w-10 items-center justify-center border border-gray-300 bg-white leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      on:click={handlePreviousPage}
    >
      <span class="sr-only">Previous</span>
      <Icon>navigate_before</Icon>
    </div>
  </li>
  <li>
    <div
      class="flex h-10 w-10 items-center justify-center border border-gray-300 bg-white leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      on:click={handleNextPage}
    >
      <span class="sr-only">Next</span>
      <Icon>navigate_next</Icon>
    </div>
  </li>
  <li>
    <div
      class="flex h-10 w-10 items-center justify-center rounded-r-xl border border-gray-300 bg-white leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      on:click={() => handleGoToPage(pagination.pageCount)}
    >
      <span class="sr-only">Last Page</span>
      <Icon>last_page</Icon>
    </div>
  </li>
</ul>
