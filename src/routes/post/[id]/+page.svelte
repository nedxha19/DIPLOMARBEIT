<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  
  export let data;
  
  let readingProgress = 0;
  let showShareMenu = false;
  let commentText = '';
  let comments = [];
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  
  function formatViews(views) {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  }
  
  function shareArticle(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(data.article.title);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${text}&body=${url}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
    showShareMenu = false;
  }
  
  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    showShareMenu = false;
  }
  
  function handleScroll() {
    const article = document.querySelector('.article-content');
    if (article) {
      const scrollTop = window.scrollY;
      const docHeight = article.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      readingProgress = Math.min(Math.max(scrollPercent * 100, 0), 100);
    }
  }
  
  function submitComment(e) {
    e.preventDefault();
    if (commentText.trim()) {
      comments = [{
        id: Date.now(),
        text: commentText,
        author: 'Guest User',
        date: new Date().toISOString(),
        likes: 0
      }, ...comments];
      commentText = '';
    }
  }
  
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:head>
  <title>{data.article.title} | Houseo Blog</title>
  <meta name="description" content={data.article.excerpt} />
</svelte:head>

<!-- Reading Progress Bar -->
<div class="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
  <div 
    class="h-full bg-slate-900 transition-all duration-150"
    style="width: {readingProgress}%"
  ></div>
</div>

<!-- Hero Section -->
<section class="relative pt-24 pb-12 bg-slate-900 text-white">
  <div class="absolute inset-0">
    <img
      src={data.article.image}
      alt={data.article.title}
      class="w-full h-full object-cover opacity-20"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900"></div>
  </div>
  
  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <nav class="mb-6" in:fly={{ y: -20, duration: 600, delay: 100 }}>
      <ol class="flex items-center gap-2 text-sm text-slate-300">
        <li><a href="/" class="hover:text-white transition-colors">Home</a></li>
        <li><i class="fas fa-chevron-right text-xs"></i></li>
        <li><a href="/post" class="hover:text-white transition-colors">Blog</a></li>
        <li><i class="fas fa-chevron-right text-xs"></i></li>
        <li class="text-white">{data.article.category}</li>
      </ol>
    </nav>
    
    <!-- Category Badge -->
    <div class="mb-6" in:fly={{ y: -20, duration: 600, delay: 200 }}>
      <span class="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold">
        {data.article.category}
      </span>
    </div>
    
    <!-- Title -->
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" in:fly={{ y: -20, duration: 600, delay: 300 }}>
      {data.article.title}
    </h1>
    
    <!-- Meta Info -->
    <div class="flex flex-wrap items-center gap-6 text-slate-300" in:fly={{ y: -20, duration: 600, delay: 400 }}>
      <div class="flex items-center gap-3">
        <img
          src={data.article.author.image}
          alt={data.article.author.name}
          class="w-12 h-12 rounded-full"
        />
        <div>
          <div class="font-semibold text-white">{data.article.author.name}</div>
          <div class="text-sm">{data.article.author.title}</div>
        </div>
      </div>
      <div class="h-8 w-px bg-white/20"></div>
      <div class="flex items-center gap-4 text-sm">
        <span><i class="fas fa-calendar mr-2"></i>{formatDate(data.article.date)}</span>
        <span><i class="fas fa-clock mr-2"></i>{data.article.readTime}</span>
        <span><i class="fas fa-eye mr-2"></i>{formatViews(data.article.views)}</span>
      </div>
    </div>
  </div>
</section>

