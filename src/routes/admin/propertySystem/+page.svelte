<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
</script>

<section class="admin-container">
    <div class="dashboard-header admin-section">
        <div class="header-content">
            <h1 class="admin-heading-1">Property Management</h1>
            <p class="admin-text-body">Manage your real estate portfolio</p>
        </div>
        <div class="metrics-grid">
            <div class="metric-card admin-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                </div>
                <div class="metric-info">
                    <span class="metric-value">{data.properties?.length || 0}</span>
                    <span class="metric-label">Total Properties</span>
                </div>
            </div>
            
            <div class="metric-card admin-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                </div>
                <div class="metric-info">
                    <span class="metric-value">${(data.properties?.reduce((sum, p) => sum + p.price, 0) || 0).toLocaleString()}</span>
                    <span class="metric-label">Total Value</span>
                </div>
            </div>
            
            <div class="metric-card admin-card">
                <div class="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                </div>
                <div class="metric-info">
                    <span class="metric-value">${data.properties?.length ? Math.round(data.properties.reduce((sum, p) => sum + p.price, 0) / data.properties.length).toLocaleString() : '0'}</span>
                    <span class="metric-label">Avg. Value</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
        <h2 class="admin-heading-2">Property Portfolio</h2>
        <a href="/admin/propertySystem/addProperty" class="admin-button-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Property
        </a>
    </div>

    <!-- Properties Grid -->
    <div class="properties-section admin-section">
        <div class="property-grid">
            {#each data.properties as property (property.id)}
                <div class="property-card">
                    <div class="image-container">
                        <img src={property.image} alt="Property House" class="property-image" />
                    </div>
                    <div class="property-info">
                        <h2 class="property-name">{property.location} — {property.type}</h2>
                        <p class="property-address">{property.address}</p>
                        <hr />
                        <div class="property-stats">
                            <div class="stat">
                                <i class="fas fa-ruler-combined icon"></i>
                                <span>{property.square_foot} sqft</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-bath icon"></i>
                                <span>{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-bed icon"></i>
                                <span>{property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <hr />
                        <div class="property-price-type">
                            <span class="property-price">${property.price.toLocaleString()}</span>
                            <span class="property-type">{property.type}</span>
                        </div>
                        <form action="?/deleteProperty" method="POST" use:enhance>
                            <input type="hidden" name="id" value={property.id} />
                            <button type="submit" class="delete-button">Delete</button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    /* Dashboard Header */
    .dashboard-header {
        background: var(--admin-gradient-header);
        color: var(--admin-text-white);
    }

    /* Force Header Text to White */
    .dashboard-header .admin-heading-1,
    .dashboard-header .admin-text-body {
        color: var(--admin-text-white) !important;
    }

    .header-content {
        text-align: center;
        margin-bottom: var(--admin-space-8);
    }

    /* Metrics Grid */
    .metrics-grid {
        max-width: var(--admin-content-max-width);
        margin: 0 auto;
    }

    .metric-card {
        padding: var(--admin-space-6);
        background: rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        display: flex;
        align-items: center;
        gap: var(--admin-space-4);
        transition: var(--admin-transition-normal);
    }

    .metric-card:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        transform: translateY(-2px);
    }

    .metric-icon {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--admin-radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .metric-icon svg {
        width: 24px;
        height: 24px;
        stroke-width: 2;
    }

    .metric-info {
        display: flex;
        flex-direction: column;
    }

    .metric-value {
        font-size: var(--admin-text-2xl);
        font-weight: 700;
        margin-bottom: var(--admin-space-2);
    }

    .metric-label {
        font-size: var(--admin-text-sm);
        opacity: 0.8;
    }

    /* Action Bar */
    .action-bar {
        background: var(--admin-bg-secondary);
        border-bottom: 1px solid var(--admin-border-light);
        padding: var(--admin-space-6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--admin-space-4);
    }

    /* Action Bar Header Colors */
    .action-bar .admin-heading-2 {
        color: var(--admin-text-primary) !important;
    }

    /* Properties Grid - Original Structure Preserved */
    .properties-section {
        max-width: var(--admin-content-max-width);
        margin: 0 auto;
    }

    .property-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--admin-space-6);
    }

    .property-card {
        background-color: var(--admin-bg-secondary);
        border-radius: var(--admin-radius-xl);
        overflow: hidden;
        box-shadow: var(--admin-shadow-md);
        transition: var(--admin-transition-normal);
        height: 450px;
    }

    .property-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--admin-shadow-xl);
    }

    .image-container {
        width: 100%;
        height: 50%;
        overflow: hidden;
    }

    .property-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .property-info {
        padding: var(--admin-space-4);
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f8f9fa;
    }

    .property-name {
        font-size: var(--admin-text-lg);
        font-weight: bold;
        color: var(--admin-accent);
        margin-bottom: var(--admin-space-2);
    }

    .property-address {
        font-size: var(--admin-text-sm);
        color: var(--admin-text-muted);
        margin-bottom: var(--admin-space-3);
    }

    .property-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: var(--admin-space-3) 0;
    }

    .stat {
        display: flex;
        align-items: center;
        font-size: var(--admin-text-sm);
        color: var(--admin-text-secondary);
        font-weight: 500;
    }

    .stat .icon {
        font-size: var(--admin-text-lg);
        margin-right: var(--admin-space-1);
        color: var(--admin-text-muted);
    }

    hr {
        border: none;
        border-top: 1px solid var(--admin-border-light);
        margin: var(--admin-space-2) 0;
    }

    .property-price-type {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .property-price {
        font-size: var(--admin-text-base);
        font-weight: bold;
        color: var(--admin-accent);
    }

    .property-type {
        font-size: var(--admin-text-sm);
        font-style: italic;
        color: var(--admin-text-muted);
    }

    .delete-button {
        margin-top: var(--admin-space-3);
        background-color: var(--admin-error);
        color: var(--admin-text-white);
        border: none;
        padding: var(--admin-space-3);
        border-radius: var(--admin-radius-md);
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        transition: var(--admin-transition-fast);
    }

    .delete-button:hover {
        background-color: #c82333;
    }

    /* Mobile-First Responsive Design */
    @media (max-width: 640px) {
        .action-bar {
            flex-direction: column;
            align-items: stretch;
        }

        .property-grid {
            grid-template-columns: 1fr;
            gap: var(--admin-space-4);
        }

        .property-card {
            height: auto;
            min-height: 400px;
        }

        .image-container {
            height: 200px;
        }
    }
</style>