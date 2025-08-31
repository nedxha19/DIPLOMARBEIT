<!-- Navbar.svelte -->
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
	<input type="checkbox" id="check" />
	<label for="check" class="checkbtn">
		<i class="fas fa-bars"></i>
	</label>
	<h1 class="logo">Houseo</h1>
	<ul>
		<li><a href="/home">Home</a></li>
		<li><a href="/Properties">Property</a></li>
		<li><a href="/post">Blog</a></li>
		<li><a href="/living">Living</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</nav>

<style>
	:root {
		--primary-bg-color: #3081b4;
		--secondary-bg-color: #2c3e50;
		--text-color: white;
		--accent-color: #ecae4d;
		--font-family: 'Montserrat', sans-serif;
		--nav-height: 80px;
	}

	:global(*) {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: var(--font-family);
		background-color: #f5f1f1;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	nav {
		background: var(--primary-bg-color);
		height: var(--nav-height);
		width: 100%;
		position: relative;
		top: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}

	.logo {
		color: var(--text-color);
		font-size: 28px;
		font-weight: bold;
		margin: 0 43px;
	}

	.logo:hover {
		color: var(--accent-color);
	}

	nav ul {
		display: flex;
		list-style: none;
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
	}

	nav a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -5px;
		width: 100%;
		height: 2px;
		background: var(--accent-color);
		transform: scaleX(0);
		transition: transform 0.3s ease;
	}

	nav a:hover::after {
		transform: scaleX(1);
	}

	.checkbtn {
		font-size: 28px;
		color: var(--text-color);
		cursor: pointer;
		display: none;
	}

	#check {
		display: none;
	}

	@media (max-width: 890px) {
		.checkbtn {
			display: block;
		}

		nav ul {
			position: fixed;
			width: 100%;
			height: calc(100vh - var(--nav-height));
			background: var(--secondary-bg-color);
			top: var(--nav-height);
			left: -100%;
			flex-direction: column;
			transition: left 0.5s;
			padding-top: 20px;
			justify-content: center;
			align-items: center;
			z-index: 999;
		}

		nav ul li {
			margin: 20px 0;
		}

		#check:checked ~ ul {
			left: 0;
		}
	}

	:global(.main) {
		flex: 1;
		padding: 0px;
		margin-top: 0px;
		margin-bottom: 0px;
	}

	@media (max-width: 480px) {
		nav {
			margin-bottom: 100px;
		}

		:global(.main) {
			margin: 0px 0px;
		}
	}
</style>
