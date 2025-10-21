<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fly, fade } from 'svelte/transition';
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

<!-- Ultra-modern sidebar with Tailwind CSS and advanced animations -->
<aside 
  class="fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 transition-all duration-300 ease-in-out {isSidebarHidden ? 'w-20' : 'w-72'}"
  in:fly={{ x: -100, duration: 400, easing: quintOut }}
>
  <!-- Animated gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>
  
  <!-- Glow effects -->
  <div class="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl animate-pulse"></div>
  <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
  
  <div class="relative h-full flex flex-col overflow-hidden">
    <!-- Toggle Button -->
    <div class="flex {isSidebarHidden ? 'justify-center' : 'justify-end'} px-5 pt-6 pb-4">
      <button
        on:click={toggleSidebar}
        class="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/50 transition-all duration-300 hover:scale-110 hover:rotate-180"
        aria-label="Toggle sidebar"
      >
        <i class="fas fa-{isSidebarHidden ? 'chevron-right' : 'chevron-left'} text-sky-400 group-hover:text-sky-300 transition-colors duration-300"></i>
        
        <!-- Ripple effect -->
        <div class="absolute inset-0 rounded-xl bg-sky-400/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </button>
    </div>

    <!-- Logo/Brand -->
    <a
      href="/"
      class="flex items-center gap-3 px-5 pb-6 mb-2 border-b border-white/5 group transition-all duration-300 hover:border-white/10"
    >
      <!-- Animated icon with gradient -->
      <div class="relative">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-orange-500 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-xl group-hover:shadow-sky-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
          <i class="fas fa-user-cog text-white text-lg"></i>
        </div>
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-sky-500 to-orange-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      </div>
      
      <div class="flex-1 overflow-hidden transition-all duration-300 {isSidebarHidden ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
        <span class="block text-lg font-bold text-white tracking-tight whitespace-nowrap">Admin Panel</span>
        <span class="block text-xs text-slate-400 whitespace-nowrap">Houseo Dashboard</span>
      </div>
    </a>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
      <ul class="space-y-1.5">
        {#each menuItems as item, i}
          <li
            in:fly={{ x: -20, duration: 300, delay: i * 50, easing: quintOut }}
          >
            <a
              href={item.href}
              class="group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 {isActive(item.href) 
                ? 'bg-gradient-to-r from-sky-500/20 to-orange-500/20 text-white shadow-lg shadow-sky-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }"
            >
              <!-- Active indicator -->
              {#if isActive(item.href)}
                <div 
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-400 to-orange-400 rounded-r-full"
                  in:fly={{ x: -10, duration: 300 }}
                ></div>
              {/if}
              
              <!-- Icon -->
              <div class="relative">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 {isActive(item.href)
                  ? 'bg-gradient-to-br from-sky-500 to-orange-500 shadow-lg shadow-sky-500/30'
                  : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-110'
                }">
                  <i class="fas fa-{item.icon} text-base {isActive(item.href) ? 'text-white' : 'text-slate-300 group-hover:text-white'}"></i>
                </div>
                
                <!-- Pulse effect for active item -->
                {#if isActive(item.href)}
                  <div class="absolute inset-0 rounded-lg bg-sky-400 animate-ping opacity-20"></div>
                {/if}
              </div>
              
              <!-- Label -->
              <span class="font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 {isSidebarHidden ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
                {item.label}
              </span>
              
              <!-- Hover effect background -->
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 via-sky-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <!-- Arrow indicator -->
              {#if !isSidebarHidden}
                <i class="fas fa-chevron-right text-xs ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 {isActive(item.href) ? 'text-white' : 'text-slate-500'}"></i>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- User Info Footer -->
    <div class="px-5 py-4 border-t border-white/5">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-sky-400/30">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-orange-500 flex items-center justify-center shadow-lg">
            <i class="fas fa-user text-white text-sm"></i>
          </div>
          <!-- Online indicator -->
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></div>
        </div>
        
        <div class="flex-1 overflow-hidden transition-all duration-300 {isSidebarHidden ? 'w-0 opacity-0' : 'w-auto opacity-100'}">
          <p class="text-sm font-semibold text-white truncate">Administrator</p>
          <p class="text-xs text-slate-400 truncate">admin@houseo.com</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Tooltip for collapsed state -->
  {#if isSidebarHidden}
    <div class="fixed left-20 top-20 pointer-events-none z-50">
      <!-- Tooltips would appear here when hovering over collapsed menu items -->
    </div>
  {/if}
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
