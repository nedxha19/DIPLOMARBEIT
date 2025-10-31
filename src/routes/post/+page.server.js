export const load = async ({ url }) => {
    const category = url.searchParams.get('category') || 'All';
    const search = url.searchParams.get('search') || '';
    
    // Comprehensive article database
    const allArticles = [
        {
            id: 1,
            title: '2024 Market Trends: What Buyers Need to Know',
            category: 'Market Analysis',
            date: '2024-11-15',
            readTime: '5 min read',
            views: 12453,
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            excerpt: 'Discover the latest trends shaping the real estate market this year. From rising interest rates to emerging neighborhoods, here\'s what every buyer should know.',
            content: 'Full article content here...',
            author: {
                name: 'Sarah Mitchell',
                title: 'Senior Real Estate Advisor',
                image: 'https://i.pravatar.cc/150?img=1',
                bio: '12+ years of experience in residential real estate'
            },
            tags: ['Market Trends', 'Buying Tips', 'Investment'],
            featured: true,
            relatedArticles: [2, 3, 5]
        },
        {
            id: 2,
            title: 'First-Time Home Buyer Complete Guide 2024',
            category: 'Buyer Tips',
            date: '2024-11-10',
            readTime: '12 min read',
            views: 18729,
            image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
            excerpt: 'Everything you need to know before purchasing your first home. From mortgage pre-approval to closing costs, we cover all the essentials step by step.',
            content: 'Full article content here...',
            author: {
                name: 'David Chen',
                title: 'Mortgage Specialist',
                image: 'https://i.pravatar.cc/150?img=2',
                bio: '15+ years helping first-time buyers'
            },
            tags: ['First-Time Buyer', 'Mortgage', 'Financing'],
            featured: true,
            relatedArticles: [1, 4, 8]
        },
        {
            id: 3,
            title: 'Investment Property ROI: Complete Calculator Guide',
            category: 'Investment',
            date: '2024-11-05',
            readTime: '8 min read',
            views: 9834,
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
            excerpt: 'Learn how to calculate and maximize your real estate investment returns with proven strategies from industry experts and real-world case studies.',
            content: 'Full article content here...',
            author: {
                name: 'Emma Rodriguez',
                title: 'Investment Consultant',
                image: 'https://i.pravatar.cc/150?img=3',
                bio: 'Specializing in rental property analysis'
            },
            tags: ['Investment', 'ROI', 'Rental Property'],
            featured: false,
            relatedArticles: [1, 6, 9]
        },
        {
            id: 4,
            title: 'Home Staging Secrets: Boost Your Sale Price by 20%',
            category: 'Seller Tips',
            date: '2024-10-28',
            readTime: '7 min read',
            views: 15621,
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            excerpt: 'Professional staging tips that can increase your home\'s value significantly. Learn what buyers really want to see and how to present your property.',
            content: 'Full article content here...',
            author: {
                name: 'Michael Johnson',
                title: 'Home Staging Expert',
                image: 'https://i.pravatar.cc/150?img=4',
                bio: '20+ years in luxury property staging'
            },
            tags: ['Staging', 'Selling Tips', 'Home Design'],
            featured: false,
            relatedArticles: [5, 7, 2]
        },
        {
            id: 5,
            title: 'Understanding Real Estate Contracts and Legal Documents',
            category: 'Legal',
            date: '2024-10-20',
            readTime: '10 min read',
            views: 7492,
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
            excerpt: 'A comprehensive guide to the legal paperwork involved in property transactions. Know exactly what you\'re signing before closing day.',
            content: 'Full article content here...',
            author: {
                name: 'Sarah Mitchell',
                title: 'Real Estate Attorney',
                image: 'https://i.pravatar.cc/150?img=1',
                bio: 'Licensed attorney specializing in real estate law'
            },
            tags: ['Legal', 'Contracts', 'Documentation'],
            featured: false,
            relatedArticles: [2, 4, 8]
        },
        {
            id: 6,
            title: 'Luxury Real Estate Market Outlook 2025',
            category: 'Market Analysis',
            date: '2024-10-15',
            readTime: '9 min read',
            views: 11234,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            excerpt: 'An in-depth analysis of the luxury property market and predictions for the coming year. Where should high-end buyers and investors focus?',
            content: 'Full article content here...',
            author: {
                name: 'David Chen',
                title: 'Luxury Market Analyst',
                image: 'https://i.pravatar.cc/150?img=2',
                bio: 'Tracking high-end market trends since 2009'
            },
            tags: ['Luxury', 'Market Analysis', 'Investment'],
            featured: true,
            relatedArticles: [1, 3, 9]
        },
        {
            id: 7,
            title: 'Sustainable Homes: The Future of Real Estate',
            category: 'Trends',
            date: '2024-10-08',
            readTime: '6 min read',
            views: 13567,
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
            excerpt: 'Sustainability is reshaping the housing market. Discover how eco-friendly features add substantial value to properties and attract modern buyers.',
            content: 'Full article content here...',
            author: {
                name: 'Emma Rodriguez',
                title: 'Green Building Consultant',
                image: 'https://i.pravatar.cc/150?img=3',
                bio: 'LEED certified professional'
            },
            tags: ['Sustainability', 'Green Building', 'Trends'],
            featured: false,
            relatedArticles: [1, 6, 4]
        },
        {
            id: 8,
            title: 'Negotiation Tactics for Real Estate Buyers',
            category: 'Buyer Tips',
            date: '2024-10-01',
            readTime: '7 min read',
            views: 14892,
            image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
            excerpt: 'Master the art of negotiation to get the best deal possible. Expert strategies that work in any market condition, from hot to cold markets.',
            content: 'Full article content here...',
            author: {
                name: 'Michael Johnson',
                title: 'Negotiation Expert',
                image: 'https://i.pravatar.cc/150?img=4',
                bio: 'Saved clients over $50M in negotiations'
            },
            tags: ['Negotiation', 'Buying Tips', 'Strategy'],
            featured: false,
            relatedArticles: [2, 5, 1]
        },
        {
            id: 9,
            title: 'Remote Work Impact on Suburban Housing Demand',
            category: 'Market Analysis',
            date: '2024-09-25',
            readTime: '6 min read',
            views: 10456,
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            excerpt: 'How the remote work revolution is driving unprecedented demand for suburban properties and fundamentally changing neighborhood dynamics.',
            content: 'Full article content here...',
            author: {
                name: 'Sarah Mitchell',
                title: 'Market Research Director',
                image: 'https://i.pravatar.cc/150?img=1',
                bio: 'PhD in Urban Economics'
            },
            tags: ['Remote Work', 'Suburbs', 'Market Trends'],
            featured: false,
            relatedArticles: [1, 6, 7]
        },
        {
            id: 10,
            title: 'Property Tax Deductions Every Homeowner Should Know',
            category: 'Legal',
            date: '2024-09-18',
            readTime: '8 min read',
            views: 8734,
            image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800',
            excerpt: 'Maximize your tax savings with these often-overlooked deductions. A comprehensive guide to property tax benefits for homeowners.',
            content: 'Full article content here...',
            author: {
                name: 'David Chen',
                title: 'Tax Consultant',
                image: 'https://i.pravatar.cc/150?img=2',
                bio: 'CPA specializing in real estate taxation'
            },
            tags: ['Tax', 'Legal', 'Homeowner Tips'],
            featured: false,
            relatedArticles: [5, 2, 3]
        },
        {
            id: 11,
            title: 'Smart Home Technology: Adding Value to Your Property',
            category: 'Trends',
            date: '2024-09-10',
            readTime: '7 min read',
            views: 16789,
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
            excerpt: 'Discover which smart home upgrades offer the best ROI and how technology is becoming a key factor in property valuations.',
            content: 'Full article content here...',
            author: {
                name: 'Emma Rodriguez',
                title: 'Technology Specialist',
                image: 'https://i.pravatar.cc/150?img=3',
                bio: 'Smart home integration expert'
            },
            tags: ['Technology', 'Smart Home', 'Property Value'],
            featured: false,
            relatedArticles: [7, 4, 1]
        },
        {
            id: 12,
            title: 'Downsizing in Retirement: A Complete Guide',
            category: 'Seller Tips',
            date: '2024-09-05',
            readTime: '9 min read',
            views: 9123,
            image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
            excerpt: 'Planning to downsize? Learn how to make the transition smooth and financially beneficial. Tips from retirement living experts.',
            content: 'Full article content here...',
            author: {
                name: 'Michael Johnson',
                title: 'Senior Living Advisor',
                image: 'https://i.pravatar.cc/150?img=4',
                bio: 'Helping seniors transition for 15+ years'
            },
            tags: ['Downsizing', 'Retirement', 'Selling'],
            featured: false,
            relatedArticles: [4, 5, 2]
        }
    ];
    
    // Filter articles
    let filteredArticles = allArticles;
    
    if (category !== 'All') {
        filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
            article.title.toLowerCase().includes(searchLower) ||
            article.excerpt.toLowerCase().includes(searchLower) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    // Get category counts
    const categoryCounts = {};
    allArticles.forEach(article => {
        categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
    });
    
    // Get featured articles
    const featuredArticles = allArticles.filter(article => article.featured);
    
    // Get popular articles (by views)
    const popularArticles = [...allArticles]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    
    // Get recent articles
    const recentArticles = [...allArticles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    // Get all unique tags
    const allTags = [...new Set(allArticles.flatMap(article => article.tags))];
    
    return {
        articles: filteredArticles,
        featuredArticles,
        popularArticles,
        recentArticles,
        categoryCounts,
        allTags,
        currentCategory: category,
        searchQuery: search
    };
};



