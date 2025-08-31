import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/admin/login');
    return { user: locals.user };
}

export const actions = {
    upload: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/admin/login');

        const formData = await request.formData();
        const uploadedImage = formData.get('image');
        const location = formData.get('location');
        const type = formData.get('type');
        const price = formData.get('price');
        const bedrooms = formData.get('bedrooms');
        const bathrooms = formData.get('bathrooms');
        const squareFoot = formData.get('square_foot');
        const address = formData.get('address');

        if (!uploadedImage || uploadedImage.size === 0) throw error(400, 'Image is required');
        if (!location || !type || !price) throw error(400, 'Location, type, and price are required');

        const connection = await createConnection();
        try {
            const uniquePath = `property_images/${Date.now()}-${uploadedImage.name.replace(/\s+/g, '_')}`;
            const { url } = await put(uniquePath, uploadedImage, { access: 'public', token: BLOB_READ_WRITE_TOKEN });

            await connection.execute(
                `INSERT INTO properties (image, location, type, price, bedrooms, bathrooms, square_foot, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [url, location, type, parseFloat(price), parseInt(bedrooms), parseInt(bathrooms), parseInt(squareFoot), address]
            );

            return { success: true, uploaded: url, message: 'Property added successfully' };
        } catch (err) {
            console.error('Upload error:', err);
            throw error(500, 'Failed to add property');
        } finally {
            connection.release();
        }
    }
};
