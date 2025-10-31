<script>
	import { onMount } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';

	export let data;

	let isVisible = false;
	let scrollProgress = 0;

	onMount(() => {
		isVisible = true;

		const handleScroll = () => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollTop = window.scrollY;
			const trackLength = documentHeight - windowHeight;
			scrollProgress = (scrollTop / trackLength) * 100;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function shareOnTwitter() {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(data.post.title);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	}

	function shareOnLinkedIn() {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	}

	function shareOnFacebook() {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
	}

	function copyLink() {
		navigator.clipboard.writeText(window.location.href);
		alert('Link copied to clipboard!');
	}
</script>

<svelte:head>
	<title>{data.post.title} | Houseo Blog</title>
	<meta name="description" content={data.post.excerpt}>
</svelte:head>

<!-- Reading Progress Bar -->
<div class="fixed top-16 left-0 right-0 h-0.5 bg-slate-100 z-50">
	<div 
		class="h-full bg-sky-600 transition-all duration-150"
		style="width: {scrollProgress}%"
	></div>
</div>

<!-- Article -->
<article class="bg-white">
	<!-- Hero Section - Clean & Minimal -->
	<header class="relative bg-slate-50 pt-24 pb-16">
		<!-- Subtle Decorative Elements -->
		<div class="absolute top-20 right-10 w-64 h-64 bg-sky-100/30 rounded-full blur-3xl"></div>
		<div class="absolute bottom-10 left-10 w-80 h-80 bg-orange-50/30 rounded-full blur-3xl"></div>

		{#if isVisible}
			<div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<!-- Breadcrumb -->
				<nav 
					class="flex items-center gap-2 text-sm text-slate-500 mb-8"
					in:fade={{ duration: 600, delay: 100 }}
				>
					<a href="/" class="hover:text-slate-900 transition-colors">Home</a>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
					<a href="/blog" class="hover:text-slate-900 transition-colors">Blog</a>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
					<span class="text-slate-900 font-medium">{data.post.category}</span>
				</nav>

				<!-- Category Badge -->
				<div 
					class="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mb-6"
					in:scale={{ duration: 400, delay: 200, easing: elasticOut }}
				>
					{data.post.category}
				</div>

				<!-- Title -->
				<h1 
					class="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight tracking-tight"
					in:fly={{ y: 20, duration: 800, delay: 300 }}
				>
					{data.post.title}
				</h1>

				<!-- Meta Information -->
				<div 
					class="flex flex-wrap items-center gap-6"
					in:fade={{ duration: 600, delay: 400 }}
				>
					<!-- Author -->
					<div class="flex items-center gap-3">
						<img
							src={data.post.author.avatar}
							alt={data.post.author.name}
							class="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200"
						/>
						<div>
							<div class="text-sm font-semibold text-slate-900">{data.post.author.name}</div>
							<div class="text-xs text-slate-600">{data.post.author.role}</div>
						</div>
					</div>

					<div class="hidden sm:block w-px h-8 bg-slate-300"></div>

					<!-- Date -->
					<div class="flex items-center gap-2 text-slate-600 text-sm">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
						</svg>
						<time>{formatDate(data.post.publishedDate)}</time>
					</div>

					<div class="hidden sm:block w-px h-8 bg-slate-300"></div>

					<!-- Read Time -->
					<div class="flex items-center gap-2 text-slate-600 text-sm">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<span>{data.post.readTime} min read</span>
					</div>
				</div>
			</div>
		{/if}
	</header>

	<!-- Featured Image -->
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
		<div class="relative rounded-3xl overflow-hidden shadow-2xl">
			<img
				src={data.post.image}
				alt={data.post.title}
				class="w-full h-auto"
			/>
		</div>
	</div>

	<!-- Main Content -->
	<div class="relative bg-white">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
			<div class="flex gap-12">
				
				<!-- Sidebar - Social Share (Desktop) -->
				<aside class="hidden lg:block sticky top-24 h-fit">
					<div class="flex flex-col gap-3">
						<div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Share</div>
						
						<button
							on:click={shareOnTwitter}
							class="group flex items-center justify-center w-11 h-11 bg-slate-50 rounded-xl hover:bg-sky-50 transition-all duration-300 hover:-translate-y-0.5"
							aria-label="Share on Twitter"
						>
							<svg class="w-4 h-4 text-slate-600 group-hover:text-sky-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
							</svg>
						</button>

						<button
							on:click={shareOnLinkedIn}
							class="group flex items-center justify-center w-11 h-11 bg-slate-50 rounded-xl hover:bg-sky-50 transition-all duration-300 hover:-translate-y-0.5"
							aria-label="Share on LinkedIn"
						>
							<svg class="w-4 h-4 text-slate-600 group-hover:text-sky-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/>
							</svg>
						</button>

						<button
							on:click={shareOnFacebook}
							class="group flex items-center justify-center w-11 h-11 bg-slate-50 rounded-xl hover:bg-sky-50 transition-all duration-300 hover:-translate-y-0.5"
							aria-label="Share on Facebook"
						>
							<svg class="w-4 h-4 text-slate-600 group-hover:text-sky-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
							</svg>
						</button>

						<button
							on:click={copyLink}
							class="group flex items-center justify-center w-11 h-11 bg-slate-50 rounded-xl hover:bg-sky-50 transition-all duration-300 hover:-translate-y-0.5"
							aria-label="Copy link"
						>
							<svg class="w-4 h-4 text-slate-600 group-hover:text-sky-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
							</svg>
						</button>
					</div>
				</aside>

				<!-- Article Content -->
				<div class="flex-1 min-w-0">
					<!-- Article Body -->
					<div class="prose prose-lg max-w-none article-content mb-12">
						{@html data.post.content}
					</div>

					<!-- Tags -->
					<div class="flex flex-wrap gap-2 mb-8 pb-8 border-b border-slate-200">
						<span class="text-sm font-semibold text-slate-600">Tags:</span>
						{#each data.post.tags as tag}
							<a
								href="/blog?tag={tag}"
								class="px-4 py-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-sm font-medium rounded-lg transition-all duration-300"
							>
								#{tag}
							</a>
						{/each}
					</div>

					<!-- Mobile Share Buttons -->
					<div class="flex lg:hidden items-center gap-3 mb-8 pb-8 border-b border-slate-200">
						<span class="text-sm font-semibold text-slate-600">Share:</span>
						<button
							on:click={shareOnTwitter}
							class="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg transition-all"
						>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
							</svg>
						</button>
						<button
							on:click={shareOnLinkedIn}
							class="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg transition-all"
						>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/>
							</svg>
						</button>
						<button
							on:click={shareOnFacebook}
							class="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg transition-all"
						>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
							</svg>
						</button>
						<button
							on:click={copyLink}
							class="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-lg transition-all"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
							</svg>
						</button>
					</div>

					<!-- Author Card -->
					<div class="bg-slate-50 rounded-2xl p-8 mb-12">
						<div class="flex flex-col md:flex-row gap-6">
							<img
								src={data.post.author.avatar}
								alt={data.post.author.name}
								class="w-20 h-20 rounded-2xl object-cover"
							/>
							<div class="flex-1">
								<div class="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">Written by</div>
								<h3 class="text-xl font-bold text-slate-900 mb-1">{data.post.author.name}</h3>
								<p class="text-sm text-slate-600 mb-3">{data.post.author.role}</p>
								<p class="text-slate-600 text-sm leading-relaxed mb-4">{data.post.author.bio}</p>
								<div class="flex gap-3">
									<a
										href="/"
										class="text-slate-400 hover:text-sky-600 transition-colors"
										aria-label="Twitter"
									>
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
										</svg>
									</a>
									<a
										href="/"
										class="text-slate-400 hover:text-sky-600 transition-colors"
										aria-label="LinkedIn"
									>
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
											<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- Related Posts -->
					{#if data.relatedPosts.length > 0}
						<section>
							<div class="flex items-center gap-3 mb-8">
								<div class="w-8 h-px bg-sky-600"></div>
								<h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Related Articles</h2>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								{#each data.relatedPosts as relatedPost, i (relatedPost.id)}
									<a
										href="/blog/{relatedPost.slug}"
										class="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-sky-300 hover:shadow-lg transition-all duration-500"
										in:fly={{ y: 20, duration: 600, delay: i * 100 }}
									>
										<div class="relative h-40 overflow-hidden">
											<img
												src={relatedPost.image}
												alt={relatedPost.title}
												class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
											/>
										</div>
										<div class="p-5">
											<div class="text-xs font-semibold text-sky-600 mb-2">{relatedPost.category}</div>
											<h3 class="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
												{relatedPost.title}
											</h3>
											<div class="flex items-center gap-2 text-slate-500 text-xs mt-3">
												<span>{relatedPost.readTime} min read</span>
											</div>
										</div>
									</a>
								{/each}
							</div>
						</section>
					{/if}

					<!-- Back to Blog CTA -->
					<div class="mt-12 text-center">
						<a
							href="/blog"
							class="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all duration-300 group"
						>
							<svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
							</svg>
							<span>Back to All Articles</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</article>

<style>
	/* Article Content Styling - Clean & Readable */
	:global(.article-content) {
		color: #475569;
		line-height: 1.8;
	}

	:global(.article-content .lead) {
		font-size: 1.25rem;
		font-weight: 500;
		color: #334155;
		margin-bottom: 2rem;
		line-height: 1.7;
	}

	:global(.article-content h2) {
		font-size: 1.875rem;
		font-weight: 700;
		color: #0f172a;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		line-height: 1.3;
	}

	:global(.article-content h3) {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1e293b;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	:global(.article-content p) {
		margin-bottom: 1.5rem;
		font-size: 1.0625rem;
	}

	:global(.article-content ul) {
		list-style: none;
		margin: 1.5rem 0;
		padding: 0;
	}

	:global(.article-content ul li) {
		padding-left: 1.75rem;
		margin-bottom: 0.875rem;
		position: relative;
	}

	:global(.article-content ul li::before) {
		content: "";
		position: absolute;
		left: 0;
		top: 0.65rem;
		width: 0.375rem;
		height: 0.375rem;
		background: #0ea5e9;
		border-radius: 50%;
	}

	:global(.article-content blockquote) {
		border-left: 3px solid #0ea5e9;
		padding: 1.5rem 2rem;
		margin: 2.5rem 0;
		background: #f8fafc;
		border-radius: 0.5rem;
		font-size: 1.0625rem;
		font-style: italic;
		color: #334155;
	}

	:global(.article-content strong) {
		color: #0f172a;
		font-weight: 600;
	}

	:global(.article-content a) {
		color: #0ea5e9;
		text-decoration: none;
		border-bottom: 1px solid #bae6fd;
		transition: all 0.2s;
	}

	:global(.article-content a:hover) {
		color: #0284c7;
		border-bottom-color: #0ea5e9;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
