<script>
  import { onMount } from 'svelte'; // Run code when component mounts
  import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome icons

  export let isSidebarHidden; //It decides if the sidebar should be collapsed (hidden) or fully open. 
  let activeIndex = 0;  //Keeps track of which menu item is currently selected or clicked.
  // So, when the page loads for the first time, "Property System" will be highlighted by default.



//The activeIndex helps us highlight the correct menu item visually.
//Just an array of objects.
  const menuItems = [
    { icon: 'home', text: 'Property System', href: '/admin/propertySystem', idx: 0 },
    { icon: 'plus-circle', text: 'Add Property', href: '/admin/propertySystem/addProperty', idx: 1 },
    { icon: 'info-circle', text: 'Details', href: '/admin/details', idx: 2 },
    { icon: 'calendar-alt', text: 'Calendar Schedule', href: '/admin/calendarSchedule', idx: 3 },
    { icon: 'message', text: 'Chat Bot', href: '/admin/chatBot', idx: 4 },
    { icon: 'sign-out-alt', text: 'Logout', href: '/admin/logout', idx: 5 }
  ];
// Controls if the Sidebar  true/false (open ↔ closed).
  function toggleSidebar() {
    isSidebarHidden = !isSidebarHidden;
  }
// If isSidebarHidden = false, it becomes true
// If isSidebarHidden = true, it becomes false

 //Remember which menu item was clicked.
  function setActive(index) {
    activeIndex = index;
  }
 //  Makes sidebar auto-collapse on phones/tablets (< 768 px wide).
onMount(() => {
  const handleResize = () => {
    isSidebarHidden = window.innerWidth < 768; // shrink on small screens
  };
  handleResize();                       // run once now
  window.addEventListener('resize', handleResize); // run on every resize
  return () => window.removeEventListener('resize', handleResize); // clean-up
});
</script>

<nav class="sidebar {isSidebarHidden ? 'hide' : ''}">
  <div class="toggle-container">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="toggle-btn" on:click={toggleSidebar}>
      <i class="fas fa-chevron-left"></i> 
    </button>
  </div>
<!-- Clicking calls toggleSidebar() to open/close the panel.-->

  <a href="/" class="logo">
    <i class="fas fa-user-cog logo-icon"></i>
    <span class="logo-text">Admin Dashboard</span> <!-- Icon + text, linking back to the main admin page. -->
  </a>

  <!-- We loop over menuItems and build one <li> per entry. -->

  <ul class="side-menu"> <!-- Unordered List, will contain all the clickable menu links (as <li> elements).-->
    {#each menuItems as item (item.idx)}
<!-- item is the current object in the array for each loop cycle,(item.idx) is used as a unique key so Svelte knows which item is which-->
      <li class="menu-item" class:active={activeIndex === item.idx}>
        <div class="active-indicator"></div>
        <a  href={item.href}  class="nav-link"  on:click={() => setActive(item.idx)}>
          <i class="fas fa-{item.icon}"></i>  <!-- This adds the Font Awesome icon for the item. -->
          <span class="link-text">{item.text}</span> <!--This shows the visible text for each menu item.-->
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  :global(:root) {
    --sidebar-bg: #1a2236;
    --sidebar-active: #0ea5e9;
    --sidebar-hover: rgba(14, 165, 233, 0.15);
    --text-primary: #f3f4f6;
    --text-secondary: #9ca3af;
    --transition-speed: 0.3s;
    --border-radius: 8px;
    --icon-size: 1.25rem;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    background: var(--sidebar-bg);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    transition: width var(--transition-speed) ease;
    overflow: hidden;
    z-index: 100;
    font-family: 'Poppins', sans-serif;
  }
  .sidebar.hide {
    width: 72px;
  }
  .toggle-container {
    display: flex;
    justify-content: flex-end;
    padding: 24px 20px 16px;
  }
  .toggle-btn {
    background: transparent;
    border: none;
    color: var(--text-white);
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: var(--icon-size);
    transition: transform var(--transition-speed), color 0.2s ease;
  }
  .toggle-btn:hover {
    color: var(--text-white);
    background: rgba(255, 255, 255, 0.05);
  }
  .sidebar.hide .toggle-btn {
    transform: rotate(180deg);
  }
  .logo {
    display: flex;
    align-items: center;
    padding: 0 20px 28px;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 12px;
    color: var(--text-white);
  }
  .logo-icon {
    font-size: 22px;
    color: var(--sidebar-active);
    margin-right: 12px;
  }
  .logo-text {
    font-weight: 600;
    font-size: 19px;
    letter-spacing: 0.5px;
    white-space: nowrap;
    transition: opacity var(--transition-speed);
  }
  .sidebar.hide .logo-text {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }
  .side-menu {
    padding: 0 12px;
    list-style: none;
    margin: 0;
    flex-grow: 1;
  }
  .menu-item {
    position: relative;
    margin-bottom: 8px;
    height: 50px;
    border-radius: var(--border-radius);
    transition: background var(--transition-speed);
  }
  .menu-item.active {
    background: var(--sidebar-hover);
  }
  .nav-link {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    color: var(--text-white);
    text-decoration: none;
    border-radius: var(--border-radius);
    transition: color 0.2s ease, background var(--transition-speed);
  }
  .nav-link:hover {
    color: var(--text-white);
    background: rgba(255, 255, 255, 0.03);
  }
  .menu-item.active .nav-link {
    color: var(--text-white);
  }
  .nav-link i {
    min-width: 32px;
    font-size: var(--icon-size);
    transition: color var(--transition-speed);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-white);
  }
  .menu-item.active .nav-link i {
    color: var(--sidebar-active);
  }
  .link-text {
    font-weight: 500;
    font-size: 15px;
    transition: opacity var(--transition-speed), transform var(--transition-speed);
  }
  .sidebar.hide .link-text {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }
  .active-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background: var(--sidebar-active);
    border-radius: 0 4px 4px 0;
    opacity: 0;
    transition: opacity var(--transition-speed);
  }
  .menu-item.active .active-indicator {
    opacity: 1;
  }
  .user-info {
    padding: 16px;
    color: var(--text-white);
    font-size: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>