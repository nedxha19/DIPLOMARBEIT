<script>
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  export let data;
  
  let viewMode = 'grid'; // 'grid' or 'list'
  let showFilters = true;
  let savedProperties = [];
  let compareList = [];
  let showCompareModal = false;
  
  // Filter states
  let searchQuery = data.currentFilters.search || '';
  let selectedType = data.currentFilters.type || '';
  let minPrice = data.currentFilters.minPrice || '';
  let maxPrice = data.currentFilters.maxPrice || '';
  let selectedBedrooms = data.currentFilters.bedrooms || '';
  let selectedBathrooms = data.currentFilters.bathrooms || '';
  let sortBy = data.currentFilters.sortBy || 'newest';
  
  // Price range for slider
  let priceRangeMin = 0;
  let priceRangeMax = data.filters.priceRange.maxPrice || 10000000;
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'bedrooms', label: 'Most Bedrooms' }
  ];
  
  function applyFilters() {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedType) params.set('type', selectedType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (selectedBedrooms) params.set('bedrooms', selectedBedrooms);
    if (selectedBathrooms) params.set('bathrooms', selectedBathrooms);
    if (sortBy) params.set('sortBy', sortBy);
    
    goto(`/Properties?${params.toString()}`);
  }
  
  function clearFilters() {
    searchQuery = '';
    selectedType = '';
    minPrice = '';
    maxPrice = '';
    selectedBedrooms = '';
    selectedBathrooms = '';
    sortBy = 'newest';
    goto('/Properties');
  }
  
  function toggleSave(propertyId) {
    if (savedProperties.includes(propertyId)) {
      savedProperties = savedProperties.filter(id => id !== propertyId);
    } else {
      savedProperties = [...savedProperties, propertyId];
    }
  }
  
  function toggleCompare(propertyId) {
    if (compareList.includes(propertyId)) {
      compareList = compareList.filter(id => id !== propertyId);
    } else {
      if (compareList.length < 3) {
        compareList = [...compareList, propertyId];
      }
    }
  }
  
  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }
  
  function staggerDelay(index) {
    return index * 50;
  }
  
  $: hasActiveFilters = searchQuery || selectedType || minPrice || maxPrice || selectedBedrooms || selectedBathrooms;
  $: compareProperties = data.properties.filter(p => compareList.includes(p.id));
</script>

<svelte:head>
  <title>Browse Properties | Houseo - Find Your Perfect Home</title>
  <meta name="description" content="Browse our extensive collection of properties. Use advanced filters to find exactly what you're looking for." />
</svelte:head>

