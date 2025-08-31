<script>
  import { enhance } from '$app/forms';
  export let data;

  let selectedPropertyId = '';
  let selectedProperty = null;
  let showForm = false;
  let loading = false;

  function addItem(name, placeholder) {
    const container = document.querySelector(`input[name="${name}"]`)?.closest('.dynamic-list');
    if (!container) return;
    const newItem = document.createElement('div');
    newItem.className = 'list-item';
    newItem.innerHTML = `<input type="text" name="${name}" placeholder="e.g., ${placeholder} - distance" /><button type="button" class="remove-item">×</button>`;
    newItem.querySelector('.remove-item').addEventListener('click', () => newItem.remove());
    container.appendChild(newItem);
  }

  function removeItem(button) {
    button.closest('.list-item')?.remove();
  }

  if (typeof window !== 'undefined') {
    window.addItem = addItem;
    window.removeItem = removeItem;
  }
  
  function selectProperty() {
    if (selectedPropertyId) {
      selectedProperty = data.properties.find(p => p.id == selectedPropertyId);
      showForm = true;
    } else {
      selectedProperty = null;
      showForm = false;
    }
  }
  
  function handleSubmit() {
    loading = true;
    return async ({ result, update }) => {
      loading = false;
      const message = result.type === 'success' ? 'Property details saved successfully!' : 'Failed to save property details. Please try again.';
      alert(message);
      if (result.type === 'success') await update();
    };
  }
  
  function deleteDetails(detailsId) {
    if (confirm('Delete property details?')) {
      const formData = new FormData();
      formData.append('details_id', detailsId);
      fetch('?/deleteDetails', { method: 'POST', body: formData }).then(() => location.reload());
    }
  }
</script>

