<script>
	// No script needed for a static footer. Add functionality if needed.
</script>

<svelte:head>
	<!-- Font Awesome for icons -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
	/>
</svelte:head>

<footer>
	<div class="footer-container">
		<div class="footer-column">
			<h3>Get in touch</h3>
			<p>123 Street, New York, USA</p>
			<p>+012 345 67890</p>
			<p>Email: xhaferinedit@yahoo.com</p>
			<div class="footer-icons">
				<i class="fab fa-facebook-f"></i>
				<i class="fab fa-instagram"></i>
				<i class="fab fa-youtube"></i>
				<i class="fab fa-linkedin"></i>
			</div>
		</div>
		
		<div class="footer-column">
			<h3>Quick Links</h3>
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/properties">Property</a></li>
				<li><a href="/post">Post</a></li>
				<li><a href="/living">Living</a></li>
				<li><a href="/contact">Contact</a></li>
			</ul>
		</div>
		
		<div class="footer-column">
			<h3>Gallery</h3>
			<div class="gallery-grid">
				<img src="/assets/1.jpg" alt="Modern living room" />
				<img src="/assets/2.jpg" alt="Kitchen design" />
				<img src="/assets/3.jpg" alt="Bedroom interior" />
				<img src="/assets/4.jpg" alt="Bathroom design" />
				<img src="/assets/5.jpg" alt="Outdoor space" />
				<img src="/assets/6.jpg" alt="Building exterior" />
			</div>
		</div>
	</div>
	<hr />
	<p class="footer-text">© 2024 Houseo | All Rights Reserved.</p>
</footer>

<style>
	:root {
		--footer-bg-color: #3081b4;
		--text-color: white;
	}

	footer {
		background-color: var(--footer-bg-color);
		color: var(--text-color);
		padding: 30px 5px 10px 5px;
	}

	.footer-container {
		display: flex;
		justify-content: space-around;
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-column {
		flex: 1;
		padding: 0 20px;
	}

	.footer-icons i {
		margin-right: 10px;
		color: var(--text-color);
		margin-top: 10px;
	}

	.footer-column p {
		margin-top: 8px;
	}

	.footer-text {
		text-align: center;
		margin: 10px 0;
		color: var(--text-color);
	}

	.footer-column li a {
		text-decoration: none;
		color: var(--text-color);
	}

	.footer-column li {
		list-style-type: none;
		margin-top: 6px;
	}

	hr {
		border: 0;
		height: 1px;
		background: var(--text-color);
		margin: 20px 20px;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
	}

	.gallery-grid img {
		border-radius: 6px;
		height: 50px;
		object-fit: cover;
		width: 100%;
	}
</style>