<script>
	import { page } from '$app/stores';
	import { fly, fade, slide } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let mobileMenuOpen = false;
	let scrolled = false;
	let atTop = true;
	let lastScroll = 0;
	let hideNavbar = false;

	// Navigation configuration
	const navLinks = [
		{ href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/Properties', label: 'Properties', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
		{ href: '/blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
		{ href: '/living', label: 'Living', icon: 'M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7h18M6 21v-4a2 2 0 012-2h8a2 2 0 012 2v4' },
		{ href: '/contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
	];

	// Advanced scroll behavior (like Medium, Linear)
	onMount(() => {
		const handleScroll = () => {
			const currentScroll = window.scrollY;
			
			scrolled = currentScroll > 20;
			atTop = currentScroll < 10;
			
			// Hide navbar on scroll down, show on scroll up (modern UX pattern)
			if (currentScroll > lastScroll && currentScroll > 100) {
				hideNavbar = true;
			} else {
				hideNavbar = false;
			}
			
			lastScroll = currentScroll;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	$: if ($page) {
		mobileMenuOpen = false;
	}

	function isActive(href) {
		return $page.url.pathname === href;
	}

	// Stagger animation for mobile menu items
	function staggerDelay(index) {
		return index * 50;
	}
</script>

<!-- Ultra-modern Navbar with advanced features -->
<nav 
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 {hideNavbar ? '-translate-y-full' : 'translate-y-0'} {scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50' : 'bg-white/60 backdrop-blur-md shadow-sm'}"
	style="transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			
			<!-- Logo Section with animation -->
			<div class="flex items-center gap-12">
				<a 
					href="/" 
					class="flex items-center gap-2.5 group"
					in:fly={{ x: -20, duration: 600, delay: 100 }}
				>
					<!-- Animated Logo Icon -->
					<div class="relative">
						<svg 
							class="w-8 h-8 text-sky-600 group-hover:text-sky-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" 
							viewBox="0 0 32 32" 
							fill="none"
						>
							<path d="M4 12L16 4L28 12V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V12Z" fill="currentColor" opacity="0.2"/>
							<path d="M4 12L16 4L28 12M4 12V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V12M4 12L6 13.5M28 12L26 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M12 28V18H20V28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<!-- Animated glow -->
						<div class="absolute -inset-2 bg-gradient-to-r from-sky-400 to-orange-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 animate-pulse"></div>
					</div>
					
					<span class="text-2xl font-bold bg-gradient-to-r from-sky-600 via-sky-500 to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
						Houseo
					</span>
				</a>

				<!-- Desktop Navigation with stagger animation -->
				<div class="hidden lg:flex items-center gap-1">
					{#each navLinks as link, i}
						<a
							href={link.href}
							class="relative px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 transition-all duration-300 group rounded-lg hover:bg-sky-50/50"
							class:active={isActive(link.href)}
							in:fly={{ y: -10, duration: 400, delay: 200 + (i * 50) }}
						>
							<span class="relative z-10">{link.label}</span>
							
							<!-- Active indicator with scale animation -->
							{#if isActive(link.href)}
								<span 
									class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-600 to-orange-500 rounded-full"
									in:slide={{ duration: 300 }}
								></span>
							{/if}
							
							<!-- Sophisticated hover effect -->
							<span class="absolute inset-0 bg-gradient-to-r from-sky-50 to-orange-50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 -z-10"></span>
							<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-sky-200 transition-all duration-500 rounded-full"></span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Right Section with animations -->
			<div class="flex items-center gap-4">
				<!-- Enhanced CTA Button -->
				<a
					href="/contact"
					class="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-600 via-sky-600 to-orange-500 bg-[length:200%_auto] hover:bg-right-bottom text-white text-sm font-semibold rounded-full transition-all duration-500 shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/50 hover:-translate-y-0.5 hover:scale-105 relative overflow-hidden group"
					in:fly={{ x: 20, duration: 600, delay: 400 }}
				>
					<!-- Shimmer effect -->
					<div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
					
					<span class="relative">Get Started</span>
					<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
					</svg>
				</a>

				<!-- Advanced Mobile Menu Button -->
				<button
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="lg:hidden relative p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-300 group"
					aria-label="Toggle menu"
				>
					<div class="w-6 h-5 flex flex-col justify-around">
						<span 
							class="block h-0.5 w-full bg-current transition-all duration-300 rounded-full {mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}"
						></span>
						<span 
							class="block h-0.5 w-full bg-current transition-all duration-300 rounded-full {mobileMenuOpen ? 'opacity-0' : ''}"
						></span>
						<span 
							class="block h-0.5 w-full bg-current transition-all duration-300 rounded-full {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"
						></span>
					</div>
					
					<!-- Ripple effect -->
					<div class="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
				</button>
			</div>
		</div>
	</div>

	<!-- Ultra-modern Mobile Menu -->
	{#if mobileMenuOpen}
		<div 
			class="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
			transition:slide={{ duration: 400, easing: quintOut }}
		>
			<div class="px-4 py-6 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
				{#each navLinks as link, i}
					<a
						href={link.href}
						class="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-gradient-to-r hover:from-sky-50 hover:to-orange-50 rounded-xl transition-all duration-300 group relative overflow-hidden"
						class:bg-gradient-to-r={isActive(link.href)}
						class:from-sky-50={isActive(link.href)}
						class:to-orange-50={isActive(link.href)}
						class:text-sky-600={isActive(link.href)}
						in:fly={{ x: -20, duration: 300, delay: staggerDelay(i), easing: elasticOut }}
					>
						<!-- Icon with animation -->
						<svg 
							class="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon}/>
						</svg>
						
						<span class="flex-1">{link.label}</span>
						
						<!-- Arrow indicator -->
						<svg 
							class="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
						
						<!-- Animated background -->
						<div class="absolute inset-0 bg-gradient-to-r from-sky-100/0 via-sky-100/50 to-orange-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 -z-10"></div>
					</a>
				{/each}
				
				<!-- Mobile CTA with animation -->
				<div 
					class="pt-4 mt-4 border-t border-slate-200"
					in:fly={{ y: 20, duration: 400, delay: navLinks.length * 50 + 100 }}
				>
					<a
						href="/contact"
						class="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-sky-600 to-orange-500 text-white font-semibold rounded-full shadow-lg shadow-sky-600/30 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
					>
						<!-- Shimmer effect -->
						<div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
						
						<span class="relative">Get Started</span>
						<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Spacer -->
<div class="h-16"></div>

<style>
	.active {
		color: #0284c7;
	}
	
	@keyframes gradient {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
	
	.animate-gradient {
		animation: gradient 3s ease infinite;
	}
</style>
