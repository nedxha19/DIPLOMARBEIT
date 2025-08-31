import { createConnection } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';

export async function load({ locals }) {
    if (!locals.user) throw redirect(302, '/admin/login');
    
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

export const actions = {
    deleteProperty: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/admin/login');
        
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) throw error(400, 'Property ID is required');

        const connection = await createConnection();
        try {
            await connection.execute('DELETE FROM properties WHERE id = ?', [id]);
            return { success: true, message: 'Property deleted successfully' };
        } catch (err) {
            console.error('Delete error:', err);
            throw error(500, 'Failed to delete property');
        } finally {
            connection.release();
        }
    }
};
