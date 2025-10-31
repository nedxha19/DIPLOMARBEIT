<script>
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  export let data;
  
  let searchQuery = data.searchQuery || '';
  let selectedCategory = data.currentCategory || 'All';
  let showSidebar = true;
  let newsletterEmail = '';
  let subscribed = false;
  let bookmarkedArticles = [];
  
  const categories = [
    'All',
    'Market Analysis',
    'Buyer Tips',
    'Seller Tips',
    'Investment',
    'Legal',
    'Trends'
  ];
  
  function handleSearch() {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    goto(`/post?${params.toString()}`);
  }
  
  function selectCategory(category) {
    selectedCategory = category;
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category !== 'All') params.set('category', category);
    goto(`/post?${params.toString()}`);
  }
  
  function selectTag(tag) {
    searchQuery = tag;
    handleSearch();
  }
  
  function toggleBookmark(articleId) {
    if (bookmarkedArticles.includes(articleId)) {
      bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
    } else {
      bookmarkedArticles = [...bookmarkedArticles, articleId];
    }
  }
  
  function handleNewsletter(e) {
    e.preventDefault();
    subscribed = true;
    setTimeout(() => {
      newsletterEmail = '';
      subscribed = false;
    }, 3000);
  }
  
  function shareArticle(platform, article) {
    const url = encodeURIComponent(`${window.location.origin}/post/${article.id}`);
    const text = encodeURIComponent(article.title);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${text}&body=${url}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  
  function formatViews(views) {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  }
  
  function staggerDelay(index) {
    return index * 50;
  }
  
  onMount(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('bookmarkedArticles');
    if (saved) {
      bookmarkedArticles = JSON.parse(saved);
    }
  });
  
  $: {
    // Save bookmarks to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
    }
  }
</script>

<svelte:head>
  <title>Real Estate Insights & Expert Articles | Houseo Blog</title>
  <meta name="description" content="Expert insights, market analysis, and actionable advice from real estate professionals. Stay informed with Houseo's comprehensive blog." />
</svelte:head>

<!-- Hero Section with Featured Article -->
{#if data.featuredArticles.length > 0}
  <section class="relative py-20 bg-slate-900 text-white overflow-hidden">
    <div class="absolute inset-0">
      <img
        src={data.featuredArticles[0].image}
        alt={data.featuredArticles[0].title}
        class="w-full h-full object-cover opacity-20"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div in:fly={{ x: -30, duration: 800, delay: 100, easing: quintOut }}>
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <i class="fas fa-star text-yellow-400"></i>
            <span class="text-sm font-semibold">Featured Article</span>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {data.featuredArticles[0].title}
          </h1>
          
          <p class="text-xl text-slate-300 mb-8 leading-relaxed">
            {data.featuredArticles[0].excerpt}
          </p>
          
          <div class="flex items-center gap-6 mb-8 text-slate-300">
            <div class="flex items-center gap-3">
              <img
                src={data.featuredArticles[0].author.image}
                alt={data.featuredArticles[0].author.name}
                class="w-12 h-12 rounded-full"
              />
              <div>
                <div class="font-semibold text-white">{data.featuredArticles[0].author.name}</div>
                <div class="text-sm">{data.featuredArticles[0].author.title}</div>
              </div>
            </div>
            <div class="h-8 w-px bg-white/20"></div>
            <div class="flex items-center gap-4 text-sm">
              <span><i class="fas fa-calendar mr-2"></i>{formatDate(data.featuredArticles[0].date)}</span>
              <span><i class="fas fa-clock mr-2"></i>{data.featuredArticles[0].readTime}</span>
              <span><i class="fas fa-eye mr-2"></i>{formatViews(data.featuredArticles[0].views)} views</span>
            </div>
          </div>
          
          <a
            href="/post/{data.featuredArticles[0].id}"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Read Full Article
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        
        <div class="hidden lg:block" in:fly={{ x: 30, duration: 800, delay: 200, easing: quintOut }}>
          <div class="relative">
            <img
              src={data.featuredArticles[0].image}
              alt={data.featuredArticles[0].title}
              class="rounded-2xl shadow-2xl"
            />
            <div class="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-2xl">
              <div class="text-slate-900">
                <div class="text-3xl font-bold mb-1">{formatViews(data.featuredArticles[0].views)}</div>
                <div class="text-sm text-slate-600">Total Reads</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}

