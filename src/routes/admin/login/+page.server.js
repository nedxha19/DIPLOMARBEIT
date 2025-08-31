import { login } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';
import { validateEmail, validatePassword } from '$lib/utils/authUtils';

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email)) return { success: false, message: 'Invalid email format' };
    if (!validatePassword(password)) return { success: false, message: 'Password must be at least 8 characters' };

    const result = await login(email, password);

    if (result.token) {
      cookies.set('session', result.token, { 
        path: '/', 
        httpOnly: true, 
        sameSite: 'strict', 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 
      });
      throw redirect(302, '/admin/propertySystem');
    }

    return { success: false, message: result.message };
  }
};