<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  
  export let data;
  
  let searchQuery = '';
  let propertyType = '';
  let priceRange = '';
  let bedrooms = '';
  let currentTestimonial = 0;
  let statsVisible = false;
  
  const propertyTypes = ['All Types', 'House', 'Apartment', 'Condo', 'Villa', 'Townhouse'];
  const priceRanges = ['Any Price', '$0 - $500k', '$500k - $1M', '$1M - $2M', '$2M+'];
  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  
  const howItWorks = [
    {
      step: '01',
      title: 'Search & Discover',
      description: 'Browse thousands of verified properties with advanced filters tailored to your needs',
      icon: 'search'
    },
    {
      step: '02',
      title: 'Schedule Viewing',
      description: 'Book virtual or in-person property tours at your convenience with our expert agents',
      icon: 'calendar-check'
    },
    {
      step: '03',
      title: 'Make an Offer',
      description: 'Get professional guidance on pricing, negotiations, and making competitive offers',
      icon: 'file-contract'
    },
    {
      step: '04',
      title: 'Close the Deal',
      description: 'We handle all paperwork and legal processes to ensure a smooth, secure transaction',
      icon: 'key'
    }
  ];
  
  const marketInsights = [
    {
      title: '2024 Market Trends: What Buyers Need to Know',
      category: 'Market Analysis',
      date: 'Nov 15, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
      excerpt: 'Discover the latest trends shaping the real estate market this year.'
    },
    {
      title: 'First-Time Home Buyer Guide',
      category: 'Buyer Tips',
      date: 'Nov 10, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500',
      excerpt: 'Everything you need to know before purchasing your first home.'
    },
    {
      title: 'Investment Property ROI Calculator',
      category: 'Investment',
      date: 'Nov 5, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
      excerpt: 'Learn how to calculate and maximize your real estate investment returns.'
    }
  ];
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      location: 'Manhattan, NY',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'The team at Houseo made my home buying experience seamless. Their market knowledge and professionalism exceeded all expectations.'
    },
    {
      name: 'Michael Chen',
      role: 'Property Investor',
      location: 'Los Angeles, CA',
      image: 'https://i.pravatar.cc/150?img=6',
      rating: 5,
      text: 'Outstanding service! They helped me build a diverse property portfolio with excellent ROI. Highly recommend their investment expertise.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'First-time Buyer',
      location: 'Chicago, IL',
      image: 'https://i.pravatar.cc/150?img=7',
      rating: 5,
      text: 'As a first-time buyer, I was nervous. The Houseo team guided me through every step with patience and expertise. Found my dream home!'
    }
  ];
  
  const trustBadges = [
    { name: 'BBB Accredited', icon: 'certificate' },
    { name: 'Licensed & Insured', icon: 'shield-check' },
    { name: 'Award Winning', icon: 'award' },
    { name: 'Customer Verified', icon: 'star' }
  ];
  
  onMount(() => {
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }, 6000);
    
    // Intersection observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statsVisible = true;
          }
        });
      },
      { threshold: 0.3 }
    );
    
    const statsSection = document.querySelector('#stats-section');
    if (statsSection) observer.observe(statsSection);
    
    return () => {
      clearInterval(testimonialInterval);
      observer.disconnect();
    };
  });
  
  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (propertyType && propertyType !== 'All Types') params.set('type', propertyType);
    if (priceRange && priceRange !== 'Any Price') params.set('price', priceRange);
    if (bedrooms && bedrooms !== 'Any') params.set('bedrooms', bedrooms);
    
    window.location.href = `/Properties?${params.toString()}`;
  }
  
  function staggerDelay(index) {
    return index * 100;
  }
</script>

<svelte:head>
  <title>Houseo - Find Your Dream Home | Premium Real Estate</title>
  <meta name="description" content="Discover exceptional properties with Houseo. Expert agents, verified listings, and comprehensive real estate services." />
</svelte:head>

