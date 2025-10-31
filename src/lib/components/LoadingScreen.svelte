<script>
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let show = true;
  
  onMount(() => {
    // Auto-hide after animation completes
    setTimeout(() => {
      show = false;
    }, 1800);
  });
</script>

{#if show}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 400 }}
  >
    <div class="text-center">
      <!-- Logo/Icon -->
      <div 
        class="inline-flex items-center justify-center w-20 h-20 mb-6"
        in:scale={{ duration: 600, easing: quintOut }}
      >
        <div class="relative">
          <div class="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-gentle">
            <i class="fas fa-home text-3xl text-white"></i>
          </div>
          <!-- Spinning border -->
          <div class="absolute inset-0 rounded-2xl border-4 border-slate-300 border-t-slate-900 animate-spin-slow"></div>
        </div>
      </div>
      
      <!-- Brand Text -->
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Houseo Admin</h2>
      <p class="text-slate-600 text-sm font-medium mb-6">Loading your dashboard...</p>
      
      <!-- Progress Bar -->
      <div class="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mx-auto">
        <div class="h-full bg-slate-900 rounded-full animate-progress"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes pulse-gentle {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.15);
    }
  }
  
  .animate-pulse-gentle {
    animation: pulse-gentle 2s ease-in-out infinite;
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 1.5s linear infinite;
  }
  
  @keyframes progress {
    0% { 
      transform: translateX(-100%);
    }
    100% { 
      transform: translateX(0);
    }
  }
  
  .animate-progress {
    animation: progress 1.5s ease-out forwards;
  }
</style>



