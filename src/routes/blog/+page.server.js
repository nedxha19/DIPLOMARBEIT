// Blog posts mock data - Replace with actual database queries in production
export async function load() {
	const blogPosts = [
		{
			id: 1,
			slug: 'future-of-sustainable-housing',
			title: 'The Future of Sustainable Housing: Green Living in 2025',
			excerpt: 'Discover how eco-friendly architecture and smart technology are revolutionizing modern real estate, creating homes that are both luxurious and environmentally responsible.',
			content: 'Full article content here...',
			category: 'Sustainability',
			author: {
				name: 'Tea Mucmeraj',
				role: 'Senior Real Estate Analyst',
			avatar: '/assets/TeaMucmeraj.jpg'
		},
		image: '/assets/pexels.jpg',
			publishedDate: '2025-10-28',
			readTime: 8,
			tags: ['Green Living', 'Sustainability', 'Smart Homes', 'Architecture'],
			views: 2847,
			featured: true
		},
		{
			id: 2,
			slug: 'luxury-real-estate-market-trends-2025',
			title: 'Luxury Real Estate Market Trends: What Buyers Want in 2025',
			excerpt: 'An in-depth analysis of the luxury property market revealing the top amenities and features that high-net-worth individuals are seeking in their dream homes.',
			content: 'Full article content here...',
			category: 'Market Trends',
			author: {
				name: 'Lea Lulaj',
				role: 'Market Research Director',
			avatar: '/assets/LeaLulaj.jpg'
		},
		image: '/assets/pexels1.jpg',
			publishedDate: '2025-10-25',
			readTime: 10,
			tags: ['Luxury', 'Market Analysis', 'Investment', 'Trends'],
			views: 3521,
			featured: true
		},
		{
			id: 3,
			slug: 'smart-home-technology-integration',
			title: 'Smart Home Technology: The Essential Guide for Modern Homeowners',
			excerpt: 'From automated lighting to AI-powered security systems, explore the cutting-edge technologies that are transforming houses into intelligent living spaces.',
			content: 'Full article content here...',
			category: 'Technology',
			author: {
				name: 'Nedit Xhaferi',
				role: 'Technology Consultant',
			avatar: '/assets/NeditXhaferi.jpg'
		},
		image: '/assets/Houseo1.jpg',
			publishedDate: '2025-10-22',
			readTime: 6,
			tags: ['Smart Home', 'Technology', 'Innovation', 'Automation'],
			views: 1892,
			featured: true
		},
		{
			id: 4,
			slug: 'minimalist-interior-design-trends',
			title: 'Minimalist Interior Design: Creating Serenity in Modern Spaces',
			excerpt: 'Learn the art of minimalist design and how to create peaceful, functional spaces that embrace simplicity without sacrificing style or comfort.',
			content: 'Full article content here...',
			category: 'Design',
			author: {
				name: 'Tea Mucmeraj',
				role: 'Senior Real Estate Analyst',
			avatar: '/assets/TeaMucmeraj.jpg'
		},
		image: '/assets/1.jpg',
			publishedDate: '2025-10-20',
			readTime: 7,
			tags: ['Interior Design', 'Minimalism', 'Home Decor', 'Lifestyle'],
			views: 2156,
			featured: false
		},
		{
			id: 5,
			slug: 'first-time-home-buyer-complete-guide',
			title: 'First-Time Home Buyer\'s Complete Guide: Your Path to Ownership',
			excerpt: 'Navigate the home buying process with confidence. This comprehensive guide covers everything from securing financing to closing the deal on your first property.',
			content: 'Full article content here...',
			category: 'Buying Guide',
			author: {
				name: 'Lea Lulaj',
				role: 'Market Research Director',
			avatar: '/assets/LeaLulaj.jpg'
		},
		image: '/assets/2.jpg',
			publishedDate: '2025-10-18',
			readTime: 12,
			tags: ['First-Time Buyer', 'Mortgage', 'Investment', 'Guide'],
			views: 4235,
			featured: false
		},
		{
			id: 6,
			slug: 'urban-vs-suburban-living-2025',
			title: 'Urban vs. Suburban: Where Should You Live in 2025?',
			excerpt: 'Explore the pros and cons of city and suburban living in today\'s changing landscape, helping you make an informed decision about your ideal location.',
			content: 'Full article content here...',
			category: 'Lifestyle',
			author: {
				name: 'Nedit Xhaferi',
				role: 'Technology Consultant',
			avatar: '/assets/NeditXhaferi.jpg'
		},
		image: '/assets/3.jpg',
			publishedDate: '2025-10-15',
			readTime: 9,
			tags: ['Lifestyle', 'Urban Living', 'Suburban', 'Comparison'],
			views: 3087,
			featured: false
		},
		{
			id: 7,
			slug: 'property-investment-strategies',
			title: 'Property Investment Strategies That Generate Consistent Returns',
			excerpt: 'Discover proven investment strategies used by successful real estate investors to build wealth and create passive income streams through property ownership.',
			content: 'Full article content here...',
			category: 'Investment',
			author: {
				name: 'Tea Mucmeraj',
				role: 'Senior Real Estate Analyst',
			avatar: '/assets/TeaMucmeraj.jpg'
		},
		image: '/assets/4.jpg',
		publishedDate: '2025-10-12',
			readTime: 11,
			tags: ['Investment', 'ROI', 'Strategy', 'Passive Income'],
			views: 5128,
			featured: false
		},
		{
			id: 8,
			slug: 'home-staging-secrets-faster-sales',
			title: 'Home Staging Secrets: How to Sell Your Property Faster',
			excerpt: 'Professional staging tips that help properties sell faster and for higher prices, including budget-friendly DIY strategies that make a big impact.',
			content: 'Full article content here...',
			category: 'Selling Tips',
			author: {
				name: 'Lea Lulaj',
				role: 'Market Research Director',
			avatar: '/assets/LeaLulaj.jpg'
		},
		image: '/assets/5.jpg',
		publishedDate: '2025-10-10',
			readTime: 8,
			tags: ['Home Staging', 'Selling', 'Real Estate Tips', 'Design'],
			views: 2943,
			featured: false
		},
		{
			id: 9,
			slug: 'real-estate-photography-tips',
			title: 'Real Estate Photography: Capturing Properties That Sell',
			excerpt: 'Master the art of property photography with professional techniques for lighting, composition, and editing that make listings stand out from the competition.',
			content: 'Full article content here...',
			category: 'Marketing',
			author: {
				name: 'Nedit Xhaferi',
				role: 'Technology Consultant',
			avatar: '/assets/NeditXhaferi.jpg'
		},
		image: '/assets/6.jpg',
			publishedDate: '2025-10-08',
			readTime: 6,
			tags: ['Photography', 'Marketing', 'Real Estate', 'Visual Content'],
			views: 1764,
			featured: false
		}
	];

	const categories = [
		{ name: 'All Posts', slug: 'all', count: blogPosts.length },
		{ name: 'Market Trends', slug: 'market-trends', count: 2 },
		{ name: 'Investment', slug: 'investment', count: 2 },
		{ name: 'Design', slug: 'design', count: 2 },
		{ name: 'Technology', slug: 'technology', count: 2 },
		{ name: 'Lifestyle', slug: 'lifestyle', count: 2 },
		{ name: 'Buying Guide', slug: 'buying-guide', count: 1 },
		{ name: 'Selling Tips', slug: 'selling-tips', count: 1 }
	];

	const featuredPosts = blogPosts.filter(post => post.featured);
	const latestPosts = [...blogPosts].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

	return {
		posts: blogPosts,
		featuredPosts,
		latestPosts,
		categories
	};
}