<!-- Hero Section with Enhanced Search -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
  <!-- Background with parallax effect -->
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920')] bg-cover bg-center opacity-20"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900"></div>
  </div>
  
  <!-- Floating elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float-delayed"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center w-full">
    <!-- Trust badges -->
    <div class="flex flex-wrap items-center justify-center gap-6 mb-8" in:fade={{ delay: 100, duration: 600 }}>
      {#each trustBadges as badge}
        <div class="flex items-center gap-2 text-slate-400 text-sm">
          <i class="fas fa-{badge.icon} text-slate-500"></i>
          <span>{badge.name}</span>
        </div>
      {/each}
    </div>
    
    <!-- Main heading -->
    <div in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
        Discover Your Perfect
        <span class="relative inline-block mt-2">
          <span class="relative z-10 text-white">
            Home Today
          </span>
          <span class="absolute -bottom-2 left-0 right-0 h-3 bg-white/20 blur-sm"></span>
        </span>
      </h1>
      <p class="text-xl sm:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
        Explore premium properties with expert guidance every step of the way
      </p>
      <p class="text-sm text-slate-400 mb-12">
        Over <strong class="text-white">{data.stats.totalProperties}+</strong> verified listings • <strong class="text-white">{data.stats.happyClients}+</strong> happy clients • <strong class="text-white">{data.stats.yearsExperience}</strong> years experience
      </p>
    </div>
    
    <!-- Enhanced search card -->
    <div 
      class="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
      in:fly={{ y: 50, duration: 800, delay: 400, easing: quintOut }}
    >
      <form on:submit={handleSearch} class="space-y-4">
        <!-- Primary filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2 relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="City, neighborhood, address, or ZIP"
              class="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
            />
          </div>
          
          <div class="relative">
            <i class="fas fa-home absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <select
              bind:value={propertyType}
              class="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all appearance-none bg-white"
            >
              {#each propertyTypes as type}
                <option value={type}>{type}</option>
              {/each}
            </select>
          </div>
          
          <div class="relative">
            <i class="fas fa-dollar-sign absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <select
              bind:value={priceRange}
              class="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all appearance-none bg-white"
            >
              {#each priceRanges as range}
                <option value={range}>{range}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <!-- Secondary filters -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="relative">
            <i class="fas fa-bed absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <select
              bind:value={bedrooms}
              class="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all appearance-none bg-white"
            >
              {#each bedroomOptions as option}
                <option value={option}>Beds: {option}</option>
              {/each}
            </select>
          </div>
          
          <div class="col-span-2 md:col-span-3">
            <button
              type="submit"
              class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              <i class="fas fa-search mr-2"></i>
              Search Properties
            </button>
          </div>
        </div>
        
        <!-- Quick links -->
        <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 pt-2">
          <a href="/Properties?type=House" class="hover:text-slate-900 transition-colors">Houses</a>
          <span class="text-slate-300">•</span>
          <a href="/Properties?type=Apartment" class="hover:text-slate-900 transition-colors">Apartments</a>
          <span class="text-slate-300">•</span>
          <a href="/Properties?type=Condo" class="hover:text-slate-900 transition-colors">Condos</a>
          <span class="text-slate-300">•</span>
          <a href="/Properties?type=Villa" class="hover:text-slate-900 transition-colors">Villas</a>
        </div>
      </form>
    </div>
  </div>
</section>

<!-- Live Statistics -->
<section id="stats-section" class="py-16 bg-white border-y border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {#each [
        { value: data.stats.totalProperties, label: 'Active Listings', icon: 'home', suffix: '+' },
        { value: data.stats.happyClients, label: 'Happy Clients', icon: 'users', suffix: '+' },
        { value: data.stats.citiesCovered, label: 'Cities Covered', icon: 'map-marked-alt', suffix: '+' },
        { value: data.stats.yearsExperience, label: 'Years Experience', icon: 'award', suffix: '' }
      ] as stat, i}
        <div 
          class="text-center group"
          in:fly={{ y: 20, duration: 600, delay: statsVisible ? staggerDelay(i) : 0, easing: quintOut }}
        >
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 text-slate-900 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
            <i class="fas fa-{stat.icon} text-xl"></i>
          </div>
          <div class="text-4xl font-bold text-slate-900 mb-2">{stat.value}{stat.suffix}</div>
          <div class="text-slate-600 font-medium">{stat.label}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Featured Properties -->
<section class="py-20 bg-slate-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between mb-12" in:fly={{ y: 20, duration: 600, easing: quintOut }}>
      <div>
        <h2 class="text-4xl font-bold text-slate-900 mb-3">Featured Properties</h2>
        <p class="text-lg text-slate-600">Handpicked premium listings just for you</p>
      </div>
      <a 
        href="/Properties" 
        class="hidden sm:inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-3 transition-all"
      >
        View All
        <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    {#if data.featuredProperties.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.featuredProperties as property, i}
          <a
            href="/details/{property.id}"
            class="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            in:fly={{ y: 30, duration: 600, delay: staggerDelay(i), easing: quintOut }}
          >
            <div class="relative h-56 overflow-hidden">
              <img
                src={property.image}
                alt={property.location}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-900 shadow-sm">
                {property.type}
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-5">
              <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                {property.location}
              </h3>
              <p class="text-slate-600 text-sm mb-4 flex items-center gap-1">
                <i class="fas fa-map-marker-alt text-slate-400"></i>
                {property.address}
              </p>
              
              <div class="flex items-center gap-4 mb-4 text-sm text-slate-600">
                <span><i class="fas fa-bed text-slate-400"></i> {property.bedrooms}</span>
                <span><i class="fas fa-bath text-slate-400"></i> {property.bathrooms}</span>
                <span><i class="fas fa-ruler-combined text-slate-400"></i> {property.square_foot} sqft</span>
              </div>
              
              <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                <span class="text-2xl font-bold text-slate-900">${property.price.toLocaleString()}</span>
                <span class="text-slate-600 font-medium group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                  View Details →
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
      
      <div class="text-center mt-12">
        <a
          href="/Properties"
          class="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
        >
          Explore All Properties
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    {:else}
      <div class="text-center py-16 bg-white rounded-2xl shadow-md">
        <i class="fas fa-home text-6xl text-slate-300 mb-4"></i>
        <p class="text-xl text-slate-600">No properties available at the moment</p>
      </div>
    {/if}
  </div>
</section>

<!-- How It Works -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16" in:fly={{ y: 20, duration: 600, easing: quintOut }}>
      <h2 class="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
      <p class="text-xl text-slate-600 max-w-2xl mx-auto">Your journey to finding the perfect home in four simple steps</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each howItWorks as step, i}
        <div
          class="relative text-center group"
          in:fly={{ y: 30, duration: 600, delay: staggerDelay(i), easing: quintOut }}
        >
          <!-- Connector line (hidden on last item) -->
          {#if i < howItWorks.length - 1}
            <div class="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
          {/if}
          
          <!-- Step number -->
          <div class="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
            <div class="absolute inset-0 rounded-full bg-slate-900 animate-ping opacity-20"></div>
            <span class="relative text-2xl font-bold">{step.step}</span>
          </div>
          
          <!-- Icon -->
          <div class="mb-4">
            <i class="fas fa-{step.icon} text-4xl text-slate-400 group-hover:text-slate-900 transition-colors duration-300"></i>
          </div>
          
          <h3 class="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
          <p class="text-slate-600">{step.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Market Insights -->
<section class="py-20 bg-slate-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between mb-12">
      <div>
        <h2 class="text-4xl font-bold text-slate-900 mb-3">Market Insights & News</h2>
        <p class="text-lg text-slate-600">Stay informed with expert analysis and tips</p>
      </div>
      <a href="/post" class="hidden sm:inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-3 transition-all">
        View All Articles
        <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each marketInsights as article, i}
        <article
          class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
          in:fly={{ y: 30, duration: 600, delay: staggerDelay(i), easing: quintOut }}
        >
          <div class="relative h-48 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-900">
              {article.category}
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span><i class="fas fa-calendar text-slate-400 mr-1"></i>{article.date}</span>
              <span>•</span>
              <span><i class="fas fa-clock text-slate-400 mr-1"></i>{article.readTime}</span>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
              {article.title}
            </h3>
            <p class="text-slate-600 mb-4">{article.excerpt}</p>
            
            <a href="/post" class="inline-flex items-center gap-2 text-slate-900 font-semibold text-sm hover:gap-3 transition-all">
              Read More
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
      <p class="text-xl text-slate-600">Real stories from real people</p>
    </div>
    
    <div class="max-w-4xl mx-auto">
      <div class="relative min-h-[300px]">
        {#each testimonials as testimonial, i}
          {#if i === currentTestimonial}
            <div
              class="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200"
              in:fade={{ duration: 400 }}
            >
              <div class="flex items-center gap-1 mb-6">
                {#each Array(testimonial.rating) as _}
                  <i class="fas fa-star text-yellow-400 text-xl"></i>
                {/each}
              </div>
              <p class="text-2xl text-slate-700 mb-8 leading-relaxed">"{testimonial.text}"</p>
              <div class="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  class="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div class="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                  <div class="text-slate-600">{testimonial.role}</div>
                  <div class="text-slate-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            </div>
          {/if}
        {/each}
        
        <div class="flex items-center justify-center gap-2 mt-8">
          {#each testimonials as _, i}
            <button
              on:click={() => currentTestimonial = i}
              class="w-2 h-2 rounded-full transition-all duration-300 {i === currentTestimonial ? 'w-8 bg-slate-900' : 'bg-slate-300 hover:bg-slate-400'}"
              aria-label="Testimonial {i + 1}"
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-slate-900 text-white relative overflow-hidden">
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">Start Your Home Journey Today</h2>
    <p class="text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
      Join thousands of satisfied clients who found their dream home with our expert guidance
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="/Properties"
        class="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        Explore Properties
      </a>
      <a
        href="/contact"
        class="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
      >
        Talk to an Expert
      </a>
    </div>
    
    <!-- Trust indicators -->
    <div class="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
      <div class="flex items-center gap-2">
        <i class="fas fa-lock"></i>
        <span>Secure Transactions</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fas fa-headset"></i>
        <span>24/7 Support</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fas fa-medal"></i>
        <span>Award Winning Service</span>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(20px, -20px); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-20px, 20px); }
  }
  
  .animate-float {
    animation: float 20s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 25s ease-in-out infinite;
  }
  
  /* Remove number input arrows */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
