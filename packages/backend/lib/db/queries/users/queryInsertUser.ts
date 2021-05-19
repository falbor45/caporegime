import { db } from '../../db';

export const queryInsertUser = async (user: {
	username: string;
	email: string;
	password: string;
	activated: boolean;
}) => {
	const queryString = `INSERT INTO USERS (username, email, password, activated) VALUES ('${
		user.username
	}', '${user.email}', '${user.password}', ${
		user.activated ? 'TRUE' : 'FALSE'
	});`;

	const response = await db.query(queryString);

	return {
		...response,
		rows: response.rows,
	};
};
