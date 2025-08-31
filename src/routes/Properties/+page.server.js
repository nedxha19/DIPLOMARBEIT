import { createConnection } from '$lib/db/mysql';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const connection = await createConnection();
    const [properties] = await connection.execute('SELECT * FROM properties ORDER BY id DESC');

    return { properties };
}
