import { db } from '../../db';

export const queryDeleteActivationToken = async (id: string) => {
	const queryString = `DELETE FROM ACTIVATION_TOKENS WHERE id = '${id}'`;

	const response = await db.query(queryString);

	return response;
};
