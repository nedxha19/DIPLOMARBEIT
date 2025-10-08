import { login } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const fd = await request.formData();
		const result = await login(fd.get('email'), fd.get('password'));
		
		if (result.token) {
			cookies.set('session', result.token, { path: '/', httpOnly: true, sameSite: 'strict', maxAge: 604800 });
			throw redirect(302, '/admin/propertySystem');
		}
		
		return { success: false };
	}
};
