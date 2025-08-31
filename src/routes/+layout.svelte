<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

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
	/* Global CSS Reset */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html, body {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	main.main {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 480px) {
		main.main {
			margin: 0;
			padding: 0;
		}
	}
	
</style>
