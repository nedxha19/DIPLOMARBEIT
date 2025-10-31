<script>
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let title = '';
  export let subtitle = '';
  export let icon = 'home';
  export let stats = [];
</script>

<!-- Professional Admin Header Component -->
<header 
  class="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 mb-6 shadow-sm"
  in:fly={{ y: -30, duration: 600, easing: quintOut }}
>
  <div class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
    <!-- Header Content -->
    <div class="flex items-start gap-5">
      <div class="flex-shrink-0">
        <div class="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group hover:bg-slate-200 transition-all duration-300">
          <i class="fas fa-{icon} text-2xl text-slate-700"></i>
        </div>
      </div>
      
      <div class="flex-1">
        <h1 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-1.5 tracking-tight">
          {title}
        </h1>
        <p class="text-slate-600 text-base font-medium">
          {subtitle}
        </p>
      </div>
    </div>
    
    <!-- Stats Cards -->
    {#if stats.length > 0}
      <div class="flex gap-3">
        {#each stats as stat, i}
          <div 
            class="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[130px] hover:bg-slate-100 hover:border-slate-300 transition-all duration-300"
            in:fly={{ x: 20, duration: 400, delay: 200 + (i * 100) }}
          >
            <div class="flex items-center gap-2.5 mb-2">
              <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <i class="fas fa-{stat.icon} text-slate-700 text-sm"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</div>
            <div class="text-slate-600 text-xs font-medium uppercase tracking-wide">{stat.label}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</header>



