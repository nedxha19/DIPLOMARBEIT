import { db } from '$lib/db/helpers';

export const load = async ({ url }) => {
    try {
        // Get query parameters
        const search = url.searchParams.get('search') || '';
        const type = url.searchParams.get('type') || '';
        const minPrice = url.searchParams.get('minPrice') || '';
        const maxPrice = url.searchParams.get('maxPrice') || '';
        const bedrooms = url.searchParams.get('bedrooms') || '';
        const bathrooms = url.searchParams.get('bathrooms') || '';
        const sortBy = url.searchParams.get('sortBy') || 'newest';
        
        // Build query
        let query = 'SELECT * FROM properties WHERE 1=1';
        const params = [];
        
        if (search) {
            query += ' AND (location LIKE ? OR address LIKE ? OR type LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        if (type && type !== 'All Types') {
            query += ' AND type = ?';
            params.push(type);
        }
        
        if (minPrice) {
            query += ' AND price >= ?';
            params.push(parseInt(minPrice));
        }
        
        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(parseInt(maxPrice));
        }
        
        if (bedrooms) {
            query += ' AND bedrooms >= ?';
            params.push(parseInt(bedrooms));
        }
        
        if (bathrooms) {
            query += ' AND bathrooms >= ?';
            params.push(parseInt(bathrooms));
        }
        
        // Add sorting
        switch(sortBy) {
            case 'price_low':
                query += ' ORDER BY price ASC';
                break;
            case 'price_high':
                query += ' ORDER BY price DESC';
                break;
            case 'bedrooms':
                query += ' ORDER BY bedrooms DESC';
                break;
            case 'newest':
            default:
                query += ' ORDER BY id DESC';
                break;
        }
        
        const properties = await db(query, params);
        
        // Get filter options for sidebar
        const allTypes = await db('SELECT DISTINCT type FROM properties ORDER BY type');
        const priceRange = await db('SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM properties');
        
        return {
            properties: properties || [],
            filters: {
                types: allTypes.map(t => t.type),
                priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000000 }
            },
            currentFilters: {
                search,
                type,
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                sortBy
            }
        };
    } catch (error) {
        console.error('Error loading properties:', error);
        return {
            properties: [],
            filters: {
                types: [],
                priceRange: { minPrice: 0, maxPrice: 10000000 }
            },
            currentFilters: {}
        };
    }
};
