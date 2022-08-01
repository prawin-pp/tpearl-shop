<script lang="ts">
  let classes = '';
  export { classes as class };
  export let disabled = false;
</script>

{#if disabled}
  <span class="material-icons-round block select-none {classes || ''}">
    <slot />
  </span>
{:else}
  <span class="material-icons-round block select-none {classes || ''}" on:click>
    <slot />
  </span>
{/if}
