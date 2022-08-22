<script lang="ts">
  let className = '';
  export { className as class };
</script>

<span class="material-symbols-rounded block select-none {className || ''}" on:click>
  <slot />
</span>
