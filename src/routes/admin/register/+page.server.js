import { register } from '$lib/db/auth';

export const actions = {
	register: async ({ request }) => {
		const fd = await request.formData();
		return await register(fd.get('email'), fd.get('username'), fd.get('password'));
	}
};
