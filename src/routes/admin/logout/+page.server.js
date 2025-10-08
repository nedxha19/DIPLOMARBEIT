import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';

export const load = async ({ cookies }) => {
	const token = cookies.get('session');
	if (token) await db('UPDATE users SET session_token=NULL, session_expiration=NULL WHERE session_token=?', [token]).catch(() => {});
	cookies.delete('session', { path: '/' });
	throw redirect(302, '/admin/login');
};
