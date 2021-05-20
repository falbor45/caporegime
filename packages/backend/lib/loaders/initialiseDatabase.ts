import { Pool } from 'pg';

const CreateUserTable = `CREATE TABLE IF NOT EXISTS USERS (
	id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	username varchar(24),
	password varchar(255),
	email varchar(255),
	activated BOOL
);`;

const CreateActivationTokensTable = `CREATE TABLE IF NOT EXISTS ACTIVATION_TOKENS (
	id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	userId uuid
);`;

export const initialiseDatabase = async () => {
	const pool = new Pool();
	try {
		await pool.connect();
		await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

		await pool.query(CreateUserTable);
		await pool.query(CreateActivationTokensTable);

		console.log('DB initialisation done');
		await pool.end();
	} catch (err) {
		console.log(err);
		console.log('There was an error when initialising database');
		await pool.end();
	}
};