<!-- Main Content -->
<section class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex gap-12">
      
      <!-- Article Content -->
      <article class="flex-1 max-w-4xl article-content">
        <div class="prose prose-lg max-w-none">
          {@html data.article.content}
        </div>
        
        <!-- Tags -->
        <div class="mt-12 pt-8 border-t border-slate-200">
          <h3 class="text-sm font-semibold text-slate-600 mb-4">TAGS</h3>
          <div class="flex flex-wrap gap-2">
            {#each data.article.tags as tag}
              <a
                href="/post?search={tag}"
                class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-900 hover:text-white transition-all"
              >
                #{tag}
              </a>
            {/each}
          </div>
        </div>
        
        <!-- Share Section -->
        <div class="mt-8 p-6 bg-slate-50 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-lg text-slate-900 mb-1">Enjoyed this article?</h3>
              <p class="text-slate-600">Share it with your network</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                on:click={() => shareArticle('twitter')}
                class="w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <i class="fab fa-twitter"></i>
              </button>
              <button
                on:click={() => shareArticle('facebook')}
                class="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110"
              >
                <i class="fab fa-facebook-f"></i>
              </button>
              <button
                on:click={() => shareArticle('linkedin')}
                class="w-12 h-12 rounded-full bg-blue-700 text-white hover:bg-blue-800 flex items-center justify-center transition-all hover:scale-110"
              >
                <i class="fab fa-linkedin-in"></i>
              </button>
              <button
                on:click={copyLink}
                class="w-12 h-12 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition-all hover:scale-110"
              >
                <i class="fas fa-link"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Author Bio -->
        <div class="mt-12 p-8 bg-slate-900 text-white rounded-xl">
          <div class="flex gap-6">
            <img
              src={data.article.author.image}
              alt={data.article.author.name}
              class="w-24 h-24 rounded-full"
            />
            <div class="flex-1">
              <div class="text-sm text-slate-400 mb-1">WRITTEN BY</div>
              <h3 class="text-2xl font-bold mb-2">{data.article.author.name}</h3>
              <p class="text-slate-400 mb-1">{data.article.author.title}</p>
              <p class="text-slate-300 leading-relaxed">{data.article.author.bio}</p>
            </div>
          </div>
        </div>
        
        <!-- Comments Section -->
        <div class="mt-12">
          <h3 class="text-2xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h3>
          
          <!-- Comment Form -->
          <form on:submit={submitComment} class="mb-8">
            <textarea
              bind:value={commentText}
              placeholder="Share your thoughts..."
              rows="4"
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all resize-none"
            ></textarea>
            <button
              type="submit"
              class="mt-3 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              Post Comment
            </button>
          </form>
          
          <!-- Comments List -->
          {#if comments.length > 0}
            <div class="space-y-6">
              {#each comments as comment}
                <div class="p-6 bg-slate-50 rounded-xl" in:fly={{ y: 20, duration: 400 }}>
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                        {comment.author.charAt(0)}
                      </div>
                      <div>
                        <div class="font-semibold text-slate-900">{comment.author}</div>
                        <div class="text-sm text-slate-500">{formatDate(comment.date)}</div>
                      </div>
                    </div>
                  </div>
                  <p class="text-slate-700 leading-relaxed">{comment.text}</p>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-12 bg-slate-50 rounded-xl">
              <i class="fas fa-comments text-4xl text-slate-300 mb-3"></i>
              <p class="text-slate-600">Be the first to comment on this article</p>
            </div>
          {/if}
        </div>
      </article>
      
      <!-- Sidebar -->
      <aside class="hidden lg:block w-80 flex-shrink-0">
        <div class="sticky top-24 space-y-6">
          <!-- Newsletter -->
          <div class="bg-slate-900 rounded-xl p-6 text-white">
            <h3 class="font-bold text-lg mb-3">Stay Updated</h3>
            <p class="text-slate-300 text-sm mb-4">Get weekly insights delivered to your inbox</p>
            <input
              type="email"
              placeholder="Your email"
              class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 mb-3 outline-none"
            />
            <button class="w-full py-2 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all">
              Subscribe
            </button>
          </div>
          
          <!-- Related Articles -->
          {#if data.relatedArticles.length > 0}
            <div class="bg-white rounded-xl p-6 shadow-md">
              <h3 class="font-bold text-lg text-slate-900 mb-4">Related Articles</h3>
              <div class="space-y-4">
                {#each data.relatedArticles as article}
                  <a
                    href="/post/{article.id}"
                    class="flex gap-3 group"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      class="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 class="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-slate-700 transition-colors mb-1">
                        {article.title}
                      </h4>
                      <p class="text-xs text-slate-500">{article.readTime}</p>
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Back to Blog -->
          <a
            href="/post"
            class="block p-6 bg-slate-100 rounded-xl text-center hover:bg-slate-200 transition-all group"
          >
            <i class="fas fa-arrow-left text-slate-600 group-hover:text-slate-900 transition-colors mb-2"></i>
            <div class="font-semibold text-slate-900">Back to Blog</div>
            <div class="text-sm text-slate-600">View all articles</div>
          </a>
        </div>
      </aside>
    </div>
  </div>
</section>

<style>
  .prose {
    color: #334155;
  }
  
  .prose :global(h2) {
    font-size: 1.875rem;
    font-weight: 700;
    color: #0f172a;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
  }
  
  .prose :global(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .prose :global(p) {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    font-size: 1.125rem;
  }
  
  .prose :global(ul), .prose :global(ol) {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  .prose :global(li) {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }
  
  .prose :global(strong) {
    font-weight: 600;
    color: #0f172a;
  }
  
  .prose :global(a) {
    color: #0f172a;
    text-decoration: underline;
  }
  
  .prose :global(a:hover) {
    color: #475569;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>



