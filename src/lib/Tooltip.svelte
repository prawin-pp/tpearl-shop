<script lang="ts">
  import { onMount } from 'svelte';
  export let content: string;

  let tooltip: Tooltip;
  let slotElemnent: HTMLElement;
  let tooltipElement: HTMLElement;

  onMount(() => {
    tooltip = new Tooltip(tooltipElement, slotElemnent);
  });
</script>

<div bind:this={slotElemnent} data-tooltip-target="tooltip" data-tooltip-placement="top">
  <slot />
</div>
<div
  bind:this={tooltipElement}
  id="tooltip"
  role="tooltip"
  class="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm dark:bg-gray-700"
>
  {content}
  <div class="tooltip-arrow" data-popper-arrow />
</div>
