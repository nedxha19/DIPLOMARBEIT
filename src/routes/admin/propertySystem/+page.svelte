<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
</script>

<div class="admin-container">
    <header class="page-header">
        <div class="header-content">
            <div class="header-icon">
                <i class="fas fa-building"></i>
            </div>
            <div class="header-text">
                <h1>Property System</h1>
                <p>Comprehensive property management and portfolio overview</p>
            </div>
        </div>
        <div class="header-stats">
            <div class="stat-card">
                <i class="fas fa-home"></i>
                <span class="stat-number">{data.properties.length}</span>
                <span class="stat-label">Properties</span>
            </div>
            <div class="stat-card">
                <i class="fas fa-chart-line"></i>
                <span class="stat-number">${(data.properties.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M</span>
                <span class="stat-label">Portfolio</span>
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
    /* Using global .admin-container - removing duplicate styles */

    /* Header Section */
    .page-header {
        background: var(--admin-gradient-header);
        border-radius: var(--admin-radius-xl);
        padding: var(--admin-space-8);
        color: var(--admin-text-white);
        margin-bottom: var(--admin-space-8);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--admin-shadow-xl);
    }

    .header-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-6);
    }

    .header-icon {
        width: 64px;
        height: 64px;
        background: var(--gradient-button);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-2xl);
        box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
    }

    .header-text h1 {
        margin: 0 0 var(--spacing-2) 0;
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
    }

    .header-text p {
        margin: 0;
        opacity: 0.9;
        font-size: var(--font-size-base);
        line-height: var(--line-height-normal);
    }

    .header-stats {
        display: flex;
        gap: var(--spacing-4);
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-lg);
        padding: var(--spacing-4);
        text-align: center;
        min-width: 80px;
    }

    .stat-card i {
        display: block;
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-2);
        color: var(--accent-color);
    }

    .stat-number {
        display: block;
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
    }

    .stat-label {
        display: block;
        font-size: var(--font-size-xs);
        opacity: 0.8;
        margin-top: var(--spacing-1);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .admin-container {
            padding: var(--spacing-4);
        }
        
        .page-header {
            padding: var(--spacing-6);
            flex-direction: column;
            gap: var(--spacing-4);
            text-align: center;
        }
        
        .header-stats {
            justify-content: center;
        }
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