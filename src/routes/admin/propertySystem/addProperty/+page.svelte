<script>
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import { fly, scale, fade } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  
  let { form, data } = $props();
  
  let currentStep = $state(1);
  let formData = $state({
    image: null,
    location: '',
    type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_foot: '',
    address: ''
  });
  
  $effect(() => {
    if (formData.image) {
      currentStep = Math.max(currentStep, 2);
    }
    if (formData.location && formData.type && formData.price && formData.bedrooms && formData.bathrooms && formData.square_foot) {
      currentStep = Math.max(currentStep, 3);
    }
  });
  
  function handleFileChange(event) {
    formData.image = event.target.files[0];
  }
  
  function handleSubmit() {
    return async ({ update }) => {
      formData = {
        image: null,
        location: '',
        type: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        square_foot: '',
        address: ''
      };
      currentStep = 1;
      await update();
    };
  }
</script>

<div class="min-h-screen pb-12">
  <AdminHeader 
    title="Add New Property"
    subtitle="Expand your real estate portfolio with detailed property information"
    icon="plus-circle"
  />

  <!-- Progress Steps -->
  <div 
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
    in:fly={{ y: 20, duration: 500, delay: 200 }}
  >
    <div class="flex items-center justify-center gap-6">
      {#each [
        { step: 1, label: 'Upload Image', icon: 'camera' },
        { step: 2, label: 'Property Details', icon: 'info-circle' },
        { step: 3, label: 'Submit & Save', icon: 'check-circle' }
      ] as item, i}
        <div class="flex items-center gap-4">
          <div class="flex flex-col items-center gap-2 relative group">
            <!-- Step Circle -->
            <div class="relative">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 {currentStep >= item.step 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-400'}"
                in:scale={{ duration: 400, delay: 300 + (i * 100), easing: elasticOut }}
              >
                {#if currentStep > item.step}
                  <i class="fas fa-check"></i>
                {:else}
                  <i class="fas fa-{item.icon}"></i>
                {/if}
              </div>
              
              <!-- Pulse animation for current step -->
              {#if currentStep === item.step}
                <div class="absolute inset-0 rounded-full bg-slate-900 animate-ping opacity-20"></div>
              {/if}
            </div>
            
            <!-- Step Label -->
            <span 
              class="text-xs font-semibold whitespace-nowrap transition-colors duration-300 {currentStep >= item.step ? 'text-slate-900' : 'text-gray-400'}"
            >
              {item.label}
            </span>
          </div>
          
          <!-- Connector Line -->
          {#if i < 2}
            <div 
              class="h-0.5 w-20 rounded-full transition-all duration-500 {currentStep > item.step ? 'bg-slate-900' : 'bg-gray-200'}"
            ></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Form Container -->
  <form 
    action="?/upload" 
    method="POST" 
    use:enhance={handleSubmit} 
    enctype="multipart/form-data"
    class="max-w-5xl mx-auto space-y-6"
  >
    <!-- Image Upload Section -->
    <section 
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      in:fly={{ y: 20, duration: 500, delay: 400 }}
    >
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <i class="fas fa-camera text-slate-700"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900">Property Image</h3>
      </div>
      
      <label 
        for="image" 
        class="block relative group cursor-pointer"
      >
        <input 
          type="file" 
          id="image" 
          name="image" 
          required 
          accept="image/*"
          onchange={handleFileChange}
          class="hidden"
        />
        
        <div class="border-2 border-dashed rounded-xl p-10 transition-all duration-300 {formData.image 
          ? 'border-green-400 bg-green-50' 
          : 'border-gray-300 hover:border-slate-400 bg-gray-50 hover:bg-slate-50'
        }">
          {#if formData.image}
            <div 
              class="flex flex-col items-center gap-4"
              in:scale={{ duration: 400, easing: elasticOut }}
            >
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check-circle text-4xl text-green-500"></i>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-green-700 mb-1">{formData.image.name}</p>
                <p class="text-sm text-green-600">Click to change image</p>
              </div>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-4">
              <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <i class="fas fa-cloud-upload-alt text-4xl text-slate-600"></i>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-gray-700 mb-1">Choose property image</p>
                <p class="text-sm text-gray-500">JPG, PNG (max 5MB) • Drag & drop or click to browse</p>
              </div>
            </div>
          {/if}
        </div>
      </label>
    </section>

    <!-- Property Details Section -->
    <section 
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      in:fly={{ y: 20, duration: 500, delay: 500 }}
    >
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <i class="fas fa-info-circle text-slate-700"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900">Property Details</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Location -->
        <div class="space-y-2">
          <label for="location" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-map-marker-alt text-slate-600"></i> Location *
          </label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            bind:value={formData.location}
            required 
            placeholder="e.g., Manhattan, New York"
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Property Type -->
        <div class="space-y-2">
          <label for="type" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-building text-slate-600"></i> Property Type *
          </label>
          <select 
            id="type" 
            name="type" 
            bind:value={formData.type} 
            required
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          >
            <option value="">Select Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condominium</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
          </select>
        </div>

        <!-- Price -->
        <div class="space-y-2">
          <label for="price" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-dollar-sign text-slate-600"></i> Price (USD) *
          </label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            bind:value={formData.price}
            step="0.01" 
            required 
            placeholder="0.00"
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Bedrooms -->
        <div class="space-y-2">
          <label for="bedrooms" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-bed text-slate-600"></i> Bedrooms *
          </label>
          <input 
            type="number" 
            id="bedrooms" 
            name="bedrooms" 
            bind:value={formData.bedrooms}
            required 
            min="0" 
            placeholder="0"
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Bathrooms -->
        <div class="space-y-2">
          <label for="bathrooms" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-bath text-slate-600"></i> Bathrooms *
          </label>
          <input 
            type="number" 
            id="bathrooms" 
            name="bathrooms" 
            bind:value={formData.bathrooms}
            required 
            min="0" 
            step="0.5" 
            placeholder="0"
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Square Footage -->
        <div class="space-y-2">
          <label for="square_foot" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-ruler-combined text-slate-600"></i> Square Footage *
          </label>
          <input 
            type="number" 
            id="square_foot" 
            name="square_foot" 
            bind:value={formData.square_foot}
            required 
            min="0" 
            placeholder="0"
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Address - Full Width -->
        <div class="md:col-span-2 space-y-2">
          <label for="address" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-location-dot text-slate-600"></i> Full Address
          </label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            bind:value={formData.address}
            placeholder="Full street address (optional)"
            class="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-100 outline-none transition-all duration-300"
          />
        </div>
      </div>
    </section>

    <!-- Submit Section -->
    <div 
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
      in:fly={{ y: 20, duration: 500, delay: 600 }}
    >
      <button 
        type="submit" 
        class="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-base font-semibold rounded-lg shadow-sm hover:bg-slate-800 hover:shadow-md transition-all duration-300"
      >
        <i class="fas fa-plus-circle"></i>
        <span>Add Property to Portfolio</span>
      </button>
    </div>
  </form>

  <!-- Success Message -->
  {#if form}
    <div 
      class="fixed top-24 right-8 bg-green-50 border-2 border-green-400 rounded-xl p-5 shadow-xl z-50 max-w-md"
      in:fly={{ x: 100, duration: 400 }}
      out:fly={{ x: 100, duration: 300 }}
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-2xl text-green-500"></i>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-base font-bold text-green-900 mb-1">Property Added Successfully!</h3>
          <p class="text-sm text-green-700">The property has been added to your portfolio.</p>
        </div>
      </div>
    </div>
  {/if}
</div>
