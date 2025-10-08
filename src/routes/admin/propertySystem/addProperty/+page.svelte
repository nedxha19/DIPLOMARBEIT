<script>
    import { enhance } from '$app/forms';
    let { form, data } = $props();
    
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
        return async ({ update }) => {
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
                            autocomplete="off"
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
                            autocomplete="off"
                        />
        </div>

                    <div class="form-group">
                        <label for="type">Property Type *</label>
                        <select id="type" name="type" bind:value={formData.type} required autocomplete="off">
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
                            autocomplete="off"
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
                            autocomplete="off"
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
                            autocomplete="off"
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
                            autocomplete="off"
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
                            autocomplete="street-address"
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

/* Optimized Header - Using Global Variables */
.page-header {
  background: var(--gradient-header);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  color: var(--text-white);
  margin-bottom: var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-lg);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-icon {
  width: var(--space-12);
  height: var(--space-12);
  background: var(--accent-color);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  color: var(--text-white);
}

.header-text h1 {
  margin: 0 0 var(--space-1) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-white);
}

.header-text p {
  margin: 0;
  opacity: 0.9;
  font-size: var(--font-size-sm);
  color: var(--text-white);
}

.header-stats {
  display: flex;
  gap: var(--space-3);
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
  min-width: var(--space-16);
}

.stat-card i {
  display: block;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2);
  color: var(--accent-color);
}

.stat-label {
  font-size: var(--font-size-xs);
  opacity: 0.9;
  color: var(--text-white);
}

/* Optimized Progress Steps */
.progress-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-8);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  opacity: 0.5;
  transition: var(--transition-normal);
}

.step.active,
.step.completed {
  opacity: 1;
}

.step-number {
  width: var(--space-8);
  height: var(--space-8);
  border-radius: var(--radius-full);
  background: var(--gray-200);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  transition: var(--transition-normal);
}

.step.active .step-number {
  background: var(--accent-color);
  color: var(--text-white);
  box-shadow: var(--shadow-outline);
}

.step.completed .step-number {
  background: var(--success-color);
  color: var(--text-white);
}

.step span {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  transition: var(--transition-fast);
}

.step.active span,
.step.completed span {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

/* Optimized Form Layout */
.form-content-wrapper {
  max-width: var(--container-lg);
  margin: 0 auto;
}

.property-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.form-section h3 {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.form-section h3 i {
  color: var(--accent-color);
  font-size: var(--font-size-base);
}

/* Optimized File Upload */
.file-upload {
  width: 100%;
}

.upload-area {
  display: block;
  width: 100%;
  padding: var(--space-8);
  border: 2px dashed var(--border-medium);
  border-radius: var(--radius-lg);
  background: var(--gray-50);
  cursor: pointer;
  transition: var(--transition-normal);
  text-align: center;
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: var(--bg-accent);
  transform: translateY(-1px);
}

.upload-area.has-file {
  border-color: var(--success-color);
  background: var(--success-light);
}

.upload-area input {
  display: none;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.upload-placeholder i {
  font-size: var(--font-size-4xl);
  color: var(--accent-color);
}

.upload-placeholder span {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.upload-placeholder small {
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.upload-success {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--success-color);
  font-weight: var(--font-weight-medium);
}

.upload-success i {
  font-size: var(--font-size-xl);
}

/* Optimized Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-label);
}

.form-group input,
.form-group select {
  padding: var(--space-3);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-sans);
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: var(--transition-fast);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: var(--shadow-outline);
}

.form-group input::placeholder {
  color: var(--text-placeholder);
}

/* Optimized Submit Button */
.form-actions {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  text-align: center;
  border: 1px solid var(--border-light);
}

.submit-btn {
  background: var(--gradient-button);
  color: var(--text-white);
  border: none;
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-sans);
  cursor: pointer;
  transition: var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-shadow: var(--shadow-md);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Optimized Success Message */
.success-message {
  background: var(--success-light);
  border: 1px solid var(--success-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.success-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.success-icon {
  color: var(--success-color);
  font-size: var(--font-size-xl);
  width: var(--space-6);
  height: var(--space-6);
}

.success-message h3 {
  margin: 0 0 var(--space-1) 0;
  color: var(--success-dark);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.success-message p {
  margin: 0;
  color: var(--success-dark);
  font-size: var(--font-size-sm);
}

/* Optimized Mobile Responsiveness */
@media (max-width: 768px) {
  .admin-container {
    padding: var(--space-4);
  }
  
  .page-header {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
    padding: var(--space-6);
  }
  
  .progress-steps {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>