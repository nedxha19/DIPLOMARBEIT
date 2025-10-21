<script>
  import { enhance } from '$app/forms';
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
  <!-- Animated Hero Header -->
  <header 
    class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-orange-500 p-8 mb-8 shadow-2xl shadow-sky-500/30"
    in:fly={{ y: -30, duration: 600, easing: quintOut }}
  >
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6bS0yLTJ2Mmg0di00aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
    
    <div class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div class="flex items-start gap-6">
        <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
          <i class="fas fa-plus-circle text-4xl text-white"></i>
        </div>
        
        <div>
          <h1 class="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Add New Property
          </h1>
          <p class="text-sky-50 text-lg font-medium">
            Expand your real estate portfolio with detailed property information
          </p>
        </div>
      </div>
      
      <div class="flex gap-3">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-2">
          <i class="fas fa-upload text-white"></i>
          <span class="text-white text-sm font-medium">Quick Add</span>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-2">
          <i class="fas fa-shield-alt text-white"></i>
          <span class="text-white text-sm font-medium">Secure</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Progress Steps -->
  <div 
    class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
    in:fly={{ y: 20, duration: 500, delay: 200 }}
  >
    <div class="flex items-center justify-center gap-8">
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
                class="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 {currentStep >= item.step 
                  ? 'bg-gradient-to-br from-sky-500 to-orange-500 text-white shadow-lg shadow-sky-500/30 scale-110' 
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
                <div class="absolute inset-0 rounded-full bg-sky-400 animate-ping opacity-30"></div>
              {/if}
            </div>
            
            <!-- Step Label -->
            <span 
              class="text-sm font-semibold whitespace-nowrap transition-colors duration-300 {currentStep >= item.step ? 'text-sky-600' : 'text-gray-400'}"
            >
              {item.label}
            </span>
          </div>
          
          <!-- Connector Line -->
          {#if i < 2}
            <div 
              class="h-1 w-24 rounded-full transition-all duration-500 {currentStep > item.step ? 'bg-gradient-to-r from-sky-500 to-orange-500' : 'bg-gray-200'}"
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
      class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
      in:fly={{ y: 20, duration: 500, delay: 400 }}
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-sky-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <i class="fas fa-camera text-white text-lg"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">Property Image</h3>
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
        
        <div class="border-2 border-dashed rounded-2xl p-12 transition-all duration-300 {formData.image 
          ? 'border-green-400 bg-green-50' 
          : 'border-gray-300 hover:border-sky-400 bg-gray-50 hover:bg-sky-50'
        }">
          {#if formData.image}
            <div 
              class="flex flex-col items-center gap-4"
              in:scale={{ duration: 400, easing: elasticOut }}
            >
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check-circle text-5xl text-green-500"></i>
              </div>
              <div class="text-center">
                <p class="text-xl font-semibold text-green-700 mb-1">{formData.image.name}</p>
                <p class="text-sm text-green-600">Click to change image</p>
              </div>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-4">
              <div class="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i class="fas fa-cloud-upload-alt text-5xl text-sky-500"></i>
              </div>
              <div class="text-center">
                <p class="text-xl font-semibold text-gray-700 mb-1">Choose property image</p>
                <p class="text-sm text-gray-500">JPG, PNG (max 5MB) • Drag & drop or click to browse</p>
              </div>
            </div>
          {/if}
        </div>
      </label>
    </section>

    <!-- Property Details Section -->
    <section 
      class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
      in:fly={{ y: 20, duration: 500, delay: 500 }}
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-sky-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <i class="fas fa-info-circle text-white text-lg"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">Property Details</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Location -->
        <div class="space-y-2">
          <label for="location" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-map-marker-alt text-sky-500"></i> Location *
          </label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            bind:value={formData.location}
            required 
            placeholder="e.g., Manhattan, New York"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Property Type -->
        <div class="space-y-2">
          <label for="type" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-building text-sky-500"></i> Property Type *
          </label>
          <select 
            id="type" 
            name="type" 
            bind:value={formData.type} 
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          >
            <option value="">Select Property Type</option>
            <option value="Apartment">🏢 Apartment</option>
            <option value="House">🏠 House</option>
            <option value="Condo">🏘️ Condominium</option>
            <option value="Townhouse">🏘️ Townhouse</option>
            <option value="Villa">🏖️ Villa</option>
            <option value="Studio">🚪 Studio</option>
          </select>
        </div>

        <!-- Price -->
        <div class="space-y-2">
          <label for="price" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-dollar-sign text-sky-500"></i> Price (USD) *
          </label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            bind:value={formData.price}
            step="0.01" 
            required 
            placeholder="0.00"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Bedrooms -->
        <div class="space-y-2">
          <label for="bedrooms" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-bed text-sky-500"></i> Bedrooms *
          </label>
          <input 
            type="number" 
            id="bedrooms" 
            name="bedrooms" 
            bind:value={formData.bedrooms}
            required 
            min="0" 
            placeholder="0"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Bathrooms -->
        <div class="space-y-2">
          <label for="bathrooms" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-bath text-sky-500"></i> Bathrooms *
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
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Square Footage -->
        <div class="space-y-2">
          <label for="square_foot" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-ruler-combined text-sky-500"></i> Square Footage *
          </label>
          <input 
            type="number" 
            id="square_foot" 
            name="square_foot" 
            bind:value={formData.square_foot}
            required 
            min="0" 
            placeholder="0"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          />
        </div>

        <!-- Address - Full Width -->
        <div class="md:col-span-2 space-y-2">
          <label for="address" class="block text-sm font-semibold text-gray-700">
            <i class="fas fa-location-dot text-sky-500"></i> Full Address
          </label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            bind:value={formData.address}
            placeholder="Full street address (optional)"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300"
          />
        </div>
      </div>
    </section>

    <!-- Submit Section -->
    <div 
      class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center"
      in:fly={{ y: 20, duration: 500, delay: 600 }}
    >
      <button 
        type="submit" 
        class="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-sky-600 to-orange-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 overflow-hidden"
      >
        <!-- Shimmer effect -->
        <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <i class="fas fa-plus-circle text-2xl relative z-10"></i>
        <span class="relative z-10">Add Property to Portfolio</span>
        <i class="fas fa-arrow-right group-hover:translate-x-2 transition-transform duration-300 relative z-10"></i>
      </button>
    </div>
  </form>

  <!-- Success Message -->
  {#if form}
    <div 
      class="fixed top-24 right-8 bg-green-50 border-2 border-green-400 rounded-2xl p-6 shadow-2xl z-50 max-w-md"
      in:fly={{ x: 100, duration: 400 }}
      out:fly={{ x: 100, duration: 300 }}
    >
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-3xl text-green-500"></i>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-green-900 mb-1">Property Added Successfully!</h3>
          <p class="text-sm text-green-700">The property has been added to your portfolio.</p>
        </div>
      </div>
    </div>
  {/if}
</div>
