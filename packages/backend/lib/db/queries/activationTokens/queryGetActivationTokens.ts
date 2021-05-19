import { db } from '../../db';

export const queryGetActivationTokens = async (
	where?: { id?: string; userId?: string },
	orAnd: 'or' | 'and' = 'or',
) => {
	const queryString = `SELECT * FROM ACTIVATION_TOKENS${
		where
			? ` WHERE ${Object.entries(where).reduce(
					(whereString, entry, index, arr) => {
						let str = '';

						str += `${entry[0]} = '${entry[1]}'`;

						if (arr[index + 1]) {
							str += ` ${orAnd} `;
						}

						return whereString + str;
					},
					'',
			  )}`
			: ''
	};`;

	const response = await db.query<{
		id: string;
		userid: string;
	}>(queryString);

	return {
		...response,
		rows: response.rows.map(row => ({
			id: row.id,
			userId: row.userid,
		})),
	};
};
