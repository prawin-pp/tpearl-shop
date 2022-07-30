<script lang="ts">
  let classes = '';
  export { classes as class };
</script>

<span class="material-symbols-rounded block {classes || ''}">
  <slot />
</span>
