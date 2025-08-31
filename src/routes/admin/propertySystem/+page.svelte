<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
</script>

<div class="admin-container">
    <header class="admin-page-header">
        <div class="admin-header-content">
            <div class="admin-header-icon">
                <i class="fas fa-building"></i>
            </div>
            <div class="admin-header-text">
                <h1>Property System</h1>
                <p>Comprehensive property management and portfolio overview</p>
            </div>
        </div>
        <div class="admin-header-stats">
            <div class="admin-stat-card">
                <i class="fas fa-home"></i>
                <span class="admin-stat-number">{data.properties.length}</span>
                <span class="admin-stat-label">Properties</span>
            </div>
            <div class="admin-stat-card">
                <i class="fas fa-chart-line"></i>
                <span class="admin-stat-number">${(data.properties.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M</span>
                <span class="admin-stat-label">Portfolio</span>
            </div>
        </div>
    </header>

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
</div>

<style>
    /* Header styles now handled by global admin-page-header classes */

    /* Optimized Action Bar */
    .action-bar {
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-light);
        padding: var(--space-6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-4);
        border-radius: var(--radius-lg);
        margin-bottom: var(--space-6);
    }

    .action-bar .admin-heading-2 {
        color: var(--text-primary) !important;
    }

    /* Optimized Properties Grid */
    .properties-section {
        max-width: var(--container-xl);
        margin: 0 auto;
    }

    .property-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--space-6);
    }

    .property-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: var(--transition-normal);
        height: 450px;
        border: 1px solid var(--border-light);
    }

    .property-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
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
        transition: var(--transition-slow);
    }

    .property-card:hover .property-image {
        transform: scale(1.05);
    }

    .property-info {
        padding: var(--space-4);
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: var(--bg-secondary);
    }

    .property-name {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-bold);
        color: var(--accent-color);
        margin-bottom: var(--space-2);
    }

    .property-address {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
        margin-bottom: var(--space-3);
    }

    .property-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: var(--space-3) 0;
    }

    .stat {
        display: flex;
        align-items: center;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        font-weight: var(--font-weight-medium);
    }

    .stat .icon {
        font-size: var(--font-size-lg);
        margin-right: var(--space-2);
        color: var(--text-muted);
    }

    hr {
        border: none;
        border-top: 1px solid var(--border-light);
        margin: var(--space-2) 0;
    }

    .property-price-type {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .property-price {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-bold);
        color: var(--accent-color);
    }

    .property-type {
        font-size: var(--font-size-sm);
        font-style: italic;
        color: var(--text-muted);
    }

    .delete-button {
        margin-top: var(--space-3);
        background: var(--error-color);
        color: var(--text-white);
        border: none;
        padding: var(--space-3);
        border-radius: var(--radius-md);
        cursor: pointer;
        width: 100%;
        font-weight: var(--font-weight-semibold);
        font-family: var(--font-family-sans);
        transition: var(--transition-fast);
    }

    .delete-button:hover {
        background: var(--error-dark);
        transform: translateY(-1px);
    }

    /* Optimized Mobile Responsiveness */
    @media (max-width: 768px) {
        .admin-container {
            padding: var(--space-4);
        }

        .action-bar {
            flex-direction: column;
            align-items: stretch;
            padding: var(--space-4);
        }

        .property-grid {
            grid-template-columns: 1fr;
            gap: var(--space-4);
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