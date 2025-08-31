// 🔄 Import the function to create a connection to your MySQL database
import { createConnection } from '$lib/db/mysql';

// ✅ This is the SvelteKit "handle" hook — it runs for every request (page load, form, etc.)
export const handle = async ({ event, resolve }) => {
  // 🍪 Get the session token stored in the user's browser cookies (if exists)
  const token = event.cookies.get('session');

  // ✅ If a session token is found, we try to validate it
  if (token) {
    try {
      // 🔌 Create a database connection from the pool
      const db = await createConnection();

      // 🔍 Query the users table to find a user whose session_token matches
      // AND whose session_expiration is still in the future
      const [users] = await db.query(
        'SELECT * FROM users WHERE session_token = ? AND session_expiration > NOW()',
        [token]
      );

      // ✅ Done with the DB connection, so we release it
      db.release();

      // 👤 If a user was found with a valid session
      if (users.length > 0) {
        // We attach this user info to `event.locals`
        // This allows all `load()` and `actions` to access `locals.user`
        event.locals.user = {
          id: users[0].id,
          email: users[0].email,
          username: users[0].username
        };
      } else {
        // ⛔ If token was invalid (user not found or expired), clear the cookie
        event.cookies.set('session', '', {
          path: '/',
          maxAge: -1 // Removes cookie
        });
      }
    } catch (err) {
      // ⚠️ If something goes wrong (e.g. DB error), log it and clear session cookie
      console.error('Session validation error:', err);

      event.cookies.set('session', '', {
        path: '/',
        maxAge: -1 // Removes cookie
      });
    }
  }

  // 🔚 Allow the request to continue normally (e.g. go to load functions or form handlers)
  return resolve(event);
};
