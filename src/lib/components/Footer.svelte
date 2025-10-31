<script>
	import { onMount } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { elasticOut, quintOut } from 'svelte/easing';

	const currentYear = new Date().getFullYear();
	let isVisible = false;
	let newsletterFocused = false;
	let emailValue = '';
	let subscribeSuccess = false;

	// Company info
	const company = {
		name: 'Houseo',
		tagline: 'Find your perfect home',
		description: 'Discover exceptional properties and create lasting memories in spaces designed for modern living.'
	};

	// Footer navigation structure
	const footerSections = [
		{
			title: 'Product',
			links: [
				{ href: '/Properties', label: 'Browse Properties', badge: 'New' },
				{ href: '/living', label: 'Living Spaces' },
				{ href: '/', label: 'Featured Listings' },
				{ href: '/', label: 'Pricing' }
			]
		},
		{
			title: 'Company',
			links: [
				{ href: '/blog', label: 'Blog' },
				{ href: '/contact', label: 'Contact Us' },
				{ href: '/', label: 'About' },
				{ href: '/', label: 'Careers', badge: 'Hiring' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ href: '/', label: 'Help Center' },
				{ href: '/', label: 'Guides' },
				{ href: '/', label: 'Documentation' },
				{ href: '/', label: 'API Reference' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ href: '/', label: 'Privacy Policy' },
				{ href: '/', label: 'Terms of Service' },
				{ href: '/', label: 'Cookie Policy' },
				{ href: '/', label: 'Licenses' }
			]
		}
	];

	// Social media links
	const socialLinks = [
		{ name: 'Twitter', href: 'https://twitter.com', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', color: 'hover:bg-blue-100 hover:text-blue-600' },
		{ name: 'LinkedIn', href: 'https://linkedin.com', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z', color: 'hover:bg-blue-100 hover:text-blue-700' },
		{ name: 'Instagram', href: 'https://instagram.com', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 21h11a3.5 3.5 0 003.5-3.5v-11A3.5 3.5 0 0017.5 3h-11A3.5 3.5 0 003 6.5v11A3.5 3.5 0 006.5 21z', color: 'hover:bg-pink-100 hover:text-pink-600' },
		{ name: 'GitHub', href: 'https://github.com', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22', color: 'hover:bg-slate-200 hover:text-slate-900' }
	];

	// Intersection Observer for scroll animations
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		const footer = document.querySelector('footer');
		if (footer) observer.observe(footer);

		return () => observer.disconnect();
	});

	function handleSubscribe(e) {
		e.preventDefault();
		if (emailValue) {
			subscribeSuccess = true;
			setTimeout(() => {
				emailValue = '';
				subscribeSuccess = false;
			}, 3000);
		}
	}

	function staggerDelay(index) {
		return index * 100;
	}
</script>

<!-- Ultra-modern Footer with advanced animations -->
<footer class="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200 overflow-hidden">
	
	<!-- Animated Background Elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<!-- Floating orbs with parallax -->
		<div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-blue-200/20 rounded-full filter blur-3xl animate-blob"></div>
		<div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-sky-200/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
		
		<!-- Grid pattern -->
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6bS0yLTJ2Mmg0di00aC0yek0zMiAzMHYyaDJWMzB6bS0yLTJ2Mmg0di00aC00ek0yOCAyNnYyaDJWMjZ6bS0yLTJ2Mmg0di00aC00ek0yNCAyMnYyaDJWMjJ6bS0yLTJ2Mmg0di00aC00ek0yMCAxOHYyaDJWMTh6bS0yLTJ2Mmg0di00aC00ek0xNiAxNHYyaDJWMTR6bS0yLTJ2Mmg0di00aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
	</div>

	<!-- Main Footer Content -->
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
		{#if isVisible}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
				
			<!-- Company Info Section -->
				<div 
					class="lg:col-span-4"
					in:fly={{ y: 30, duration: 600, delay: 100, easing: quintOut }}
				>
					<!-- Logo with hover effect -->
					<a href="/" class="inline-flex items-center gap-2.5 group mb-6">
						<div class="relative">
							<svg 
								class="w-8 h-8 text-slate-900 group-hover:text-slate-700 transition-all duration-300 group-hover:scale-110" 
								viewBox="0 0 32 32" 
						fill="none"
					>
								<path d="M4 12L16 4L28 12V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V12Z" fill="currentColor" opacity="0.1"/>
								<path d="M4 12L16 4L28 12M4 12V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V12M4 12L6 13.5M28 12L26 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M12 28V18H20V28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
						</div>
						<span class="text-2xl font-bold text-slate-900">
						{company.name}
					</span>
				</a>

					<!-- Tagline with animation -->
					<p class="text-slate-900 font-semibold text-lg mb-3">
						{company.tagline}
					</p>

					<!-- Description -->
					<p class="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
						{company.description}
					</p>

					<!-- Animated Social Links -->
					<div class="flex items-center gap-2">
						{#each socialLinks as social, i}
							<a
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.name}
								class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {social.color} group relative"
								in:scale={{ duration: 400, delay: 300 + staggerDelay(i), easing: elasticOut }}
							>
								<svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d={social.icon}/>
								</svg>
								
								<!-- Ripple effect -->
								<div class="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-100 transition-all duration-500"></div>
							</a>
					{/each}
				</div>
			</div>

				<!-- Links Grid with stagger animation -->
				<div class="lg:col-span-8">
					<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
						{#each footerSections as section, sectionIndex}
							<div
								in:fly={{ y: 30, duration: 500, delay: 200 + staggerDelay(sectionIndex), easing: quintOut }}
							>
								<h3 class="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4 relative inline-block">
							{section.title}
									<span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-slate-900 rounded-full"></span>
								</h3>
								<ul class="space-y-3">
									{#each section.links as link, linkIndex}
										<li
											in:fade={{ duration: 300, delay: 300 + staggerDelay(sectionIndex) + (linkIndex * 50) }}
										>
									<a
										href={link.href}
												class="text-slate-600 hover:text-sky-600 text-sm transition-all duration-200 inline-flex items-center gap-2 group relative"
									>
												<span class="group-hover:translate-x-1 transition-transform duration-200">
										{link.label}
												</span>
												
												{#if link.badge}
													<span class="px-1.5 py-0.5 text-xs font-semibold bg-slate-900 text-white rounded-full">
														{link.badge}
													</span>
												{/if}
												
												<!-- Underline effect -->
												<span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300 rounded-full"></span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
					</div>
			</div>
		</div>

			<!-- Newsletter Section with advanced form -->
			<div 
				class="mt-16 pt-8 border-t border-slate-200"
				in:fly={{ y: 30, duration: 600, delay: 800 }}
			>
				<div class="max-w-md">
					<h3 class="text-slate-900 font-bold text-lg mb-2 flex items-center gap-2">
						<span>Stay updated</span>
						<svg class="w-5 h-5 text-sky-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
						</svg>
					</h3>
					<p class="text-slate-600 text-sm mb-4">Get the latest properties and updates delivered to your inbox.</p>
					
					{#if !subscribeSuccess}
						<form 
							on:submit={handleSubscribe}
							class="flex gap-2 relative"
							in:fade
						>
							<div class="flex-1 relative">
								<input
									type="email"
									bind:value={emailValue}
									on:focus={() => newsletterFocused = true}
									on:blur={() => newsletterFocused = false}
									placeholder="Enter your email"
									required
									class="w-full px-4 py-2.5 bg-white border-2 rounded-lg text-sm transition-all duration-300 outline-none {newsletterFocused ? 'border-sky-500 shadow-lg shadow-sky-100 scale-105' : 'border-slate-300 hover:border-slate-400'}"
								/>
								<!-- Floating icon -->
								<svg 
									class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 {newsletterFocused ? 'text-sky-600 scale-110' : 'text-slate-400'}" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
							</div>
							<button
								type="submit"
								class="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg"
							>
								Subscribe
							</button>
						</form>
						{:else}
						<div 
							class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg"
							in:scale={{ duration: 400, easing: elasticOut }}
						>
							<svg class="w-6 h-6 text-emerald-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<span class="text-emerald-700 font-semibold text-sm">Successfully subscribed!</span>
						</div>
						{/if}
				</div>
			</div>

			<!-- Bottom Bar -->
			<div 
				class="mt-12 pt-8 border-t border-slate-200"
				in:fly={{ y: 20, duration: 500, delay: 1000 }}
			>
				<div class="flex flex-col md:flex-row items-center justify-between gap-4">
					<!-- Copyright -->
					<p class="text-slate-600 text-sm">
						© {currentYear} <span class="font-semibold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer">{company.name}</span>. All rights reserved.
					</p>

					<!-- Bottom Links -->
					<div class="flex items-center gap-6">
						{#each ['Privacy', 'Terms', 'Sitemap'] as item, i}
							<a 
								href="/" 
								class="text-slate-600 hover:text-sky-600 text-sm transition-all duration-200 relative group"
								in:fade={{ delay: 1100 + (i * 100) }}
							>
								{item}
								<span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-slate-900 group-hover:w-full transition-all duration-300"></span>
					</a>
				{/each}
			</div>
		</div>
	</div>
		{/if}
	</div>

	<!-- Scroll to top button (appears on footer) -->
	{#if isVisible}
		<button
			on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			class="fixed bottom-8 right-8 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center group z-40"
			in:scale={{ duration: 400, delay: 1200, easing: elasticOut }}
			aria-label="Scroll to top"
		>
			<svg class="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
			</svg>
		</button>
	{/if}
</footer>

<style>
	@keyframes blob {
		0%, 100% { transform: translate(0, 0) scale(1); }
		33% { transform: translate(30px, -50px) scale(1.1); }
		66% { transform: translate(-20px, 20px) scale(0.9); }
	}
	
	.animate-blob {
		animation: blob 20s infinite ease-in-out;
	}
	
	.animation-delay-2000 {
		animation-delay: 2s;
	}
	
	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>





