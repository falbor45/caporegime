import { Pool, QueryConfig, QueryResultRow } from "pg";

const pool = new Pool();

export default {
	...pool,
	query: <R extends QueryResultRow, I extends unknown[]>(
		queryTextOrConfig: string | QueryConfig<I>,
		values?: I
	) => {
		return pool.query(queryTextOrConfig, values);
	},
};