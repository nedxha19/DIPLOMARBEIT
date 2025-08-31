import { createConnection } from '$lib/db/mysql';

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session');

  if (token) {
    const db = await createConnection();
    try {
      const [users] = await db.query(
        'SELECT id, email, username FROM users WHERE session_token = ? AND session_expiration > NOW()',
        [token]
      );

      if (users.length > 0) {
        event.locals.user = users[0];
      } else {
        event.cookies.delete('session', { path: '/' });
      }
    } catch (err) {
      console.error('Session validation error:', err);
      event.cookies.delete('session', { path: '/' });
    } finally {
      db.release();
    }
  }

  return resolve(event);
};
