import { db } from '$lib/db/helpers';

export const load = async () => {
    try {
        // Fetch featured properties (limit to 6)
        const featuredProperties = await db('SELECT id, location, price, image, type, bedrooms, bathrooms, square_foot, address FROM properties ORDER BY price DESC LIMIT 6');
        
        // Calculate statistics
        const totalProperties = await db('SELECT COUNT(*) as count FROM properties');
        const propertyCount = totalProperties[0]?.count || 0;
        
        // Return data with stats
        return {
            featuredProperties: featuredProperties || [],
            stats: {
                totalProperties: propertyCount,
                happyClients: 2500,
                citiesCovered: 120,
                yearsExperience: 15
            }
        };
    } catch (error) {
        console.error('Error loading homepage data:', error);
        return {
            featuredProperties: [],
            stats: {
                totalProperties: 0,
                happyClients: 2500,
                citiesCovered: 120,
                yearsExperience: 15
            }
        };
    }
};
