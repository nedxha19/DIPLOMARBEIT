import { createConnection } from './mysql';

export const db = async (sql, params = []) => {
	const conn = await createConnection();
	try {
		const [result] = await conn.execute(sql, params);
		return result;
	} finally {
		conn.release();
	}
};

