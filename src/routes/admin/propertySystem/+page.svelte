<script>
  import { enhance } from '$app/forms';
  import { fly, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  
  let { data } = $props();
  
  let totalValue = $derived(data.properties.reduce((sum, p) => sum + p.price, 0));
  
  function staggerDelay(index) {
    return index * 75;
  }
</script>

<!-- Modern Property System Dashboard -->
<div class="min-h-screen">
  <!-- Hero Header with Gradient -->
  <header 
    class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-orange-500 p-8 mb-8 shadow-2xl shadow-sky-500/30"
    in:fly={{ y: -30, duration: 600, easing: quintOut }}
  >
    <!-- Animated background patterns -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6bS0yLTJ2Mmg0di00aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
    
    <div class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <!-- Header Content -->
      <div class="flex items-start gap-6">
        <div class="flex-shrink-0">
          <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg group hover:scale-110 transition-transform duration-300">
            <i class="fas fa-building text-4xl text-white"></i>
          </div>
        </div>
        
        <div class="flex-1">
          <h1 class="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Property Portfolio
          </h1>
          <p class="text-sky-50 text-lg font-medium">
            Comprehensive property management and portfolio overview
          </p>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="flex gap-4">
        <div 
          class="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[140px] hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          in:fly={{ x: 20, duration: 400, delay: 200 }}
        >
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-home text-white text-lg"></i>
            </div>
          </div>
          <div class="text-3xl font-bold text-white mb-1">{data.properties.length}</div>
          <div class="text-sky-100 text-sm font-medium">Properties</div>
        </div>
        
        <div 
          class="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[140px] hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          in:fly={{ x: 20, duration: 400, delay: 300 }}
        >
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-chart-line text-white text-lg"></i>
            </div>
          </div>
          <div class="text-3xl font-bold text-white mb-1">${(totalValue / 1000000).toFixed(1)}M</div>
          <div class="text-sky-100 text-sm font-medium">Portfolio Value</div>
        </div>
      </div>
    </div>
  </header>

  <!-- Action Bar -->
  <div 
    class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    in:fly={{ y: 20, duration: 500, delay: 400 }}
  >
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-gradient-to-br from-sky-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
        <i class="fas fa-th-large text-white text-lg"></i>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">All Properties</h2>
        <p class="text-sm text-gray-600">Manage your real estate portfolio</p>
      </div>
    </div>
    
    <a 
      href="/admin/propertySystem/addProperty" 
      class="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/50 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 overflow-hidden"
    >
      <!-- Shimmer effect -->
      <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <i class="fas fa-plus-circle text-lg relative z-10"></i>
      <span class="relative z-10">Add New Property</span>
      <i class="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300 relative z-10"></i>
    </a>
  </div>

  <!-- Properties Grid -->
  {#if data.properties.length === 0}
    <div 
      class="bg-white rounded-3xl shadow-lg border border-gray-200 p-16 text-center"
      in:scale={{ duration: 400, easing: elasticOut }}
    >
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <i class="fas fa-home text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">Start building your real estate portfolio by adding your first property</p>
      <a 
        href="/admin/propertySystem/addProperty"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        <i class="fas fa-plus-circle"></i>
        <span>Add Your First Property</span>
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {#each data.properties as property, i (property.id)}
        <article 
          class="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          in:fly={{ y: 30, duration: 500, delay: staggerDelay(i), easing: quintOut }}
        >
          <!-- Property Image -->
          <div class="relative h-56 overflow-hidden bg-gray-100">
            <img 
              src={property.image} 
              alt={property.location}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- Type badge -->
            <div class="absolute top-4 right-4">
              <span class="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-lg">
                {property.type}
              </span>
            </div>
          </div>
          
          <!-- Property Details -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-sky-600 transition-colors duration-300">
              {property.location}
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-1">
              <i class="fas fa-map-marker-alt text-orange-500"></i>
              {property.address}
            </p>
            
            <!-- Amenities -->
            <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
              <div class="flex items-center gap-1.5 text-sm text-gray-700">
                <i class="fas fa-ruler-combined text-sky-500"></i>
                <span class="font-medium">{property.square_foot} sqft</span>
              </div>
              <div class="flex items-center gap-1.5 text-sm text-gray-700">
                <i class="fas fa-bed text-sky-500"></i>
                <span class="font-medium">{property.bedrooms}</span>
              </div>
              <div class="flex items-center gap-1.5 text-sm text-gray-700">
                <i class="fas fa-bath text-sky-500"></i>
                <span class="font-medium">{property.bathrooms}</span>
              </div>
            </div>
            
            <!-- Price and Actions -->
            <div class="flex items-center justify-between">
              <div>
                <div class="text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
                  ${property.price.toLocaleString()}
                </div>
                <div class="text-xs text-gray-500 font-medium">Market Price</div>
              </div>
              
              <form action="?/deleteProperty" method="POST" use:enhance>
                <input type="hidden" name="id" value={property.id} />
                <button 
                  type="submit" 
                  class="group/del w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all duration-300 hover:scale-110"
                  title="Delete property"
                >
                  <i class="fas fa-trash text-red-500 group-hover/del:text-white transition-colors duration-300"></i>
                </button>
              </form>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>
