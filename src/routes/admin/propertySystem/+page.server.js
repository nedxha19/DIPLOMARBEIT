import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin/login');
	return { properties: await db('SELECT * FROM properties ORDER BY id DESC') };
};

export const actions = {
	deleteProperty: async ({ request }) => {
		await db('DELETE FROM properties WHERE id=?', [(await request.formData()).get('id')]);
		return { success: true };
	}
};
