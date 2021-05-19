import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool();

export const db = {
	query: async <R extends QueryResultRow = unknown[]>(
		queryText: string,
	): Promise<QueryResult<R>> => {
		return pool.query(queryText);
	},
};
