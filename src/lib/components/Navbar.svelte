<script>
</script>

<svelte:head>
  <!-- Font Awesome -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <!-- Montserrat Font -->
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<nav>
  <h1 class="logo">Houseo</h1>
</nav>

<style>
  :root {
    --primary-bg-color: #3081b4;    /* Main blue background */
    --secondary-bg-color: #2c3e50;  /* Dark blue for mobile menu */
    --text-color: white;            /* Primary text color */
    --accent-color: #ecae4d;        /* Gold accent color */
    --font-family: 'Montserrat', sans-serif;
    --nav-height: 80px;             /* Fixed navigation height */
  }

  /* Global reset for consistent styling */
  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  /* Base body styles */
  :global(body) {
    font-family: var(--font-family);
    background-color: #f5f1f1;      /* Light gray background */
    display: flex;
    flex-direction: column;
    min-height: 100vh;              /* Full viewport height */
  }

  nav {
    background: var(--primary-bg-color);
    height: var(--nav-height);
    width: 100%;
    position: relative;
    top: 0;
    z-index: 1000;                  /* Ensure navbar stays on top */
  }
   /* Navigation list styling */
  nav ul {
    display: flex;
    list-style: none;
    margin-right: 40px;
  }
  
  nav ul li {
    margin: 0 15px;
  }
  
  nav a {
    color: var(--text-color);
    font-size: 17px;
    font-weight: 600;
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    position: relative;
    transition: color 0.3s ease;
  }
  
  /* Logo styling */
  .logo {
    color: var(--text-color);
    font-size: 28px;
    font-weight: bold;
    margin: 0 43px;
    cursor: pointer;
    transition: color 0.3s ease;
  }
</style>
<!-- Navbar.svelte -->
<nav>
  <h1 class="logo">Houseo</h1>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/properties">Property</a></li>
    <li><a href="/post">Post</a></li>
    <li><a href="/living">Living</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