<div class="admin-container">
  <!-- Header Section -->
  <header class="page-header">
    <div class="header-content">
      <div class="header-icon">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <div class="header-text">
        <h1>Property Details Management</h1>
        <p>Create comprehensive property listings with detailed information, media, and location data</p>
      </div>
    </div>
    <div class="header-stats">
      <div class="stat-card">
        <i class="fas fa-home"></i>
        <span class="stat-number">{data.properties.length}</span>
        <span class="stat-label">Properties</span>
      </div>
      <div class="stat-card">
        <i class="fas fa-file-alt"></i>
        <span class="stat-number">{data.existingDetails.length}</span>
        <span class="stat-label">Detailed</span>
      </div>
    </div>
  </header>

  <!-- Property Selection -->
  <div class="selection-section">
    <div class="section-header">
      <h2>
        <i class="fas fa-search"></i>
        Select Property to Manage
      </h2>
      <p>Choose a property to create or edit detailed information</p>
    </div>
    
    <div class="property-selector">
      <div class="search-container">
        <i class="fas fa-building search-icon"></i>
        <select 
          bind:value={selectedPropertyId} 
          on:change={selectProperty}
          class="property-select"
        >
          <option value="">Choose a property...</option>
          {#each data.properties as property}
            <option value={property.id}>
              {property.location} - {property.type} • ${property.price.toLocaleString()}
            </option>
          {/each}
        </select>
      </div>
      
      {#if selectedProperty}
        <div class="selected-property-card">
          <div class="property-card-header">
            <div class="property-icon">
              <i class="fas fa-home"></i>
            </div>
            <div class="property-info">
              <h3>{selectedProperty.location}</h3>
              <span class="property-type">{selectedProperty.type}</span>
            </div>
            <div class="property-price">
              ${selectedProperty.price.toLocaleString()}
            </div>
          </div>
          <div class="property-card-body">
            <div class="property-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>{selectedProperty.address}</span>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Property Details Form -->
  {#if showForm && selectedProperty}
    <div class="details-form">
      <div class="form-header">
        <div class="form-title">
          <i class="fas fa-edit"></i>
          <h2>Property Details Form</h2>
        </div>
        <p>Complete detailed information for <strong>{selectedProperty.location}</strong></p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 25%"></div>
        </div>
      </div>
      
      <form method="POST" action="?/saveDetails" enctype="multipart/form-data" use:enhance={handleSubmit}>
        <input type="hidden" name="property_id" value={selectedPropertyId} />
        
        <div class="form-sections">
          <!-- Basic Information -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-info-circle"></i>
              </div>
              <div>
                <h3>Basic Information</h3>
                <p>Essential property details and specifications</p>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="title">
                  <i class="fas fa-tag"></i>
                  Property Title
                </label>
                <input type="text" id="title" name="title" placeholder="Enter custom title or leave blank for auto-generated" />
              </div>

              <div class="form-group">
                <label for="property_type">
                  <i class="fas fa-building"></i>
                  Property Type *
                </label>
                <select id="property_type" name="property_type" required>
                  <option value="">Select Property Type</option>
                  <option value="Single Family Home">🏠 Single Family Home</option>
                  <option value="Condominium">🏢 Condominium</option>
                  <option value="Townhouse">🏘️ Townhouse</option>
                  <option value="Apartment">🏠 Apartment</option>
                  <option value="Villa">🏖️ Villa</option>
                  <option value="Duplex">🏘️ Duplex</option>
                </select>
              </div>

              <div class="form-group">
                <label for="year_built">
                  <i class="fas fa-calendar"></i>
                  Year Built *
                </label>
                <input type="number" id="year_built" name="year_built" min="1800" max="2024" required />
              </div>

              <div class="form-group">
                <label for="square_footage">
                  <i class="fas fa-ruler-combined"></i>
                  Square Footage *
                </label>
                <input type="number" id="square_footage" name="square_footage" min="1" required />
              </div>

              <div class="form-group">
                <label for="lot_size">
                  <i class="fas fa-expand-arrows-alt"></i>
                  Lot Size
                </label>
                <input type="text" id="lot_size" name="lot_size" placeholder="e.g., 0.35 acres" />
              </div>

              <div class="form-group">
                <label for="bedrooms">
                  <i class="fas fa-bed"></i>
                  Bedrooms *
                </label>
                <input type="number" id="bedrooms" name="bedrooms" min="0" required />
              </div>

              <div class="form-group">
                <label for="bathrooms">
                  <i class="fas fa-bath"></i>
                  Bathrooms *
                </label>
                <input type="number" id="bathrooms" name="bathrooms" min="0" step="0.5" required />
              </div>

              <div class="form-group full-width">
                <label for="overview_description">
                  <i class="fas fa-align-left"></i>
                  Property Overview *
                </label>
                <textarea id="overview_description" name="overview_description" rows="6" required
                          placeholder="Describe the property's unique features, layout, and highlights..."></textarea>
              </div>
            </div>
          </section>

          <!-- Property Features -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-cog"></i>
              </div>
              <div>
                <h3>Property Features</h3>
                <p>Additional features and amenities of the property</p>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label for="garage">
                  <i class="fas fa-car"></i>
                  Garage
                </label>
                <input type="text" id="garage" name="garage" placeholder="e.g., 2-car attached" />
              </div>

              <div class="form-group">
                <label for="heating">
                  <i class="fas fa-fire"></i>
                  Heating
                </label>
                <input type="text" id="heating" name="heating" placeholder="e.g., Central forced air" />
              </div>

              <div class="form-group">
                <label for="cooling">
                  <i class="fas fa-snowflake"></i>
                  Cooling
                </label>
                <input type="text" id="cooling" name="cooling" placeholder="e.g., Central air conditioning" />
              </div>

              <div class="form-group">
                <label for="architecture">
                  <i class="fas fa-drafting-compass"></i>
                  Architecture
                </label>
                <input type="text" id="architecture" name="architecture" placeholder="e.g., Modern contemporary" />
              </div>

              <div class="form-group">
                <label for="roof">
                  <i class="fas fa-home"></i>
                  Roof
                </label>
                <input type="text" id="roof" name="roof" placeholder="e.g., Tile" />
              </div>

              <div class="form-group">
                <label for="exterior">
                  <i class="fas fa-paint-brush"></i>
                  Exterior
                </label>
                <input type="text" id="exterior" name="exterior" placeholder="e.g., Stucco" />
              </div>
            </div>
          </section>

          <!-- Gallery & Media -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-images"></i>
              </div>
              <div>
                <h3>Gallery & Media</h3>
                <p>Upload images and media files for the property</p>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="gallery_images">
                  <i class="fas fa-camera"></i>
                  Gallery Images *
                </label>
                <input type="file" id="gallery_images" name="gallery_images" accept="image/*" multiple required />
                <small class="help-text">Upload multiple images for the property gallery carousel</small>
              </div>

              <div class="form-group full-width">
                <label for="video_tour">
                  <i class="fas fa-video"></i>
                  Video Tour
                </label>
                <input type="file" id="video_tour" name="video_tour" accept="video/*" />
                <small class="help-text">Upload a video tour of the property</small>
              </div>

              <div class="form-group full-width">
                <label for="virtual_tour_url">
                  <i class="fas fa-vr-cardboard"></i>
                  Virtual Tour URL
                </label>
                <input type="url" id="virtual_tour_url" name="virtual_tour_url" placeholder="https://..." />
              </div>
            </div>
          </section>

          <!-- What's Nearby -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-map-marked-alt"></i>
              </div>
              <div>
                <h3>What's Nearby</h3>
                <p>Points of interest and amenities around the property</p>
              </div>
            </div>
            <div class="nearby-section">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="nearby_schools">
                    <i class="fas fa-graduation-cap"></i>
                    Schools & Education
                  </label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" id="nearby_schools" name="nearby_schools[]" placeholder="e.g., Cupertino High School - 1.2 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_schools[]', 'School')}>+ Add School</button>
                </div>

                <div class="form-group full-width">
                  <label for="nearby_shopping">
                    <i class="fas fa-shopping-cart"></i>
                    Shopping & Amenities
                  </label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" id="nearby_shopping" name="nearby_shopping[]" placeholder="e.g., Valley Fair Shopping Center - 4.8 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_shopping[]', 'Shopping')}>+ Add Shopping</button>
                </div>

                <div class="form-group full-width">
                  <label for="nearby_companies">
                    <i class="fas fa-briefcase"></i>
                    Companies & Offices
                  </label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" id="nearby_companies" name="nearby_companies[]" placeholder="e.g., Apple Campus - 5.2 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_companies[]', 'Company')}>+ Add Company</button>
                </div>

                <div class="form-group full-width">
                  <label for="nearby_transport">
                    <i class="fas fa-subway"></i>
                    Transportation
                  </label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" id="nearby_transport" name="nearby_transport[]" placeholder="e.g., San Jose International Airport - 12.5 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_transport[]', 'Transport')}>+ Add Transport</button>
                </div>
              </div>
            </div>
          </section>

          <!-- Location -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h3>Location</h3>
                <p>Location details and map information</p>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="location_description">
                  <i class="fas fa-align-left"></i>
                  Location Description *
                </label>
                <textarea id="location_description" name="location_description" rows="6" required
                          placeholder="Describe the location and neighborhood..."></textarea>
              </div>

              <div class="form-group full-width">
                <label for="map_embed_url">
                  <i class="fas fa-map"></i>
                  Google Maps Embed URL *
                </label>
                <input type="url" id="map_embed_url" name="map_embed_url" required
                       placeholder="https://www.google.com/maps/embed?..." />
                <small class="help-text">Get embed URL from Google Maps → Share → Embed a map</small>
              </div>
            </div>
          </section>
        </div>

        <div class="form-actions">
          <button type="submit" disabled={loading} class="submit-btn">
            <i class="fas fa-save"></i>
            {loading ? 'Saving...' : 'Save Property Details'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Existing Property Details -->
  {#if data.existingDetails.length > 0}
    <div class="existing-details">
      <div class="section-header">
        <h2>
          <i class="fas fa-list"></i>
          Existing Property Details
        </h2>
        <p>Manage and edit existing property detail records</p>
      </div>
      
      <div class="details-grid">
        {#each data.existingDetails as details}
          <div class="detail-card">
            <div class="detail-card-header">
              <div class="detail-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="detail-title">
              <h4>{details.title || `${details.location} - ${details.type}`}</h4>
                <span class="detail-property">{details.location} - {details.type}</span>
            </div>
              <div class="detail-status {details.status.toLowerCase()}">
                {details.status}
              </div>
            </div>
            
            <div class="detail-card-body">
              <div class="detail-meta">
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>Updated {new Date(details.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div class="detail-actions">
              <button 
                type="button" 
                  class="action-btn edit"
                on:click={() => {
                  selectedPropertyId = details.property_id.toString();
                  selectProperty();
                }}
              >
                  <i class="fas fa-edit"></i>
                  Edit Details
              </button>
              <button 
                type="button" 
                  class="action-btn delete"
                on:click={() => deleteDetails(details.id)}
              >
                  <i class="fas fa-trash"></i>
                Delete
              </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
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
    gap: var(--admin-space-6);
  }

  .header-icon {
    width: 64px;
    height: 64px;
    background: var(--admin-gradient-button);
    border-radius: var(--admin-radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--admin-text-2xl);
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

  /* Selection Section */
  .selection-section {
    background: var(--bg-secondary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    margin-bottom: var(--spacing-8);
    overflow: hidden;
  }

  .section-header {
    padding: var(--spacing-6) var(--spacing-8);
    border-bottom: 1px solid var(--border-light);
  }

  .section-header h2 {
    margin: 0 0 var(--spacing-2) 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .section-header h2 i {
    color: var(--accent-color);
  }

  .section-header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .property-selector {
    padding: 2rem;
  }

  .search-container {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 1rem;
  }

  .property-select {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    color: #1a2236;
    background: white;
    transition: all 0.3s ease;
  }

  .property-select:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  .selected-property-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid rgba(14, 165, 233, 0.2);
    border-radius: 12px;
    overflow: hidden;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .property-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .property-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.125rem;
  }

  .property-info {
    flex: 1;
  }

  .property-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a2236;
  }

  .property-type {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .property-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0ea5e9;
  }

  .property-card-body {
    padding: 0 1.5rem 1.5rem;
  }

  .property-detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .property-detail i {
    color: #0ea5e9;
  }

  /* Details Form */
  .details-form {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    overflow: hidden;
  }

  .form-header {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 2rem;
    border-bottom: 1px solid rgba(156, 163, 175, 0.2);
  }

  .form-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .form-title i {
    color: #0ea5e9;
    font-size: 1.25rem;
  }

  .form-title h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a2236;
  }

  .form-header p {
    margin: 0 0 1rem 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #0ea5e9, #1a2236);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .form-sections {
    padding: 2rem;
  }

  .form-section {
    margin-bottom: 3rem;
  }

  .form-section .section-header {
    padding: 0 0 1rem 0;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #f1f5f9;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }

  .form-section .section-header h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a2236;
  }

  .form-section .section-header p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
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
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-group label i {
    color: #0ea5e9;
    font-size: 0.875rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #1a2236;
    transition: all 0.3s ease;
    background: white;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  .form-actions {
    padding: 2rem;
    border-top: 1px solid rgba(156, 163, 175, 0.2);
    display: flex;
    justify-content: flex-end;
  }

  .form-actions button {
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-actions button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
  }

  .form-actions button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn {
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 200px;
    justify-content: center;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn i {
    font-size: 1.125rem;
  }

  .help-text {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
    font-style: italic;
  }

  /* Existing Details */
  .existing-details {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
  }

  .detail-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid rgba(156, 163, 175, 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .detail-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
  }

  .detail-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    border-bottom: 1px solid rgba(156, 163, 175, 0.1);
  }

  .detail-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
  }

  .detail-title {
    flex: 1;
  }

  .detail-title h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1a2236;
  }

  .detail-property {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .detail-status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .detail-status.active {
    background: #dcfce7;
    color: #166534;
  }

  .detail-status.pending {
    background: #fef3c7;
    color: #92400e;
  }

  .detail-status.draft {
    background: #f3f4f6;
    color: #374151;
  }

  .detail-card-body {
    padding: 1.25rem;
  }

  .detail-meta {
    margin-bottom: 1rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .meta-item i {
    color: #0ea5e9;
  }

  .detail-actions {
    display: flex;
    gap: 0.75rem;
  }

  .action-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .action-btn.edit {
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    border-color: #0ea5e9;
    color: white;
  }

  .action-btn.edit:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }

  .action-btn.delete {
    background: white;
    border-color: #ef4444;
    color: #ef4444;
  }

  .action-btn.delete:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-1px);
  }

  /* Dynamic Lists */
  .dynamic-list {
    margin-top: 0.75rem;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .list-item input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;
  }

  .remove-item {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .remove-item:hover {
    background: #dc2626;
    transform: scale(1.1);
  }

  .add-item {
    background: linear-gradient(135deg, #0ea5e9 0%, #1a2236 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-top: 0.75rem;
  }

  .add-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .admin-container {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
    }

    .header-content {
      flex-direction: column;
      text-align: center;
    }

    .header-stats {
      justify-content: center;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .details-grid {
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    .detail-actions {
      flex-direction: column;
    }
  }
</style>
