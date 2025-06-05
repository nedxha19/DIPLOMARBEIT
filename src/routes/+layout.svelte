<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
</script>

{#if !$page.url.pathname.startsWith('/admin')}
	<Navbar />
{/if}

<main class="main">
	<slot />
</main>

{#if !$page.url.pathname.startsWith('/admin')}
	<Footer />
{/if}

<style>
	main.main {
		margin-left: 20px;
		margin-right: 20px;
	}

	@media (max-width: 480px) {
		main.main {
			margin: 80px;
		}
	}
</style>
