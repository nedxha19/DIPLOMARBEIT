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

  /* === ADMIN LAYOUT SYSTEM === */
  /* Uses centralized design system from design-system.css */
  /* This file only contains layout-specific styles */

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
    color: var(--text-primary, #000000);
  }

  :global(.text-secondary) {
    color: var(--text-secondary, #4b5563);
  }

  :global(.text-muted) {
    color: var(--text-muted, #6b7280);
  }

  :global(.text-white) {
    color: var(--text-white, #ffffff);
  }

  :global(.text-label) {
    color: var(--text-label, #374151);
  }

  :global(.text-success) {
    color: var(--success-color, #10b981);
  }

  :global(.text-error) {
    color: var(--error-color, #ef4444);
  }

  :global(.text-warning) {
    color: var(--warning-color, #f59e0b);
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

  /* === ADMIN DASHBOARD HEADER STYLES === */
  /* Professional header styling with proper white text on gradient backgrounds */

  /* Base header containers */
  :global(.admin-page-header) {
    color: var(--text-white, #ffffff);
    background: var(--gradient-header, linear-gradient(135deg, #1a2236 0%, #0ea5e9 100%));
  }

  /* All text elements in headers use white text */
  :global(.admin-page-header h1),
  :global(.admin-page-header h2),
  :global(.admin-page-header h3),
  :global(.admin-page-header p),
  :global(.admin-page-header span) {
    color: var(--text-white, #ffffff);
  }

  /* Chat app header styles */
  :global(.chat-app .header),
  :global(.chat-app header) {
    color: var(--text-white, #ffffff);
  }

  :global(.chat-app .header *),
  :global(.chat-app header *) {
    color: var(--text-white, #ffffff);
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

  /* === AUTHENTICATION PAGES STYLES === */
  /* Professional, clean system for auth pages on dark background */
  
  :global(.admin-container-auth) {
    color: var(--text-white, #ffffff);
  }
  
  :global(.admin-container-auth h1), 
  :global(.admin-container-auth h2), 
  :global(.admin-container-auth h3), 
  :global(.admin-container-auth h4), 
  :global(.admin-container-auth h5), 
  :global(.admin-container-auth h6) {
    color: var(--text-white, #ffffff);
    font-weight: var(--font-weight-semibold, 600);
  }
  
  :global(.admin-container-auth p), 
  :global(.admin-container-auth span) {
    color: var(--text-white, #ffffff);
    opacity: 0.9;
  }
  
  :global(.admin-container-auth label) {
    color: var(--text-white, #ffffff);
    opacity: 0.85;
  }
  
  :global(.admin-container-auth .logo-icon),
  :global(.admin-container-auth .fa-user-cog),
  :global(.admin-container-auth .fa-user-plus) {
    color: var(--accent-color, #0ea5e9);
  }
  
  :global(.admin-container-auth .input-group i) {
    color: rgba(255, 255, 255, 0.7);
  }
  
  :global(.admin-container-auth input) {
    color: var(--text-white, #ffffff);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  :global(.admin-container-auth input::placeholder) {
    color: rgba(255, 255, 255, 0.6);
  }
  
  :global(.admin-container-auth input:focus) {
    border-color: var(--accent-color, #0ea5e9);
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3);
  }
  
  :global(.admin-container-auth button) {
    color: var(--text-white, #ffffff);
  }
  
  :global(.admin-container-auth .error-message) {
    color: var(--error-color, #ef4444);
    background: var(--error-light, rgba(239, 68, 68, 0.1));
    border-color: rgba(239, 68, 68, 0.3);
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