<!-- Search & Filter Bar -->
<section class="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex items-center gap-4">
      <!-- Search -->
      <div class="flex-1 relative">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search articles, topics, or tags..."
          class="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
        />
      </div>
      <button
        on:click={handleSearch}
        class="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
      >
        Search
      </button>
      <button
        on:click={() => showSidebar = !showSidebar}
        class="lg:hidden px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all"
      >
        <i class="fas fa-filter"></i>
      </button>
    </div>
    
    <!-- Category Pills -->
    <div class="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300">
      {#each categories as category}
        <button
          on:click={() => selectCategory(category)}
          class="px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap {selectedCategory === category 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
        >
          {category}
          {#if data.categoryCounts[category]}
            <span class="ml-1 text-xs opacity-75">({data.categoryCounts[category]})</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</section>

<!-- Main Content -->
<section class="py-12 bg-slate-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex gap-8">
      
      <!-- Articles Grid -->
      <div class="flex-1">
        {#if data.articles.length > 0}
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
              <span class="text-slate-500 text-lg ml-2">({data.articles.length})</span>
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {#each data.articles as article, i}
              <article
                class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
                in:fly={{ y: 30, duration: 500, delay: staggerDelay(i), easing: quintOut }}
              >
                <!-- Image -->
                <div class="relative h-64 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <!-- Category Badge -->
                  <div class="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-900">
                    {article.category}
                  </div>
                  
                  <!-- Actions -->
                  <div class="absolute top-4 right-4 flex gap-2">
                    <button
                      on:click={() => toggleBookmark(article.id)}
                      class="w-10 h-10 rounded-full {bookmarkedArticles.includes(article.id) ? 'bg-yellow-400 text-slate-900' : 'bg-white/90 text-slate-700'} backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                    >
                      <i class="fas fa-bookmark"></i>
                    </button>
                  </div>
                  
                  <!-- Stats Overlay -->
                  <div class="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white text-sm">
                    <span class="flex items-center gap-1">
                      <i class="fas fa-eye"></i>
                      {formatViews(article.views)}
                    </span>
                    <span class="flex items-center gap-1">
                      <i class="fas fa-clock"></i>
                      {article.readTime}
                    </span>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="p-6">
                  <!-- Title -->
                  <h3 class="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors">
                    {article.title}
                  </h3>
                  
                  <!-- Excerpt -->
                  <p class="text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    {#each article.tags.slice(0, 3) as tag}
                      <button
                        on:click={() => selectTag(tag)}
                        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 transition-colors"
                      >
                        #{tag}
                      </button>
                    {/each}
                  </div>
                  
                  <!-- Author & CTA -->
                  <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div class="flex items-center gap-2">
                      <img
                        src={article.author.image}
                        alt={article.author.name}
                        class="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div class="text-sm font-semibold text-slate-900">{article.author.name}</div>
                        <div class="text-xs text-slate-500">{formatDate(article.date)}</div>
                      </div>
                    </div>
                    
                    <!-- Share Menu -->
                    <div class="flex items-center gap-2">
                      <button
                        on:click={() => shareArticle('twitter', article)}
                        class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"
                        title="Share on Twitter"
                      >
                        <i class="fab fa-twitter text-xs"></i>
                      </button>
                      <button
                        on:click={() => shareArticle('facebook', article)}
                        class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                        title="Share on Facebook"
                      >
                        <i class="fab fa-facebook-f text-xs"></i>
                      </button>
                      <button
                        on:click={() => shareArticle('linkedin', article)}
                        class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-all"
                        title="Share on LinkedIn"
                      >
                        <i class="fab fa-linkedin-in text-xs"></i>
                      </button>
                    </div>
                  </div>
                  
                  <a
                    href="/post/{article.id}"
                    class="block mt-4 text-center py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
                  >
                    Read Full Article
                  </a>
                </div>
              </article>
            {/each}
          </div>
        {:else}
          <div class="text-center py-20 bg-white rounded-2xl shadow-md">
            <i class="fas fa-search text-6xl text-slate-300 mb-4"></i>
            <h3 class="text-2xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p class="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              on:click={() => { searchQuery = ''; selectedCategory = 'All'; handleSearch(); }}
              class="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              View All Articles
            </button>
          </div>
        {/if}
      </div>
      
      <!-- Sidebar -->
      {#if showSidebar}
        <aside 
          class="w-96 flex-shrink-0 space-y-6"
          in:fly={{ x: 20, duration: 400, easing: quintOut }}
        >
          <!-- Newsletter Signup -->
          <div class="bg-slate-900 rounded-xl p-6 text-white">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <i class="fas fa-envelope text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-lg">Stay Updated</h3>
                <p class="text-sm text-slate-300">Weekly insights</p>
              </div>
            </div>
            
            {#if !subscribed}
              <form on:submit={handleNewsletter} class="space-y-3">
                <input
                  type="email"
                  bind:value={newsletterEmail}
                  placeholder="Your email address"
                  required
                  class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/20 focus:border-white outline-none transition-all"
                />
                <button
                  type="submit"
                  class="w-full py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
                >
                  Subscribe Now
                </button>
                <p class="text-xs text-slate-400 text-center">
                  Join 10,000+ subscribers • Unsubscribe anytime
                </p>
              </form>
            {:else}
              <div class="text-center py-6" in:scale={{ duration: 400 }}>
                <i class="fas fa-check-circle text-4xl text-green-400 mb-3"></i>
                <p class="font-semibold">Successfully Subscribed!</p>
                <p class="text-sm text-slate-300 mt-1">Check your inbox</p>
              </div>
            {/if}
          </div>
          
          <!-- Popular Articles -->
          {#if data.popularArticles.length > 0}
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h3 class="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <i class="fas fa-fire text-orange-500"></i>
                Popular Articles
              </h3>
              <div class="space-y-4">
                {#each data.popularArticles as article, i}
                  <a
                    href="/post/{article.id}"
                    class="flex gap-3 group"
                  >
                    <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-slate-700 transition-colors mb-1">
                        {article.title}
                      </h4>
                      <div class="flex items-center gap-2 text-xs text-slate-500">
                        <span><i class="fas fa-eye"></i> {formatViews(article.views)}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </a>
                  {#if i < data.popularArticles.length - 1}
                    <div class="border-t border-slate-200"></div>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Recent Articles -->
          {#if data.recentArticles.length > 0}
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h3 class="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <i class="fas fa-clock text-blue-500"></i>
                Recent Articles
              </h3>
              <div class="space-y-3">
                {#each data.recentArticles as article}
                  <a
                    href="/post/{article.id}"
                    class="block p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <h4 class="font-semibold text-sm text-slate-900 mb-1 group-hover:text-slate-700">
                      {article.title}
                    </h4>
                    <div class="flex items-center gap-2 text-xs text-slate-500">
                      <span>{formatDate(article.date)}</span>
                      <span>•</span>
                      <span>{article.category}</span>
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Tags Cloud -->
          {#if data.allTags.length > 0}
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h3 class="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <i class="fas fa-tags text-purple-500"></i>
                Popular Tags
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each data.allTags as tag}
                  <button
                    on:click={() => selectTag(tag)}
                    class="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-900 hover:text-white transition-all"
                  >
                    #{tag}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Categories -->
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <h3 class="font-bold text-lg text-slate-900 mb-4">Categories</h3>
            <div class="space-y-2">
              {#each categories.filter(c => c !== 'All') as category}
                <button
                  on:click={() => selectCategory(category)}
                  class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group {selectedCategory === category ? 'bg-slate-900 text-white hover:bg-slate-800' : 'text-slate-700'}"
                >
                  <span class="font-medium">{category}</span>
                  <span class="text-sm {selectedCategory === category ? 'text-slate-300' : 'text-slate-500'}">
                    {data.categoryCounts[category] || 0}
                  </span>
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Bookmarked Articles -->
          {#if bookmarkedArticles.length > 0}
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <h3 class="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <i class="fas fa-bookmark text-yellow-500"></i>
                Your Bookmarks
              </h3>
              <p class="text-sm text-slate-600 mb-3">
                You have {bookmarkedArticles.length} bookmarked article{bookmarkedArticles.length !== 1 ? 's' : ''}
              </p>
              <div class="space-y-2">
                {#each bookmarkedArticles.slice(0, 3) as articleId}
                  {@const article = data.articles.find(a => a.id === articleId) || data.featuredArticles.find(a => a.id === articleId)}
                  {#if article}
                    <a
                      href="/post/{article.id}"
                      class="block p-2 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700 hover:text-slate-900"
                    >
                      {article.title}
                    </a>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        </aside>
      {/if}
    </div>
  </div>
</section>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
