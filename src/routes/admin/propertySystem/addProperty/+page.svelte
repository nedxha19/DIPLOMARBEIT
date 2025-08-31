<script>
    import { enhance } from '$app/forms';
    let { form, data } = $props();
</script>

<section class="admin-container">
    <header class="form-header admin-section">
        <div class="header-content">
            <h1 class="admin-heading-1">Add New Property</h1>
            <p class="admin-text-body">Enter property details to add to your portfolio</p>
        </div>
    </header>

    <div class="form-content-wrapper">
        <form action="?/upload" method="POST" use:enhance enctype="multipart/form-data" class="property-form">
        
            <div class="form-section admin-card">
                <div class="section-header">
                    <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <h2 class="admin-heading-2">Property Image</h2>
                </div>
                <div class="file-input-wrapper">
                    <label class="file-input-label">
                        <input type="file" name="image" required class="file-input" />
                        <div class="file-input-display">
                            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <span class="upload-text">Choose property image</span>
                            <span class="upload-subtext">Upload a high-quality image (JPG, PNG)</span>
                        </div>
                    </label>
                </div>
            </div>

            <div class="form-section admin-card">
                <div class="section-header">
                    <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <h2 class="admin-heading-2">Property Details</h2>
                </div>

                <div class="admin-grid admin-grid-responsive">
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Location</span>
                            <input type="text" name="location" required class="admin-input" placeholder="e.g., Manhattan, New York" />
            </label>
        </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Property Type</span>
                            <input type="text" name="type" required class="admin-input" placeholder="e.g., Apartment, House, Condo" />
            </label>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Price (USD)</span>
                            <div class="input-with-icon">
                                <span class="input-icon">$</span>
                                <input type="number" step="0.01" name="price" required class="admin-input price-input" placeholder="0.00" />
                            </div>
            </label>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Bedrooms</span>
                            <input type="number" name="bedrooms" required class="admin-input" placeholder="0" min="0" />
            </label>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Bathrooms</span>
                            <input type="number" name="bathrooms" required class="admin-input" placeholder="0" min="0" />
            </label>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Square Footage</span>
                            <div class="input-with-suffix">
                                <input type="number" name="square_foot" required class="admin-input" placeholder="0" min="0" />
                                <span class="input-suffix">sqft</span>
                            </div>
            </label>
        </div>

                    <div class="form-group full-width">
                        <label class="form-label">
                            <span class="label-text">Address</span>
                            <input type="text" name="address" class="admin-input" placeholder="Full street address (optional)" />
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="admin-button-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Property
                </button>
            </div>
        </form>

        {#if form}
            <div class="success-message">
                <div class="success-content">
                    <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <h3 class="admin-heading-2">Property Added Successfully</h3>
                        <p class="admin-text-body">The property has been added to your portfolio.</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</section>

<style>
    /* Form Header */
    .form-header {
        background: var(--admin-gradient-header);
        color: var(--admin-text-white);
    }

    /* Force Header Text to White */
    .form-header .admin-heading-1,
    .form-header .admin-text-body {
        color: var(--admin-text-white) !important;
    }

    .header-content {
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }

    /* Form Content */
    .form-content-wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: 0;
    }

    .property-form {
        padding: var(--admin-space-8);
    }

