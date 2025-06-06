<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import '@fortawesome/fontawesome-free/css/all.min.css';

  export let isSidebarHidden;

  let activeIndex = 0;
  let hoverTimeout;
  let hoveredItem = null;
</script>