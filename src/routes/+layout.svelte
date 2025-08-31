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
	   GLOBAL CSS CUSTOM PROPERTIES
	   Centralized Design Tokens
	======================================== */
	:root {
		/* === PRIMARY BRAND COLORS === */
		--primary-color: #1a2236;
		--primary-light: #2a3441;
		--primary-dark: #141b28;
		--secondary-color: #6b7280;
		--accent-color: #0ea5e9;
		--accent-hover: #0284c7;

		/* === SEMANTIC COLORS === */
		--success-color: #10b981;
		--success-light: #d1fae5;
		--error-color: #ef4444;
		--error-light: #fee2e2;
		--warning-color: #f59e0b;
		--warning-light: #fef3c7;
		--info-color: #3b82f6;
		--info-light: #dbeafe;

		/* === BACKGROUND COLORS === */
		--bg-primary: #f8fafc;
		--bg-secondary: #ffffff;
		--bg-dark: #1a2236;
		--bg-accent: rgba(14, 165, 233, 0.05);
		--bg-muted: #f1f5f9;

		/* === TEXT COLORS === */
		--text-primary: #0f172a;
		--text-secondary: #475569;
		--text-muted: #64748b;
		--text-white: #ffffff;
		--text-label: #1e293b;
		--text-placeholder: #94a3b8;

		/* === BORDER COLORS === */
		--border-light: #e5e7eb;
		--border-medium: #d1d5db;
		--border-dark: #374151;

		/* === GRADIENTS === */
		--gradient-primary: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
		--gradient-header: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
		--gradient-button: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
		--gradient-bg: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-muted) 100%);

		/* === TYPOGRAPHY SCALE === */
		--font-size-xs: 0.75rem;      /* 12px */
		--font-size-sm: 0.875rem;     /* 14px */
		--font-size-base: 1rem;       /* 16px */
		--font-size-lg: 1.125rem;     /* 18px */
		--font-size-xl: 1.25rem;      /* 20px */
		--font-size-2xl: 1.5rem;      /* 24px */
		--font-size-3xl: 1.875rem;    /* 30px */
		--font-size-4xl: 2.25rem;     /* 36px */

		/* Font weights */
		--font-weight-normal: 400;
		--font-weight-medium: 500;
		--font-weight-semibold: 600;
		--font-weight-bold: 700;

		/* Line heights */
		--line-height-tight: 1.2;
		--line-height-normal: 1.5;
		--line-height-relaxed: 1.6;

		/* === SPACING SCALE (8pt grid) === */
		--spacing-1: 0.25rem;   /* 4px */
		--spacing-2: 0.5rem;    /* 8px */
		--spacing-3: 0.75rem;   /* 12px */
		--spacing-4: 1rem;      /* 16px */
		--spacing-5: 1.25rem;   /* 20px */
		--spacing-6: 1.5rem;    /* 24px */
		--spacing-8: 2rem;      /* 32px */
		--spacing-10: 2.5rem;   /* 40px */
		--spacing-12: 3rem;     /* 48px */
		--spacing-16: 4rem;     /* 64px */
		--spacing-20: 5rem;     /* 80px */
		--spacing-24: 6rem;     /* 96px */

		/* === BORDER RADIUS === */
		--radius-sm: 0.25rem;
		--radius-base: 0.5rem;
		--radius-md: 0.75rem;
		--radius-lg: 1rem;
		--radius-xl: 1.5rem;
		--radius-full: 9999px;

		/* === SHADOWS === */
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

		/* === TRANSITIONS === */
		--transition-fast: 150ms ease-in-out;
		--transition-base: 250ms ease-in-out;
		--transition-slow: 350ms ease-in-out;

		/* === LAYOUT === */
		--sidebar-width: 260px;
		--sidebar-collapsed: 72px;
		--header-height: 64px;
		--container-max-width: 1400px;
		--content-max-width: 1200px;

		/* === BREAKPOINTS === */
		--breakpoint-sm: 640px;
		--breakpoint-md: 768px;
		--breakpoint-lg: 1024px;
		--breakpoint-xl: 1280px;
		--breakpoint-2xl: 1536px;

		/* === Z-INDEX LAYERS === */
		--z-dropdown: 1000;
		--z-modal: 1050;
		--z-popover: 1100;
		--z-tooltip: 1150;
		--z-toast: 1200;

		/* === ADMIN-SPECIFIC VARIABLES (for backward compatibility) === */
		--admin-primary: var(--primary-color);
		--admin-primary-light: var(--primary-light);
		--admin-primary-dark: var(--primary-dark);
		--admin-secondary: var(--secondary-color);
		--admin-accent: var(--accent-color);
		--admin-bg-primary: var(--bg-primary);
		--admin-bg-secondary: var(--bg-secondary);
		--admin-bg-dark: var(--bg-dark);
		--admin-bg-accent: var(--bg-accent);
		--admin-text-primary: var(--text-primary);
		--admin-text-secondary: var(--text-secondary);
		--admin-text-muted: var(--text-muted);
		--admin-text-white: var(--text-white);
		--admin-text-label: var(--text-label);
		--admin-text-placeholder: var(--text-placeholder);
		--admin-border-light: var(--border-light);
		--admin-border-medium: var(--border-medium);
		--admin-border-dark: var(--border-dark);
		--admin-success: var(--success-color);
		--admin-success-light: var(--success-light);
		--admin-error: var(--error-color);
		--admin-error-light: var(--error-light);
		--admin-warning: var(--warning-color);
		--admin-warning-light: var(--warning-light);
		--admin-gradient-primary: var(--gradient-primary);
		--admin-gradient-header: var(--gradient-header);
		--admin-gradient-button: var(--gradient-button);
		--admin-shadow-sm: var(--shadow-sm);
		--admin-shadow-md: var(--shadow-md);
		--admin-shadow-lg: var(--shadow-lg);
		--admin-shadow-xl: var(--shadow-xl);
		--admin-space-1: var(--spacing-1);
		--admin-space-2: var(--spacing-2);
		--admin-space-3: var(--spacing-3);
		--admin-space-4: var(--spacing-4);
		--admin-space-5: var(--spacing-5);
		--admin-space-6: var(--spacing-6);
		--admin-space-8: var(--spacing-8);
		--admin-space-10: var(--spacing-10);
		--admin-space-12: var(--spacing-12);
		--admin-space-16: var(--spacing-16);
		--admin-space-20: var(--spacing-20);
		--admin-text-xs: var(--font-size-xs);
		--admin-text-sm: var(--font-size-sm);
		--admin-text-base: var(--font-size-base);
		--admin-text-lg: var(--font-size-lg);
		--admin-text-xl: var(--font-size-xl);
		--admin-text-2xl: var(--font-size-2xl);
		--admin-text-3xl: var(--font-size-3xl);
		--admin-text-4xl: var(--font-size-4xl);
		--admin-radius-sm: var(--radius-sm);
		--admin-radius-md: var(--radius-base);
		--admin-radius-lg: var(--radius-md);
		--admin-radius-xl: var(--radius-lg);
		--admin-radius-2xl: var(--radius-xl);
		--admin-transition-fast: var(--transition-fast);
		--admin-transition-normal: var(--transition-base);
		--admin-transition-slow: var(--transition-slow);
		--admin-sidebar-width: var(--sidebar-width);
		--admin-sidebar-collapsed: var(--sidebar-collapsed);
		--admin-header-height: var(--header-height);
		--admin-content-max-width: var(--container-max-width);
		--admin-bp-sm: var(--breakpoint-sm);
		--admin-bp-md: var(--breakpoint-md);
		--admin-bp-lg: var(--breakpoint-lg);
		--admin-bp-xl: var(--breakpoint-xl);
	}

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
