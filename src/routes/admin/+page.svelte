<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    goto('/admin/propertySystem', { replaceState: true });
  });
</script>
