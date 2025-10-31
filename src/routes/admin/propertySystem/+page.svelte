<script>
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
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
  <AdminHeader 
    title="Property Portfolio"
    subtitle="Comprehensive property management and portfolio overview"
    icon="building"
    stats={[
      { icon: 'home', value: data.properties.length, label: 'Properties' },
      { icon: 'chart-line', value: `$${(totalValue / 1000000).toFixed(1)}M`, label: 'Portfolio Value' }
    ]}
  />

  <!-- Action Bar -->
  <div 
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    in:fly={{ y: 20, duration: 500, delay: 400 }}
  >
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shadow-sm">
        <i class="fas fa-th-large text-slate-700 text-lg"></i>
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-900">All Properties</h2>
        <p class="text-sm text-gray-600">Manage your real estate portfolio</p>
      </div>
    </div>
    
    <a 
      href="/admin/propertySystem/addProperty" 
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-300"
    >
      <i class="fas fa-plus-circle"></i>
      <span>Add New Property</span>
    </a>
  </div>

  <!-- Properties Grid -->
  {#if data.properties.length === 0}
    <div 
      class="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center"
      in:scale={{ duration: 400, easing: elasticOut }}
    >
      <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <i class="fas fa-home text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No Properties Yet</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">Start building your real estate portfolio by adding your first property</p>
      <a 
        href="/admin/propertySystem/addProperty"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-300"
      >
        <i class="fas fa-plus-circle"></i>
        <span>Add Your First Property</span>
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
      {#each data.properties as property, i (property.id)}
        <article 
          class="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          in:fly={{ y: 30, duration: 500, delay: staggerDelay(i), easing: quintOut }}
        >
          <!-- Property Image -->
          <div class="relative h-48 overflow-hidden bg-gray-100">
            <img 
              src={property.image} 
              alt={property.location}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <!-- Type badge -->
            <div class="absolute top-3 right-3">
              <span class="px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-full shadow-sm">
                {property.type}
              </span>
            </div>
          </div>
          
          <!-- Property Details -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-slate-700 transition-colors duration-300">
              {property.location}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-1">
              <i class="fas fa-map-marker-alt text-slate-600"></i>
              {property.address}
            </p>
            
            <!-- Amenities -->
            <div class="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
              <div class="flex items-center gap-1.5 text-sm text-gray-700">
                <i class="fas fa-ruler-combined text-slate-600"></i>
                <span class="font-medium">{property.square_foot} sqft</span>
              </div>
              <div class="flex items-center gap-1.5 text-sm text-gray-700">
                <i class="fas fa-bed text-slate-600"></i>
                <span class="font-medium">{property.bedrooms}</span>
              </div>
              <div class="flex items-center gap-1.5 text-sm text-gray-700">
                <i class="fas fa-bath text-slate-600"></i>
                <span class="font-medium">{property.bathrooms}</span>
              </div>
            </div>
            
            <!-- Price and Actions -->
            <div class="flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold text-slate-900">
                  ${property.price.toLocaleString()}
                </div>
                <div class="text-xs text-gray-500 font-medium">Market Price</div>
              </div>
              
              <form action="?/deleteProperty" method="POST" use:enhance>
                <input type="hidden" name="id" value={property.id} />
                <button 
                  type="submit" 
                  class="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all duration-300 group/del"
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
