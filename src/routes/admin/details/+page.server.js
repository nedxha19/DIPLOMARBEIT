import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/admin/login');

    const connection = await createConnection();
    try {
        const [properties, existingDetails] = await Promise.all([
            connection.execute('SELECT id, location, type, address, price FROM properties ORDER BY id DESC'),
            connection.execute(`
                SELECT pd.*, p.location, p.type, p.address 
                FROM property_details pd 
                JOIN properties p ON pd.property_id = p.id 
                ORDER BY pd.created_at DESC
            `)
        ]);
        return { user: locals.user, properties: properties[0], existingDetails: existingDetails[0] };
    } finally {
        connection.release();
    }
}

// Helper functions
const extractFormData = (formData) => ({
    propertyId: formData.get('property_id'),
    title: formData.get('title') || null,
    overviewDescription: formData.get('overview_description'),
    propertyType: formData.get('property_type'),
    yearBuilt: parseInt(formData.get('year_built')) || null,
    squareFootage: parseInt(formData.get('square_footage')) || null,
    lotSize: formData.get('lot_size'),
    bedrooms: parseInt(formData.get('bedrooms')) || null,
    bathrooms: parseInt(formData.get('bathrooms')) || null,
    garage: formData.get('garage'),
    heating: formData.get('heating'),
    cooling: formData.get('cooling'),
    architecture: formData.get('architecture'),
    roof: formData.get('roof'),
    exterior: formData.get('exterior'),
    virtualTourUrl: formData.get('virtual_tour_url') || null,
    locationDescription: formData.get('location_description'),
    nearbySchools: formData.getAll('nearby_schools[]').filter(Boolean),
    nearbyShopping: formData.getAll('nearby_shopping[]').filter(Boolean),
    nearbyCompanies: formData.getAll('nearby_companies[]').filter(Boolean),
    nearbyTransport: formData.getAll('nearby_transport[]').filter(Boolean),
    mapEmbedUrl: formData.get('map_embed_url')
});

const uploadFiles = async (files, prefix) => {
    const uploads = files
        .filter(file => file?.size > 0)
        .map(async (file, i) => {
            const path = `property_details/${Date.now()}-${prefix}-${i}-${file.name.replace(/\s+/g, '_')}`;
            const { url } = await put(path, file, { access: 'public', token: BLOB_READ_WRITE_TOKEN });
            return url;
        });
    return Promise.all(uploads);
};

const buildQueryParams = (data, galleryUrls, videoUrl) => [
    data.title, data.overviewDescription, data.propertyType, data.yearBuilt, 
    data.squareFootage, data.lotSize, data.bedrooms, data.bathrooms, 
    data.garage, data.heating, data.cooling, data.architecture,
    data.roof, data.exterior, JSON.stringify(galleryUrls), 
    data.virtualTourUrl, videoUrl, JSON.stringify(data.nearbySchools), 
    JSON.stringify(data.nearbyShopping), JSON.stringify(data.nearbyCompanies), 
    JSON.stringify(data.nearbyTransport), data.locationDescription, data.mapEmbedUrl
];

export const actions = {
    saveDetails: async ({ request }) => {
        const formData = await request.formData();
        const data = extractFormData(formData);
        
        if (!data.propertyId) throw error(400, 'Property ID is required');

        const connection = await createConnection();
        try {
            const [galleryUrls, videoUrl, existing] = await Promise.all([
                uploadFiles(formData.getAll('gallery_images'), 'gallery'),
                uploadFiles([formData.get('video_tour')], 'video').then(urls => urls[0] || null),
                connection.execute('SELECT id FROM property_details WHERE property_id = ?', [data.propertyId])
            ]);

            const params = buildQueryParams(data, galleryUrls, videoUrl);
            const query = existing[0].length > 0 
                ? `UPDATE property_details SET title=?, overview_description=?, property_type=?, year_built=?, square_footage=?, lot_size=?, bedrooms=?, bathrooms=?, garage=?, heating=?, cooling=?, architecture=?, roof=?, exterior=?, gallery_images=?, virtual_tour_url=?, video_tour_url=?, nearby_schools=?, nearby_shopping=?, nearby_companies=?, nearby_transport=?, location_description=?, map_embed_url=?, updated_at=CURRENT_TIMESTAMP WHERE property_id=?`
                : `INSERT INTO property_details (property_id, title, overview_description, property_type, year_built, square_footage, lot_size, bedrooms, bathrooms, garage, heating, cooling, architecture, roof, exterior, gallery_images, virtual_tour_url, video_tour_url, nearby_schools, nearby_shopping, nearby_companies, nearby_transport, location_description, map_embed_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            const queryParams = existing[0].length > 0 ? [...params, data.propertyId] : [data.propertyId, ...params];
            await connection.execute(query, queryParams);

            return { success: true, message: 'Property details saved successfully!' };
        } catch (err) {
            console.error('Database error:', err);
            throw error(500, 'Failed to save property details');
        } finally {
            connection.release();
        }
    },
    
    deleteDetails: async ({ request }) => {
        const formData = await request.formData();
        const detailsId = formData.get('details_id');
        
        if (!detailsId) throw error(400, 'Details ID is required');

        const connection = await createConnection();
        try {
            await connection.execute('DELETE FROM property_details WHERE id = ?', [detailsId]);
            return { success: true, message: 'Property details deleted successfully!' };
        } catch (err) {
            console.error('Delete error:', err);
            throw error(500, 'Failed to delete property details');
        } finally {
            connection.release();
        }
    }
};
