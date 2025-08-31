import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/admin/login');

    const connection = await createConnection();
    try {
        const [properties] = await connection.execute('SELECT id, location, type, address, price FROM properties ORDER BY id DESC');
        const [existingDetails] = await connection.execute(`
            SELECT pd.*, p.location, p.type, p.address 
            FROM property_details pd 
            JOIN properties p ON pd.property_id = p.id 
            ORDER BY pd.created_at DESC
        `);
        return { user: locals.user, properties, existingDetails };
    } finally {
        connection.release();
    }
}

export const actions = {
    // Create or update property details
    saveDetails: async ({ request }) => {
        const formData = await request.formData();
        const connection = await createConnection();

        try {
            const data = {
                propertyId: formData.get('property_id'),
                title: formData.get('title') || null,
                overviewDescription: formData.get('overview_description'),
                propertyType: formData.get('property_type'),
                yearBuilt: parseInt(formData.get('year_built')),
                squareFootage: parseInt(formData.get('square_footage')),
                lotSize: formData.get('lot_size'),
                bedrooms: parseInt(formData.get('bedrooms')),
                bathrooms: parseInt(formData.get('bathrooms')),
                garage: formData.get('garage'),
                heating: formData.get('heating'),
                cooling: formData.get('cooling'),
                architecture: formData.get('architecture'),
                roof: formData.get('roof'),
                exterior: formData.get('exterior'),
                virtualTourUrl: formData.get('virtual_tour_url') || null,
                locationDescription: formData.get('location_description'),
                nearbySchools: formData.getAll('nearby_schools[]').filter(item => item.trim()),
                nearbyShopping: formData.getAll('nearby_shopping[]').filter(item => item.trim()),
                nearbyCompanies: formData.getAll('nearby_companies[]').filter(item => item.trim()),
                nearbyTransport: formData.getAll('nearby_transport[]').filter(item => item.trim()),
                mapEmbedUrl: formData.get('map_embed_url')
            };

            const galleryUrls = [];
            const galleryFiles = formData.getAll('gallery_images');
            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                if (file?.size > 0) {
                    const uniquePath = `property_details/${Date.now()}-gallery-${i}-${file.name.replace(/\s+/g, '_')}`;
                    const { url } = await put(uniquePath, file, { access: 'public', token: BLOB_READ_WRITE_TOKEN });
                    galleryUrls.push(url);
                }
            }

            let videoUrl = null;
            const videoFile = formData.get('video_tour');
            if (videoFile?.size > 0) {
                const uniquePath = `property_details/${Date.now()}-video-${videoFile.name.replace(/\s+/g, '_')}`;
                const { url } = await put(uniquePath, videoFile, { access: 'public', token: BLOB_READ_WRITE_TOKEN });
                videoUrl = url;
            }

            const [existing] = await connection.execute('SELECT id FROM property_details WHERE property_id = ?', [data.propertyId]);

            const params = [
                data.title, data.overviewDescription, data.propertyType, data.yearBuilt, data.squareFootage, data.lotSize,
                data.bedrooms, data.bathrooms, data.garage, data.heating, data.cooling, data.architecture,
                data.roof, data.exterior, JSON.stringify(galleryUrls), data.virtualTourUrl, videoUrl,
                JSON.stringify(data.nearbySchools), JSON.stringify(data.nearbyShopping),
                JSON.stringify(data.nearbyCompanies), JSON.stringify(data.nearbyTransport),
                data.locationDescription, data.mapEmbedUrl
            ];

            if (existing.length > 0) {
                await connection.execute(`UPDATE property_details SET
                    title=?, overview_description=?, property_type=?, year_built=?, square_footage=?, lot_size=?,
                    bedrooms=?, bathrooms=?, garage=?, heating=?, cooling=?, architecture=?, roof=?, exterior=?,
                    gallery_images=?, virtual_tour_url=?, video_tour_url=?, nearby_schools=?, nearby_shopping=?,
                    nearby_companies=?, nearby_transport=?, location_description=?, map_embed_url=?,
                    updated_at=CURRENT_TIMESTAMP WHERE property_id=?`, [...params, data.propertyId]);
            } else {
                await connection.execute(`INSERT INTO property_details (
                    property_id, title, overview_description, property_type, year_built, square_footage, lot_size,
                    bedrooms, bathrooms, garage, heating, cooling, architecture, roof, exterior, gallery_images,
                    virtual_tour_url, video_tour_url, nearby_schools, nearby_shopping, nearby_companies,
                    nearby_transport, location_description, map_embed_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [data.propertyId, ...params]);
            }

            return { success: true, message: 'Property details saved successfully!' };

        } catch (err) {
            console.error('Database error:', err);
            throw error(500, 'Failed to save property details');
        } finally {
            connection.release();
        }
    },
    
    // Delete property details
    deleteDetails: async ({ request }) => {
        const formData = await request.formData();
        const detailsId = formData.get('details_id');
        const connection = await createConnection();
        
        try {
            await connection.execute(
                'DELETE FROM property_details WHERE id = ?',
                [detailsId]
            );
            
            return { success: true, message: 'Property details deleted successfully!' };
        } catch (err) {
            console.error('Delete error:', err);
            throw error(500, 'Failed to delete property details');
        } finally {
            connection.release();
        }
    }
};
