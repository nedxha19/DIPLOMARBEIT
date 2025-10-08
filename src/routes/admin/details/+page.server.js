import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin/login');
	
	const [properties, existingDetails] = await Promise.all([
		db('SELECT id, location, type, address, price FROM properties ORDER BY id DESC'),
		db(`SELECT pd.*, p.location, p.type, p.address FROM property_details pd JOIN properties p ON pd.property_id=p.id ORDER BY pd.created_at DESC`)
	]);
	
	return { properties, existingDetails };
};

const upload = (files, prefix) => 
	Promise.all(files.filter(f => f?.size > 0).map(async (f, i) => 
		(await put(`property_details/${Date.now()}-${prefix}-${i}-${f.name.replace(/\s+/g, '_')}`, f, { access: 'public', token: BLOB_READ_WRITE_TOKEN })).url
	));

export const actions = {
	saveDetails: async ({ request }) => {
		const fd = await request.formData();
		const pid = fd.get('property_id');
		
		const [gallery, video, existing] = await Promise.all([
			upload(fd.getAll('gallery_images'), 'gallery'),
			upload([fd.get('video_tour')], 'video').then(u => u[0] || null),
			db('SELECT id FROM property_details WHERE property_id=?', [pid])
		]);
		
		const params = [
			fd.get('title'), fd.get('overview_description'), fd.get('property_type'),
			fd.get('year_built'), fd.get('square_footage'), fd.get('lot_size'),
			fd.get('bedrooms'), fd.get('bathrooms'), fd.get('garage'),
			fd.get('heating'), fd.get('cooling'), fd.get('architecture'),
			fd.get('roof'), fd.get('exterior'), JSON.stringify(gallery),
			fd.get('virtual_tour_url'), video,
			JSON.stringify(fd.getAll('nearby_schools[]').filter(Boolean)),
			JSON.stringify(fd.getAll('nearby_shopping[]').filter(Boolean)),
			JSON.stringify(fd.getAll('nearby_companies[]').filter(Boolean)),
			JSON.stringify(fd.getAll('nearby_transport[]').filter(Boolean)),
			fd.get('location_description'), fd.get('map_embed_url')
		];
		
		const sql = existing.length > 0
			? `UPDATE property_details SET title=?, overview_description=?, property_type=?, year_built=?, square_footage=?, lot_size=?, bedrooms=?, bathrooms=?, garage=?, heating=?, cooling=?, architecture=?, roof=?, exterior=?, gallery_images=?, virtual_tour_url=?, video_tour_url=?, nearby_schools=?, nearby_shopping=?, nearby_companies=?, nearby_transport=?, location_description=?, map_embed_url=?, updated_at=CURRENT_TIMESTAMP WHERE property_id=?`
			: `INSERT INTO property_details (property_id, title, overview_description, property_type, year_built, square_footage, lot_size, bedrooms, bathrooms, garage, heating, cooling, architecture, roof, exterior, gallery_images, virtual_tour_url, video_tour_url, nearby_schools, nearby_shopping, nearby_companies, nearby_transport, location_description, map_embed_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		
		await db(sql, existing.length > 0 ? [...params, pid] : [pid, ...params]);
		return { success: true };
	},
	
	deleteDetails: async ({ request }) => {
		await db('DELETE FROM property_details WHERE id=?', [(await request.formData()).get('details_id')]);
		return { success: true };
	}
};
