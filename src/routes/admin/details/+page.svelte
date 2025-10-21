<script>
  import { enhance } from '$app/forms';
  import { fly, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  
  export let data;

  let selectedPropertyId = '';
  let selectedProperty = null;
  let showForm = false;
  let loading = false;

  function addItem(name, placeholder) {
    const container = document.querySelector(`input[name="${name}"]`)?.closest('.dynamic-list');
    if (!container) return;
    const newItem = document.createElement('div');
    newItem.className = 'list-item';
    newItem.innerHTML = `<input type="text" name="${name}" placeholder="e.g., ${placeholder} - distance" class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all" /><button type="button" class="remove-item w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110">×</button>`;
    newItem.querySelector('.remove-item').addEventListener('click', () => newItem.remove());
    container.appendChild(newItem);
  }

  function removeItem(button) {
    button.closest('.list-item')?.remove();
  }

  if (typeof window !== 'undefined') {
    window.addItem = addItem;
    window.removeItem = removeItem;
  }
  
  function selectProperty() {
    if (selectedPropertyId) {
      selectedProperty = data.properties.find(p => p.id == selectedPropertyId);
      showForm = true;
    } else {
      selectedProperty = null;
      showForm = false;
    }
  }
  
  function handleSubmit() {
    loading = true;
    return async ({ result, update }) => {
      loading = false;
      const message = result.type === 'success' ? 'Property details saved successfully!' : 'Failed to save property details. Please try again.';
      alert(message);
      if (result.type === 'success') await update();
    };
  }
  
  function deleteDetails(detailsId) {
    if (confirm('Delete property details?')) {
      const formData = new FormData();
      formData.append('details_id', detailsId);
      fetch('?/deleteDetails', { method: 'POST', body: formData }).then(() => location.reload());
    }
  }
  
  function staggerDelay(index) {
    return index * 75;
  }
</script>

<!-- Modern Property Details Management Dashboard -->
<div class="min-h-screen">
  <!-- Hero Header -->
  <header 
    class="relative bg-gradient-to-br from-sky-600 via-sky-500 to-orange-500 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl overflow-hidden"
    in:fly={{ y: -50, duration: 600, easing: quintOut }}
  >
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute w-64 h-64 bg-white/20 rounded-full -top-20 -right-20 animate-pulse-slow"></div>
      <div class="absolute w-48 h-48 bg-white/20 rounded-full -bottom-10 -left-10 animate-pulse-slow delay-300"></div>
    </div>

    <div class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl shadow-lg">
        <i class="fas fa-clipboard-list"></i>
      </div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">Property Details Management</h1>
          <p class="text-sky-100 text-base opacity-90">Create comprehensive property listings with detailed information</p>
      </div>
    </div>
      
      <div class="flex gap-4">
        <div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center min-w-[110px] shadow-md" in:fly={{ y: 20, duration: 700, delay: 200, easing: elasticOut }}>
          <i class="fas fa-home text-2xl text-sky-200 mb-2"></i>
          <span class="block text-2xl font-bold">{data.properties.length}</span>
          <span class="block text-xs opacity-80">Properties</span>
      </div>
        <div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center min-w-[110px] shadow-md" in:fly={{ y: 20, duration: 700, delay: 300, easing: elasticOut }}>
          <i class="fas fa-file-alt text-2xl text-orange-200 mb-2"></i>
          <span class="block text-2xl font-bold">{data.existingDetails.length}</span>
          <span class="block text-xs opacity-80">Detailed</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Property Selection Section -->
  <div 
    class="bg-white rounded-2xl shadow-md border border-gray-200 mb-8 overflow-hidden"
    in:fly={{ y: -20, duration: 600, delay: 100, easing: quintOut }}
  >
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center gap-3 mb-2">
        <i class="fas fa-search text-sky-600 text-xl"></i>
        <h2 class="text-2xl font-semibold text-gray-800">Select Property to Manage</h2>
      </div>
      <p class="text-gray-600">Choose a property to create or edit detailed information</p>
    </div>
    
    <div class="p-6">
      <div class="relative mb-6">
        <i class="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
        <select 
          bind:value={selectedPropertyId} 
          on:change={selectProperty}
          class="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl font-medium text-gray-800 bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
        >
          <option value="">Choose a property...</option>
          {#each data.properties as property}
            <option value={property.id}>
              {property.location} - {property.type} • ${property.price.toLocaleString()}
            </option>
          {/each}
        </select>
      </div>
      
      {#if selectedProperty}
        <div class="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-6 shadow-sm" in:scale={{ start: 0.95, duration: 400, easing: elasticOut }}>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                <i class="fas fa-home text-xl"></i>
            </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800">{selectedProperty.location}</h3>
                <span class="text-sm text-gray-600 font-medium">{selectedProperty.type}</span>
            </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-extrabold text-sky-600">${selectedProperty.price.toLocaleString()}</div>
          </div>
            </div>
          <div class="flex items-center gap-2 text-gray-600">
            <i class="fas fa-map-marker-alt text-sky-500"></i>
            <span class="text-sm">{selectedProperty.address}</span>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Property Details Form -->
  {#if showForm && selectedProperty}
    <div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-8" in:scale={{ start: 0.98, duration: 500, easing: quintOut }}>
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-edit text-sky-600 text-xl"></i>
          <h2 class="text-2xl font-bold text-gray-800">Property Details Form</h2>
        </div>
        <p class="text-gray-600">Complete detailed information for <strong class="text-sky-700">{selectedProperty.location}</strong></p>
        <div class="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-sky-500 to-orange-500 rounded-full transition-all duration-500" style="width: 25%;"></div>
        </div>
      </div>
      
      <form method="POST" action="?/saveDetails" enctype="multipart/form-data" use:enhance={handleSubmit}>
        <input type="hidden" name="property_id" value={selectedPropertyId} />
        
        <div class="p-6 space-y-8">
          <!-- Basic Information -->
          <section class="border-b border-gray-200 pb-8">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center text-white shadow-md">
                <i class="fas fa-info-circle text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">Basic Information</h3>
                <p class="text-gray-600 text-sm">Essential property details and specifications</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label for="title" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-tag text-sky-600"></i>
                  Property Title
                </label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  placeholder="Enter custom title or leave blank for auto-generated"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="property_type" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-building text-sky-600"></i>
                  Property Type <span class="text-red-500">*</span>
                </label>
                <select 
                  id="property_type" 
                  name="property_type" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                >
                  <option value="">Select Property Type</option>
                  <option value="Single Family Home">🏠 Single Family Home</option>
                  <option value="Condominium">🏢 Condominium</option>
                  <option value="Townhouse">🏘️ Townhouse</option>
                  <option value="Apartment">🏠 Apartment</option>
                  <option value="Villa">🏖️ Villa</option>
                  <option value="Duplex">🏘️ Duplex</option>
                </select>
              </div>

              <div class="flex flex-col gap-2">
                <label for="year_built" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-calendar text-sky-600"></i>
                  Year Built <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="year_built" 
                  name="year_built" 
                  min="1800" 
                  max="2024" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="square_footage" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-ruler-combined text-sky-600"></i>
                  Square Footage <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="square_footage" 
                  name="square_footage" 
                  min="1" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="lot_size" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-expand-arrows-alt text-sky-600"></i>
                  Lot Size
                </label>
                <input 
                  type="text" 
                  id="lot_size" 
                  name="lot_size" 
                  placeholder="e.g., 0.35 acres"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="bedrooms" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-bed text-sky-600"></i>
                  Bedrooms <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="bedrooms" 
                  name="bedrooms" 
                  min="0" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="bathrooms" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-bath text-sky-600"></i>
                  Bathrooms <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="bathrooms" 
                  name="bathrooms" 
                  min="0" 
                  step="0.5" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div class="md:col-span-2 flex flex-col gap-2">
                <label for="overview_description" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-align-left text-sky-600"></i>
                  Property Overview <span class="text-red-500">*</span>
                </label>
                <textarea 
                  id="overview_description" 
                  name="overview_description" 
                  rows="6" 
                  required
                  placeholder="Describe the property's unique features, layout, and highlights..."
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all resize-y"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- Property Features -->
          <section class="border-b border-gray-200 pb-8">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center text-white shadow-md">
                <i class="fas fa-cog text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">Property Features</h3>
                <p class="text-gray-600 text-sm">Additional features and amenities</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label for="garage" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-car text-orange-600"></i>
                  Garage
                </label>
                <input 
                  type="text" 
                  id="garage" 
                  name="garage" 
                  placeholder="e.g., 2-car attached"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="heating" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-fire text-orange-600"></i>
                  Heating
                </label>
                <input 
                  type="text" 
                  id="heating" 
                  name="heating" 
                  placeholder="e.g., Central forced air"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="cooling" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-snowflake text-orange-600"></i>
                  Cooling
                </label>
                <input 
                  type="text" 
                  id="cooling" 
                  name="cooling" 
                  placeholder="e.g., Central air conditioning"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="architecture" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-drafting-compass text-orange-600"></i>
                  Architecture
                </label>
                <input 
                  type="text" 
                  id="architecture" 
                  name="architecture" 
                  placeholder="e.g., Modern contemporary"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="roof" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-home text-orange-600"></i>
                  Roof
                </label>
                <input 
                  type="text" 
                  id="roof" 
                  name="roof" 
                  placeholder="e.g., Tile"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="exterior" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-paint-brush text-orange-600"></i>
                  Exterior
                </label>
                <input 
                  type="text" 
                  id="exterior" 
                  name="exterior" 
                  placeholder="e.g., Stucco"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </section>

          <!-- Gallery & Media -->
          <section class="border-b border-gray-200 pb-8">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center text-white shadow-md">
                <i class="fas fa-images text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">Gallery & Media</h3>
                <p class="text-gray-600 text-sm">Upload images and media files</p>
              </div>
            </div>
            
            <div class="space-y-5">
              <div class="flex flex-col gap-2">
                <label for="gallery_images" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-camera text-sky-600"></i>
                  Gallery Images <span class="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  id="gallery_images" 
                  name="gallery_images" 
                  accept="image/*" 
                  multiple 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-600 file:text-white file:font-semibold hover:file:bg-sky-700 file:cursor-pointer"
                />
                <small class="text-gray-500 text-xs">Upload multiple images for the property gallery carousel</small>
              </div>

              <div class="flex flex-col gap-2">
                <label for="video_tour" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-video text-sky-600"></i>
                  Video Tour
                </label>
                <input 
                  type="file" 
                  id="video_tour" 
                  name="video_tour" 
                  accept="video/*"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-600 file:text-white file:font-semibold hover:file:bg-sky-700 file:cursor-pointer"
                />
                <small class="text-gray-500 text-xs">Upload a video tour of the property</small>
              </div>

              <div class="flex flex-col gap-2">
                <label for="virtual_tour_url" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-vr-cardboard text-sky-600"></i>
                  Virtual Tour URL
                </label>
                <input 
                  type="url" 
                  id="virtual_tour_url" 
                  name="virtual_tour_url" 
                  placeholder="https://..."
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </section>

          <!-- What's Nearby -->
          <section class="border-b border-gray-200 pb-8">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center text-white shadow-md">
                <i class="fas fa-map-marked-alt text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">What's Nearby</h3>
                <p class="text-gray-600 text-sm">Points of interest and amenities</p>
              </div>
            </div>
            
            <div class="space-y-6">
              <!-- Schools -->
              <div>
                <label for="nearby_schools" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <i class="fas fa-graduation-cap text-orange-600"></i>
                    Schools & Education
                  </label>
                <div class="dynamic-list space-y-3">
                  <div class="list-item flex gap-3">
                    <input 
                      type="text" 
                      id="nearby_schools" 
                      name="nearby_schools[]" 
                      placeholder="e.g., Cupertino High School - 1.2 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <button type="button" class="remove-item w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                    </div>
                  </div>
                <button type="button" class="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg" on:click={() => addItem('nearby_schools[]', 'School')}>+ Add School</button>
                </div>

              <!-- Shopping -->
              <div>
                <label for="nearby_shopping" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <i class="fas fa-shopping-cart text-orange-600"></i>
                    Shopping & Amenities
                  </label>
                <div class="dynamic-list space-y-3">
                  <div class="list-item flex gap-3">
                    <input 
                      type="text" 
                      id="nearby_shopping" 
                      name="nearby_shopping[]" 
                      placeholder="e.g., Valley Fair Shopping Center - 4.8 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <button type="button" class="remove-item w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                    </div>
                  </div>
                <button type="button" class="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg" on:click={() => addItem('nearby_shopping[]', 'Shopping')}>+ Add Shopping</button>
                </div>

              <!-- Companies -->
              <div>
                <label for="nearby_companies" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <i class="fas fa-briefcase text-orange-600"></i>
                    Companies & Offices
                  </label>
                <div class="dynamic-list space-y-3">
                  <div class="list-item flex gap-3">
                    <input 
                      type="text" 
                      id="nearby_companies" 
                      name="nearby_companies[]" 
                      placeholder="e.g., Apple Campus - 5.2 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <button type="button" class="remove-item w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                    </div>
                  </div>
                <button type="button" class="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg" on:click={() => addItem('nearby_companies[]', 'Company')}>+ Add Company</button>
                </div>

              <!-- Transportation -->
              <div>
                <label for="nearby_transport" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <i class="fas fa-subway text-orange-600"></i>
                    Transportation
                  </label>
                <div class="dynamic-list space-y-3">
                  <div class="list-item flex gap-3">
                    <input 
                      type="text" 
                      id="nearby_transport" 
                      name="nearby_transport[]" 
                      placeholder="e.g., San Jose International Airport - 12.5 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <button type="button" class="remove-item w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                    </div>
                  </div>
                <button type="button" class="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg" on:click={() => addItem('nearby_transport[]', 'Transport')}>+ Add Transport</button>
              </div>
            </div>
          </section>

          <!-- Location -->
          <section>
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center text-white shadow-md">
                <i class="fas fa-map-marker-alt text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">Location</h3>
                <p class="text-gray-600 text-sm">Map information</p>
              </div>
            </div>
           
            <div class="flex flex-col gap-2">
              <label for="map_embed_url" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i class="fas fa-map text-sky-600"></i>
                Google Maps Embed URL <span class="text-red-500">*</span>
                </label>
              <input 
                type="url" 
                id="map_embed_url" 
                name="map_embed_url" 
                required
                placeholder="https://www.google.com/maps/embed?..."
                autocomplete="off"
                class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
              <small class="text-gray-500 text-xs">Get embed URL from Google Maps → Share → Embed a map</small>
            </div>
          </section>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            <i class="fas fa-save text-lg"></i>
            {loading ? 'Saving...' : 'Save Property Details'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Existing Property Details -->
  {#if data.existingDetails.length > 0}
    <div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-list text-sky-600 text-xl"></i>
          <h2 class="text-2xl font-semibold text-gray-800">Existing Property Details</h2>
        </div>
        <p class="text-gray-600">Manage and edit existing property detail records</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {#each data.existingDetails as details, i (details.id)}
          <div 
            class="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            in:scale={{ start: 0.9, duration: 500, delay: staggerDelay(i), easing: elasticOut }}
          >
            <div class="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-orange-50">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0">
                <i class="fas fa-file-alt"></i>
              </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-gray-800 truncate">{details.title || `${details.location} - ${details.type}`}</h4>
                  <span class="text-xs text-gray-600 truncate block">{details.location} - {details.type}</span>
            </div>
              </div>
              <div class="px-3 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0
                {details.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 
                 details.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                 'bg-gray-100 text-gray-700'}">
                {details.status}
              </div>
            </div>
            
            <div class="p-5">
              <div class="flex items-center gap-2 text-gray-500 text-xs mb-4">
                <i class="fas fa-clock text-sky-500"></i>
                  <span>Updated {new Date(details.updated_at).toLocaleDateString()}</span>
              </div>
              
              <div class="flex gap-3">
              <button 
                type="button" 
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
                on:click={() => {
                  selectedPropertyId = details.property_id.toString();
                  selectProperty();
                }}
                  aria-label="Edit details"
              >
                  <i class="fas fa-edit"></i>
                  Edit
              </button>
              <button 
                type="button" 
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all hover:scale-105"
                on:click={() => deleteDetails(details.id)}
                  aria-label="Delete"
              >
                  <i class="fas fa-trash"></i>
                Delete
              </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.1); opacity: 0.15; }
  }

  .animate-pulse-slow {
    animation: pulse-slow 8s infinite ease-in-out;
  }
  
  .delay-300 {
    animation-delay: 300ms;
  }
</style>

