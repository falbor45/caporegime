import { db } from '../../db';

export const queryInsertActivationToken = async (userId: string) => {
	const queryString = `INSERT INTO ACTIVATION_TOKENS (userId) VALUES ('${userId}');`;

	const response = await db.query(queryString);

	return {
		...response,
		rows: response.rows,
	};
};
