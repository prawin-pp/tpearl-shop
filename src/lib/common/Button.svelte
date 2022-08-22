<script lang="ts">
  let className = '';
  export { className as class };
  export let type = 'button';
  export let disabled = false;
</script>

{#if disabled}
  <button
    type={type}
    class={`flex items-center justify-center rounded-lg px-4 py-3 ${className || ''}`}
  >
    <slot />
  </button>
{:else}
  <button
    type={type}
    class={`flex items-center justify-center rounded-lg px-4 py-3 ${className || ''}`}
    on:click
  >
    <slot />
  </button>
{/if}
