import { createConnection } from './mysql';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


export async function createSessionToken(userId) {
  const db = await createConnection();
  const token   = uuidv4();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.execute(
    'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
    [token, expires, userId]
  );
  db.release();
  return token;
}

/* ------------------------------------------------------------------ */
/*  Login                                                             */
/* ------------------------------------------------------------------ */
export async function login(email, password) {
  const db = await createConnection();

  // fetch user
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!users.length) {
    db.release();
    return { token: null, message: 'Email not found' };
  }

  // verify password
  const ok = await bcrypt.compare(password, users[0].password_hash);
  if (!ok) {
    db.release();
    return { token: null, message: 'Incorrect password' };
  }

  // invalidate any previous sessions and create a fresh token
  await db.execute(
    'UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?',
    [users[0].id]
  );
  const token = await createSessionToken(users[0].id);
  db.release();
  return { token, message: 'Login successful' };
}

/* ------------------------------------------------------------------ */
/*  Register                                                          */
/* ------------------------------------------------------------------ */
export async function register(email, username, password) {
  const db      = await createConnection();
  const hashed  = await bcrypt.hash(password, 12);

  const [emailTaken]    = await db.query('SELECT 1 FROM users WHERE email = ?',    [email]);
  const [usernameTaken] = await db.query('SELECT 1 FROM users WHERE username = ?', [username]);

  if (emailTaken.length)    return { success: false, message: 'Email already in use' };
  if (usernameTaken.length) return { success: false, message: 'Username already in use' };

  await db.execute(
    'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
    [email, username, hashed]
  );
  db.release();
  return { success: true, message: 'User registered successfully' };
}
