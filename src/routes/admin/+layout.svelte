<script>
  import AdminSidebar from '$lib/components/AdminSidebar.svelte';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  export const isSidebarHidden = writable(false);
  
  let showLoading = true;
  
  // Check if the current route is an auth page
  $: isAuthPage = $page.url.pathname === '/admin/login' || $page.url.pathname === '/admin/register';
  $: isFullWidthPage = $page.url.pathname === '/admin/calendarSchedule' || $page.url.pathname === '/admin/chatBot';
  
  onMount(() => {
    // Hide loading screen after initial load
    setTimeout(() => {
      showLoading = false;
    }, 1800);
  });
</script>

{#if isAuthPage}
  <!-- Auth pages (login/register) - Full screen without sidebar -->
  <slot />
{:else}
  <!-- Loading Screen -->
  {#if showLoading}
    <LoadingScreen bind:show={showLoading} />
  {/if}
  
  <!-- Main admin layout with sidebar -->
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar bind:isSidebarHidden={$isSidebarHidden} />
    
    <!-- Main content area - Professional spacing -->
    <main 
      class="transition-all duration-300 ease-in-out min-h-screen {$isSidebarHidden ? 'ml-20' : 'ml-72'} {isFullWidthPage ? 'p-0' : 'p-6 lg:p-8 xl:p-10'}"
    >
      <!-- Content wrapper with professional max-width -->
      <div class="{isFullWidthPage ? 'w-full h-full' : 'max-w-[1600px] mx-auto'}">
        <slot />
      </div>
    </main>
  </div>
{/if}
