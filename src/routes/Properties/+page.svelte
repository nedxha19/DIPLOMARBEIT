<script>
  export let data;
</script>

<!-- svelte-ignore css_unused_selector -->
<style>
:root {
  --primary-color: #3081B4;
  --accent-color: #ECAE4D;
  --body-bg: #F5F1F1;
  --mobile-nav-bg: #2c3e50;
  --white: white;
  --blue: #007BFF;
  --spacing-sm: 10px;
  --spacing-md: 15px;
  --spacing-lg: 20px;
  --spacing-xl: 80px;
  --font-size-logo: 28px;
  --font-size-nav: 17px;
  --font-size-nav-mobile: 20px;
  --font-size-h1: 40px;
  --font-size-h2: 20px;
  --font-size-p: 16px;
  --border-radius-sm: 5px;
  --border-radius-md: 10px;
  --border-radius-lg: 15px;
  --border-radius-xl: 20px;
  --transition-sm: 0.3s ease;
  --transition-md: 0.5s ease;
  --box-shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.1);
  --box-shadow-md: 0 4px 20px rgba(0, 0, 0, 0.3);
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

body {
  background-color: var(--body-bg);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  margin-bottom: 0;
}

.image {
  width: 100%;
  margin: 0;
  height: 450px;
  position: relative;
  background-size: cover;
  background-position: center;
}


.search-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  width: 90%;
  max-width: 1200px;
  padding: calc(var(--spacing-lg) / 1.6);
  border-radius: var(--border-radius-xl);
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .15);
  align-items: center;
  position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  transition: transform var(--transition-sm), box-shadow var(--transition-sm);
}

.search-container:hover {
  transform: translate(-50%, -50%) translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, .22);
}

.search-option {
  flex: 1 1 180px;
  padding: .65rem .9rem .65rem 1rem;
  border: 1.5px solid #d0d5dc;
  border-radius: var(--border-radius-md);
  font-size: .95rem;
  background: #fff url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='%233081B4'><path d='M1 1l4 4 4-4'/></svg>") no-repeat right .8rem center/10px 6px;
  appearance: none;
  transition: border-color var(--transition-sm), box-shadow var(--transition-sm);
}

.search-option:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(48, 129, 180, .25);
}

.vertical-line {
  width: 1px;
  height: 36px;
  background: var(--blue);
  opacity: .3;
}

.search-button {
  flex-shrink: 0;
  padding: .7rem 1.8rem;
  font-weight: 600;
  font-size: .96rem;
  color: var(--white);
  background: var(--primary-color);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background var(--transition-sm), transform var(--transition-sm);
}

.search-button:hover {
  background: #256d96;
}

.search-button:active {
  transform: scale(.97);
}

@media (max-width: 1024px) {
  .search-container {
    gap: var(--spacing-md);
  }
  .vertical-line {
    display: none;
  }
  .search-option {
    flex: 1 1 calc(50% - var(--spacing-md));
  }
  .search-button {
    flex: 1 1 100%;
    margin-top: calc(var(--spacing-md) / 1.2);
  }
}

@media (max-width: 600px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    max-width: 400px;
  }
  .search-option {
    width: 100%;
    flex: 1 1 auto;
  }
  .search-button {
    width: 100%;
  }
}

.properties {
  color: var(--blue);
  font-size: var(--font-size-h2);
}

.recommended {
  font-size: var(--font-size-h1);
}

.category-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: var(--spacing-lg) 0;
}

.category-section h2 {
  margin: var(--spacing-md) 0;
}

.tabs {
  display: flex;
  justify-content: center;
  margin: var(--spacing-md) 0;
}

.tab {
  background-color: var(--accent-color);
  padding: var(--spacing-md);
  margin: 0 var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
}

.tab:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 86, 179, 0.3);
  color: var(--white);
}

@media (max-width: 1200px) {
  .tabs {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .tab {
    flex: 0 0 40%;
    margin-bottom: var(--spacing-lg);
  }
}
/* Property Cards Section */
.card-grid-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin: var(--spacing-lg);
}

.property-card {
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--box-shadow-sm);
  transition: transform var(--transition-sm);
  height: 450px;
}

