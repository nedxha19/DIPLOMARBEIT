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
  <header class="page-header">
    <h1 class="admin-heading-1">Property Details Management</h1>
    <p class="admin-text-body">Create and manage detailed information for your properties</p>
  </header>

  <!-- Property Selection -->
  <div class="admin-card">
    <div class="card-header">
      <h2 class="admin-heading-2">Select Property</h2>
      <p class="admin-text-body">Choose a property to add or edit detailed information</p>
    </div>
    
    <div class="card-content">
      <div class="form-group">
        <label for="propertySelect" class="admin-text-label">Property:</label>
        <select 
          id="propertySelect" 
          bind:value={selectedPropertyId} 
          on:change={selectProperty}
          class="admin-input"
        >
          <option value="">-- Select a Property --</option>
          {#each data.properties as property}
            <option value={property.id}>
              {property.location} - {property.type} ({property.address}) - ${property.price.toLocaleString()}
            </option>
          {/each}
        </select>
      </div>
      
      {#if selectedProperty}
        <div class="selected-property">
          <h3>Selected Property:</h3>
          <p><strong>Location:</strong> {selectedProperty.location}</p>
          <p><strong>Type:</strong> {selectedProperty.type}</p>
          <p><strong>Address:</strong> {selectedProperty.address}</p>
          <p><strong>Price:</strong> ${selectedProperty.price.toLocaleString()}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Property Details Form -->
  {#if showForm && selectedProperty}
    <div class="admin-card">
      <div class="card-header">
        <h2 class="admin-heading-2">Property Details Form</h2>
        <p class="admin-text-body">Add comprehensive details for {selectedProperty.location}</p>
      </div>
      
      <form method="POST" action="?/saveDetails" enctype="multipart/form-data" use:enhance={handleSubmit}>
        <input type="hidden" name="property_id" value={selectedPropertyId} />
        
        <div class="form-sections">
          <!-- Basic Information -->
          <section class="form-section">
            <h3 class="section-title">Basic Information</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="title" class="admin-text-label">Property Title</label>
                <input type="text" id="title" name="title" class="admin-input" placeholder="Enter custom title or leave blank for auto-generated" />
              </div>

              <div class="form-group">
                <label for="property_type" class="admin-text-label">Property Type *</label>
                <select id="property_type" name="property_type" class="admin-input" required>
                  <option value="">Select Property Type</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Condominium">Condominium</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Duplex">Duplex</option>
                </select>
              </div>

              <div class="form-group">
                <label for="year_built" class="admin-text-label">Year Built *</label>
                <input type="number" id="year_built" name="year_built" class="admin-input" min="1800" max="2024" required />
              </div>

              <div class="form-group">
                <label for="square_footage" class="admin-text-label">Square Footage *</label>
                <input type="number" id="square_footage" name="square_footage" class="admin-input" min="1" required />
              </div>

              <div class="form-group">
                <label for="lot_size" class="admin-text-label">Lot Size</label>
                <input type="text" id="lot_size" name="lot_size" class="admin-input" placeholder="e.g., 0.35 acres" />
              </div>

              <div class="form-group">
                <label for="bedrooms" class="admin-text-label">Bedrooms *</label>
                <input type="number" id="bedrooms" name="bedrooms" class="admin-input" min="0" required />
              </div>

              <div class="form-group">
                <label for="bathrooms" class="admin-text-label">Bathrooms *</label>
                <input type="number" id="bathrooms" name="bathrooms" class="admin-input" min="0" step="0.5" required />
              </div>

              <div class="form-group full-width">
                <label for="overview_description" class="admin-text-label">Property Overview *</label>
                <textarea id="overview_description" name="overview_description" class="admin-input" rows="8" required
                          placeholder="Describe the property in detail..."></textarea>
              </div>
            </div>
          </section>

          <!-- Property Features -->
          <section class="form-section">
            <h3 class="section-title">Property Features</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="garage" class="admin-text-label">Garage</label>
                <input type="text" id="garage" name="garage" class="admin-input" placeholder="e.g., 2-car attached" />
              </div>

              <div class="form-group">
                <label for="heating" class="admin-text-label">Heating</label>
                <input type="text" id="heating" name="heating" class="admin-input" placeholder="e.g., Central forced air" />
              </div>

              <div class="form-group">
                <label for="cooling" class="admin-text-label">Cooling</label>
                <input type="text" id="cooling" name="cooling" class="admin-input" placeholder="e.g., Central air conditioning" />
              </div>

              <div class="form-group">
                <label for="architecture" class="admin-text-label">Architecture</label>
                <input type="text" id="architecture" name="architecture" class="admin-input" placeholder="e.g., Modern contemporary" />
              </div>

              <div class="form-group">
                <label for="roof" class="admin-text-label">Roof</label>
                <input type="text" id="roof" name="roof" class="admin-input" placeholder="e.g., Tile" />
              </div>

              <div class="form-group">
                <label for="exterior" class="admin-text-label">Exterior</label>
                <input type="text" id="exterior" name="exterior" class="admin-input" placeholder="e.g., Stucco" />
              </div>
            </div>
          </section>

          <!-- Gallery & Media -->
          <section class="form-section">
            <h3 class="section-title">Gallery & Media</h3>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="gallery_images" class="admin-text-label">Gallery Images *</label>
                <input type="file" id="gallery_images" name="gallery_images" class="admin-input" accept="image/*" multiple required />
                <small class="help-text">Upload multiple images for the property gallery carousel</small>
              </div>

              <div class="form-group full-width">
                <label for="video_tour" class="admin-text-label">Video Tour</label>
                <input type="file" id="video_tour" name="video_tour" class="admin-input" accept="video/*" />
                <small class="help-text">Upload a video tour of the property</small>
              </div>

              <div class="form-group full-width">
                <label for="virtual_tour_url" class="admin-text-label">Virtual Tour URL</label>
                <input type="url" id="virtual_tour_url" name="virtual_tour_url" class="admin-input" placeholder="https://..." />
              </div>
            </div>
          </section>

          <!-- What's Nearby -->
          <section class="form-section">
            <h3 class="section-title">What's Nearby</h3>
            <div class="nearby-section">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="admin-text-label">Schools & Education</label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" name="nearby_schools[]" placeholder="e.g., Cupertino High School - 1.2 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_schools[]', 'School')}>+ Add School</button>
                </div>

                <div class="form-group full-width">
                  <label class="admin-text-label">Shopping & Amenities</label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" name="nearby_shopping[]" placeholder="e.g., Valley Fair Shopping Center - 4.8 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_shopping[]', 'Shopping')}>+ Add Shopping</button>
                </div>

                <div class="form-group full-width">
                  <label class="admin-text-label">Companies & Offices</label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" name="nearby_companies[]" placeholder="e.g., Apple Campus - 5.2 miles" />
                      <button type="button" class="remove-item" on:click={(e) => removeItem(e.target)}>×</button>
                    </div>
                  </div>
                  <button type="button" class="add-item" on:click={() => addItem('nearby_companies[]', 'Company')}>+ Add Company</button>
                </div>

                <div class="form-group full-width">
                  <label class="admin-text-label">Transportation</label>
                  <div class="dynamic-list">
                    <div class="list-item">
                      <input type="text" name="nearby_transport[]" placeholder="e.g., San Jose International Airport - 12.5 miles" />
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
            <h3 class="section-title">Location</h3>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="location_description" class="admin-text-label">Location Description *</label>
                <textarea id="location_description" name="location_description" class="admin-input" rows="6" required
                          placeholder="Describe the location and neighborhood..."></textarea>
              </div>

              <div class="form-group full-width">
                <label for="map_embed_url" class="admin-text-label">Google Maps Embed URL *</label>
                <input type="url" id="map_embed_url" name="map_embed_url" class="admin-input" required
                       placeholder="https://www.google.com/maps/embed?..." />
                <small class="help-text">Get embed URL from Google Maps → Share → Embed a map</small>
              </div>
            </div>
          </section>
        </div>

        <div class="form-actions">
          <button type="submit" disabled={loading} class="admin-button-primary">
            {loading ? 'Saving...' : 'Save Property Details'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Existing Property Details -->
  {#if data.existingDetails.length > 0}
    <div class="admin-card">
      <div class="card-header">
        <h2 class="admin-heading-2">Existing Property Details</h2>
        <p class="admin-text-body">Manage existing property details</p>
      </div>
      
      <div class="details-list">
        {#each data.existingDetails as details}
          <div class="details-item">
            <div class="details-info">
              <h4>{details.title || `${details.location} - ${details.type}`}</h4>
              <p><strong>Property:</strong> {details.location} - {details.type}</p>
              <p><strong>Status:</strong> {details.status}</p>
              <p><strong>Last Updated:</strong> {new Date(details.updated_at).toLocaleDateString()}</p>
            </div>
            <div class="details-actions">
              <button 
                type="button" 
                class="edit-btn"
                on:click={() => {
                  selectedPropertyId = details.property_id.toString();
                  selectProperty();
                }}
              >
                Edit
              </button>
              <button 
                type="button" 
                class="delete-btn"
                on:click={() => deleteDetails(details.id)}
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .admin-container {
    padding: var(--admin-space-6);
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: var(--admin-space-6);
  }

  .card-header {
    padding: var(--admin-space-5);
    border-bottom: 1px solid var(--admin-border-light);
  }

  .card-content {
    padding: var(--admin-space-5);
  }

  .selected-property {
    background: var(--admin-bg-accent);
    padding: var(--admin-space-4);
    border-radius: var(--admin-radius-md);
    margin-top: var(--admin-space-4);
  }

  .form-sections {
    padding: var(--admin-space-5);
  }

  .form-section {
    margin-bottom: var(--admin-space-8);
  }

  .section-title {
    font-size: var(--admin-text-xl);
    font-weight: 600;
    color: var(--admin-text-primary);
    margin-bottom: var(--admin-space-4);
    padding-bottom: var(--admin-space-2);
    border-bottom: 2px solid var(--admin-accent);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--admin-space-4);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--admin-space-2);
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--admin-space-3);
    margin-top: var(--admin-space-4);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--admin-space-2);
    font-size: var(--admin-text-base);
    color: var(--admin-text-primary);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--admin-accent);
  }

  .form-actions {
    padding: var(--admin-space-5);
    border-top: 1px solid var(--admin-border-light);
    display: flex;
    justify-content: flex-end;
  }

  .details-list {
    padding: var(--admin-space-5);
  }

  .details-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--admin-space-4);
    border: 1px solid var(--admin-border-light);
    border-radius: var(--admin-radius-md);
    margin-bottom: var(--admin-space-3);
  }

  .details-info h4 {
    margin: 0 0 var(--admin-space-2) 0;
    color: var(--admin-text-primary);
  }

  .details-info p {
    margin: 0;
    font-size: var(--admin-text-sm);
    color: var(--admin-text-secondary);
  }

  .details-actions {
    display: flex;
    gap: var(--admin-space-2);
  }

  .edit-btn {
    background: var(--admin-gradient-button);
    color: white;
    border: none;
    padding: var(--admin-space-2) var(--admin-space-4);
    border-radius: var(--admin-radius-md);
    cursor: pointer;
    font-size: var(--admin-text-sm);
  }

  .delete-btn {
    background: var(--admin-error);
    color: white;
    border: none;
    padding: var(--admin-space-2) var(--admin-space-4);
    border-radius: var(--admin-radius-md);
    cursor: pointer;
    font-size: var(--admin-text-sm);
  }

  .edit-btn:hover {
    background: linear-gradient(135deg, #0284c7 0%, var(--admin-accent) 100%);
  }

  .delete-btn:hover {
    background: #dc2626;
  }

  .nearby-section {
    margin-top: var(--admin-space-4);
  }

  .dynamic-list {
    margin-top: var(--admin-space-2);
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: var(--admin-space-2);
    margin-bottom: var(--admin-space-2);
  }

  .list-item input {
    flex: 1;
    padding: var(--admin-space-2) var(--admin-space-3);
    border: 1px solid var(--admin-border-light);
    border-radius: var(--admin-radius-md);
    font-size: var(--admin-text-base);
  }

  .list-item input:focus {
    outline: none;
    border-color: var(--admin-accent);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .remove-item {
    background: var(--admin-error);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: background var(--transition-speed);
  }

  .remove-item:hover {
    background: #dc2626;
  }

  .add-item {
    background: var(--admin-accent);
    color: white;
    border: none;
    padding: var(--admin-space-2) var(--admin-space-4);
    border-radius: var(--admin-radius-md);
    cursor: pointer;
    font-size: var(--admin-text-sm);
    font-weight: 500;
    transition: background var(--transition-speed);
    margin-top: var(--admin-space-2);
  }

  .add-item:hover {
    background: #2563eb;
  }

  @media (max-width: 768px) {
    .admin-container {
      padding: var(--admin-space-4);
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .nearby-section {
      margin-top: var(--admin-space-2);
    }

    .details-item {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--admin-space-3);
    }

    .details-actions {
      align-self: stretch;
      justify-content: space-between;
    }
  }
</style>
