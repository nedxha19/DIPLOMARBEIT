import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/login');

    const connection = await createConnection();
    try {
        const [properties] = await connection.execute('SELECT * FROM properties ORDER BY id DESC');
        return { properties };
    } catch (err) {
        console.error('Database error:', err);
        throw error(500, 'Failed to load properties');
    } finally {
        connection.release();
    }
}
