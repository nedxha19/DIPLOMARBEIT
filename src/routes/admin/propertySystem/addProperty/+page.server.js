import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/admin/login');
}

const validatePropertyData = (formData) => {
    const image = formData.get('image');
    const location = formData.get('location')?.trim();
    const type = formData.get('type')?.trim();
    const price = formData.get('price');

    if (!image || image.size === 0) throw error(400, 'Image is required');
    if (!location || !type || !price) throw error(400, 'Location, type, and price are required');

    return {
        image,
        location,
        type,
        address: formData.get('address')?.trim(),
        price: parseFloat(price) || 0,
        bedrooms: parseInt(formData.get('bedrooms')) || 0,
        bathrooms: parseInt(formData.get('bathrooms')) || 0,
        squareFoot: parseInt(formData.get('square_foot')) || 0
    };
};

export const actions = {
    upload: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/admin/login');

        const formData = await request.formData();
        const data = validatePropertyData(formData);

        const connection = await createConnection();
        try {
            const imagePath = `property_images/${Date.now()}-${data.image.name.replace(/\s+/g, '_')}`;
            const { url } = await put(imagePath, data.image, { access: 'public', token: BLOB_READ_WRITE_TOKEN });

            await connection.execute(
                'INSERT INTO properties (image, location, type, price, bedrooms, bathrooms, square_foot, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [url, data.location, data.type, data.price, data.bedrooms, data.bathrooms, data.squareFoot, data.address]
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
