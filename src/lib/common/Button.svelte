<script lang="ts">
  let classes = '';
  export { classes as class };
  export let type = 'button';
  export let disabled = false;
</script>

{#if disabled}
  <button
    type={type}
    class={`flex items-center justify-center rounded-lg px-4 py-3 ${classes || ''}`}
  >
    <slot />
  </button>
{:else}
  <button
    type={type}
    class={`flex items-center justify-center rounded-lg px-4 py-3 ${classes || ''}`}
    on:click
  >
    <slot />
  </button>
{/if}
