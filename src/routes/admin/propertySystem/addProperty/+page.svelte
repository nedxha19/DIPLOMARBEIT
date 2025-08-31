<script>
    import { enhance } from '$app/forms';
    let { form, data } = $props();
    
    // Form state management
    let currentStep = $state(1);
    let formData = $state({
        image: null,
        location: '',
        type: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        square_foot: '',
        address: ''
    });
    
    // Update step based on form completion
    $effect(() => {
        if (formData.image) {
            currentStep = Math.max(currentStep, 2);
        }
        if (formData.location && formData.type && formData.price && formData.bedrooms && formData.bathrooms && formData.square_foot) {
            currentStep = Math.max(currentStep, 3);
        }
    });
    
    function handleFileChange(event) {
        formData.image = event.target.files[0];
    }
    
    function handleSubmit() {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                // Reset form
                formData = {
                    image: null,
                    location: '',
                    type: '',
                    price: '',
                    bedrooms: '',
                    bathrooms: '',
                    square_foot: '',
                    address: ''
                };
                currentStep = 1;
            }
            await update();
        };
    }
</script>

<section class="admin-container">
    <!-- Modern Header Section -->
    <header class="page-header">
        <div class="header-content">
            <div class="header-icon">
                <i class="fas fa-plus-circle"></i>
            </div>
            <div class="header-text">
                <h1>Add New Property</h1>
                <p>Expand your real estate portfolio with detailed property information</p>
            </div>
        </div>
        <div class="header-stats">
            <div class="stat-card">
                <i class="fas fa-upload"></i>
                <span class="stat-label">Quick Add</span>
            </div>
            <div class="stat-card">
                <i class="fas fa-shield-alt"></i>
                <span class="stat-label">Secure</span>
            </div>
        </div>
    </header>

    <!-- Progress Steps -->
    <div class="progress-section">
        <div class="progress-steps">
            <div class="step" class:active={currentStep >= 1} class:completed={currentStep > 1}>
                <div class="step-number">1</div>
                <span>Upload Image</span>
            </div>
            <div class="step" class:active={currentStep >= 2} class:completed={currentStep > 2}>
                <div class="step-number">2</div>
                <span>Property Details</span>
            </div>
            <div class="step" class:active={currentStep >= 3}>
                <div class="step-number">3</div>
                <span>Submit & Save</span>
            </div>
        </div>
    </div>

    <div class="form-content-wrapper">
        <form action="?/upload" method="POST" use:enhance={handleSubmit} enctype="multipart/form-data" class="property-form">
        
            <!-- Property Image Section -->
            <div class="form-section">
                <h3><i class="fas fa-camera"></i> Property Image</h3>
                <div class="file-upload">
                    <label for="image" class="upload-area" class:has-file={formData.image}>
                        <input 
                            type="file" 
                            id="image" 
                            name="image" 
                            required 
                            accept="image/*"
                            onchange={handleFileChange}
                        />
                        {#if formData.image}
                            <div class="upload-success">
                                <i class="fas fa-check-circle"></i>
                                <span>{formData.image.name}</span>
                </div>
                        {:else}
                            <div class="upload-placeholder">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Choose property image</span>
                                <small>JPG, PNG (max 5MB)</small>
                        </div>
                        {/if}
                    </label>
                </div>
            </div>

            <!-- Property Details Section -->
            <div class="form-section">
                <h3><i class="fas fa-info-circle"></i> Property Details</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="location">Location *</label>
                        <input 
                            type="text" 
                            id="location" 
                            name="location" 
                            bind:value={formData.location}
                            required 
                            placeholder="e.g., Manhattan, New York" 
                        />
        </div>

                    <div class="form-group">
                        <label for="type">Property Type *</label>
                        <select id="type" name="type" bind:value={formData.type} required>
                            <option value="">Select Property Type</option>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Condo">Condominium</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Villa">Villa</option>
                            <option value="Studio">Studio</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="price">Price (USD) *</label>
                        <input 
                            type="number" 
                            id="price" 
                            name="price" 
                            bind:value={formData.price}
                            step="0.01" 
                            required 
                            placeholder="0.00" 
                        />
                    </div>

                    <div class="form-group">
                        <label for="bedrooms">Bedrooms *</label>
                        <input 
                            type="number" 
                            id="bedrooms" 
                            name="bedrooms" 
                            bind:value={formData.bedrooms}
                            required 
                            min="0" 
                            placeholder="0" 
                        />
                    </div>

                    <div class="form-group">
                        <label for="bathrooms">Bathrooms *</label>
                        <input 
                            type="number" 
                            id="bathrooms" 
                            name="bathrooms" 
                            bind:value={formData.bathrooms}
                            required 
                            min="0" 
                            step="0.5" 
                            placeholder="0" 
                        />
                    </div>

                    <div class="form-group">
                        <label for="square_foot">Square Footage *</label>
                        <input 
                            type="number" 
                            id="square_foot" 
                            name="square_foot" 
                            bind:value={formData.square_foot}
                            required 
                            min="0" 
                            placeholder="0" 
                        />
        </div>

                    <div class="form-group full-width">
                        <label for="address">Full Address</label>
                        <input 
                            type="text" 
                            id="address" 
                            name="address" 
                            bind:value={formData.address}
                            placeholder="Full street address (optional)" 
                        />
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn">
                    <i class="fas fa-plus-circle"></i>
                    Add Property to Portfolio
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
/* Using global .admin-container - removing duplicate styles */

/* Header */
.page-header {
  background: var(--admin-gradient-header);
  border-radius: var(--admin-radius-lg);
  padding: var(--admin-space-8);
  color: var(--admin-text-white);
  margin-bottom: var(--admin-space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
    }

    .header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-color);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
}

