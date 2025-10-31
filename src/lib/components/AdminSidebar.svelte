<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import '@fortawesome/fontawesome-free/css/all.min.css';

  export let isSidebarHidden;
  
  const menuItems = [
    { icon: 'home', label: 'Property System', href: '/admin/propertySystem'},
    { icon: 'plus-circle', label: 'Add Property', href: '/admin/propertySystem/addProperty' },
    { icon: 'info-circle', label: 'Property Details', href: '/admin/details' },
    { icon: 'calendar-alt', label: 'Schedule', href: '/admin/calendarSchedule' },
    { icon: 'message', label: 'AI Assistant', href: '/admin/chatBot' },
    { icon: 'sign-out-alt', label: 'Logout', href: '/admin/logout' }
  ];
  
  function toggleSidebar() {
    isSidebarHidden = !isSidebarHidden;
  }
  
  // Auto-collapse on mobile
  onMount(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        isSidebarHidden = true;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  $: currentPath = $page.url.pathname;
  
  function isActive(href) {
    // Exact match for logout
    if (href === '/admin/logout') {
      return currentPath === href;
    }
    // Exact match or starts with (for nested routes)
    return currentPath === href || currentPath.startsWith(href + '/');
  }
</script>

<!-- Professional Sidebar with Clean Design -->
<aside 
  class="fixed top-0 left-0 h-screen bg-slate-900 shadow-xl z-50 transition-all duration-300 ease-in-out {isSidebarHidden ? 'w-20' : 'w-72'}"
  in:fly={{ x: -100, duration: 400, easing: quintOut }}
>
  <div class="relative h-full flex flex-col overflow-hidden">
    <!-- Toggle Button -->
    <div class="flex {isSidebarHidden ? 'justify-center' : 'justify-end'} px-5 pt-6 pb-4">
      <button
        on:click={toggleSidebar}
        class="group w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-300"
        aria-label="Toggle sidebar"
      >
        <i class="fas fa-{isSidebarHidden ? 'chevron-right' : 'chevron-left'} text-slate-400 group-hover:text-slate-200 transition-colors duration-300"></i>
      </button>
    </div>

    <!-- Logo/Brand -->
    <a
      href="/"
      class="flex items-center gap-3 px-5 pb-6 mb-2 border-b border-slate-800 group transition-all duration-300"
    >
      <div class="relative">
        <div class="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-slate-700 transition-all duration-300">
          <i class="fas fa-home text-white text-lg"></i>
        </div>
      </div>
      
      <div class="flex-1 overflow-hidden transition-all duration-300 {isSidebarHidden ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
        <span class="block text-lg font-bold text-white tracking-tight whitespace-nowrap">Admin Panel</span>
        <span class="block text-xs text-slate-400 whitespace-nowrap">Houseo Dashboard</span>
      </div>
    </a>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
      <ul class="space-y-1.5">
        {#each menuItems as item, i}
          <li
            in:fly={{ x: -20, duration: 300, delay: i * 50, easing: quintOut }}
          >
            <a
              href={item.href}
              class="group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 {isActive(item.href) 
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }"
            >
              <!-- Active indicator -->
              {#if isActive(item.href)}
                <div 
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                  in:fly={{ x: -10, duration: 300 }}
                ></div>
              {/if}
              
              <!-- Icon -->
              <div class="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 {isActive(item.href)
                ? 'bg-slate-700'
                : 'bg-transparent group-hover:bg-slate-700/50'
              }">
                <i class="fas fa-{item.icon} text-base {isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'}"></i>
              </div>
              
              <!-- Label -->
              <span class="font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 {isSidebarHidden ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
                {item.label}
              </span>
              
              <!-- Arrow indicator -->
              {#if !isSidebarHidden}
                <i class="fas fa-chevron-right text-xs ml-auto opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300"></i>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- Minimalist Footer -->
    <div class="px-5 py-4 border-t border-slate-800">
      <div class="flex items-center justify-center">
        <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-sm">
          <i class="fas fa-user text-white text-sm"></i>
        </div>
      </div>
    </div>
  </div>
</aside>

<style>
  /* Custom scrollbar styles */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  
  .scrollbar-track-transparent::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thumb-white\/10::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  .scrollbar-thumb-white\/10:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
