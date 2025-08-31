<script>
  export let data;
  const { property } = data;

  // Property data is already parsed in the server
  let currentImage = 0;
  let showContactModal = false;

  // Auto-slide carousel
  let carouselInterval;
  let carouselImages = property.gallery_images || [];

  function nextImage() {
    currentImage = (currentImage + 1) % carouselImages.length;
  }

  function prevImage() {
    currentImage = currentImage === 0 ? carouselImages.length - 1 : currentImage - 1;
  }

  function goToImage(index) {
    currentImage = index;
  }

  function openContactModal() {
    showContactModal = true;
  }

  function closeContactModal() {
    showContactModal = false;
  }

  function formatPrice(price) {
    return price ? `$${price.toLocaleString()}` : 'Price on request';
  }

  // Auto-slide functionality
  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    if (carouselImages.length > 1) {
      carouselInterval = setInterval(() => {
        nextImage();
      }, 4000);
    }
  });

  onDestroy(() => {
    if (carouselInterval) {
      clearInterval(carouselInterval);
    }
  });
</script>

<svelte:head>
  <title>{property.title || `${property.location} - ${property.type}`} | Houseo</title>
  <meta name="description" content={property.description || `View details of this ${property.type} in ${property.location} for ${formatPrice(property.price)}`} />
  {#if property.keywords}
    <meta name="keywords" content={property.keywords} />
  {/if}
</svelte:head>

<!-- Image Carousel -->
{#if carouselImages && carouselImages.length > 0}
<div class="carousel">
  <div class="carousel-wrap" style="transform: translateX(-{currentImage * 100}%)">
    {#each carouselImages as image, index}
      <img
        src={image}
        alt="Property image {index + 1}"
        class="carousel-image"
      />
    {/each}
  </div>

  {#if carouselImages.length > 1}
    <button class="carousel-nav carousel-prev" on:click={prevImage}>
      <i class="fas fa-chevron-left"></i>
    </button>
    <button class="carousel-nav carousel-next" on:click={nextImage}>
      <i class="fas fa-chevron-right"></i>
    </button>

    <div class="carousel-indicators">
      {#each carouselImages as _, index}
        <button
          class="indicator {index === currentImage ? 'active' : ''}"
          on:click={() => goToImage(index)}
        ></button>
      {/each}
    </div>
  {/if}
</div>
{/if}

<div class="content">
  <!-- Header and Overview -->
  <div class="grid-section">
    <h2>Property Overview</h2>
    <p>{property.overview_description || property.description || 'Property description not available.'}</p>
  </div>

  <!-- Property Details -->
  <div class="grid-section">
    <h2>Property Details</h2>
    <div class="details-columns">
      <div>
        <ul>
          <li><strong>Property Type:</strong> {property.property_type || property.type}</li>
          <li><strong>Year Built:</strong> {property.year_built || 'N/A'}</li>
          <li><strong>Square Footage:</strong> {property.square_footage ? `${property.square_footage.toLocaleString()} sqft` : 'N/A'}</li>
          <li><strong>Lot Size:</strong> {property.lot_size || 'N/A'}</li>
          <li><strong>Bedrooms:</strong> {property.bedrooms || 'N/A'}</li>
          <li><strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}</li>
        </ul>
      </div>
      <div>
        <ul>
          <li><strong>Garage:</strong> {property.garage || 'N/A'}</li>
          <li><strong>Heating:</strong> {property.heating || 'N/A'}</li>
          <li><strong>Cooling:</strong> {property.cooling || 'N/A'}</li>
          <li><strong>Architecture:</strong> {property.architecture || 'N/A'}</li>
          <li><strong>Roof:</strong> {property.roof || 'N/A'}</li>
          <li><strong>Exterior:</strong> {property.exterior || 'N/A'}</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Video Section -->
  {#if property.video_tour_url}
  <div class="grid-section video-section">
    <h2>Video Tour</h2>
    <div class="video-container">
      <video controls width="100%" poster={carouselImages[0]}>
        <source src={property.video_tour_url} type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  {/if}

  <!-- What's Nearby -->
  <div class="grid-section">
    <h2>What's Nearby</h2>
    <div class="nearby-columns">
      {#if property.nearby_schools && property.nearby_schools.length > 0}
      <div>
        <h3>Schools & Education</h3>
        <ul>
          {#each property.nearby_schools as school}
            <li>{school}</li>
          {/each}
        </ul>
      </div>
      {/if}

      {#if property.nearby_shopping && property.nearby_shopping.length > 0}
      <div>
        <h3>Shopping & Amenities</h3>
        <ul>
          {#each property.nearby_shopping as shopping}
            <li>{shopping}</li>
          {/each}
        </ul>
      </div>
      {/if}

      {#if property.nearby_companies && property.nearby_companies.length > 0}
      <div>
        <h3>Companies & Offices</h3>
        <ul>
          {#each property.nearby_companies as company}
            <li>{company}</li>
          {/each}
        </ul>
      </div>
      {/if}

      {#if property.nearby_transport && property.nearby_transport.length > 0}
      <div>
        <h3>Transportation</h3>
        <ul>
          {#each property.nearby_transport as transport}
            <li>{transport}</li>
          {/each}
        </ul>
      </div>
      {/if}
    </div>
  </div>

  <!-- Location Section -->
  {#if property.map_embed_url}
  <div class="grid-section location-section">
    <h2>Location</h2>
    <div class="location-container">
      {#if property.location_description}
      <p>{property.location_description}</p>
      {/if}
      <iframe
        src={property.map_embed_url}
        width="100%"
        height="400"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Property location map">
      </iframe>
    </div>
  </div>
  {/if}

  <!-- Property Actions -->
  <div class="property-actions-bar">
    <div class="property-price-large">
      <span class="price">{formatPrice(property.price)}</span>
      <span class="location">{property.location}</span>
    </div>

    <div class="action-buttons">
      <button class="btn-primary" on:click={openContactModal}>
        <i class="fas fa-envelope"></i>
        Contact Agent
      </button>
      {#if property.virtual_tour_url}
      <a href={property.virtual_tour_url} target="_blank" class="btn-secondary">
        <i class="fas fa-vr-cardboard"></i>
        Virtual Tour
      </a>
      {/if}
    </div>
  </div>
</div>

<!-- Contact Modal -->
{#if showContactModal}
<div class="modal-overlay" on:click={closeContactModal}>
  <div class="modal-content contact-modal" on:click|stopPropagation>
    <button class="modal-close" on:click={closeContactModal}>
      <i class="fas fa-times"></i>
    </button>

    <h3>Contact Agent</h3>
    <form class="contact-form">
      <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" id="name" required />
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" />
      </div>

      <div class="form-group">
        <label for="message">Message *</label>
        <textarea id="message" rows="4" required>
Interested in {property.location} - {property.type}
Property ID: {property.id}
Price: {formatPrice(property.price)}
        </textarea>
      </div>

      <button type="submit" class="btn-primary">Send Message</button>
    </form>
  </div>
</div>
{/if}


<style>
  /* Carousel Styles */
  .carousel {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
  }

  .carousel-wrap {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease-in-out;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 10;
    transition: background 0.3s ease;
  }

  .carousel-nav:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .carousel-prev {
    left: 20px;
  }

  .carousel-next {
    right: 20px;
  }

  .carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
  }

  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .indicator.active {
    background: white;
    border-color: white;
  }

  /* Content Styles */
  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .grid-section {
    margin-bottom: 60px;
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .grid-section h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }

  .grid-section p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    text-align: justify;
  }

  /* Property Details */
  .details-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .details-columns ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .details-columns li {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1rem;
    color: #333;
  }

  .details-columns li strong {
    color: #667eea;
    font-weight: 600;
  }

  /* Video Section */
  .video-section {
    text-align: center;
  }

  .video-container {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .video-container video {
    width: 100%;
    height: auto;
  }

  /* What's Nearby */
  .nearby-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
  }

  .nearby-columns h3 {
    font-size: 1.3rem;
    color: #667eea;
    margin-bottom: 15px;
    font-weight: 600;
  }

  .nearby-columns ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nearby-columns li {
    padding: 8px 0;
    color: #555;
    font-size: 1rem;
  }

  /* Location Section */
  .location-container {
    text-align: center;
  }

  .location-container p {
    margin-bottom: 30px;
    font-size: 1.1rem;
    text-align: justify;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .location-container iframe {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  /* Property Actions Bar */
  .property-actions-bar {
    background: #f8f9fa;
    padding: 40px 20px;
    border-radius: 12px;
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .property-price-large {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .property-price-large .price {
    font-size: 2.5rem;
    font-weight: 700;
    color: #667eea;
  }

  .property-price-large .location {
    font-size: 1.2rem;
    color: #666;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
  }

  .btn-primary {
    background: #667eea;
    color: white;
  }

  .btn-primary:hover {
    background: #5a67d8;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #f8f9fa;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    position: relative;
    padding: 30px;
  }

  .modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #f0f0f0;
    color: #333;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;
  }

  .modal-close:hover {
    background: #e0e0e0;
  }

  .modal-content h3 {
    margin-bottom: 25px;
    text-align: center;
    color: #333;
    font-size: 1.5rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
  }

  .form-group input,
  .form-group textarea {
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 120px;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .carousel {
      height: 300px;
    }

    .content {
      padding: 20px 15px;
    }

    .grid-section {
      padding: 25px 20px;
      margin-bottom: 30px;
    }

    .grid-section h2 {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .details-columns {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .nearby-columns {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .property-actions-bar {
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }

    .property-price-large .price {
      font-size: 2rem;
    }

    .action-buttons {
      justify-content: center;
    }

    .carousel-nav {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .carousel-prev {
      left: 10px;
    }

    .carousel-next {
      right: 10px;
    }

    .modal-content {
      margin: 20px;
      padding: 25px;
      max-width: none;
      width: calc(100% - 40px);
    }
  }

  @media (max-width: 480px) {
    .grid-section {
      padding: 20px 15px;
    }

    .grid-section h2 {
      font-size: 1.3rem;
    }

    .details-columns li {
      font-size: 0.95rem;
    }

    .nearby-columns li {
      font-size: 0.95rem;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 20px;
      font-size: 0.9rem;
    }

    .property-price-large .price {
      font-size: 1.8rem;
    }
  }
</style>
