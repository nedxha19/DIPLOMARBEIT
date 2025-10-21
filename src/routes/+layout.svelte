<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	import '../app.css';

	// Check if the current route is an admin route
	$: isAdminRoute = $page.url.pathname.startsWith('/admin');
</script>

{#if !isAdminRoute}
	<Navbar />
{/if}

<main class="w-full min-h-screen bg-white flex-1">
	<slot />
</main>

{#if !isAdminRoute}
	<Footer />
{/if}

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100%;
		font-family:
			'Montserrat',
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
