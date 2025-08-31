import { register } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';
import { validateEmail, validatePassword } from '$lib/utils/authUtils';

export const load = async ({ locals }) => {
  if (!locals.user || locals.user.email !== 'nedxha19@htl-shkoder.com') {
    throw redirect(302, '/admin/login');
  }
};

export const actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const username = data.get('username');
    const password = data.get('password');
    const confirm = data.get('confirmPassword');

    if (!validateEmail(email)) return { success: false, message: 'Invalid email format' };
    if (!username || username.length < 3) return { success: false, message: 'Username too short' };
    if (!validatePassword(password)) return { success: false, message: 'Password too weak' };
    if (password !== confirm) return { success: false, message: 'Passwords do not match' };

    const result = await register(email, username, password);
    if (!result.success) return result;

    throw redirect(302, '/admin/login');
  }
};