<!-- Header Section -->
<section class="py-12 bg-slate-900 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold mb-2">Property Listings</h1>
        <p class="text-slate-300">
          {data.properties.length} properties available
          {#if hasActiveFilters}
            <span class="text-slate-400">• Filtered results</span>
          {/if}
        </p>
      </div>
      
      <!-- View Toggle & Sort -->
      <div class="hidden md:flex items-center gap-4">
        <div class="flex bg-slate-800 rounded-lg p-1">
          <button
            on:click={() => viewMode = 'grid'}
            class="px-4 py-2 rounded-lg transition-all {viewMode === 'grid' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}"
          >
            <i class="fas fa-th"></i>
          </button>
          <button
            on:click={() => viewMode = 'list'}
            class="px-4 py-2 rounded-lg transition-all {viewMode === 'list' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}"
          >
            <i class="fas fa-list"></i>
          </button>
        </div>
        
        <select
          bind:value={sortBy}
          on:change={applyFilters}
          class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-white focus:ring-2 focus:ring-white/20 outline-none"
        >
          {#each sortOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
    
    <!-- Quick Search Bar -->
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="Search by location, address, or property type..."
          class="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-white focus:ring-2 focus:ring-white/20 outline-none"
        />
      </div>
      <button
        on:click={applyFilters}
        class="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
      >
        Search
      </button>
      <button
        on:click={() => showFilters = !showFilters}
        class="px-6 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-all md:hidden"
      >
        <i class="fas fa-filter"></i>
      </button>
    </div>
  </div>
</section>

<!-- Main Content -->
<section class="py-8 bg-slate-50 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex gap-8">
      
      <!-- Filters Sidebar -->
      {#if showFilters}
        <aside 
          class="w-80 flex-shrink-0 space-y-6"
          in:fly={{ x: -20, duration: 400, easing: quintOut }}
        >
          <!-- Active Filters -->
          {#if hasActiveFilters}
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-slate-900">Active Filters</h3>
                <button
                  on:click={clearFilters}
                  class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                {#if searchQuery}
                  <span class="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full flex items-center gap-2">
                    {searchQuery}
                    <button on:click={() => { searchQuery = ''; applyFilters(); }} class="hover:text-slate-900">×</button>
                  </span>
                {/if}
                {#if selectedType}
                  <span class="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full flex items-center gap-2">
                    {selectedType}
                    <button on:click={() => { selectedType = ''; applyFilters(); }} class="hover:text-slate-900">×</button>
                  </span>
                {/if}
                {#if minPrice || maxPrice}
                  <span class="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full flex items-center gap-2">
                    ${minPrice || '0'} - ${maxPrice || 'Any'}
                    <button on:click={() => { minPrice = ''; maxPrice = ''; applyFilters(); }} class="hover:text-slate-900">×</button>
                  </span>
                {/if}
              </div>
            </div>
          {/if}
          
          <!-- Property Type -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-4">Property Type</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  bind:group={selectedType}
                  value=""
                  on:change={applyFilters}
                  class="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <span class="text-slate-700">All Types</span>
              </label>
              {#each data.filters.types as type}
                <label class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    bind:group={selectedType}
                    value={type}
                    on:change={applyFilters}
                    class="w-4 h-4 text-slate-900 focus:ring-slate-900"
                  />
                  <span class="text-slate-700">{type}</span>
                </label>
              {/each}
            </div>
          </div>
          
          <!-- Price Range -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-4">Price Range</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-slate-600 mb-1 block">Min Price</label>
                  <input
                    type="number"
                    bind:value={minPrice}
                    placeholder="No min"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label class="text-xs text-slate-600 mb-1 block">Max Price</label>
                  <input
                    type="number"
                    bind:value={maxPrice}
                    placeholder="No max"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none"
                  />
                </div>
              </div>
              <button
                on:click={applyFilters}
                class="w-full py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all"
              >
                Apply Price Range
              </button>
            </div>
          </div>
          
          <!-- Bedrooms -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-4">Bedrooms</h3>
            <div class="grid grid-cols-3 gap-2">
              {#each ['', '1', '2', '3', '4', '5'] as beds}
                <button
                  on:click={() => { selectedBedrooms = beds; applyFilters(); }}
                  class="px-4 py-2 rounded-lg font-medium transition-all {selectedBedrooms === beds 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                >
                  {beds ? `${beds}+` : 'Any'}
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Bathrooms -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-slate-900 mb-4">Bathrooms</h3>
            <div class="grid grid-cols-3 gap-2">
              {#each ['', '1', '2', '3', '4'] as baths}
                <button
                  on:click={() => { selectedBathrooms = baths; applyFilters(); }}
                  class="px-4 py-2 rounded-lg font-medium transition-all {selectedBathrooms === baths 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                >
                  {baths ? `${baths}+` : 'Any'}
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Quick Stats -->
          <div class="bg-slate-900 rounded-xl p-6 text-white">
            <h3 class="font-semibold mb-4">Quick Stats</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Total Properties</span>
                <span class="font-semibold">{data.properties.length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Saved</span>
                <span class="font-semibold">{savedProperties.length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Comparing</span>
                <span class="font-semibold">{compareList.length}/3</span>
              </div>
            </div>
          </div>
        </aside>
      {/if}
      
      <!-- Properties Grid/List -->
      <div class="flex-1">
        {#if data.properties.length > 0}
          <!-- Compare Bar -->
          {#if compareList.length > 0}
            <div class="mb-6 bg-slate-900 rounded-xl p-4 text-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="fas fa-balance-scale text-xl"></i>
                <span class="font-semibold">{compareList.length} properties selected for comparison</span>
              </div>
              <div class="flex items-center gap-3">
                <button
                  on:click={() => showCompareModal = true}
                  class="px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
                  disabled={compareList.length < 2}
                >
                  Compare Now
                </button>
                <button
                  on:click={() => compareList = []}
                  class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          {/if}
          
          <div class="{viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}">
            {#each data.properties as property, i}
              {#if viewMode === 'grid'}
                <!-- Grid View Card -->
                <article
                  class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
                  in:fly={{ y: 20, duration: 500, delay: staggerDelay(i), easing: quintOut }}
                >
                  <div class="relative h-56 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.location}
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <!-- Action Buttons -->
                    <div class="absolute top-3 right-3 flex gap-2">
                      <button
                        on:click={() => toggleSave(property.id)}
                        class="w-10 h-10 rounded-full {savedProperties.includes(property.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700'} backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                      >
                        <i class="fas fa-heart"></i>
                      </button>
                      <button
                        on:click={() => toggleCompare(property.id)}
                        class="w-10 h-10 rounded-full {compareList.includes(property.id) ? 'bg-slate-900 text-white' : 'bg-white/90 text-slate-700'} backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                      >
                        <i class="fas fa-balance-scale"></i>
                      </button>
                    </div>
                    
                    <div class="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-900">
                      {property.type}
                    </div>
                  </div>
                  
                  <div class="p-5">
                    <div class="mb-3">
                      <h3 class="text-xl font-bold text-slate-900 mb-1">{property.location}</h3>
                      <p class="text-sm text-slate-600 flex items-center gap-1">
                        <i class="fas fa-map-marker-alt text-slate-400"></i>
                        {property.address}
                      </p>
                    </div>
                    
                    <div class="flex items-center gap-4 mb-4 text-sm text-slate-600">
                      <span><i class="fas fa-bed text-slate-400"></i> {property.bedrooms}</span>
                      <span><i class="fas fa-bath text-slate-400"></i> {property.bathrooms}</span>
                      <span><i class="fas fa-ruler-combined text-slate-400"></i> {property.square_foot} sqft</span>
                    </div>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span class="text-2xl font-bold text-slate-900">{formatPrice(property.price)}</span>
                      <a
                        href="/details/{property.id}"
                        class="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </article>
              {:else}
                <!-- List View Card -->
                <article
                  class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  in:fly={{ x: -20, duration: 500, delay: staggerDelay(i), easing: quintOut }}
                >
                  <div class="flex gap-6 p-6">
                    <div class="relative w-80 h-52 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={property.image}
                        alt={property.location}
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div class="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-900">
                        {property.type}
                      </div>
                    </div>
                    
                    <div class="flex-1 flex flex-col justify-between">
                      <div>
                        <div class="flex items-start justify-between mb-2">
                          <div>
                            <h3 class="text-2xl font-bold text-slate-900 mb-1">{property.location}</h3>
                            <p class="text-slate-600 flex items-center gap-1">
                              <i class="fas fa-map-marker-alt text-slate-400"></i>
                              {property.address}
                            </p>
                          </div>
                          <div class="flex gap-2">
                            <button
                              on:click={() => toggleSave(property.id)}
                              class="w-10 h-10 rounded-full {savedProperties.includes(property.id) ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700'} flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <i class="fas fa-heart"></i>
                            </button>
                            <button
                              on:click={() => toggleCompare(property.id)}
                              class="w-10 h-10 rounded-full {compareList.includes(property.id) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'} flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <i class="fas fa-balance-scale"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div class="flex items-center gap-6 mb-4 text-slate-600">
                          <span class="flex items-center gap-2">
                            <i class="fas fa-bed text-slate-400"></i>
                            {property.bedrooms} Bedrooms
                          </span>
                          <span class="flex items-center gap-2">
                            <i class="fas fa-bath text-slate-400"></i>
                            {property.bathrooms} Bathrooms
                          </span>
                          <span class="flex items-center gap-2">
                            <i class="fas fa-ruler-combined text-slate-400"></i>
                            {property.square_foot} sqft
                          </span>
                        </div>
                      </div>
                      
                      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span class="text-3xl font-bold text-slate-900">{formatPrice(property.price)}</span>
                        <a
                          href="/details/{property.id}"
                          class="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              {/if}
            {/each}
          </div>
        {:else}
          <div class="text-center py-20 bg-white rounded-2xl shadow-md">
            <i class="fas fa-search text-6xl text-slate-300 mb-4"></i>
            <h3 class="text-2xl font-bold text-slate-900 mb-2">No Properties Found</h3>
            <p class="text-slate-600 mb-6">Try adjusting your filters or search criteria</p>
            <button
              on:click={clearFilters}
              class="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Compare Modal -->
{#if showCompareModal}
  <div 
    class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    on:click={() => showCompareModal = false}
    transition:fade={{ duration: 200 }}
  >
    <div 
      class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
      in:scale={{ duration: 300, easing: quintOut }}
    >
      <div class="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900">Compare Properties</h2>
        <button
          on:click={() => showCompareModal = false}
          class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <i class="fas fa-times text-slate-600"></i>
        </button>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-{compareProperties.length} gap-6">
          {#each compareProperties as property}
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <img src={property.image} alt={property.location} class="w-full h-48 object-cover" />
              <div class="p-4 space-y-3">
                <h3 class="font-bold text-lg">{property.location}</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between py-2 border-b border-slate-100">
                    <span class="text-slate-600">Price</span>
                    <span class="font-semibold">{formatPrice(property.price)}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-slate-100">
                    <span class="text-slate-600">Type</span>
                    <span class="font-semibold">{property.type}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-slate-100">
                    <span class="text-slate-600">Bedrooms</span>
                    <span class="font-semibold">{property.bedrooms}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-slate-100">
                    <span class="text-slate-600">Bathrooms</span>
                    <span class="font-semibold">{property.bathrooms}</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-slate-100">
                    <span class="text-slate-600">Square Feet</span>
                    <span class="font-semibold">{property.square_foot}</span>
                  </div>
                </div>
                <a
                  href="/details/{property.id}"
                  class="block text-center py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all mt-4"
                >
                  View Details
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}