.header-text h1 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
}

.header-text p {
  margin: 0;
  opacity: 0.8;
  font-size: var(--font-size-sm);
}

.header-stats {
  display: flex;
  gap: var(--spacing-2);
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-base);
  padding: var(--spacing-3);
        text-align: center;
  min-width: 60px;
}

.stat-card i {
  display: block;
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-1);
  color: var(--accent-color);
}

.stat-label {
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

/* Progress Steps */
.progress-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-8);
  box-shadow: var(--shadow-base);
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-8);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  opacity: 0.4;
  transition: var(--transition-base);
}

.step.active,
.step.completed {
  opacity: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--border-light);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
}

.step.active .step-number {
  background: var(--accent-color);
  color: var(--text-white);
}

.step.completed .step-number {
  background: var(--success-color);
  color: var(--text-white);
}

.step span {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
}

.step.active span,
.step.completed span {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

/* Form */
    .form-content-wrapper {
  max-width: 1000px;
        margin: 0 auto;
    }

    .property-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
    }

.form-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a2236;
        display: flex;
        align-items: center;
  gap: 0.5rem;
}

.form-section h3 i {
  color: #0ea5e9;
}

/* File Upload */
.file-upload {
  width: 100%;
}

.upload-area {
  display: block;
  width: 100%;
  padding: 2rem;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.upload-area:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.upload-area.has-file {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-area input {
  display: none;
}

.upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
  gap: 0.5rem;
}

.upload-placeholder i {
  font-size: 2rem;
  color: #0ea5e9;
}

.upload-placeholder span {
  font-weight: 500;
  color: #1a2236;
}

.upload-placeholder small {
  color: #6b7280;
  font-size: 0.8rem;
}

.upload-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 500;
}

.upload-success i {
  font-size: 1.25rem;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
    }

    .form-group {
    display: flex;
    flex-direction: column;
  gap: 0.5rem;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* Submit Button */
.form-actions {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.submit-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: inline-flex;
        align-items: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Message */
    .success-message {
  background: #f0fdf4;
  border: 1px solid #16a34a;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
    }

    .success-content {
        display: flex;
  align-items: center;
  gap: 0.75rem;
    }

    .success-icon {
  color: #16a34a;
  font-size: 1.25rem;
}

.success-message h3 {
  margin: 0 0 0.25rem 0;
  color: #166534;
  font-size: 1rem;
  font-weight: 600;
}

.success-message p {
  margin: 0;
  color: #15803d;
  font-size: 0.875rem;
}

/* Mobile */
@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
        }
    }
</style>