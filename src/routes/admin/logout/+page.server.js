import { redirect } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql';

export const load = async ({ cookies }) => {
  const token = cookies.get('session');
  
  if (token) {
    const connection = await createConnection();
    try {
      await connection.execute('UPDATE users SET session_token = NULL, session_expiration = NULL WHERE session_token = ?', [token]);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      connection.release();
    }
  }

  cookies.set('session', '', { path: '/', maxAge: -1 });
  throw redirect(302, '/admin/login');
};