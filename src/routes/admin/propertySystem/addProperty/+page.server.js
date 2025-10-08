import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin/login');
};

export const actions = {
	upload: async ({ request }) => {
		const fd = await request.formData();
		const img = fd.get('image');
		
		const { url } = await put(`property_images/${Date.now()}-${img.name.replace(/\s+/g, '_')}`, img, { access: 'public', token: BLOB_READ_WRITE_TOKEN });
		await db('INSERT INTO properties (image, location, type, price, bedrooms, bathrooms, square_foot, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
			[url, fd.get('location'), fd.get('type'), fd.get('price'), fd.get('bedrooms'), fd.get('bathrooms'), fd.get('square_foot'), fd.get('address')]);
		
		return { success: true, uploaded: url };
	}
};
