<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

	// Import centralized design system
	import '$lib/styles/design-system.css';

	// Check if the current route is an admin route
	$: isAdminRoute = $page.url.pathname.startsWith('/admin');
</script>

{#if !isAdminRoute}
	<Navbar />
{/if}

<main class="main">
	<slot />
</main>

{#if !isAdminRoute}
	<Footer />
{/if}

<style>
	
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html), :global(body) {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	/* ========================================
	   ROOT LAYOUT STYLES
	   Uses centralized design system from design-system.css
	======================================== */

	/* Main layout container */
	main.main {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		background: var(--bg-primary);
	}

	/* Mobile responsiveness */
	@media (max-width: 480px) {
		main.main {
			margin: 0;
			padding: 0;
		}
	}
</style>
