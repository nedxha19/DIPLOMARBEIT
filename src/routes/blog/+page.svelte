<script>
	import { onMount } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';

	export let data;

	let searchQuery = '';
	let selectedCategory = 'all';
	let filteredPosts = data.posts;
	let isVisible = false;
	let mouseX = 0;
	let mouseY = 0;

	$: {
		filteredPosts = data.posts.filter(post => {
			const matchesSearch = searchQuery === '' || 
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
			
			const matchesCategory = selectedCategory === 'all' || 
				post.category.toLowerCase().replace(' ', '-') === selectedCategory;
			
			return matchesSearch && matchesCategory;
		});
	}

	onMount(() => {
		setTimeout(() => isVisible = true, 100);
		
		// Subtle mouse parallax effect
		const handleMouseMove = (e) => {
			mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
		};
		
		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	});

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function staggerDelay(index) {
		return index * 80;
	}
</script>

<svelte:head>
	<title>Blog | Houseo - Real Estate Insights & Trends</title>
	<meta name="description" content="Explore the latest insights, trends, and expert advice in real estate, home design, and property investment.">
</svelte:head>

<!-- Modern Hero Section with Interactive Elements -->
<section class="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
	<!-- Animated Background Grid -->
	<div class="absolute inset-0 opacity-[0.03]">
		<div class="absolute inset-0" style="background-image: linear-gradient(#1a2236 1px, transparent 1px), linear-gradient(90deg, #1a2236 1px, transparent 1px); background-size: 50px 50px;"></div>
	</div>

	<!-- Floating Gradient Orbs with Parallax -->
	<div 
		class="absolute top-20 right-20 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl transition-transform duration-700 ease-out"
		style="transform: translate({mouseX * 0.5}px, {mouseY * 0.5}px)"
	></div>
	<div 
		class="absolute bottom-20 left-20 w-[400px] h-[400px] bg-orange-100/25 rounded-full blur-3xl transition-transform duration-700 ease-out"
		style="transform: translate({-mouseX * 0.3}px, {-mouseY * 0.3}px)"
	></div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
		{#if isVisible}
			<div class="grid lg:grid-cols-2 gap-12 items-center">
				<!-- Left Column - Content -->
				<div>
					<!-- Label -->
					<div 
						class="inline-flex items-center gap-2 mb-6"
						in:scale={{ duration: 500, delay: 100, easing: elasticOut }}
					>
						<div class="h-px w-12 bg-gradient-to-r from-transparent to-slate-300"></div>
						<span class="text-xs font-semibold uppercase tracking-widest text-slate-500">Explore • Learn • Grow</span>
					</div>

					<!-- Main Heading with Creative Typography -->
					<h1 
						class="mb-6"
						in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}
					>
						<div class="text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4">
							<span class="block text-slate-900">Insights</span>
							<span class="block text-slate-900">That</span>
							<span class="relative inline-block">
								<span class="text-slate-900">Matter</span>
								<svg class="absolute -bottom-2 left-0 w-full h-3 text-sky-500/30" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
									<path d="M0 6C75 2, 150 10, 225 4C262.5 0.5, 281.25 8, 300 6" stroke="currentColor" stroke-width="3"/>
								</svg>
							</span>
						</div>
					</h1>

					<!-- Subtitle -->
					<p 
						class="text-xl text-slate-600 leading-relaxed mb-8 max-w-lg"
						in:fly={{ y: 30, duration: 800, delay: 400, easing: quintOut }}
					>
						Discover expert perspectives on modern living, architectural innovation, and smart investment strategies.
					</p>

					<!-- Search Bar - Modern Glass Design -->
					<div 
						class="relative max-w-xl"
						in:fly={{ y: 30, duration: 800, delay: 600, easing: quintOut }}
					>
						<div class="relative group">
							<!-- Glow Effect -->
							<div class="absolute -inset-0.5 bg-gradient-to-r from-sky-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							
							<div class="relative flex items-center bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
								<svg class="w-5 h-5 text-slate-400 ml-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
								</svg>
								<input
									type="text"
									bind:value={searchQuery}
									placeholder="Search articles, topics, or tags..."
									class="flex-1 px-4 py-4 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
								/>
								{#if searchQuery}
									<button
										on:click={() => searchQuery = ''}
										class="mr-4 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
										in:scale={{ duration: 200 }}
									>
										<svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
										</svg>
									</button>
								{/if}
							</div>
						</div>
					</div>

					<!-- Stats Row -->
					<div 
						class="flex items-center gap-8 mt-10"
						in:fade={{ duration: 800, delay: 800 }}
					>
						<div>
							<div class="text-3xl font-bold text-slate-900">{data.posts.length}</div>
							<div class="text-sm text-slate-600">Articles</div>
						</div>
						<div class="h-10 w-px bg-slate-200"></div>
						<div>
							<div class="text-3xl font-bold text-slate-900">{data.categories.length - 1}</div>
							<div class="text-sm text-slate-600">Categories</div>
						</div>
						<div class="h-10 w-px bg-slate-200"></div>
						<div>
							<div class="text-3xl font-bold text-slate-900">50K+</div>
							<div class="text-sm text-slate-600">Readers</div>
						</div>
					</div>
				</div>

				<!-- Right Column - Featured Card Preview -->
				{#if data.featuredPosts[0]}
					<div 
						class="hidden lg:block"
						in:fly={{ x: 30, duration: 1000, delay: 400, easing: quintOut }}
					>
						<a href="/blog/{data.featuredPosts[0].slug}" class="block group">
							<div class="relative">
								<!-- Card Container -->
								<div class="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
									<!-- Image -->
									<div class="relative h-72 overflow-hidden">
										<img
											src={data.featuredPosts[0].image}
											alt={data.featuredPosts[0].title}
											class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
										/>
										<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
										
										<!-- Category Badge -->
										<div class="absolute top-6 left-6">
											<span class="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold rounded-full">
												Featured
											</span>
										</div>
									</div>

									<!-- Content -->
									<div class="p-8">
										<h3 class="text-2xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
											{data.featuredPosts[0].title}
										</h3>
										<p class="text-slate-600 text-sm line-clamp-2 mb-4">
											{data.featuredPosts[0].excerpt}
										</p>
										<div class="flex items-center justify-between text-sm">
											<div class="flex items-center gap-2">
												<img src={data.featuredPosts[0].author.avatar} alt="" class="w-8 h-8 rounded-full" />
												<span class="text-slate-700 font-medium">{data.featuredPosts[0].author.name}</span>
											</div>
											<span class="text-slate-500">{data.featuredPosts[0].readTime} min</span>
										</div>
									</div>
								</div>

								<!-- Decorative Element -->
								<div class="absolute -bottom-4 -right-4 w-24 h-24 bg-sky-500/10 rounded-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
							</div>
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Bottom Wave Separator -->
	<div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
</section>

<!-- Main Content Area -->
<main class="bg-white py-20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		
		<!-- Category Filter - Horizontal Scroll -->
		<section class="mb-16">
			<div class="relative">
				<div class="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
					{#each data.categories as category, i (category.slug)}
						<button
							on:click={() => selectedCategory = category.slug}
							class="flex-shrink-0 group relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 {selectedCategory === category.slug ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}"
							in:scale={{ duration: 300, delay: staggerDelay(i), easing: elasticOut }}
						>
							<span class="flex items-center gap-2">
								{category.name}
								{#if category.count > 0}
									<span class="text-xs {selectedCategory === category.slug ? 'text-white/70' : 'text-slate-400'}">
										{category.count}
									</span>
								{/if}
							</span>
							{#if selectedCategory === category.slug}
								<div class="absolute inset-0 bg-slate-900 rounded-full -z-10 scale-105 opacity-20"></div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</section>

		<!-- Featured Articles - Asymmetric Grid -->
		{#if selectedCategory === 'all' && data.featuredPosts.length > 0}
			<section class="mb-20">
				<div class="flex items-baseline gap-4 mb-10">
					<h2 class="text-3xl font-bold text-slate-900">Featured Stories</h2>
					<div class="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
				</div>

				<!-- Asymmetric Grid Layout -->
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<!-- Large Card -->
					{#if data.featuredPosts[0]}
						<a
							href="/blog/{data.featuredPosts[0].slug}"
							class="lg:col-span-8 group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
							in:fly={{ y: 30, duration: 600, delay: 100 }}
						>
							<div class="relative h-[500px]">
								<img
									src={data.featuredPosts[0].image}
									alt={data.featuredPosts[0].title}
									class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
								
								<div class="absolute bottom-0 left-0 right-0 p-10">
									<span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full mb-4">
										{data.featuredPosts[0].category}
									</span>
									<h3 class="text-4xl font-bold text-white mb-4 line-clamp-2">
										{data.featuredPosts[0].title}
									</h3>
									<p class="text-slate-200 mb-4 line-clamp-2">
										{data.featuredPosts[0].excerpt}
									</p>
									<div class="flex items-center gap-4 text-white/90 text-sm">
										<div class="flex items-center gap-2">
											<img src={data.featuredPosts[0].author.avatar} alt="" class="w-8 h-8 rounded-full" />
											<span>{data.featuredPosts[0].author.name}</span>
										</div>
										<span>•</span>
										<span>{data.featuredPosts[0].readTime} min read</span>
									</div>
								</div>
							</div>
						</a>
					{/if}

					<!-- Stacked Cards -->
					<div class="lg:col-span-4 space-y-6">
						{#each data.featuredPosts.slice(1, 3) as post, i (post.id)}
							<a
								href="/blog/{post.slug}"
								class="block group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
								in:fly={{ y: 30, duration: 600, delay: 200 + (i * 100) }}
							>
								<div class="relative h-48">
									<img
										src={post.image}
										alt={post.title}
										class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
								</div>
								<div class="p-6">
									<span class="text-xs font-semibold text-sky-600 mb-2 block">{post.category}</span>
									<h3 class="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
										{post.title}
									</h3>
									<div class="flex items-center gap-2 text-slate-500 text-xs">
										<span>{post.readTime} min</span>
										<span>•</span>
										<span>{post.views.toLocaleString()} views</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- All Articles Section -->
		<section>
			<div class="flex items-baseline gap-4 mb-10">
				<h2 class="text-3xl font-bold text-slate-900">
					{selectedCategory === 'all' ? 'Latest Articles' : data.categories.find(c => c.slug === selectedCategory)?.name || 'Articles'}
				</h2>
				<div class="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
				<span class="text-sm text-slate-600">{filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}</span>
			</div>

			{#if filteredPosts.length > 0}
				<!-- Masonry-style Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each filteredPosts as post, i (post.id)}
						<article
							class="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-500"
							in:fly={{ y: 30, duration: 600, delay: Math.min(staggerDelay(i), 400) }}
						>
							<a href="/blog/{post.slug}">
								<div class="relative h-56 overflow-hidden">
									<img
										src={post.image}
										alt={post.title}
										class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
									/>
									<div class="absolute top-4 right-4">
										<span class="px-3 py-1 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold rounded-full shadow-lg">
											{post.category}
										</span>
									</div>
								</div>

								<div class="p-6">
									<div class="flex items-center gap-2 text-slate-500 text-xs mb-3">
										<time>{formatDate(post.publishedDate)}</time>
										<span>•</span>
										<span>{post.readTime} min read</span>
									</div>

									<h3 class="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
										{post.title}
									</h3>

									<p class="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
										{post.excerpt}
									</p>

									<div class="flex items-center justify-between pt-4 border-t border-slate-100">
										<div class="flex items-center gap-2">
											<img src={post.author.avatar} alt={post.author.name} class="w-7 h-7 rounded-full" />
											<span class="text-xs font-medium text-slate-700">{post.author.name}</span>
										</div>
										<div class="flex items-center gap-1 text-sky-600 text-sm font-medium group-hover:gap-2 transition-all">
											<span>Read</span>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
											</svg>
										</div>
									</div>
								</div>
							</a>
						</article>
					{/each}
				</div>
			{:else}
				<!-- No Results State -->
				<div class="text-center py-20">
					<div class="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-2xl mb-6">
						<svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
					<p class="text-slate-600 mb-6">Try adjusting your search or filter.</p>
					<button
						on:click={() => { searchQuery = ''; selectedCategory = 'all'; }}
						class="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
					>
						Clear Filters
					</button>
				</div>
			{/if}
		</section>

		<!-- Newsletter CTA -->
		<section class="mt-24">
			<div class="relative bg-slate-900 rounded-3xl overflow-hidden">
				<div class="absolute inset-0 opacity-5">
					<div style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"></div>
				</div>

				<div class="relative px-8 py-16 md:px-16 text-center">
					<div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-xs font-medium mb-6">
						<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
						</svg>
						Newsletter
					</div>

					<h2 class="text-4xl font-bold text-white mb-4">Stay Inspired</h2>
					<p class="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
						Get weekly insights delivered to your inbox. No spam, ever.
					</p>

					<form class="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
						<input
							type="email"
							placeholder="Enter your email"
							required
							class="flex-1 px-5 py-3.5 bg-white/95 text-slate-900 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
						/>
						<button
							type="submit"
							class="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all"
						>
							Subscribe
						</button>
					</form>

					<p class="text-slate-400 text-sm mt-4">Join 50,000+ subscribers</p>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

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
