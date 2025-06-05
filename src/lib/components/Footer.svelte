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

	hr {
		border: 0;
		height: 1px;
		background: var(--text-color);
		margin: 20px 20px;
	}
</style>