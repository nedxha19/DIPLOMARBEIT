import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/admin/login');
    return { user: locals.user };
}

const validatePropertyData = (formData) => {
    const data = {
        image: formData.get('image'),
        location: formData.get('location')?.trim(),
        type: formData.get('type')?.trim(),
        price: formData.get('price'),
        bedrooms: formData.get('bedrooms'),
        bathrooms: formData.get('bathrooms'),
        squareFoot: formData.get('square_foot'),
        address: formData.get('address')?.trim()
    };

    if (!data.image || data.image.size === 0) throw error(400, 'Image is required');
    if (!data.location || !data.type || !data.price) {
        throw error(400, 'Location, type, and price are required');
    }

    return {
        ...data,
        price: parseFloat(data.price) || 0,
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        squareFoot: parseInt(data.squareFoot) || 0
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
