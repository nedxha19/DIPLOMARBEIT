import { createConnection } from './mysql';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; 

export async function createSessionToken(userId) {
  const db = await createConnection();
  console.log(db);
  try {
    const token = uuidv4();
    const expires = new Date(Date.now() + SESSION_DURATION);
    await db.execute(
      'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
      [token, expires, userId]
    );
    return token;
  } finally {
    db.release();
  }
}

export async function login(email, password) {
  const db = await createConnection();
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return { token: null, message: 'Email not found' };

    const isValidPassword = await bcrypt.compare(password, users[0].password_hash);
    if (!isValidPassword) return { token: null, message: 'Incorrect password' };

    await db.execute(
      'UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?',
      [users[0].id]
    );
    
    const token = await createSessionToken(users[0].id);
    return { token, message: 'Login successful' };
  } finally {
    db.release();
  }
}

export async function register(email, username, password) {
  const db = await createConnection();
  try {
    const hashed = await bcrypt.hash(password, 12);
    
    const [emailCheck, usernameCheck] = await Promise.all([
      db.query('SELECT 1 FROM users WHERE email = ?', [email]),
      db.query('SELECT 1 FROM users WHERE username = ?', [username])
    ]);

    if (emailCheck[0].length) return { success: false, message: 'Email already in use' };
    if (usernameCheck[0].length) return { success: false, message: 'Username already in use' };

    await db.execute(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, hashed]
    );
    
    return { success: true, message: 'User registered successfully' };
  } finally {
    db.release();
  }
}
