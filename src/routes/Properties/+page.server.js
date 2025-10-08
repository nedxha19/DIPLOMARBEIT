import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	return { properties: await db('SELECT * FROM properties ORDER BY id DESC') };
};
