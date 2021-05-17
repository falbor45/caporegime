import db from '../../index';

export const queryGetUsers = async (
	where?: { username?: string; email?: string },
	orAnd: 'or' | 'and' = 'or',
) => {
	const queryString = `SELECT * FROM USERS${
		where
			? `WHERE ${Object.entries(where).reduce(
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

	const response = await db.query<
		{
			id: string;
			username: string;
			email: string;
			password: string;
			activated: boolean;
		},
		[]
	>(queryString);

	return {
		...response,
		rows: response.rows,
	};
};
