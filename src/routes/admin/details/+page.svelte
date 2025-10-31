<script>
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
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
    newItem.innerHTML = `<input type="text" name="${name}" placeholder="e.g., ${placeholder} - distance" class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all" /><button type="button" class="remove-item w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all">×</button>`;
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
  <AdminHeader 
    title="Property Details Management"
    subtitle="Create comprehensive property listings with detailed information"
    icon="clipboard-list"
    stats={[
      { icon: 'home', value: data.properties.length, label: 'Properties' },
      { icon: 'file-alt', value: data.existingDetails.length, label: 'Detailed' }
    ]}
  />

  <!-- Property Selection Section -->
  <div 
    class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden"
    in:fly={{ y: -20, duration: 600, delay: 100, easing: quintOut }}
  >
    <div class="p-5 border-b border-gray-200">
      <div class="flex items-center gap-3 mb-1.5">
        <i class="fas fa-search text-slate-700 text-lg"></i>
        <h2 class="text-xl font-semibold text-gray-800">Select Property to Manage</h2>
      </div>
      <p class="text-gray-600 text-sm">Choose a property to create or edit detailed information</p>
    </div>
    
    <div class="p-5">
      <div class="relative mb-5">
        <i class="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <select 
          bind:value={selectedPropertyId} 
          on:change={selectProperty}
          class="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-800 bg-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
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
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-5" in:scale={{ start: 0.95, duration: 400, easing: elasticOut }}>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                <i class="fas fa-home"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800">{selectedProperty.location}</h3>
                <span class="text-sm text-gray-600 font-medium">{selectedProperty.type}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-slate-900">${selectedProperty.price.toLocaleString()}</div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <i class="fas fa-map-marker-alt text-slate-600"></i>
            <span class="text-sm">{selectedProperty.address}</span>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Property Details Form -->
  {#if showForm && selectedProperty}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6" in:scale={{ start: 0.98, duration: 500, easing: quintOut }}>
      <div class="bg-slate-50 p-5 border-b border-gray-200">
        <div class="flex items-center gap-3 mb-1.5">
          <i class="fas fa-edit text-slate-700 text-lg"></i>
          <h2 class="text-xl font-bold text-gray-800">Property Details Form</h2>
        </div>
        <p class="text-gray-600 text-sm">Complete detailed information for <strong class="text-slate-900">{selectedProperty.location}</strong></p>
      </div>
      
      <form method="POST" action="?/saveDetails" enctype="multipart/form-data" use:enhance={handleSubmit}>
        <input type="hidden" name="property_id" value={selectedPropertyId} />
        
        <div class="p-5 space-y-6">
          <!-- Basic Information -->
          <section class="border-b border-gray-200 pb-6">
            <div class="flex items-start gap-3 mb-4">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-info-circle text-slate-700"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-0.5">Basic Information</h3>
                <p class="text-gray-600 text-sm">Essential property details and specifications</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label for="title" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-tag text-slate-600"></i>
                  Property Title
                </label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  placeholder="Enter custom title or leave blank for auto-generated"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="property_type" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-building text-slate-600"></i>
                  Property Type <span class="text-red-500">*</span>
                </label>
                <select 
                  id="property_type" 
                  name="property_type" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                >
                  <option value="">Select Property Type</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Condominium">Condominium</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Duplex">Duplex</option>
                </select>
              </div>

              <div class="flex flex-col gap-2">
                <label for="year_built" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-calendar text-slate-600"></i>
                  Year Built <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="year_built" 
                  name="year_built" 
                  min="1800" 
                  max="2025" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="square_footage" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-ruler-combined text-slate-600"></i>
                  Square Footage <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="square_footage" 
                  name="square_footage" 
                  min="1" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="lot_size" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-expand-arrows-alt text-slate-600"></i>
                  Lot Size
                </label>
                <input 
                  type="text" 
                  id="lot_size" 
                  name="lot_size" 
                  placeholder="e.g., 0.35 acres"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="bedrooms" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-bed text-slate-600"></i>
                  Bedrooms <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  id="bedrooms" 
                  name="bedrooms" 
                  min="0" 
                  required
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="bathrooms" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-bath text-slate-600"></i>
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
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="md:col-span-2 flex flex-col gap-2">
                <label for="overview_description" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-align-left text-slate-600"></i>
                  Property Overview <span class="text-red-500">*</span>
                </label>
                <textarea 
                  id="overview_description" 
                  name="overview_description" 
                  rows="5" 
                  required
                  placeholder="Describe the property's unique features, layout, and highlights..."
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all resize-y"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- Property Features -->
          <section class="border-b border-gray-200 pb-6">
            <div class="flex items-start gap-3 mb-4">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-cog text-slate-700"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-0.5">Property Features</h3>
                <p class="text-gray-600 text-sm">Additional features and amenities</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label for="garage" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-car text-slate-600"></i>
                  Garage
                </label>
                <input 
                  type="text" 
                  id="garage" 
                  name="garage" 
                  placeholder="e.g., 2-car attached"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="heating" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-fire text-slate-600"></i>
                  Heating
                </label>
                <input 
                  type="text" 
                  id="heating" 
                  name="heating" 
                  placeholder="e.g., Central forced air"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="cooling" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-snowflake text-slate-600"></i>
                  Cooling
                </label>
                <input 
                  type="text" 
                  id="cooling" 
                  name="cooling" 
                  placeholder="e.g., Central air conditioning"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="architecture" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-drafting-compass text-slate-600"></i>
                  Architecture
                </label>
                <input 
                  type="text" 
                  id="architecture" 
                  name="architecture" 
                  placeholder="e.g., Modern contemporary"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="roof" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-home text-slate-600"></i>
                  Roof
                </label>
                <input 
                  type="text" 
                  id="roof" 
                  name="roof" 
                  placeholder="e.g., Tile"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label for="exterior" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-paint-brush text-slate-600"></i>
                  Exterior
                </label>
                <input 
                  type="text" 
                  id="exterior" 
                  name="exterior" 
                  placeholder="e.g., Stucco"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>
            </div>
          </section>

          <!-- Gallery & Media -->
          <section class="border-b border-gray-200 pb-6">
            <div class="flex items-start gap-3 mb-4">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-images text-slate-700"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-0.5">Gallery & Media</h3>
                <p class="text-gray-600 text-sm">Upload images and media files</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <label for="gallery_images" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-camera text-slate-600"></i>
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
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:font-semibold hover:file:bg-slate-800 file:cursor-pointer"
                />
                <small class="text-gray-500 text-xs">Upload multiple images for the property gallery carousel</small>
              </div>

              <div class="flex flex-col gap-2">
                <label for="video_tour" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-video text-slate-600"></i>
                  Video Tour
                </label>
                <input 
                  type="file" 
                  id="video_tour" 
                  name="video_tour" 
                  accept="video/*"
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:font-semibold hover:file:bg-slate-800 file:cursor-pointer"
                />
                <small class="text-gray-500 text-xs">Upload a video tour of the property</small>
              </div>

              <div class="flex flex-col gap-2">
                <label for="virtual_tour_url" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <i class="fas fa-vr-cardboard text-slate-600"></i>
                  Virtual Tour URL
                </label>
                <input 
                  type="url" 
                  id="virtual_tour_url" 
                  name="virtual_tour_url" 
                  placeholder="https://..."
                  autocomplete="off"
                  class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                />
              </div>
            </div>
          </section>

          <!-- What's Nearby - Simplified -->
          <section class="border-b border-gray-200 pb-6">
            <div class="flex items-start gap-3 mb-4">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-map-marked-alt text-slate-700"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-0.5">What's Nearby</h3>
                <p class="text-gray-600 text-sm">Points of interest and amenities</p>
              </div>
            </div>
            
            <div class="space-y-5">
              <!-- Schools -->
              <div>
                <label for="nearby_schools" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <i class="fas fa-graduation-cap text-slate-600"></i>
                  Schools & Education
                </label>
                <div class="dynamic-list space-y-2">
                  <div class="list-item flex gap-2">
                    <input 
                      type="text" 
                      id="nearby_schools" 
                      name="nearby_schools[]" 
                      placeholder="e.g., Cupertino High School - 1.2 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                    />
                    <button type="button" class="remove-item w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                  </div>
                </div>
                <button type="button" class="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all text-sm" on:click={() => addItem('nearby_schools[]', 'School')}>+ Add School</button>
              </div>

              <!-- Shopping -->
              <div>
                <label for="nearby_shopping" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <i class="fas fa-shopping-cart text-slate-600"></i>
                  Shopping & Amenities
                </label>
                <div class="dynamic-list space-y-2">
                  <div class="list-item flex gap-2">
                    <input 
                      type="text" 
                      id="nearby_shopping" 
                      name="nearby_shopping[]" 
                      placeholder="e.g., Valley Fair Shopping Center - 4.8 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                    />
                    <button type="button" class="remove-item w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                  </div>
                </div>
                <button type="button" class="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all text-sm" on:click={() => addItem('nearby_shopping[]', 'Shopping')}>+ Add Shopping</button>
              </div>

              <!-- Companies -->
              <div>
                <label for="nearby_companies" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <i class="fas fa-briefcase text-slate-600"></i>
                  Companies & Offices
                </label>
                <div class="dynamic-list space-y-2">
                  <div class="list-item flex gap-2">
                    <input 
                      type="text" 
                      id="nearby_companies" 
                      name="nearby_companies[]" 
                      placeholder="e.g., Apple Campus - 5.2 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                    />
                    <button type="button" class="remove-item w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                  </div>
                </div>
                <button type="button" class="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all text-sm" on:click={() => addItem('nearby_companies[]', 'Company')}>+ Add Company</button>
              </div>

              <!-- Transportation -->
              <div>
                <label for="nearby_transport" class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <i class="fas fa-subway text-slate-600"></i>
                  Transportation
                </label>
                <div class="dynamic-list space-y-2">
                  <div class="list-item flex gap-2">
                    <input 
                      type="text" 
                      id="nearby_transport" 
                      name="nearby_transport[]" 
                      placeholder="e.g., San Jose International Airport - 12.5 miles"
                      autocomplete="off"
                      class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
                    />
                    <button type="button" class="remove-item w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all" on:click={(e) => removeItem(e.target)} aria-label="Remove">×</button>
                  </div>
                </div>
                <button type="button" class="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all text-sm" on:click={() => addItem('nearby_transport[]', 'Transport')}>+ Add Transport</button>
              </div>
            </div>
          </section>

          <!-- Location -->
          <section>
            <div class="flex items-start gap-3 mb-4">
              <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-map-marker-alt text-slate-700"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-0.5">Location</h3>
                <p class="text-gray-600 text-sm">Map information</p>
              </div>
            </div>
           
            <div class="flex flex-col gap-2">
              <label for="map_embed_url" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i class="fas fa-map text-slate-600"></i>
                Google Maps Embed URL <span class="text-red-500">*</span>
              </label>
              <input 
                type="url" 
                id="map_embed_url" 
                name="map_embed_url" 
                required
                placeholder="https://www.google.com/maps/embed?..."
                autocomplete="off"
                class="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition-all"
              />
              <small class="text-gray-500 text-xs">Get embed URL from Google Maps → Share → Embed a map</small>
            </div>
          </section>
        </div>

        <div class="p-5 border-t border-gray-200 flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-lg shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i class="fas fa-save"></i>
            {loading ? 'Saving...' : 'Save Property Details'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Existing Property Details -->
  {#if data.existingDetails.length > 0}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-5 border-b border-gray-200">
        <div class="flex items-center gap-3 mb-1.5">
          <i class="fas fa-list text-slate-700 text-lg"></i>
          <h2 class="text-xl font-semibold text-gray-800">Existing Property Details</h2>
        </div>
        <p class="text-gray-600 text-sm">Manage and edit existing property detail records</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
        {#each data.existingDetails as details, i (details.id)}
          <div 
            class="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            in:scale={{ start: 0.9, duration: 500, delay: staggerDelay(i), easing: elasticOut }}
          >
            <div class="flex items-center justify-between p-4 border-b border-slate-200">
              <div class="flex items-center gap-2.5 flex-1 min-w-0">
                <div class="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <i class="fas fa-file-alt text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-gray-800 truncate text-sm">{details.title || `${details.location} - ${details.type}`}</h4>
                  <span class="text-xs text-gray-600 truncate block">{details.location} - {details.type}</span>
                </div>
              </div>
              <div class="px-2.5 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0
                {details.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 
                 details.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                 'bg-gray-100 text-gray-700'}">
                {details.status}
              </div>
            </div>
            
            <div class="p-4">
              <div class="flex items-center gap-2 text-gray-500 text-xs mb-3">
                <i class="fas fa-clock text-slate-600"></i>
                <span>Updated {new Date(details.updated_at).toLocaleDateString()}</span>
              </div>
              
              <div class="flex gap-2">
                <button 
                  type="button" 
                  class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all text-sm"
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
                  class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-sm"
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
