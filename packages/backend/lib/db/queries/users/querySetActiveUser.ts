import { db } from '../../db';

export const querySetActiveUser = async (userId: string) => {
	const queryString = `UPDATE USERS SET activated = TRUE WHERE id = '${userId}'`;

	const response = await db.query(queryString);

	return response;
};
