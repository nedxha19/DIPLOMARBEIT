import { createConnection } from '$lib/db/mysql';
import { error } from '@sveltejs/kit';

const parseJsonField = (value) => {
    if (!value) return [];
    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
};

export async function load({ params }) {
    const { id } = params;
    const connection = await createConnection();
    
    try {
        const [propertyResult] = await connection.execute(`
            SELECT p.*, pd.title, pd.overview_description, pd.property_type, pd.year_built, 
                   pd.square_footage, pd.lot_size, pd.bedrooms, pd.bathrooms, pd.garage, 
                   pd.heating, pd.cooling, pd.architecture, pd.roof, pd.exterior, 
                   pd.gallery_images, pd.virtual_tour_url, pd.video_tour_url, 
                   pd.nearby_schools, pd.nearby_shopping, pd.nearby_companies, 
                   pd.nearby_transport, pd.location_description, pd.map_embed_url
            FROM properties p
            LEFT JOIN property_details pd ON p.id = pd.property_id
            WHERE p.id = ?
        `, [id]);
        
        if (propertyResult.length === 0) throw error(404, 'Property not found');
        
        const property = propertyResult[0];
        
        // Parse JSON fields
        ['gallery_images', 'nearby_schools', 'nearby_shopping', 'nearby_companies', 'nearby_transport']
            .forEach(field => property[field] = parseJsonField(property[field]));
        
        return { property };
    } finally {
        connection.release();
    }
}
