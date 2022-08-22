<script lang="ts">
  let className = '';
  export { className as class };
  export let disabled = false;
</script>

{#if disabled}
  <span class="material-icons-round block select-none {className || ''}">
    <slot />
  </span>
{:else}
  <span class="material-icons-round block select-none {className || ''}" on:click>
    <slot />
  </span>
{/if}