.form-section {
        margin-bottom: var(--admin-space-8);
        padding: var(--admin-space-6);
        background: var(--admin-bg-accent);
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: var(--admin-space-3);
        margin-bottom: var(--admin-space-6);
        padding-bottom: var(--admin-space-4);
        border-bottom: 2px solid var(--admin-border-light);
    }

    /* Section Header Text Colors */
    .section-header .admin-heading-2 {
        color: var(--admin-text-primary) !important;
    }

    .section-icon {
        width: 24px;
        height: 24px;
        color: var(--admin-accent);
        stroke-width: 2;
    }

    .file-input-wrapper {
        margin-top: var(--admin-space-4);
    }

    .file-input-label {
        display: block;
        cursor: pointer;
    }

    .file-input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
}

    .file-input-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--admin-space-8);
        border: 2px dashed var(--admin-border-medium);
        border-radius: var(--admin-radius-lg);
        background: var(--admin-bg-secondary);
        transition: var(--admin-transition-normal);
        text-align: center;
    }

    .file-input-display:hover {
        border-color: var(--admin-accent);
    }

    .upload-icon {
        width: 48px;
        height: 48px;
        color: var(--admin-accent);
        stroke-width: 1.5;
        margin-bottom: var(--admin-space-4);
    }

    .upload-text {
        font-size: var(--admin-text-lg);
        font-weight: 600;
        color: var(--admin-text-primary);
        margin-bottom: var(--admin-space-1);
}

    .upload-subtext {
        font-size: var(--admin-text-sm);
        color: var(--admin-text-muted);
    }

    .form-group {
    display: flex;
    flex-direction: column;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
}

    .form-label {
        display: flex;
        flex-direction: column;
        gap: var(--admin-space-2);
}

    .label-text {
        font-size: var(--admin-text-base);
        font-weight: 600;
        color: var(--admin-text-label);
    }

    .input-with-icon {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: var(--admin-space-4);
        font-size: var(--admin-text-lg);
        font-weight: 600;
        color: var(--admin-text-muted);
        z-index: 1;
    }

    .price-input {
        padding-left: calc(var(--admin-space-4) + 20px) !important;
    }

    .input-with-suffix {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-suffix {
        position: absolute;
        right: var(--admin-space-4);
        font-size: var(--admin-text-base);
        font-weight: 500;
        color: var(--admin-text-muted);
        pointer-events: none;
    }

    .form-actions {
        display: flex;
        justify-content: center;
        margin-top: var(--admin-space-8);
        padding: var(--admin-space-8) var(--admin-space-6);
        background: var(--admin-bg-accent);
        border-top: 1px solid var(--admin-border-light);
        border-radius: 0 0 var(--admin-radius-xl) var(--admin-radius-xl);
    }

    /* Enhanced Submit Button */
    .form-actions .admin-button-primary {
        padding: var(--admin-space-4) var(--admin-space-8);
        font-size: var(--admin-text-lg);
        font-weight: 700;
        min-width: 200px;
        justify-content: center;
        box-shadow: var(--admin-shadow-lg);
        border-radius: var(--admin-radius-lg);
        transition: all 0.3s ease;
    }

    .form-actions .admin-button-primary:hover {
        transform: translateY(-2px);
        box-shadow: var(--admin-shadow-xl);
    }

    .form-actions .admin-button-primary svg {
        width: 20px;
        height: 20px;
        stroke-width: 2.5;
    }

    .success-message {
        margin: var(--admin-space-6) var(--admin-space-8) 0;
        padding: var(--admin-space-5);
        background: var(--admin-success-light);
        border: 1px solid var(--admin-success);
        border-radius: var(--admin-radius-lg);
        animation: slideIn 0.5s ease-out;
    }

    /* Success Message Text Colors */
    .success-message .admin-heading-2 {
        color: var(--admin-success) !important;
        margin-bottom: var(--admin-space-2);
    }

    .success-message .admin-text-body {
        color: var(--admin-text-primary) !important;
    }

    .success-content {
        display: flex;
        align-items: flex-start;
        gap: var(--admin-space-3);
    }

    .success-icon {
        width: 24px;
        height: 24px;
        color: var(--admin-success);
        stroke-width: 2;
        flex-shrink: 0;
        margin-top: 2px;
}

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

    /* Mobile-First Responsive Design */
    @media (max-width: 640px) {
        .form-content-wrapper {
            margin: 0 var(--admin-space-2);
        }

        .property-form {
            padding: var(--admin-space-6);
        }

        .form-section {
            padding: var(--admin-space-5);
            margin-bottom: var(--admin-space-6);
        }

        .file-input-display {
            padding: var(--admin-space-6);
        }

        .upload-icon {
            width: 40px;
            height: 40px;
        }

        .success-message {
            margin: var(--admin-space-5) var(--admin-space-6) 0;
            padding: var(--admin-space-4);
        }
    }
</style>