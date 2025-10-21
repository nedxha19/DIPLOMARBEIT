<script>
  import AdminSidebar from '$lib/components/AdminSidebar.svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  
  export const isSidebarHidden = writable(false);
  
  // Check if the current route is an auth page
  $: isAuthPage = $page.url.pathname === '/admin/login' || $page.url.pathname === '/admin/register';
  $: isFullWidthPage = $page.url.pathname === '/admin/calendarSchedule' || $page.url.pathname === '/admin/chatBot';
</script>

{#if isAuthPage}
  <!-- Auth pages (login/register) - Full screen without sidebar -->
  <slot />
{:else}
  <!-- Main admin layout with sidebar -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
