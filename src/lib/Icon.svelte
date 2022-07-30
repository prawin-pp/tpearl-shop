<script lang="ts">
  let classes = '';
  export { classes as class };
</script>

<span class="material-icons-round block {classes || ''}">
  <slot />
</span>
