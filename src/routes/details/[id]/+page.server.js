import { error } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';

export const load = async ({ params }) => {
	const rows = await db(`SELECT p.*, pd.description, pd.gallery_images, pd.virtual_tour_url, pd.year_built, pd.last_renovation, pd.energy_rating, pd.status, pd.contact_info FROM properties p LEFT JOIN property_details pd ON p.id=pd.property_id WHERE p.id=?`, [params.id]);
	if (!rows.length) error(404, 'Property not found');
	
	const r = rows[0];
	const gallery = r.gallery_images ? JSON.parse(r.gallery_images) || [] : [];
	
	return {
		property: {
			id: r.id, image: r.image, location: r.location, type: r.type, price: Number(r.price),
			bedrooms: Number(r.bedrooms), bathrooms: Number(r.bathrooms), square_foot: Number(r.square_foot),
			address: r.address ?? '', description: r.description ?? '',
			gallery_images: gallery.length ? gallery : [r.image].filter(Boolean),
			virtual_tour_url: r.virtual_tour_url ?? null, year_built: r.year_built ?? null,
			last_renovation: r.last_renovation ?? null, energy_rating: r.energy_rating ?? null,
			status: r.status ?? 'active', contact_info: r.contact_info ?? null
		}
	};
};
