export const load = async ({ params }) => {
    const articleId = parseInt(params.id);
    
    // All articles (same as in main +page.server.js)
    const allArticles = [
        {
            id: 1,
            title: '2024 Market Trends: What Buyers Need to Know',
            category: 'Market Analysis',
            date: '2024-11-15',
            readTime: '5 min read',
            views: 12453,
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
            excerpt: 'Discover the latest trends shaping the real estate market this year.',
            content: `
                <p>The real estate market in 2024 is experiencing unprecedented changes driven by several key factors. Understanding these trends is crucial for both first-time buyers and seasoned investors.</p>
                
                <h2>Rising Interest Rates Impact</h2>
                <p>Interest rates have reached their highest levels in over a decade, significantly affecting buyer purchasing power. While this has cooled some markets, it's also created opportunities for well-prepared buyers.</p>
                
                <h2>Emerging Neighborhoods</h2>
                <p>Remote work has fundamentally changed location preferences. Suburban areas within 50 miles of major cities are seeing unprecedented growth as buyers seek space and affordability without completely disconnecting from urban centers.</p>
                
                <h2>Technology Integration</h2>
                <p>Smart home features are no longer luxury additions—they're becoming standard expectations. Properties with integrated technology systems are commanding premium prices and selling faster.</p>
                
                <h2>Sustainability Matters</h2>
                <p>Green building features and energy efficiency are increasingly important to modern buyers. Properties with solar panels, efficient HVAC systems, and sustainable materials are seeing higher valuations.</p>
                
                <h2>What This Means for You</h2>
                <p>As a buyer in 2024, it's essential to work with knowledgeable real estate professionals who understand these market dynamics. Being pre-approved for financing and acting quickly on suitable properties remains crucial in competitive markets.</p>
            `,
            author: {
                name: 'Sarah Mitchell',
                title: 'Senior Real Estate Advisor',
                image: 'https://i.pravatar.cc/150?img=1',
                bio: '12+ years of experience in residential real estate. Specializing in market analysis and buyer consultation.'
            },
            tags: ['Market Trends', 'Buying Tips', 'Investment'],
            relatedArticles: [2, 3, 5]
        },
        // Add more articles as needed...
    ];
    
    const article = allArticles.find(a => a.id === articleId);
    
    if (!article) {
        return {
            status: 404,
            error: 'Article not found'
        };
    }
    
    // Get related articles
    const relatedArticles = allArticles
        .filter(a => article.relatedArticles.includes(a.id))
        .slice(0, 3);
    
    return {
        article,
        relatedArticles
    };
};



