<script>
  import AdminSidebar from '$lib/components/AdminSidebar.svelte';
  import { writable } from 'svelte/store';
  export const isSidebarHidden = writable(false);
</script>