.property-card:hover {
  transform: translateY(-5px);
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
  padding: var(--spacing-md);
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f8f9fa;
}

.property-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: var(--spacing-sm);
}

.property-address {
  font-size: 14px;
  color: #666;
  margin-bottom: var(--spacing-md);
}

.property-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-sm) 0;
}

.stat {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.stat .icon {
  font-size: 20px;
  margin-right: var(--spacing-sm);
  color: #333;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: var(--spacing-sm) 0;
}

.property-price-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-price {
  font-size: 16px;
  font-weight: bold;
  color: var(--blue);
}

.property-type {
  font-size: 14px;
  font-style: italic;
  color: #666;
}

.property-footer {
  width: 100%;
  background-color: var(--accent-color);
  color: var(--white);
  text-align: center;
  padding: var(--spacing-sm) 0;
  font-size: 14px;
  font-weight: bold;
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  margin-bottom: 0;
}

.details-button {
  color: white;
  text-decoration: none;
  text-align: center;
}

@media (max-width: 1024px) {
  .card-grid-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* For small screens (mobile phones) */
@media (max-width: 768px) {
  .card-grid-section {
    grid-template-columns: 1fr;
  }

  .property-card {
    width: 100%;
    margin-bottom: var(--spacing-lg);
  }

  .property-image {
    height: 200px;
  }

  .property-info {
    padding: var(--spacing-md);
  }
}

</style>

<main>
  <div class="content">
    <div class="container">
      <img class="image" src="/assets/4.jpg" alt="House" />

      <div class="search-container">
        <select class="search-option" id="locationFilter">
          <option value="">All Locations</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="New York">New York</option>
          <option value="Chicago">Chicago</option>
          <option value="Miami">Miami</option>
        </select>

        <div class="vertical-line"></div>

        <select class="search-option" id="typeFilter">
          <option value="">All Types</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Single-Family Home">Single-Family Home</option>
        </select>

        <div class="vertical-line"></div>

        <select class="search-option" id="priceFilter">
          <option value="">All Prices</option>
          <option value="100000">Below $100,000</option>
          <option value="200000">$100,000 - $200,000</option>
          <option value="300000">$200,000 - $300,000</option>
          <option value="400000">$300,000 - $400,000</option>
          <option value="500000">$400,000+</option>
        </select>

        <div class="vertical-line"></div>

        <select class="search-option" id="bedsFilter">
          <option value="">All Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>

        <div class="vertical-line"></div>

        <select class="search-option" id="bathsFilter">
          <option value="">All Bathrooms</option>
          <option value="1">1 Bathroom</option>
          <option value="2">2 Bathrooms</option>
          <option value="3">3 Bathrooms</option>
          <option value="4">4+ Bathrooms</option>
        </select>

        <div class="vertical-line"></div>

        <select class="search-option" id="sqftFilter">
          <option value="">All Sq Ft</option>
          <option value="500">Below 500 sq ft</option>
          <option value="1000">500 - 1000 sq ft</option>
          <option value="1500">1000 - 1500 sq ft</option>
          <option value="2000">1500 - 2000 sq ft</option>
          <option value="2500">2000+ sq ft</option>
        </select>

        <button class="search-button">Search</button>
      </div>
    </div>

    <div class="category-section">
      <p class="properties">Houseo properties</p>
      <h2 class="recommended">Recommended for you</h2>
      <div class="tabs">
        <div class="tab">Villa</div>
        <div class="tab">Apartment</div>
        <div class="tab">Townhouse</div>
        <div class="tab">Single-Family Home</div>
        <div class="tab">Vacation Home</div>
        <div class="tab">Condo</div>
      </div>
    </div>
  </div>
  <section class="card-grid-section">
  {#each data.properties as property (property.id)}
    <div class="property-card">
      <div class="image-container">
        <img src={property.image} alt="House" class="property-image" />
      </div>
      <div class="property-info">
        <h3 class="property-name">{property.location} — {property.type}</h3>
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
        <div class="property-footer">
          <a href="/details/{property.id}" class="details-button">View Details</a>
        </div>
      </div>
    </div>
  {/each}
</section>

</main>
