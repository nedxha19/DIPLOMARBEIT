<script> 
import AdminSidebar from '$lib/components/AdminSidebar.svelte';
  import { writable } from 'svelte/store';
  import { page } from '$app/stores';
  export const isSidebarHidden = writable(false);

  // Check if the current route is an auth page
  $: isAuthPage = $page.url.pathname === '/admin/login' || $page.url.pathname === '/admin/register';
</script>

{#if isAuthPage}
  <slot />
{:else}
  <div class="admin-layout { $isSidebarHidden ? 'sidebar-hidden' : '' }">
    <AdminSidebar bind:isSidebarHidden={$isSidebarHidden} />
    <main class="content { $page.url.pathname === '/admin/calendarSchedule' ? 'no-padding' : '' }">
      <slot />
    </main>
  </div>
{/if}

<style>
  
  /* CSS Reset */
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-family-sans);
    color: var(--text-primary);
    background-color: var(--bg-primary);
  }

  /* === COMPREHENSIVE GLOBAL CSS DESIGN SYSTEM === */
  /* Professional-grade CSS custom properties for maintainable admin dashboard */
  :global(:root) {
    
    /* === CORE COLOR PALETTE === */
    --primary-color: #1a2236;
    --primary-light: #2d3748;
    --primary-dark: #0f1419;
    --accent-color: #0ea5e9;
    --accent-light: #38bdf8;
    --accent-dark: #0284c7;
    
    /* === SEMANTIC COLORS === */
    --success-color: #10b981;
    --success-light: #d1fae5;
    --success-dark: #065f46;
    --warning-color: #f59e0b;
    --warning-light: #fef3c7;
    --warning-dark: #92400e;
    --error-color: #ef4444;
    --error-light: #fee2e2;
    --error-dark: #dc2626;
    --info-color: #3b82f6;
    --info-light: #dbeafe;
    --info-dark: #1d4ed8;
    
    /* === NEUTRAL COLORS === */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    /* === BACKGROUND COLORS === */
    --bg-primary: var(--gray-50);
    --bg-secondary: #ffffff;
    --bg-accent: var(--gray-100);
    --bg-dark: var(--primary-color);
    --bg-overlay: rgba(0, 0, 0, 0.5);
    
    /* === TEXT COLORS === */
    --text-primary: var(--gray-900);
    --text-secondary: var(--gray-600);
    --text-muted: var(--gray-500);
    --text-disabled: var(--gray-400);
    --text-white: #ffffff;
    --text-inverse: var(--gray-100);
    --text-placeholder: var(--gray-400);
    --text-label: var(--gray-700);
    
    /* === BORDER COLORS === */
    --border-light: var(--gray-200);
    --border-medium: var(--gray-300);
    --border-dark: var(--gray-400);
    --border-focus: var(--accent-color);
    
    /* === GRADIENT SYSTEM === */
    --gradient-primary: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    --gradient-secondary: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
    --gradient-bg: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
    --gradient-header: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    --gradient-button: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
    --gradient-card: linear-gradient(135deg, #ffffff 0%, var(--gray-50) 100%);
    
    /* === TYPOGRAPHY SYSTEM === */
    --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --font-family-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, Consolas, monospace;
    
    /* Font Sizes */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;
    --font-size-6xl: 3.75rem;
    
    /* Font Weights */
    --font-weight-thin: 100;
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;
    --font-weight-black: 900;
    
    /* Line Heights */
    --line-height-tight: 1.25;
    --line-height-snug: 1.375;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;
    --line-height-loose: 2;
    
    /* === SPACING SYSTEM === */
    --space-0: 0;
    --space-px: 1px;
    --space-0-5: 0.125rem;
    --space-1: 0.25rem;
    --space-1-5: 0.375rem;
    --space-2: 0.5rem;
    --space-2-5: 0.625rem;
    --space-3: 0.75rem;
    --space-3-5: 0.875rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-7: 1.75rem;
    --space-8: 2rem;
    --space-9: 2.25rem;
    --space-10: 2.5rem;
    --space-11: 2.75rem;
    --space-12: 3rem;
    --space-14: 3.5rem;
    --space-16: 4rem;
    --space-20: 5rem;
    --space-24: 6rem;
    --space-28: 7rem;
    --space-32: 8rem;
    
    /* === SIZING SYSTEM === */
    --container-sm: 640px;
    --container-md: 768px;
    --container-lg: 1024px;
    --container-xl: 1280px;
    --container-2xl: 1536px;
    --container-max-width: 1400px;
    --content-max-width: 1200px;
    
    /* === BORDER RADIUS SYSTEM === */
    --radius-none: 0;
    --radius-sm: 0.125rem;
    --radius-base: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
    
    /* === SHADOW SYSTEM === */
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    --shadow-outline: 0 0 0 3px rgba(14, 165, 233, 0.5);
    --shadow-none: 0 0 #0000;
    
    /* === TRANSITION SYSTEM === */
    --timing-linear: linear;
    --timing-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --timing-ease-in: cubic-bezier(0.4, 0, 1, 1);
    --timing-ease-out: cubic-bezier(0, 0, 0.2, 1);
    --timing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --timing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    --duration-75: 75ms;
    --duration-100: 100ms;
    --duration-150: 150ms;
    --duration-200: 200ms;
    --duration-300: 300ms;
    --duration-500: 500ms;
    --duration-700: 700ms;
    --duration-1000: 1000ms;
    
    --transition-fast: all var(--duration-150) var(--timing-ease);
    --transition-normal: all var(--duration-300) var(--timing-ease);
    --transition-slow: all var(--duration-500) var(--timing-ease);
    
    /* === Z-INDEX SYSTEM === */
    --z-index-dropdown: 1000;
    --z-index-sticky: 1020;
    --z-index-fixed: 1030;
    --z-index-modal-backdrop: 1040;
    --z-index-modal: 1050;
    --z-index-popover: 1060;
    --z-index-tooltip: 1070;
    --z-index-toast: 1080;
    
    /* === COMPONENT-SPECIFIC VARIABLES === */
    --sidebar-width: 280px;
    --sidebar-width-collapsed: 80px;
    --sidebar-bg: var(--primary-color);
    --sidebar-active: var(--accent-color);
    --sidebar-hover: rgba(14, 165, 233, 0.15);
    
    --input-height: 2.5rem;
    --input-height-sm: 2rem;
    --input-height-lg: 3rem;
    --button-height: 2.5rem;
    --button-height-sm: 2rem;
    --button-height-lg: 3rem;
    
    --card-padding: var(--space-6);
    --card-border-radius: var(--radius-xl);
    --card-shadow: var(--shadow-md);
    
    /* === BREAKPOINTS === */
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
    
    /* === LEGACY COMPATIBILITY === */
    --admin-bg-primary: var(--gradient-bg);
    --admin-bg-secondary: var(--bg-secondary);
    --admin-bg-accent: var(--bg-accent);
    --admin-bg-dark: var(--bg-dark);
    --admin-gradient-header: var(--gradient-header);
    --admin-gradient-button: var(--gradient-button);
    --admin-text-white: var(--text-white);
    --admin-text-primary: var(--text-primary);
    --admin-text-secondary: var(--text-secondary);
    --admin-text-muted: var(--text-muted);
    --admin-text-label: var(--text-label);
    --admin-text-placeholder: var(--text-placeholder);
    --admin-accent: var(--accent-color);
    --admin-primary: var(--primary-color);
    --admin-secondary: var(--text-secondary);
    --admin-success: var(--success-color);
    --admin-success-light: var(--success-light);
    --admin-error: var(--error-color);
    --admin-error-light: var(--error-light);
    --admin-warning: var(--warning-color);
    --admin-border-light: var(--border-light);
    --admin-border-medium: var(--border-medium);
    --admin-border-dark: var(--border-dark);
    --admin-shadow-sm: var(--shadow-sm);
    --admin-shadow-md: var(--shadow-md);
    --admin-shadow-lg: var(--shadow-lg);
    --admin-shadow-xl: var(--shadow-xl);
    --admin-radius-sm: var(--radius-sm);
    --admin-radius-md: var(--radius-md);
    --admin-radius-lg: var(--radius-lg);
    --admin-radius-xl: var(--radius-xl);
    --admin-space-1: var(--space-1);
    --admin-space-2: var(--space-2);
    --admin-space-3: var(--space-3);
    --admin-space-4: var(--space-4);
    --admin-space-5: var(--space-5);
    --admin-space-6: var(--space-6);
    --admin-space-8: var(--space-8);
    --admin-space-10: var(--space-10);
      --admin-space-12: var(--space-12);
      --admin-space-16: var(--space-16);
      
      /* Content layout */
      --admin-content-max-width: 1200px;
      
      /* Transitions */
      --admin-transition-normal: var(--transition-normal);
      --admin-transition-slow: var(--transition-slow);
    --admin-text-xs: var(--font-size-xs);
    --admin-text-sm: var(--font-size-sm);
    --admin-text-base: var(--font-size-base);
    --admin-text-lg: var(--font-size-lg);
    --admin-text-xl: var(--font-size-xl);
    --admin-text-2xl: var(--font-size-2xl);
    --admin-text-3xl: var(--font-size-3xl);
    --admin-text-4xl: var(--font-size-4xl);
    --admin-font-weight-normal: var(--font-weight-normal);
    --admin-font-weight-medium: var(--font-weight-medium);
    --admin-font-weight-semibold: var(--font-weight-semibold);
    --admin-font-weight-bold: var(--font-weight-bold);
    --admin-line-height-tight: var(--line-height-tight);
    --admin-line-height-normal: var(--line-height-normal);
    --admin-transition-fast: var(--transition-fast);
    --admin-transition-normal: var(--transition-normal);
    --admin-content-max-width: var(--content-max-width);
    --admin-sidebar-width: var(--sidebar-width);
    --admin-sidebar-collapsed: var(--sidebar-width-collapsed);
  }

  /* === PROFESSIONAL MOBILE-FIRST RESPONSIVE DESIGN === */
  .admin-layout {
    display: flex;
    min-height: 100vh;
    transition: var(--admin-transition-normal);
  }

  .content {
    flex: 1;
    padding: 0;
    transition: var(--admin-transition-normal);
    background: transparent;
    min-height: 100vh;
    
    /* Mobile-first: Start with collapsed sidebar */
    margin-left: var(--admin-sidebar-collapsed);
  }

  /* Desktop: Expand sidebar */
  @media (min-width: 768px) {
    .content {
      margin-left: var(--admin-sidebar-width);
    }
  }

  .admin-layout.sidebar-hidden .content {
    margin-left: var(--admin-sidebar-collapsed);
  }

  .content.no-padding {
    padding: 0;
  }

  /* === OPTIMIZED GLOBAL UTILITY CLASSES === */
  :global(.admin-container) {
    padding: var(--space-8);
    max-width: var(--container-max-width);
    margin: 0 auto;
    background: var(--gradient-bg);
    min-height: 100vh;
    position: relative;
  }

  /* === SHARED ADMIN HEADER COMPONENT === */
  :global(.admin-page-header) {
    background: var(--gradient-header);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    color: var(--text-white);
    margin-bottom: var(--space-8);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-xl);
  }

  :global(.admin-header-content) {
    display: flex;
    align-items: center;
    gap: var(--space-6);
  }

  :global(.admin-header-icon) {
    width: var(--space-16);
    height: var(--space-16);
    background: var(--gradient-button);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-2xl);
    color: var(--text-white);
    box-shadow: var(--shadow-lg);
  }

  :global(.admin-header-text h1) {
    margin: 0 0 var(--space-2) 0;
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    color: var(--text-white) !important;
  }

  :global(.admin-header-text p) {
    margin: 0;
    color: var(--text-white) !important;
    opacity: 0.9;
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
  }

  :global(.admin-header-stats) {
    display: flex;
    gap: var(--space-4);
  }

  :global(.admin-stat-card) {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    text-align: center;
    min-width: var(--space-20);
  }

  :global(.admin-stat-card i) {
    display: block;
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-2);
    color: var(--accent-color);
  }

  :global(.admin-stat-number) {
    display: block;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    color: var(--text-white);
  }

  :global(.admin-stat-label) {
    display: block;
    font-size: var(--font-size-xs);
    opacity: 0.9;
    margin-top: var(--space-1);
    color: var(--text-white);
  }
  
  :global(.admin-container-full) {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--gradient-bg);
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  :global(.admin-container-auth) {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background: var(--sidebar-bg);
    padding: var(--space-4);
    font-family: var(--font-family-sans);
  }

  :global(.admin-card) {
    background: var(--bg-secondary);
    border-radius: var(--card-border-radius);
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border-light);
    overflow: hidden;
    padding: var(--card-padding);
  }

  :global(.admin-button-primary) {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--gradient-button);
    color: var(--text-white);
    border: none;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-lg);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-base);
    font-family: var(--font-family-sans);
    cursor: pointer;
    transition: var(--transition-normal);
    text-decoration: none;
    box-shadow: var(--shadow-md);
    line-height: 1;
  }

  :global(.admin-button-primary:hover) {
    background: var(--gradient-primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  :global(.admin-button-primary:focus) {
    outline: none;
    box-shadow: var(--shadow-outline);
  }

  :global(.admin-button-primary:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  :global(.admin-input) {
    width: 100%;
    height: var(--input-height);
    padding: 0 var(--space-4);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-family: var(--font-family-sans);
    background: var(--bg-secondary);
    color: var(--text-primary);
    transition: var(--transition-fast);
    line-height: 1.5;
  }

  :global(.admin-input:focus) {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: var(--shadow-outline);
  }

  :global(.admin-input::placeholder) {
    color: var(--text-placeholder);
    opacity: 1;
  }

  :global(.admin-input:disabled) {
    background: var(--bg-accent);
    color: var(--text-disabled);
    cursor: not-allowed;
  }

  /* === OPTIMIZED RESPONSIVE GRID SYSTEM === */
  :global(.admin-grid) {
    display: grid;
    gap: var(--space-6);
  }

  :global(.admin-grid-responsive) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    :global(.admin-grid-responsive) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    :global(.admin-grid-responsive) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* === OPTIMIZED TYPOGRAPHY SYSTEM === */
  :global(.admin-heading-1) {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    font-family: var(--font-family-sans);
    margin: 0;
    line-height: var(--line-height-tight);
    letter-spacing: -0.025em;
  }

  @media (min-width: 768px) {
    :global(.admin-heading-1) {
      font-size: var(--font-size-4xl);
    }
  }

  :global(.admin-heading-2) {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-family: var(--font-family-sans);
    margin: 0;
    line-height: var(--line-height-snug);
    letter-spacing: -0.015em;
  }

  @media (min-width: 768px) {
    :global(.admin-heading-2) {
      font-size: var(--font-size-2xl);
    }
  }

  :global(.admin-text-body) {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    font-family: var(--font-family-sans);
    line-height: var(--line-height-normal);
    margin: 0;
  }

  :global(.admin-text-label) {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-label);
    font-family: var(--font-family-sans);
    margin: 0;
    line-height: var(--line-height-normal);
  }

  /* === OPTIMIZED SPACING UTILITIES === */
  :global(.admin-section) {
    padding: var(--space-6) var(--space-4);
  }

  @media (min-width: 768px) {
    :global(.admin-section) {
      padding: var(--space-8) var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    :global(.admin-section) {
      padding: var(--space-10) var(--space-8);
    }
  }

  /* === ESSENTIAL TEXT COLOR UTILITIES === */
  :global(.text-primary) {
    color: var(--text-primary) !important;
  }

  :global(.text-secondary) {
    color: var(--text-secondary) !important;
  }

  :global(.text-muted) {
    color: var(--text-muted) !important;
  }

  :global(.text-white) {
    color: var(--text-white) !important;
  }

  :global(.text-label) {
    color: var(--text-label) !important;
  }

  :global(.text-success) {
    color: var(--success-color) !important;
  }

  :global(.text-error) {
    color: var(--error-color) !important;
  }

  :global(.text-warning) {
    color: var(--warning-color) !important;
  }

  /* === SCOPED ADMIN CONTENT STYLING === */
  /* Apply text colors only within admin containers to avoid conflicts */
  
  :global(.admin-container h1, .admin-container h2, .admin-container h3, .admin-container h4, .admin-container h5, .admin-container h6),
  :global(.admin-container-full h1, .admin-container-full h2, .admin-container-full h3, .admin-container-full h4, .admin-container-full h5, .admin-container-full h6) {
    color: var(--text-primary);
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    margin: 0;
  }

  :global(.admin-container p, .admin-container-full p) {
    color: var(--text-secondary);
    font-family: var(--font-family-sans);
    line-height: var(--line-height-normal);
    margin: 0;
  }

  :global(.admin-container span:not(.sidebar *), .admin-container-full span:not(.sidebar *)) {
    color: inherit;
    font-family: var(--font-family-sans);
  }

  :global(.admin-container label, .admin-container-full label) {
    color: var(--text-label);
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-medium);
  }

  /* === ADMIN DASHBOARD HEADER TEXT OVERRIDES === */
  /* Professional header styling with proper white text on gradient backgrounds */

  /* Base header containers */
  :global(.admin-container header.page-header),
  :global(.admin-container .page-header),
  :global(.admin-container .header),
  :global(.admin-container-full .header) {
    color: var(--text-white) !important;
    background: var(--gradient-header) !important;
  }

  /* All text elements in headers should be white */
  :global(.admin-container header.page-header *:not(.sidebar *)),
  :global(.admin-container .page-header *:not(.sidebar *)),
  :global(.admin-container .header *:not(.sidebar *)),
  :global(.admin-container-full .header *:not(.sidebar *)),
  :global(.admin-container-full header *:not(.sidebar *)) {
    color: var(--text-white) !important;
  }

  /* Specific override for chat app headers */
  :global(.chat-app .header),
  :global(.chat-app header) {
    color: var(--text-white) !important;
  }

  :global(.chat-app .header *),
  :global(.chat-app header *) {
    color: var(--text-white) !important;
  }

  /* Header content sections */
  :global(.admin-container .header-content),
  :global(.admin-container .header-left),
  :global(.admin-container .header-info),
  :global(.admin-container .header-text),
  :global(.admin-container-full .header-content),
  :global(.admin-container-full .header-left),
  :global(.admin-container-full .header-info),
  :global(.admin-container-full .header-text) {
    color: var(--text-white) !important;
  }

  /* Force all header children to inherit white color */
  :global(.admin-container .page-header),
  :global(.admin-container-full .header) {
    color: var(--text-white) !important;
  }

  :global(.admin-container .page-header .header-content *),
  :global(.admin-container .page-header .header-text *),
  :global(.admin-container-full .header .header-info *),
  :global(.admin-container-full .header .header-left *) {
    color: var(--text-white) !important;
  }

  /* Headings in headers - CRITICAL OVERRIDE */
  :global(.admin-container .page-header h1, .admin-container .page-header h2, .admin-container .page-header h3),
  :global(.admin-container .header h1, .admin-container .header h2, .admin-container .header h3),
  :global(.admin-container-full .header h1, .admin-container-full .header h2, .admin-container-full .header h3),
  :global(.admin-container header h1, .admin-container header h2, .admin-container header h3),
  :global(.admin-container-full header h1, .admin-container-full header h2, .admin-container-full header h3) {
    color: var(--text-white) !important;
    font-weight: var(--font-weight-bold) !important;
  }

  /* Property System specific override */
  :global(.admin-container .page-header .header-text h1),
  :global(.admin-container .page-header .header-text p),
  :global(.admin-container-full .header .header-info h1),
  :global(.admin-container-full .header .header-info p) {
    color: var(--text-white) !important;
  }

  /* Paragraphs and spans in headers */
  :global(.admin-container .page-header p, .admin-container .page-header span),
  :global(.admin-container .header p, .admin-container .header span),
  :global(.admin-container-full .header p, .admin-container-full .header span) {
    color: var(--text-white) !important;
    opacity: 0.9 !important;
  }

  /* Status indicators */
  :global(.admin-container .status, .admin-container-full .status) {
    color: var(--text-white) !important;
    opacity: 0.85 !important;
  }

  /* Stat cards styling */
  :global(.admin-container .stat-card, .admin-container-full .stat-card) {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: var(--text-white) !important;
  }

  :global(.admin-container .stat-card *, .admin-container-full .stat-card *) {
    color: var(--text-white) !important;
  }

  :global(.admin-container .stat-card i, .admin-container-full .stat-card i) {
    color: var(--accent-color) !important;
  }

  /* === ADMIN CONTENT AREA STYLING === */
  /* Fix content visibility and ensure proper contrast */
  
  :global(.admin-container),
  :global(.admin-container-full) {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  /* Action bars and content sections */
  :global(.admin-container .action-bar),
  :global(.admin-container-full .action-bar) {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
    border-bottom: 1px solid var(--border-light);
  }

  :global(.admin-container .action-bar h2),
  :global(.admin-container .action-bar .admin-heading-2),
  :global(.admin-container-full .action-bar h2),
  :global(.admin-container-full .action-bar .admin-heading-2) {
    color: var(--text-primary) !important;
    font-weight: var(--font-weight-bold) !important;
  }

  /* Properties and content sections */
  :global(.admin-container .properties-section),
  :global(.admin-container .admin-section),
  :global(.admin-container-full .properties-section),
  :global(.admin-container-full .admin-section) {
    background: transparent;
    color: var(--text-primary);
  }

  /* Property cards and content cards */
  :global(.admin-container .property-card),
  :global(.admin-container .content-card),
  :global(.admin-container-full .property-card),
  :global(.admin-container-full .content-card) {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-light);
  }

  /* Ensure all text in content areas is visible */
  :global(.admin-container .property-card *:not(.sidebar *)),
  :global(.admin-container .content-card *:not(.sidebar *)),
  :global(.admin-container-full .property-card *:not(.sidebar *)),
  :global(.admin-container-full .content-card *:not(.sidebar *)) {
    color: inherit !important;
  }

  /* === SIDEBAR TEXT OVERRIDES - CLEAN APPROACH === */
  /* Ensure sidebar components use their own scoped variables */
  
  :global(.sidebar) {
    /* Sidebar manages its own colors via scoped CSS variables */
    color: #f3f4f6; /* Fallback for proper contrast on dark background */
  }

  /* === AUTHENTICATION PAGES OVERRIDES === */
  /* Professional, clean system for auth pages on dark background */
  
  /* 1. Container base - ensure proper text inheritance */
  :global(.admin-container-auth) {
    color: var(--text-white) !important;
  }
  
  /* 2. Headers should be bright white for visibility */
  :global(.admin-container-auth h1, .admin-container-auth h2, .admin-container-auth h3, 
          .admin-container-auth h4, .admin-container-auth h5, .admin-container-auth h6) {
    color: var(--text-white) !important;
    font-weight: var(--font-weight-semibold);
  }
  
  /* 3. Body text should be visible with slight transparency */
  :global(.admin-container-auth p, .admin-container-auth span) {
    color: var(--text-white) !important;
    opacity: 0.9;
  }
  
  /* 4. Form labels should be white with good visibility */
  :global(.admin-container-auth label) {
    color: var(--text-white) !important;
    opacity: 0.85;
  }
  
  /* 5. Logo icons should be accent blue for brand consistency */
  :global(.admin-container-auth .logo-icon,
          .admin-container-auth .fa-user-cog,
          .admin-container-auth .fa-user-plus) {
    color: var(--accent-color) !important;
  }
  
  /* 6. Form input icons should be visible white */
  :global(.admin-container-auth .input-group i) {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  
  /* 7. Input fields with proper contrast */
  :global(.admin-container-auth input) {
    color: var(--text-white) !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  :global(.admin-container-auth input::placeholder) {
    color: rgba(255, 255, 255, 0.6) !important;
  }
  
  :global(.admin-container-auth input:focus) {
    border-color: var(--accent-color) !important;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3) !important;
  }
  
  /* 8. Buttons should have white text */
  :global(.admin-container-auth button) {
    color: var(--text-white) !important;
  }
  
  /* 9. Error messages with proper visibility */
  :global(.admin-container-auth .error-message) {
    color: #ef4444 !important;
    background: rgba(239, 68, 68, 0.1) !important;
    border-color: rgba(239, 68, 68, 0.3) !important;
  }

  /* === GLOBAL CHATBOT STYLES === */
  :global(.chatbot-floating-global) {
    position: fixed;
    bottom: var(--admin-space-6);
    right: var(--admin-space-6);
    z-index: 9999;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Ensure chatbot appears above sidebar */
  :global(.chatbot-container) {
    z-index: 1001;
  }

  /* Global chatbot animations */
  :global(.chatbot-bounce-in) {
    animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  :global(.chatbot-slide-up) {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes bounceIn {
    0% {
      transform: scale(0.3) translateY(20px);
      opacity: 0;
    }
    50% {
      transform: scale(1.05) translateY(-5px);
      opacity: 0.8;
    }
    70% {
      transform: scale(0.9) translateY(2px);
      opacity: 0.9;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Professional notification styles */
  :global(.notification-pulse) {
    animation: notificationPulse 2s infinite;
  }

  @keyframes notificationPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(14, 165, 233, 0);
    }
  }

  /* === OPTIMIZED RESPONSIVE DESIGN === */
  @media (max-width: 640px) {
    :global(.chatbot-floating-global) {
      bottom: var(--space-4);
      right: var(--space-4);
    }
    
    :global(.admin-container) {
      padding: var(--space-4);
    }
    
    :global(.admin-container-auth) {
      padding: var(--space-3);
    }
    
    /* Ensure headers remain white on mobile */
    :global(.page-header h1, .page-header p) {
      color: var(--text-white) !important;
    }
  }
  
  @media (min-width: 768px) {
    :global(.admin-container) {
      padding: var(--space-6);
    }
  }
  
  @media (min-width: 1024px) {
    :global(.admin-container) {
      padding: var(--space-8);
    }
  }

  /* === ENHANCED SCROLLBAR STYLES === */
  :global(.custom-scrollbar::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.custom-scrollbar::-webkit-scrollbar-track) {
    background: var(--admin-bg-accent);
    border-radius: var(--admin-radius-sm);
  }

  :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
    background: var(--admin-border-medium);
    border-radius: var(--admin-radius-sm);
    transition: background var(--admin-transition-fast);
  }

  :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
    background: var(--admin-accent);
  }

  /* Professional focus styles for accessibility */
  :global(.chatbot-focus-visible:focus-visible) {
    outline: 2px solid var(--admin-accent);
    outline-offset: 2px;
  }

  /* === ADMIN LAYOUT STRUCTURE === */
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--bg-primary);
  }

  .content {
    flex: 1;
    margin-left: 260px;
    background: var(--bg-primary);
    min-height: 100vh;
    padding: var(--space-6);
    transition: margin-left var(--transition-normal);
  }

  .content.no-padding {
    padding: 0;
  }

  .admin-layout.sidebar-hidden .content {
    margin-left: 72px;
  }

  @media (max-width: 768px) {
    .content {
      margin-left: 0;
      padding: var(--space-4);
    }
    
    .admin-layout.sidebar-hidden .content {
      margin-left: 0;
    }
  }

  /* Dark mode support for future expansion */
  @media (prefers-color-scheme: dark) {
    :global(.chatbot-auto-theme) {
      --chatbot-bg: var(--admin-bg-dark);
      --chatbot-text: var(--admin-text-white);
      --chatbot-border: var(--admin-border-dark);
    }
  }
</style>