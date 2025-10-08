import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/helpers';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/admin/login');
	return { tasks: await db('SELECT * FROM tasks WHERE user_id=? ORDER BY task_date', [locals.user.id]) };
};

export const actions = {
	create: async ({ request, locals }) => {
		const fd = await request.formData();
		const result = await db('INSERT INTO tasks (title, worker, description, task_date, user_id) VALUES (?, ?, ?, ?, ?)', 
			[fd.get('title'), fd.get('worker'), fd.get('description'), fd.get('task_date'), locals.user.id]);
		return { success: true, id: result.insertId };
	},

	update: async ({ request, locals }) => {
		const fd = await request.formData();
		await db('UPDATE tasks SET title=?, worker=?, description=?, task_date=? WHERE id=? AND user_id=?', 
			[fd.get('title'), fd.get('worker'), fd.get('description'), fd.get('task_date'), fd.get('id'), locals.user.id]);
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const fd = await request.formData();
		await db('DELETE FROM tasks WHERE id=? AND user_id=?', [fd.get('id'), locals.user.id]);
		return { success: true };
	}
};
